import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import {
  DEFAULT_BENCHMARK_ROOT,
  buildCaseEvalMetadata,
  getIterationDir,
} from './benchmarkV2.mjs';
import {
  benchmarkDefinitionRoot as getBenchmarkDefinitionRoot,
  benchmarkRuntimeRoot,
} from './benchmarkSkillPaths.mjs';
import {
  loadJson,
  seedChampionSnapshot,
  writeJson,
} from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

export const PRIMARY_CONFIGURATION = 'new_skill';
export const REFERENCE_CONFIGURATION = 'old_skill';
export const EXECUTED_BENCHMARK_COMPARE = 'executed_benchmark_compare';
export const SYNTHETIC_STRUCTURAL_COMPARE = 'synthetic_structural_compare';

function normalizeKey(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeEnabledEvidenceModes(enabledEvidenceModes) {
  if (!Array.isArray(enabledEvidenceModes)) {
    return null;
  }

  const normalized = enabledEvidenceModes
    .map((mode) => normalizeKey(mode))
    .filter(Boolean);
  return new Set(normalized);
}

function listActiveEvidenceModes(cases) {
  return [...new Set(cases.map((caseDefinition) => caseDefinition.evidence_mode))];
}

export function filterCasesForIteration(
  cases,
  { defectAnalysisRunKey = null, enabledEvidenceModes = null } = {},
) {
  const replaySourceIdentifier = normalizeKey(defectAnalysisRunKey);
  const enabledModes = normalizeEnabledEvidenceModes(enabledEvidenceModes);
  const replayEnabledByOperator =
    replaySourceIdentifier !== null &&
    (!enabledModes || enabledModes.has('retrospective_replay'));
  const filteredCases = cases.filter((caseDefinition) => {
    if (enabledModes && !enabledModes.has(caseDefinition.evidence_mode)) {
      return false;
    }
    return replayEnabledByOperator || caseDefinition.evidence_mode !== 'retrospective_replay';
  });

  return {
    filteredCases,
    activeEvidenceModes: listActiveEvidenceModes(filteredCases),
    replayEnabledByOperator,
    replaySourceIdentifier: replayEnabledByOperator ? replaySourceIdentifier : null,
  };
}

async function readKnowledgePackVersion(snapshotRoot) {
  const packPath = join(snapshotRoot, 'knowledge-packs', 'report-editor', 'pack.json');
  if (!existsSync(packPath)) {
    return null;
  }

  const pack = JSON.parse(await readFile(packPath, 'utf8'));
  return pack.version ? `report-editor-${pack.version}` : null;
}

function buildConfigurations({
  benchmarkRoot,
  candidateSnapshotDir,
  currentChampionSnapshot,
  currentChampionIteration,
  knowledgePackVersion,
}) {
  return [
    {
      configurationDir: PRIMARY_CONFIGURATION,
      semanticRole: 'candidate_skill',
      snapshotRoot: candidateSnapshotDir,
      snapshotLabel: 'candidate',
      snapshotPath: relative(benchmarkRoot, candidateSnapshotDir),
      parentChampionSnapshotPath: relative(benchmarkRoot, currentChampionSnapshot),
      knowledgePackVersion,
    },
    {
      configurationDir: REFERENCE_CONFIGURATION,
      semanticRole: 'champion_skill',
      snapshotRoot: currentChampionSnapshot,
      snapshotLabel: `champion-v${currentChampionIteration}`,
      snapshotPath: relative(benchmarkRoot, currentChampionSnapshot),
      parentChampionSnapshotPath: null,
      knowledgePackVersion: null,
    },
  ];
}

export function buildIterationComparisonMetadata({
  benchmarkVersion,
  comparisonMode,
  configuration,
  evalId,
  runNumber,
  caseDefinition,
}) {
  const metadata = {
    semantic_role: configuration.semanticRole,
    comparison_mode: comparisonMode,
    configuration_dir: configuration.configurationDir,
    skill_name: 'qa-plan-orchestrator',
    skill_snapshot_path: configuration.snapshotPath,
    skill_snapshot_label: configuration.snapshotLabel,
    model_name: null,
    reasoning_effort: null,
    knowledge_pack_version: configuration.knowledgePackVersion,
    benchmark_version: benchmarkVersion,
    eval_id: evalId,
    run_number: runNumber,
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

  if (configuration.parentChampionSnapshotPath) {
    metadata.parent_champion_snapshot_path = configuration.parentChampionSnapshotPath;
  }

  return metadata;
}

function buildBenchmarkContext({
  benchmarkManifest,
  comparisonMode,
  scoringFidelity,
  iteration,
  currentChampionIteration,
  benchmarkRoot,
  currentChampionSnapshot,
  candidateSnapshotDir,
  filteredCases,
  activeEvidenceModes,
  replayEnabledByOperator,
  replaySourceIdentifier,
  targetFeatureFamily,
}) {
  return {
    benchmark_version: benchmarkManifest.benchmark_version,
    iteration,
    comparison_mode: comparisonMode,
    scoring_fidelity: scoringFidelity,
    primary_configuration: PRIMARY_CONFIGURATION,
    reference_configuration: REFERENCE_CONFIGURATION,
    current_champion_iteration: currentChampionIteration,
    current_champion_snapshot: relative(benchmarkRoot, currentChampionSnapshot),
    candidate_snapshot: relative(benchmarkRoot, candidateSnapshotDir),
    prepared_at: new Date().toISOString(),
    case_count: filteredCases.length,
    active_evidence_modes: activeEvidenceModes,
    replay_source_identifier: replaySourceIdentifier,
    replay_enabled_by_operator: replayEnabledByOperator,
    target_feature_family: targetFeatureFamily ?? null,
  };
}

export async function materializeIterationComparison({
  benchmarkRoot = DEFAULT_BENCHMARK_ROOT,
  benchmarkDefinitionRoot: explicitDefinitionRoot = null,
  skillRoot,
  iteration,
  comparisonMode,
  scoringFidelity,
  defectAnalysisRunKey = null,
  enabledEvidenceModes = null,
  targetFeatureFamily = null,
}) {
  const benchmarkDefinitionRoot = explicitDefinitionRoot || getBenchmarkDefinitionRoot('qa-plan-v2');
  const benchmarkManifest = await loadJson(join(benchmarkDefinitionRoot, 'benchmark_manifest.json'));
  const casesDocument = await loadJson(join(benchmarkDefinitionRoot, 'cases.json'));
  const history = await loadJson(join(benchmarkRoot, 'history.json'));
  const currentChampionIteration = history.current_champion_iteration ?? 0;
  const currentChampionSnapshot = join(
    benchmarkRoot,
    `iteration-${currentChampionIteration}`,
    'champion_snapshot',
  );
  const iterationDir = getIterationDir(benchmarkRoot, iteration);
  const candidateSnapshotDir = join(iterationDir, 'candidate_snapshot');
  const benchmarkContextPath = join(iterationDir, 'benchmark_context.json');
  const filtered = filterCasesForIteration(casesDocument.cases, {
    defectAnalysisRunKey,
    enabledEvidenceModes,
  });
  const knowledgePackVersion = await readKnowledgePackVersion(skillRoot);
  const configurations = buildConfigurations({
    benchmarkRoot,
    candidateSnapshotDir,
    currentChampionSnapshot,
    currentChampionIteration,
    knowledgePackVersion,
  });
  const runDefinitions = [];

  await seedChampionSnapshot(skillRoot, candidateSnapshotDir);

  const benchmarkContext = buildBenchmarkContext({
    benchmarkManifest,
    comparisonMode,
    scoringFidelity,
    iteration,
    currentChampionIteration,
    benchmarkRoot,
    currentChampionSnapshot,
    candidateSnapshotDir,
    filteredCases: filtered.filteredCases,
    activeEvidenceModes: filtered.activeEvidenceModes,
    replayEnabledByOperator: filtered.replayEnabledByOperator,
    replaySourceIdentifier: filtered.replaySourceIdentifier,
    targetFeatureFamily,
  });
  await writeJson(benchmarkContextPath, benchmarkContext);

  for (const [index, caseDefinition] of filtered.filteredCases.entries()) {
    const evalId = index + 1;
    const evalDir = join(iterationDir, `eval-${evalId}`);
    const evalMetadata = buildCaseEvalMetadata(caseDefinition, evalId);
    await writeJson(join(evalDir, 'eval_metadata.json'), evalMetadata);

    for (const configuration of configurations) {
      for (
        let runNumber = 1;
        runNumber <= benchmarkManifest.runs_per_configuration;
        runNumber += 1
      ) {
        const runDir = join(evalDir, configuration.configurationDir, `run-${runNumber}`);
        await mkdir(join(runDir, 'outputs'), { recursive: true });
        await writeJson(join(runDir, 'eval_metadata.json'), evalMetadata);
        await writeJson(
          join(runDir, 'comparison_metadata.json'),
          buildIterationComparisonMetadata({
            benchmarkVersion: benchmarkManifest.benchmark_version,
            comparisonMode,
            configuration,
            evalId,
            runNumber,
            caseDefinition,
          }),
        );
        runDefinitions.push({
          caseDefinition,
          configuration,
          evalId,
          evalDir,
          evalMetadata,
          runDir,
          runNumber,
        });
      }
    }
  }

  return {
    benchmarkManifest,
    benchmarkContext,
    benchmarkContextPath,
    currentChampionIteration,
    currentChampionSnapshot,
    candidateSnapshotDir,
    iterationDir,
    runDefinitions,
  };
}
