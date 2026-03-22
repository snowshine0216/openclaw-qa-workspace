import { getProfileById } from './loadProfile.mjs';

export function scoreChallengerVsChampion({
  profileId,
  validationSummary,
  championScoreboard,
}) {
  const profile = getProfileById(profileId);
  const dims = profile.scoring_dimensions ?? ['regression_count'];

  const regressionCount = validationSummary.regression_count ?? 0;
  const smokeOk = validationSummary.smoke_ok !== false;
  const evalOk = validationSummary.eval_ok !== false;

  const scores = {
    defect_recall_score:
      validationSummary.defect_recall_score ?? championScoreboard?.defect_recall_score ?? 0,
    contract_compliance_score:
      validationSummary.contract_compliance_score ?? championScoreboard?.contract_compliance_score ?? 1,
    knowledge_pack_coverage_score:
      validationSummary.knowledge_pack_coverage_score ??
      championScoreboard?.knowledge_pack_coverage_score ??
      0,
    regression_count: regressionCount,
  };

  const blockingRegression = regressionCount > 0 || !smokeOk || !evalOk;

  let accept = !blockingRegression;
  if (accept) {
    for (const dim of dims) {
      if (dim === 'regression_count') {
        continue;
      }
      const championValue = championScoreboard?.[dim] ?? 0;
      if ((scores[dim] ?? 0) < championValue) {
        accept = false;
        break;
      }
    }
  }

  let meaningfulImprovement = false;
  if (accept) {
    meaningfulImprovement = dims.some((dim) => {
      if (dim === 'regression_count') {
        return false;
      }
      return (scores[dim] ?? 0) > (championScoreboard?.[dim] ?? 0);
    });
    if (!meaningfulImprovement && (championScoreboard?.contract_compliance_score ?? 0) === 0) {
      meaningfulImprovement = true;
    }
  }

  return {
    scores,
    accept,
    blocking_regression: blockingRegression,
    primary_metrics: dims,
    meaningful_improvement: meaningfulImprovement,
  };
}
