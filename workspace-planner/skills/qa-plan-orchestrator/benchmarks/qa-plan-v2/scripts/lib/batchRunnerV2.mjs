import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  DEFAULT_BENCHMARK_ROOT,
  DEFAULT_ITERATION,
  getIterationDir,
} from './benchmarkV2.mjs';

import { loadJson, writeJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

const BATCH_DEFINITIONS = [
  { batch_number: 1, label: 'blocking-blind', goal: 'blocking blind signal first', eval_ids: [1, 2, 3, 23] },
  { batch_number: 2, label: 'report-editor-docs-blind', goal: 'remaining report-editor and docs blind quality', eval_ids: [6, 10, 12, 22] },
  { batch_number: 3, label: 'native-modern-grid-blind', goal: 'native-embedding and modern-grid blind coverage', eval_ids: [15, 16, 21, 24, 25, 26, 27] },
  { batch_number: 4, label: 'viz-selector-export-blind', goal: 'visualization, search-box-selector, and export blind coverage', eval_ids: [17, 18, 19, 20, 28, 29, 30, 31, 32] },
  { batch_number: 5, label: 'retrospective-replay', goal: 'retrospective replay coverage', eval_ids: [4, 5, 7, 8, 9, 11] },
  { batch_number: 6, label: 'holdout-regression', goal: 'holdout regression guardrail', eval_ids: [13, 14] },
];

function parseBatchNumber(batchNumber) {
  const parsed = Number(batchNumber);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`Invalid batch number: ${batchNumber}`);
  }
  return parsed;
}

export function getBatchDefinition(batchNumber) {
  const parsed = parseBatchNumber(batchNumber);
  const batch = BATCH_DEFINITIONS.find((entry) => entry.batch_number === parsed);
  if (!batch) {
    throw new Error(`Unsupported batch number: ${batchNumber}`);
  }
  return batch;
}

function getBatchDir(iterationDir, batchDefinition) {
  return join(iterationDir, 'batches', `batch-${batchDefinition.batch_number}`);
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function resolveIterationPath(iterationDir, candidatePath) {
  if (!candidatePath) {
    return candidatePath;
  }
  return candidatePath.startsWith('/') ? candidatePath : join(iterationDir, candidatePath);
}

async function getRunStatus(iterationDir, runEntry) {
  const resolvedOutputDir = resolveIterationPath(iterationDir, runEntry.output_dir);
  const resolvedRunDir = resolveIterationPath(iterationDir, runEntry.run_dir);
  const hasOutputs = await pathExists(resolvedOutputDir);
  const hasGrading = await pathExists(join(resolvedRunDir, 'grading.json'));
  const hasTiming = await pathExists(join(resolvedRunDir, 'timing.json'));
  return {
    ...runEntry,
    has_outputs: hasOutputs,
    has_grading: hasGrading,
    has_timing: hasTiming,
    status: hasOutputs && hasGrading && hasTiming ? 'completed' : 'pending',
  };
}

async function buildTaskStatus(iterationDir, task) {
  const withSkillRuns = await Promise.all(task.with_skill_runs.map((runEntry) => getRunStatus(iterationDir, runEntry)));
  const withoutSkillRuns = await Promise.all(task.without_skill_runs.map((runEntry) => getRunStatus(iterationDir, runEntry)));
  return {
    ...task,
    with_skill_runs: withSkillRuns,
    without_skill_runs: withoutSkillRuns,
  };
}

function countRuns(tasks) {
  return tasks.reduce((sum, task) => sum + task.with_skill_runs.length + task.without_skill_runs.length, 0);
}

function countCompletedRuns(tasks) {
  return tasks.reduce((sum, task) => {
    const withSkill = task.with_skill_runs.filter((run) => run.status === 'completed').length;
    const withoutSkill = task.without_skill_runs.filter((run) => run.status === 'completed').length;
    return sum + withSkill + withoutSkill;
  }, 0);
}

function renderRunLines(title, runs) {
  const lines = [`### ${title}`, ''];
  for (const run of runs) {
    lines.push(`- [${run.status === 'completed' ? 'x' : ' '}] \`${title.includes('with_skill') ? 'with_skill' : 'without_skill'}\` \`run-${run.run_number}\``);
    lines.push(`  Path: \`${run.run_dir}\``);
  }
  lines.push('');
  return lines;
}

function renderTask(task) {
  return [
    `## Eval ${task.eval_id}`,
    '',
    `- case: \`${task.case_id}\``,
    `- feature: \`${task.feature_id}\``,
    `- status: \`${task.blocking ? 'blocking' : 'advisory'}\``,
    '',
    ...renderRunLines('with_skill runs', task.with_skill_runs),
    ...renderRunLines('without_skill runs', task.without_skill_runs),
  ];
}

function renderChecklist({ batchDefinition, tasks, runCount, completedRunCount }) {
  const lines = [
    `# QA Plan Benchmark Batch ${batchDefinition.batch_number} Checklist`,
    '',
    `**Goal:** ${batchDefinition.goal}`,
    `**Cases:** \`${tasks.length}\``,
    `**Runs:** \`${runCount}\``,
    `**Completed runs:** \`${completedRunCount}\``,
    `**Pending runs:** \`${runCount - completedRunCount}\``,
    '',
  ];
  for (const task of tasks) {
    lines.push(...renderTask(task));
  }
  return lines.join('\n');
}

export async function writeBatchArtifacts({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  batchNumber,
}) {
  const batchDefinition = getBatchDefinition(batchNumber);
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const spawnManifest = await loadJson(join(iterationDir, 'spawn_manifest.json'));
  const selectedTasks = spawnManifest.tasks.filter((task) => batchDefinition.eval_ids.includes(task.eval_id));
  const tasks = await Promise.all(selectedTasks.map((task) => buildTaskStatus(iterationDir, task)));
  const runCount = countRuns(tasks);
  const completedRunCount = countCompletedRuns(tasks);
  const batchDir = getBatchDir(iterationDir, batchDefinition);

  await mkdir(batchDir, { recursive: true });

  const batchManifestPath = join(batchDir, 'batch_manifest.json');
  const batchChecklistPath = join(batchDir, 'batch_checklist.md');

  await writeJson(batchManifestPath, {
    batch: batchDefinition,
    summary: {
      task_count: tasks.length,
      run_count: runCount,
      completed_run_count: completedRunCount,
      pending_run_count: runCount - completedRunCount,
    },
    tasks,
  });
  await writeFile(batchChecklistPath, renderChecklist({ batchDefinition, tasks, runCount, completedRunCount }), 'utf8');

  return {
    batchDefinition,
    iterationDir,
    batchDir,
    batchManifestPath,
    batchChecklistPath,
    taskCount: tasks.length,
    runCount,
    completedRunCount,
  };
}

export function parseBatchArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: DEFAULT_ITERATION,
    batchNumber: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--batch' && args[index + 1]) {
      options.batchNumber = getBatchDefinition(args[index + 1]).batch_number;
      index += 1;
    } else if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    }
  }

  if (options.batchNumber == null) {
    throw new Error('Missing required --batch <N> argument.');
  }

  return options;
}
