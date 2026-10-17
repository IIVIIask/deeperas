import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { projectMemory } from '../plugins/deeperas/skills/deeperas/scripts/project-memory.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, 'plugins/deeperas/skills/deeperas/scripts/project-memory.mjs');
const provenance = (kind = 'user', reference = 'User confirmed this fixture value') => [{ kind, reference, observedAt: '2026-01-01T00:00:00Z' }];
const entry = (value, overrides = {}) => ({ kind: 'fact', value, state: 'confirmed', provenance: provenance(), dependsOn: [], ...overrides });
const file = (project) => path.join(project, '.deeperas/memory.json');
const read = (project) => projectMemory(project, { action: 'read' });
function fixture(t, git = false) {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'deeperas-memory-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(project)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(project).startsWith('deeperas-memory-'));
    fs.rmSync(project, { recursive: true, force: true });
  });
  if (git) childProcess.execFileSync('git', ['init', '--quiet', project]);
  return project;
}
function put(project, id, value, overrides = {}) {
  const current = read(project);
  assert.equal(current.status, 'enabled', current.reason);
  return projectMemory(project, { action: 'put', expectedRevision: current.revision, id, entry: entry(value, overrides) });
}

test('fileless mode disables persistence without requiring or touching a project', (t) => {
  const project = fixture(t);
  assert.equal(projectMemory(project, { action: 'disable' }).status, 'disabled');
  assert.equal(projectMemory(undefined, { action: 'disable' }).status, 'disabled');
  assert.deepEqual(fs.readdirSync(project), []);
});

