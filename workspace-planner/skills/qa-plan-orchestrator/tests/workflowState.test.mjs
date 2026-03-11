import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  applyRequestModel,
  getNextPhaseRound,
  loadState,
  resolveDefaultRunDir,
  resolveLegacyRunDir,
} from '../scripts/lib/workflowState.mjs';

test('resolveDefaultRunDir is repo-root stable regardless of caller cwd', () => {
  const featureId = 'BCIN-ROOT-STABLE';
  const defaultPath = resolveDefaultRunDir(featureId);
  const alternatePath = resolveDefaultRunDir(featureId, '/tmp/not-the-repo-root');

  assert.equal(alternatePath, defaultPath);
  assert.match(defaultPath, /workspace-planner\/skills\/qa-plan-orchestrator\/runs\/BCIN-ROOT-STABLE$/);
});

test('loadState migrates legacy feature-plan runs into qa-plan-orchestrator runs', async () => {
  const featureId = `BCIN-LEGACY-${Date.now()}`;
  const legacyRunDir = resolveLegacyRunDir(featureId);
  const runDir = resolveDefaultRunDir(featureId);

  await rm(legacyRunDir, { recursive: true, force: true });
  await rm(runDir, { recursive: true, force: true });

  try {
    await mkdir(join(legacyRunDir, 'context'), { recursive: true });
    await mkdir(join(legacyRunDir, 'drafts'), { recursive: true });
    await writeFile(join(legacyRunDir, 'context', `jira_issue_${featureId}.md`), 'legacy evidence', 'utf8');
    await writeFile(join(legacyRunDir, 'drafts', 'qa_plan_phase4a_r1.md'), 'legacy draft', 'utf8');
    await writeFile(join(legacyRunDir, 'task.json'), JSON.stringify({
      feature_id: featureId,
      run_key: 'legacy-run',
      current_phase: 'phase_4a_subcategory_draft',
      overall_status: 'in_progress',
    }, null, 2));
    await writeFile(join(legacyRunDir, 'run.json'), JSON.stringify({
      run_key: 'legacy-run',
      spawn_history: [{ source_family: 'jira' }],
    }, null, 2));

    const state = await loadState(featureId, runDir);

    assert.equal(state.task.run_key, 'legacy-run');
    assert.equal(state.task.legacy_project_dir, legacyRunDir);
    assert.match(state.task.migrated_from_legacy_at, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(state.run.legacy_migration.source, legacyRunDir);
    assert.equal(
      await readFile(join(runDir, 'context', `jira_issue_${featureId}.md`), 'utf8'),
      'legacy evidence',
    );
    assert.equal(
      await readFile(join(runDir, 'drafts', 'qa_plan_phase4a_r1.md'), 'utf8'),
      'legacy draft',
    );
  } finally {
    await rm(legacyRunDir, { recursive: true, force: true });
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
