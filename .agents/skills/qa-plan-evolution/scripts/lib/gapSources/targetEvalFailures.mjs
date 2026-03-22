import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadLatestValidationEvidence } from '../latestValidationEvidence.mjs';
import { runContractEvalValidation } from '../runTargetValidation.mjs';

function buildNoFindings() {
  return {
    source_type: 'target_eval_failures',
    required: true,
    status: 'no_findings',
    observations: [],
    errors: [],
  };
}

function buildSourceResult(observations) {
  return {
    source_type: 'target_eval_failures',
    required: true,
    status: observations.length > 0 ? 'ok' : 'no_findings',
    observations,
    errors: [],
  };
}

function buildObservations({ evalGroups, evalLog, sourcePath, summaryPrefix, detailsFallback, task, idSuffix }) {
  const normalizedLog = String(evalLog || '').toLowerCase();
  const failedGroups = evalGroups
    .filter((group) => group.policy === 'blocking')
    .filter((group) => normalizedLog.includes(String(group.id).toLowerCase()));
  const observations = failedGroups.map((group) => ({
    id: `obs-target-eval-${idSuffix}-${group.id}`,
    source_type: 'target_eval_failures',
    source_path: sourcePath,
    summary: `${summaryPrefix} eval group ${group.id} failed.`,
    details: group.prompt ?? detailsFallback ?? '',
    taxonomy_candidates: ['traceability_gap'],
    target_files: [`${task.target_skill_path}/evals/evals.json`],
    evals_affected: [group.id],
    confidence: 'medium',
    blocking: true,
  }));

  if (observations.length > 0) {
    return observations;
  }

  if (!normalizedLog) {
    return [];
  }

  return [
    {
      id: `obs-target-eval-failure-${idSuffix}`,
      source_type: 'target_eval_failures',
      source_path: sourcePath,
      summary: `${summaryPrefix} contract eval validation failed.`,
      details: detailsFallback ?? 'Eval validation failed.',
      taxonomy_candidates: ['traceability_gap'],
      target_files: [`${task.target_skill_path}/evals/evals.json`],
      evals_affected: ['contract_evals'],
      confidence: 'medium',
      blocking: true,
    },
  ];
}

export async function collectTargetEvalFailureObservations({ repoRoot, runRoot, task }) {
  const evalPath = join(repoRoot, task.target_skill_path, 'evals', 'evals.json');
  if (!existsSync(evalPath)) {
    return buildNoFindings();
  }

  let evalData;
  try {
    evalData = JSON.parse(readFileSync(evalPath, 'utf8'));
  } catch (error) {
    return {
      source_type: 'target_eval_failures',
      required: true,
      status: 'unparseable',
      observations: [],
      errors: [error.message],
    };
  }
  const evalGroups = Array.isArray(evalData.eval_groups) ? evalData.eval_groups : [];

  const latestValidation = loadLatestValidationEvidence(runRoot);
  if (latestValidation) {
    if (latestValidation.report.validation?.eval_ok !== false) {
      return buildNoFindings();
    }
    return buildSourceResult(
      buildObservations({
        evalGroups,
        evalLog: latestValidation.report.validation?.eval_log,
        sourcePath: latestValidation.reportPath,
        summaryPrefix: `Iteration ${latestValidation.iteration}`,
        detailsFallback: latestValidation.report.validation?.eval_log ?? 'Eval validation failed.',
        task,
        idSuffix: `iteration-${latestValidation.iteration}`,
      }),
    );
  }

  const currentValidation = runContractEvalValidation(join(repoRoot, task.target_skill_path));
  if (currentValidation.eval_ok !== false) {
    return buildNoFindings();
  }

  return buildSourceResult(
    buildObservations({
      evalGroups,
      evalLog: currentValidation.eval_log,
      sourcePath: join(task.target_skill_path, 'evals', 'run_evals.mjs'),
      summaryPrefix: 'Current target',
      detailsFallback: currentValidation.eval_log ?? 'Eval validation failed.',
      task,
      idSuffix: 'baseline',
    }),
  );
}
