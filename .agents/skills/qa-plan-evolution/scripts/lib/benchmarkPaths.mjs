import { join, resolve } from 'node:path';
import { getBenchmarkRuntimeRoot } from '../../../lib/artifactRoots.mjs';

export const QA_PLAN_BENCHMARK_FAMILY = 'qa-plan-v2';

export function getQaPlanBenchmarkDefinitionRoot(repoRoot, targetSkillPath) {
  return join(resolve(repoRoot), targetSkillPath, 'benchmarks', QA_PLAN_BENCHMARK_FAMILY);
}

export function getQaPlanBenchmarkRuntimeRoot(repoRoot) {
  return getBenchmarkRuntimeRoot(
    'workspace-planner',
    'qa-plan-orchestrator',
    QA_PLAN_BENCHMARK_FAMILY,
    repoRoot,
  );
}

export function getQaPlanBenchmarkRoots(repoRoot, targetSkillPath) {
  return {
    definitionRoot: getQaPlanBenchmarkDefinitionRoot(repoRoot, targetSkillPath),
    runtimeRoot: getQaPlanBenchmarkRuntimeRoot(repoRoot),
  };
}
