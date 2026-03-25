import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
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
const SUPPORTED_EVIDENCE_MODES = ['blind_pre_defect', 'retrospective_replay', 'holdout_regression'];
const BLIND_BUNDLE_TYPE = 'blind_pre_defect_bundle';
const BLIND_CUTOFF_POLICY = 'all_customer_issues_only';
const BLIND_INCLUDE_CLASS = 'customer';
const BLIND_EXCLUDE_CLASS = 'non_customer';
const BLIND_PROHIBITED_MATERIAL_TYPES = new Set([
  'defect_analysis_run',
  'defect_replay_source',
  'gap_analysis',
  'postmortem',
  'retrospective_analysis',
]);

function getGroupLabel(kind) {
  return kind.replace(/_/g, ' ');
}

function getBlockingLabel(blocking) {
  return blocking ? 'blocking' : 'advisory';
}

function buildFixtureIndex(fixturesDocument) {
  return new Map((fixturesDocument.fixtures || []).map((fixture) => [fixture.fixture_id, fixture]));
}

function buildBlindPolicy(caseDefinition) {
  if (!caseDefinition.blind_policy) {
    return [];
  }
  return [
    `Blind evidence policy: use customer issues only under ${caseDefinition.blind_policy.cutoff_policy}.`,
    'Blind evidence policy: exclude non-customer issues.',
  ];
}

function hydrateCaseDefinition(caseDefinition, fixtureIndex) {
  if (caseDefinition.evidence_mode !== 'blind_pre_defect') {
    return caseDefinition;
  }
  const blindFixture = fixtureIndex.get(caseDefinition.fixture_refs[0]);
  if (!blindFixture) {
    return caseDefinition;
  }
  return {
    ...caseDefinition,
    blind_fixture_id: blindFixture.fixture_id,
    blind_policy: {
      cutoff_policy: blindFixture.cutoff_policy,
      issue_scope: blindFixture.issue_scope,
    },
  };
}

function ensureBlindFixtureType(caseDefinition, blindFixture) {
  if (!blindFixture || blindFixture.type !== BLIND_BUNDLE_TYPE) {
    throw new Error(`case ${caseDefinition.case_id} must reference exactly one blind_pre_defect_bundle`);
  }
  if (blindFixture.cutoff_policy !== BLIND_CUTOFF_POLICY) {
    throw new Error(`case ${caseDefinition.case_id} blind fixture must use cutoff_policy ${BLIND_CUTOFF_POLICY}`);
  }
}

function validateBlindIssueScope(caseDefinition, blindFixture) {
  if (!blindFixture.issue_scope || !Array.isArray(blindFixture.issue_scope.include_issue_classes) || !Array.isArray(blindFixture.issue_scope.exclude_issue_classes)) {
    throw new Error(`case ${caseDefinition.case_id} blind fixture must define issue_scope include/exclude classes`);
  }
  if (!blindFixture.issue_scope.include_issue_classes.includes(BLIND_INCLUDE_CLASS) ||
    !blindFixture.issue_scope.exclude_issue_classes.includes(BLIND_EXCLUDE_CLASS)) {
    throw new Error(`case ${caseDefinition.case_id} blind fixture must include customer and exclude non_customer issue classes`);
  }
}

function validateBlindMaterials(caseDefinition, blindFixture) {
  if (!Array.isArray(blindFixture.materials) || blindFixture.materials.length === 0) {
    throw new Error(`case ${caseDefinition.case_id} blind fixture must include materials`);
  }
  for (const material of blindFixture.materials) {
    if (BLIND_PROHIBITED_MATERIAL_TYPES.has(material.material_type)) {
      throw new Error(`case ${caseDefinition.case_id} blind fixture must exclude replay and retrospective artifacts`);
    }
    const issueClass = String(material.issue_class || '').trim().toLowerCase();
    if (material.material_type === 'jira_non_customer_issue' || issueClass === BLIND_EXCLUDE_CLASS) {
      throw new Error(`case ${caseDefinition.case_id} blind fixture must exclude non-customer issues`);
    }
  }
}

function validateBlindFixture(caseDefinition, blindFixture) {
  ensureBlindFixtureType(caseDefinition, blindFixture);
  validateBlindIssueScope(caseDefinition, blindFixture);
  validateBlindMaterials(caseDefinition, blindFixture);
}

