import { join } from 'node:path';

import { loadJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import { DEFAULT_BENCHMARK_ROOT, DEFAULT_ITERATION, getIterationDir } from './benchmarkV2.mjs';
import { executeSelectedRuns } from './executeSelectionV2.mjs';
import { getFamilyDefinition, writeFamilyArtifacts } from './familyRunnerV2.mjs';

export function parseExecuteFamilyArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    familyName: '',
    executorScript: '',
    graderScript: '',
    rerunCompleted: false,
    failFast: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--family' && args[index + 1]) {
      options.familyName = String(args[index + 1]).trim();
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
    }
  }

  if (!options.familyName) {
    throw new Error('Missing required --family <name> argument.');
  }
  if (!options.executorScript) {
    throw new Error('Missing required --executor-script <path> argument.');
  }

  return options;
}

export async function executeFamilyRuns({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  familyName,
  executorScript,
  graderScript = '',
  rerunCompleted = false,
  failFast = true,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const spawnManifest = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  const familyDefinition = getFamilyDefinition(spawnManifest, familyName);
  const selectedTasks = spawnManifest.tasks.filter((task) => task.feature_family === familyDefinition.feature_family);

  const result = await executeSelectedRuns({
    benchmarkRoot,
    iteration,
    selectedTasks,
    executorScript,
    graderScript,
    rerunCompleted,
    failFast,
    refreshArtifacts: async () => {
      const refreshed = await writeFamilyArtifacts({
        benchmarkRoot,
        iteration,
        familyName: familyDefinition.feature_family,
      });
      return {
        familyDefinition: refreshed.familyDefinition,
        familyManifestPath: refreshed.familyManifestPath,
        familyChecklistPath: refreshed.familyChecklistPath,
      };
    },
  });

  return {
    ...result,
    familyDefinition,
  };
}
