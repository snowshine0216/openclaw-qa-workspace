#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

async function materializeOutputs(manifestPath, requests) {
  for (const request of requests) {
    const args = request?.openclaw?.args ?? {};
    const outputFile = args.output_file;
    if (!outputFile) {
      continue;
    }
    const absPath = resolve(dirname(manifestPath), outputFile);
    const content = args.output_format === 'json'
      ? `${JSON.stringify({
          run_key: 'TEST-RUN',
          generated_at: '2026-03-21T00:00:00.000Z',
          feature_id: 'TEST-RUN',
          feature_family: 'test-family',
          source_artifacts: ['REPORT_FINAL.md'],
          gaps: [],
        }, null, 2)}\n`
      : '# Generated PR Impact\n\nRisk: Medium\nDomains: api,ui\n';
    await mkdir(dirname(absPath), { recursive: true });
    await writeFile(absPath, content, 'utf8');
  }
  return requests.map((request) => ({ label: request?.openclaw?.args?.label ?? 'spawn', status: 'completed' }));
}

function spawnAndCapture(spawnImpl, bin, argv, cwd) {
  const child = spawnImpl(bin, argv, {
    encoding: 'utf8',
    cwd,
    env: process.env,
    timeout: 360_000,
  });
  return {
    status: child.status,
    stderr: child.stderr || '',
    errorCode: child.error?.code || null,
  };
}

function shouldFallbackToCodex(run) {
  return run.status == null && Boolean(run.errorCode);
}

function buildSpawnTask(manifestPath, args) {
  const outputFile = args.output_file ? resolve(dirname(manifestPath), args.output_file) : null;
  const instructions = [args.task ?? ''];
  if (outputFile) {
    instructions.push(`Write the analysis to: ${outputFile}`);
    instructions.push(args.output_format === 'json' ? 'Output JSON only.' : 'Output markdown only.');
  }
  return instructions.filter(Boolean).join('\n\n');
}

async function runViaCodex(manifestPath, args, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const spawnImpl = options.spawnImpl ?? spawnSync;
  const codexBin = process.env.CODEX_BIN ?? 'codex';
  const argv = ['exec', '--full-auto', '--sandbox', 'workspace-write'];
  const outputFile = args?.output_file;
  if (outputFile) {
    const absPath = resolve(dirname(manifestPath), outputFile);
    await mkdir(dirname(absPath), { recursive: true });
    argv.push('-o', absPath);
  }
  argv.push(args?.task ?? 'Run manifest task');
  const run = spawnAndCapture(spawnImpl, codexBin, argv, cwd);
  return {
    kind: 'codex',
    status: run.status === 0 ? 'completed' : 'failed',
    stderr: run.stderr,
  };
}

export async function runFromManifest(manifestPath, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const spawnImpl = options.spawnImpl ?? spawnSync;
  const payload = JSON.parse(await readFile(manifestPath, 'utf8'));
  const requests = Array.isArray(payload.requests) ? payload.requests : [];

  let results;
  if (process.env.TEST_SPAWN_OUTPUT_MODE === 'materialize') {
    results = await materializeOutputs(manifestPath, requests);
  } else {
    const openclawBin = process.env.OPENCLAW_BIN ?? 'openclaw';
    results = requests.map((request) => {
      const args = request?.openclaw?.args ?? {};
      const task = buildSpawnTask(manifestPath, args);
      const openclawRun = spawnAndCapture(
        spawnImpl,
        openclawBin,
        ['sessions', 'spawn', '--task', task, '--label', args.label ?? 'spawn', '--mode', args.mode ?? 'run', '--runtime', args.runtime ?? 'subagent', '--cwd', cwd, '--wait'],
      );
      if (openclawRun.status === 0) {
        return {
          kind: 'openclaw',
          label: args.label ?? 'spawn',
          status: 'completed',
          session_error: null,
        };
      }
      if (shouldFallbackToCodex(openclawRun)) {
        return {
          kind: 'openclaw_fallback_codex',
          label: args.label ?? 'spawn',
          status: 'fallback_pending',
          session_error: openclawRun.stderr || openclawRun.errorCode,
          args,
        };
      }
      return {
        kind: 'openclaw',
        label: args.label ?? 'spawn',
        status: 'failed',
        session_error: (openclawRun.stderr || `openclaw failed (exit_status=${openclawRun.status ?? 'none'})`).trim(),
      };
    });
    for (const [index, result] of results.entries()) {
      if (result.status !== 'fallback_pending') {
        continue;
      }
      const codexResult = await runViaCodex(manifestPath, result.args, { cwd, spawnImpl });
      if (codexResult.status === 'completed') {
        results[index] = {
          kind: 'openclaw_fallback_codex',
          label: result.label,
          status: 'completed',
          session_error: result.session_error,
        };
        continue;
      }
      results[index] = {
        kind: 'openclaw_fallback_codex',
        label: result.label,
        status: 'failed',
        session_error:
          `openclaw unavailable: ${result.session_error}\n` +
          `codex fallback failed: ${codexResult.stderr}`.trim(),
      };
    }
  }

  const outputPath = join(dirname(manifestPath), 'spawn_results.json');
  await writeFile(outputPath, `${JSON.stringify({ results }, null, 2)}\n`, 'utf8');
  return { results, failed: results.some((result) => result.status !== 'completed') };
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
  const result = await runFromManifest(manifestPath, { cwd });
  process.exit(result.failed ? 1 : 0);
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (currentPath === executedPath) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
