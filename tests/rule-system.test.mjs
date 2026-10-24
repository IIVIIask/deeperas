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
const r68 = JSON.parse(read('tests/fixtures/deeperas-r68-one-question-approved.json'));
const r69 = JSON.parse(read('tests/fixtures/deeperas-r69-materiality-approved.json'));
const r70 = JSON.parse(read('tests/fixtures/deeperas-r70-evidence-approved.json'));
const r71 = JSON.parse(read('tests/fixtures/deeperas-r71-dont-know-approved.json'));
const r72 = JSON.parse(read('tests/fixtures/deeperas-r72-early-answer-approved.json'));
const r73 = JSON.parse(read('tests/fixtures/deeperas-r73-follow-up-approved.json'));
const r74 = JSON.parse(read('tests/fixtures/deeperas-r74-explanation-approved.json'));
const r73Core = 'tests/fixtures/deeperas-r73-core.txt';
const r65Core = 'tests/fixtures/deeperas-r65-core.txt';
const r66Core = 'tests/fixtures/deeperas-r66-core.txt';
const r67Core = 'tests/fixtures/deeperas-r67-core.txt';
const r68Core = 'tests/fixtures/deeperas-r68-core.txt';
const r69Core = 'tests/fixtures/deeperas-r69-core.txt';
const r70Core = 'tests/fixtures/deeperas-r70-core.txt';
const r71Core = 'tests/fixtures/deeperas-r71-core.txt';
const r72Core = 'tests/fixtures/deeperas-r72-core.txt';
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
  assert.equal(current.match(header)[0], r73.header, 'Unreviewed discovery metadata change');
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
  assert.equal(digest(r67Core), r67.updated_sha256);
  assertApprovedRuleChanges(r66Core, r67Core, r67.changed_rules, 'R66', 'R67');
});

test('R68 restores one-question clarification without changing the other R67 rules', () => {
  assert.equal(digest(r67Core), r68.r67_core_sha256);
  assert.equal(digest(r68Core), r68.updated_sha256);
  assertApprovedRuleChanges(r67Core, r68Core, r68.changed_rules, 'R67', 'R68');
});

test('R69 changes only the material-gap rule and revision marker', () => {
  assert.equal(digest(r68Core), r69.r68_core_sha256);
  assert.equal(read(r69Core).replace(/\r\n/g, '\n').match(header)[0], read(r68Core).replace(/\r\n/g, '\n').match(header)[0]);
  assert.equal(digest(r69Core), r69.updated_sha256);
  assertApprovedRuleChanges(r68Core, r69Core, r69.changed_rules, 'R68', 'R69');
});

test('R70 changes only the approved evidence wording and revision marker', () => {
  assert.equal(digest(r69Core), r70.r69_core_sha256);
  assert.equal(digest(r70Core), r70.updated_sha256);
  assertApprovedRuleChanges(r69Core, r70Core, r70.changed_rules, 'R69', 'R70');
});

test('R71 changes only the approved dont-know guidance and revision marker', () => {
  assert.equal(digest(r70Core), r71.r70_core_sha256);
  assert.equal(digest(r71Core), r71.updated_sha256);
  assertApprovedRuleChanges(r70Core, r71Core, r71.changed_rules, 'R70', 'R71');
});

test('R72 changes only the early-answer display guidance and revision marker', () => {
  assert.equal(digest(r71Core), r72.r71_core_sha256);
  assert.equal(digest(r72Core), r72.updated_sha256);
  assertApprovedRuleChanges(r71Core, r72Core, r72.changed_rules, 'R71', 'R72');
});

test('R73 changes only the necessary follow-up guidance and revision marker', () => {
  assert.equal(digest(r72Core), r73.r72_core_sha256);
  assert.equal(digest(r73Core), r73.updated_sha256);
  assertApprovedRuleChanges(r72Core, r73Core, r73.changed_rules, 'R72', 'R73');
});

test('R74 changes exactly the approved explanation wording and revision marker', () => {
  const before = read(r73Core).replace(/\r\n/g, '\n');
  const current = read(`${skill}/SKILL.md`).replace(/\r\n/g, '\n');
  assert.equal(digest(r73Core), r74.r73_core_sha256);
  assert.equal(digest(`${skill}/SKILL.md`), r74.updated_sha256);
  assert.equal(before.split(r74.before).length, 2);
  assert.equal(current, before.replace(r74.before, r74.after)
    .replace('Deeperas Precision - Plugin R73', 'Deeperas Precision - Plugin R74'));
  assertApprovedRuleChanges(r73Core, `${skill}/SKILL.md`, r74.changed_rules, 'R73', 'R74');
});
