import test from 'node:test';
import assert from 'node:assert/strict';

import { parseGradingResponse } from '../benchmarks/qa-plan-v2/scripts/lib/benchmarkGraderResponse.mjs';

test('benchmark-grader-llm treats omitted expectation judgments as failures', () => {
  const grading = parseGradingResponse(
    JSON.stringify({
      expectations: [
        {
          text: 'first expectation',
          passed: true,
          evidence: 'covered',
        },
      ],
    }),
    ['first expectation', 'second expectation'],
  );

  assert.equal(grading.summary.total, 2);
  assert.equal(grading.summary.passed, 1);
  assert.equal(grading.summary.failed, 1);
  assert.equal(grading.expectations.length, 2);
  assert.equal(grading.expectations[0].passed, true);
  assert.equal(grading.expectations[1].passed, false);
  assert.match(grading.expectations[1].evidence, /omitted/i);
});

test('benchmark-grader-llm matches by expectation id before raw text equality', () => {
  const grading = parseGradingResponse(
    JSON.stringify({
      expectations: [
        {
          id: 'exp-2',
          text: 'same meaning, different wording',
          passed: true,
          evidence: 'covered via id match',
        },
        {
          id: 'exp-1',
          text: 'paraphrased first expectation',
          passed: false,
          evidence: 'not covered',
        },
      ],
    }),
    ['first expectation', 'second expectation'],
  );

  assert.equal(grading.summary.total, 2);
  assert.equal(grading.summary.passed, 1);
  assert.equal(grading.summary.failed, 1);
  assert.equal(grading.expectations[0].id, 'exp-1');
  assert.equal(grading.expectations[0].passed, false);
  assert.equal(grading.expectations[1].id, 'exp-2');
  assert.equal(grading.expectations[1].passed, true);
  assert.equal(grading.expectations[1].text, 'same meaning, different wording');
});
