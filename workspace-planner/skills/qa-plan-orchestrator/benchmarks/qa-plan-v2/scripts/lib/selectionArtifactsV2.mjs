import { stat } from 'node:fs/promises';
import { join } from 'node:path';

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export function resolveIterationPath(iterationDir, candidatePath) {
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

export async function buildTaskStatus(iterationDir, task) {
  const withSkillRuns = await Promise.all(task.with_skill_runs.map((runEntry) => getRunStatus(iterationDir, runEntry)));
  const withoutSkillRuns = await Promise.all(task.without_skill_runs.map((runEntry) => getRunStatus(iterationDir, runEntry)));
  return {
    ...task,
    with_skill_runs: withSkillRuns,
    without_skill_runs: withoutSkillRuns,
  };
}

export function countRuns(tasks) {
  return tasks.reduce((sum, task) => sum + task.with_skill_runs.length + task.without_skill_runs.length, 0);
}

export function countCompletedRuns(tasks) {
  return tasks.reduce((sum, task) => {
    const withSkill = task.with_skill_runs.filter((run) => run.status === 'completed').length;
    const withoutSkill = task.without_skill_runs.filter((run) => run.status === 'completed').length;
    return sum + withSkill + withoutSkill;
  }, 0);
}

function renderRunLines(configurationLabel, runs) {
  const lines = [`### ${configurationLabel} runs`, ''];
  for (const run of runs) {
    lines.push(`- [${run.status === 'completed' ? 'x' : ' '}] \`${configurationLabel}\` \`run-${run.run_number}\``);
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
    ...renderRunLines('with_skill', task.with_skill_runs),
    ...renderRunLines('without_skill', task.without_skill_runs),
  ];
}

export function renderSelectionChecklist({
  title,
  goal,
  tasks,
  runCount,
  completedRunCount,
}) {
  const lines = [
    title,
    '',
    `**Goal:** ${goal}`,
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
