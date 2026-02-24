#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Database = require('./db-adapter');
const crypto = require('crypto');
const { extractFailuresFromLog: extractFailuresV2 } = require('./parser_v2');

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

const openDb = async (dbPath) => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = await Database.create(dbPath);
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
  // Debug: Check for undefined values
  const undefinedKeys = Object.keys(stepData).filter(k => stepData[k] === undefined);
  if (undefinedKeys.length > 0) {
    console.error('⚠ Undefined fields in stepData:', undefinedKeys);
    throw new Error(`Cannot insert undefined values: ${undefinedKeys.join(', ')}`);
  }
  
  const keys = Object.keys(stepData);
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

// -- Fingerprint & Parsing --

const buildFingerprint = (fileName, tcId, stepId, stepName, failureType) => {
  // V2: Now includes fileName for uniqueness across files
  const payload = [fileName, tcId, stepId, stepName, failureType].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
};

const parseSpectreUrl = (snapshotUrl) => {
  if (!snapshotUrl) return null;
  const match = snapshotUrl.match(/http:\/\/.*:3000\/projects\/(.+?)\/suites\/(.+?)\/runs\/(\d+)#test_(\d+)/);
  return match ? { project: match[1], suite: match[2], runId: parseInt(match[3]), testId: parseInt(match[4]) } : null;
};

// Spectre Scraper - Extract data from HTML since no JSON API exists
const fetchSpectreData = async (snapshotUrl) => {
  if (!snapshotUrl || !snapshotUrl.includes('10.23.33.4:3000')) return null;
  
  // Extract test ID from URL
  const testIdMatch = snapshotUrl.match(/#test_(\d+)/);
  if (!testIdMatch) return null;
  
  const testId = testIdMatch[1];
  const baseUrl = snapshotUrl.split('#')[0];
  
  try {
    const http = require('http');
    const { URL } = require('url');
    
    const html = await new Promise((resolve, reject) => {
      http.get(new URL(baseUrl), (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
    
    // Find test block
    const testIdAnchor = `id="test_${testId}"`;
    const testBlockStart = html.indexOf(testIdAnchor);
    if (testBlockStart === -1) return null;
    
    const testBlock = html.substring(testBlockStart, testBlockStart + 2000);
    
    // Extract image URLs
    const imageMatches = [...testBlock.matchAll(/class="test__image" href="([^"]*)"/g)];
    
    // Extract diff percentage
    const diffPctMatch = testBlock.match(/(\d+\.?\d*)%\s+difference/);
    
    // Extract tolerance
    const toleranceMatch = testBlock.match(/(\d+\.?\d*)%\s+tolerance/);
    
    // Extract test name
    const nameMatch = testBlock.match(/<span class="test__name">([^<]+)</);
    
    return {
      id: testId,
      name: nameMatch ? nameMatch[1].trim() : null,
      diff: diffPctMatch ? parseFloat(diffPctMatch[1]) : null,
      diff_threshold: toleranceMatch ? parseFloat(toleranceMatch[1]) : null,
      pass: testBlock.includes('test--passed') || !testBlock.includes('test--failed'),
      baselineUrl: imageMatches[0] ? imageMatches[0][1] : null,
      actualUrl: imageMatches[1] ? imageMatches[1][1] : null,
      diffUrl: imageMatches[2] ? imageMatches[2][1] : null
    };
  } catch (error) {
    console.error(`Spectre fetch error: ${error.message}`);
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

// -- Legacy parsing functions removed - now in parser_v2.js --

// -- Main Processing Function --

const processStep = async (db, failedJobId, triggerJobName, triggerBuild, step) => {
  // V2: Use fileName in fingerprint
  const fingerprint = buildFingerprint(step.fileName, step.tcId, step.stepId, step.stepName, step.failureType);
  const lookback = findLastFailedBuild(db, triggerJobName, fingerprint, triggerBuild);
  
  const spectreData = await fetchSpectreData(step.snapshotUrl);
  const classification = classifySpectreResult(spectreData);
  
  insertFailedStep(db, failedJobId, {
    // V2: Add file_name, retry_count, full_error_msg
    fileName: step.fileName,
    tcId: step.tcId, tcName: step.tcName,
    stepId: step.stepId, stepName: step.stepName, runLabel: step.runLabel,
    retryCount: step.retryCount || 1,  // V2: Retry count from deduplicated parser
    failureType: step.failureType, 
    failureMsg: step.failureMsg, 
    fullErrorMsg: step.fullErrorMsg || step.failureMsg,  // V2: Full error with stack trace
    errorFingerprint: fingerprint,
    snapshotUrl: step.snapshotUrl || null,  // Ensure null, not undefined
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
  // V2: Console logs are saved as JSON files with build number
  const consoleLogFile = path.join(reportDir, `${jobInfo.name}_${jobInfo.number}_console.json`);
  if (!fs.existsSync(consoleLogFile)) {
    console.warn(`⚠ Console log not found: ${consoleLogFile}`);
    return;
  }
  
  // V2: Parse JSON file to get console text
  const consoleData = JSON.parse(fs.readFileSync(consoleLogFile, 'utf8'));
  const consoleText = consoleData.console || '';
  
  // V2: Use new parser that extracts file names and deduplicates retries
  const failures = extractFailuresV2(consoleText);
  
  const failedJobId = insertFailedJob(db, runId, {
    jobName: jobInfo.name, 
    jobBuild: parseInt(jobInfo.number),  // V2: Parse number from JSON
    jobLink: jobInfo.link || ""
  });
  
  for (const step of failures) {
    await processStep(db, failedJobId, jobInfo.name, parseInt(jobInfo.number), step);
  }
};

const main = async () => {
  const [,, triggerName, triggerNum, triggerLink, failedJobsFile, passedJobsFile, reportDir] = process.argv;
  if (!passedJobsFile) { console.error('Missing args'); process.exit(1); }

  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  const db = await openDb(dbPath);
  
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
  openDb, parseSpectreUrl, classifySpectreResult, buildFingerprint
  // V2: Removed extractFailuresFromLog (now in parser_v2.js)
  // V2: Removed processTcBlock, processRunBlock (now in parser_v2.js)
};
