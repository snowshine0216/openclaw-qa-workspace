import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

function assertPath(path, description) {
  if (!existsSync(path)) {
    throw new Error(`Missing required ${description}: ${path}`);
  }
}

export async function executeGradingHarness(runDefinition, gradingHarness = null) {
  if (typeof gradingHarness === 'function') {
    await gradingHarness(runDefinition);
  }
}

export async function readRequiredRunArtifacts(runDir) {
  const outputsDir = join(runDir, 'outputs');
  const gradingPath = join(runDir, 'grading.json');
  const timingPath = join(runDir, 'timing.json');

  assertPath(outputsDir, 'outputs directory');
  assertPath(gradingPath, 'grading.json');
  assertPath(timingPath, 'timing.json');

  return {
    grading: JSON.parse(await readFile(gradingPath, 'utf8')),
    timing: JSON.parse(await readFile(timingPath, 'utf8')),
  };
}

export function buildBenchmarkRunFromArtifacts({
  evalId,
  configuration,
  runNumber,
  grading,
  timing,
}) {
  return {
    eval_id: evalId,
    configuration,
    run_number: runNumber,
    result: {
      pass_rate: grading.summary.pass_rate,
      passed: grading.summary.passed,
      failed: grading.summary.failed,
      total: grading.summary.total,
      time_seconds: timing.total_duration_seconds ?? grading.timing?.total_duration_seconds ?? 0,
      tokens: timing.total_tokens ?? 0,
      tool_calls: grading.execution_metrics?.total_tool_calls ?? 0,
      errors: grading.execution_metrics?.errors_encountered ?? 0,
    },
    expectations: grading.expectations ?? [],
    notes: grading.user_notes_summary?.needs_review ?? [],
  };
}
