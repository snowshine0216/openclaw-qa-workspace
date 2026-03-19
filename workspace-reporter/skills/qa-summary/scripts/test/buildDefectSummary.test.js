import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildDefectSummary } from '../lib/buildDefectSummary.mjs';

test('returns noDefectsFound when jira has no issues', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(
    join(defectsDir, 'BCIN-1_REPORT_FINAL.md'),
    '# Report\nNo defects.'
  );
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({ issues: [] })
  );
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');
  const result = await buildDefectSummary({
    featureKey: 'BCIN-1',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });
  assert.equal(result.totalDefects, 0);
  assert.equal(result.noDefectsFound, true);
  assert.ok(Array.isArray(result.defects));
  assert.ok(Array.isArray(result.prs));
});

test('extracts defects from jira_raw', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(
    join(defectsDir, 'BCIN-1_REPORT_FINAL.md'),
    '# Report'
  );
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          fields: {
            summary: 'Bug',
            status: { name: 'Resolved' },
            priority: { name: 'P1' },
            resolution: { name: 'Done' },
          },
        },
      ],
    })
  );
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');
  const result = await buildDefectSummary({
    featureKey: 'BCIN-1',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });
  assert.equal(result.totalDefects, 1);
  assert.equal(result.defects[0].key, 'BCIN-100');
});

test('derives Jira browse links from issue self URL', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-1_REPORT_FINAL.md'), '# Report');
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          self: 'https://company.atlassian.net/rest/api/3/issue/12345',
          fields: {
            summary: 'Bug',
            status: { name: 'Open' },
            priority: { name: 'High' },
            resolution: { name: '' },
          },
        },
      ],
    })
  );
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');

  const result = await buildDefectSummary({
    featureKey: 'BCIN-1',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });

  assert.equal(result.defects[0].url, 'https://company.atlassian.net/browse/BCIN-100');
});

test('leaves Jira browse link blank when no real base URL can be derived', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-1_REPORT_FINAL.md'), '# Report');
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          fields: {
            summary: 'Bug',
            status: { name: 'Open' },
            priority: { name: 'High' },
            resolution: { name: '' },
          },
        },
      ],
    })
  );
  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');

  const result = await buildDefectSummary({
    featureKey: 'BCIN-1',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });

  assert.equal(result.defects[0].url, '');
});

test('collects PRs from feature comments, all defect comments, and PR impact artifacts', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'),
    '# Report'
  );
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          fields: {
            summary: 'First defect',
            status: { name: 'Resolved' },
            priority: { name: 'P1' },
            resolution: { name: 'Done' },
            comment: {
              comments: [
                { body: 'Fix is in https://github.com/org/app/pull/12' },
              ],
            },
          },
        },
        {
          key: 'BCIN-101',
          fields: {
            summary: 'Second defect',
            status: { name: 'Resolved' },
            priority: { name: 'High' },
            resolution: { name: 'Done' },
            comment: {
              comments: [
                { body: 'Also fixed in https://github.com/org/app/pull/13' },
              ],
            },
          },
        },
      ],
    })
  );
  await writeFile(
    join(defectsDir, 'context', 'prs', 'pr-3_impact.md'),
    [
      '# PR Impact',
      'Supplemental analysis for https://github.com/org/app/pull/14',
      'Regression Risk: High',
    ].join('\n')
  );

  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(
    join(plannerDir, 'planner_summary_seed.md'),
    'Feature comment references https://github.com/org/feature-repo/pull/101'
  );

  const result = await buildDefectSummary({
    featureKey: 'BCIN-7289',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });

  assert.deepEqual(
    result.prs.map((pr) => pr.url).sort(),
    [
      'https://github.com/org/app/pull/12',
      'https://github.com/org/app/pull/13',
      'https://github.com/org/app/pull/14',
      'https://github.com/org/feature-repo/pull/101',
    ]
  );
  const featurePr = result.prs.find((pr) => pr.url.endsWith('/101'));
  assert.equal(featurePr?.sourceKind, 'feature_change');
  const defectFixes = result.prs.filter((pr) => pr.sourceKind === 'defect_fix');
  assert.equal(defectFixes.length, 3);
  const impactPr = result.prs.find((pr) => pr.url.endsWith('/14'));
  assert.equal(impactPr?.riskLevel, 'HIGH');
});

test('classifies report-only PRs as defect fixes instead of feature changes', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(
    join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'),
    [
      '# Report',
      'Resolved via https://github.com/org/app/pull/77',
    ].join('\n')
  );
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          fields: {
            summary: 'First defect',
            status: { name: 'Resolved' },
            priority: { name: 'P1' },
            resolution: { name: 'Done' },
          },
        },
      ],
    })
  );

  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');

  const result = await buildDefectSummary({
    featureKey: 'BCIN-7289',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });

  assert.equal(result.prs.length, 1);
  assert.equal(result.prs[0].url, 'https://github.com/org/app/pull/77');
  assert.equal(result.prs[0].sourceKind, 'defect_fix');
  assert.equal(result.prs[0].riskLevel, 'MEDIUM');
});

test('keeps the strongest risk when the same PR is found in comments and impact analysis', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context', 'prs'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'), '# Report');
  await writeFile(
    join(defectsDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-100',
          fields: {
            summary: 'First defect',
            status: { name: 'Resolved' },
            priority: { name: 'P1' },
            resolution: { name: 'Done' },
            comment: {
              comments: [
                { body: 'Fix is in https://github.com/org/app/pull/12' },
              ],
            },
          },
        },
      ],
    })
  );
  await writeFile(
    join(defectsDir, 'context', 'prs', 'pr-12_impact.md'),
    [
      '# PR 12 Fix Risk Analysis',
      'https://github.com/org/app/pull/12',
      'Risk: High',
    ].join('\n')
  );

  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');

  const result = await buildDefectSummary({
    featureKey: 'BCIN-7289',
    defectsRunDir: defectsDir,
    plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
    plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
  });

  assert.equal(result.prs.length, 1);
  assert.equal(result.prs[0].url, 'https://github.com/org/app/pull/12');
  assert.equal(result.prs[0].riskLevel, 'HIGH');
  assert.deepEqual(result.prs[0].linkedDefectKeys, ['BCIN-100']);
});

test('blocks when a defect report exists without jira_raw context', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'qa-summary-defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'), '# Report');

  const plannerDir = await mkdtemp(join(tmpdir(), 'qa-summary-planner-'));
  await writeFile(join(plannerDir, 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(plannerDir, 'planner_summary_seed.md'), '');

  await assert.rejects(
    () =>
      buildDefectSummary({
        featureKey: 'BCIN-7289',
        defectsRunDir: defectsDir,
        plannerLookupPath: join(plannerDir, 'planner_artifact_lookup.json'),
        plannerSeedPath: join(plannerDir, 'planner_summary_seed.md'),
      }),
    /jira_raw\.json/
  );
});
