import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function buildReplayTargetFiles(task, replayCase) {
  const targetFiles = [
    `${task.target_skill_path}/evals/evals.json`,
  ];

  if (replayCase.primary_phase === 'phase4a') {
    targetFiles.push(`${task.target_skill_path}/references/phase4a-contract.md`);
  }
  if (replayCase.primary_phase === 'phase5a') {
    targetFiles.push(`${task.target_skill_path}/references/review-rubric-phase5a.md`);
  }
  if (replayCase.primary_phase === 'phase5b') {
    targetFiles.push(`${task.target_skill_path}/references/review-rubric-phase5b.md`);
  }
  if (replayCase.primary_phase === 'phase7') {
    targetFiles.push(`${task.target_skill_path}/scripts/lib/finalPlanSummary.mjs`);
  }

  return [...new Set(targetFiles)];
}

function collectCaseBackedObservations(task, replayCases, sourcePath) {
  return replayCases.map((replayCase) => ({
    id: `obs-replay-case-${replayCase.case_id.toLowerCase()}`,
    source_type: 'replay_eval_misses',
    source_path: sourcePath,
    summary: `Replay case ${replayCase.case_id} must remain covered: ${replayCase.focus}.`,
    details: replayCase.focus,
    taxonomy_candidates: ['missing_scenario', 'traceability_gap'],
    target_files: buildReplayTargetFiles(task, replayCase),
    evals_affected: ['defect_recall_replay'],
    knowledge_pack_key: replayCase.knowledge_pack_key || task.knowledge_pack_key || null,
    confidence: replayCase.blocking ? 'high' : 'medium',
    blocking: replayCase.blocking === true,
  }));
}

export async function collectReplayEvalMissObservations({ repoRoot, task }) {
  const benchmarkRoot = join(
    repoRoot,
    task.target_skill_path,
    'benchmarks',
    'qa-plan-v2',
  );
  const benchmarkManifestPath = join(
    benchmarkRoot,
    'benchmark_manifest.json',
  );
  const casesPath = join(benchmarkRoot, 'cases.json');
  const historyPath = join(benchmarkRoot, 'history.json');
  if (!existsSync(benchmarkManifestPath) || !existsSync(casesPath) || !existsSync(historyPath)) {
    return {
      source_type: 'replay_eval_misses',
      required: true,
      status: 'missing_source',
      observations: [],
      errors: ['qa-plan-v2 benchmark artifacts are missing'],
    };
  }

  let replayCases;
  let history;
  try {
    replayCases = (readJson(casesPath).cases ?? []).filter(
      (caseDefinition) => caseDefinition.evidence_mode === 'retrospective_replay',
    );
    history = readJson(historyPath);
  } catch (error) {
    return {
      source_type: 'replay_eval_misses',
      required: true,
      status: 'unparseable',
      observations: [],
      errors: [error.message],
    };
  }

  if (replayCases.length === 0) {
    return {
      source_type: 'replay_eval_misses',
      required: true,
      status: 'no_findings',
      observations: [],
      errors: [],
    };
  }

  const championIteration = history.current_champion_iteration ?? 0;
  const championIterationDir = join(benchmarkRoot, `iteration-${championIteration}`);
  const scorecardPath = join(championIterationDir, 'scorecard.json');
  const benchmarkJsonPath = join(championIterationDir, 'benchmark.json');

  if (!existsSync(scorecardPath) || !existsSync(benchmarkJsonPath)) {
    return {
      source_type: 'replay_eval_misses',
      required: true,
      status: 'ok',
      observations: collectCaseBackedObservations(task, replayCases, casesPath),
      errors: [],
    };
  }

  try {
    const scorecard = readJson(scorecardPath);
    const replayMean = scorecard.mode_scores?.primary?.retrospective_replay?.mean_pass_rate;
    if (typeof replayMean === 'number' && replayMean < 1) {
      return {
        source_type: 'replay_eval_misses',
        required: true,
        status: 'ok',
        observations: [
          {
            id: `obs-replay-scorecard-iteration-${championIteration}`,
            source_type: 'replay_eval_misses',
            source_path: scorecardPath,
            summary: `Champion replay score is ${replayMean}, so retrospective replay gaps remain open.`,
            details: 'Replay benchmark scorecard shows unresolved replay cases against the current champion.',
            taxonomy_candidates: ['missing_scenario', 'traceability_gap'],
            target_files: [
              `${task.target_skill_path}/evals/evals.json`,
              `${task.target_skill_path}/references/phase4a-contract.md`,
              `${task.target_skill_path}/references/review-rubric-phase5a.md`,
              `${task.target_skill_path}/references/review-rubric-phase5b.md`,
            ],
            evals_affected: ['defect_recall_replay'],
            knowledge_pack_key: task.knowledge_pack_key || null,
            confidence: 'high',
            blocking: true,
          },
        ],
        errors: [],
      };
    }
  } catch (error) {
    return {
      source_type: 'replay_eval_misses',
      required: true,
      status: 'unparseable',
      observations: [],
      errors: [error.message],
    };
  }

  return {
    source_type: 'replay_eval_misses',
    required: true,
    status: 'no_findings',
    observations: [],
    errors: [],
  };
}
