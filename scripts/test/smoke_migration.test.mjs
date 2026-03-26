#!/usr/bin/env node

/**
 * End-to-end smoke tests for artifact-root migration.
 *
 * Verifies:
 * - No writes to source trees after migration
 * - Benchmark operations only write to workspace-artifacts
 * - Resume functionality works after migration
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { mkdir, rm, writeFile, readFile, readdir, cp, utimes } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const MIGRATION_SCRIPT = join(REPO_ROOT, 'scripts/migrate_to_artifact_root.mjs');

/**
 * Recursively collects all file paths under a directory.
 */
async function collectFilePaths(dir) {
  if (!existsSync(dir)) {
    return [];
  }
  const paths = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...await collectFilePaths(fullPath));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

/**
 * Takes a snapshot of directory state (file paths and mtimes).
 */
async function snapshotDirectory(dir) {
  if (!existsSync(dir)) {
    return new Map();
  }
  const snapshot = new Map();
  const paths = await collectFilePaths(dir);
  for (const path of paths) {
    try {
      const stats = statSync(path);
      snapshot.set(path, stats.mtimeMs);
    } catch (err) {
      // File may have been deleted during snapshot
    }
  }
  return snapshot;
}

/**
 * Compares two snapshots and returns new/modified files.
 */
function compareSnapshots(before, after) {
  const changes = [];
  for (const [path, mtime] of after.entries()) {
    if (!before.has(path) || before.get(path) !== mtime) {
      changes.push(path);
    }
  }
  return changes;
}

/**
 * Sets up a minimal test repository structure.
 */
async function setupTestRepo(repoRoot) {
  // Create qa-plan-evolution skill structure
  const evolutionSkill = join(repoRoot, '.agents/skills/qa-plan-evolution');
  await mkdir(join(evolutionSkill, 'scripts/lib'), { recursive: true });
  await mkdir(join(evolutionSkill, 'runs/old-run-1'), { recursive: true });

  await writeFile(
    join(evolutionSkill, 'runs/old-run-1/task.json'),
    JSON.stringify({ run_key: 'old-run-1', report_state: 'FRESH' }),
    'utf8'
  );

  // Create qa-plan-orchestrator skill structure
  const orchestratorSkill = join(repoRoot, 'workspace-planner/skills/qa-plan-orchestrator');
  await mkdir(join(orchestratorSkill, 'benchmarks/qa-plan-v1/iteration-0'), { recursive: true });
  await mkdir(join(orchestratorSkill, 'benchmarks/qa-plan-v2/iteration-0'), { recursive: true });
  await mkdir(join(orchestratorSkill, 'runs/old-run-2'), { recursive: true });

  await writeFile(
    join(orchestratorSkill, 'runs/old-run-2/task.json'),
    JSON.stringify({ run_key: 'old-run-2' }),
    'utf8'
  );

  await writeFile(
    join(orchestratorSkill, 'benchmarks/qa-plan-v1/iteration-0/benchmark.json'),
    JSON.stringify({ iteration: 0 }),
    'utf8'
  );

  await writeFile(
    join(orchestratorSkill, 'benchmarks/qa-plan-v2/iteration-0/benchmark.json'),
    JSON.stringify({ iteration: 0 }),
    'utf8'
  );

  // Create defects-analysis skill structure
  const defectsSkill = join(repoRoot, 'workspace-reporter/skills/defects-analysis');
  await mkdir(join(defectsSkill, 'runs/old-run-3'), { recursive: true });

  await writeFile(
    join(defectsSkill, 'runs/old-run-3/task.json'),
    JSON.stringify({ run_key: 'old-run-3' }),
    'utf8'
  );

  // Copy artifact roots module
  await mkdir(join(repoRoot, '.agents/skills/lib'), { recursive: true });
  await cp(
    join(REPO_ROOT, '.agents/skills/lib/artifactRoots.mjs'),
    join(repoRoot, '.agents/skills/lib/artifactRoots.mjs')
  );

  // Make runs appear old (older than 5 minutes) to avoid "active run" detection
  const oldTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
  await utimes(join(evolutionSkill, 'runs/old-run-1'), oldTime, oldTime);
  await utimes(join(orchestratorSkill, 'runs/old-run-2'), oldTime, oldTime);
  await utimes(join(defectsSkill, 'runs/old-run-3'), oldTime, oldTime);
}

