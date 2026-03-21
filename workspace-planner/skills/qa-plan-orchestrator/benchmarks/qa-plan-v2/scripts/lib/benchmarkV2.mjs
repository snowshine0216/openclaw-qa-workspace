import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BASELINE_CONFIGS,
  buildComparisonMetadata as buildBaselineComparisonMetadata,
  collectGradingStatus,
  loadJson,
  seedChampionSnapshot,
  writeJson,
} from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DEFAULT_BENCHMARK_ROOT = resolve(__dirname, '../..');
export const DEFAULT_SKILL_ROOT = resolve(__dirname, '../../../..');
export const DEFAULT_ITERATION = 0;

function getGroupLabel(kind) {
  return kind.replace(/_/g, ' ');
}

function getBlockingLabel(blocking) {
  return blocking ? 'blocking' : 'advisory';
}

export function getIterationDir(benchmarkRoot, iteration = DEFAULT_ITERATION) {
  return join(benchmarkRoot, `iteration-${iteration}`);
}

export function buildCasePrompt(caseDefinition) {
  const featureLine = caseDefinition.feature_id === 'DOCS'
    ? 'Use the qa-plan-orchestrator documentation set as the target artifact family.'
    : `Use feature ${caseDefinition.feature_id} as the primary benchmark feature.`;

  return [
    `Benchmark case ${caseDefinition.case_id} for qa-plan-orchestrator.`,
    featureLine,
    `Feature family: ${caseDefinition.feature_family}.`,
    `Knowledge pack: ${caseDefinition.knowledge_pack_key}.`,
    `Primary phase/checkpoint under test: ${caseDefinition.primary_phase}.`,
    `Case family: ${getGroupLabel(caseDefinition.kind)}.`,
    `Evidence mode: ${caseDefinition.evidence_mode.replace(/_/g, ' ')}.`,
    `Priority: ${getBlockingLabel(caseDefinition.blocking)}.`,
    `Benchmark profile: ${caseDefinition.benchmark_profile}.`,
    `Fixture references: ${caseDefinition.fixture_refs.length ? caseDefinition.fixture_refs.join(', ') : 'none'}.`,
    `Focus: ${caseDefinition.focus}.`,
    'Generate or review only the artifacts needed to demonstrate whether the skill satisfies this benchmark case.',
    'Preserve the orchestrator contract and keep outputs aligned with the current qa-plan-orchestrator phase model.',
  ].join(' ');
}

export function buildCaseAssertions(caseDefinition) {
  return [
    `[${caseDefinition.kind}][${getBlockingLabel(caseDefinition.blocking)}] Case focus is explicitly covered: ${caseDefinition.focus}`,
    `[${caseDefinition.kind}][${getBlockingLabel(caseDefinition.blocking)}] Output aligns with primary phase ${caseDefinition.primary_phase}`,
  ];
}

export function buildCaseEvalMetadata(caseDefinition, evalId) {
  return {
    eval_id: evalId,
    eval_name: caseDefinition.case_id.toLowerCase(),
    prompt: buildCasePrompt(caseDefinition),
    assertions: buildCaseAssertions(caseDefinition),
    case_id: caseDefinition.case_id,
    feature_id: caseDefinition.feature_id,
    feature_family: caseDefinition.feature_family,
    knowledge_pack_key: caseDefinition.knowledge_pack_key,
    primary_phase: caseDefinition.primary_phase,
    eval_group: caseDefinition.kind,
    evidence_mode: caseDefinition.evidence_mode,
    blocking: caseDefinition.blocking,
    fixture_refs: caseDefinition.fixture_refs,
    benchmark_profile: caseDefinition.benchmark_profile,
  };
}

export function buildComparisonMetadata({
  benchmarkVersion,
  iteration,
  configurationDir,
  evalId,
  runNumber,
  snapshotPath,
  executorModel = null,
  reasoningEffort = null,
  caseDefinition,
}) {
  return {
    ...buildBaselineComparisonMetadata({
      benchmarkVersion,
      iteration,
      configurationDir,
      evalId,
      runNumber,
      snapshotPath,
      executorModel,
      reasoningEffort,
    }),
    case_id: caseDefinition.case_id,
    feature_id: caseDefinition.feature_id,
    feature_family: caseDefinition.feature_family,
    knowledge_pack_key: caseDefinition.knowledge_pack_key,
    primary_phase: caseDefinition.primary_phase,
    case_kind: caseDefinition.kind,
    evidence_mode: caseDefinition.evidence_mode,
    blocking: caseDefinition.blocking,
    fixture_refs: caseDefinition.fixture_refs,
    benchmark_profile: caseDefinition.benchmark_profile,
  };
}

