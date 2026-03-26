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

function getArtifactRunRoot(artifactRoot, runKey) {
  return join(
    artifactRoot,
    'skills',
    'shared',
    'qa-plan-evolution',
    'runs',
    runKey,
  );
}

test('phase0 rejects max_iterations above hard cap', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-cap-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-cap-artifacts-'));

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
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /max_iterations/i);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 initializes champion snapshot for a fresh run', async () => {
  const runKey = `phase0-fresh-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-fresh-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-fresh-artifacts-'));
  const canonicalRunRoot = getArtifactRunRoot(artifactRoot, runKey);

  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', runRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });

    assert.equal(result.status, 0);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.report_state, 'FRESH');
    assert.equal(task.champion_snapshot_path, 'archive/champion-initial');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 writes canonical root metadata and aliases an override run root to the canonical run', async () => {
  const runKey = 'phase0-canonical-root';
  const overrideRunRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-canonical-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-canonical-artifacts-'));
  const canonicalRunRoot = getArtifactRunRoot(artifactRoot, runKey);

  try {
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', overrideRunRoot,
      '--repo-root', REPO_ROOT,
      '--target-skill-path', FIXTURE,
      '--target-skill-name', 'minimal-fixture',
      '--benchmark-profile', 'generic-skill-regression',
    ], {
      encoding: 'utf8',
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });

    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(canonicalRunRoot, 'task.json'), 'utf8'));
    assert.equal(task.canonical_run_root, canonicalRunRoot);
    assert.equal(task.scratch_run_root, overrideRunRoot);
    assert.equal(task.runtime_root_mode, 'scratch_alias');
    assert.equal(task.next_action, 'run_phase1');
    assert.equal(task.next_action_reason, 'phase0_complete');
    assert.deepEqual(task.pending_job_ids, []);
    assert.equal(task.blocking_reason, null);
    assert.equal(existsSync(join(overrideRunRoot, 'task.json')), true);
  } finally {
    await rm(overrideRunRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 full_regenerate clears stale run artifacts before reinitializing', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-regenerate-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-regenerate-artifacts-'));

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
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
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
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 resolves knowledge pack from feature_family when key is omitted for qa-plan profile', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-family-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-family-artifacts-'));
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
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'native-embedding');
    assert.equal(task.knowledge_pack_resolution_source, 'feature_family');
    assert.equal(task.requested_knowledge_pack_key, null);
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 falls back to general knowledge pack when key and inference inputs are omitted', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-general-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-general-artifacts-'));
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
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'general');
    assert.equal(task.knowledge_pack_resolution_source, 'default_general');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 infers knowledge pack from qa-plan-v2 cases when feature_id is provided', async () => {
  const runRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-cases-'));
  const artifactRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-pack-cases-artifacts-'));
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
      env: { ...process.env, ARTIFACT_ROOT: artifactRoot },
    });
    assert.equal(result.status, 0, result.stderr);
    const task = JSON.parse(await readFile(join(runRoot, 'task.json'), 'utf8'));
    assert.equal(task.knowledge_pack_key, 'report-editor');
    assert.equal(task.knowledge_pack_resolution_source, 'cases_lookup');
  } finally {
    await rm(runRoot, { recursive: true, force: true });
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

test('phase0 prunes sibling run directories and records prune summary', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-phase0-prune-repo-'));
  const runsRoot = join(repoRoot, 'runs');
  const runRoot = join(runsRoot, 'phase0-prune-current');
  const targetSkillPath = 'skills/minimal-fixture';

  try {
    await mkdir(join(repoRoot, 'skills', 'minimal-fixture'), { recursive: true });
    await writeFile(
      join(repoRoot, 'skills', 'minimal-fixture', 'SKILL.md'),
      '---\nname: minimal-fixture\ndescription: fixture\n---\n',
      'utf8',
    );
    await writeFile(
      join(repoRoot, 'skills', 'minimal-fixture', 'reference.md'),
      '# reference\n',
      'utf8',
    );
    await mkdir(join(runsRoot, 'phase0-prune-old-1'), { recursive: true });
    await mkdir(join(runsRoot, 'phase0-prune-old-2'), { recursive: true });

    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', 'phase0-prune-current',
      '--run-root', runRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', targetSkillPath,
      '--target-skill-name', 'minimal-fixture',
      '--retain-runs', '1',
      '--prune-min-age-seconds', '0',
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(join(runsRoot, 'phase0-prune-old-1')), false);
    assert.equal(existsSync(join(runsRoot, 'phase0-prune-old-2')), false);
    assert.equal(existsSync(runRoot), true);

    const setupJsonPath = join(
      runRoot,
      'context',
      'runtime_setup_phase0-prune-current.json',
    );
    const setupJson = JSON.parse(await readFile(setupJsonPath, 'utf8'));
    assert.equal(setupJson.run_retention_keep, 1);
    assert.equal(setupJson.run_prune_min_age_seconds, 0);
    assert.equal(typeof setupJson.run_prune?.removed?.length, 'number');
    assert.equal(setupJson.run_prune?.removed?.length >= 2, true);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
