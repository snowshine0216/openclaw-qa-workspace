#!/usr/bin/env node

/**
 * Migration script to move legacy runs and benchmarks to artifact root.
 *
 * This script migrates:
 * - Skill runs from <skill-root>/runs/<id> to artifact root
 * - Benchmark runtime trees for qa-plan-v1 and qa-plan-v2
 *
 * Features:
 * - Atomic migration with per-run/per-benchmark locking
 * - Same-filesystem moves use rename, cross-filesystem use copy+delete
 * - Idempotent: safe to run multiple times
 * - Fail-fast on conflicts or active runs
 */

import { join, dirname, basename } from 'node:path';
import { existsSync, statSync, mkdirSync, renameSync, rmSync, readdirSync } from 'node:fs';
import { copyFile, readdir, stat, mkdir, rm, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  getRepoRoot,
  getSkillArtifactRoot,
  getRunRoot,
  getBenchmarkRuntimeRoot,
} from '../.agents/skills/lib/artifactRoots.mjs';

const LOCK_FILE = '.migration.lock';
const RUN_LOCK_FILE = '.lock';
const ACTIVE_RUN_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Migration configuration for each skill.
 */
const MIGRATIONS = [
  {
    name: 'qa-plan-evolution',
    workspace: 'shared',
    skillName: 'qa-plan-evolution',
    legacyRunsPath: join(getRepoRoot(), '.agents/skills/qa-plan-evolution/runs'),
  },
  {
    name: 'qa-plan-orchestrator',
    workspace: 'workspace-planner',
    skillName: 'qa-plan-orchestrator',
    legacyRunsPath: join(getRepoRoot(), 'workspace-planner/skills/qa-plan-orchestrator/runs'),
    benchmarks: [
      {
        family: 'qa-plan-v1',
        legacyPath: join(getRepoRoot(), 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1'),
      },
      {
        family: 'qa-plan-v2',
        legacyPath: join(getRepoRoot(), 'workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2'),
      },
    ],
  },
  {
    name: 'defects-analysis',
    workspace: 'workspace-reporter',
    skillName: 'defects-analysis',
    legacyRunsPath: join(getRepoRoot(), 'workspace-reporter/skills/defects-analysis/runs'),
  },
];

class MigrationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MigrationError';
  }
}

/**
 * Checks if a run is active based on lock file or recent mtime.
 */
async function isRunActive(runPath) {
  const lockPath = join(runPath, RUN_LOCK_FILE);
  if (existsSync(lockPath)) {
    return true;
  }

  try {
    const stats = await stat(runPath);
    const age = Date.now() - stats.mtimeMs;
    return age < ACTIVE_RUN_THRESHOLD_MS;
  } catch (err) {
    return false;
  }
}

/**
 * Checks if source and destination are on the same filesystem.
 */
function isSameFilesystem(sourcePath, destPath) {
  try {
    const sourceStats = statSync(sourcePath);
    const destParent = dirname(destPath);
    if (!existsSync(destParent)) {
      mkdirSync(destParent, { recursive: true });
    }
    const destStats = statSync(destParent);
    return sourceStats.dev === destStats.dev;
  } catch (err) {
    return false;
  }
}

/**
 * Recursively copies a directory.
 */
async function copyDirectory(source, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(source, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await copyFile(sourcePath, destPath);
    }
  }
}

/**
 * Atomically migrates a single directory using rename or copy+delete.
 */
async function migrateDirectory(source, dest, name) {
  // Check if destination already exists
  if (existsSync(dest)) {
    console.log(`  ⏭️  ${name}: already exists at destination, skipping`);
    return { skipped: true };
  }

  // Create parent directory
  const destParent = dirname(dest);
  await mkdir(destParent, { recursive: true });

  // Acquire lock
  const lockPath = join(source, LOCK_FILE);
  try {
    await mkdir(lockPath);
  } catch (err) {
    throw new MigrationError(`Failed to acquire lock for ${name}: ${err.message}`);
  }

  try {
    // Try same-filesystem rename first
    if (isSameFilesystem(source, dest)) {
      console.log(`  🔄 ${name}: moving (same filesystem)`);
      await rename(source, dest);
      console.log(`  ✅ ${name}: moved successfully`);
      return { moved: true, method: 'rename' };
    }

    // Cross-filesystem: copy to staging, then promote
    console.log(`  🔄 ${name}: copying (cross filesystem)`);
    const staging = `${dest}.staging`;

    try {
      await copyDirectory(source, staging);
      await rename(staging, dest);
      await rm(source, { recursive: true, force: true });
      console.log(`  ✅ ${name}: copied and deleted successfully`);
      return { moved: true, method: 'copy' };
    } catch (err) {
      // Clean up incomplete staging
      if (existsSync(staging)) {
        await rm(staging, { recursive: true, force: true });
      }
      throw err;
    }
  } finally {
    // Release lock
    try {
      await rm(lockPath, { recursive: true, force: true });
    } catch (err) {
      // Ignore lock cleanup errors
    }
  }
}

