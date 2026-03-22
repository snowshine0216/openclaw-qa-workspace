#!/usr/bin/env node

import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULT_BENCHMARK_ROOT, getIterationDir } from './lib/benchmarkV2.mjs';
import { writeScorecardForIteration } from './lib/scoreBenchmarkV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: 1,
    comparisonMode: 'executed_benchmark_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    } else if (value === '--comparison-mode' && args[index + 1]) {
      options.comparisonMode = args[index + 1];
      index += 1;
    } else if (value === '--primary-configuration' && args[index + 1]) {
      options.primaryConfiguration = args[index + 1];
      index += 1;
    } else if (value === '--reference-configuration' && args[index + 1]) {
      options.referenceConfiguration = args[index + 1];
      index += 1;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv);
  const iterationDir = getIterationDir(options.benchmarkRoot, options.iteration);
  const scorecardPath = await writeScorecardForIteration({
    benchmarkRoot: options.benchmarkRoot,
    iterationDir,
    iteration: options.iteration,
    comparisonMode: options.comparisonMode,
    primaryConfiguration: options.primaryConfiguration,
    referenceConfiguration: options.referenceConfiguration,
  });
  console.log(`Scorecard written to ${scorecardPath}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'score_iteration.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
