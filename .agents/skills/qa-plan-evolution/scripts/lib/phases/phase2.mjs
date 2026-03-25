#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { seedGapTaxonomyAndBacklog } from '../mutationBacklog.mjs';
import { findBlockingGapSources } from '../gapSources/index.mjs';
import { hashJsonPayload } from '../workflowState.mjs';
import {
  ensureRunDirs,
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchTask,
  touchRun,
} from './common.mjs';

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);
  ensureRunDirs(runRoot);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);

  const { taxonomy, mutations, source_results: sourceResults } = await seedGapTaxonomyAndBacklog({
    repoRoot,
    task,
    runRoot,
  });

  const blockingSources = findBlockingGapSources(sourceResults);
  if (blockingSources.length > 0) {
    throw new Error(
      `Phase 2 blocked by unresolved gap sources: ${blockingSources.map((result) => result.source_type).join(', ')}`,
    );
  }

  const fingerprint = hashJsonPayload({
    profile: task.benchmark_profile,
    source_results: sourceResults,
  });
  const taxonomyJsonPath = join(runRoot, 'context', `gap_taxonomy_${runKey}.json`);
  const backlogJsonPath = join(runRoot, 'context', `mutation_backlog_${runKey}.json`);
  const phase2Receipt = run.phase_receipts?.phase2 ?? null;
  if (
    phase2Receipt?.fingerprint === fingerprint
    && phase2Receipt?.output_artifacts?.taxonomy_json === taxonomyJsonPath
    && phase2Receipt?.output_artifacts?.mutation_backlog_json === backlogJsonPath
  ) {
    touchTask(runRoot, task, {
      current_phase: 'phase3',
      current_iteration: Math.max(1, task.current_iteration || 1),
      next_action: 'run_phase3',
      next_action_reason: 'ready_for_phase3',
    });
    touchRun(runRoot, run, {
      phase_receipts: {
        ...(run.phase_receipts ?? {}),
        phase2: {
          ...phase2Receipt,
          reused_at: new Date().toISOString(),
        },
      },
    });
    console.log(`phase2 reused: ${mutations.length} mutation candidates`);
    return;
  }

  writeFileSync(
    join(runRoot, 'context', `gap_taxonomy_${runKey}.md`),
    [`# Gap taxonomy`, '', '```json', JSON.stringify(taxonomy, null, 2), '```'].join('\n'),
    'utf8',
  );
  writeFileSync(
    join(runRoot, 'context', `gap_taxonomy_${runKey}.json`),
    `${JSON.stringify(taxonomy, null, 2)}\n`,
    'utf8',
  );

  writeFileSync(
    join(runRoot, 'context', `mutation_backlog_${runKey}.md`),
    [`# Mutation backlog`, '', '```json', JSON.stringify(mutations, null, 2), '```'].join('\n'),
    'utf8',
  );
  writeFileSync(
    join(runRoot, 'context', `mutation_backlog_${runKey}.json`),
    `${JSON.stringify({ source_results: sourceResults, mutations }, null, 2)}\n`,
    'utf8',
  );

  const nextTask = touchTask(runRoot, task, {
    current_phase: 'phase3',
    current_iteration: Math.max(1, task.current_iteration || 1),
    next_action: 'run_phase3',
    next_action_reason: 'ready_for_phase3',
  });
  touchRun(runRoot, run, {
    gap_taxonomy_generated_at: new Date().toISOString(),
    phase_receipts: {
      ...(run.phase_receipts ?? {}),
      phase2: {
        fingerprint,
        completed_at: new Date().toISOString(),
        reusable: true,
        invalidated: false,
        output_artifacts: {
          taxonomy_json: taxonomyJsonPath,
          mutation_backlog_json: backlogJsonPath,
        },
      },
    },
  });

  console.log(`phase2 ok: ${mutations.length} mutation candidates (${nextTask.current_iteration})`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