/**
 * Migrates runs for a skill.
 */
async function migrateRuns(config) {
  const { name, workspace, skillName, legacyRunsPath } = config;

  if (!existsSync(legacyRunsPath)) {
    console.log(`  ℹ️  No legacy runs directory found for ${name}`);
    return { skipped: 0, moved: 0, failed: 0 };
  }

  const entries = await readdir(legacyRunsPath, { withFileTypes: true });
  const runs = entries.filter(e => e.isDirectory());

  if (runs.length === 0) {
    console.log(`  ℹ️  No runs found in ${name}`);
    return { skipped: 0, moved: 0, failed: 0 };
  }

  console.log(`\n📦 Migrating ${runs.length} run(s) for ${name}...`);

  let skipped = 0;
  let moved = 0;
  let failed = 0;

  for (const run of runs) {
    const runId = run.name;
    const sourcePath = join(legacyRunsPath, runId);
    const destPath = getRunRoot(workspace, skillName, runId);

    try {
      // Check if run is active
      if (await isRunActive(sourcePath)) {
        throw new MigrationError(`Run ${runId} appears to be active (lock file or recent mtime)`);
      }

      const result = await migrateDirectory(sourcePath, destPath, runId);
      if (result.skipped) {
        skipped++;
      } else {
        moved++;
      }
    } catch (err) {
      console.error(`  ❌ ${runId}: ${err.message}`);
      failed++;
    }
  }

  return { skipped, moved, failed };
}

/**
 * Migrates benchmark iterations for a benchmark family.
 */
async function migrateBenchmarks(config, benchmark) {
  const { name, workspace, skillName } = config;
  const { family, legacyPath } = benchmark;

  if (!existsSync(legacyPath)) {
    console.log(`  ℹ️  No legacy benchmark directory found for ${family}`);
    return { skipped: 0, moved: 0, failed: 0 };
  }

  const entries = await readdir(legacyPath, { withFileTypes: true });
  const iterations = entries.filter(e => e.isDirectory() && e.name.startsWith('iteration-'));

  if (iterations.length === 0) {
    console.log(`  ℹ️  No iterations found in ${family}`);
    return { skipped: 0, moved: 0, failed: 0 };
  }

  console.log(`\n📊 Migrating ${iterations.length} iteration(s) for ${family}...`);

  let skipped = 0;
  let moved = 0;
  let failed = 0;

  const destRoot = getBenchmarkRuntimeRoot(workspace, skillName, family);

  for (const iteration of iterations) {
    const iterationName = iteration.name;
    const sourcePath = join(legacyPath, iterationName);
    const destPath = join(destRoot, iterationName);

    try {
      const result = await migrateDirectory(sourcePath, destPath, `${family}/${iterationName}`);
      if (result.skipped) {
        skipped++;
      } else {
        moved++;
      }
    } catch (err) {
      console.error(`  ❌ ${family}/${iterationName}: ${err.message}`);
      failed++;
    }
  }

  return { skipped, moved, failed };
}

/**
 * Main migration function.
 */
async function main() {
  console.log('🚀 Starting migration to artifact root...\n');

  let totalSkipped = 0;
  let totalMoved = 0;
  let totalFailed = 0;

  for (const config of MIGRATIONS) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Processing: ${config.name}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Migrate runs
    const runStats = await migrateRuns(config);
    totalSkipped += runStats.skipped;
    totalMoved += runStats.moved;
    totalFailed += runStats.failed;

    // Migrate benchmarks if present
    if (config.benchmarks) {
      for (const benchmark of config.benchmarks) {
        const benchStats = await migrateBenchmarks(config, benchmark);
        totalSkipped += benchStats.skipped;
        totalMoved += benchStats.moved;
        totalFailed += benchStats.failed;
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Migration Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Moved: ${totalMoved}`);
  console.log(`⏭️  Skipped: ${totalSkipped}`);
  console.log(`❌ Failed: ${totalFailed}`);

  if (totalFailed > 0) {
    console.log('\n⚠️  Some migrations failed. Please review the errors above.');
    process.exit(1);
  }

  if (totalMoved === 0 && totalSkipped === 0) {
    console.log('\nℹ️  No migrations needed. All artifacts are already in place.');
  } else if (totalMoved > 0) {
    console.log('\n✨ Migration completed successfully!');
  } else {
    console.log('\nℹ️  All artifacts were already migrated.');
  }
}

// Run migration
main().catch(err => {
  console.error('\n💥 Migration failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