function buildConfigurationRuns({
  evalDir,
  configurationDir,
  runsPerConfiguration,
}) {
  const runs = [];
  for (let runNumber = 1; runNumber <= runsPerConfiguration; runNumber += 1) {
    const runDir = join(evalDir, configurationDir, `run-${runNumber}`);
    runs.push({
      run_number: runNumber,
      output_dir: join(runDir, 'outputs'),
      run_dir: runDir,
    });
  }
  return runs;
}

export async function validateCaseMatrix({
  benchmarkManifest,
  casesDocument,
}) {
  const caseIds = new Set(casesDocument.cases.map((entry) => entry.case_id));
  const requiredFields = [
    'case_id',
    'feature_id',
    'feature_family',
    'knowledge_pack_key',
    'primary_phase',
    'kind',
    'evidence_mode',
    'blocking',
    'fixture_refs',
    'benchmark_profile',
    'focus',
  ];

  for (const caseDefinition of casesDocument.cases) {
    for (const field of requiredFields) {
      if (!(field in caseDefinition)) {
        throw new Error(`case ${caseDefinition.case_id || '<unknown>'} is missing required field: ${field}`);
      }
    }
    if (!Array.isArray(caseDefinition.fixture_refs)) {
      throw new Error(`case ${caseDefinition.case_id} field fixture_refs must be an array`);
    }
    if (!['blind_pre_defect', 'retrospective_replay', 'holdout_regression'].includes(caseDefinition.evidence_mode)) {
      throw new Error(`case ${caseDefinition.case_id} has unsupported evidence_mode: ${caseDefinition.evidence_mode}`);
    }
  }

  for (const caseId of benchmarkManifest.blocking_case_ids || []) {
    if (!caseIds.has(caseId)) {
      throw new Error(`benchmark_manifest.json references missing blocking case id: ${caseId}`);
    }
  }

  for (const caseId of benchmarkManifest.advisory_case_ids || []) {
    if (!caseIds.has(caseId)) {
      throw new Error(`benchmark_manifest.json references missing advisory case id: ${caseId}`);
    }
  }
}

