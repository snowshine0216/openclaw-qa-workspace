#!/usr/bin/env node

/**
 * One-command autonomous benchmark runner for qa-plan-v2.
 *
 * Usage (from workspace-planner/skills/qa-plan-orchestrator/):
 *   npm run benchmark:v2:run
 *   npm run benchmark:v2:run -- --family report-editor
 *   npm run benchmark:v2:run -- --batch 2
 *   npm run benchmark:v2:run -- --dry-run
 *   npm run benchmark:v2:run -- --no-aggregate
 *
 * .env is loaded by the npm script via --env-file=.env.
 * Required: OPENAI_API_KEY or ANTHROPIC_API_KEY or GEMINI_API_KEY
 * Optional: LLM_API_BASE_URL, BENCHMARK_LLM_MODEL, BENCHMARK_LLM_MAX_TOKENS
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_ITERATION,
  getIterationDir,
} from './lib/benchmarkV2.mjs';
import { executeSelectedRuns } from './lib/executeSelectionV2.mjs';
import { writeBatchArtifacts } from './lib/batchRunnerV2.mjs';
import {
  getAvailableFeatureFamilies,
  writeFamilyArtifacts,
} from './lib/familyRunnerV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCRIPTS_DIR = __dirname;

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    family: '',
    batch: 0,
    dryRun: false,
    aggregate: true,
    failFast: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const val = args[i];
    if (val === '--benchmark-root' && args[i + 1]) {
      options.benchmarkRoot = args[i + 1];
      i += 1;
    } else if (val === '--iteration' && args[i + 1]) {
      options.iteration = Number(args[i + 1]);
      i += 1;
    } else if (val === '--family' && args[i + 1]) {
      options.family = args[i + 1];
      i += 1;
    } else if (val === '--batch' && args[i + 1]) {
      options.batch = Number(args[i + 1]);
      i += 1;
    } else if (val === '--dry-run') {
      options.dryRun = true;
    } else if (val === '--no-aggregate') {
      options.aggregate = false;
    } else if (val === '--fail-fast') {
      options.failFast = true;
    }
  }

  return options;
}

async function runNodeScript(scriptPath, extraArgs = []) {
  return new Promise((res, rej) => {
    const child = spawn('node', [scriptPath, ...extraArgs], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', rej);
    child.on('exit', (code) => {
      if (code === 0) res();
      else rej(new Error(`${scriptPath} exited with code ${code}`));
    });
  });
}

async function ensurePrepared(benchmarkRoot, iteration) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const spawnManifestPath = join(iterationDir, 'spawn_manifest.json');
  if (!existsSync(spawnManifestPath)) {
    console.log('spawn_manifest.json not found — running prepare step…');
    await runNodeScript(join(SCRIPTS_DIR, '..', '..', '..', '..', '..', 'node_modules', '.bin', 'node'), [
      join(SCRIPTS_DIR, 'run_baseline.mjs'),
      '--prepare-only',
    ]).catch(() =>
      runNodeScript(join(SCRIPTS_DIR, 'run_baseline.mjs'), ['--prepare-only']),
    );
  }
  return join(iterationDir, 'spawn_manifest.json');
}

async function refreshArtifacts(benchmarkRoot, iteration) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const spawnManifestPath = join(iterationDir, 'spawn_manifest.json');
  const sm = JSON.parse(await readFile(spawnManifestPath, 'utf8'));
  for (let b = 1; b <= 6; b += 1) {
    await writeBatchArtifacts({ benchmarkRoot, iteration, batchNumber: b }).catch(() => {});
  }
  for (const fam of getAvailableFeatureFamilies(sm)) {
    await writeFamilyArtifacts({ benchmarkRoot, iteration, familyName: fam }).catch(() => {});
  }
}

async function main() {
  const options = parseArgs(process.argv);
  const { benchmarkRoot, iteration, family, batch, dryRun, aggregate, failFast } = options;

  const spawnManifestPath = await ensurePrepared(benchmarkRoot, iteration);
  const spawnManifest = JSON.parse(await readFile(spawnManifestPath, 'utf8'));

  let tasks = spawnManifest.tasks || [];

  if (family) {
    tasks = tasks.filter((t) => t.feature_family === family);
    console.log(`Filtered to family "${family}": ${tasks.length} task(s).`);
  }

  if (batch > 0) {
    // Batch: tasks are grouped in spawn_manifest in order; select batch-N window (6 tasks each)
    const batchSize = 6;
    const start = (batch - 1) * batchSize;
    tasks = tasks.slice(start, start + batchSize);
    console.log(`Filtered to batch ${batch}: ${tasks.length} task(s).`);
  }

  const totalRuns = tasks.reduce(
    (sum, t) => sum + t.with_skill_runs.length + t.without_skill_runs.length,
    0,
  );

  console.log(`benchmark:v2:run — ${tasks.length} task(s), ${totalRuns} run(s).`);

  if (dryRun) {
    console.log('--dry-run: no execution performed.');
    return;
  }

  const runner = join(SCRIPTS_DIR, 'benchmark-runner-llm.mjs');
  const grader = join(SCRIPTS_DIR, 'benchmark-grader-llm.mjs');

  const result = await executeSelectedRuns({
    benchmarkRoot,
    iteration,
    selectedTasks: tasks,
    executorScript: runner,
    graderScript: grader,
    rerunCompleted: false,
    failFast,
    refreshArtifacts: async () => {
      await refreshArtifacts(benchmarkRoot, iteration);
      return {};
    },
  });

  console.log(`\nDone. executed: ${result.executedRuns}, skipped: ${result.skippedRuns}, failures: ${result.failures.length}`);

  if (result.failures.length > 0) {
    for (const f of result.failures) {
      console.error(`  FAIL ${f.run_dir}: ${f.message}`);
    }
    process.exitCode = 1;
  }

  if (aggregate && result.failures.length === 0) {
    console.log('\nRunning aggregate…');
    await runNodeScript(join(SCRIPTS_DIR, 'run_baseline.mjs'), ['--aggregate-only']).catch(
      (err) => console.error(`Aggregate failed: ${err.message}`),
    );
  }
}

main().catch((error) => {
  console.error(`[run_benchmark.mjs] ${error.message}`);
  process.exitCode = 1;
});
