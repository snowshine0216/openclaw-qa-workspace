'use strict';
/**
 * process_android_build.js — Android Library CI orchestration
 *
 * Modes:
 *   Normal:      --job Trigger_Library_Jobs --build 89 --output-dir reports/Trigger_Library_Jobs_89
 *   Single-job:  --single-job Library_RSD_MultiMedia --single-build 330 --output-dir reports/test
 *
 * Single-job mode skips trigger discovery and directly analyses one Library_* job.
 * Useful for testing/debugging the full pipeline with a specific build.
 */

const parser     = require('../android/extent_parser');
const discovery  = require('../android/job_discovery');
const classifier = require('../android/failure_classifier');
const crypto     = require('crypto');
const dbOps      = require('../database/operations');
const schema     = require('../database/schema');
const path       = require('path');
const fs         = require('fs');

// ---------------------------------------------------------------------------
// JenkinsClient
// ---------------------------------------------------------------------------

class JenkinsClient {
  constructor(baseUrl, user, token) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authHeader = Buffer.from(`${user}:${token}`).toString('base64');
  }

  async fetch(endpoint) {
    const url = this._url(endpoint);
    const res = await globalThis.fetch(url, {
      headers: { Authorization: `Basic ${this.authHeader}` },
    });
    if (!res.ok) {
      if (res.status === 404) return {};
      throw new Error(`Jenkins API ${url} → ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async fetchRaw(endpoint) {
    const url = this._url(endpoint);
    const res = await globalThis.fetch(url, {
      headers: { Authorization: `Basic ${this.authHeader}` },
    });
    if (!res.ok) {
      if (res.status === 404) return '';
      throw new Error(`Jenkins raw ${url} → ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  _url(endpoint) {
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const computeFingerprint = (jobName, tcId, testName, failureType) => {
  const hash = crypto.createHash('sha256');
  hash.update(`${jobName}|${tcId || 'Unknown'}|${testName}|${failureType}`);
  return hash.digest('hex');
};

/**
 * Write one failed job's extent results to the DB.
 * Returns an array of failure log objects for JSON export.
 */
const processFailedJob = (db, runId, failedJob, extentResults, jenkinsUrl) => {
  const failedJobDbId = dbOps.insertFailedJob(db, runId, {
    jobName:  failedJob.jobName,
    jobBuild: failedJob.buildNum,
    jobLink:  `${jenkinsUrl}/job/${failedJob.jobName}/${failedJob.buildNum}`,
  });

  const actualFailures = extentResults.filter(r => r.status === 'FAIL');
  const failureLog = [];

  if (actualFailures.length === 0) {
    console.warn(`   ⚠ No explicit ExtentReport failures for ${failedJob.jobName} — flagging unknown`);
    // Insert a placeholder so the job at least appears in reports
    dbOps.insertAndroidFailedStep(db, failedJobDbId, {
      tcId:              'N/A',
      tcIdRaw:           null,
      tcName:            'Unknown (no extent results)',
      stepId:            'N/A',
      stepName:          'N/A',
      runLabel:          'run_1',
      failureType:       'unknown',
      failureMsg:        'ExtentReport returned no test results',
      fullErrorMsg:      null,
      errorFingerprint:  computeFingerprint(failedJob.jobName, null, 'NoExtentResults', 'unknown'),
      lastFailedBuild:   null,
      isRecurring:       0,
      configUrl:         null,
      failedStepName:    null,
      rerunBuildNum:     null,
      rerunResult:       null,
      retryCount:        1,
    });
    return failureLog;
  }

  for (const failure of actualFailures) {
    const type        = classifier.classifyFailure(failure, failure.testName);
    const fingerprint = computeFingerprint(failedJob.jobName, failure.tcId, failure.testName, type);
    const prevData    = dbOps.findLastFailedBuild(db, failedJob.jobName, fingerprint, failedJob.buildNum, 'android');

    const rerunNum = failedJob.rerun ? failedJob.rerun.buildNum : null;
    const rerunRes = failedJob.rerun ? failedJob.rerun.result  : null;

    dbOps.insertAndroidFailedStep(db, failedJobDbId, {
      tcId:              failure.tcId || 'N/A',
      tcIdRaw:           failure.tcId || null,
      tcName:            failure.testName || 'Unknown Test',
      stepId:            failure.failedStepName || 'N/A',
      stepName:          failure.failedStepName || 'Unknown Step',
      runLabel:          'run_1',
      failureType:       type,
      failureMsg:        (failure.failedStepDetails || '').slice(0, 150),
      fullErrorMsg:      failure.failedStepDetails || null,
      errorFingerprint:  fingerprint,
      lastFailedBuild:   prevData.lastFailedBuild,
      isRecurring:       prevData.isRecurring,
      configUrl:         failure.configUrl || null,
      failedStepName:    failure.failedStepName || null,
      rerunBuildNum:     rerunNum,
      rerunResult:       rerunRes,
      retryCount:        rerunRes ? 2 : 1,
    });

    failureLog.push({
      jobName:      failedJob.jobName,
      buildNum:     failedJob.buildNum,
      testResult:   failure,
      failureType:  type,
      rerunNum,
      rerunRes,
      lastFailed:   prevData.lastFailedBuild,
      isRecurring:  prevData.isRecurring,
    });
  }

  return failureLog;
};

// ---------------------------------------------------------------------------
// Single-job mode
// ---------------------------------------------------------------------------

/**
 * Analyse a single known Library_* job without trigger discovery.
 * Entry point for --single-job / --single-build flags.
 */
const analyseSingleJob = async (jobName, buildNum, outputDir) => {
  const jenkinsUrl  = resolveJenkinsUrl();
  const { user, token } = resolveCredentials();
  const client      = new JenkinsClient(jenkinsUrl, user, token);
  const dbPath      = resolveDbPath();

  console.log(`🔧 Mode: single-job  →  ${jobName} #${buildNum}`);
  console.log(`🔧 Jenkins: ${jenkinsUrl} (user: ${user})`);

  fs.mkdirSync(outputDir, { recursive: true });

  // Fetch build result from Jenkins so we can populate pass/fail counts
  const buildInfo = await client.fetch(`/job/${jobName}/${buildNum}/api/json?tree=result`);
  const result    = buildInfo.result || 'UNKNOWN';
  console.log(`📊 ${jobName} #${buildNum}  result = ${result}`);

  const db    = await schema.openDb(dbPath);
  const runId = dbOps.insertJobRun(db, {
    jobName:   jobName,
    jobBuild:  buildNum,
    jobLink:   `${jenkinsUrl}/job/${jobName}/${buildNum}`,
    passCount: result === 'SUCCESS' ? 1 : 0,
    failCount: result === 'SUCCESS' ? 0 : 1,
    platform:  'android',
  });

  let failureLog = [];
  let passedJobs = [];
  let failedJobs = [];

  if (result === 'SUCCESS') {
    passedJobs.push({ jobName, buildNum });
    console.log('✅ Job passed — nothing to parse from ExtentReport.');
  } else {
    const failedJobEntry = { jobName, buildNum, rerun: null };
    failedJobs.push(failedJobEntry);

    console.log(`🌐 Fetching ExtentReport for ${jobName} #${buildNum} ...`);
    const extentResults = await parser.parseExtentReport(jobName, buildNum, client);
    console.log(`   → ${extentResults.length} tests found (${extentResults.filter(r => r.status === 'FAIL').length} failed)`);

    const log = processFailedJob(db, runId, failedJobEntry, extentResults, jenkinsUrl);
    failureLog.push(...log);
  }

  fs.writeFileSync(path.join(outputDir, 'passed_jobs.json'),   JSON.stringify(passedJobs, null, 2));
  fs.writeFileSync(path.join(outputDir, 'failed_jobs.json'),   JSON.stringify(failedJobs, null, 2));
  fs.writeFileSync(path.join(outputDir, 'extent_failures.json'), JSON.stringify(failureLog, null, 2));

  db.close();
  console.log(`✅ Done. Results written to ${outputDir}`);
};

// ---------------------------------------------------------------------------
// Normal trigger mode
// ---------------------------------------------------------------------------

const orchestrateAndroidBuild = async (triggerJob, triggerBuild, outputDir) => {
  const jenkinsUrl  = resolveJenkinsUrl();
  const { user, token } = resolveCredentials();
  const client      = new JenkinsClient(jenkinsUrl, user, token);
  const dbPath      = resolveDbPath();

  console.log(`🔧 Android Jenkins: ${jenkinsUrl} (user: ${user})`);
  console.log(`🔍 Discovering downstream jobs for ${triggerJob} #${triggerBuild} ...`);

  const found = await discovery.discoverAndroidBuilds(triggerJob, parseInt(triggerBuild, 10), client);
  console.log(`📊  pass=${found.passed.length}  fixed-by-rerun=${found.passedByRerun.length}  ` +
              `failed=${found.failed.length}  running=${found.running.length}`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'passed_jobs.json'), JSON.stringify(found.passed, null, 2));
  fs.writeFileSync(path.join(outputDir, 'failed_jobs.json'), JSON.stringify(found.failed, null, 2));

  const db    = await schema.openDb(dbPath);
  dbOps.enforceFiveRecordLimit(db, triggerJob, 'android');

  const runId = dbOps.insertJobRun(db, {
    jobName:  triggerJob,
    jobBuild: triggerBuild,
    jobLink:  `${jenkinsUrl}/job/${triggerJob}/${triggerBuild}`,
    passCount: found.passed.length + found.passedByRerun.length,
    failCount: found.failed.length,
    platform: 'android',
  });

  const failureLog = [];

  for (const failedJob of found.failed) {
    console.log(`🌐 Fetching ExtentReport for ${failedJob.jobName} #${failedJob.buildNum} ...`);
    const extentResults = await parser.parseExtentReport(failedJob.jobName, failedJob.buildNum, client);
    console.log(`   → ${extentResults.length} tests found (${extentResults.filter(r => r.status === 'FAIL').length} failed)`);

    const log = processFailedJob(db, runId, failedJob, extentResults, jenkinsUrl);
    failureLog.push(...log);
  }

  // passedByRerun — store a stub DB record only (no ExtentReport fetch)
  for (const fixedJob of found.passedByRerun) {
    const fjId = dbOps.insertFailedJob(db, runId, {
      jobName:  fixedJob.jobName,
      jobBuild: fixedJob.primaryBuildNum,
      jobLink:  `${jenkinsUrl}/job/${fixedJob.jobName}/${fixedJob.primaryBuildNum}`,
    });
    dbOps.insertAndroidFailedStep(db, fjId, {
      tcId:             'N/A',
      tcIdRaw:          null,
      tcName:           'Fixed by re-run',
      stepId:           'N/A',
      stepName:         'N/A',
      failureType:      'fixed_by_rerun',
      failureMsg:       'Resolved in re-run',
      fullErrorMsg:     null,
      errorFingerprint: computeFingerprint(fixedJob.jobName, 'N/A', 'FixedByRerun', 'fixed_by_rerun'),
      lastFailedBuild:  null,
      isRecurring:      0,
      rerunBuildNum:    fixedJob.rerunBuildNum,
      rerunResult:      'SUCCESS',
      retryCount:       2,
      configUrl:        null,
      failedStepName:   null,
      runLabel:         'run_1',
    });
  }

  fs.writeFileSync(path.join(outputDir, 'extent_failures.json'), JSON.stringify(failureLog, null, 2));
  db.close();
  console.log(`✅ Android build mapped and committed. Data written to ${outputDir}`);
};

// ---------------------------------------------------------------------------
// Env helpers
// ---------------------------------------------------------------------------

const resolveJenkinsUrl = () =>
  (process.env.ANDROID_JENKINS_URL || 'http://ci-master.labs.microstrategy.com:8011').replace(/\/$/, '');

const resolveCredentials = () => {
  const user  = process.env.ANDROID_JENKINS_USER  || process.env.JENKINS_USER;
  const token = process.env.ANDROID_JENKINS_API_TOKEN
             || process.env.ANDROID_JENKINS_TOKEN
             || process.env.JENKINS_API_TOKEN;
  if (!user || !token) {
    throw new Error(
      'Missing credentials. Set ANDROID_JENKINS_USER and ANDROID_JENKINS_TOKEN (or ANDROID_JENKINS_API_TOKEN).'
    );
  }
  return { user, token };
};

const resolveDbPath = () => {
  const rootDir = path.resolve(__dirname, '..');
  return path.join(rootDir, 'data', 'jenkins_history.db');
};

// ---------------------------------------------------------------------------
// Module exports
// ---------------------------------------------------------------------------

module.exports = { orchestrateAndroidBuild, analyseSingleJob };

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

if (require.main === module) {
  const yargs = require('yargs');
  const args = yargs
    .option('job',          { type: 'string',  describe: 'Trigger job name (normal mode)' })
    .option('build',        { type: 'number',  describe: 'Trigger build number (normal mode)' })
    .option('single-job',   { type: 'string',  describe: 'Library job name (single-job mode)' })
    .option('single-build', { type: 'number',  describe: 'Library build number (single-job mode)' })
    .option('output-dir',   { type: 'string',  required: true, describe: 'Output directory for reports' })
    .check(argv => {
      const hasNormal = argv.job && argv.build;
      const hasSingle = argv['single-job'] && argv['single-build'];
      if (!hasNormal && !hasSingle) {
        throw new Error('Provide either --job + --build OR --single-job + --single-build');
      }
      return true;
    })
    .argv;

  const outputDir = args['output-dir'];

  const run = args['single-job']
    ? analyseSingleJob(args['single-job'], args['single-build'], outputDir)
    : orchestrateAndroidBuild(args.job, args.build, outputDir);

  run.catch(err => {
    console.error('❌', err.message);
    process.exit(1);
  });
}
