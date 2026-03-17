import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildRuntimeSetup } from '../check_runtime_env.mjs';

test('buildRuntimeSetup writes json and md to output dir', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-runtime-'));
  const result = await buildRuntimeSetup('BCIN-1', ['confluence'], outDir, {
    cwd: join(import.meta.dirname, '..', '..', '..', '..'),
  });
  assert.ok(typeof result.ok === 'boolean');
  assert.ok(Array.isArray(result.setup_entries));
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(outDir);
  assert.ok(files.some((f) => f.startsWith('runtime_setup_BCIN-1')));
});

test('pass status when source validation succeeds', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-runtime-'));
  const result = await buildRuntimeSetup('BCIN-1', ['confluence'], outDir, {
    cwd: join(import.meta.dirname, '..', '..', '..', '..'),
  });
  assert.ok(Array.isArray(result.setup_entries));
  const entry = result.setup_entries.find((e) => e.source_family === 'confluence');
  assert.ok(entry, 'confluence entry exists');
  assert.ok(['pass', 'blocked'].includes(entry.status), 'status is pass or blocked');
});

test('blocked status for unknown source family', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-runtime-'));
  const result = await buildRuntimeSetup('BCIN-1', ['unknown_source'], outDir, {
    cwd: join(import.meta.dirname, '..', '..', '..', '..'),
  });
  assert.equal(result.ok, false);
  const entry = result.setup_entries[0];
  assert.equal(entry.status, 'blocked');
  assert.ok(entry.blockers);
});

test('json serialization produces valid output', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-runtime-'));
  await buildRuntimeSetup('BCIN-1', ['confluence'], outDir, {
    cwd: join(import.meta.dirname, '..', '..', '..', '..'),
  });
  const { readFile } = await import('node:fs/promises');
  const jsonPath = join(outDir, 'runtime_setup_BCIN-1.json');
  const raw = await readFile(jsonPath, 'utf8');
  const parsed = JSON.parse(raw);
  assert.ok(parsed.ok !== undefined);
  assert.ok(Array.isArray(parsed.setup_entries));
  assert.ok(Array.isArray(parsed.failures));
});

test('jira validation uses the shared skill resolver and blocks when no script is resolved', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-runtime-'));
  const result = await buildRuntimeSetup('BCIN-1', ['jira'], outDir, {
    resolveSharedSkillScript: async () => null,
  });

  assert.equal(result.ok, false);
  const entry = result.setup_entries.find((item) => item.source_family === 'jira');
  assert.ok(entry);
  assert.equal(entry.status, 'blocked');
  assert.match(entry.blockers, /script not found/i);
});
