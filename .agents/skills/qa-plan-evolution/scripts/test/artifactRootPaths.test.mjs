import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { getRunRoot, getRepoRoot } from '../lib/paths.mjs';
import { pruneRunDirs } from '../lib/pruneRuns.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('../../../../../', import.meta.url)));
const PHASE0 = join(REPO_ROOT, '.agents/skills/qa-plan-evolution/scripts/phase0.sh');
const FIXTURE = '.agents/skills/qa-plan-evolution/scripts/test/fixtures/minimal-target-skill';

test('getRunRoot returns artifact-root path, not skill-root path', () => {
  const runKey = 'test-run-123';
  const runRoot = getRunRoot(runKey);

  // Should return workspace-artifacts path
  assert.match(runRoot, /workspace-artifacts\/skills\/shared\/qa-plan-evolution\/runs\/test-run-123$/);

  // Should NOT be under .agents/skills/qa-plan-evolution/runs
  assert.equal(runRoot.includes('.agents/skills/qa-plan-evolution/runs'), false);

  // Should be an absolute path
  assert.equal(resolve(runRoot), runRoot);
});

test('getRunRoot respects ARTIFACT_ROOT environment variable', async () => {
  const customArtifactRoot = await mkdtemp(join(tmpdir(), 'custom-artifact-'));
  const originalArtifactRoot = process.env.ARTIFACT_ROOT;

  try {
    process.env.ARTIFACT_ROOT = customArtifactRoot;

    // Re-import to pick up the new env var
    const { getRunRoot: getRunRootWithEnv } = await import(`../lib/paths.mjs?t=${Date.now()}`);
    const runKey = 'test-run-env';
    const runRoot = getRunRootWithEnv(runKey);

    // Should use custom artifact root
    assert.match(runRoot, new RegExp(`${customArtifactRoot.replace(/[/\\]/g, '[/\\\\]')}.*skills.*shared.*qa-plan-evolution.*runs.*test-run-env$`));
  } finally {
    if (originalArtifactRoot !== undefined) {
      process.env.ARTIFACT_ROOT = originalArtifactRoot;
    } else {
      delete process.env.ARTIFACT_ROOT;
    }
    await rm(customArtifactRoot, { recursive: true, force: true });
  }
});

test('Phase 0 initializes run directory under artifact root by default', async () => {
  const runKey = `artifact-root-init-${Date.now()}`;
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-artifact-init-'));
  const artifactRoot = join(repoRoot, 'workspace-artifacts');
  const expectedRunRoot = join(artifactRoot, 'skills', 'shared', 'qa-plan-evolution', 'runs', runKey);
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

    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--repo-root', repoRoot,
      '--target-skill-path', targetSkillPath,
      '--target-skill-name', 'minimal-fixture',
    ], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: repoRoot },
    });

    assert.equal(result.status, 0, result.stderr);

    // Verify run was created under artifact root
    assert.equal(existsSync(expectedRunRoot), true, 'Run should exist under artifact root');
    assert.equal(existsSync(join(expectedRunRoot, 'task.json')), true);

    // Verify it was NOT created under skill root
    const skillRunRoot = join(repoRoot, '.agents', 'skills', 'qa-plan-evolution', 'runs', runKey);
    assert.equal(existsSync(skillRunRoot), false, 'Run should NOT exist under skill root');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('prune logic operates only on artifact-root siblings', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-prune-artifact-'));
  const artifactRoot = join(repoRoot, 'workspace-artifacts');
  const runsRoot = join(artifactRoot, 'skills', 'shared', 'qa-plan-evolution', 'runs');

  try {
    // Create runs under artifact root
    const oldRun = join(runsRoot, 'artifact-run-old');
    const midRun = join(runsRoot, 'artifact-run-mid');
    const newRun = join(runsRoot, 'artifact-run-new');
    await mkdir(oldRun, { recursive: true });
    await mkdir(midRun, { recursive: true });
    await mkdir(newRun, { recursive: true });
    const baseTime = Date.now() / 1000;
    await utimes(oldRun, baseTime - 300, baseTime - 300);
    await utimes(midRun, baseTime - 200, baseTime - 200);
    await utimes(newRun, baseTime - 100, baseTime - 100);

    // Create runs under old skill root (should NOT be touched by prune)
    const skillRunsRoot = join(repoRoot, '.agents', 'skills', 'qa-plan-evolution', 'runs');
    await mkdir(join(skillRunsRoot, 'skill-run-old'), { recursive: true });
    await mkdir(join(skillRunsRoot, 'skill-run-mid'), { recursive: true });

    // Prune artifact root runs
    const result = pruneRunDirs({
      runsRoot,
      keepCount: 1,
      minAgeMs: 0,
    });

    // Should prune artifact-root runs
    assert.equal(result.total_runs, 3);
    assert.equal(result.removed.length, 2);

    // Verify skill-root runs are untouched
    assert.equal(existsSync(join(skillRunsRoot, 'skill-run-old')), true);
    assert.equal(existsSync(join(skillRunsRoot, 'skill-run-mid')), true);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('explicit --run-root override bypasses artifact root', async () => {
  const runKey = `override-run-${Date.now()}`;
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-override-'));
  const overrideRunRoot = await mkdtemp(join(tmpdir(), 'seo-override-run-'));
  const artifactRoot = join(repoRoot, 'workspace-artifacts');
  const canonicalRunRoot = join(artifactRoot, 'skills', 'shared', 'qa-plan-evolution', 'runs', runKey);
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

    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--run-root', overrideRunRoot,
      '--repo-root', repoRoot,
      '--target-skill-path', targetSkillPath,
      '--target-skill-name', 'minimal-fixture',
    ], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: repoRoot },
    });

    assert.equal(result.status, 0, result.stderr);

    // Verify canonical run root was created
    assert.equal(existsSync(canonicalRunRoot), true, 'Canonical run root should exist');
    assert.equal(existsSync(join(canonicalRunRoot, 'task.json')), true);

    // Verify override run root was also created (scratch alias)
    assert.equal(existsSync(overrideRunRoot), true, 'Override run root should exist');
    assert.equal(existsSync(join(overrideRunRoot, 'task.json')), true);

    // Verify task.json records both locations
    const task = JSON.parse(await readFile(join(canonicalRunRoot, 'task.json'), 'utf8'));
    assert.equal(task.canonical_run_root, canonicalRunRoot);
    assert.equal(task.scratch_run_root, overrideRunRoot);
    assert.equal(task.runtime_root_mode, 'scratch_alias');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
    await rm(overrideRunRoot, { recursive: true, force: true });
  }
});

