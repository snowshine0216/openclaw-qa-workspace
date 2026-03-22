#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

async function materializeOutputs(manifestPath, requests) {
  const results = [];
  for (const [index, request] of requests.entries()) {
    const outputFile = request?.openclaw?.args?.output_file;
    if (outputFile) {
      const absPath = resolve(dirname(manifestPath), outputFile);
      await mkdir(dirname(absPath), { recursive: true });
      await writeFile(absPath, `# Materialized output ${index + 1}\n`, 'utf8');
    }
    results.push({ index, status: 'completed' });
  }
  return results;
}

export async function runManifest(manifestPath, options = {}) {
  const payload = JSON.parse(await readFile(manifestPath, 'utf8'));
  const requests = Array.isArray(payload.requests) ? payload.requests : [];
  const cwd = options.cwd ?? process.cwd();

  let results = [];
  if (process.env.TEST_SPAWN_OUTPUT_MODE === 'materialize') {
    results = await materializeOutputs(manifestPath, requests);
  } else {
    const openclawBin = process.env.OPENCLAW_BIN ?? 'openclaw';
    for (const request of requests) {
      if (request.local_command?.argv) {
        const child = spawnSync(request.local_command.argv[0], request.local_command.argv.slice(1), {
          cwd: request.local_command.cwd ?? cwd,
          encoding: 'utf8',
          env: process.env,
        });
        results.push({
          kind: 'local_command',
          status: child.status === 0 ? 'completed' : 'failed',
          stderr: child.stderr || '',
        });
        continue;
      }
      const args = request?.openclaw?.args;
      if (!args) {
        results.push({ kind: 'openclaw', status: 'skipped' });
        continue;
      }
      const task = args.task ?? 'Run manifest task';
      const child = spawnSync(
        openclawBin,
        [
          'sessions',
          'spawn',
          '--task',
          task,
          '--label',
          args.label ?? 'spawn',
          '--mode',
          args.mode ?? 'run',
          '--runtime',
          args.runtime ?? 'subagent',
          '--cwd',
          cwd,
          '--wait',
        ],
        {
          cwd,
          encoding: 'utf8',
          env: process.env,
        },
      );
      results.push({
        kind: 'openclaw',
        status: child.status === 0 ? 'completed' : 'failed',
        stderr: child.stderr || '',
      });
    }
  }

  const outputPath = join(dirname(manifestPath), 'spawn_results.json');
  await writeFile(outputPath, `${JSON.stringify({ results }, null, 2)}\n`, 'utf8');
  const failed = results.some((result) => result.status !== 'completed' && result.status !== 'skipped');
  return { results, failed };
}

async function main() {
  const manifestPath = process.argv[2];
  const cwdIndex = process.argv.indexOf('--cwd');
  const cwd = cwdIndex >= 0 ? process.argv[cwdIndex + 1] : process.cwd();
  if (!manifestPath) {
    throw new Error('Usage: manifestRunner.mjs <manifest-path> [--cwd <dir>]');
  }
  const outcome = await runManifest(manifestPath, { cwd });
  process.exit(outcome.failed ? 1 : 0);
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (currentPath === executedPath) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
