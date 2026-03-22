#!/usr/bin/env node

/**
 * Re-execute only benchmark runs that used the offline Codex fallback (placeholder outputs).
 * Uses benchmark-runner-ide-wait (human/IDE in the loop) + benchmark-grader.mjs (LLM grader; requires Codex).
 *
 * Clears result.md / grading / timing first so IDE wait actually blocks for fresh work.
 *
 * Usage (from workspace-planner/skills/qa-plan-orchestrator):
 *   node benchmarks/qa-plan-v2/scripts/run_offline_fallback_ide.mjs
 *   node benchmarks/qa-plan-v2/scripts/run_offline_fallback_ide.mjs --dry-run
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadJson } from '../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import {
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_ITERATION,
  getIterationDir,
} from './lib/benchmarkV2.mjs';
import {
  clearRunArtifactsForIdeRerun,
  collectOfflineFallbackRunDirs,
} from './lib/offlineFallbackRuns.mjs';
import { executeSelectedRuns } from './lib/executeSelectionV2.mjs';
import { writeBatchArtifacts } from './lib/batchRunnerV2.mjs';
import {
  getAvailableFeatureFamilies,
  writeFamilyArtifacts,
} from './lib/familyRunnerV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    dryRun: false,
    skipClear: false,
    refreshLists: true,
    failFast: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    } else if (value === '--dry-run') {
      options.dryRun = true;
    } else if (value === '--skip-clear') {
      options.skipClear = true;
    } else if (value === '--no-refresh-lists') {
      options.refreshLists = false;
    } else if (value === '--fail-fast') {
      options.failFast = true;
    }
  }

  return options;
}

async function refreshBatchAndFamilyLists(benchmarkRoot, iteration) {
  for (let b = 1; b <= 6; b += 1) {
    await writeBatchArtifacts({ benchmarkRoot, iteration, batchNumber: b });
  }
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const sm = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  for (const fam of getAvailableFeatureFamilies(sm)) {
    await writeFamilyArtifacts({ benchmarkRoot, iteration, familyName: fam });
  }
}

async function main() {
  const options = parseArgs(process.argv);
  const iterationDir = getIterationDir(options.benchmarkRoot, options.iteration);
  const offlineSet = await collectOfflineFallbackRunDirs(iterationDir);
  const offlineList = [...offlineSet].sort();

  console.log(`Found ${offlineList.length} run(s) with offline fallback marker under ${iterationDir}.`);
  if (offlineList.length === 0) {
    return;
  }

  for (const p of offlineList) {
    console.log(`  - ${p}`);
  }

  if (options.dryRun) {
    console.log('Dry run: no files cleared, no executor invoked.');
    return;
  }

  if (!options.skipClear) {
    for (const runDir of offlineList) {
      await clearRunArtifactsForIdeRerun(runDir);
    }
    console.log('Cleared prior outputs/grading/timing so IDE wait will block for fresh result.md.');
  }

  const spawnManifest = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  const ideRunner = join(__dirname, 'benchmark-runner-llm.mjs');
  const llmGrader = join(__dirname, 'benchmark-grader-llm.mjs');

  const target = new Set(offlineList.map((p) => resolve(p)));

  const result = await executeSelectedRuns({
    benchmarkRoot: options.benchmarkRoot,
    iteration: options.iteration,
    selectedTasks: spawnManifest.tasks,
    executorScript: ideRunner,
    graderScript: llmGrader,
    rerunCompleted: true,
    reuseExecutorOutput: false,
    failFast: options.failFast,
    runFilter: (runEntry) => target.has(resolve(runEntry.run_dir)),
    refreshArtifacts: async () => {
      if (options.refreshLists) {
        await refreshBatchAndFamilyLists(options.benchmarkRoot, options.iteration);
      }
      return {};
    },
  });

  console.log(`Executed runs: ${result.executedRuns}`);
  console.log(`Skipped runs: ${result.skippedRuns}`);
  if (result.failures.length > 0) {
    for (const failure of result.failures) {
      console.error(`${failure.run_dir}: ${failure.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`[run_offline_fallback_ide.mjs] ${error.message}`);
  process.exitCode = 1;
});
