import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  applyRequestModel,
  defaultRun,
  defaultTask,
  getNextPhaseRound,
  loadState,
  resolveDefaultRunDir,
  resolveLegacyRunDir,
  saveState,
} from '../scripts/lib/workflowState.mjs';
import { runRuntimeSetupCli } from '../scripts/lib/runtimeEnv.mjs';

const THIS_DIR = fileURLToPath(new URL('.', import.meta.url));

test('resolveDefaultRunDir is repo-root stable regardless of caller cwd', () => {
  const featureId = 'BCIN-ROOT-STABLE';
  const defaultPath = resolveDefaultRunDir(featureId);
  const alternatePath = resolveDefaultRunDir(featureId, '/tmp/not-the-repo-root');

  assert.equal(alternatePath, defaultPath);
  assert.match(defaultPath, /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs\/BCIN-ROOT-STABLE$/);
});

test('resolveDefaultRunDir ignores canonical skill root override outside snapshots', () => {
  const previous = process.env.FQPO_CANONICAL_SKILL_ROOT;
  process.env.FQPO_CANONICAL_SKILL_ROOT = '/tmp/canonical-skill-root';

  try {
    const runDir = resolveDefaultRunDir('BCIN-OVERRIDE');
    if (THIS_DIR.includes('/candidate_snapshot/') || THIS_DIR.includes('/champion_snapshot/')) {
      assert.equal(runDir, '/tmp/canonical-skill-root/runs/BCIN-OVERRIDE');
    } else {
      assert.match(
        runDir,
        /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs\/BCIN-OVERRIDE$/,
      );
    }
  } finally {
    if (previous == null) {
      delete process.env.FQPO_CANONICAL_SKILL_ROOT;
    } else {
      process.env.FQPO_CANONICAL_SKILL_ROOT = previous;
    }
  }
});

