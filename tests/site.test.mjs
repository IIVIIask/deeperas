import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const html = read('docs/index.html');

test('both marketplaces resolve to the same original skill and consistent manifests', () => {
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
  const skill = read(`${base}/skills/deeperas/SKILL.md`);
  assert.match(skill, /^---\r?\nname: deeperas\r?\ndescription: /);
  assert.match(skill, /DeepEras Precision - Plugin R22/);
  assert.equal(codex.plugins[0].policy.installation, 'AVAILABLE');
});

test('local website links, anchors, and copy targets all exist', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id');
  assert.match(html, /<html lang="en">/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  for (const [, link] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (link === '#') continue;
    if (link.startsWith('#')) assert.ok(ids.includes(link.slice(1)), `Missing anchor ${link}`);
    else if (!link.startsWith('https://')) {
      const file = resolve(root, 'docs', link);
      assert.ok(file.startsWith(join(root, 'docs')), `Path escapes docs: ${link}`);
      assert.ok(existsSync(file), `Missing asset ${link}`);
    }
  }
  for (const [, id] of html.matchAll(/data-copy-target="([^"]+)"/g)) {
    assert.ok(ids.includes(id), `Missing copy target ${id}`);
  }
  assert.match(read('docs/style.css'), /prefers-reduced-motion:reduce/);
  assert.match(html, /<a class="skip-link"/);
  assert.ok(existsSync(join(root, 'docs/assets/social.png')));
  assert.ok(existsSync(join(root, 'docs/.nojekyll')));
});

function copyContext(clipboard) {
  let handler;
  let selected;
  const button = { dataset: { copyTarget: 'target' }, textContent: 'Copy', addEventListener: (_, callback) => { handler = callback; } };
  const target = { textContent: '  a complete command\na second command  ', hidden: true, scrollIntoView: () => {} };
  const status = { textContent: '' };
  const context = {
    document: {
      querySelectorAll: () => [button],
      getElementById: (id) => id === 'target' ? target : status,
      createRange: () => ({ selectNodeContents: (node) => { selected = node; } }),
    },
    navigator: { clipboard },
    window: { getSelection: () => ({ removeAllRanges: () => {}, addRange: () => {} }) },
    setTimeout: () => {},
  };
  vm.runInNewContext(read('docs/script.js'), context);
  return { click: () => handler(), button, target, status, selection: () => selected };
}

test('copy preserves complete commands and reports success', async () => {
  let copied;
  const page = copyContext({ writeText: async (text) => { copied = text; } });
  await page.click();
  assert.equal(copied, 'a complete command\na second command');
  assert.equal(page.button.textContent, 'Copied ✓');
  assert.match(page.status.textContent, /Copied/);
});

test('denied or missing clipboard reveals and selects the source text', async () => {
  for (const clipboard of [undefined, { writeText: async () => { throw new Error('Denied'); } }]) {
    const page = copyContext(clipboard);
    await page.click();
    assert.equal(page.target.hidden, false);
    assert.equal(page.selection(), page.target);
    assert.match(page.status.textContent, /unavailable/);
    assert.equal(page.button.textContent, 'Copy');
  }
});
