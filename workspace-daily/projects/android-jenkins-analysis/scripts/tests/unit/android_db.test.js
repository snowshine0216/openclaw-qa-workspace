'use strict';
/**
 * Unit tests for database/operations.js — Android CI path (Jest format)
 *
 * Tests:
 *  - insertJobRun (android platform) with upsert
 *  - insertFailedJob
 *  - insertAndroidFailedStep (all key fields)
 *  - findLastFailedBuild (recurring detection)
 *  - enforceFiveRecordLimit (pruning to 5 builds)
 */

const path     = require('path');
const os       = require('os');
const Database = require('../../../scripts/database/adapter');
const { initSchema }  = require('../../../scripts/database/schema');
const ops      = require('../../../scripts/database/operations');

// ---------------------------------------------------------------------------
// Helper: open fresh in-memory-backed temp DB per test
// ---------------------------------------------------------------------------

let openMem;

beforeAll(() => {
  openMem = async () => {
    const tmpPath = path.join(os.tmpdir(), `android_ops_test_${Date.now()}_${Math.random()}.db`);
    const db = await Database.create(tmpPath);
    db.pragma('foreign_keys = ON');
    initSchema(db);
    return db;
  };
});

const seedRun = (db, jobBuild = 1) =>
  ops.insertJobRun(db, {
    jobName: 'TLJ', jobBuild, jobLink: `http://ci/${jobBuild}`,
    passCount: 0, failCount: 1, platform: 'android',
  });

const seedJob = (db, runId, jobName = 'Lib_A', jobBuild = 10) =>
  ops.insertFailedJob(db, runId, { jobName, jobBuild, jobLink: `http://ci/${jobName}/${jobBuild}` });

// ---------------------------------------------------------------------------
// insertJobRun
// ---------------------------------------------------------------------------

describe('insertJobRun (android)', () => {
  test('returns a numeric id > 0', async () => {
    const db    = await openMem();
    const runId = ops.insertJobRun(db, {
      jobName: 'Trigger_Library_Jobs', jobBuild: 100,
      jobLink: 'http://ci/100', passCount: 5, failCount: 2, platform: 'android',
    });
    expect(typeof runId).toBe('number');
    expect(runId).toBeGreaterThan(0);
    db.close();
  });

  test('upserts without error and updates pass_count', async () => {
    const db  = await openMem();
    const id1 = ops.insertJobRun(db, {
      jobName: 'TLJ', jobBuild: 200, jobLink: 'http://ci/200',
      passCount: 3, failCount: 1, platform: 'android',
    });
    const id2 = ops.insertJobRun(db, {
      jobName: 'TLJ', jobBuild: 200, jobLink: 'http://ci/200',
      passCount: 4, failCount: 0, platform: 'android',
    });
    expect(id1).toBe(id2);
    const row = db.prepare(`SELECT pass_count FROM job_runs WHERE id = ?`).get(id1);
    expect(row.pass_count).toBe(4);
    db.close();
  });
});

// ---------------------------------------------------------------------------
// insertFailedJob
// ---------------------------------------------------------------------------

describe('insertFailedJob', () => {
  test('returns a valid rowid', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 300);
    const fjId  = seedJob(db, runId, 'Library_RSD_MultiMedia', 330);
    expect(Number(fjId)).toBeGreaterThan(0);
    db.close();
  });
});

// ---------------------------------------------------------------------------
// insertAndroidFailedStep
// ---------------------------------------------------------------------------

describe('insertAndroidFailedStep', () => {
  test('inserts a minimal step without error', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 1);
    const fjId  = seedJob(db, runId);

    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC79556', tcName: '06_GM', failureType: 'screenshot_failure',
      failedStepName: 'screenshot', errorFingerprint: 'abc123',
    });

    const rows = db.prepare(`SELECT * FROM failed_steps WHERE failed_job_id = ?`).all(Number(fjId));
    expect(rows.length).toBe(1);
    expect(rows[0].tc_id).toBe('TC79556');
    expect(rows[0].platform).toBe('android');
    expect(rows[0].failure_type).toBe('screenshot_failure');
    db.close();
  });

  test('stores full_error_msg', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 2);
    const fjId  = seedJob(db, runId, 'Lib_B', 20);

    const errMsg = 'NoSuchElementException: element not found at xpath //button[@id="ok"]';
    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC80100', tcName: 'SomeTest', failureType: 'script_play_failure',
      fullErrorMsg: errMsg, errorFingerprint: 'def456',
    });

    const row = db.prepare(`SELECT full_error_msg FROM failed_steps WHERE failed_job_id = ?`).get(Number(fjId));
    expect(row.full_error_msg).toBe(errMsg);
    db.close();
  });

  test('stores config_url and failed_step_name', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 3);
    const fjId  = seedJob(db, runId, 'Lib_C', 30);

    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC77777', tcName: 'CfgTest', failureType: 'screenshot_failure',
      configUrl: 'dossier://test?id=123', failedStepName: 'screenshot', errorFingerprint: 'ghi789',
    });

    const row = db.prepare(`SELECT config_url, failed_step_name FROM failed_steps WHERE failed_job_id = ?`).get(Number(fjId));
    expect(row.config_url).toBe('dossier://test?id=123');
    expect(row.failed_step_name).toBe('screenshot');
    db.close();
  });

  test('stores rerun_build_num and rerun_result', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 4);
    const fjId  = seedJob(db, runId, 'Lib_D', 40);

    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC55555', tcName: 'RerunTest', failureType: 'script_play_failure',
      rerunBuildNum: 41, rerunResult: 'SUCCESS', errorFingerprint: 'jkl012',
    });

    const row = db.prepare(`SELECT rerun_build_num, rerun_result FROM failed_steps WHERE failed_job_id = ?`).get(Number(fjId));
    expect(row.rerun_build_num).toBe(41);
    expect(row.rerun_result).toBe('SUCCESS');
    db.close();
  });

  test('stores retry_count', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 5);
    const fjId  = seedJob(db, runId, 'Lib_E', 50);

    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC44444', tcName: 'RetryTest', failureType: 'unknown',
      retryCount: 3, errorFingerprint: 'mno345',
    });

    const row = db.prepare(`SELECT retry_count FROM failed_steps WHERE failed_job_id = ?`).get(Number(fjId));
    expect(row.retry_count).toBe(3);
    db.close();
  });
});

