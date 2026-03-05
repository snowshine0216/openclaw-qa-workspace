#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { openDb, insertJobRun, insertFailedJob, insertFailedStep, enforceFiveRecordLimit, findLastFailedBuild } = require('../database');
const { extractFailuresFromLog } = require('../parsing');
const { fetchSpectreData, classifySpectreResult } = require('../analysis/spectre');
const { buildFingerprint } = require('../analysis/fingerprint');

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
  const failures = extractFailuresFromLog(consoleText);
  
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

  const rootDir = path.resolve(__dirname, '..', '..');
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
  processStep,
  processJobFailed,
  main
};