test('loadState succeeds when canonical run exists and no legacy run is present', async () => {
  const featureId = `BCIN-CANONICAL-ONLY-${Date.now()}`;
  const runDir = resolveDefaultRunDir(featureId);
  const legacyRunDir = resolveLegacyRunDir(featureId);

  await rm(runDir, { recursive: true, force: true });
  await rm(legacyRunDir, { recursive: true, force: true });

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await mkdir(join(runDir, 'drafts'), { recursive: true });
    await writeFile(join(runDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'canonical-run',
      current_phase: 'phase_4a_subcategory_draft',
      overall_status: 'in_progress',
    }, null, 2));
    await writeFile(join(runDir, 'run.json'), JSON.stringify({
      run_key: 'canonical-run',
      spawn_history: [{ source_family: 'jira' }],
    }, null, 2));

    const state = await loadState(featureId, runDir);

    assert.equal(state.task.run_key, 'canonical-run');
    assert.equal(state.task.feature_id, featureId);
    assert.ok(!state.task.legacy_project_dir);
    assert.ok(!state.task.migrated_from_legacy_at);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('loadState preserves later-phase latest draft while syncing rerun round counters from existing drafts', async () => {
  const featureId = `BCIN-ROUND-SYNC-${Date.now()}`;
  const runDir = resolveDefaultRunDir(featureId);

  await rm(runDir, { recursive: true, force: true });

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await mkdir(join(runDir, 'drafts'), { recursive: true });
    await writeFile(join(runDir, 'drafts', 'qa_plan_phase5a_r2.md'), 'phase5a rerun draft', 'utf8');
    await writeFile(join(runDir, 'drafts', 'qa_plan_phase5b_r1.md'), 'latest checkpoint draft', 'utf8');
    await writeFile(join(runDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'round-sync-run',
      current_phase: 'phase_5b_checkpoint_refactor',
      latest_draft_phase: 'phase5b',
      latest_draft_path: 'drafts/qa_plan_phase5b_r1.md',
      return_to_phase: 'phase5a',
    }, null, 2));
    await writeFile(join(runDir, 'run.json'), JSON.stringify({
      run_key: 'round-sync-run',
    }, null, 2));

    const state = await loadState(featureId, runDir);

    assert.equal(state.task.latest_draft_phase, 'phase5b');
    assert.equal(state.task.latest_draft_path, 'drafts/qa_plan_phase5b_r1.md');
    assert.equal(state.task.phase5a_round, 2);
    assert.equal(state.task.phase5b_round, 1);
    assert.equal(getNextPhaseRound(state.task, 'phase5a'), 3);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('loadState promotes latest same-phase draft when task metadata still points to an earlier round', async () => {
  const featureId = `BCIN-LATEST-DRAFT-${Date.now()}`;
  const runDir = resolveDefaultRunDir(featureId);

  await rm(runDir, { recursive: true, force: true });

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    await mkdir(join(runDir, 'drafts'), { recursive: true });
    await writeFile(join(runDir, 'drafts', 'qa_plan_phase4b_r1.md'), 'draft r1', 'utf8');
    await writeFile(join(runDir, 'drafts', 'qa_plan_phase4b_r2.md'), 'draft r2', 'utf8');
    await writeFile(join(runDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'latest-draft-run',
      current_phase: 'phase_4b_top_category_draft',
      latest_draft_phase: 'phase4b',
      latest_draft_path: 'drafts/qa_plan_phase4b_r1.md',
      phase4b_round: 1,
    }, null, 2));
    await writeFile(join(runDir, 'run.json'), JSON.stringify({
      run_key: 'latest-draft-run',
    }, null, 2));

    const state = await loadState(featureId, runDir);

    assert.equal(state.task.phase4b_round, 2);
    assert.equal(state.task.latest_draft_phase, 'phase4b');
    assert.equal(state.task.latest_draft_path, 'drafts/qa_plan_phase4b_r2.md');
    assert.equal(getNextPhaseRound(state.task, 'phase4b'), 3);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('applyRequestModel parses raw user request text into support issues, confluence url, and research policy defaults', () => {
  const task = {
    feature_id: 'BCIN-7289',
    raw_user_request_text: 'Read https://example.atlassian.net/wiki/spaces/BCIN/pages/7289 and BCED-2416 carefully. Save a supporting summary for BCED-2416. Research report editor functionality in Workstation and the Library vs Workstation gap. Use tavily-search first and confluence second. Do not enter defect-analysis mode.',
  };

  applyRequestModel(task, 'BCIN-7289');

  assert.equal(task.seed_confluence_url, 'https://example.atlassian.net/wiki/spaces/BCIN/pages/7289');
  assert.deepEqual(task.supporting_issue_keys, ['BCED-2416']);
  assert.deepEqual(task.deep_research_topics, [
    'report_editor_workstation_functionality',
    'report_editor_library_vs_workstation_gap',
  ]);
  assert.equal(task.supporting_issue_policy, 'context_only_no_defect_analysis');
  assert.ok(task.request_requirements.some((requirement) => requirement.user_text.includes('BCED-2416')));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-report-editor-workstation'));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-library-vs-workstation-gap'));
  assert.ok(task.request_commands.some((command) => command.command_text.includes('tavily-search before confluence')));
});

test('applyRequestModel preserves same-project supporting issues and does not add deep research when not requested', () => {
  const task = {
    feature_id: 'BCIN-200',
    raw_user_request_text: 'Read BCIN-199 as supporting context for BCIN-200 and save a supporting summary. Do not enter defect-analysis mode.',
  };

  applyRequestModel(task, 'BCIN-200');

  assert.deepEqual(task.supporting_issue_keys, ['BCIN-199']);
  assert.deepEqual(task.deep_research_topics, []);
  assert.ok(!task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-tool-order'));
});

test('defaultTask and defaultRun include canonical knowledge-pack runtime fields', () => {
  const task = defaultTask('BCIN-7000', 'run-7000');
  const run = defaultRun('run-7000');

  assert.equal(task.feature_family, null);
  assert.equal(task.knowledge_pack_key, null);
  assert.equal(task.requested_knowledge_pack_key, null);
  assert.equal(task.resolved_knowledge_pack_key, null);
  assert.equal(task.knowledge_pack_resolution_source, null);
  assert.equal(task.knowledge_pack_version, null);
  assert.equal(task.knowledge_pack_path, null);
  assert.equal(task.knowledge_pack_row_count, 0);
  assert.deepEqual(task.knowledge_pack_deep_research_topics, []);

  assert.equal(run.knowledge_pack_loaded_at, null);
  assert.equal(run.knowledge_pack_summary_generated_at, null);
  assert.equal(run.knowledge_pack_retrieval_generated_at, null);
  assert.equal(run.knowledge_pack_retrieval_mode, null);
  assert.equal(run.knowledge_pack_semantic_mode, 'disabled');
  assert.equal(run.knowledge_pack_semantic_warning, null);
  assert.equal(run.knowledge_pack_summary_artifact, null);
  assert.equal(run.knowledge_pack_retrieval_artifact, null);
  assert.equal(run.knowledge_pack_index_artifact, null);
});

test('applyRequestModel merges explicit and pack-declared deep research topics without duplicates', () => {
  const task = {
    feature_id: 'BCIN-7001',
    deep_research_topics: ['report_editor_library_vs_workstation_gap'],
    knowledge_pack_deep_research_topics: [
      'report_editor_workstation_functionality',
      'report_editor_library_vs_workstation_gap',
    ],
  };

  applyRequestModel(task, 'BCIN-7001');

  assert.deepEqual(task.deep_research_topics, [
    'report_editor_library_vs_workstation_gap',
    'report_editor_workstation_functionality',
  ]);
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-report-editor-workstation'));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-library-vs-workstation-gap'));
});

