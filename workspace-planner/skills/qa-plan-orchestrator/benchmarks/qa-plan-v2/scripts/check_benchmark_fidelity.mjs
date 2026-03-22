#!/usr/bin/env node

/**
 * Scans qa-plan-v2 iteration run outputs for known low-fidelity markers:
 * - execution_notes.md containing the historical offline-placeholder line
 * - metrics.json with model "offline-fallback"
 *
 * When BENCHMARK_REQUIRE_EXECUTED=1 (or "true"), exits with code 1 if any run fails.
 * Otherwise prints a report and exits 0 (informational; does not break local dev by default).
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULT_BENCHMARK_ROOT, DEFAULT_ITERATION, getIterationDir } from './lib/benchmarkV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OFFLINE_PLACEHOLDER_SNIPPET = 'offline fallback executor';
const OFFLINE_FALLBACK_MODEL = 'offline-fallback';

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = resolve(args[index + 1]);
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    }
  }

  return options;
}

function requireExecutedEnabled() {
  const raw = process.env.BENCHMARK_REQUIRE_EXECUTED;
  return raw === '1' || String(raw).toLowerCase() === 'true';
}

async function pathReadable(path) {
  try {
    await readFile(path, 'utf8');
    return true;
  } catch {
    return false;
  }
}

async function collectViolations(iterationDir) {
  const violations = [];

  let evalDirs = [];
  try {
    evalDirs = (await readdir(iterationDir)).filter((name) => name.startsWith('eval-'));
  } catch {
    return { violations, error: `iteration directory not found: ${iterationDir}` };
  }

  for (const evalDirName of evalDirs) {
    const evalPath = join(iterationDir, evalDirName);
    for (const cfg of ['with_skill', 'without_skill']) {
      const cfgPath = join(evalPath, cfg);
      let runNames = [];
      try {
        runNames = (await readdir(cfgPath)).filter((name) => name.startsWith('run-'));
      } catch {
        continue;
      }
      for (const runName of runNames) {
        const runDir = join(cfgPath, runName);
        const notesPath = join(runDir, 'outputs', 'execution_notes.md');
        const metricsPath = join(runDir, 'outputs', 'metrics.json');

        if (await pathReadable(notesPath)) {
          const text = await readFile(notesPath, 'utf8');
          if (text.includes(OFFLINE_PLACEHOLDER_SNIPPET)) {
            violations.push({
              kind: 'offline_placeholder_notes',
              path: notesPath,
            });
          }
        }

        if (await pathReadable(metricsPath)) {
          try {
            const raw = await readFile(metricsPath, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed && parsed.model === OFFLINE_FALLBACK_MODEL) {
              violations.push({
                kind: 'offline_fallback_metrics',
                path: metricsPath,
              });
            }
          } catch {
            // ignore malformed metrics
          }
        }
      }
    }
  }

  return { violations, error: null };
}

async function main() {
  const options = parseArgs(process.argv);
  const iterationDir = getIterationDir(options.benchmarkRoot, options.iteration);
  const strict = requireExecutedEnabled();

  const { violations, error } = await collectViolations(iterationDir);

  if (error) {
    console.error(`[check_benchmark_fidelity] ${error}`);
    process.exitCode = strict ? 1 : 0;
    return;
  }

  if (violations.length === 0) {
    console.log(
      `[check_benchmark_fidelity] OK: no placeholder or offline-fallback metrics under ${iterationDir}`,
    );
    process.exitCode = 0;
    return;
  }

  console.error(
    `[check_benchmark_fidelity] Found ${violations.length} low-fidelity marker(s) under ${iterationDir}:`,
  );
  for (const v of violations) {
    console.error(`  - ${v.kind}: ${v.path}`);
  }
  console.error(
    '[check_benchmark_fidelity] Re-execute affected runs with benchmark-runner.mjs or benchmark-runner-ide-wait.mjs and benchmark-grader.mjs, then re-aggregate.',
  );

  if (strict) {
    console.error('[check_benchmark_fidelity] Failing because BENCHMARK_REQUIRE_EXECUTED is enabled.');
    process.exitCode = 1;
  } else {
    console.error(
      '[check_benchmark_fidelity] Exiting 0 (informational). Set BENCHMARK_REQUIRE_EXECUTED=1 to fail CI on these markers.',
    );
    process.exitCode = 0;
  }
}

main().catch((error) => {
  const scriptName = join(__dirname, 'check_benchmark_fidelity.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
