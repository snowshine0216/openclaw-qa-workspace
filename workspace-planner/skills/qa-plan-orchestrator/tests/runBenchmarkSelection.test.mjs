import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseEvalsRange,
  selectBenchmarkTasks,
} from '../benchmarks/qa-plan-v2/scripts/lib/runBenchmarkSelection.mjs';

test('parseEvalsRange accepts increasing numeric ranges only', () => {
  assert.deepEqual(parseEvalsRange('15-24'), { lo: 15, hi: 24 });
  assert.equal(parseEvalsRange('24-15'), null);
  assert.equal(parseEvalsRange('abc'), null);
});

test('selectBenchmarkTasks uses canonical batch definitions instead of positional slicing', () => {
  const tasks = [
    { eval_id: 1, feature_family: 'report-editor' },
    { eval_id: 2, feature_family: 'report-editor' },
    { eval_id: 3, feature_family: 'report-editor' },
    { eval_id: 4, feature_family: 'report-editor' },
    { eval_id: 5, feature_family: 'report-editor' },
    { eval_id: 6, feature_family: 'docs' },
    { eval_id: 23, feature_family: 'report-editor' },
  ];

  const selection = selectBenchmarkTasks({
    tasks,
    batch: 1,
  });

  assert.deepEqual(
    selection.tasks.map((task) => task.eval_id),
    [1, 2, 3, 23],
  );
  assert.equal(selection.batchDefinition?.batch_number, 1);
  assert.equal(selection.rerunCompleted, false);
});

test('selectBenchmarkTasks composes family and eval-range filters', () => {
  const selection = selectBenchmarkTasks({
    tasks: [
      { eval_id: 15, feature_family: 'native-embedding' },
      { eval_id: 16, feature_family: 'native-embedding' },
      { eval_id: 21, feature_family: 'modern-grid' },
      { eval_id: 24, feature_family: 'native-embedding' },
    ],
    family: 'native-embedding',
    evalsRange: '16-24',
  });

  assert.deepEqual(
    selection.tasks.map((task) => task.eval_id),
    [16, 24],
  );
  assert.deepEqual(selection.evalsRange, { lo: 16, hi: 24 });
  assert.equal(selection.rerunCompleted, true);
});
