import { join } from 'node:path';
import { loadJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import {
  DEFAULT_BENCHMARK_DEFINITION_ROOT,
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_ITERATION,
  getIterationDir,
} from './benchmarkV2.mjs';
import { getBatchDefinition, writeBatchArtifacts } from './batchRunnerV2.mjs';
import { executeSelectedRuns } from './executeSelectionV2.mjs';

export function parseExecuteBatchArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    batchNumber: null,
    executorScript: '',
    graderScript: '',
    rerunCompleted: false,
    failFast: true,
    reuseExecutorOutput: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--batch' && args[index + 1]) {
      options.batchNumber = Number(args[index + 1]);
      index += 1;
    } else if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    } else if (value === '--executor-script' && args[index + 1]) {
      options.executorScript = args[index + 1];
      index += 1;
    } else if (value === '--grader-script' && args[index + 1]) {
      options.graderScript = args[index + 1];
      index += 1;
    } else if (value === '--rerun-completed') {
      options.rerunCompleted = true;
    } else if (value === '--no-fail-fast') {
      options.failFast = false;
    } else if (value === '--reuse-executor-output') {
      options.reuseExecutorOutput = true;
    }
  }

  if (options.batchNumber == null || Number.isNaN(options.batchNumber)) {
    throw new Error('Missing required --batch <N> argument.');
  }
  if (!options.executorScript) {
    throw new Error('Missing required --executor-script <path> argument.');
  }

  return options;
}

export async function executeBatchRuns({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  benchmarkDefinitionRoot = DEFAULT_BENCHMARK_DEFINITION_ROOT,
  iteration = DEFAULT_ITERATION,
  batchNumber,
  executorScript,
  graderScript = '',
  rerunCompleted = false,
  failFast = true,
  reuseExecutorOutput = false,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const batchDefinition = getBatchDefinition(batchNumber);
  const spawnManifest = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  const selectedTasks = spawnManifest.tasks.filter((task) => batchDefinition.eval_ids.includes(task.eval_id));
  const result = await executeSelectedRuns({
    benchmarkRoot,
    benchmarkDefinitionRoot,
    iteration,
    selectedTasks,
    executorScript,
    graderScript,
    rerunCompleted,
    failFast,
    reuseExecutorOutput,
    refreshArtifacts: async () => {
      const refreshed = await writeBatchArtifacts({
        benchmarkRoot,
        iteration,
        batchNumber,
      });
      return {
        batchDefinition: refreshed.batchDefinition,
        batchManifestPath: refreshed.batchManifestPath,
        batchChecklistPath: refreshed.batchChecklistPath,
      };
    },
  });

  return {
    ...result,
    batchDefinition,
  };
}
