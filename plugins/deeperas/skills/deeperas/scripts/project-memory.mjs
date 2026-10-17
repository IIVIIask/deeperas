import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import { fileURLToPath } from 'node:url';

const folder = '.deeperas';
const kinds = ['fact', 'decision', 'constraint', 'result'];
const states = ['confirmed', 'unknown', 'conflicted', 'stale'];
const origins = ['user', 'tool', 'source', 'calculation'];
const own = (object, key) => Object.hasOwn(object, key);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const idValid = (id) => typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(id)
  && !['constructor', 'prototype', '__proto__'].includes(id);
const timestamp = (value) => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString() === value.replace(/Z$/, value.includes('.') ? 'Z' : '.000Z');

function fail(message, status = 'error') {
  throw Object.assign(new Error(message), { memoryStatus: status });
}

function requireValue(condition, message) {
  if (!condition) fail(message);
}

function validateEntry(entry) {
  requireValue(object(entry) && kinds.includes(entry.kind) && states.includes(entry.state), 'Invalid entry kind or state');
  requireValue(own(entry, 'value') && Array.isArray(entry.provenance) && Array.isArray(entry.dependsOn), 'Missing value, provenance or dependencies');
  JSON.stringify(entry.value, (_key, value) => {
    requireValue(typeof value !== 'number' || Number.isFinite(value), 'Non-finite value');
    requireValue(!['undefined', 'function', 'symbol', 'bigint'].includes(typeof value), 'Value must be JSON data');
    return value;
  });
  for (const origin of entry.provenance) {
    requireValue(object(origin) && origins.includes(origin.kind)
      && typeof origin.reference === 'string' && origin.reference.trim().length > 0
      && timestamp(origin.observedAt) && Date.parse(origin.observedAt) <= Date.now(), 'Invalid provenance');
    if (origin.file !== undefined) requireValue(object(origin.file) && typeof origin.file.path === 'string'
      && origin.file.path.trim().length > 0 && /^[a-f0-9]{64}$/.test(origin.file.sha256), 'Invalid file provenance');
  }
  if (entry.state === 'confirmed') {
    requireValue(entry.provenance.length > 0, 'Confirmed entries need provenance');
    if (entry.kind === 'decision') requireValue(entry.provenance.some((origin) => origin.kind === 'user'), 'Confirmed decisions need user selection or delegation provenance');
  }
  requireValue(entry.validUntil === undefined || timestamp(entry.validUntil), 'Invalid validity deadline');
}

function validateRecord(record, project) {
  requireValue(object(record) && record.schemaVersion === 1 && record.project === project
    && Number.isSafeInteger(record.revision) && record.revision >= 0 && object(record.entries), 'Invalid memory schema or project identity');
  for (const [id, entry] of Object.entries(record.entries)) {
    requireValue(idValid(id), 'Invalid entry ID');
    validateEntry(entry);
    requireValue(Number.isSafeInteger(entry.revision) && entry.revision > 0 && entry.revision <= record.revision, 'Invalid entry revision');
    requireValue(Array.isArray(entry.invalidatedBy) && entry.invalidatedBy.every(idValid), 'Invalid invalidation record');
    const seen = new Set();
    for (const dependency of entry.dependsOn) {
      requireValue(object(dependency) && idValid(dependency.id) && own(record.entries, dependency.id)
        && Number.isSafeInteger(dependency.revision) && dependency.revision > 0
        && dependency.revision <= record.entries[dependency.id].revision && !seen.has(dependency.id), 'Invalid dependency');
      seen.add(dependency.id);
      if (entry.state === 'confirmed') requireValue(record.entries[dependency.id].state === 'confirmed'
        && dependency.revision === record.entries[dependency.id].revision, 'Confirmed entry has an unverified or changed dependency');
    }
    requireValue(!entry.provenance.some((origin) => origin.kind === 'calculation') || entry.dependsOn.length > 0, 'Calculations need recorded inputs');
  }
  const visited = new Set();
  const active = new Set();
  function visit(id) {
    requireValue(!active.has(id), 'Dependency cycle');
    if (visited.has(id)) return;
    active.add(id);
    for (const dependency of record.entries[id].dependsOn) visit(dependency.id);
    active.delete(id);
    visited.add(id);
  }
  for (const id of Object.keys(record.entries)) visit(id);
}

function git(project, args) {
  const flags = args[0] === 'ls-files' ? ['--literal-pathspecs'] : [];
  const result = childProcess.spawnSync('git', [...flags, '-c', 'core.fsmonitor=false', '-C', project, ...args], { encoding: 'utf8', windowsHide: true });
  if (result.error) fail('Git verification unavailable', 'disabled');
  return result;
}

function noSymlink(target) {
  if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) fail('Memory paths must not be symbolic links', 'disabled');
}

