const parser = require('../android/extent_parser');
const discovery = require('../android/job_discovery');
const classifier = require('../android/failure_classifier');
const crypto = require('crypto');
const dbOperations = require('../database/operations');
const schema = require('../database/schema');
const path = require('path');
const fs = require('fs');

class JenkinsClient {
  constructor(baseUrl, user, token) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authHeader = Buffer.from(`${user}:${token}`).toString('base64');
  }

  async fetch(endpoint) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const res = await fetch(url, { headers: { Authorization: `Basic ${this.authHeader}` }});
    if (!res.ok) {
      if (res.status === 404) return {};
      throw new Error(`Jenkins API ${url} failed: ${res.statusText}`);
    }
    return res.json();
  }

  async fetchRaw(endpoint) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const res = await fetch(url, { headers: { Authorization: `Basic ${this.authHeader}` }});
    if (!res.ok) {
      if (res.status === 404) return '';
      throw new Error(`Jenkins API raw ${url} failed: ${res.statusText}`);
    }
    return res.text();
  }
}

function computeFingerprint(jobName, tcId, testName, failureType) {
  const hash = crypto.createHash('sha256');
  hash.update(`${jobName}|${tcId || 'Unknown'}|${testName}|${failureType}`);
  return hash.digest('hex');
}

async function orchestrateAndroidBuild(triggerJob, triggerBuild, outputDir) {
  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  const jenkinsUrl = process.env.ANDROID_JENKINS_URL || process.env.JENKINS_URL || 'http://ci-master.labs.microstrategy.com:8011';
  const jenkinsUser = process.env.ANDROID_JENKINS_USER || process.env.JENKINS_USER;
  const jenkinsToken = process.env.ANDROID_JENKINS_API_TOKEN || process.env.JENKINS_API_TOKEN;

  if (!jenkinsUser || !jenkinsToken) {
    throw new Error("Missing Jenkins credentials in environment (ANDROID_JENKINS_USER, etc)");
  }

  const client = new JenkinsClient(jenkinsUrl, jenkinsUser, jenkinsToken);

  console.log(`🔍 Discovering downstream jobs for ${triggerJob} #${triggerBuild}...`);
  const discoveryData = await discovery.discoverAndroidBuilds(triggerJob, parseInt(triggerBuild), client);
  
  console.log(`📊 Found: ${discoveryData.passed.length} pass, ${discoveryData.passedByRerun.length} re-run fixed, ${discoveryData.failed.length} failed, ${discoveryData.running.length} still running.`);

  // Write status JSON
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'passed_jobs.json'), JSON.stringify(discoveryData.passed, null, 2));
  fs.writeFileSync(path.join(outputDir, 'failed_jobs.json'), JSON.stringify(discoveryData.failed, null, 2));

  // Connect to DB to trace historical jobs
  const db = await schema.openDb(dbPath);
  dbOperations.enforceFiveRecordLimit(db, triggerJob, 'android');
  
  // Create job run entry based on triggering details
  const triggerJobLink = `${jenkinsUrl}/job/${triggerJob}/${triggerBuild}`;
  const runId = dbOperations.insertJobRun(db, {
    jobName: triggerJob, 
    jobBuild: triggerBuild, 
    jobLink: triggerJobLink, 
    passCount: discoveryData.passed.length + discoveryData.passedByRerun.length, 
    failCount: discoveryData.failed.length, 
    platform: 'android'
  });

  const failureLog = [];

  for (const failedJob of discoveryData.failed) {
    const failedJobId = dbOperations.insertFailedJob(db, runId, {
       jobName: failedJob.jobName,
       jobBuild: failedJob.buildNum,
       jobLink: `${jenkinsUrl}/job/${failedJob.jobName}/${failedJob.buildNum}`
    });

    console.log(`🌐 Fetching ExtentReport for ${failedJob.jobName} #${failedJob.buildNum}`);
    const extentResults = await parser.parseExtentReport(failedJob.jobName, failedJob.buildNum, client);
    const actualFailures = extentResults.filter(r => r.status === 'FAIL');

    if (actualFailures.length === 0) {
      console.warn(`   ⚠ No explicit ExtentReport failures found for ${failedJob.jobName}, flagging unknown`);
    }

    for (const failure of actualFailures) {
      const type = classifier.classifyFailure(failure, failure.testName);
      const fingerprint = computeFingerprint(failedJob.jobName, failure.tcId, failure.testName, type);
      
      const prevData = dbOperations.findLastFailedBuild(db, failedJob.jobName, fingerprint, failedJob.buildNum, 'android');

      const rerunNum = failedJob.rerun ? failedJob.rerun.buildNum : null;
      const rerunRes = failedJob.rerun ? failedJob.rerun.result : null;

      dbOperations.insertFailedStep(db, failedJobId, {
        platform: 'android',
        tcId: failure.tcId || 'N/A',
        tcIdRaw: failure.tcId || null,
        tcName: failure.testName || 'Unknown Test',
        stepId: failure.failedStepName || 'N/A',
        stepName: failure.failedStepName || 'Unknown Step',
        runLabel: 'run_1',
        failureType: type,
        failureMsg: (failure.failedStepDetails || '').slice(0, 150),
        fullErrorMsg: failure.failedStepDetails,
        errorFingerprint: fingerprint,
        lastFailedBuild: prevData.lastFailedBuild,
        isRecurring: prevData.isRecurring,
        configUrl: failure.configUrl,
        failedStepName: failure.failedStepName,
        rerunBuildNum: rerunNum,
        rerunResult: rerunRes,
        retryCount: rerunRes ? 2 : 1  // In Android logic, a re-run usually means it failed once, retried once
      });

      failureLog.push({
        jobName: failedJob.jobName,
        buildNum: failedJob.buildNum,
        testResult: failure,
        failureType: type,
        rerunNum, rerunRes
      });
    }
  }

  // Also store "Passed By Rerun" into DB but skip full report parses.
  for (const fixedJob of discoveryData.passedByRerun) {
    const failedJobId = dbOperations.insertFailedJob(db, runId, {
       jobName: fixedJob.jobName,
       jobBuild: fixedJob.primaryBuildNum,
       jobLink: `${jenkinsUrl}/job/${fixedJob.jobName}/${fixedJob.primaryBuildNum}`
    });
    
    // We add a stub success record since we don't scrape the fail anymore
    dbOperations.insertFailedStep(db, failedJobId, {
      platform: 'android',
      tcId: 'N/A', tcName: 'Fixed Test Stub', stepId: 'N/A', stepName: 'N/A',
      failureType: 'fixed_by_rerun', failureMsg: 'Resolved in re-run', 
      rerunBuildNum: fixedJob.rerunBuildNum, rerunResult: 'SUCCESS',
      errorFingerprint: computeFingerprint(fixedJob.jobName, 'N/A', 'FixedByRerun', 'fixed_by_rerun')
    });
  }

  fs.writeFileSync(path.join(outputDir, 'extent_failures.json'), JSON.stringify(failureLog, null, 2));
  console.log(`✅ Android build mapped and committed. Report Data exported.`);
  
  db.close();
}

module.exports = {
  orchestrateAndroidBuild
};

// If run from command line:
if (require.main === module) {
  const args = require('yargs')
    .option('job', { type: 'string', required: true })
    .option('build', { type: 'number', required: true })
    .option('output-dir', { type: 'string', required: true })
    .argv;
    
  orchestrateAndroidBuild(args.job, args.build, args['output-dir']).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
