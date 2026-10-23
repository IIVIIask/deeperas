import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const digest = relative => createHash('sha256').update(read(relative).replace(/\r\n/g, '\n')).digest('hex');
const fixture = JSON.parse(read('tests/fixtures/deeperas-r65-rules.json'));
const r66 = JSON.parse(read('tests/fixtures/deeperas-r66-clarification-approved.json'));
const r67 = JSON.parse(read('tests/fixtures/deeperas-r67-quality-approved.json'));
const r65Core = 'tests/fixtures/deeperas-r65-core.txt';
const r66Core = 'tests/fixtures/deeperas-r66-core.txt';
const skill = 'plugins/deeperas/skills/deeperas';
const header = /^---\n[\s\S]*?\n---\n\n/;

test('rule records have unique stable IDs, conditions and no dangling rule references', () => {
  const core = read(`${skill}/SKILL.md`);
  const records = [...core.matchAll(/^### (R\d{3}) \| ([^\n]+)\n([\s\S]*?)(?=^### R\d{3} \| |$(?![\s\S]))/gm)];
  assert.deepEqual(records.map(r => r[1]), fixture.rule_ids);
  assert.equal(new Set(fixture.rule_ids).size, fixture.rule_ids.length);
  for (const record of records) {
    assert.ok(record[2].trim() && record[3].startsWith('WHEN ') && record[3].includes(' -> '), `Missing rule contract: ${record[1]}`);
  }
  for (const reference of core.matchAll(/\bR\d{3}\b/g)) {
    assert.ok(fixture.rule_ids.includes(reference[0]), `Dangling rule: ${reference[0]}`);
  }
});

test('rule conversion preserves discovery and specialized text across checkout line endings', () => {
  const baseline = read('tests/fixtures/deeperas-r64-core.txt').replace(/\r\n/g, '\n');
  const r65 = read(r65Core).replace(/\r\n/g, '\n');
  const current = read(`${skill}/SKILL.md`).replace(/\r\n/g, '\n');
  assert.equal(r65.match(header)[0], baseline.match(header)[0]);
  assert.equal(current.match(header)[0], r67.header, 'Unreviewed discovery metadata change');
  assert.equal(digest('tests/fixtures/deeperas-r64-core.txt'), fixture.baseline_sha256);
  for (const [relative, expected] of Object.entries(fixture.unchanged_supporting_files)) {
    assert.equal(digest(`${skill}/${relative}`), expected, `Unreviewed supporting-file change: ${relative}`);
  }
});

test('frozen behavioral suite keeps all continuation cases and isolates supplied files', () => {
  const file = 'tests/fixtures/deeperas-r65-rules-cases.json';
  assert.equal(digest(file), fixture.model_suite_sha256);
  const cases = JSON.parse(read(file)).cases;
  const allCases = [...cases, ...JSON.parse(read('tests/fixtures/deeperas-device-choice-cases.json')).cases];
  assert.equal(new Set(allCases.map(c => c.id)).size, allCases.length);
  for (const original of JSON.parse(read('tests/fixtures/deeperas-r64-continuation-cases.json')).cases) {
    assert.deepEqual(cases.find(c => c.id === original.id), original);
  }
  for (const item of allCases) {
    assert.ok(item.turns.length && item.turns.length === item.expected.length);
    for (const filename of Object.keys(item.files ?? {})) {
      assert.ok(!path.isAbsolute(filename) && !filename.split(/[\\/]/).includes('..'), `Unsafe fixture path: ${filename}`);
    }
  }
});

test('R65 response fix preserves every other approved R65 rule', () => {
  const file = 'tests/fixtures/deeperas-r65-before-response-fix.txt';
  assert.equal(digest(file), fixture.response_patch_baseline_sha256);
  assert.equal(digest(r65Core), r66.r65_core_sha256);
  const original = read(file);
  const current = read(r65Core);
  const omitResponseRule = text => text
    .replace(/^### R031 \| Answer now\n[\s\S]*?(?=^### R032 \|)/m, '')
    .replace(/^### R038 \| Visible response\n[\s\S]*?(?=\n## Planning, execution)/m, '');
  assert.notEqual(current, original);
  assert.equal(omitResponseRule(current), omitResponseRule(original));
});

// Only the approved rules may differ; the text outside the rules may change only in the header and revision marker.
function assertApprovedRuleChanges(beforeFile, afterFile, changed, from, to) {
  const normalize = text => text.replace(/\r\n/g, '\n');
  const record = /^### (R\d{3}) \| [^\n]+\n[\s\S]*?(?=^### R\d{3} \| |^## |$(?![\s\S]))/gm;
  const rules = text => Object.fromEntries([...text.matchAll(record)].map(m => [m[1], m[0]]));
  const beforeText = normalize(read(beforeFile)), afterText = normalize(read(afterFile));
  const before = rules(beforeText), after = rules(afterText);
  assert.deepEqual(Object.keys(after), Object.keys(before));
  for (const id of Object.keys(before)) {
    if (changed.includes(id)) assert.notEqual(after[id], before[id], `${id} was approved as changed`);
    else assert.equal(after[id], before[id], `Unreviewed rule change: ${id}`);
  }
  const frame = text => text.replace(header, '').replace(record, '')
    .replace(`Deeperas Precision - Plugin ${from}`, `Deeperas Precision - Plugin ${to}`);
  assert.equal(frame(afterText), frame(beforeText), 'Unreviewed change outside the approved rules');
}

test('R66 changes only the clarification rules, discovery text and revision marker', () => {
  assert.equal(digest(r66Core), r66.updated_sha256);
  assertApprovedRuleChanges(r65Core, r66Core, r66.changed_rules, 'R65', 'R66');
});

test('R67 changes only its approved rules and revision marker', () => {
  assert.equal(digest(r66Core), r67.r66_core_sha256);
  assert.equal(digest(`${skill}/SKILL.md`), r67.updated_sha256);
  assertApprovedRuleChanges(r66Core, `${skill}/SKILL.md`, r67.changed_rules, 'R66', 'R67');
});
