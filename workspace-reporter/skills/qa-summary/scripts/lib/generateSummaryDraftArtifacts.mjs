#!/usr/bin/env node
/**
 * Shared summary-draft generation helpers for Phase 3 and approval-time revisions.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildSummaryDraft } from './buildSummaryDraft.mjs';

async function readOptionalText(path) {
  if (!path) return '';
  try {
    return await readFile(path, 'utf8');
  } catch {
    return '';
  }
}

async function loadPlannerContext(runDir) {
  try {
    const raw = await readFile(join(runDir, 'context', 'planner_artifact_lookup.json'), 'utf8');
    const plannerContext = JSON.parse(raw);
    return {
      ...plannerContext,
      planMarkdown: await readOptionalText(plannerContext.planPath),
      summaryMarkdown: await readOptionalText(plannerContext.summaryPath),
      seedMarkdown: await readOptionalText(join(runDir, 'context', 'planner_summary_seed.md')),
      backgroundSolutionSeed: await readOptionalText(join(runDir, 'context', 'background_solution_seed.md')),
      backgroundSolutionData: await (async () => {
        try {
          const raw = await readFile(join(runDir, 'context', 'background_solution_seed.json'), 'utf8');
          return JSON.parse(raw);
        } catch { return null; }
      })(),
    };
  } catch {
    return {};
  }
}

async function loadDefectContext(runDir) {
  try {
    const raw = await readFile(join(runDir, 'context', 'defect_summary.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    try {
      const raw = await readFile(join(runDir, 'context', 'no_defects.json'), 'utf8');
      return JSON.parse(raw);
    } catch {
      throw new Error(
        'BLOCKED: Missing defect_summary.json or no_defects.json. Run Phase 2 first.'
      );
    }
  }
}

async function readFeatureOverviewTable(featureKey, runDir) {
  try {
    return await readFile(join(runDir, 'context', 'feature_overview_table.md'), 'utf8');
  } catch {
    throw new Error(`BLOCKED: Missing feature overview table for ${featureKey}`);
  }
}

export async function generateSummaryDraftArtifacts({
  featureKey,
  runDir,
  approvalFeedback = '',
}) {
  const [plannerContext, defectSummary, featureOverviewTable] = await Promise.all([
    loadPlannerContext(runDir),
    loadDefectContext(runDir),
    readFeatureOverviewTable(featureKey, runDir),
  ]);

  if (!featureOverviewTable.trim()) {
    throw new Error(`BLOCKED: Missing feature overview table for ${featureKey}`);
  }

  const draft = await buildSummaryDraft({
    featureKey,
    plannerContext,
    featureOverviewTable,
    defectSummary,
    approvalFeedback,
  });

  await writeFile(
    join(runDir, 'drafts', `${featureKey}_QA_SUMMARY_DRAFT.md`),
    draft.markdown,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'summary_generation.json'),
    `${JSON.stringify(draft.metadata, null, 2)}\n`,
    'utf8'
  );

  return draft;
}
