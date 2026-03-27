import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import {
  buildSubagentPrompt,
  buildManifest,
} from '../lib/build_defect_summary_spawn_manifest.mjs';

const SCRIPT = new URL('../lib/build_defect_summary_spawn_manifest.mjs', import.meta.url).pathname;

// --- buildSubagentPrompt ---

test('prompt contains run-dir and defects-run-dir paths', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    defectsRunDir: '/tmp/defects/BCIN-7289',
    schemaRefPath: '/refs/planner-and-defects.md',
  });
  assert.match(prompt, /\/tmp\/runs\/BCIN-7289/);
  assert.match(prompt, /\/tmp\/defects\/BCIN-7289/);
});

test('prompt references schema ref path', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    defectsRunDir: '/tmp/defects/BCIN-7289',
    schemaRefPath: '/refs/planner-and-defects.md',
  });
  assert.match(prompt, /planner-and-defects\.md/);
});

test('prompt instructs LLM to write defect_summary.json or no_defects.json', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    defectsRunDir: '/tmp/defects/BCIN-7289',
    schemaRefPath: '/refs/planner-and-defects.md',
  });
  assert.match(prompt, /defect_summary\.json/);
  assert.match(prompt, /no_defects\.json/);
});

// --- buildManifest ---

test('manifest has version 1 and one request', () => {
  const manifest = buildManifest('task prompt');
  assert.equal(manifest.version, 1);
  assert.equal(manifest.count, 1);
  assert.equal(manifest.requests.length, 1);
});

test('manifest request uses openclaw subagent runtime', () => {
  const manifest = buildManifest('task prompt');
  const req = manifest.requests[0];
  assert.equal(req.openclaw.args.runtime, 'subagent');
  assert.equal(req.openclaw.args.mode, 'run');
  assert.equal(req.openclaw.args.task, 'task prompt');
});

// --- CLI ---

async function makeRunDir() {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-defect-manifest-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_key: 'BCIN-7289' }));
  return runDir;
}

test('CLI writes phase2_defect_summary_manifest.json and prints SPAWN_MANIFEST', async () => {
  const runDir = await makeRunDir();
  const defectsRunDir = await mkdtemp(join(tmpdir(), 'defects-'));

  const result = spawnSync(process.execPath, [SCRIPT, runDir, defectsRunDir], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);
  assert.match(result.stdout, /phase2_defect_summary_manifest\.json/);

  const manifest = JSON.parse(
    await readFile(join(runDir, 'phase2_defect_summary_manifest.json'), 'utf8')
  );
  assert.equal(manifest.version, 1);
  assert.ok(manifest.requests[0].openclaw.args.task.includes(defectsRunDir));

  await rm(runDir, { recursive: true, force: true });
  await rm(defectsRunDir, { recursive: true, force: true });
});

test('CLI exits 1 when arguments are missing', () => {
  const result = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
});
