#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const crypto = require('crypto');

// -- DB Initialization --

const initSchema = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_runs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      job_name      TEXT    NOT NULL,
      job_build     INTEGER NOT NULL,
      job_link      TEXT    NOT NULL,
      recorded_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      pass_count    INTEGER DEFAULT 0,
      fail_count    INTEGER DEFAULT 0,
      UNIQUE(job_name, job_build)
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
      tc_id               TEXT    NOT NULL,
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
      is_recurring        INTEGER DEFAULT 0
    );
  `);
};

const openDb = (dbPath) => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  return db;
};

// -- DB Operations --

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
  const keys = Object.keys(stepData);
  const cols = keys.map(k => k.replace(/([A-Z])/g, "_$1").toLowerCase());
  const placeholders = keys.map(() => '?').join(', ');
  
  db.prepare(`
    INSERT INTO failed_steps (failed_job_id, ${cols.join(', ')})
    VALUES (?, ${placeholders})
  `).run(failedJobId, ...keys.map(k => stepData[k]));
};

const findLastFailedBuild = (db, jobName, fingerprint, currentBuild) => {
  const row = db.prepare(`
    SELECT fs.last_failed_build, jr.job_build
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    JOIN job_runs jr ON fj.run_id = jr.id
    WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND jr.job_build < ?
    ORDER BY jr.job_build DESC LIMIT 1
  `).get(jobName, fingerprint, currentBuild);
  
  return row ? { lastFailedBuild: row.job_build, isRecurring: 1 } : { lastFailedBuild: null, isRecurring: 0 };
};

// -- Fingerprint & Parsing --

const buildFingerprint = (tcId, stepId, stepName, failureType) => {
  const payload = [tcId, stepId, stepName, failureType].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
};

const parseSpectreUrl = (snapshotUrl) => {
  if (!snapshotUrl) return null;
  const match = snapshotUrl.match(/http:\/\/.*:3000\/projects\/(.+?)\/suites\/(.+?)\/runs\/(\d+)#test_(\d+)/);
  return match ? { project: match[1], suite: match[2], runId: parseInt(match[3]), testId: parseInt(match[4]) } : null;
};

// Spectre API Call - Use fetch directly instead of heavy libraries. Using await needs async shell.
const fetchSpectreData = async (snapshotUrl) => {
  const parsed = parseSpectreUrl(snapshotUrl);
  if (!parsed) return null;
  
  const baseUrl = snapshotUrl.split('/projects/')[0];
  const url = `${baseUrl}/projects/${parsed.project}/suites/${parsed.suite}/runs/${parsed.runId}.json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.tests?.find(t => t.id === parsed.testId) || null;
  } catch (error) {
    return null;
  }
};

const classifySpectreResult = (spectreData) => {
  if (!spectreData) return { verified: 0, falseAlarm: 0, reason: "Spectre data unavailable" };
  
  if (spectreData.pass) return { verified: 2, falseAlarm: 1, reason: "Spectre pass=true — baseline already updated or test fluke" };
  if (spectreData.diff < 1.0) return { verified: 2, falseAlarm: 1, reason: `diff=${spectreData.diff}% below 1% margin — likely cosmetic noise` };
  if (spectreData.diff > spectreData.diff_threshold) return { verified: 1, falseAlarm: 0, reason: `diff=${spectreData.diff}% exceeds threshold ${spectreData.diff_threshold}% — confirmed visual regression` };
  
  return { verified: 2, falseAlarm: 1, reason: "Spectre fail, but diff is under threshold" };
};

// Log Parsing

const extractFailuresFromLog = (consoleText) => {
  const results = [];
  const TC_HEADER_RE = /^\[?(TC\d+)\]?\s+(.+?)\s*:/m;
  const RUN_BLOCK_RE = /✗\s+(run_\d+)/g;
  const SCREENSHOT_RE = /Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/;
  const SPECTRE_URL_RE = /Visit\s+(http:\/\/.*:3000\/\S+)\s+for details/;
  const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;

  const tcBlocks = consoleText.split(/(?=^\[?TC\d+\])/m).filter(b => b.trim() !== "");
  
  tcBlocks.forEach(block => processTcBlock(block, results, { TC_HEADER_RE, RUN_BLOCK_RE, SCREENSHOT_RE, SPECTRE_URL_RE, ASSERTION_RE }));
  return results;
};

const processTcBlock = (block, results, regexes) => {
  const headerMatch = block.match(regexes.TC_HEADER_RE);
  if (!headerMatch) return;
  const [_, tcId, tcName] = headerMatch;
  
  const runs = block.split(/(?=✗\s+run_\d+)/g).filter(r => r.includes('✗ run_'));
  runs.forEach(runBlock => processRunBlock(runBlock, { tcId, tcName }, results, regexes));
};

