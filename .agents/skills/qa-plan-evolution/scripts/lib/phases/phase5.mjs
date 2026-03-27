#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  assertExecutedQaPlanScorecard,
  buildQaPlanOutcomeFromScorecard,
} from '../qaPlanScorecard.mjs';
import { scoreChallengerVsChampion } from '../scoreCandidate.mjs';
import { hashJsonPayload } from '../workflowState.mjs';
import { mutationSignature } from '../mutationPlanner.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchRun,
} from './common.mjs';

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, runRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);

  const iter = parseInt(String(args.iteration ?? task.current_iteration ?? 1), 10) || 1;
  const iterDir = join(runRoot, 'candidates', `iteration-${iter}`);
  const valPath = join(iterDir, 'validation_report.json');
  const val = JSON.parse(readFileSync(valPath, 'utf8'));
  const candidateScopePath = join(iterDir, 'candidate_scope.json');
  const candidateScope = (() => {
    try {
      return JSON.parse(readFileSync(candidateScopePath, 'utf8'));
    } catch {
      return {};
    }
  })();
  const selectedMutation = candidateScope.mutation ?? null;
  const benchmarkScorecard = val.validation?.scorecard ?? null;
  if (benchmarkScorecard) {
    assertExecutedQaPlanScorecard(benchmarkScorecard);
  }
  const validationSummary = {
    regression_count: val.validation?.regression_count ?? 0,
    smoke_ok: val.validation?.smoke_ok ?? false,
    eval_ok: val.validation?.eval_ok ?? false,
    contract_compliance_score: val.validation?.contract_compliance_score ?? 0,
    defect_recall_score: val.validation?.defect_recall_score ?? 0,
    knowledge_pack_coverage_score: val.validation?.knowledge_pack_coverage_score ?? 0,
  };

  const boardPath = join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`);
  const scoreboard = JSON.parse(readFileSync(boardPath, 'utf8'));
  const champion = scoreboard.champion ?? {};

  const outcome = benchmarkScorecard
    ? buildQaPlanOutcomeFromScorecard(benchmarkScorecard, validationSummary)
    : scoreChallengerVsChampion({
        profileId: task.benchmark_profile,
        validationSummary,
        championScoreboard: champion,
      });

  const scorePath = join(iterDir, 'score.json');
  writeFileSync(
    scorePath,
    `${JSON.stringify({ outcome, validation_summary: validationSummary }, null, 2)}\n`,
    'utf8',
  );

  const decision = [
    `# Decision (iteration ${iter})`,
    '',
    `- accept: ${outcome.accept}`,
    `- blocking_regression: ${outcome.blocking_regression}`,
    '',
    '```json',
    JSON.stringify(outcome.scores, null, 2),
    '```',
  ].join('\n');
  writeFileSync(join(iterDir, 'decision.md'), `${decision}\n`, 'utf8');

  const nextBoard = {
    ...scoreboard,
    iterations: [
      ...(scoreboard.iterations ?? []),
      {
        iteration: iter,
        accept: outcome.accept,
        scores: outcome.scores,
        meaningful_improvement: outcome.meaningful_improvement,
      },
    ],
  };

  writeFileSync(boardPath, `${JSON.stringify(nextBoard, null, 2)}\n`, 'utf8');

  const rejected = [...(run.rejected_iterations ?? [])];
  if (!outcome.accept) {
    rejected.push(iter);
  }

  touchRun(runRoot, run, {
    latest_score_completed_at: new Date().toISOString(),
    rejected_iterations: rejected,
    iteration_history: [
      ...(run.iteration_history ?? []),
      {
        iteration: iter,
        accept: outcome.accept,
        at: new Date().toISOString(),
        mutation_signature: selectedMutation ? mutationSignature(selectedMutation) : null,
        selected_observation_ids: selectedMutation?.source_observation_ids ?? [],
        generalization_scope: selectedMutation?.generalization_scope ?? null,
        validation_fingerprint: run.phase_receipts?.phase4?.fingerprint ?? null,
        score_fingerprint: hashJsonPayload({ outcome, validationSummary }),
        stop_reason: null,
      },
    ],
    consecutive_rejections: outcome.accept
      ? 0
      : (run.consecutive_rejections ?? 0) + 1,
  });

  console.log(
    `phase5 ok: iteration-${iter} accept=${outcome.accept} blocking=${outcome.blocking_regression}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
