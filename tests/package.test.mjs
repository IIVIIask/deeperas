import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

test('both marketplaces resolve to the original skill, matching manifests, and MIT notice', () => {
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
    assert.equal(manifest.version, '0.2.20+codex.20261010r22');
  }
  for (const manifest of manifests.slice(1)) {
    assert.ok(existsSync(join(root, base, manifest.skills, 'deeperas', 'SKILL.md')));
    assert.equal(manifest.author.name, 'IIVIIask');
    assert.equal(manifest.license, 'MIT');
  }
  assert.match(read('LICENSE'), /MIT License/);
  assert.equal(read(`${base}/LICENSE`), read('LICENSE'), 'Installed plugin must retain the license notice');
  assert.match(read(`${base}/skills/deeperas/SKILL.md`), /^---\r?\nname: deeperas\r?\ndescription: /);
  assert.match(read(`${base}/skills/deeperas/SKILL.md`), /DeepEras Precision - Plugin R22/);
  assert.equal(codex.plugins[0].policy.installation, 'AVAILABLE');
});
