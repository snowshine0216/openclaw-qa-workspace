#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeJson } from '../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import { DEFAULT_BENCHMARK_ROOT } from './lib/benchmarkV2.mjs';
import {
  buildBenchmarkRunFromArtifacts,
  executeGradingHarness,
  readRequiredRunArtifacts,
} from './lib/gradingHarness.mjs';
import {
  EXECUTED_BENCHMARK_COMPARE,
  PRIMARY_CONFIGURATION,
  REFERENCE_CONFIGURATION,
  materializeIterationComparison,
} from './lib/iterationCompareCommon.mjs';
import { writeScorecardForIteration } from './lib/scoreBenchmarkV2.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    benchmarkRoot: DEFAULT_BENCHMARK_ROOT,
    iteration: 1,
    defectAnalysisRunKey: null,
    enabledEvidenceModes: null,
    targetFeatureFamily: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--benchmark-root' && args[index + 1]) {
      options.benchmarkRoot = args[index + 1];
      index += 1;
    } else if (value === '--iteration' && args[index + 1]) {
      options.iteration = Number(args[index + 1]);
      index += 1;
    } else if (value === '--defect-analysis-run-key' && args[index + 1]) {
      options.defectAnalysisRunKey = args[index + 1];
      index += 1;
    } else if (value === '--enabled-evidence-mode' && args[index + 1]) {
      options.enabledEvidenceModes ??= [];
      options.enabledEvidenceModes.push(args[index + 1]);
      index += 1;
    } else if (value === '--target-feature-family' && args[index + 1]) {
      options.targetFeatureFamily = args[index + 1];
      index += 1;
    }
  }

  return options;
}

function buildBenchmarkMetadata(prepared) {
  return {
    benchmark_version: prepared.benchmarkManifest.benchmark_version,
    iteration: prepared.benchmarkContext.iteration,
    comparison_mode: EXECUTED_BENCHMARK_COMPARE,
    scoring_fidelity: 'executed',
    primary_configuration: PRIMARY_CONFIGURATION,
    reference_configuration: REFERENCE_CONFIGURATION,
    active_evidence_modes: prepared.benchmarkContext.active_evidence_modes,
    replay_enabled_by_operator: prepared.benchmarkContext.replay_enabled_by_operator,
    replay_source_identifier: prepared.benchmarkContext.replay_source_identifier,
    target_feature_family: prepared.benchmarkContext.target_feature_family ?? null,
  };
}

export async function runIterationCompare({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  skillRoot,
  iteration,
  defectAnalysisRunKey = null,
  enabledEvidenceModes = null,
  targetFeatureFamily = null,
  gradingHarness = null,
}) {
  const prepared = await materializeIterationComparison({
    benchmarkRoot,
    skillRoot,
    iteration,
    comparisonMode: EXECUTED_BENCHMARK_COMPARE,
    scoringFidelity: 'executed',
    defectAnalysisRunKey,
    enabledEvidenceModes,
    targetFeatureFamily,
  });
  const benchmarkRuns = [];

  for (const runDefinition of prepared.runDefinitions) {
    await executeGradingHarness(runDefinition, gradingHarness);
    const { grading, timing } = await readRequiredRunArtifacts(runDefinition.runDir);
    benchmarkRuns.push(
      buildBenchmarkRunFromArtifacts({
        evalId: runDefinition.evalId,
        configuration: runDefinition.configuration.configurationDir,
        runNumber: runDefinition.runNumber,
        grading,
        timing,
      }),
    );
  }

  const benchmarkJsonPath = join(prepared.iterationDir, 'benchmark.json');
  await writeJson(benchmarkJsonPath, {
    metadata: buildBenchmarkMetadata(prepared),
    runs: benchmarkRuns,
  });
  await writeFile(
    join(prepared.iterationDir, 'benchmark.md'),
    `# qa-plan-v2 iteration ${iteration}\n\nRuns: ${benchmarkRuns.length}\n`,
    'utf8',
  );

  const scorecardPath = await writeScorecardForIteration({
    benchmarkRoot,
    iterationDir: prepared.iterationDir,
    iteration,
    comparisonMode: EXECUTED_BENCHMARK_COMPARE,
    primaryConfiguration: PRIMARY_CONFIGURATION,
    referenceConfiguration: REFERENCE_CONFIGURATION,
    scoringFidelity: 'executed',
  });

  return {
    benchmarkJsonPath,
    scorecardPath,
    iterationDir: prepared.iterationDir,
    candidateSnapshotDir: prepared.candidateSnapshotDir,
  };
}

async function main() {
  const options = parseArgs(process.argv);
  const result = await runIterationCompare(options);
  console.log(`Benchmark JSON written to ${result.benchmarkJsonPath}`);
  console.log(`Scorecard written to ${result.scorecardPath}`);
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    const scriptName = join(__dirname, 'run_iteration_compare.mjs');
    console.error(`[${scriptName}] ${error.message}`);
    process.exitCode = 1;
  });
}