function privacyGuard(project) {
  const probe = git(project, ['rev-parse', '--show-toplevel']);
  if (probe.status !== 0) {
    if (/not a git repository/i.test(probe.stderr)) return () => {};
    fail('Git status cannot be verified', 'disabled');
  }
  const repo = fs.realpathSync(probe.stdout.trim());
  const relative = path.relative(repo, path.join(project, folder)).split(path.sep).join('/');
  requireValue(relative !== '..' && !relative.startsWith('../') && !path.isAbsolute(relative), 'Project is outside repository');
  const exclusion = git(repo, ['rev-parse', '--git-path', 'info/exclude']);
  if (exclusion.status !== 0) fail('Private Git exclusion cannot be resolved', 'disabled');
  const excludePath = path.resolve(repo, exclusion.stdout.trim());
  noSymlink(excludePath);
  const check = () => {
    const tracked = git(repo, ['ls-files', '--', relative]);
    if (tracked.status !== 0 || tracked.stdout.trim()) fail('Memory directory is tracked or index verification failed', 'disabled');
    const ignored = git(repo, ['check-ignore', '-v', '--', `${relative}/memory.json`]);
    const match = ignored.stdout.split('\t')[0].match(/^(.*):(\d+):(.*)$/);
    return ignored.status === 0 && match && !match[3].startsWith('!')
      && path.resolve(repo, match[1]) === excludePath;
  };
  if (!check()) {
    const pattern = `/${relative.replace(/[\\*?\[\] !#]/g, '\\$&')}/`;
    const existing = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, 'utf8') : '';
    fs.mkdirSync(path.dirname(excludePath), { recursive: true });
    fs.appendFileSync(excludePath, `${existing && !existing.endsWith('\n') ? '\n' : ''}${pattern}\n`, { mode: 0o600 });
    if (!check()) fail('Private Git exclusion could not be verified', 'disabled');
  }
  return () => { if (!check()) fail('Private Git exclusion no longer holds', 'disabled'); };
}

function invalidate(record, changed) {
  const affected = new Set(changed);
  const queue = [...changed];
  for (let offset = 0; offset < queue.length; offset++) {
    const parent = queue[offset];
    for (const [id, entry] of Object.entries(record.entries)) {
      if (!entry.dependsOn.some((dependency) => dependency.id === parent)) continue;
      if (!entry.invalidatedBy.includes(parent)) entry.invalidatedBy.push(parent);
      if (affected.has(id)) continue;
      if (entry.state === 'confirmed') entry.state = 'stale';
      entry.revision = record.revision;
      affected.add(id);
      queue.push(id);
    }
  }
  return [...affected];
}

function sourceChanged(project, entry) {
  return entry.provenance.some((origin) => {
    if (!origin.file) return false;
    const target = path.resolve(project, origin.file.path);
    const relative = path.relative(project, target);
    requireValue(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), 'Source file is outside project');
    try {
      const realRelative = path.relative(project, fs.realpathSync(target));
      requireValue(realRelative !== '..' && !realRelative.startsWith(`..${path.sep}`) && !path.isAbsolute(realRelative), 'Source file redirects outside project');
      return crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') !== origin.file.sha256;
    } catch (error) {
      if (error.memoryStatus) throw error;
      return true;
    }
  });
}

function refreshEvidence(record) {
  const expired = Object.keys(record.entries).filter((id) => {
    const entry = record.entries[id];
    return entry.state === 'confirmed' && entry.validUntil && Date.parse(entry.validUntil) <= Date.now();
  });
  const changedSources = Object.keys(record.entries).filter((id) => record.entries[id].state === 'confirmed'
    && sourceChanged(record.project, record.entries[id]));
  const changed = [...new Set([...expired, ...changedSources])];
  let affected = [];
  if (changed.length) {
    record.revision++;
    for (const id of changed) {
      record.entries[id].state = 'stale';
      record.entries[id].revision = record.revision;
    }
    affected = invalidate(record, changed);
  }
  return { expired, changedSources, affected };
}

