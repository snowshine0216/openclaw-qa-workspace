import { collectTargetEvalFailureObservations } from './targetEvalFailures.mjs';
import { collectContractDriftObservations } from './contractDrift.mjs';
import { collectSmokeRegressionObservations } from './smokeRegressions.mjs';
import { collectReplayEvalMissObservations } from './replayEvalMisses.mjs';
import { collectKnowledgePackCoverageObservations } from './knowledgePackCoverage.mjs';
import { collectDefectsCrossAnalysisObservations } from './defectsCrossAnalysis.mjs';

const SOURCE_HANDLERS = {
  target_eval_failures: collectTargetEvalFailureObservations,
  contract_drift: collectContractDriftObservations,
  smoke_regressions: collectSmokeRegressionObservations,
  replay_eval_misses: collectReplayEvalMissObservations,
  knowledge_pack_coverage: collectKnowledgePackCoverageObservations,
  defects_cross_analysis: collectDefectsCrossAnalysisObservations,
};

export function normalizeGapSourceDefinitions(profile) {
  const rawSources = profile.gap_sources ?? [];
  return rawSources.map((source) => {
    if (typeof source === 'string') {
      return {
        id: source,
        required: true,
      };
    }
    if (!source || typeof source !== 'object' || typeof source.id !== 'string') {
      throw new Error(`Invalid gap source definition for profile ${profile.id}`);
    }
    return {
      id: source.id,
      required: source.required !== false,
    };
  });
}

export async function collectGapSourceResults(context) {
  const enabledSources = normalizeGapSourceDefinitions(context.profile);
  const results = [];
  for (const sourceDefinition of enabledSources) {
    const sourceType = sourceDefinition.id;
    const handler = SOURCE_HANDLERS[sourceType];
    if (!handler) {
      results.push({
        source_type: sourceType,
        required: sourceDefinition.required,
        status: 'blocked',
        observations: [],
        errors: [`unsupported gap source: ${sourceType}`],
      });
      continue;
    }
    const result = await handler({
      ...context,
      sourceDefinition,
    });
    results.push({
      ...result,
      required: sourceDefinition.required,
    });
  }
  return results;
}

export function findBlockingGapSources(sourceResults) {
  return sourceResults.filter(
    (result) =>
      result.required !== false &&
      ['missing_source', 'unparseable', 'blocked'].includes(result.status),
  );
}
