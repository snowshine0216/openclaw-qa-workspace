#!/usr/bin/env node
/**
 * Phase 1: Resolve planner artifacts, extract feature overview table.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolvePlannerArtifact } from './resolvePlannerArtifact.mjs';
import { buildFeatureOverviewTable } from './buildFeatureOverviewTable.mjs';
import { persistPlannerResolution } from './persistPlannerResolution.mjs';
import { extractBackgroundSolutionSeed } from './extractBackgroundSolution.mjs';

async function fetchJiraFeatureMeta(featureKey, deps = {}) {
  try {
    if (deps.spawnJira) return deps.spawnJira(featureKey);
    const { spawnSync } = await import('node:child_process');
    const result = spawnSync('jira', ['issue', 'view', featureKey, '--output', 'json'], {
      encoding: 'utf8',
      env: { ...process.env },
    });
    if (result.status !== 0 || !result.stdout) return null;
    const issue = JSON.parse(result.stdout);
    const fields = issue.fields || issue;
    const fixVersions = fields.fixVersions || [];
    const release = fixVersions[0]?.name || null;
    const qaOwner =
      fields.customfield_qa_owner?.displayName ||
      fields.customfield_qa_owner?.name ||
      fields['QA Owner']?.displayName ||
      fields['QA Owner']?.name ||
      fields.qa_owner ||
      null;
    const summary = fields.summary || null;
    return { release, qa_owner: qaOwner, summary };
  } catch {
    return null;
  }
}

export async function runPhase1(featureKey, runDir) {
  const taskPath = join(runDir, 'task.json');
  let task = {};
  try {
    const raw = await readFile(taskPath, 'utf8');
    task = JSON.parse(raw);
  } catch {
    console.error('BLOCKED: Missing task.json. Run Phase 0 first.');
    return 2;
  }

  const resolved = await resolvePlannerArtifact({
    featureKey,
    plannerRunRoot: task.planner_run_root,
    plannerPlanPath: task.planner_plan_path,
    runDir,
  });

  if (!resolved.planPath) {
    console.error(`BLOCKED: Provide QA plan markdown for ${featureKey}`);
    return 2;
  }

  await writeFile(
    join(runDir, 'context', 'planner_artifact_lookup.json'),
    `${JSON.stringify({ ...resolved, featureOverviewSource: null }, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'planner_summary_seed.md'),
    resolved.seedMarkdown,
    'utf8'
  );

  const jiraMeta = await fetchJiraFeatureMeta(featureKey);

  const featureOverview = await buildFeatureOverviewTable({
    featureKey,
    planPath: resolved.planPath,
    summaryPath: resolved.summaryPath,
    jiraMetadata: jiraMeta,
  });

  resolved.featureOverviewSource = featureOverview.metadata.source;

  await writeFile(
    join(runDir, 'context', 'feature_overview_table.md'),
    featureOverview.markdown,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'feature_overview_source.json'),
    `${JSON.stringify(featureOverview.metadata, null, 2)}\n`,
    'utf8'
  );

  if (jiraMeta) {
    await writeFile(
      join(runDir, 'context', 'jira_feature_meta.json'),
      `${JSON.stringify(jiraMeta, null, 2)}\n`,
      'utf8'
    );
  }

  // Extract background/solution seed from planner design artifacts (confluence design doc
  // and deep research synthesis) which have richer Background/Introduction content than
  // the QA plan itself.
  const plannerContextDir = resolved.planPath ? join(resolved.planPath, '..', 'context') : null;
  let confluenceDesignText = '';
  let deepResearchSynthesisText = '';
  if (plannerContextDir) {
    try {
      confluenceDesignText = await readFile(
        join(plannerContextDir, `confluence_design_${featureKey}.md`), 'utf8'
      );
    } catch { /* not present */ }
    // Find any deep_research_synthesis file for this feature
    try {
      const { readdir } = await import('node:fs/promises');
      const files = await readdir(plannerContextDir);
      const synthFile = files.find(
        (f) => f.startsWith('deep_research_synthesis') && f.includes(featureKey) && f.endsWith('.md')
      );
      if (synthFile) {
        deepResearchSynthesisText = await readFile(join(plannerContextDir, synthFile), 'utf8');
      }
    } catch { /* not present */ }
  }
  const combinedForSeed = [confluenceDesignText, deepResearchSynthesisText]
    .filter(Boolean)
    .join('\n\n');
  const bgSeed = extractBackgroundSolutionSeed(combinedForSeed || resolved.seedMarkdown || '');
  await writeFile(
    join(runDir, 'context', 'background_solution_seed.md'),
    bgSeed.raw || '',
    'utf8'
  );
  // Also persist structured JSON so buildBackgroundSolution can read fields directly
  await writeFile(
    join(runDir, 'context', 'background_solution_seed.json'),
    `${JSON.stringify({
      backgroundText: bgSeed.backgroundText,
      problemText: bgSeed.problemText,
      solutionText: bgSeed.solutionText,
      outOfScopeText: bgSeed.outOfScopeText,
      outOfScopeLines: bgSeed.outOfScopeText ? bgSeed.outOfScopeText.split('\n').filter(Boolean) : [],
    }, null, 2)}\n`,
    'utf8'
  );

  await persistPlannerResolution(runDir, resolved);
  const persistedTask = JSON.parse(await readFile(taskPath, 'utf8'));

  const ts = new Date().toISOString();
  persistedTask.current_phase = 'phase1';
  persistedTask.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(persistedTask, null, 2)}\n`, 'utf8');

  const runPath = join(runDir, 'run.json');
  let run = {};
  try {
    const raw = await readFile(runPath, 'utf8');
    run = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  run.planner_context_resolved_at = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log('PHASE1_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase1.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const code = await runPhase1(featureKey, runDir);
  process.exit(code);
}

if (process.argv[1]?.includes('phase1.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
