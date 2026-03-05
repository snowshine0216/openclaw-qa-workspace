'use strict';
/**
 * database/operations.js — SQLite read/write helpers for jenkins_history.db
 */

// ---------------------------------------------------------------------------
// job_runs
// ---------------------------------------------------------------------------

const insertJobRun = (db, { jobName, jobBuild, jobLink, passCount, failCount, platform = 'web' }) =>
  db.prepare(`
    INSERT INTO job_runs (job_name, job_build, job_link, pass_count, fail_count, platform)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(job_name, job_build, platform) DO UPDATE SET
      pass_count = excluded.pass_count,
      fail_count = excluded.fail_count
    RETURNING id
  `).get(jobName, jobBuild, jobLink, passCount, failCount, platform).id;

const enforceFiveRecordLimit = (db, jobName, platform = 'web') => {
  db.prepare(`
    DELETE FROM job_runs
    WHERE job_name = ? AND platform = ? AND id NOT IN (
      SELECT id FROM job_runs
      WHERE job_name = ? AND platform = ?
      ORDER BY job_build DESC LIMIT 5
    )
  `).run(jobName, platform, jobName, platform);
};

// ---------------------------------------------------------------------------
// failed_jobs
// ---------------------------------------------------------------------------

const insertFailedJob = (db, runId, { jobName, jobBuild, jobLink }) =>
  db.prepare(`
    INSERT INTO failed_jobs (run_id, job_name, job_build, job_link)
    VALUES (?, ?, ?, ?)
  `).run(runId, jobName, jobBuild, jobLink).lastInsertRowid;

// ---------------------------------------------------------------------------
// failed_steps — web CI (generic, uses camelCase→snake_case auto-mapping)
// ---------------------------------------------------------------------------

/**
 * Generic insertion for web CI failed steps.
 * Converts camelCase keys to snake_case column names automatically.
 * Throws if stepData contains undefined values.
 */
const insertFailedStep = (db, failedJobId, stepData) => {
  const undefinedKeys = Object.keys(stepData).filter(k => stepData[k] === undefined);
  if (undefinedKeys.length > 0) {
    console.error('⚠ Undefined fields in stepData:', undefinedKeys);
    throw new Error(`Cannot insert undefined values: ${undefinedKeys.join(', ')}`);
  }

  const keys  = Object.keys(stepData);
  const cols  = keys.map(k => k.replace(/([A-Z])/g, '_$1').toLowerCase());
  const placeholders = keys.map(() => '?').join(', ');

  db.prepare(`
    INSERT INTO failed_steps (failed_job_id, ${cols.join(', ')})
    VALUES (?, ${placeholders})
  `).run(failedJobId, ...keys.map(k => stepData[k]));
};

// ---------------------------------------------------------------------------
// failed_steps — Android CI (explicit column list, safe from naming bugs)
// ---------------------------------------------------------------------------

/**
 * Insert an Android CI failed step with an explicit column mapping.
 * All nullable fields default to null when not provided.
 *
 * @param {object} db
 * @param {number} failedJobId
 * @param {object} p  - step parameters
 */
const insertAndroidFailedStep = (db, failedJobId, p) => {
  const row = {
    platform:          p.platform          ?? 'android',
    tc_id:             p.tcId              ?? 'N/A',
    tc_id_raw:         p.tcIdRaw           ?? null,
    tc_name:           p.tcName            ?? 'Unknown Test',
    step_id:           p.stepId            ?? 'N/A',
    step_name:         p.stepName          ?? 'N/A',
    run_label:         p.runLabel          ?? null,
    failure_type:      p.failureType       ?? 'unknown',
    failure_msg:       p.failureMsg        ?? null,
    full_error_msg:    p.fullErrorMsg      ?? null,
    error_fingerprint: p.errorFingerprint  ?? null,
    last_failed_build: p.lastFailedBuild   ?? null,
    is_recurring:      p.isRecurring       ?? 0,
    config_url:        p.configUrl         ?? null,
    failed_step_name:  p.failedStepName    ?? null,
    rerun_build_num:   p.rerunBuildNum     ?? null,
    rerun_result:      p.rerunResult       ?? null,
    retry_count:       p.retryCount        ?? 1,
  };

  const cols  = Object.keys(row);
  const vals  = Object.values(row);
  const placeholders = cols.map(() => '?').join(', ');

  db.prepare(`
    INSERT INTO failed_steps (failed_job_id, ${cols.join(', ')})
    VALUES (?, ${placeholders})
  `).run(failedJobId, ...vals);
};

// ---------------------------------------------------------------------------
// History lookup
// ---------------------------------------------------------------------------

/**
 * Find the most recent build where the same fingerprint was seen.
 *
 * @param {object} db
 * @param {string} jobName
 * @param {string} fingerprint
 * @param {number} currentBuild  - exclude current build from history
 * @param {string} platform
 * @returns {{ lastFailedBuild: number|null, isRecurring: number, failureHistory: number[] }}
 */
const findLastFailedBuild = (db, jobName, fingerprint, currentBuild, platform = 'web') => {
  const rows = db.prepare(`
    SELECT fj.job_build
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    WHERE fj.job_name = ? AND fs.error_fingerprint = ?
      AND fj.job_build < ? AND fs.platform = ?
    ORDER BY fj.job_build DESC LIMIT 5
  `).all(jobName, fingerprint, currentBuild, platform);

  if (rows.length === 0) {
    return { lastFailedBuild: null, isRecurring: 0, failureHistory: [] };
  }

  return {
    lastFailedBuild: rows[0].job_build,
    isRecurring: 1,
    failureHistory: rows.map(r => r.job_build),
  };
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  insertJobRun,
  enforceFiveRecordLimit,
  insertFailedJob,
  insertFailedStep,
  insertAndroidFailedStep,
  findLastFailedBuild,
};