function save(file, record, previous) {
  const temp = path.join(path.dirname(file), `memory-${crypto.randomUUID()}.tmp`);
  try {
    const data = `${JSON.stringify(record, null, 2)}\n`;
    const fd = fs.openSync(temp, 'wx', 0o600);
    try { fs.writeFileSync(fd, data); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    if ((fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null) !== previous) fail('Memory changed during write; read again');
    fs.renameSync(temp, file);
    if (fs.readFileSync(file, 'utf8') !== data) fail('Write outcome unverified; inspect before retrying', 'disabled');
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

export function projectMemory(project, request) {
  let lock;
  let locked = false;
  try {
    requireValue(object(request), 'Expected a JSON request');
    if (request.action === 'disable') return { status: 'disabled', reason: 'File persistence unavailable; use current conversation only' };
    requireValue(['read', 'put', 'check'].includes(request.action), 'Unknown action');
    if (request.action === 'put') {
      requireValue(idValid(request.id) && Number.isSafeInteger(request.expectedRevision) && request.expectedRevision >= 0, 'Put needs ID and expectedRevision from read');
      validateEntry(request.entry);
      requireValue(request.entry.dependsOn.every(idValid) && new Set(request.entry.dependsOn).size === request.entry.dependsOn.length, 'Dependencies must be unique entry IDs');
    }
    if (request.action === 'check') requireValue(Array.isArray(request.ids) && request.ids.length > 0 && request.ids.every(idValid), 'Check needs entry IDs');
    if (typeof project !== 'string' || !path.isAbsolute(project) || !fs.existsSync(project)) fail('Absolute project directory unavailable', 'disabled');
    const root = fs.realpathSync(project);
    if (!fs.statSync(root).isDirectory()) fail('Project is not a directory', 'disabled');
    const directory = path.join(root, folder);
    const file = path.join(directory, 'memory.json');
    noSymlink(directory);
    noSymlink(file);
    const verifyPrivacy = privacyGuard(root);
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    lock = path.join(directory, 'memory.lock');
    noSymlink(lock);
    const lockFd = fs.openSync(lock, 'wx', 0o600);
    locked = true;
    fs.closeSync(lockFd);
    const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    let record;
    try {
      record = previous === null ? { schemaVersion: 1, project: root, revision: 0, entries: {} } : JSON.parse(previous);
      validateRecord(record, root);
    } catch { fail('Stored memory is invalid; preserve it and reconcile in conversation', 'disabled'); }
    const { expired, changedSources, affected: evidenceAffected } = refreshEvidence(record);
    let affected = [...evidenceAffected];
    if (request.action === 'put') {
      requireValue(request.expectedRevision === record.revision, 'Revision conflict; read and reconcile before retrying');
      const entry = request.entry;
      if (entry.state === 'confirmed') requireValue(!sourceChanged(root, entry), 'Source evidence no longer matches; inspect before confirmation');
      const dependencies = entry.dependsOn.map((id) => {
        requireValue(own(record.entries, id), `Unknown dependency: ${id}`);
        return { id, revision: record.entries[id].revision };
      });
      const candidate = {
        kind: entry.kind, value: entry.value, state: entry.state,
        provenance: entry.provenance.map(({ kind, reference, observedAt, file: evidenceFile }) => ({ kind, reference, observedAt,
          ...(evidenceFile === undefined ? {} : { file: { path: evidenceFile.path, sha256: evidenceFile.sha256 } }) })),
        dependsOn: dependencies,
        ...(entry.validUntil === undefined ? {} : { validUntil: entry.validUntil }),
      };
      const previousEntry = record.entries[request.id];
      const comparable = previousEntry && Object.fromEntries(Object.entries(previousEntry).filter(([key]) => !['revision', 'invalidatedBy'].includes(key)));
      if (JSON.stringify(candidate) !== JSON.stringify(comparable)) {
        record.revision++;
        record.entries[request.id] = { ...candidate, revision: record.revision, invalidatedBy: [] };
        for (const dependency of dependencies) requireValue(request.id !== dependency.id, 'Dependency cycle');
        affected = [...new Set([...affected, ...invalidate(record, [request.id])])];
        validateRecord(record, root);
        const refreshed = refreshEvidence(record);
        expired.push(...refreshed.expired);
        changedSources.push(...refreshed.changedSources);
        affected = [...new Set([...affected, ...refreshed.affected])];
      }
    }
    // A verified replacement also tests actual write capability, including read-only existing stores.
    save(file, record, previous);
    verifyPrivacy();
    if (request.action === 'check') {
      const blocked = request.ids.filter((id) => !own(record.entries, id) || record.entries[id].state !== 'confirmed');
      return { status: blocked.length ? 'blocked' : 'enabled', revision: record.revision, blocked, expired, changedSources, affected };
    }
    return { status: 'enabled', revision: record.revision, record, affected, expired, changedSources };
  } catch (error) {
    return { status: error.memoryStatus ?? (error.code ? 'disabled' : 'error'), reason: error.message };
  } finally {
    if (locked) {
      try { fs.unlinkSync(lock); } catch { /* A remaining lock prevents later writes instead of allowing an unsafe retry. */ }
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  let result;
  try {
    requireValue(process.argv[2] === '--project' && process.argv.length === 4, 'Usage: node project-memory.mjs --project <absolute project directory>; JSON request on stdin');
    result = projectMemory(process.argv[3], JSON.parse(input));
  } catch (error) { result = { status: 'error', reason: error.message }; }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status === 'disabled' || result.status === 'error') process.exitCode = 1;
}