test('non-Git memory survives a new process with exact values and provenance', (t) => {
  const project = fixture(t);
  assert.equal(put(project, 'scope', { entity: 'orders', filter: 'current', format: 'CSV' }).status, 'enabled');
  const result = childProcess.spawnSync(process.execPath, [script, '--project', project], { input: '{"action":"read"}', encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  const recovered = JSON.parse(result.stdout);
  assert.equal(recovered.record.project, fs.realpathSync(project));
  assert.deepEqual(recovered.record.entries.scope.value, { entity: 'orders', filter: 'current', format: 'CSV' });
  assert.deepEqual(recovered.record.entries.scope.provenance, provenance());
  assert.deepEqual(fs.readdirSync(path.join(project, '.deeperas')), ['memory.json']);
});

test('correcting an input invalidates the whole dependent chain, preserves unrelated decisions, and allows verified recomputation', (t) => {
  const project = fixture(t);
  put(project, 'invitations', 800);
  put(project, 'rate', 0.30);
  put(project, 'target', 240, { kind: 'result', provenance: provenance('calculation', 'ceil(invitations * rate)'), dependsOn: ['invitations', 'rate'] });
  const report = path.join(project, 'report.md');
  fs.writeFileSync(report, 'Target: 240 participants\n');
  const reportOrigin = () => [{ ...provenance('tool', 'Read and inspected report.md')[0],
    file: { path: 'report.md', sha256: crypto.createHash('sha256').update(fs.readFileSync(report)).digest('hex') } }];
  put(project, 'report', { target: 240, unit: 'participants' }, { kind: 'result', provenance: reportOrigin(), dependsOn: ['target'] });
  put(project, 'format', 'CSV', { kind: 'decision' });
  const before = read(project).record.entries;
  const correction = put(project, 'invitations', 500, { provenance: provenance('user', 'User corrected invitations to 500') });
  assert.equal(correction.status, 'enabled', correction.reason);
  assert.deepEqual(new Set(correction.affected), new Set(['invitations', 'target', 'report']));
  assert.equal(correction.record.entries.target.state, 'stale');
  assert.equal(correction.record.entries.report.state, 'stale');
  assert.equal(correction.record.entries.target.value, 240, 'Invalidation must not invent a replacement');
  assert.equal(fs.readFileSync(report, 'utf8'), 'Target: 240 participants\n', 'Invalidation does not authorize artifact editing');
  assert.deepEqual(correction.record.entries.format, before.format);
  assert.equal(projectMemory(project, { action: 'check', ids: ['report'] }).status, 'blocked');
  const inputs = read(project).record.entries;
  const target = Math.ceil(inputs.invitations.value * inputs.rate.value);
  assert.equal(target, 150);
  assert.equal(put(project, 'target', target, { kind: 'result', provenance: provenance('calculation', 'ceil(invitations * rate)'), dependsOn: ['invitations', 'rate'] }).status, 'enabled');
  fs.writeFileSync(report, `Target: ${target} participants\n`);
  assert.equal(fs.readFileSync(report, 'utf8'), 'Target: 150 participants\n');
  assert.equal(put(project, 'report', { target, unit: 'participants' }, { kind: 'result', provenance: reportOrigin(), dependsOn: ['target'] }).status, 'enabled');
  assert.equal(projectMemory(project, { action: 'check', ids: ['invitations', 'rate', 'target', 'report', 'format'] }).status, 'enabled');
});

test('unknown, conflicted, stale and missing inputs block readiness and dependent confirmation', (t) => {
  const project = fixture(t);
  for (const state of ['unknown', 'conflicted', 'stale']) {
    assert.equal(put(project, state, null, { state, provenance: [] }).status, 'enabled');
    assert.equal(projectMemory(project, { action: 'check', ids: [state] }).status, 'blocked');
    assert.equal(put(project, `result-${state}`, 'unsupported', { kind: 'result', dependsOn: [state] }).status, 'error');
  }
  assert.deepEqual(projectMemory(project, { action: 'check', ids: ['absent'] }).blocked, ['absent']);
});

test('provenance, accepted decisions and calculation inputs are enforced without changing valid memory', (t) => {
  const project = fixture(t);
  put(project, 'valid', true);
  const previous = fs.readFileSync(file(project), 'utf8');
  for (const overrides of [
    { provenance: [] },
    { provenance: [{ kind: 'source', reference: '', observedAt: '2026-01-01T00:00:00Z' }] },
    { provenance: [{ kind: 'source', reference: 'Document', observedAt: 'tomorrow' }] },
    { provenance: [{ kind: 'source', reference: 'Document', observedAt: '2026-02-31T00:00:00Z' }] },
    { provenance: [{ kind: 'source', reference: 'Document', observedAt: '2999-01-01T00:00:00Z' }] },
    { kind: 'decision', provenance: provenance('source', 'Assistant recommendation') },
    { provenance: provenance('calculation') },
    { dependsOn: ['missing'] },
    { dependsOn: ['valid', 'valid'] },
  ]) {
    const result = projectMemory(project, { action: 'put', expectedRevision: 1, id: 'bad', entry: entry(1, overrides) });
    assert.equal(result.status, 'error', result.reason);
    assert.equal(fs.readFileSync(file(project), 'utf8'), previous);
  }
});

test('repeating an unchanged fact does not invalidate current dependents', (t) => {
  const project = fixture(t);
  put(project, 'source', 1);
  put(project, 'result', 2, { kind: 'result', dependsOn: ['source'] });
  const before = read(project);
  const unchanged = put(project, 'source', 1);
  assert.equal(unchanged.revision, before.revision);
  assert.deepEqual(unchanged.affected, []);
  assert.equal(unchanged.record.entries.result.state, 'confirmed');
});

test('cycles, unsafe IDs and stale writers are rejected without overwriting newer state', (t) => {
  const project = fixture(t);
  put(project, 'parent', 1);
  put(project, 'child', 2, { dependsOn: ['parent'] });
  const current = read(project);
  for (const [id, dependsOn] of [['parent', ['child']], ['child', ['child']], ['__proto__', []], ['../escape', []]]) {
    assert.equal(projectMemory(project, { action: 'put', expectedRevision: current.revision, id, entry: entry(3, { dependsOn }) }).status, 'error');
  }
  assert.equal(projectMemory(project, { action: 'put', expectedRevision: 0, id: 'parent', entry: entry(3) }).status, 'error');
  assert.deepEqual(read(project).record, current.record);
});

test('evidence expiry invalidates dependents and reads do not renew its deadline', (t) => {
  const project = fixture(t);
  const expires = new Date(Date.now() + 60000).toISOString();
  put(project, 'source', 'available', { provenance: provenance('source', 'Inspected exact product page'), validUntil: expires });
  put(project, 'recommendation', 'candidate', { kind: 'result', dependsOn: ['source'] });
  t.mock.method(Date, 'now', () => Date.parse(expires) + 1);
  const expired = read(project);
  assert.equal(expired.record.entries.source.state, 'stale');
  assert.equal(expired.record.entries.recommendation.state, 'stale');
  assert.deepEqual(new Set(expired.affected), new Set(['source', 'recommendation']));
  assert.equal(expired.record.entries.source.validUntil, expires);
  assert.equal(projectMemory(project, { action: 'check', ids: ['recommendation'] }).status, 'blocked');
  assert.equal(read(project).revision, expired.revision);
});

test('corrupt memory, project mismatch and unsupported schemas disable persistence and preserve files', (t) => {
  const project = fixture(t);
  read(project);
  const valid = fs.readFileSync(file(project), 'utf8');
  for (const damaged of ['not json', JSON.stringify({ ...JSON.parse(valid), project: 'another-project' }), JSON.stringify({ ...JSON.parse(valid), schemaVersion: 99 })]) {
    fs.writeFileSync(file(project), damaged);
    assert.equal(read(project).status, 'disabled');
    assert.equal(fs.readFileSync(file(project), 'utf8'), damaged);
  }
});

test('local evidence hashes reject false provenance and invalidate conclusions after a real source edit', (t) => {
  const project = fixture(t);
  const source = path.join(project, 'requirements.txt');
  fs.writeFileSync(source, 'Current invitations: 800');
  const digest = () => crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
  const evidence = [{ ...provenance('source', 'Inspected requirements.txt')[0], file: { path: 'requirements.txt', sha256: digest() } }];
  assert.equal(put(project, 'invitations', 800, { provenance: evidence }).status, 'enabled');
  put(project, 'target', 240, { kind: 'result', provenance: provenance('calculation', '30% of invitations'), dependsOn: ['invitations'] });
  fs.writeFileSync(source, 'Current invitations: 500');
  const changed = read(project);
  assert.deepEqual(changed.changedSources, ['invitations']);
  assert.deepEqual(new Set(changed.affected), new Set(['invitations', 'target']));
  assert.equal(changed.record.entries.invitations.state, 'stale');
  assert.equal(changed.record.entries.target.state, 'stale');
  assert.equal(put(project, 'invitations', 500, { provenance: evidence }).status, 'error');
  evidence[0].file.sha256 = digest();
  assert.equal(put(project, 'invitations', 500, { provenance: evidence }).status, 'enabled');
  assert.equal(projectMemory(project, { action: 'check', ids: ['target'] }).status, 'blocked');
  fs.unlinkSync(source);
  assert.equal(read(project).record.entries.invitations.state, 'stale');
});

test('source provenance cannot read files outside the identified project', (t) => {
  const project = fixture(t);
  const external = fixture(t);
  const source = path.join(external, 'external.txt');
  fs.writeFileSync(source, 'outside');
  const evidence = [{ ...provenance('source')[0], file: { path: source, sha256: crypto.createHash('sha256').update('outside').digest('hex') } }];
  assert.equal(put(project, 'external', 'outside', { provenance: evidence }).status, 'error');
  assert.deepEqual(read(project).record.entries, {});
});

test('a failed replacement disables memory and leaves the old record intact', (t) => {
  const project = fixture(t);
  put(project, 'value', 1);
  const previous = fs.readFileSync(file(project), 'utf8');
  t.mock.method(fs, 'renameSync', () => { throw Object.assign(new Error('Read-only filesystem'), { code: 'EROFS' }); });
  assert.equal(read(project).status, 'disabled');
  assert.equal(fs.readFileSync(file(project), 'utf8'), previous);
  assert.deepEqual(fs.readdirSync(path.join(project, '.deeperas')), ['memory.json']);
});

test('an existing lock disables writes without deleting it or changing memory', (t) => {
  const project = fixture(t);
  read(project);
  const lock = path.join(project, '.deeperas/memory.lock');
  fs.writeFileSync(lock, 'another writer');
  const previous = fs.readFileSync(file(project), 'utf8');
  assert.equal(read(project).status, 'disabled');
  assert.equal(fs.readFileSync(lock, 'utf8'), 'another writer');
  assert.equal(fs.readFileSync(file(project), 'utf8'), previous);
});

test('Git privacy uses only local info/exclude, preserves content, and keeps all memory files untracked', (t) => {
  const project = fixture(t, true);
  const exclude = path.join(project, '.git/info/exclude');
  fs.appendFileSync(exclude, '# existing private rules\n/private.txt\n');
  const previous = fs.readFileSync(exclude, 'utf8');
  assert.equal(put(project, 'fact', 42).status, 'enabled');
  assert.ok(fs.readFileSync(exclude, 'utf8').startsWith(previous));
  assert.ok(fs.readFileSync(exclude, 'utf8').includes('/.deeperas/'));
  assert.equal(fs.existsSync(path.join(project, '.gitignore')), false);
  const ignored = childProcess.execFileSync('git', ['-C', project, 'check-ignore', '-v', '--', '.deeperas/memory.json'], { encoding: 'utf8' });
  assert.match(ignored, /info\/exclude/);
  assert.equal(childProcess.execFileSync('git', ['-C', project, 'ls-files', '--', '.deeperas'], { encoding: 'utf8' }).trim(), '');
});

test('tracked memory disables persistence without untracking or overwriting it', (t) => {
  const project = fixture(t, true);
  assert.equal(read(project).status, 'enabled');
  childProcess.execFileSync('git', ['-C', project, 'add', '-f', '.deeperas/memory.json']);
  const previous = fs.readFileSync(file(project), 'utf8');
  assert.equal(read(project).status, 'disabled');
  assert.equal(fs.readFileSync(file(project), 'utf8'), previous);
  assert.match(childProcess.execFileSync('git', ['-C', project, 'ls-files'], { encoding: 'utf8' }), /memory.json/);
});

test('subprojects with spaces and ignore metacharacters receive a literal private exclusion', (t) => {
  const repo = fixture(t, true);
  const project = path.join(repo, 'project [draft]');
  fs.mkdirSync(project);
  const result = put(project, 'fact', 'scoped');
  assert.equal(result.status, 'enabled', result.reason);
  assert.equal(result.record.project, fs.realpathSync(project));
  assert.equal(childProcess.execFileSync('git', ['-C', repo, 'ls-files', '--', 'project [draft]/.deeperas'], { encoding: 'utf8' }), '');
});

test('managed Git worktrees resolve their private exclusion through Git metadata', (t) => {
  const repo = fixture(t, true);
  const worktree = fixture(t);
  childProcess.execFileSync('git', ['-C', repo, '-c', 'user.name=Memory fixture', '-c', 'user.email=fixture@example.invalid',
    '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=' + path.join(repo, '.git/hooks'), 'commit', '--quiet', '--allow-empty', '-m', 'memory fixture']);
  childProcess.execFileSync('git', ['-C', repo, '-c', 'core.hooksPath=' + path.join(repo, '.git/hooks'), 'worktree', 'add', '--quiet', '--detach', worktree]);
  const result = put(worktree, 'fact', 'worktree-scoped');
  assert.equal(result.status, 'enabled', result.reason);
  assert.equal(result.record.project, fs.realpathSync(worktree));
  assert.ok(fs.readFileSync(path.join(repo, '.git/info/exclude'), 'utf8').includes('/.deeperas/'));
});

test('a memory-directory junction cannot redirect writes outside the project', (t) => {
  const project = fixture(t);
  const other = fixture(t);
  fs.symlinkSync(other, path.join(project, '.deeperas'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(read(project).status, 'disabled');
  assert.deepEqual(fs.readdirSync(other), []);
});

test('Git access failures do not get treated as non-Git projects', (t) => {
  const project = fixture(t);
  t.mock.method(childProcess, 'spawnSync', () => ({ status: 128, stdout: '', stderr: 'fatal: permission denied' }));
  assert.equal(read(project).status, 'disabled');
  assert.deepEqual(fs.readdirSync(project), []);
});

test('failed private exclusion verification disables memory without a shared ignore workaround', (t) => {
  const project = fixture(t, true);
  const spawn = childProcess.spawnSync;
  t.mock.method(childProcess, 'spawnSync', (program, args, options) => args.includes('check-ignore')
    ? { status: 1, stdout: '', stderr: '' } : spawn(program, args, options));
  assert.equal(read(project).status, 'disabled');
  assert.equal(fs.existsSync(file(project)), false);
  assert.equal(fs.existsSync(path.join(project, '.gitignore')), false);
});

test('existing prose decisions remain untouched and are not automatically imported', (t) => {
  const project = fixture(t);
  const legacy = path.join(project, 'Deeperas_Decisions.txt');
  fs.writeFileSync(legacy, 'Confirmed: CSV. This old record is context, not new authorization.');
  assert.deepEqual(read(project).record.entries, {});
  assert.equal(fs.readFileSync(legacy, 'utf8'), 'Confirmed: CSV. This old record is context, not new authorization.');
});

test('CLI rejects malformed JSON without creating memory', (t) => {
  const project = fixture(t);
  const result = childProcess.spawnSync(process.execPath, [script, '--project', project], { input: '{bad', encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).status, 'error');
  assert.deepEqual(fs.readdirSync(project), []);
});

test('R42 core survives apart from memory integration, prior approved changes, R54 memory-reference routing, R55 factual fidelity, R56 planning/decision support, R57 artifact-reference routing, R58 domain-reference routing, R59 optional menus, R60 current-status time and R61 bounded factual alternatives', () => {
  const actual = fs.readFileSync(path.join(root, 'plugins/deeperas/skills/deeperas/SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
  const boundedFacts = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r61-bounded-facts-approved.json'), 'utf8'));
  let restoredBoundedFacts = actual;
  for (const delta of boundedFacts) {
    assert.equal(restoredBoundedFacts.split(delta.after).length, 2, 'Each approved R61 delta must occur exactly once');
    restoredBoundedFacts = restoredBoundedFacts.replace(delta.after, delta.before);
  }
  const currentStatus = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r60-current-status-approved.json'), 'utf8'));
  assert.equal(restoredBoundedFacts.split(currentStatus[0].after).length, 2, 'The approved R60 core delta must occur exactly once');
  const restoredCurrentStatus = restoredBoundedFacts.replace(currentStatus[0].after, currentStatus[0].before);
  const domainText = fs.readFileSync(path.join(root, 'plugins/deeperas', currentStatus[1].path), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(domainText.split(currentStatus[1].after).length, 2, 'The approved R60 domain alignment must occur exactly once');
  const restoredDomainTime = domainText.replace(currentStatus[1].after, currentStatus[1].before);
  const questionFormat = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r59-question-format-approved.json'), 'utf8'));
  let restoredQuestionFormat = restoredCurrentStatus;
  for (const delta of questionFormat.core) {
    assert.equal(restoredQuestionFormat.split(delta.after).length, 2, 'Each approved R59 delta must occur exactly once');
    restoredQuestionFormat = restoredQuestionFormat.replace(delta.after, delta.before);
  }
  const domainRouting = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r58-domain-routing-approved.json'), 'utf8'));
  assert.equal(restoredQuestionFormat.split(domainRouting.after).length, 2, 'The approved R58 routing delta must occur exactly once');
  const restoredDomainRouting = restoredQuestionFormat.replace(domainRouting.after, domainRouting.before);
  const artifactRouting = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r57-artifact-routing-approved.json'), 'utf8'));
  assert.equal(restoredDomainRouting.split(artifactRouting.core.after).length, 2, 'The approved R57 routing delta must occur exactly once');
  const restoredArtifactRouting = restoredDomainRouting.replace(artifactRouting.core.after, artifactRouting.core.before);
  assert.equal(fs.readFileSync(path.join(root, 'plugins/deeperas', artifactRouting.reference.path), 'utf8').replace(/\r\n/g, '\n'), artifactRouting.reference.after);
  const decisionSupport = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r56-decision-support-approved.json'), 'utf8'));
  let restoredDecisionSupport = restoredArtifactRouting;
  for (const delta of decisionSupport) {
    assert.equal(restoredDecisionSupport.split(delta.after).length, 2, 'Each approved R56 delta must occur exactly once');
    restoredDecisionSupport = restoredDecisionSupport.replace(delta.after, delta.before);
  }
  const fidelity = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r55-fidelity-approved.json'), 'utf8'));
  assert.equal(restoredDecisionSupport.split(fidelity.after).length, 2, 'The approved fidelity block must occur exactly once');
  const restoredFidelity = restoredDecisionSupport.replace(fidelity.after, fidelity.before);
  const routing = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r54-memory-routing-approved.json'), 'utf8'));
  assert.equal(restoredFidelity.split(routing.after).length, 2, 'The approved routing block must occur exactly once');
  const current = restoredFidelity.replace(routing.after, routing.before);
  const baseline = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-r42-core.txt'), 'utf8').replace(/\r\n/g, '\n');
  const approvedRule1 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule1-approved.txt'), 'utf8').trim();
  const approvedRule2 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule2-approved.txt'), 'utf8').trim();
  const approvedRule3 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule3-approved.txt'), 'utf8').trim();
  const approvedRule5 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule5-approved.txt'), 'utf8').trim();
  const approvedRule6 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule6-approved.txt'), 'utf8').trim();
  const approvedRule7 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule7-approved.txt'), 'utf8').trim();
  const approvedRule8 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule8-approved.txt'), 'utf8').trim();
  assert.equal(restoredDomainTime.split('\n')[1], approvedRule8);
  const approvedRule9 = fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule9-approved.txt'), 'utf8').trim();
  assert.equal(fs.readFileSync(path.join(root, 'plugins/deeperas/skills/deeperas/references/idea-to-plan.txt'), 'utf8').split(/\r?\n/)[4], approvedRule9);
  const approvedRule10 = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule10-approved.json'), 'utf8'));
  const approvedRule11 = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/deeperas-rule11-approved.json'), 'utf8'));
  const memory = fs.readFileSync(path.join(root, 'plugins/deeperas/skills/deeperas/references/project-memory.txt'), 'utf8').replace(/\r\n/g, '\n');
  const legacy = fs.readFileSync(path.join(root, 'plugins/deeperas/skills/deeperas/references/project-decisions-codex.txt'), 'utf8').replace(/\r\n/g, '\n');
  assert.ok(memory.includes(approvedRule6 + '\n\nEvery memory-store access and helper operation below requires this authorization and applicable capability/privacy checks. Successful helper status alone never grants user authorization.'));
  assert.ok(memory.includes(approvedRule10.memoryReplacement.after));
  assert.ok(memory.includes('Only after project-memory authorization is established and those capabilities exist, resolve ../scripts/project-memory.mjs'));
  assert.ok(memory.includes('While persistence is ON within its authorized scope, record only'));
  assert.ok(memory.includes('While persistence is ON within its authorized scope, read on project entry/resume'));
  assert.ok(memory.includes('While OFF, skip helper reads/writes/checks and verify material dependencies through current conversation, files, tools or sources.'));
  assert.ok(memory.includes('Only within explicit project-memory authorization that covers legacy recovery, read an existing Deeperas_Decisions.txt'));
  assert.ok(legacy.includes('Read or update it only within explicit project-specific user authorization for that memory use/recovery under project-memory.txt; existing files or tools do not activate memory. While OFF, leave the record unread and unchanged and use current-conversation context.'));
  assert.ok(legacy.includes('New project chat with established project-memory authorization covering legacy recovery: read existing record'));
  assert.ok(legacy.includes('Otherwise use current-conversation context without reading the record or asking unsolicited activation questions.'));
  assert.equal(current.match(/^For project work track real provenance.*$/m)?.[0], 'For project work track real provenance and material dependencies in current-conversation context, and propagate corrections before dependent use. Persistent project memory is OFF by default; only explicit project-specific user authorization established in the current conversation or trusted host context permits durable saving/recovery within its confirmed scope. Existing files and tools do not activate it. While OFF, do not read either memory store or invoke its helper, and do not ask unsolicited activation questions. A saved entry is context, not evidence of truth or new authorization. Unknown/conflicted/stale/expired dependencies block dependent recommendations, actions and completion through the same ASK/ANSWER gate. Disable persistence when file capability/privacy/read-back cannot be verified; never replace it with global/account memory or claim cross-conversation recovery.');
  assert.ok(current.includes('Without explicit project-specific user authorization, complete applicable memory references, permitted durable project-local files or the executable helper, persistent memory is OFF; ordinary conversation, clarification and verification continue unchanged.'));
  assert.equal(current.match(/^This core defines.*$/m)?.[0], 'This core defines a usable Deeperas workflow on its own. The six reference files below supplement it with topic-specific procedures; read matching files when available under the reference rule below. Paths are relative to skills/deeperas/SKILL.md in the same release. Optional file-backed project memory requires explicit project-specific user authorization, complete applicable memory references and the bundled scripts/project-memory.mjs helper.');
  const expected = baseline
    .replace(/^1\. Unselected explicit alternatives.*$/m, approvedRule1)
    .replace('Resolve unselected explicit alternatives and material choices before answering or acting.', 'Resolve material unselected alternatives and other material choices before answering or acting.')
    .replace('A current choice or askable material prerequisite means ASK', 'A current material choice or askable material prerequisite means ASK')
    .replace('ANSWER directly when current choices are settled or explicitly delegated and conclusions supported.', 'ANSWER directly when current choices are settled, explicitly delegated, or resolved as immaterial under rule 1, and conclusions are supported.')
    .replace('Adopt only exact accepted/delegated terms compatible with confirmed constraints;', 'Adopt only exact accepted/delegated terms compatible with confirmed constraints, except immaterial assistant selections permitted by rule 1;');
  const expectedWithAdvice = expected
    .replace('Resolve material unselected alternatives and other material choices before answering or acting.', 'Resolve material unselected alternatives and other material choices before dependent output or action; supported advice-only requests need no prior method acceptance.')
    .replace('Ask one contextual question with explained options; answer settled or explicitly delegated requests directly.', 'Ask one contextual question with explained options when material prerequisites are missing; answer settled, explicitly delegated, and supported advice-only requests directly.')
    .replace('Settled or explicitly delegated requests still receive a direct answer.', 'Settled or explicitly delegated requests and supported advice-only requests still receive a direct answer.')
    .replace('\n0. Resolve material risk/constraint priority', '\nSupported advice-only requests may use ANSWER without accepting a proposed method; apply the recommendation rule below. Unresolved choices needed for execution remain open; unresolved facts or priorities needed for the advice still require ASK.\n0. Resolve material risk/constraint priority')
    .replace('ANSWER directly when current choices are settled, explicitly delegated, or resolved as immaterial under rule 1, and conclusions are supported.', 'ANSWER directly when conclusions are supported and current choices are settled, explicitly delegated, resolved as immaterial under rule 1, or the request is advice-only with its material prerequisites established.')
    .replace(/^Advice\/recommendation requests.*$/m, approvedRule2);
  const expectedWithPlanning = expectedWithAdvice.replace('Vague creation/organization idea: first ASK only whether to start planning; explicit planning requests supply consent. A no stops the interview; honor alternative deliverables. Consent authorizes the interview, not governing choices, amendments or missing prerequisites.', approvedRule3);
  const expectedWithExplanations = expectedWithPlanning
    .replace('Ask one contextual question with explained options when material prerequisites are missing;', 'Ask one contextual question on one decision axis when material prerequisites are missing; explain options as needed and restate the pending question after an explanation;')
    .replace(/^Apply the shared ASK\/ANSWER gate.*$/m, "Apply the shared ASK/ANSWER gate below before research or the first visible response. When a material prerequisite for the requested result or action remains open, use the ASK contract below. Relevant explanations, examples or small diagrams may accompany its single question; they must not select unresolved alternatives or give dependent recommendations or execution steps. A request to explain an option or clarification may receive a direct explanation while its pending decision and prerequisites remain open; when a selection remains pending and questions are active, briefly restate its question after the explanation under the ASK contract. Settled or explicitly delegated requests and supported advice-only requests still receive a direct answer.")
    .replace(/^ASK contains one explicit question.*$/m, "ASK contains one explicit question on one decision axis, with relevant explained choices and applicable controls/notices. Relevant explanations, examples or small diagrams may accompany the question when they help the user understand the decision or why information is needed. When an explanation is included, briefly restate the pending selection question after it, as the response's only clarification question. Keep the pending decision explicit and do not introduce another clarification question, select unresolved material alternatives, or give dependent recommendations or execution steps before their prerequisites are resolved. Use confirmed context/upstream priority; genuinely ambiguous domain/entity precedes dependent time/status. Options cover only the current decision, including removal without replacement when material; leave other choices pending. Pause unresolved-task execution.")
    .replace('Plain text, blank lines between question/options, A, B, C...;', 'Use readable text and blank lines between question/options; small diagrams may support explanations. Label options A, B, C...;')
    .replace('Explanation requests retain the selection question and ALL options; expand only requested descriptions to at most two short sentences each.', approvedRule5);
  const expectedWithReferences = expectedWithExplanations
    .replace(/^REQUIRED READS - BEFORE APPLICABLE WORK\nRead every matching reference.*\n/m, approvedRule7 + '\n');
  let expectedWithControls = expectedWithReferences;
  for (const { before, after } of approvedRule10.coreReplacements) {
    assert.ok(expectedWithControls.includes(before), 'Approved control change must match the preceding core');
    expectedWithControls = expectedWithControls.replace(before, after);
  }
  let expectedWithRechecks = expectedWithControls;
  for (const { before, after } of approvedRule11) {
    assert.equal(expectedWithRechecks.split(before).length, 2, 'Each approved recheck change must match once');
    expectedWithRechecks = expectedWithRechecks.replace(before, after);
  }
  const withoutMemory = current.replace(/^Deeperas Precision - Plugin R\d+$/m, 'Deeperas Precision - Plugin R42')
    .replace(/^This core defines.*$/m, baseline.match(/^Packaged core, not standalone:.*$/m)[0])
    .replace(/^- Project context, provenance\/dependencies, corrections, resuming or persistent memory in any host:.*\n/m, '')
    .replace(/^For project work track real provenance.*\n/m, '');
  assert.equal(withoutMemory, expectedWithRechecks);
  assert.equal(fs.readFileSync(path.join(root, 'plugins/deeperas/skills/deeperas/references/idea-to-plan.txt'), 'utf8').split(/\r?\n/)[1], 'After a clear request for help or confirmed discussion consent, settle goal/critical constraints first, then resolve later decisions just before dependent work needs them; no upfront checklist or premature technology choice.');
});