test('applyRequestModel drops generated pack research requirements when the pack is removed', () => {
  const task = {
    feature_id: 'BCIN-7002',
    deep_research_topics: [],
    knowledge_pack_deep_research_topics: ['report_editor_workstation_functionality'],
  };

  applyRequestModel(task, 'BCIN-7002');
  assert.deepEqual(task.deep_research_topics, ['report_editor_workstation_functionality']);
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-report-editor-workstation'));

  task.knowledge_pack_deep_research_topics = [];
  task.deep_research_topics = [];

  applyRequestModel(task, 'BCIN-7002');

  assert.deepEqual(task.deep_research_topics, []);
  assert.ok(!task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-report-editor-workstation'));
  assert.ok(!task.request_requirements.some((requirement) => requirement.requirement_id === 'req-research-tool-order'));
});

test('applyRequestModel replaces generated supporting-issue materials and requirements while preserving custom entries', () => {
  const task = {
    feature_id: 'BCIN-7003',
    supporting_issue_keys: ['BCIN-10'],
    request_materials: [
      {
        material_id: 'material-custom-note',
        material_type: 'inline_note',
        source_value: 'keep me',
        role: 'operator_override',
        must_read: true,
        must_summarize: false,
      },
    ],
    request_requirements: [
      {
        requirement_id: 'req-custom-note',
        kind: 'read_material',
        user_text: 'keep me',
        required_phase: 'phase1',
        required_artifacts: ['context/custom.md'],
        success_predicate: 'custom requirement remains tracked',
        blocking_on_missing: true,
      },
    ],
  };

  applyRequestModel(task, 'BCIN-7003');
  assert.ok(task.request_materials.some((material) => material.material_id === 'material-support-BCIN-10'));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-read-support-issue-BCIN-10'));

  task.supporting_issue_keys = ['BCIN-11'];

  applyRequestModel(task, 'BCIN-7003');

  assert.ok(task.request_materials.some((material) => material.material_id === 'material-custom-note'));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-custom-note'));
  assert.ok(task.request_materials.some((material) => material.material_id === 'material-support-BCIN-11'));
  assert.ok(!task.request_materials.some((material) => material.material_id === 'material-support-BCIN-10'));
  assert.ok(task.request_requirements.some((requirement) => requirement.requirement_id === 'req-read-support-issue-BCIN-11'));
  assert.ok(!task.request_requirements.some((requirement) => requirement.requirement_id === 'req-read-support-issue-BCIN-10'));
});

test('resolveDefaultRunDir returns artifact-root path', () => {
  const featureId = 'BCIN-ARTIFACT-ROOT';
  const runDir = resolveDefaultRunDir(featureId);

  assert.match(runDir, /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs\/BCIN-ARTIFACT-ROOT$/);
  assert.ok(!runDir.includes('/workspace-planner/skills/qa-plan-orchestrator/runs/'));
});

test('FQPO_RUN_DIR override bypasses artifact root', () => {
  const previous = process.env.FQPO_RUN_DIR;
  process.env.FQPO_RUN_DIR = '/tmp/custom-run-dir';

  try {
    const runDir = resolveDefaultRunDir('BCIN-OVERRIDE');
    assert.equal(runDir, '/tmp/custom-run-dir');
  } finally {
    if (previous == null) {
      delete process.env.FQPO_RUN_DIR;
    } else {
      process.env.FQPO_RUN_DIR = previous;
    }
  }
});

test('loadState throws migration required error when legacy run exists but canonical does not', async () => {
  const featureId = `BCIN-MIGRATION-REQ-${Date.now()}`;
  const legacyRunDir = resolveLegacyRunDir(featureId);
  const runDir = resolveDefaultRunDir(featureId);

  await rm(legacyRunDir, { recursive: true, force: true });
  await rm(runDir, { recursive: true, force: true });

  try {
    await mkdir(join(legacyRunDir, 'context'), { recursive: true });
    await writeFile(join(legacyRunDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'legacy-run',
    }, null, 2));

    await assert.rejects(
      async () => await loadState(featureId, runDir),
      (error) => {
        assert.match(error.message, /MIGRATION_REQUIRED/);
        assert.match(error.message, /Run migration script first/);
        assert.ok(error.message.includes(legacyRunDir));
        assert.ok(error.message.includes(runDir));
        return true;
      }
    );
  } finally {
    await rm(legacyRunDir, { recursive: true, force: true });
    await rm(runDir, { recursive: true, force: true });
  }
});

