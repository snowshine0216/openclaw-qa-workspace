#!/usr/bin/env node
/**
 * Real spawn bridge for single-defect-analysis PR analysis.
 * Uses openclaw agent to spawn subagents that analyze PRs and write *_impact.md.
 * Contract: reads phase2_spawn_manifest.json, spawns each request via openclaw agent.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const manifestPath = process.argv[2];
let cwd = process.cwd();
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === '--cwd' && process.argv[i + 1]) {
    cwd = process.argv[i + 1];
    break;
  }
}

if (!manifestPath) {
  console.error('Usage: openclaw-spawn-bridge.js <manifest-path> [--cwd <dir>]');
  process.exit(1);
}

const resolvedManifest = resolve(manifestPath);
if (!existsSync(resolvedManifest)) {
  console.error(`manifest not found: ${resolvedManifest}`);
  process.exit(1);
}

const runDir = dirname(resolvedManifest);
const payload = JSON.parse(readFileSync(resolvedManifest, 'utf8'));
const requests = Array.isArray(payload.requests) ? payload.requests : [];

const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

for (const req of requests) {
  const args = req?.openclaw?.args;
  const task = args?.task;
  const label = args?.label || 'pr';
  const outputFile = args?.output_file;
  if (!task || !outputFile) continue;

  const absOutput = resolve(runDir, outputFile);
  if (!existsSync(dirname(absOutput))) mkdirSync(dirname(absOutput), { recursive: true });

  const fullTask = [
    task,
    '',
    `Write the analysis to: ${absOutput}`,
    'Include affected domains (auth, api, ui, db, other) when relevant.',
  ].join('\n');

  const sessionId = `${label}-${Date.now()}`;
  const spawnArgs = [
    'agent',
    '--agent', 'reporter',
    '--session-id', sessionId,
    '--message', fullTask,
    '--timeout', '360',
    '--json',
  ];

  console.error(`[spawn-bridge] Spawning ${label}...`);
  const result = spawnSync(OPENCLAW_BIN, spawnArgs, {
    encoding: 'utf8',
    cwd,
    timeout: 360_000,
    env: process.env,
  });

  if (result.error || result.status !== 0) {
    console.error(`[spawn-bridge] ${label} failed: ${result.stderr || result.error?.message || 'non-zero exit'}`);
    if (!existsSync(absOutput)) {
      const fallback = `# PR Impact\n\nSpawn failed for ${label}. ${result.stderr || result.error?.message || ''}\n`;
      writeFileSync(absOutput, fallback, 'utf8');
    }
  }
}

console.log(`SPAWN_BRIDGE_DONE: ${requests.length}`);
