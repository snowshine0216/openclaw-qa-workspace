import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh',
);
const RUN_DIR = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/runs/BCIN-5809',
);
const RUNS_ROOT = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/runs',
);

test('runs the full reporter-local flow with test fixtures', async () => {
  await rm(RUN_DIR, { recursive: true, force: true });

  const jiraRaw = {
    issues: [
      {
        key: 'BUG-1',
        fields: {
          summary: 'Panel hides unexpectedly',
          description: 'Fix in https://github.com/org/repo/pull/12',
          status: { name: 'Resolved' },
          priority: { name: 'High' },
          assignee: { displayName: 'Ada' },
          resolutiondate: '2026-03-10T12:00:00.000+0000',
          comment: { comments: [] },
        },
      },
    ],
  };

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
      TEST_JIRA_ISSUE_TYPE: 'Feature',
      TEST_JIRA_RAW_JSON: JSON.stringify(jiraRaw),
      TEST_SPAWN_OUTPUT_MODE: 'materialize',
      FEISHU_CHAT_ID: 'oc_test_chat',
    },
  });

  assert.equal(result.status, 0);
  const finalReport = await readFile(join(RUN_DIR, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  assert.match(finalReport, /QA Risk & Defect Analysis Report/);

  await rm(RUN_DIR, { recursive: true, force: true });
});

test('runs the full release coordinator flow and materializes feature packets', async () => {
  const releaseRunDir = join(RUNS_ROOT, 'release_99.98');
  const featureRunDirs = [
    join(RUNS_ROOT, 'TREL-9001'),
    join(RUNS_ROOT, 'TREL-9002'),
  ];
  await rm(releaseRunDir, { recursive: true, force: true });
  for (const featureRunDir of featureRunDirs) {
    await rm(featureRunDir, { recursive: true, force: true });
  }

  const jiraRaw = {
    issues: [
      {
        key: 'BUG-10',
        fields: {
          summary: 'Release child flow keeps the packetization path honest',
          description: 'Fix in https://github.com/org/repo/pull/12',
          status: { name: 'Resolved' },
          priority: { name: 'High' },
          assignee: { displayName: 'Ada' },
          resolutiondate: '2026-03-10T12:00:00.000+0000',
          comment: { comments: [] },
        },
      },
    ],
  };

  try {
    const result = spawnSync('bash', [SCRIPT, '99.98'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        TEST_RUNTIME_ENV_OK: '1',
        TEST_JIRA_ISSUE_TYPE: 'Feature',
        TEST_JIRA_RAW_JSON: JSON.stringify(jiraRaw),
        TEST_SPAWN_OUTPUT_MODE: 'materialize',
        TEST_FEATURE_KEYS_JSON: '["TREL-9001","TREL-9002"]',
        FEISHU_CHAT_ID: 'oc_test_chat',
      },
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);

    const featureRuns = JSON.parse(
      await readFile(join(releaseRunDir, 'context', 'feature_runs.json'), 'utf8'),
    );
    const releaseInputs = JSON.parse(
      await readFile(join(releaseRunDir, 'context', 'release_summary_inputs.json'), 'utf8'),
    );
    const childMetadata = JSON.parse(
      await readFile(join(RUNS_ROOT, 'TREL-9001', 'context', 'feature_metadata.json'), 'utf8'),
    );
    const releaseReport = await readFile(
      join(releaseRunDir, 'release_99.98_REPORT_FINAL.md'),
      'utf8',
    );
    const packetManifest = JSON.parse(
      await readFile(
        join(releaseRunDir, 'features', 'TREL-9001', 'packet_manifest.json'),
        'utf8',
      ),
    );

    assert.equal(featureRuns.features.length, 2);
    assert.equal(releaseInputs.features.length, 2);
    assert.equal(childMetadata.release_version, '99.98');
    assert.match(releaseReport, /Release Defect Analysis Report/);
    assert.match(releaseReport, /TREL-9001/);
    assert.match(releaseReport, /release_99\.98\/features\/TREL-9001/);
    assert.equal(packetManifest.feature_key, 'TREL-9001');
  } finally {
    await rm(releaseRunDir, { recursive: true, force: true });
    for (const featureRunDir of featureRunDirs) {
      await rm(featureRunDir, { recursive: true, force: true });
    }
  }
});
