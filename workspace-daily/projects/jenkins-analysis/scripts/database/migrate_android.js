#!/usr/bin/env node
'use strict';
/**
 * migrate_android.js — Safe idempotent migration for Android CI columns
 *
 * Adds columns one by one using "IF NOT EXISTS" equivalent via PRAGMA check.
 * Safe to run multiple times — skips columns that already exist.
 * Also installs cheerio if missing (required by extent_parser.js v2).
 */

const schema = require('./schema');
const path   = require('path');
const fs     = require('fs');

// ---------------------------------------------------------------------------
// Helper: add a column only if it doesn't exist yet
// ---------------------------------------------------------------------------

const addColumnIfMissing = (db, table, column, columnDef) => {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${columnDef}`);
    console.log(`  ✅ ${table}.${column} added`);
    return true;
  }
  return false; // already existed
};

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

const migrateAndroid = async () => {
  console.log('🔧 Starting Android CI Migration (idempotent)...\n');

  const rootDir = path.resolve(__dirname, '..');
  const dbPath  = path.join(rootDir, 'data', 'jenkins_history.db');

  // Backup existing DB before touching it
  if (fs.existsSync(dbPath)) {
    const backupPath = dbPath.replace('.db', `.backup-android-${Date.now()}.db`);
    fs.copyFileSync(dbPath, backupPath);
    console.log(`  📦 Backup: ${path.basename(backupPath)}`);
  } else {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    console.log('  📦 New database will be created');
  }

  const db = await schema.openDb(dbPath);

  try {
    // ── job_runs ────────────────────────────────────────────────────────────
    console.log('\n🗄  job_runs');
    addColumnIfMissing(db, 'job_runs', 'platform', "TEXT DEFAULT 'web'");

    // ── failed_steps ────────────────────────────────────────────────────────
    console.log('\n🗄  failed_steps');
    addColumnIfMissing(db, 'failed_steps', 'platform',         "TEXT DEFAULT 'web'");
    addColumnIfMissing(db, 'failed_steps', 'tc_id_raw',        'TEXT');
    addColumnIfMissing(db, 'failed_steps', 'config_url',       'TEXT');
    addColumnIfMissing(db, 'failed_steps', 'failed_step_name', 'TEXT');
    addColumnIfMissing(db, 'failed_steps', 'rerun_build_num',  'INTEGER');
    addColumnIfMissing(db, 'failed_steps', 'rerun_result',     'TEXT');
    addColumnIfMissing(db, 'failed_steps', 'retry_count',      'INTEGER DEFAULT 1');
    addColumnIfMissing(db, 'failed_steps', 'full_error_msg',   'TEXT');

    // ── Indexes ─────────────────────────────────────────────────────────────
    console.log('\n📑 Indexes');
    const indexes = [
      ['idx_failed_steps_platform', 'failed_steps(platform, failed_job_id)'],
      ['idx_job_runs_platform',     'job_runs(platform, job_name, job_build)'],
      ['idx_failed_steps_fingerprint_platform', 'failed_steps(error_fingerprint, platform)'],
    ];
    for (const [name, cols] of indexes) {
      try {
        db.exec(`CREATE INDEX IF NOT EXISTS ${name} ON ${cols}`);
        console.log(`  ✅ ${name}`);
      } catch (e) {
        console.warn(`  ⚠ Index ${name}: ${e.message}`);
      }
    }

    // ── Verify final schema ──────────────────────────────────────────────────
    console.log('\n🔍 Verification');
    const requiredAndroidCols = [
      'platform', 'tc_id_raw', 'config_url', 'failed_step_name',
      'rerun_build_num', 'rerun_result', 'retry_count', 'full_error_msg',
    ];
    const actualCols = db.prepare(`PRAGMA table_info(failed_steps)`).all().map(c => c.name);
    const missing    = requiredAndroidCols.filter(c => !actualCols.includes(c));

    if (missing.length > 0) {
      console.error(`  ❌ Still missing columns: ${missing.join(', ')}`);
      db.close();
      process.exit(1);
    } else {
      console.log(`  ✅ All required columns present (${requiredAndroidCols.length} checked)`);
    }

    db.close();
    console.log('\n✅ Android Migration Complete!\n');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    db.close();
    process.exit(1);
  }
};

if (require.main === module) {
  migrateAndroid().catch(console.error);
}

module.exports = { migrateAndroid };
