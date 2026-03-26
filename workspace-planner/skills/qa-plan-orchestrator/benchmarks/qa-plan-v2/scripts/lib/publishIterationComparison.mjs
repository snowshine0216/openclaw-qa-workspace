import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { writeJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';
import { DEFAULT_BENCHMARK_ROOT } from './benchmarkV2.mjs';
import { benchmarkDefinitionRoot } from './benchmarkSkillPaths.mjs';
import {
  PRIMARY_CONFIGURATION,
  REFERENCE_CONFIGURATION,
  SYNTHETIC_STRUCTURAL_COMPARE,
  materializeIterationComparison,
} from './iterationCompareCommon.mjs';
import { writeScorecardForIteration } from './scoreBenchmarkV2.mjs';

function normalizeContent(content) {
  return String(content || '').replace(/\r\n/g, '\n');
}

async function readIfExists(path) {
  if (!existsSync(path)) {
    return '';
  }
  return readFile(path, 'utf8');
}

async function buildSnapshotCorpus(snapshotRoot) {
  const files = {
    skill: await readIfExists(join(snapshotRoot, 'SKILL.md')),
    reference: await readIfExists(join(snapshotRoot, 'reference.md')),
    readme: await readIfExists(join(snapshotRoot, 'README.md')),
    evals: await readIfExists(join(snapshotRoot, 'evals', 'evals.json')),
    phase4a: await readIfExists(join(snapshotRoot, 'references', 'phase4a-contract.md')),
    phase4b: await readIfExists(join(snapshotRoot, 'references', 'phase4b-contract.md')),
    phase5a: await readIfExists(join(snapshotRoot, 'references', 'review-rubric-phase5a.md')),
    phase5b: await readIfExists(join(snapshotRoot, 'references', 'review-rubric-phase5b.md')),
    phase6: await readIfExists(join(snapshotRoot, 'references', 'review-rubric-phase6.md')),
    finalPlanSummary: await readIfExists(join(snapshotRoot, 'scripts', 'lib', 'finalPlanSummary.mjs')),
  };

  let knowledgePack = null;
  const knowledgePackPath = join(snapshotRoot, 'knowledge-packs', 'report-editor', 'pack.json');
  if (existsSync(knowledgePackPath)) {
    knowledgePack = JSON.parse(await readFile(knowledgePackPath, 'utf8'));
  }

  return {
    text: Object.values(files).map(normalizeContent).join('\n'),
    knowledgePack,
  };
}

function makeExpectation(text, passed) {
  return {
    text,
    passed,
    evidence: passed ? `PASS: ${text}` : `FAIL: ${text}`,
  };
}

function includesText(corpus, pattern) {
  return corpus.text.toLowerCase().includes(String(pattern).toLowerCase());
}

function scoreExpectations(expectations) {
  const passed = expectations.filter((entry) => entry.passed).length;
  const failed = expectations.length - passed;
  return {
    expectations,
    summary: {
      passed,
      failed,
      total: expectations.length,
      pass_rate: expectations.length === 0 ? 1 : Number((passed / expectations.length).toFixed(4)),
    },
    execution_metrics: {
      tool_calls: 0,
      total_tool_calls: 0,
      total_steps: expectations.length,
      errors_encountered: failed,
      output_chars: 0,
      transcript_chars: 0,
    },
    timing: {
      total_duration_seconds: 1,
    },
    user_notes_summary: {
      uncertainties: [],
      needs_review: failed > 0 ? ['benchmark case requires remediation'] : [],
      workarounds: [],
    },
  };
}

function buildCaseExpectations(caseDefinition, corpus) {
  const expectations = [];
  const text = corpus.text;
  const commonChecks = {
    phase0: [
      makeExpectation('REPORT_STATE semantics remain documented', includesText(corpus, 'REPORT_STATE')),
      makeExpectation('Phase 0 runtime setup remains documented', includesText(corpus, 'phase0')),
    ],
    phase1: [
      makeExpectation('supporting issues remain context_only_no_defect_analysis', includesText(corpus, 'context_only_no_defect_analysis')),
      makeExpectation('support summaries are part of the runtime artifacts', includesText(corpus, 'supporting_issue_summary')),
    ],
    phase3: [
      makeExpectation('tavily-search is recorded before confluence fallback', includesText(corpus, 'tavily-search') && includesText(corpus, 'confluence')),
      makeExpectation('deep research ordering is documented', includesText(corpus, 'tavily-first') || includesText(corpus, 'tavily first')),
    ],
    phase4a: [
      makeExpectation('phase4a contract exists', text.includes('Phase 4a Contract')),
      makeExpectation('knowledge-pack mapping is required in phase4a', includesText(corpus, 'knowledge-pack item mapping') || includesText(corpus, 'required capability')),
    ],
    phase4b: [
      makeExpectation('phase4b contract exists', includesText(corpus, 'phase4b')),
      makeExpectation('canonical top-layer grouping remains documented', includesText(corpus, 'top-layer')),
    ],
    phase5a: [
      makeExpectation('Coverage Preservation Audit is present', includesText(corpus, 'Coverage Preservation Audit')),
      makeExpectation('Cross-Section Interaction Audit is present', includesText(corpus, 'Cross-Section Interaction Audit')),
    ],
    phase5b: [
      makeExpectation('[ANALOG-GATE] appears in release checkpoint flow', includesText(corpus, '[ANALOG-GATE]')),
      makeExpectation('Release recommendation enumerates analog gates', includesText(corpus, 'Release Recommendation') || includesText(corpus, 'release recommendation')),
    ],
    phase6: [
      makeExpectation('phase6 quality rubric exists', includesText(corpus, 'phase6')),
      makeExpectation('executable wording/quality pass remains documented', includesText(corpus, 'quality')),
    ],
    phase7: [
      makeExpectation('developer smoke artifact generation is implemented', includesText(corpus, 'developer_smoke_test_')),
      makeExpectation('final summary generation exists', includesText(corpus, 'Final Plan Summary')),
    ],
    docs: [
      makeExpectation('docs mention phase5a', includesText(corpus, 'phase5a')),
      makeExpectation('docs mention phase5b', includesText(corpus, 'phase5b')),
      makeExpectation('docs mention reference.md', includesText(corpus, 'reference.md')),
    ],
    holdout: [
      makeExpectation('phase model remains documented', includesText(corpus, 'phase5a') && includesText(corpus, 'phase5b')),
      makeExpectation('core eval surface still exists', includesText(corpus, 'eval_groups') || includesText(corpus, 'evals')),
    ],
  };

  expectations.push(...(commonChecks[caseDefinition.primary_phase] || []));

  const focusChecks = {
    'P4A-SDK-CONTRACT-001': [
      makeExpectation('SDK/API visible outcomes are called out', includesText(corpus, 'SDK/API visible outcomes') || includesText(corpus, 'sdk/api visible')),
    ],
    'P4A-MISSING-SCENARIO-001': [
      makeExpectation('template-based creation is captured', includesText(corpus, 'template-based creation')),
      makeExpectation('report builder interaction is captured', includesText(corpus, 'report builder interaction')),
    ],
    'P5A-INTERACTION-AUDIT-001': [
      makeExpectation('interaction pair coverage is represented', includesText(corpus, 'pause-mode prompts') && includesText(corpus, 'prompt editor open')),
    ],
    'P5B-ANALOG-GATE-001': [
      makeExpectation('analog gate save dialog completeness is enforced', includesText(corpus, 'save dialog completeness and interactivity')),
    ],
    'P7-DEV-SMOKE-001': [
      makeExpectation('developer smoke output derives from analog gates or P1', includesText(corpus, 'ANALOG-GATE') || includesText(corpus, '<P1>')),
    ],
    'DOC-SYNC-001': [
      makeExpectation('README and reference stay aligned', includesText(corpus, 'README.md') || includesText(corpus, 'reference.md')),
    ],
  };

  expectations.push(...(focusChecks[caseDefinition.case_id] || []));

  if (caseDefinition.knowledge_pack_key === 'report-editor') {
    expectations.push(
      makeExpectation('report-editor knowledge pack exists', Boolean(corpus.knowledgePack)),
    );
  }

  return expectations;
}

function buildSyntheticRunResult(runDefinition, corpus) {
  const expectations = buildCaseExpectations(runDefinition.caseDefinition, corpus);
  const grading = scoreExpectations(expectations);
  return {
    grading,
    timing: {
      total_duration_seconds: grading.timing.total_duration_seconds,
      duration_ms: grading.timing.total_duration_seconds * 1000,
      total_tokens: 0,
    },
  };
}

function buildBenchmarkRun({ runDefinition, grading }) {
  return {
    eval_id: runDefinition.evalId,
    configuration: runDefinition.configuration.configurationDir,
    run_number: runDefinition.runNumber,
    result: {
      pass_rate: grading.summary.pass_rate,
      passed: grading.summary.passed,
      failed: grading.summary.failed,
      total: grading.summary.total,
      time_seconds: grading.timing.total_duration_seconds,
      tokens: 0,
      tool_calls: 0,
      errors: grading.execution_metrics.errors_encountered,
    },
    expectations: grading.expectations,
    notes: grading.user_notes_summary.needs_review,
  };
}

function buildBenchmarkMetadata(prepared) {
  return {
    benchmark_version: prepared.benchmarkManifest.benchmark_version,
    iteration: prepared.benchmarkContext.iteration,
    comparison_mode: SYNTHETIC_STRUCTURAL_COMPARE,
    scoring_fidelity: 'synthetic',
    primary_configuration: PRIMARY_CONFIGURATION,
    reference_configuration: REFERENCE_CONFIGURATION,
    active_evidence_modes: prepared.benchmarkContext.active_evidence_modes,
    replay_enabled_by_operator: prepared.benchmarkContext.replay_enabled_by_operator,
    replay_source_identifier: prepared.benchmarkContext.replay_source_identifier,
    target_feature_family: prepared.benchmarkContext.target_feature_family ?? null,
  };
}

export async function publishIterationComparison({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  skillRoot,
  iteration,
  defectAnalysisRunKey = null,
  enabledEvidenceModes = null,
  targetFeatureFamily = null,
}) {
  const prepared = await materializeIterationComparison({
    benchmarkRoot,
    skillRoot,
    iteration,
    comparisonMode: SYNTHETIC_STRUCTURAL_COMPARE,
    scoringFidelity: 'synthetic',
    defectAnalysisRunKey,
    enabledEvidenceModes,
    targetFeatureFamily,
  });
  const candidateCorpus = await buildSnapshotCorpus(prepared.candidateSnapshotDir);
  const championCorpus = await buildSnapshotCorpus(prepared.currentChampionSnapshot);
  const benchmarkRuns = [];

  for (const runDefinition of prepared.runDefinitions) {
    const corpus = runDefinition.configuration.configurationDir === PRIMARY_CONFIGURATION
      ? candidateCorpus
      : championCorpus;
    const synthetic = buildSyntheticRunResult(runDefinition, corpus);

    await writeJson(join(runDefinition.runDir, 'grading.json'), synthetic.grading);
    await writeJson(join(runDefinition.runDir, 'timing.json'), synthetic.timing);
    await writeFile(
      join(runDefinition.runDir, 'outputs', 'result.md'),
      `# ${runDefinition.caseDefinition.case_id}\n`,
      'utf8',
    );
    benchmarkRuns.push(buildBenchmarkRun({
      runDefinition,
      grading: synthetic.grading,
    }));
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
    comparisonMode: SYNTHETIC_STRUCTURAL_COMPARE,
    primaryConfiguration: PRIMARY_CONFIGURATION,
    referenceConfiguration: REFERENCE_CONFIGURATION,
    scoringFidelity: 'synthetic',
  });

  return {
    benchmarkJsonPath,
    scorecardPath,
    iterationDir: prepared.iterationDir,
    candidateSnapshotDir: prepared.candidateSnapshotDir,
  };
}
