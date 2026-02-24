#!/usr/bin/env node
const schema = require('./schema');
const path = require('path');
const fs = require('fs');

const migrateAndroid = async () => {
  console.log('🔧 Starting Android CI Migration...\n');
  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  if (fs.existsSync(dbPath)) {
    const backupPath = dbPath.replace('.db', `.backup-android-${Date.now()}.db`);
    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup created: ${path.basename(backupPath)}`);
  }
  
  // schema.openDb initializes tables if they don't exist
  const db = await schema.openDb(dbPath);
  try {
    const jrCols = db.prepare(`PRAGMA table_info(job_runs)`).all().map(c => c.name);
    if (!jrCols.includes('platform')) {
      db.exec(`ALTER TABLE job_runs ADD COLUMN platform TEXT DEFAULT 'web'`);
      console.log('✅ job_runs.platform column added');
    }

    const fsCols = db.prepare(`PRAGMA table_info(failed_steps)`).all().map(c => c.name);
    if (!fsCols.includes('platform')) {
      db.exec(`ALTER TABLE failed_steps ADD COLUMN platform TEXT DEFAULT 'web'`);
      db.exec(`ALTER TABLE failed_steps ADD COLUMN tc_id_raw TEXT`);
      db.exec(`ALTER TABLE failed_steps ADD COLUMN config_url TEXT`);
      db.exec(`ALTER TABLE failed_steps ADD COLUMN failed_step_name TEXT`);
      db.exec(`ALTER TABLE failed_steps ADD COLUMN rerun_build_num INTEGER`);
      db.exec(`ALTER TABLE failed_steps ADD COLUMN rerun_result TEXT`);
      console.log('✅ Android failed_steps columns added');
    }

    try {
      db.exec(`CREATE INDEX IF NOT EXISTS idx_failed_steps_platform ON failed_steps(platform, failed_job_id)`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_job_runs_platform ON job_runs(platform, job_name, job_build)`);
      console.log('✅ Android indexes created');
    } catch (e) { }

    console.log('✅ Android Migration Complete!');
    db.close();
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
