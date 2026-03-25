#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildEvidenceFreshness } from '../evidenceFreshness.mjs';
import { buildBenchmarkCatalog } from '../benchmarkCatalog.mjs';
import { getProfileById } from '../loadProfile.mjs';
import { buildInitialChampionScoreboard } from '../runTargetValidation.mjs';
import { loadQaPlanAdapter } from '../evidence/adapters/qa-plan.mjs';
import {
  markPhaseJobsPostApplied,
  refreshJobs,
  registerManifestJob,
} from '../asyncJobStore.mjs';
import {
  parsePhaseArgs,
  resolveRunContext,
  requireTask,
  requireRun,
  touchTask,
  touchRun,
} from './common.mjs';

function writeJson(path, payload) {
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function isQaPlanEvolutionTask(task) {
  return (
    String(task.benchmark_profile || '').startsWith('qa-plan') ||
    String(task.target_skill_path || '').includes('qa-plan-orchestrator')
  );
}

function buildPackJsonScaffold(task, runKey) {
  return {
    schema_version: '1',
    pack_key: task.knowledge_pack_key,
    feature_family: task.feature_family ?? task.knowledge_pack_key ?? 'general',
    version: '0.0.0-bootstrap',
    bootstrap_status: 'incomplete',
    generated_by: 'qa-plan-evolution.phase1',
    generated_at: new Date().toISOString(),
    generated_for_run_key: runKey,
    required_capabilities: [],
    required_outcomes: [],
    state_transitions: [],
    analog_gates: [],
    sdk_visible_contracts: [],
    interaction_pairs: [],
    interaction_matrices: [],
    anti_patterns: [],
    evidence_refs: [],
    notes: 'Populate required capability and gate content, then set bootstrap_status to "ready".',
  };
}

function writeKnowledgePackBootstrapArtifacts({ runRoot, runKey, payload }) {
  const jsonPath = join(runRoot, 'context', `knowledge_pack_bootstrap_${runKey}.json`);
  const mdPath = join(runRoot, 'context', `knowledge_pack_bootstrap_${runKey}.md`);
  writeJson(jsonPath, payload);
  writeFileSync(
    mdPath,
    [
      `# Knowledge pack bootstrap (${runKey})`,
      '',
      '```json',
      JSON.stringify(payload, null, 2),
      '```',
      '',
      'Next action: fill capability/gate details and set `bootstrap_status` to `"ready"`.',
    ].join('\n'),
    'utf8',
  );
}

function ensureKnowledgePackBootstrap({ repoRoot, runRoot, runKey, task, fresh, adapter }) {
  if (!isQaPlanEvolutionTask(task) || !task.knowledge_pack_key) {
    return { blocked: false };
  }

  const packInfo = fresh.knowledge_pack ?? {};
  if (packInfo.status === 'missing') {
    const base = adapter.getKnowledgePackBase(repoRoot, task);
    const packJsonPath = join(base, 'pack.json');
    const packMdPath = join(base, 'pack.md');
    mkdirSync(base, { recursive: true });
    const scaffold = buildPackJsonScaffold(task, runKey);
    if (!existsSync(packJsonPath)) {
      writeJson(packJsonPath, scaffold);
    }
    if (!existsSync(packMdPath)) {
      writeFileSync(
        packMdPath,
        [
          `# Knowledge Pack: ${task.knowledge_pack_key}`,
          '',
          '## Status',
          '- bootstrap_status: incomplete',
          '',
          '## Required Capabilities',
          '- TODO',
          '',
          '## Required Outcomes',
          '- TODO',
          '',
          '## State Transitions',
          '- TODO',
          '',
          '## Analog Gates',
          '- TODO',
          '',
          '## SDK Visible Contracts',
          '- TODO',
          '',
          '## Interaction Pairs',
          '- TODO',
          '',
          '## Interaction Matrices',
          '- TODO',
          '',
          '## Anti-Patterns',
          '- TODO',
          '',
          '## Evidence Refs',
          '- TODO',
        ].join('\n'),
        'utf8',
      );
    }
    writeKnowledgePackBootstrapArtifacts({
      runRoot,
      runKey,
      payload: {
        action: 'bootstrap_created',
        pack_key: task.knowledge_pack_key,
        pack_json_path: packJsonPath,
        pack_md_path: packMdPath,
        status: 'blocked',
      },
    });
    return { blocked: true, reason: 'bootstrap_created' };
  }

  if (packInfo.status === 'bootstrap_incomplete') {
    const packJsonPath = join(adapter.getKnowledgePackBase(repoRoot, task), 'pack.json');
    let bootstrapStatus = 'incomplete';
    if (existsSync(packJsonPath)) {
      try {
        bootstrapStatus = JSON.parse(readFileSync(packJsonPath, 'utf8')).bootstrap_status ?? 'incomplete';
      } catch {
        bootstrapStatus = 'unparseable';
      }
    }
    writeKnowledgePackBootstrapArtifacts({
      runRoot,
      runKey,
      payload: {
        action: 'bootstrap_incomplete',
        pack_key: task.knowledge_pack_key,
        pack_json_path: packJsonPath,
        bootstrap_status: bootstrapStatus,
        status: 'blocked',
      },
    });
    return { blocked: true, reason: 'bootstrap_incomplete' };
  }

  return { blocked: false };
}

function buildDefectEvidenceRecord(task, fresh) {
  const defectsInfo = fresh.defects_analysis ?? {};
  const artifacts = [
    defectsInfo.final_report_path,
    defectsInfo.gap_bundle_path,
    defectsInfo.qa_plan_cross_analysis_path,
    defectsInfo.self_test_gap_analysis_path,
  ].filter(Boolean);
  return {
    generated_at: new Date().toISOString(),
    defects_analysis_run_key: defectsInfo.run_key ?? task.defect_analysis_run_key ?? task.feature_id ?? null,
    status: defectsInfo.status ?? 'skipped',
    reused_or_refreshed: defectsInfo.status === 'stale' ? 'refreshed' : 'reused',
    artifact_paths: artifacts,
    freshness_status: defectsInfo.status ?? 'skipped',
    replay_evidence_enabled: fresh.profile_id === 'qa-plan-defect-recall',
    gap_bundle_path: defectsInfo.gap_bundle_path ?? null,
  };
}

function buildDefectsRefreshManifest(repoRoot, task, runKey) {
  const adapter = loadQaPlanAdapter();
  const resolvedRunKey = task.defect_analysis_run_key ?? task.feature_id ?? null;
  if (!resolvedRunKey) {
    return {
      reason: 'blocking_prerequisite',
      action: 'refresh_target_skill_or_evidence',
      run_key: runKey,
      expected_artifacts: [],
      freshness_inputs: [],
      requests: [],
    };
  }
  const helperPath = join(
    repoRoot,
    '.agents',
    'skills',
    'qa-plan-evolution',
    'scripts',
    'spawn_defects_analysis.sh',
  );
  const argv = [
    'bash',
    helperPath,
    '--repo-root',
    repoRoot,
    '--run-key',
    runKey,
    '--refresh-mode',
    'smart_refresh',
  ];
  argv.push('--defect-analysis-run-key', resolvedRunKey);
  if (task.feature_id) {
    argv.push('--feature-id', task.feature_id);
  }
  if (task.feature_family) {
    argv.push('--feature-family', task.feature_family);
  }
  const defectsRunRoot = adapter.getDefectsRunRoot(repoRoot, task);
  const expectedArtifacts = defectsRunRoot
    ? [
        join(defectsRunRoot, 'context', `analysis_freshness_${resolvedRunKey}.json`),
        join(defectsRunRoot, `${resolvedRunKey}_REPORT_FINAL.md`),
        join(defectsRunRoot, `${resolvedRunKey}_QA_PLAN_CROSS_ANALYSIS.md`),
        join(defectsRunRoot, `${resolvedRunKey}_SELF_TEST_GAP_ANALYSIS.md`),
        join(defectsRunRoot, 'context', `gap_bundle_${resolvedRunKey}.json`),
      ]
    : [];
  return {
    reason: 'blocking_prerequisite',
    action: 'refresh_target_skill_or_evidence',
    run_key: runKey,
    expected_artifacts: expectedArtifacts,
    freshness_inputs: [join(repoRoot, task.target_skill_path, 'evals', 'evals.json')],
    requests: [
      {
        local_command: {
          argv,
          cwd: repoRoot,
        },
      },
    ],
  };
}

export async function main(argv = process.argv.slice(2)) {
  const args = parsePhaseArgs(argv);
  const { runKey, repoRoot, runRoot } = resolveRunContext(args);
  const task = requireTask(runRoot);
  const run = requireRun(runRoot);

  refreshJobs(runRoot, { phase: 'phase1' });

  const fresh = buildEvidenceFreshness({
    repoRoot,
    runRoot,
    task,
    profileId: task.benchmark_profile,
  });
  const profile = getProfileById(task.benchmark_profile);

  const md = [
    `# Evidence freshness (${runKey})`,
    '',
    '```json',
    JSON.stringify(fresh, null, 2),
    '```',
  ].join('\n');
  writeFileSync(join(runRoot, 'context', `evidence_freshness_${runKey}.md`), md, 'utf8');
  writeFileSync(
    join(runRoot, 'context', `evidence_freshness_${runKey}.json`),
    `${JSON.stringify(fresh, null, 2)}\n`,
    'utf8',
  );

  const proactiveDefectsRunKey = task.defect_analysis_run_key ?? task.feature_id ?? null;
  const defectEvidencePath = join(runRoot, 'context', `defect_evidence_${runKey}.json`);
  const supportsDefectsRefresh = profile.evidence_hooks?.defects_analysis_refresh !== 'none';
  const proactiveDefectsDone = existsSync(defectEvidencePath);
  const defectsAlreadyPresent =
    fresh.defects_analysis?.status === 'present';

  if (
    !args.post &&
    supportsDefectsRefresh &&
    proactiveDefectsRunKey &&
    !proactiveDefectsDone &&
    !defectsAlreadyPresent
  ) {
    const manifest = buildDefectsRefreshManifest(repoRoot, task, runKey);
    const manifestPath = join(runRoot, 'phase1_spawn_manifest.json');
    writeJson(manifestPath, manifest);
    if (manifest.requests.length > 0) {
      registerManifestJob(runRoot, {
        phase: 'phase1',
        manifestPath,
        expectedArtifacts: manifest.expected_artifacts ?? [],
        completionProbe: 'expected_artifacts_and_spawn_results',
        freshnessInputs: manifest.freshness_inputs ?? [],
        timeoutAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        retryPolicy: { owner: 'orchestrator', max_retries: 1 },
        nextAction: 'await_async_completion',
        nextActionReason: 'awaiting_async_prerequisite',
        blockingReason: 'waiting_on_defects_analysis',
      });
      console.log(`SPAWN_MANIFEST: ${manifestPath}`);
    } else {
      console.error(
        'phase1: proactive defects-analysis skipped — no defect_analysis_run_key or feature_id available to build refresh request',
      );
    }
    process.exitCode = 2;
    return;
  }

  const adapter = loadQaPlanAdapter();
  const packBootstrap = ensureKnowledgePackBootstrap({
    repoRoot,
    runRoot,
    runKey,
    task,
    fresh,
    adapter,
  });
  if (packBootstrap.blocked) {
    console.error(
      `phase1 blocked: knowledge pack "${task.knowledge_pack_key}" ${packBootstrap.reason}; fill scaffold content and set bootstrap_status to "ready"`,
    );
    process.exitCode = 2;
    return;
  }

  if (fresh.blocking) {
    const manifest = profile.evidence_hooks?.defects_analysis_refresh === 'required_when_stale'
      ? buildDefectsRefreshManifest(repoRoot, task, runKey)
      : {
          reason: 'blocking_prerequisite',
          action: 'refresh_target_skill_or_evidence',
          run_key: runKey,
          requests: [],
        };
    const manifestPath = join(runRoot, 'phase1_spawn_manifest.json');
    writeJson(manifestPath, manifest);
    console.error('phase1 blocked: missing or stale required artifacts');
    if (manifest.requests.length > 0) {
      console.log(`SPAWN_MANIFEST: ${manifestPath}`);
    } else {
      console.error(
        'phase1: no automated spawn actions; fix blocking evidence manually or set defect_analysis_run_key / feature_id when defects-analysis refresh is required',
      );
    }
    process.exitCode = 2;
    return;
  }

  const resolvedDefectsRunKey = adapter.resolveDefectsRunKey(task);
  const updatedTask = touchTask(runRoot, task, {
    defect_analysis_run_key: resolvedDefectsRunKey ?? task.defect_analysis_run_key ?? null,
    next_action: 'run_phase2',
    next_action_reason: 'phase1_complete',
    blocking_reason: null,
  });
  if (fresh.defects_analysis?.status && fresh.defects_analysis.status !== 'skipped' && fresh.defects_analysis.status !== 'optional') {
    const evidenceRecord = buildDefectEvidenceRecord(updatedTask, fresh);
    writeJson(join(runRoot, 'context', `defect_evidence_${runKey}.json`), evidenceRecord);
  }
  markPhaseJobsPostApplied(runRoot, 'phase1');

  const catalog = buildBenchmarkCatalog({
    profileId: updatedTask.benchmark_profile,
    targetSkillPath: updatedTask.target_skill_path,
  });
  writeFileSync(
    join(runRoot, 'benchmarks', `benchmark_catalog_${runKey}.json`),
    `${JSON.stringify(catalog, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(
    join(runRoot, 'context', `benchmark_catalog_${runKey}.md`),
    [`# Benchmark catalog`, '', '```json', JSON.stringify(catalog, null, 2), '```'].join('\n'),
    'utf8',
  );

  const scoreboardPath = join(runRoot, 'benchmarks', `scoreboard_${runKey}.json`);
  if (!existsSync(scoreboardPath)) {
    const seedBoard = {
      run_key: runKey,
      champion: buildInitialChampionScoreboard(
        join(repoRoot, updatedTask.target_skill_path),
        {
          profileId: updatedTask.benchmark_profile,
          knowledgePackKey: updatedTask.knowledge_pack_key ?? null,
        },
      ),
      iterations: [],
    };
    writeFileSync(scoreboardPath, `${JSON.stringify(seedBoard, null, 2)}\n`, 'utf8');
  }

  touchRun(runRoot, run, {
    freshness_checked_at: new Date().toISOString(),
    benchmark_catalog_generated_at: new Date().toISOString(),
  });

  console.log(`phase1 ok: catalog written for ${updatedTask.benchmark_profile}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