export async function prepareBenchmarkV2Baseline({
  skillRoot = DEFAULT_SKILL_ROOT,
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = DEFAULT_ITERATION,
  executorModel = null,
  reasoningEffort = null,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const snapshotDir = join(iterationDir, 'champion_snapshot');
  const benchmarkManifest = await loadJson(join(benchmarkRoot, 'benchmark_manifest.json'));
  const casesDocument = await loadJson(join(benchmarkRoot, 'cases.json'));

  await validateCaseMatrix({ benchmarkManifest, casesDocument });
  await seedChampionSnapshot(skillRoot, snapshotDir);

  const benchmarkContext = {
    benchmark_version: benchmarkManifest.benchmark_version,
    iteration,
    status: 'prepared_pending_execution',
    comparison_mode: 'baseline_value',
    primary_configuration: 'with_skill',
    reference_configuration: 'without_skill',
    skill_snapshot_role: 'champion_seed',
    skill_snapshot_path: relative(benchmarkRoot, snapshotDir),
    executor_model: executorModel,
    reasoning_effort: reasoningEffort,
    runs_per_configuration: benchmarkManifest.runs_per_configuration,
    prepared_at: new Date().toISOString(),
    case_count: casesDocument.cases.length,
    evidence_mode_counts: casesDocument.cases.reduce((accumulator, caseDefinition) => {
      accumulator[caseDefinition.evidence_mode] = (accumulator[caseDefinition.evidence_mode] || 0) + 1;
      return accumulator;
    }, {}),
    blocking_case_ids: benchmarkManifest.blocking_case_ids,
    advisory_case_ids: benchmarkManifest.advisory_case_ids,
  };
  await writeJson(join(iterationDir, 'benchmark_context.json'), benchmarkContext);

  const historyPath = join(benchmarkRoot, 'history.json');
  await writeJson(historyPath, {
    benchmark_version: benchmarkManifest.benchmark_version,
    started_at: benchmarkManifest.frozen_at,
    current_champion_iteration: 0,
    iterations: [
      {
        iteration: 0,
        label: 'baseline',
        role: 'champion_seed',
        skill_snapshot: relative(benchmarkRoot, snapshotDir),
        grading_result: 'pending_baseline_execution',
        is_current_champion: true,
      },
    ],
  });

  const manifest = {
    skill_name: benchmarkManifest.skill_name,
    skill_path: skillRoot,
    workspace: benchmarkRoot,
    iteration,
    iteration_dir: iterationDir,
    benchmark_version: benchmarkManifest.benchmark_version,
    tasks: [],
  };

  for (const [index, caseDefinition] of casesDocument.cases.entries()) {
    const evalId = index + 1;
    const evalDir = join(iterationDir, `eval-${evalId}`);
    const metadata = buildCaseEvalMetadata(caseDefinition, evalId);
    await writeJson(join(evalDir, 'eval_metadata.json'), metadata);

    for (const configurationDir of BASELINE_CONFIGS) {
      for (let runNumber = 1; runNumber <= benchmarkManifest.runs_per_configuration; runNumber += 1) {
        const runDir = join(evalDir, configurationDir, `run-${runNumber}`);
        await mkdir(join(runDir, 'outputs'), { recursive: true });
        await writeJson(join(runDir, 'eval_metadata.json'), metadata);
        await writeJson(join(runDir, 'comparison_metadata.json'), buildComparisonMetadata({
          benchmarkVersion: benchmarkManifest.benchmark_version,
          iteration,
          configurationDir,
          evalId,
          runNumber,
          snapshotPath: relative(benchmarkRoot, snapshotDir),
          executorModel,
          reasoningEffort,
          caseDefinition,
        }));
      }
    }

    manifest.tasks.push({
      eval_id: evalId,
      eval_name: metadata.eval_name,
      case_id: caseDefinition.case_id,
      feature_id: caseDefinition.feature_id,
      feature_family: caseDefinition.feature_family,
      knowledge_pack_key: caseDefinition.knowledge_pack_key,
      primary_phase: caseDefinition.primary_phase,
      kind: caseDefinition.kind,
      evidence_mode: caseDefinition.evidence_mode,
      blocking: caseDefinition.blocking,
      fixture_refs: caseDefinition.fixture_refs,
      benchmark_profile: caseDefinition.benchmark_profile,
      prompt: metadata.prompt,
      expectations: metadata.assertions,
      runs_per_configuration: benchmarkManifest.runs_per_configuration,
      with_skill_runs: buildConfigurationRuns({
        evalDir,
        configurationDir: 'with_skill',
        runsPerConfiguration: benchmarkManifest.runs_per_configuration,
      }),
      without_skill_runs: buildConfigurationRuns({
        evalDir,
        configurationDir: 'without_skill',
        runsPerConfiguration: benchmarkManifest.runs_per_configuration,
      }),
      with_skill: {
        output_dir: join(evalDir, 'with_skill', 'run-1', 'outputs'),
        run_dir: join(evalDir, 'with_skill', 'run-1'),
        instruction: `Execute qa-plan-orchestrator benchmark case ${caseDefinition.case_id} with the current champion skill snapshot loaded. Save outputs under ${join(evalDir, 'with_skill', 'run-1', 'outputs')}.`,
      },
      without_skill: {
        output_dir: join(evalDir, 'without_skill', 'run-1', 'outputs'),
        run_dir: join(evalDir, 'without_skill', 'run-1'),
        instruction: `Execute qa-plan-orchestrator benchmark case ${caseDefinition.case_id} without the skill as the baseline. Save outputs under ${join(evalDir, 'without_skill', 'run-1', 'outputs')}.`,
      },
    });
  }

  await writeJson(join(iterationDir, 'spawn_manifest.json'), manifest);
  await writeFile(join(iterationDir, 'README.md'), [
    '# Iteration 0',
    '',
    'This is the real multi-case baseline for `qa-plan-v2`.',
    '',
    `Cases: ${casesDocument.cases.length}`,
    `Blocking: ${(benchmarkManifest.blocking_case_ids || []).length}`,
    `Advisory: ${(benchmarkManifest.advisory_case_ids || []).length}`,
    '',
    'Use `spawn_manifest.json` to execute the baseline against the current champion skill.',
  ].join('\n'), 'utf8');

  return {
    iterationDir,
    snapshotDir,
    caseCount: casesDocument.cases.length,
    spawnManifestPath: join(iterationDir, 'spawn_manifest.json'),
  };
}

export async function collectBenchmarkV2GradingStatus(iterationDir) {
  return collectGradingStatus(iterationDir);
}

export async function listPreparedEvalDirs(iterationDir) {
  return (await readdir(iterationDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('eval-'))
    .map((entry) => entry.name)
    .sort();
}
