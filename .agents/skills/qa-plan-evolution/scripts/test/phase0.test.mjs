import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE0 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase0.sh');
const FIXTURE = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

test('phase0 rejects max_iterations above hard cap', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-cap-'));

  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-cap',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--max-iterations', '11',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /max_iterations/i);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase0 initializes champion snapshot for a fresh run', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-fresh-'));

  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-fresh',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.report_state, 'FRESH');
    assert.equal(task.champion_snapshot_path, 'archive/champion-initial');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase0 full_regenerate clears stale run artifacts before reinitializing', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-regenerate-'));

  try {
    await mkdir(join(runRoot, 'context'), { recursive: true });
    await mkdir(join(runRoot, 'candidates', 'iteration-1'), { recursive: true });
    await mkdir(join(runRoot, 'benchmarks'), { recursive: true });
    await writeFile(join(runRoot, 'context', 'accepted_gap_ids_phase0-regenerate.json'), '{}\n', 'utf8');
    await writeFile(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json'), '{}\n', 'utf8');
    await writeFile(join(runRoot, 'benchmarks', 'scoreboard_phase0-regenerate.json'), '{}\n', 'utf8');
    await writeFile(join(runRoot, 'evolution_final.md'), '# stale final\n', 'utf8');

    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-regenerate',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--choice', 'full_regenerate',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      existsSync(join(runRoot, 'context', 'accepted_gap_ids_phase0-regenerate.json')),
      false,
    );
    assert.equal(
      existsSync(join(runRoot, 'candidates', 'iteration-1', 'candidate_scope.json')),
      false,
    );
    assert.equal(
      existsSync(join(runRoot, 'benchmarks', 'scoreboard_phase0-regenerate.json')),
      false,
    );
    assert.equal(existsSync(join(runRoot, 'evolution_final.md')), false);

    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.report_state, 'FINAL_EXISTS');
    assert.equal(task.champion_snapshot_path, 'archive/champion-initial');
    assert.equal(
      existsSync(join(runRoot, 'archive', 'champion-initial', 'SKILL.md')),
      true,
    );
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase0 resolves knowledge pack from feature_family when key is omitted for qa-plan profile', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-family-'));
  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-pack-family',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-knowledge-pack-coverage',
      '--feature-family', 'native-embedding',
    ], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'native-embedding');
    assert.equal(task.knowledge_pack_resolution_source, 'feature_family');
    assert.equal(task.requested_knowledge_pack_key, null);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase0 falls back to general knowledge pack when key and inference inputs are omitted', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-general-'));
  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-pack-general',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-defect-recall',
    ], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'general');
    assert.equal(task.knowledge_pack_resolution_source, 'default_general');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});

test('phase0 infers knowledge pack from qa-plan-v2 cases when feature_id is provided', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-cases-'));
  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-pack-cases',
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', 'workspace-planner/skills/qa-plan-orchestrator',
      '--target-skill-name', 'qa-plan-orchestrator',
      '--benchmark-profile', 'qa-plan-defect-recall',
      '--feature-id', 'BCIN-7289',
    ], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'report-editor');
    assert.equal(task.knowledge_pack_resolution_source, 'cases_lookup');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
  }
});