test('loadState throws conflict error when both legacy and canonical runs exist', async () => {
  const featureId = `BCIN-CONFLICT-${Date.now()}`;
  const legacyRunDir = resolveLegacyRunDir(featureId);
  const runDir = resolveDefaultRunDir(featureId);

  await rm(legacyRunDir, { recursive: true, force: true });
  await rm(runDir, { recursive: true, force: true });

  try {
    await mkdir(join(legacyRunDir, 'context'), { recursive: true });
    await writeFile(join(legacyRunDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'legacy-run',
    }, null, 2));

    await mkdir(join(runDir, 'context'), { recursive: true });
    await writeFile(join(runDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'canonical-run',
    }, null, 2));

    await assert.rejects(
      async () => await loadState(featureId, runDir),
      (error) => {
        assert.match(error.message, /MIGRATION_CONFLICT/);
        assert.match(error.message, /resolve manually/i);
        assert.ok(error.message.includes(legacyRunDir));
        assert.ok(error.message.includes(runDir));
        return true;
      }
    );
  } finally {
    await rm(legacyRunDir, { recursive: true, force: true });
    await rm(runDir, { recursive: true, force: true });
  }
});

test('FQPO_RUN_DIR override bypasses migration checks', async () => {
  const featureId = `BCIN-OVERRIDE-MIGRATION-${Date.now()}`;
  const legacyRunDir = resolveLegacyRunDir(featureId);
  const customRunDir = `/tmp/custom-run-${Date.now()}`;

  await rm(legacyRunDir, { recursive: true, force: true });
  await rm(customRunDir, { recursive: true, force: true });

  const previous = process.env.FQPO_RUN_DIR;
  process.env.FQPO_RUN_DIR = customRunDir;

  try {
    await mkdir(join(legacyRunDir, 'context'), { recursive: true });
    await writeFile(join(legacyRunDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'legacy-run',
    }, null, 2));

    const state = await loadState(featureId, customRunDir);

    assert.equal(state.task.feature_id, featureId);
    assert.ok(!state.task.legacy_project_dir);
    assert.ok(!state.task.migrated_from_legacy_at);
  } finally {
    if (previous == null) {
      delete process.env.FQPO_RUN_DIR;
    } else {
      process.env.FQPO_RUN_DIR = previous;
    }
    await rm(legacyRunDir, { recursive: true, force: true });
    await rm(customRunDir, { recursive: true, force: true });
  }
});

test('maybeMigrateLegacyRun is not exported (regression test)', async () => {
  const workflowStateModule = await import('../scripts/lib/workflowState.mjs');
  assert.equal(workflowStateModule.maybeMigrateLegacyRun, undefined);
});

test('saveState writes to artifact-root run directory', async () => {
  const featureId = `BCIN-SAVE-${Date.now()}`;
  const runDir = resolveDefaultRunDir(featureId);

  await rm(runDir, { recursive: true, force: true });

  try {
    const state = await loadState(featureId, runDir);
    state.task.current_phase = 'phase_1_evidence_gathering';
    state.run.data_fetched_at = '2026-03-26T10:00:00Z';

    await saveState(state);

    assert.match(state.taskPath, /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs/);
    assert.match(state.runPath, /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs/);

    const savedTask = JSON.parse(await readFile(state.taskPath, 'utf8'));
    const savedRun = JSON.parse(await readFile(state.runPath, 'utf8'));

    assert.equal(savedTask.current_phase, 'phase_1_evidence_gathering');
    assert.equal(savedRun.data_fetched_at, '2026-03-26T10:00:00Z');
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('runtimeEnv.mjs derives same default run root as workflowState.mjs', async () => {
  const featureId = `BCIN-RUNTIME-${Date.now()}`;
  const workflowRunDir = resolveDefaultRunDir(featureId);

  await rm(workflowRunDir, { recursive: true, force: true });

  try {
    const result = await runRuntimeSetupCli([featureId, 'jira']);

    const contextDir = join(workflowRunDir, 'context');
    const runtimeSetupPath = join(contextDir, `runtime_setup_${featureId}.json`);

    assert.ok(await fileExists(runtimeSetupPath));
    assert.match(runtimeSetupPath, /workspace-artifacts\/skills\/workspace-planner\/qa-plan-orchestrator\/runs/);
  } finally {
    await rm(workflowRunDir, { recursive: true, force: true });
  }
});

async function fileExists(path) {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}