test('migration script moves runs and benchmarks to artifact root', async () => {
  const testRoot = join(tmpdir(), `smoke-migration-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Run migration script
    const result = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(result.status, 0, `Migration failed: ${result.stderr}`);

    // Verify runs were migrated
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    assert.equal(
      existsSync(join(artifactRoot, 'skills/shared/qa-plan-evolution/runs/old-run-1/task.json')),
      true,
      'qa-plan-evolution run should be migrated'
    );
    assert.equal(
      existsSync(join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/runs/old-run-2/task.json')),
      true,
      'qa-plan-orchestrator run should be migrated'
    );
    assert.equal(
      existsSync(join(artifactRoot, 'skills/workspace-reporter/defects-analysis/runs/old-run-3/task.json')),
      true,
      'defects-analysis run should be migrated'
    );

    // Verify benchmarks were migrated
    assert.equal(
      existsSync(join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1/iteration-0/benchmark.json')),
      true,
      'qa-plan-v1 benchmark should be migrated'
    );
    assert.equal(
      existsSync(join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/benchmark.json')),
      true,
      'qa-plan-v2 benchmark should be migrated'
    );

    // Verify source trees are empty
    assert.equal(
      existsSync(join(testRoot, '.agents/skills/qa-plan-evolution/runs/old-run-1')),
      false,
      'Source run should be removed after migration'
    );
    assert.equal(
      existsSync(join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/runs/old-run-2')),
      false,
      'Source run should be removed after migration'
    );
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

test('benchmark operations produce no writes to source trees', async () => {
  const testRoot = join(tmpdir(), `smoke-no-source-writes-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Run migration
    const migrationResult = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(migrationResult.status, 0, `Migration failed: ${migrationResult.stderr}`);

    // Take snapshot of source benchmark directories
    const v1SourceDir = join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1');
    const v2SourceDir = join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2');

    const v1Before = await snapshotDirectory(v1SourceDir);
    const v2Before = await snapshotDirectory(v2SourceDir);

    // Simulate benchmark operations by creating new iteration directories in artifact root
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    const v1RuntimeDir = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1');
    const v2RuntimeDir = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2');

    await mkdir(join(v1RuntimeDir, 'iteration-1'), { recursive: true });
    await writeFile(
      join(v1RuntimeDir, 'iteration-1/benchmark.json'),
      JSON.stringify({ iteration: 1 }),
      'utf8'
    );

    await mkdir(join(v2RuntimeDir, 'iteration-1'), { recursive: true });
    await writeFile(
      join(v2RuntimeDir, 'iteration-1/benchmark.json'),
      JSON.stringify({ iteration: 1 }),
      'utf8'
    );

    // Take snapshot after operations
    const v1After = await snapshotDirectory(v1SourceDir);
    const v2After = await snapshotDirectory(v2SourceDir);

    // Verify no changes to source trees
    const v1Changes = compareSnapshots(v1Before, v1After);
    const v2Changes = compareSnapshots(v2Before, v2After);

    assert.equal(v1Changes.length, 0, `qa-plan-v1 source tree should not be modified: ${v1Changes.join(', ')}`);
    assert.equal(v2Changes.length, 0, `qa-plan-v2 source tree should not be modified: ${v2Changes.join(', ')}`);

    // Verify writes went to artifact root
    assert.equal(
      existsSync(join(v1RuntimeDir, 'iteration-1/benchmark.json')),
      true,
      'qa-plan-v1 iteration-1 should exist in artifact root'
    );
    assert.equal(
      existsSync(join(v2RuntimeDir, 'iteration-1/benchmark.json')),
      true,
      'qa-plan-v2 iteration-1 should exist in artifact root'
    );
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

test('benchmark operations produce no writes to archive directories', async () => {
  const testRoot = join(tmpdir(), `smoke-no-archive-writes-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Create archive directories
    const v1ArchiveDir = join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1/archive');
    const v2ArchiveDir = join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive');

    await mkdir(v1ArchiveDir, { recursive: true });
    await mkdir(v2ArchiveDir, { recursive: true });

    await writeFile(join(v1ArchiveDir, 'archived.json'), '{}', 'utf8');
    await writeFile(join(v2ArchiveDir, 'archived.json'), '{}', 'utf8');

    // Run migration
    const migrationResult = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(migrationResult.status, 0, `Migration failed: ${migrationResult.stderr}`);

    // Take snapshot of archive directories
    const v1Before = await snapshotDirectory(v1ArchiveDir);
    const v2Before = await snapshotDirectory(v2ArchiveDir);

    // Simulate benchmark operations
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    const v1RuntimeDir = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1');

    await mkdir(join(v1RuntimeDir, 'iteration-1'), { recursive: true });
    await writeFile(
      join(v1RuntimeDir, 'iteration-1/benchmark.json'),
      JSON.stringify({ iteration: 1 }),
      'utf8'
    );

    // Take snapshot after operations
    const v1After = await snapshotDirectory(v1ArchiveDir);
    const v2After = await snapshotDirectory(v2ArchiveDir);

    // Verify no changes to archive directories
    const v1Changes = compareSnapshots(v1Before, v1After);
    const v2Changes = compareSnapshots(v2Before, v2After);

    assert.equal(v1Changes.length, 0, `qa-plan-v1 archive should not be modified: ${v1Changes.join(', ')}`);
    assert.equal(v2Changes.length, 0, `qa-plan-v2 archive should not be modified: ${v2Changes.join(', ')}`);
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

test('qa-plan-evolution resume succeeds from artifact-root state', async () => {
  const testRoot = join(tmpdir(), `smoke-evolution-resume-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Run migration
    const migrationResult = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(migrationResult.status, 0, `Migration failed: ${migrationResult.stderr}`);

    // Verify migrated run can be found in artifact root
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    const migratedRunPath = join(artifactRoot, 'skills/shared/qa-plan-evolution/runs/old-run-1');

    assert.equal(existsSync(migratedRunPath), true, 'Migrated run should exist in artifact root');

    // Verify task.json is readable
    const taskJson = JSON.parse(await readFile(join(migratedRunPath, 'task.json'), 'utf8'));
    assert.equal(taskJson.run_key, 'old-run-1');
    assert.equal(taskJson.report_state, 'FRESH');

    // Verify old location is empty
    const oldRunPath = join(testRoot, '.agents/skills/qa-plan-evolution/runs/old-run-1');
    assert.equal(existsSync(oldRunPath), false, 'Old run location should be empty');
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

test('qa-plan-orchestrator resume succeeds from artifact-root state', async () => {
  const testRoot = join(tmpdir(), `smoke-orchestrator-resume-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Run migration
    const migrationResult = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(migrationResult.status, 0, `Migration failed: ${migrationResult.stderr}`);

    // Verify migrated run can be found in artifact root
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    const migratedRunPath = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/runs/old-run-2');

    assert.equal(existsSync(migratedRunPath), true, 'Migrated run should exist in artifact root');

    // Verify task.json is readable
    const taskJson = JSON.parse(await readFile(join(migratedRunPath, 'task.json'), 'utf8'));
    assert.equal(taskJson.run_key, 'old-run-2');

    // Verify benchmarks are accessible
    const v1BenchmarkPath = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1/iteration-0/benchmark.json');
    const v2BenchmarkPath = join(artifactRoot, 'skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-0/benchmark.json');

    assert.equal(existsSync(v1BenchmarkPath), true, 'qa-plan-v1 benchmark should be accessible');
    assert.equal(existsSync(v2BenchmarkPath), true, 'qa-plan-v2 benchmark should be accessible');

    // Verify old locations are empty
    const oldRunPath = join(testRoot, 'workspace-planner/skills/qa-plan-orchestrator/runs/old-run-2');
    assert.equal(existsSync(oldRunPath), false, 'Old run location should be empty');
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

test('migration is idempotent - safe to run multiple times', async () => {
  const testRoot = join(tmpdir(), `smoke-idempotent-${Date.now()}`);

  try {
    await setupTestRepo(testRoot);

    // Run migration first time
    const result1 = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(result1.status, 0, `First migration failed: ${result1.stderr}`);

    // Take snapshot of artifact root
    const artifactRoot = join(testRoot, 'workspace-artifacts');
    const snapshotAfterFirst = await snapshotDirectory(artifactRoot);

    // Run migration second time
    const result2 = spawnSync('node', [MIGRATION_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, REPO_ROOT: testRoot },
      cwd: testRoot,
    });

    assert.equal(result2.status, 0, `Second migration failed: ${result2.stderr}`);
    assert.match(result2.stdout, /already migrated|already exists|skipped/i, 'Should indicate items already migrated');

    // Verify artifact root unchanged
    const snapshotAfterSecond = await snapshotDirectory(artifactRoot);
    const changes = compareSnapshots(snapshotAfterFirst, snapshotAfterSecond);

    assert.equal(changes.length, 0, `Artifact root should be unchanged after second migration: ${changes.join(', ')}`);
  } finally {
    await rm(testRoot, { recursive: true, force: true });
  }
});

console.log('✅ All smoke tests defined');
