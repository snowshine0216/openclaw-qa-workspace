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

test('groupByArea counts high only for open defects — closed high-priority is excluded', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-report-highcount-'));
  try {
    await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
    await writeFile(
      join(runDir, 'context', 'feature_metadata.json'),
      JSON.stringify({ feature_key: 'FEAT-1', feature_title: 'High Count Fix', issue_type: 'Feature', release_version: '1.0' }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'defect_index.json'),
      JSON.stringify({
        defects: [
          { key: 'BUG-1', summary: 'Closed high', status: 'Done', priority: 'High', area: 'Save / Save-As Flows' },
          { key: 'BUG-2', summary: 'Open high', status: 'Open', priority: 'High', area: 'Save / Save-As Flows' },
          { key: 'BUG-3', summary: 'Open low', status: 'Open', priority: 'Low', area: 'Save / Save-As Flows' },
        ],
      }),
      'utf8',
    );
    await writeFile(
      join(runDir, 'context', 'pr_impact_summary.json'),
      JSON.stringify({ pr_count: 0, repos_changed: [], top_risky_prs: [], top_changed_domains: [] }),
      'utf8',
    );

    const outPath = generateFeatureReport(runDir, 'FEAT-1', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    // Area table: total=3, open=2, high=1 (closed high not counted)
    assert.match(report, /Save \/ Save-As Flows/);
    // high column must be 1, not 2
    assert.doesNotMatch(report, /\|\s*Save \/ Save-As Flows\s*\|\s*3\s*\|\s*2\s*\|\s*2\s*\|/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 8 includes specific open defect keys per area', async () => {
  const runDir = await setupFeatureRun();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-7289', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section8Match = report.match(/## 8\. Recommended QA Focus Areas([\s\S]*?)---/);
    assert.ok(section8Match, 'Section 8 not found');
    const section8 = section8Match[1];
    const hasKey = ['BCIN-7669', 'BCIN-7727'].some((key) => section8.includes(key));
    assert.ok(hasKey, `Section 8 should contain an open defect key. Got:\n${section8}`);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 9 mentions open defect count and feature key', async () => {
  const runDir = await setupFeatureRun();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-7289', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section9Match = report.match(/## 9\. Test Environment Recommendations([\s\S]*?)---/);
    assert.ok(section9Match, 'Section 9 not found');
    const section9 = section9Match[1];
    assert.match(section9, /2 still-open defect/);
    assert.match(section9, /BCIN-7289/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 10 emits per-defect checkboxes for open high-priority items', async () => {
  const runDir = await setupFeatureRun();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-7289', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section10Match = report.match(/## 10\. Verification Checklist for Release([\s\S]*?)---/);
    assert.ok(section10Match, 'Section 10 not found');
    const section10 = section10Match[1];
    assert.match(section10, /- \[ \] BCIN-7669/);
    assert.match(section10, /- \[ \] BCIN-7727/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

async function setupFeatureRunWithImpactFallback() {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-feature-report-impact-fallback-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'feature_metadata.json'),
    JSON.stringify({
      feature_key: 'BCIN-976',
      feature_title: 'Ability to export reports from edit mode',
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
          key: 'BCIN-7751',
          summary: 'Export fails for limited privilege users',
          status: 'Open',
          priority: 'High',
          assignee: 'Ada',
          area: 'Export',
        },
        {
          key: 'BCIN-7760',
          summary: 'Cancel export spinner keeps loading on workstation',
          status: 'In Progress',
          priority: 'Medium',
          assignee: 'Lin',
          area: 'Export',
        },
        {
          key: 'BCIN-7700',
          summary: 'Edit mode export toast is aligned correctly now',
          status: 'Resolved',
          priority: 'Low',
          assignee: 'Sam',
          area: 'Notifications',
        },
      ],
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    JSON.stringify({
      pr_count: 1,
      repos_changed: ['mstr-kiai/web-dossier'],
      top_risky_prs: [
        {
          repository: null,
          number: null,
          risk_level: 'MEDIUM',
          summary: '| Field | Value |',
        },
      ],
    }),
    'utf8',
  );
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    `# PR Impact Analysis: #22621
## PR Metadata
| Field | Value |
|-------|-------|
| **PR Number** | #22621 |
| **Title** | Fix export error handling |
| **Status** | ✅ MERGED |
| **Merged At** | 2026-03-23T07:39:53Z |
| **Linked Jira** | [BCIN-7751](https://example.atlassian.net/browse/BCIN-7751) |

## Description
This PR fixes export error handling in authoring mode. High risk due to broad catch block.
`,
    'utf8',
  );
  return runDir;
}

test('section 1 uses actual feature title instead of standalone run key title line', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.doesNotMatch(report, /^## BCIN-976$/m);
    assert.match(report, /Ability to export reports from edit mode/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('report contains emoji risk rating', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /🔴|🟡|🟢/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 3 contains blocking annotation when blocking defects remain', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section3Match = report.match(/## 3\. Defect Breakdown by Status([\s\S]*?)(?=\n---\n\n## 4\.)/);
    assert.ok(section3Match, 'Section 3 not found');
    assert.match(section3Match[1], /⚠️ BLOCKING/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 6 contains PR number from impact markdown when summary fields are null', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section6Match = report.match(/## 6\. Code Change Analysis([\s\S]*?)(?=\n---\n\n## 7\.)/);
    assert.ok(section6Match, 'Section 6 not found');
    assert.match(section6Match[1], /22621/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 6 contains named PR heading for parsed impact markdown', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section6Match = report.match(/## 6\. Code Change Analysis([\s\S]*?)(?=\n---\n\n## 7\.)/);
    assert.ok(section6Match, 'Section 6 not found');
    assert.match(section6Match[1], /\*\*PR #22621/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 7 renders a residual risk table', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section7Match = report.match(/## 7\. Residual Risk Assessment([\s\S]*?)(?=\n---\n\n## 8\.)/);
    assert.ok(section7Match, 'Section 7 not found');
    assert.match(section7Match[1], /\| Risk Category/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 8 uses numbered QA focus items', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section8Match = report.match(/## 8\. Recommended QA Focus Areas([\s\S]*?)(?=\n---\n\n## 9\.)/);
    assert.ok(section8Match, 'Section 8 not found');
    assert.match(section8Match[1], /^1\./m);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('section 1 includes repository from PR summary', async () => {
  const runDir = await setupFeatureRunWithImpactFallback();
  try {
    const outPath = generateFeatureReport(runDir, 'BCIN-976', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    const section1Match = report.match(/## 1\. Report Header([\s\S]*?)(?=\n---\n\n## 2\.)/);
    assert.ok(section1Match, 'Section 1 not found');
    assert.match(section1Match[1], /mstr-kiai\/web-dossier/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