test('runtime does not silently adopt pre-migration runs from skill-root', async () => {
  const runKey = `pre-migration-run-${Date.now()}`;
  const repoRoot = await mkdtemp(join(tmpdir(), 'seo-pre-migration-'));
  const artifactRoot = join(repoRoot, 'workspace-artifacts');
  const artifactRunRoot = join(artifactRoot, 'skills', 'shared', 'qa-plan-evolution', 'runs', runKey);
  const skillRunRoot = join(repoRoot, '.agents', 'skills', 'qa-plan-evolution', 'runs', runKey);
  const targetSkillPath = 'skills/minimal-fixture';

  try {
    // Set up minimal fixture
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

    // Create a pre-migration run in the old skill-root location
    await mkdir(join(skillRunRoot, 'context'), { recursive: true });
    await writeFile(
      join(skillRunRoot, 'task.json'),
      JSON.stringify({
        run_key: runKey,
        report_state: 'FRESH',
        next_action: 'run_phase1',
      }),
      'utf8',
    );

    // Verify pre-migration run exists in skill-root
    assert.equal(existsSync(skillRunRoot), true, 'Pre-migration run should exist in skill-root');

    // Run phase0 with the same run key
    const result = spawnSync('bash', [
      PHASE0,
      '--run-key', runKey,
      '--repo-root', repoRoot,
      '--target-skill-path', targetSkillPath,
      '--target-skill-name', 'minimal-fixture',
    ], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: repoRoot },
    });

    assert.equal(result.status, 0, result.stderr);

    // Verify new run was created in artifact root
    assert.equal(existsSync(artifactRunRoot), true, 'New run should exist in artifact root');
    assert.equal(existsSync(join(artifactRunRoot, 'task.json')), true);

    // Verify the old skill-root run was NOT adopted or modified
    const oldTask = JSON.parse(await readFile(join(skillRunRoot, 'task.json'), 'utf8'));
    assert.equal(oldTask.report_state, 'FRESH', 'Old run should remain unchanged');

    // Verify the new artifact-root run is independent
    const newTask = JSON.parse(await readFile(join(artifactRunRoot, 'task.json'), 'utf8'));
    assert.equal(newTask.run_key, runKey);
    assert.equal(newTask.report_state, 'FRESH');
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