// ---------------------------------------------------------------------------
// findLastFailedBuild
// ---------------------------------------------------------------------------

describe('findLastFailedBuild', () => {
  test('returns null when no history exists', async () => {
    const db  = await openMem();
    const res = ops.findLastFailedBuild(db, 'Lib_Z', 'no_print_here', 999, 'android');
    expect(res.lastFailedBuild).toBeNull();
    expect(res.isRecurring).toBe(0);
    db.close();
  });

  test('detects recurring failure from a prior build', async () => {
    const db    = await openMem();
    const runId = seedRun(db, 100);
    const fjId  = seedJob(db, runId, 'Lib_F', 100);

    ops.insertAndroidFailedStep(db, fjId, {
      tcId: 'TC11111', tcName: 'RecurringTest', failureType: 'screenshot_failure',
      errorFingerprint: 'fingerprint_recurring',
    });

    const res = ops.findLastFailedBuild(db, 'Lib_F', 'fingerprint_recurring', 101, 'android');
    expect(res.lastFailedBuild).toBe(100);
    expect(res.isRecurring).toBe(1);
    db.close();
  });

  test('does not match fingerprint from a different platform (web)', async () => {
    const db    = await openMem();
    const runId = ops.insertJobRun(db, {
      jobName: 'WebTrigger', jobBuild: 50, jobLink: 'http://ci/50',
      passCount: 0, failCount: 1, platform: 'web',
    });
    const fjId = seedJob(db, runId, 'Lib_Web', 50);

    // Insert a step on 'web' platform
    ops.insertFailedStep(db, fjId, {
      platform: 'web', tcId: 'TC22222', tcName: 'WebTest',
      stepId: 'S1', stepName: 'step', failureType: 'assertion_failure',
      errorFingerprint: 'cross_platform_fp',
    });

    // Query for 'android' platform — should return null
    const res = ops.findLastFailedBuild(db, 'Lib_Web', 'cross_platform_fp', 51, 'android');
    expect(res.lastFailedBuild).toBeNull();
    db.close();
  });
});

// ---------------------------------------------------------------------------
// enforceFiveRecordLimit
// ---------------------------------------------------------------------------

describe('enforceFiveRecordLimit', () => {
  test('prunes to 5 builds (keeps highest)', async () => {
    const db = await openMem();

    for (let i = 1; i <= 7; i++) {
      ops.insertJobRun(db, {
        jobName: 'TLJ', jobBuild: i, jobLink: `http://ci/${i}`,
        passCount: 0, failCount: 1, platform: 'android',
      });
    }

    ops.enforceFiveRecordLimit(db, 'TLJ', 'android');

    const rows  = db.prepare(`SELECT job_build FROM job_runs WHERE job_name = 'TLJ' AND platform = 'android'`).all();
    const builds = rows.map(r => r.job_build).sort((a, b) => a - b);
    expect(builds.length).toBe(5);
    expect(builds[0]).toBe(3);  // oldest kept
    expect(builds[4]).toBe(7);  // newest kept
    db.close();
  });

  test('does not prune when <= 5 records exist', async () => {
    const db = await openMem();

    for (let i = 1; i <= 4; i++) {
      ops.insertJobRun(db, {
        jobName: 'TLJ2', jobBuild: i, jobLink: `http://ci/${i}`,
        passCount: 0, failCount: 1, platform: 'android',
      });
    }

    ops.enforceFiveRecordLimit(db, 'TLJ2', 'android');

    const rows = db.prepare(`SELECT job_build FROM job_runs WHERE job_name = 'TLJ2' AND platform = 'android'`).all();
    expect(rows.length).toBe(4);
    db.close();
  });
});
