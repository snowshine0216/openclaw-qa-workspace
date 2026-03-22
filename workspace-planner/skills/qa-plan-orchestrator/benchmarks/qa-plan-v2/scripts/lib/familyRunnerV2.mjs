import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_ITERATION,
  getIterationDir,
} from './benchmarkV2.mjs';
import { loadJson, writeJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import {
  buildTaskStatus,
  countCompletedRuns,
  countRuns,
  renderSelectionChecklist,
} from './selectionArtifactsV2.mjs';

function normalizeFamilyName(familyName) {
  return String(familyName || '').trim();
}

export function getAvailableFeatureFamilies(spawnManifest) {
  return [...new Set((spawnManifest.tasks || []).map((task) => task.feature_family).filter(Boolean))].sort();
}

export function getFamilyDefinition(spawnManifest, familyName) {
  const normalized = normalizeFamilyName(familyName);
  if (!normalized) {
    throw new Error('Missing required --family <name> argument.');
  }

  const availableFamilies = getAvailableFeatureFamilies(spawnManifest);
  if (!availableFamilies.includes(normalized)) {
    throw new Error(`Unsupported feature family: ${normalized}. Available families: ${availableFamilies.join(', ')}`);
  }

  return {
    feature_family: normalized,
    label: normalized,
    goal: `feature-family focus: ${normalized}`,
  };
}

function getFamilyDir(iterationDir, familyDefinition) {
  return join(iterationDir, 'families', familyDefinition.feature_family);
}

export async function writeFamilyArtifacts({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  familyName,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const spawnManifest = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  const familyDefinition = getFamilyDefinition(spawnManifest, familyName);
  const selectedTasks = spawnManifest.tasks.filter((task) => task.feature_family === familyDefinition.feature_family);
  const tasks = await Promise.all(selectedTasks.map((task) => buildTaskStatus(iterationDir, task)));
  const runCount = countRuns(tasks);
  const completedRunCount = countCompletedRuns(tasks);
  const familyDir = getFamilyDir(iterationDir, familyDefinition);

  await mkdir(familyDir, { recursive: true });

  const familyManifestPath = join(familyDir, 'family_manifest.json');
  const familyChecklistPath = join(familyDir, 'family_checklist.md');

  await writeJson(familyManifestPath, {
    family: familyDefinition,
    summary: {
      task_count: tasks.length,
      run_count: runCount,
      completed_run_count: completedRunCount,
      pending_run_count: runCount - completedRunCount,
    },
    tasks,
  });
  await writeFile(familyChecklistPath, renderSelectionChecklist({
    title: `# QA Plan Benchmark Family ${familyDefinition.feature_family} Checklist`,
    goal: familyDefinition.goal,
    tasks,
    runCount,
    completedRunCount,
  }), 'utf8');

  return {
    familyDefinition,
    iterationDir,
    familyDir,
    familyManifestPath,
    familyChecklistPath,
    taskCount: tasks.length,
    runCount,
    completedRunCount,
  };
}

export function parseFamilyArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    familyName: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--family' && args[index + 1]) {
      options.familyName = normalizeFamilyName(args[index + 1]);
      index += 1;
    } else if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    }
  }

  if (!options.familyName) {
    throw new Error('Missing required --family <name> argument.');
  }

  return options;
}
