#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_SKILL_ROOT,
  collectBenchmarkV2GradingStatus,
  finalizeBenchmarkV2Baseline,
  getIterationDir,
  prepareBenchmarkV2Baseline,
} from './lib/benchmarkV2.mjs';
import { runBenchmarkAggregation } from '../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    prepareOnly: false,
    aggregateOnly: false,
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    skillRoot: DEFAULT_SKILL_ROOT,
    executorModel: null,
    reasoningEffort: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--prepare-only') {
      options.prepareOnly = true;
    } else if (value === '--aggregate-only') {
      options.aggregateOnly = true;
    } else if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--skill-root' && args[index + 1]) {
      options.skillRoot = args[index + 1];
      index += 1;
    } else if (value === '--executor-model' && args[index + 1]) {
      options.executorModel = args[index + 1];
      index += 1;
    } else if (value === '--reasoning-effort' && args[index + 1]) {
      options.reasoningEffort = args[index + 1];
      index += 1;
    }
  }

  if (options.prepareOnly && options.aggregateOnly) {
    throw new Error('Use either --prepare-only or --aggregate-only, not both.');
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv);
  const iterationDir = getIterationDir(options.benchmarkRoot, 0);

  if (!options.aggregateOnly) {
    const prepared = await prepareBenchmarkV2Baseline({
      skillRoot: options.skillRoot,
      benchmarkRoot: options.benchmarkRoot,
      iteration: 0,
      executorModel: options.executorModel,
      reasoningEffort: options.reasoningEffort,
    });
    console.log(`Prepared qa-plan-v2 baseline at ${prepared.iterationDir}`);
    console.log(`Champion snapshot refreshed at ${prepared.snapshotDir}`);
    console.log(`Prepared ${prepared.caseCount} benchmark cases.`);
    console.log(`Spawn manifest written to ${prepared.spawnManifestPath}`);
  }

  if (options.prepareOnly) {
    return;
  }

  const gradingStatus = await collectBenchmarkV2GradingStatus(iterationDir);
  if (!gradingStatus.ready) {
    console.log(
      `qa-plan-v2 baseline is not ready for aggregation: ${gradingStatus.gradedRuns}/${gradingStatus.expectedRuns} runs have grading.json.`,
    );
    console.log(`Complete grading for the remaining ${gradingStatus.missingRuns} runs, then rerun with --aggregate-only.`);
    return;
  }

  const aggregated = await runBenchmarkAggregation({
    skillRoot: options.skillRoot,
    iterationDir,
  });
  await finalizeBenchmarkV2Baseline({
    benchmarkRoot: options.benchmarkRoot,
    iteration: 0,
  });
  console.log(`Benchmark JSON written to ${aggregated.benchmarkJsonPath}`);
  console.log(`Benchmark Markdown written to ${aggregated.benchmarkMarkdownPath}`);
  console.log('qa-plan-v2 baseline status finalized.');
}

main().catch((error) => {
  const scriptName = join(__dirname, 'run_baseline.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
