import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

test('both marketplaces resolve to matching manifests, host-neutral versions, and MIT notice', () => {
  const codex = json('.agents/plugins/marketplace.json');
  const cursor = json('.cursor-plugin/marketplace.json');
  assert.equal(codex.name, 'deeperas');
  assert.equal(cursor.plugins.length, 1);
  assert.equal(codex.plugins[0].source.path.replace(/^\.\//, ''), cursor.plugins[0].source);
  const base = cursor.plugins[0].source;
  const manifests = ['plugin.json', '.codex-plugin/plugin.json', '.cursor-plugin/plugin.json']
    .map((file) => json(`${base}/${file}`));
  for (const manifest of manifests) {
    assert.equal(manifest.name, 'deeperas');
    assert.equal(manifest.version, manifests[0].version);
    assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
      'Use one plain SemVer package version without host names, dates or instruction revisions');
  }
  for (const manifest of manifests.slice(1)) {
    assert.ok(existsSync(join(root, base, manifest.skills, 'deeperas', 'SKILL.md')));
    assert.equal(manifest.author.name, 'IIVIIask');
    assert.equal(manifest.license, 'MIT');
  }
  assert.match(read('LICENSE'), /MIT License/);
  assert.equal(read(`${base}/LICENSE`), read('LICENSE'), 'Installed plugin must retain the license notice');
  assert.match(read(`${base}/skills/deeperas/SKILL.md`), /^---\r?\nname: deeperas\r?\ndescription: /);
  const revision = read(`${base}/skills/deeperas/SKILL.md`).match(/^Deeperas Precision - Plugin R(\d+)$/m)?.[1];
  assert.ok(revision, 'The instruction revision remains separate from the package version');
  for (const document of ['README.md', 'INSTALL.md', 'docs/POWER-USERS.md']) {
    assert.ok(read(document).includes(`\`${manifests[0].version}\``), `Current version missing in ${document}`);
    assert.ok(read(document).includes(`R${revision}`), `Instruction revision missing in ${document}`);
  }
  assert.ok(manifests[1].interface.shortDescription.length <= 30);
  assert.deepEqual(manifests[0].extensions['com.openai'].interface, manifests[1].interface,
    'Portable OpenAI presentation must preserve the complete compatibility interface');
  assert.equal(manifests[1].interface.websiteURL, manifests[0].homepage);
  assert.equal(codex.plugins[0].policy.installation, 'AVAILABLE');
});

test('the single core reaches all six topic references and optional helper', () => {
  const skill = 'plugins/deeperas/skills/deeperas';
  const required = [
    'references/artifact-enforcement-recovery.txt',
    'references/constraint-conflicts.txt',
    'references/domain-checks.txt',
    'references/idea-to-plan.txt',
    'references/project-decisions-codex.txt',
    'references/project-memory.txt',
  ];
  const links = [...read(`${skill}/SKILL.md`).matchAll(/\]\((references\/[^)]+)\)/g)]
    .map((match) => match[1]).sort();
  assert.deepEqual(links, required);
  for (const file of required) assert.ok(read(`${skill}/${file}`).trim().length > 0);
  assert.ok(existsSync(join(root, skill, 'scripts/project-memory.mjs')));
});

test('active instructions, metadata and guides exclude retired single-letter controls', () => {
  const skill = 'plugins/deeperas/skills/deeperas';
  const files = ['README.md', 'INSTALL.md', 'docs/POWER-USERS.md',
    'plugins/deeperas/plugin.json', 'plugins/deeperas/.codex-plugin/plugin.json',
    'plugins/deeperas/.cursor-plugin/plugin.json', `${skill}/SKILL.md`,
    ...readdirSync(join(root, skill, 'references')).map((file) => `${skill}/references/${file}`)];
  for (const file of files) {
    assert.doesNotMatch(read(file), /(?:^|[^\p{L}\p{N}_])[XZΧΖ](?=$|[^\p{L}\p{N}_])/u,
      `Retired control remains in ${file}`);
  }
});

