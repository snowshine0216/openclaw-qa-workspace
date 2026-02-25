#!/usr/bin/env node
'use strict';
/**
 * fix_platform_migration.js — Add platform column and update UNIQUE constraint
 * 
 * This script:
 * 1. Adds platform column to job_runs with default 'web'
 * 2. Recreates the table with the correct UNIQUE constraint
 * 3. Preserves all existing data
 */

const path = require('path');
const fs = require('fs');
const Database = require('./adapter');

const fixPlatformMigration = async () => {
  console.log('🔧 Fixing platform column migration...\n');

  const rootDir = path.resolve(__dirname, '..', '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');

  if (!fs.existsSync(dbPath)) {
    console.error('❌ Database not found:', dbPath);
    process.exit(1);
  }

  // Backup
  const backupPath = dbPath.replace('.db', `.backup-fix-platform-${Date.now()}.db`);
  fs.copyFileSync(dbPath, backupPath);
  console.log(`  📦 Backup created: ${path.basename(backupPath)}\n`);

  const db = await Database.create(dbPath);

  try {
    // Check current schema
    const cols = db.prepare(`PRAGMA table_info(job_runs)`).all().map(c => c.name);
    console.log('Current job_runs columns:', cols.join(', '));

    if (cols.includes('platform')) {
      console.log('\n✅ platform column already exists');
      db.close();
      return;
    }

    console.log('\n🔨 Recreating job_runs table with platform column...');

    // SQLite doesn't support ALTER TABLE for UNIQUE constraints
    // We need to recreate the table
    db.exec(`
      BEGIN TRANSACTION;

      -- Create new table with correct schema
      CREATE TABLE job_runs_new (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        job_name      TEXT    NOT NULL,
        job_build     INTEGER NOT NULL,
        job_link      TEXT    NOT NULL,
        platform      TEXT    DEFAULT 'web',
        recorded_at   TEXT    NOT NULL DEFAULT (datetime('now')),
        pass_count    INTEGER DEFAULT 0,
        fail_count    INTEGER DEFAULT 0,
        UNIQUE(job_name, job_build, platform)
      );

      -- Copy existing data (set platform to 'web' for all existing records)
      INSERT INTO job_runs_new (id, job_name, job_build, job_link, platform, recorded_at, pass_count, fail_count)
      SELECT id, job_name, job_build, job_link, 'web', recorded_at, pass_count, fail_count
      FROM job_runs;

      -- Drop old table
      DROP TABLE job_runs;

      -- Rename new table
      ALTER TABLE job_runs_new RENAME TO job_runs;

      -- Recreate index
      CREATE INDEX IF NOT EXISTS idx_job_build_lookup ON job_runs(job_name, job_build);
      CREATE INDEX IF NOT EXISTS idx_job_runs_platform ON job_runs(platform, job_name, job_build);

      COMMIT;
    `);

    console.log('  ✅ Table recreated with platform column');

    // Verify
    const newCols = db.prepare(`PRAGMA table_info(job_runs)`).all();
    console.log('\n🔍 New schema:');
    newCols.forEach(c => {
      console.log(`  - ${c.name}: ${c.type}${c.dflt_value ? ` DEFAULT ${c.dflt_value}` : ''}`);
    });

    const count = db.prepare(`SELECT COUNT(*) as count FROM job_runs`).get().count;
    console.log(`\n  ✅ Data preserved: ${count} records\n`);

    db.close();
    console.log('✅ Migration complete!\n');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err.stack);
    db.close();
    process.exit(1);
  }
};

if (require.main === module) {
  fixPlatformMigration().catch(console.error);
}

module.exports = { fixPlatformMigration };
