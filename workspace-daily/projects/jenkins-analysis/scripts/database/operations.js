const insertJobRun = (db, { jobName, jobBuild, jobLink, passCount, failCount }) => {
  return db.prepare(`
    INSERT INTO job_runs (job_name, job_build, job_link, pass_count, fail_count)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(job_name, job_build) DO UPDATE SET 
      pass_count=excluded.pass_count, fail_count=excluded.fail_count
    RETURNING id
  `).get(jobName, jobBuild, jobLink, passCount, failCount).id;
};

const enforceFiveRecordLimit = (db, jobName) => {
  db.prepare(`
    DELETE FROM job_runs 
    WHERE job_name = ? AND id NOT IN (
      SELECT id FROM job_runs WHERE job_name = ? ORDER BY job_build DESC LIMIT 5
    )
  `).run(jobName, jobName);
};

const insertFailedJob = (db, runId, { jobName, jobBuild, jobLink }) => {
  return db.prepare(`
    INSERT INTO failed_jobs (run_id, job_name, job_build, job_link)
    VALUES (?, ?, ?, ?)
  `).run(runId, jobName, jobBuild, jobLink).lastInsertRowid;
};

const insertFailedStep = (db, failedJobId, stepData) => {
  // Debug: Check for undefined values
  const undefinedKeys = Object.keys(stepData).filter(k => stepData[k] === undefined);
  if (undefinedKeys.length > 0) {
    console.error('⚠ Undefined fields in stepData:', undefinedKeys);
    throw new Error(`Cannot insert undefined values: ${undefinedKeys.join(', ')}`);
  }
  
  const keys = Object.keys(stepData);
  // Ensure we match db column names
  const cols = keys.map(k => k.replace(/([A-Z])/g, "_$1").toLowerCase());
  const placeholders = keys.map(() => '?').join(', ');
  
  db.prepare(`
    INSERT INTO failed_steps (failed_job_id, ${cols.join(', ')})
    VALUES (?, ${placeholders})
  `).run(failedJobId, ...keys.map(k => stepData[k]));
};

const findLastFailedBuild = (db, jobName, fingerprint, currentBuild) => {
  // V2: Look back last 5 builds - use fj.job_build (actual failed job build, not trigger build)
  const rows = db.prepare(`
    SELECT fj.job_build
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND fj.job_build < ?
    ORDER BY fj.job_build DESC LIMIT 5
  `).all(jobName, fingerprint, currentBuild);
  
  if (rows.length === 0) {
    return { lastFailedBuild: null, isRecurring: 0, failureHistory: [] };
  }
  
  return { 
    lastFailedBuild: rows[0].job_build,  // Most recent failure
    isRecurring: 1,
    failureHistory: rows.map(r => r.job_build)  // All 5 builds
  };
};

module.exports = {
  insertJobRun,
  enforceFiveRecordLimit,
  insertFailedJob,
  insertFailedStep,
  findLastFailedBuild
};
