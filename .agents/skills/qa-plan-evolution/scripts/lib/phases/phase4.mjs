#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { runTargetValidation } from '../runTargetValidation.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchRun,
} from './common.mjs';

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);

  const iter = parseInt(String(args.iteration ?? task.current_iteration ?? 1), 10) || 1;
  const iterDir = join(runRoot, 'candidates', `iteration-${iter}`);
  mkdirSync(iterDir, { recursive: true });
  const candidateScopePath = join(iterDir, 'candidate_scope.json');
  const candidatePatchSummaryPath = join(iterDir, 'candidate_patch_summary.md');
  if (!existsSync(candidateScopePath) || !existsSync(candidatePatchSummaryPath)) {
    throw new Error(`Missing candidate patch artifacts for iteration ${iter}; run phase3 first`);
  }
  const candidateScope = JSON.parse(readFileSync(candidateScopePath, 'utf8'));
  const candidateRoot = join(runRoot, candidateScope.candidate_snapshot_path);
  if (!existsSync(candidateRoot)) {
    throw new Error(`Missing candidate snapshot for iteration ${iter}: ${candidateRoot}`);
  }

  const validation = await runTargetValidation(repoRoot, task.target_skill_path, {
    candidateRoot,
    profileId: task.benchmark_profile,
    knowledgePackKey: task.knowledge_pack_key ?? null,
    featureFamily: task.feature_family ?? null,
    iteration: iter,
    defectAnalysisRunKey: task.defect_analysis_run_key ?? null,
  });

  const summary = {
    iteration: iter,
    smoke_ok: validation.smoke_ok,
    eval_ok: validation.eval_ok,
    regression_count: validation.regression_count,
    contract_compliance_score: validation.contract_compliance_score,
    defect_recall_score: validation.defect_recall_score ?? 0,
    knowledge_pack_coverage_score: validation.knowledge_pack_coverage_score ?? 0,
    execution_order: validation.execution_order ?? [],
    benchmark_artifacts: validation.benchmark_artifacts ?? null,
  };

  const report = [
    `# Validation report (iteration ${iter})`,
    '',
    '## Summary',
    '```json',
    JSON.stringify(summary, null, 2),
    '```',
    '',
    '## Smoke',
    '```',
    validation.smoke_log,
    '```',
    '',
    '## Eval harness',
    '```',
    validation.eval_log,
    '```',
  ].join('\n');

  writeFileSync(join(iterDir, 'validation_report.md'), `${report}\n`, 'utf8');
  writeFileSync(
    join(iterDir, 'validation_report.json'),
    `${JSON.stringify({ summary, validation }, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(
    join(iterDir, 'smoke_results.json'),
    `${JSON.stringify({ ok: validation.smoke_ok, log: validation.smoke_log }, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(
    join(iterDir, 'eval_results.json'),
    `${JSON.stringify({ ok: validation.eval_ok, log: validation.eval_log }, null, 2)}\n`,
    'utf8',
  );

  touchRun(runRoot, run, {
    latest_validation_completed_at: new Date().toISOString(),
  });

  if (!validation.smoke_ok || !validation.eval_ok) {
    console.error('phase4: validation reported failures (see validation_report.md)');
    process.exitCode = 1;
    return;
  }

  console.log(`phase4 ok: iteration-${iter}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
