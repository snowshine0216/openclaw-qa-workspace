import { loadLatestValidationEvidence } from '../latestValidationEvidence.mjs';

export async function collectSmokeRegressionObservations({ runRoot, task }) {
  const latestValidation = loadLatestValidationEvidence(runRoot);
  if (!latestValidation) {
    return {
      source_type: 'smoke_regressions',
      required: true,
      status: 'no_findings',
      observations: [],
      errors: [],
    };
  }

  const smokeOk = latestValidation.report.validation?.smoke_ok !== false;
  if (smokeOk) {
    return {
      source_type: 'smoke_regressions',
      required: true,
      status: 'no_findings',
      observations: [],
      errors: [],
    };
  }

  return {
    source_type: 'smoke_regressions',
    required: true,
    status: 'ok',
    observations: [
      {
        id: `obs-smoke-regression-${latestValidation.iteration}`,
        source_type: 'smoke_regressions',
        source_path: latestValidation.reportPath,
        summary: `Iteration ${latestValidation.iteration} introduced a blocking smoke regression.`,
        details: latestValidation.report.validation?.smoke_log || 'Smoke validation failed.',
        taxonomy_candidates: ['traceability_gap'],
        target_files: [`${task.target_skill_path}/package.json`],
        evals_affected: ['smoke_checks'],
        confidence: 'high',
        blocking: true,
      },
    ],
    errors: [],
  };
}