function validateCaseDefinition(caseDefinition, fixtureIndex) {
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

  for (const field of requiredFields) {
    if (!(field in caseDefinition)) {
      throw new Error(`case ${caseDefinition.case_id || '<unknown>'} is missing required field: ${field}`);
    }
  }
  if (!Array.isArray(caseDefinition.fixture_refs)) {
    throw new Error(`case ${caseDefinition.case_id} field fixture_refs must be an array`);
  }
  if (!SUPPORTED_EVIDENCE_MODES.includes(caseDefinition.evidence_mode)) {
    throw new Error(`case ${caseDefinition.case_id} has unsupported evidence_mode: ${caseDefinition.evidence_mode}`);
  }
  for (const fixtureRef of caseDefinition.fixture_refs) {
    if (!fixtureIndex.has(fixtureRef)) {
      throw new Error(`case ${caseDefinition.case_id} references missing fixture id: ${fixtureRef}`);
    }
  }
  if (caseDefinition.evidence_mode === 'blind_pre_defect') {
    if (caseDefinition.fixture_refs.length !== 1) {
      throw new Error(`case ${caseDefinition.case_id} must reference exactly one blind_pre_defect_bundle`);
    }
    validateBlindFixture(caseDefinition, fixtureIndex.get(caseDefinition.fixture_refs[0]));
  }
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
    ...buildBlindPolicy(caseDefinition),
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
    blind_fixture_id: caseDefinition.blind_fixture_id || null,
    blind_policy: caseDefinition.blind_policy || null,
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
    blind_fixture_id: caseDefinition.blind_fixture_id || null,
    blind_policy: caseDefinition.blind_policy || null,
  };
}

function buildConfigurationRuns({
  iterationDir,
  evalDir,
  configurationDir,
  runsPerConfiguration,
}) {
  const runs = [];
  for (let runNumber = 1; runNumber <= runsPerConfiguration; runNumber += 1) {
    const runDir = join(evalDir, configurationDir, `run-${runNumber}`);
    runs.push({
      run_number: runNumber,
      output_dir: relative(iterationDir, join(runDir, 'outputs')),
      run_dir: relative(iterationDir, runDir),
    });
  }
  return runs;
}

