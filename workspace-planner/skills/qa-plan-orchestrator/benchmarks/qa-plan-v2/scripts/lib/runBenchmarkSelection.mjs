import { getBatchDefinition } from './batchRunnerV2.mjs';

export function parseEvalsRange(range) {
  if (!range) return null;
  const match = /^(\d+)-(\d+)$/.exec(String(range).trim());
  if (!match) return null;
  const lo = Number(match[1]);
  const hi = Number(match[2]);
  return lo <= hi ? { lo, hi } : null;
}

export function selectBenchmarkTasks({
  tasks = [],
  family = '',
  batch = 0,
  evalsRange = '',
} = {}) {
  let selectedTasks = [...tasks];
  let batchDefinition = null;
  let rerunCompleted = false;

  if (family) {
    selectedTasks = selectedTasks.filter((task) => task.feature_family === family);
  }

  if (Number(batch) > 0) {
    batchDefinition = getBatchDefinition(batch);
    const batchEvalIds = new Set(batchDefinition.eval_ids);
    selectedTasks = selectedTasks.filter((task) => batchEvalIds.has(task.eval_id));
  }

  const parsedRange = parseEvalsRange(evalsRange);
  if (parsedRange) {
    selectedTasks = selectedTasks.filter(
      (task) => task.eval_id >= parsedRange.lo && task.eval_id <= parsedRange.hi,
    );
    rerunCompleted = true;
  }

  return {
    tasks: selectedTasks,
    batchDefinition,
    evalsRange: parsedRange,
    rerunCompleted,
  };
}
