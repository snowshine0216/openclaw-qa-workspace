#!/usr/bin/env node
/**
 * Persist resolved planner paths into task.json.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function persistPlannerResolution(runDir, resolved) {
  const taskPath = join(runDir, 'task.json');
  let task = {};
  try {
    const raw = await readFile(taskPath, 'utf8');
    task = JSON.parse(raw);
  } catch {
    // start fresh
  }

  task.planner_plan_resolved_path = resolved.planPath ?? null;
  task.planner_summary_path = resolved.summaryPath ?? null;
  task.feature_overview_table_path = join(runDir, 'context', 'feature_overview_table.md');
  task.feature_overview_source = resolved.featureOverviewSource ?? null;
  task.updated_at = new Date().toISOString();

  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
}
