import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

test('both marketplaces resolve to R33, matching manifests, and MIT notice', () => {
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
    assert.equal(manifest.version, '0.2.32+codex.20261011r33');
  }
  for (const manifest of manifests.slice(1)) {
    assert.ok(existsSync(join(root, base, manifest.skills, 'deeperas', 'SKILL.md')));
    assert.equal(manifest.author.name, 'IIVIIask');
    assert.equal(manifest.license, 'MIT');
  }
  assert.match(read('LICENSE'), /MIT License/);
  assert.equal(read(`${base}/LICENSE`), read('LICENSE'), 'Installed plugin must retain the license notice');
  assert.match(read(`${base}/skills/deeperas/SKILL.md`), /^---\r?\nname: deeperas\r?\ndescription: /);
  assert.match(read(`${base}/skills/deeperas/SKILL.md`), /DeepEras Precision - Plugin R33/);
  assert.ok(manifests[1].interface.shortDescription.length <= 30);
  assert.equal(codex.plugins[0].policy.installation, 'AVAILABLE');
});

test('the core links to all five bundled, nonempty reference files', () => {
  const skill = 'plugins/deeperas/skills/deeperas';
  const required = [
    'references/artifact-enforcement-recovery.txt',
    'references/constraint-conflicts.txt',
    'references/domain-checks.txt',
    'references/idea-to-plan.txt',
    'references/project-decisions-codex.txt',
  ];
  const links = [...read(`${skill}/SKILL.md`).matchAll(/\]\((references\/[^)]+)\)/g)]
    .map((match) => match[1]).sort();
  assert.deepEqual(links, required);
  for (const file of required) assert.ok(read(`${skill}/${file}`).trim().length > 0);
});

test('both hosts receive the same square icon and the README includes both themes', () => {
  const base = 'plugins/deeperas';
  const codex = json(`${base}/.codex-plugin/plugin.json`).interface;
  const cursor = json(`${base}/.cursor-plugin/plugin.json`);
  assert.equal(codex.logo, './assets/icon.png');
  assert.equal(codex.composerIcon, codex.logo);
  assert.equal(cursor.logo, 'assets/icon.png');
  for (const file of ['icon.png', 'logo.png', 'logo-dark.png']) {
    const png = readFileSync(join(root, base, 'assets', file));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.ok(width >= 48 && height >= 48 && width <= 4096 && height <= 4096);
    assert.ok(png.length <= 5 * 1024 * 1024);
    assert.equal(png[25], 6, 'Transparent RGBA asset');
    if (file === 'icon.png') assert.equal(width, height);
    else assert.ok(read('README.md').includes(`${base}/assets/${file}`));
  }
});
