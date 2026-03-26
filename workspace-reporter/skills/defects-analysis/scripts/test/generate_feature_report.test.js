import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { generateFeatureReport } from '../lib/generate_feature_report.mjs';

async function setupFeatureRun() {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-report-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'feature_metadata.json'),
    JSON.stringify({
      feature_key: 'BCIN-7289',
      feature_title: 'Embed Library Report Editor into the Workstation Report Authoring',
      issue_type: 'Feature',
      release_version: '26.04',
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'defect_index.json'),
    JSON.stringify({
      defects: [
        {
          key: 'BCIN-7669',
          summary: 'Save fails on translated prompts',
          status: 'Open',
          priority: 'High',
          assignee: 'Ada',
          area: 'Prompt Handling',
          pr_links: ['https://github.com/org/workstation-report-editor/pull/12'],
        },
        {
          key: 'BCIN-7727',
          summary: 'Save-as loses library metadata',
          status: 'In Progress',
          priority: 'Critical',
          assignee: 'Lin',
          area: 'Save / Save-As Flows',
          pr_links: ['https://github.com/org/web-dossier/pull/44'],
        },
        {
          key: 'BCIN-8001',
          summary: 'Localized button label overflows',
          status: 'Resolved',
          priority: 'Medium',
          assignee: 'Sam',
          area: 'i18n / Localization',
          pr_links: [],
        },
      ],
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    JSON.stringify({
      pr_count: 2,
      repos_changed: ['web-dossier', 'workstation-report-editor'],
      merged_count: 1,
      open_count: 1,
      top_risky_prs: [
        {
          repository: 'workstation-report-editor',
          number: 12,
          risk_level: 'HIGH',
          summary: 'Touches prompt serialization and save flow',
        },
      ],
      top_changed_domains: ['prompt', 'save-flow', 'i18n'],
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    '# PR 12\n\nRegression Risk: High\n\nRepository: workstation-report-editor\n',
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-2_impact.md'),
    '# PR 44\n\nRegression Risk: Medium\n\nRepository: web-dossier\n',
    'utf8',
  );
  return runDir;
}

test('generateFeatureReport renders feature title, grouped risks, blocking defects, and repo-aware PR analysis', async () => {
  const runDir = await setupFeatureRun();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-7289', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /Embed Library Report Editor into the Workstation Report Authoring/);
    assert.match(report, /Prompt Handling/);
    assert.match(report, /Save \/ Save-As Flows/);
    assert.match(report, /BCIN-7669/);
    assert.match(report, /BCIN-7727/);
    assert.match(report, /workstation-report-editor/);
    assert.match(report, /web-dossier/);
    assert.match(report, /Release Recommendation:/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('generateFeatureReport infers concrete functional areas when defect_index only provides General', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-report-area-inference-'));
  try {
    await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'feature_metadata.json'),
      JSON.stringify({
        feature_key: 'AHSC-1972',
        feature_title: 'Auto Dash Reliability',
        issue_type: 'Feature',
        release_version: '26.04',
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'defect_index.json'),
      JSON.stringify({
        defects: [
          {
            key: 'ACSC-4918',
            summary: 'Information window layout breaks after adding visualization',
            status: 'Open',
            priority: 'High',
            assignee: 'Ada',
            area: 'General',
          },
          {
            key: 'AHSC-2132',
            summary: 'Rich text box appears in raw Markdown format',
            status: 'To Do',
            priority: 'High',
            assignee: 'Lin',
            area: 'General',
          },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'pr_impact_summary.json'),
      JSON.stringify({
        pr_count: 1,
        repos_changed: ['container-ai-engine-chat-service'],
        top_risky_prs: [
          {
            repository: 'container-ai-engine-chat-service',
            number: null,
            risk_level: 'HIGH',
            summary: 'PR: https://github.com/mstr-kiai/container-ai-engine-chat-service/pull/4094',
          },
        ],
        top_changed_domains: ['api', 'prompt'],
      }),
      'utf8',
    );

    const outPath = generateFeatureReport(runDir, 'AHSC-1972', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /Information Window/);
    assert.match(report, /Rich Text & Narrative Content/);
    assert.doesNotMatch(report, /Primary concerns:\s*General\./);
    assert.match(report, /PR #4094/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