const processRunBlock = (runBlock, tcData, results, regexes) => {
  const runMatch = runBlock.match(regexes.RUN_BLOCK_RE);
  if (!runMatch) return;
  const runLabel = runMatch[0].replace('✗ ', '').trim();
  
  const screenshotMatch = runBlock.match(regexes.SCREENSHOT_RE);
  if (screenshotMatch) {
    addScreenshotFailure(runBlock, tcData, runLabel, screenshotMatch, results, regexes);
    return;
  }
  
  const assertionMatch = runBlock.match(regexes.ASSERTION_RE);
  if (assertionMatch) addAssertionFailure(runBlock, tcData, runLabel, results);
};

const addScreenshotFailure = (runBlock, tcData, runLabel, match, results, regexes) => {
  const [failureMsg, stepId, stepName] = match;
  const urlMatch = runBlock.match(regexes.SPECTRE_URL_RE);
  results.push({
    tcId: tcData.tcId, tcName: tcData.tcName,
    stepId, stepName, runLabel,
    failureType: 'screenshot_mismatch',
    failureMsg: failureMsg.trim(),
    snapshotUrl: urlMatch ? urlMatch[1] : null
  });
};

const addAssertionFailure = (runBlock, tcData, runLabel, results) => {
  results.push({
    tcId: tcData.tcId, tcName: tcData.tcName,
    stepId: tcData.tcId + "_0X", stepName: "Assertion Failure", runLabel,
    failureType: 'assertion_failure',
    failureMsg: "Assertion failed",
    snapshotUrl: null
  });
};

// -- Main Processing Function --

const processStep = async (db, failedJobId, triggerJobName, triggerBuild, step) => {
  const fingerprint = buildFingerprint(step.tcId, step.stepId, step.stepName, step.failureType);
  const lookback = findLastFailedBuild(db, triggerJobName, fingerprint, triggerBuild);
  
  const spectreData = await fetchSpectreData(step.snapshotUrl);
  const classification = classifySpectreResult(spectreData);
  
  insertFailedStep(db, failedJobId, {
    tcId: step.tcId, tcName: step.tcName,
    stepId: step.stepId, stepName: step.stepName, runLabel: step.runLabel,
    failureType: step.failureType, failureMsg: step.failureMsg, errorFingerprint: fingerprint,
    snapshotUrl: step.snapshotUrl, 
    spectreTestId: spectreData ? spectreData.id : null,
    spectreDiffPct: spectreData ? spectreData.diff : null,
    spectreThreshold: spectreData ? spectreData.diff_threshold : null,
    spectrePass: spectreData ? (spectreData.pass ? 1 : 0) : null,
    snapshotVerified: classification.verified,
    falseAlarm: classification.falseAlarm, snapshotReason: classification.reason,
    lastFailedBuild: lookback.lastFailedBuild, isRecurring: lookback.isRecurring
  });
};

const processJobFailed = async (db, runId, triggerJobName, triggerBuild, jobInfo, reportDir) => {
  const consoleLogFile = path.join(reportDir, `${jobInfo.name}.log`);
  if (!fs.existsSync(consoleLogFile)) return;
  
  const consoleText = fs.readFileSync(consoleLogFile, 'utf8');
  const failures = extractFailuresFromLog(consoleText);
  
  const failedJobId = insertFailedJob(db, runId, {
    jobName: jobInfo.name, jobBuild: jobInfo.build, jobLink: jobInfo.link || ""
  });
  
  for (const step of failures) {
    await processStep(db, failedJobId, triggerJobName, triggerBuild, step);
  }
};

const main = async () => {
  const [,, triggerName, triggerNum, triggerLink, failedJobsFile, passedJobsFile, reportDir] = process.argv;
  if (!passedJobsFile) { console.error('Missing args'); process.exit(1); }

  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  const db = openDb(dbPath);
  
  const failedJobs = JSON.parse(fs.readFileSync(failedJobsFile, 'utf8') || "[]");
  const passedJobs = JSON.parse(fs.readFileSync(passedJobsFile, 'utf8') || "[]");
  
  const runId = insertJobRun(db, {
    jobName: triggerName, jobBuild: parseInt(triggerNum), jobLink: triggerLink,
    passCount: passedJobs.length, failCount: failedJobs.length
  });
  
  enforceFiveRecordLimit(db, triggerName);
  
  for (const job of failedJobs) {
    await processJobFailed(db, runId, triggerName, parseInt(triggerNum), job, reportDir);
  }
  
  db.close();
};

if (require.main === module) { main().catch(console.error); }

module.exports = {
  openDb, parseSpectreUrl, extractFailuresFromLog, classifySpectreResult, buildFingerprint, processTcBlock, processRunBlock
};