test('both hosts receive the square icon used by the README header', () => {
  const base = 'plugins/deeperas';
  const codex = json(`${base}/.codex-plugin/plugin.json`).interface;
  const cursor = json(`${base}/.cursor-plugin/plugin.json`);
  assert.equal(codex.logo, './assets/icon.png');
  assert.equal(codex.composerIcon, codex.logo);
  assert.equal(cursor.logo, 'assets/icon.png');
  assert.ok(readFileSync(join(root, base, codex.logo)).equals(readFileSync(join(root, base, cursor.logo))),
    'Both hosts must receive identical square icon artwork');
  assert.ok(read('README.md').includes(`${base}/assets/icon.png`));
  for (const file of ['icon.png', 'logo.png', 'logo-dark.png']) {
    const png = readFileSync(join(root, base, 'assets', file));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.ok(width >= 48 && height >= 48 && width <= 4096 && height <= 4096);
    assert.ok(png.length <= 5 * 1024 * 1024);
    assert.equal(png[25], 6, 'Transparent RGBA asset');
    if (file === 'icon.png') assert.equal(width, height);
  }
});

test('public documentation avoids unnecessary em dashes', () => {
  for (const file of ['AGENTS.md', 'README.md', 'INSTALL.md', 'CHANGELOG.md', 'docs/POWER-USERS.md']) {
    read(file).split(/\r?\n/).forEach((line, index) => {
      const reason = line.match(/<!-- em-dash-required: (.*?) -->/)?.[1];
      if (reason?.trim()) return;
      assert.doesNotMatch(line, /\u2014|&mdash;|&#(?:0*8212|x0*2014);/iu,
        `Unnecessary em dash in ${file}:${index + 1}; use ordinary punctuation or explain an exact-text requirement`);
    });
  }
});

test('R63 single core restores complete R61 rules and removes only the dispatcher reference', () => {
  const skill = 'plugins/deeperas/skills/deeperas';
  const historic = json('tests/fixtures/deeperas-r62-fast-dispatch-approved.json');
  const approved = json('tests/fixtures/deeperas-r63-single-core-approved.json');
  const continuation = json('tests/fixtures/deeperas-r64-continuation-approved.json');
  const core = read('tests/fixtures/deeperas-r64-core.txt').replace(/\r\n/g, '\n')
    .replace('Deeperas Precision - Plugin R64', 'Deeperas Precision - Plugin R63')
    .replace(`${continuation.anchor} ${continuation.addition}`, continuation.anchor);
  const header = core.match(/^---\n[\s\S]*?\n---\n\n/)[0];
  assert.equal(header, historic.baseline_header);
  const asR61 = core.replace('Deeperas Precision - Plugin R63', 'Deeperas Precision - Plugin R61');
  assert.equal(createHash('sha256').update(core).digest('hex'), approved.restored_core_sha256);
  assert.equal(createHash('sha256').update(asR61).digest('hex'), historic.restored_r61_sha256);
  assert.equal(createHash('sha256').update(asR61.slice(header.length)).digest('hex'), historic.full_workflow_sha256);
  assert.ok(!existsSync(join(root, skill, approved.removed_reference)));
  assert.equal(readdirSync(join(root, skill, 'references')).length, 6);
});

test('R64 changes only the continuation recheck and preserves the complete R63 baseline', () => {
  const approved = json('tests/fixtures/deeperas-r64-continuation-approved.json');
  const core = read('tests/fixtures/deeperas-r64-core.txt').replace(/\r\n/g, '\n');
  assert.equal(core.split(`${approved.anchor} ${approved.addition}`).length, 2);
  assert.equal(createHash('sha256').update(core).digest('hex'), approved.updated_sha256);
  const baseline = core.replace(`${approved.anchor} ${approved.addition}`, approved.anchor)
    .replace('Deeperas Precision - Plugin R64', 'Deeperas Precision - Plugin R63');
  assert.equal(createHash('sha256').update(baseline).digest('hex'), approved.baseline_sha256);
  assert.equal(approved.baseline_sha256,
    json('tests/fixtures/deeperas-r63-single-core-approved.json').restored_core_sha256);
});
