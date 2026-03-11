import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
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
