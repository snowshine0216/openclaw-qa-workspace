#!/usr/bin/env node
/**
 * Generic manifest-to-openclaw-spawn. Reads phaseN_spawn_manifest.json,
 * runs openclaw sessions spawn per request.openclaw.args.
 *
 * Usage: node spawn_from_manifest.mjs <manifest-path> [--cwd <dir>]
 *
 * Manifest format (qa-plan style): { "requests": [{ "openclaw": { "args": { task, label, mode, runtime, ... } } }] }
 * Runs sequentially; exit 1 if any spawn fails.
 * Writes spawn_results.json alongside manifest.
 */

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

async function loadManifest(path) {
  const content = await readFile(path, 'utf8');
  return JSON.parse(content);
}

function spawnOne(args, cwd) {
  const task = args.task || '';
  const label = args.label || 'spawn';
  const mode = args.mode || 'run';
  const runtime = args.runtime || 'subagent';

  const spawnArgs = [
    'sessions',
    'spawn',
    '--task',
    task,
    '--label',
    label,
    '--mode',
    mode,
    '--runtime',
    runtime,
    '--cwd',
    cwd,
    '--wait',
  ];

  const result = spawnSync(OPENCLAW_BIN, spawnArgs, {
    encoding: 'utf8',
    cwd,
    env: process.env,
    timeout: 360_000,
  });

  return {
    label,
    status: result.status === 0 ? 'completed' : 'failed',
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    session_error: result.status !== 0 ? (result.stderr || result.error?.message || 'non-zero exit').slice(0, 500) : null,
  };
}

export async function runFromManifest(manifestPath, options = {}) {
  const cwd = options.cwd || dirname(resolve(manifestPath));
  const manifest = await loadManifest(manifestPath);
  const requests = manifest.requests || [];

  const results = [];
  for (const req of requests) {
    const args = req?.openclaw?.args;
    if (!args) {
      results.push({
        label: 'unknown',
        status: 'failed',
        session_error: 'missing openclaw.args',
      });
      continue;
    }
    results.push(spawnOne(args, cwd));
  }

  const outputPath = join(dirname(manifestPath), 'spawn_results.json');
  await writeFile(outputPath, `${JSON.stringify({ results }, null, 2)}\n`, 'utf8');

  const failed = results.some((r) => r.status === 'failed');
  return { results, failed };
}

async function main() {
  const argv = process.argv.slice(2);
  let manifestPath = null;
  let cwd = process.cwd();

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cwd' && argv[i + 1]) {
      cwd = argv[i + 1];
      i++;
    } else if (!argv[i].startsWith('--')) {
      manifestPath = argv[i];
      break;
    }
  }

  if (!manifestPath) {
    console.error('Usage: spawn_from_manifest.mjs <manifest-path> [--cwd <dir>]');
    process.exit(1);
  }

  const { failed } = await runFromManifest(manifestPath, { cwd });
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
