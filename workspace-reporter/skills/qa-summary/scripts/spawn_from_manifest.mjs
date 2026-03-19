#!/usr/bin/env node
/**
 * Spawn phase-owned subagents from manifest files.
 * Supports openclaw.args as array (--skill, --feature-key, etc.).
 */

import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const OPENCLAW_BIN = process.env.OPENCLAW_BIN ?? process.env.CODEX_BIN ?? 'codex';

function spawnOpenClaw(args, cwd) {
  if (Array.isArray(args)) {
    const child = spawnSync(OPENCLAW_BIN, args, {
      encoding: 'utf8',
      cwd: cwd || process.cwd(),
      env: process.env,
      timeout: 360_000,
    });
    return { status: child.status, stderr: child.stderr, stdout: child.stdout };
  }
  return { status: 1, stderr: 'Invalid args', stdout: '' };
}

export async function spawnFromManifest(manifestPath, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const manifestDir = dirname(resolve(manifestPath));
  const runCwd = join(manifestDir);
  const payload = JSON.parse(await readFile(manifestPath, 'utf8'));
  const requests = Array.isArray(payload.requests) ? payload.requests : [];

  for (const request of requests) {
    const openclaw = request?.openclaw;
    const args = openclaw?.args;
    if (!args || !Array.isArray(args)) continue;
    const result = spawnOpenClaw(args, runCwd);
    if (result.status !== 0) {
      console.error(`Spawn failed for ${request.kind ?? 'request'}:`, result.stderr || result.stdout);
      return { failed: true };
    }
  }
  return { failed: false };
}

async function main() {
  const argv = process.argv.slice(2);
  const manifestPath = argv[0];
  const cwdIndex = argv.indexOf('--cwd');
  const cwd = cwdIndex >= 0 ? argv[cwdIndex + 1] : process.cwd();
  if (!manifestPath) {
    console.error('Usage: spawn_from_manifest.mjs <manifest-path> [--cwd <dir>]');
    process.exit(1);
  }
  const result = await spawnFromManifest(manifestPath, { cwd });
  process.exit(result.failed ? 1 : 0);
}

const currentPath = new URL(import.meta.url).pathname;
const executedPath = process.argv[1] ?? '';
if (executedPath && (executedPath === currentPath || executedPath.endsWith('spawn_from_manifest.mjs'))) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