export async function validateCaseMatrix({
  benchmarkManifest,
  casesDocument,
  fixturesDocument = { fixtures: [] },
}) {
  const caseIds = new Set(casesDocument.cases.map((entry) => entry.case_id));
  const fixtureIndex = buildFixtureIndex(fixturesDocument);

  for (const caseDefinition of casesDocument.cases) {
    validateCaseDefinition(caseDefinition, fixtureIndex);
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
  const fixturesDocument = await loadJson(join(benchmarkRoot, 'fixtures_manifest.json'));
  const fixtureIndex = buildFixtureIndex(fixturesDocument);

  await validateCaseMatrix({ benchmarkManifest, casesDocument, fixturesDocument });
  await seedChampionSnapshot(skillRoot, snapshotDir);
  const resolvedCases = casesDocument.cases.map((caseDefinition) => hydrateCaseDefinition(caseDefinition, fixtureIndex));

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
    case_count: resolvedCases.length,
    evidence_mode_counts: resolvedCases.reduce((accumulator, caseDefinition) => {
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
    skill_path: relative(benchmarkRoot, skillRoot) || '.',
    workspace: '.',
    iteration,
    iteration_dir: relative(benchmarkRoot, iterationDir) || '.',
    benchmark_version: benchmarkManifest.benchmark_version,
    tasks: [],
  };

  for (const [index, caseDefinition] of resolvedCases.entries()) {
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
      blind_fixture_id: caseDefinition.blind_fixture_id || null,
      blind_policy: caseDefinition.blind_policy || null,
      prompt: metadata.prompt,
      expectations: metadata.assertions,
      runs_per_configuration: benchmarkManifest.runs_per_configuration,
      with_skill_runs: buildConfigurationRuns({
        iterationDir,
        evalDir,
        configurationDir: 'with_skill',
        runsPerConfiguration: benchmarkManifest.runs_per_configuration,
      }),
      without_skill_runs: buildConfigurationRuns({
        iterationDir,
        evalDir,
        configurationDir: 'without_skill',
        runsPerConfiguration: benchmarkManifest.runs_per_configuration,
      }),
      with_skill: {
        output_dir: relative(iterationDir, join(evalDir, 'with_skill', 'run-1', 'outputs')),
        run_dir: relative(iterationDir, join(evalDir, 'with_skill', 'run-1')),
        instruction: `Execute qa-plan-orchestrator benchmark case ${caseDefinition.case_id} with the current champion skill snapshot loaded. Save outputs under ${relative(iterationDir, join(evalDir, 'with_skill', 'run-1', 'outputs'))}.`,
      },
      without_skill: {
        output_dir: relative(iterationDir, join(evalDir, 'without_skill', 'run-1', 'outputs')),
        run_dir: relative(iterationDir, join(evalDir, 'without_skill', 'run-1')),
        instruction: `Execute qa-plan-orchestrator benchmark case ${caseDefinition.case_id} without the skill as the baseline. Save outputs under ${relative(iterationDir, join(evalDir, 'without_skill', 'run-1', 'outputs'))}.`,
      },
    });
  }

  await writeJson(join(iterationDir, 'spawn_manifest.json'), manifest);
  await writeFile(join(iterationDir, 'README.md'), [
    '# Iteration 0',
    '',
    'This is the real multi-case baseline for `qa-plan-v2`.',
    '',
    `Cases: ${resolvedCases.length}`,
    `Blocking: ${(benchmarkManifest.blocking_case_ids || []).length}`,
    `Advisory: ${(benchmarkManifest.advisory_case_ids || []).length}`,
    '',
    'Use `spawn_manifest.json` to execute the baseline against the current champion skill.',
  ].join('\n'), 'utf8');

  return {
    iterationDir,
    snapshotDir,
    caseCount: resolvedCases.length,
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

function updateBaselineHistory(history, completedAt) {
  const iterations = Array.isArray(history.iterations) ? history.iterations : [];
  const normalizedIterations = iterations.map((entry) => (
    entry.iteration === 0
      ? {
          ...entry,
          grading_result: 'baseline_executed',
          is_current_champion: true,
          completed_at: entry.completed_at ?? completedAt,
        }
      : {
          ...entry,
          is_current_champion: false,
        }
  ));
  if (!normalizedIterations.some((entry) => entry.iteration === 0)) {
    normalizedIterations.unshift({
      iteration: 0,
      label: 'baseline',
      role: 'champion_seed',
      skill_snapshot: 'iteration-0/champion_snapshot',
      grading_result: 'baseline_executed',
      is_current_champion: true,
      completed_at: completedAt,
    });
  }
  return {
    ...history,
    current_champion_iteration: 0,
    iterations: normalizedIterations,
  };
}

export async function finalizeBenchmarkV2Baseline({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  iteration = 0,
}) {
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const benchmarkJsonPath = join(iterationDir, 'benchmark.json');
  const benchmarkMarkdownPath = join(iterationDir, 'benchmark.md');
  const manifestPath = join(benchmarkRoot, 'benchmark_manifest.json');
  const historyPath = join(benchmarkRoot, 'history.json');
  const contextPath = join(iterationDir, 'benchmark_context.json');
  const completedAt = new Date().toISOString();

  await Promise.all([
    loadJson(benchmarkJsonPath),
    readFile(benchmarkMarkdownPath, 'utf8'),
  ]);

  const [manifest, history, context] = await Promise.all([
    loadJson(manifestPath),
    loadJson(historyPath),
    loadJson(contextPath),
  ]);

  await Promise.all([
    writeJson(manifestPath, {
      ...manifest,
      status: 'frozen_matrix_executed',
      executed_at: manifest.executed_at ?? completedAt,
    }),
    writeJson(historyPath, updateBaselineHistory(history, completedAt)),
    writeJson(contextPath, {
      ...context,
      status: 'executed_aggregated',
      aggregated_at: context.aggregated_at ?? completedAt,
    }),
  ]);

  return {
    manifestStatus: 'frozen_matrix_executed',
    historyStatus: 'baseline_executed',
    contextStatus: 'executed_aggregated',
  };
}
