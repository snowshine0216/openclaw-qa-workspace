const fs = require('fs');
const path = require('path');
const Database = require('./adapter');

const initSchema = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_runs (
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
    
    CREATE TABLE IF NOT EXISTS failed_jobs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id        INTEGER NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
      job_name      TEXT    NOT NULL,
      job_build     INTEGER NOT NULL,
      job_link      TEXT    NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS failed_steps (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      failed_job_id       INTEGER NOT NULL REFERENCES failed_jobs(id) ON DELETE CASCADE,
      platform            TEXT    DEFAULT 'web',
      tc_id               TEXT    NOT NULL,
      tc_id_raw           TEXT,
      tc_name             TEXT    NOT NULL,
      step_id             TEXT    NOT NULL,
      step_name           TEXT    NOT NULL,
      run_label           TEXT,
      failure_type        TEXT,
      failure_msg         TEXT,
      error_fingerprint   TEXT,
      snapshot_url        TEXT,
      spectre_test_id     INTEGER,
      spectre_diff_pct    REAL,
      spectre_threshold   REAL,
      spectre_pass        INTEGER,
      snapshot_verified   INTEGER DEFAULT 0,
      false_alarm         INTEGER DEFAULT 0,
      snapshot_reason     TEXT,
      last_failed_build   INTEGER,
      is_recurring        INTEGER DEFAULT 0,
      config_url          TEXT,
      failed_step_name    TEXT,
      rerun_build_num     INTEGER,
      rerun_result        TEXT
    );
  `);
};

const openDb = async (dbPath) => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = await Database.create(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  return db;
};

module.exports = {
  initSchema,
  openDb
};
