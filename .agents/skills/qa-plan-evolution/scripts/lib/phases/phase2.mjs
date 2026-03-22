#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { seedGapTaxonomyAndBacklog } from '../mutationBacklog.mjs';
import { findBlockingGapSources } from '../gapSources/index.mjs';
import {
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
  });
  touchRun(runRoot, run, {
    gap_taxonomy_generated_at: new Date().toISOString(),
  });

  console.log(`phase2 ok: ${mutations.length} mutation candidates (${nextTask.current_iteration})`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
