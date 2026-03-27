import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildRawDefectFacts,
  buildRawPrFacts,
  buildSubagentPrompt,
  buildManifest,
} from '../lib/build_report_spawn_manifest.mjs';

const SECTION_HEADINGS = [
  '## 1. Report Header',
  '## 2. Executive Summary',
  '## 3. Defect Breakdown by Status',
  '## 4. Risk Analysis by Functional Area',
  '## 5. Defect Analysis by Priority',
  '## 6. Code Change Analysis',
  '## 7. Residual Risk Assessment',
  '## 8. Recommended QA Focus Areas',
  '## 9. Test Environment Recommendations',
  '## 10. Verification Checklist for Release',
  '## 11. Conclusion',
  '## 12. Appendix: Defect Reference List',
];

const SAMPLE_JIRA_RAW = {
  issues: [
    {
      key: 'BCIN-7669',
      fields: {
        summary: 'Save fails on translated prompts',
        status: { name: 'Open' },
        priority: { name: 'High' },
        assignee: { displayName: 'Ada' },
        resolutiondate: null,
        comment: { comments: [] },
      },
    },
    {
      key: 'BCIN-7727',
      fields: {
        summary: 'Save-as loses library metadata',
        status: { name: 'In Progress' },
        priority: { name: 'Critical' },
        assignee: { displayName: 'Lin' },
        resolutiondate: null,
        comment: { comments: [] },
      },
    },
    {
      key: 'BCIN-8001',
      fields: {
        summary: 'Localized button label overflows',
        status: { name: 'Resolved' },
        priority: { name: 'Medium' },
        assignee: { displayName: 'Sam' },
        resolutiondate: '2026-03-10T12:00:00.000+0000',
        comment: { comments: [] },
      },
    },
  ],
};

const SAMPLE_PR_IMPACT_SUMMARY = {
  pr_count: 2,
  repos_changed: ['web-dossier', 'workstation-report-editor'],
  top_risky_prs: [
    {
      number: 12,
      repository: 'workstation-report-editor',
      risk_level: 'HIGH',
      summary: 'Touches prompt serialization and save flow',
      url: 'https://github.com/org/workstation-report-editor/pull/12',
      title: 'Fix prompt save retry logic',
    },
    {
      number: 44,
      repository: 'web-dossier',
      risk_level: 'MEDIUM',
      summary: 'Updates library metadata sync',
      url: 'https://github.com/org/web-dossier/pull/44',
      title: 'Sync library metadata on save-as',
    },
  ],
};

test('buildRawDefectFacts extracts key, url, title, priority, status, summary from jira_raw', () => {
  const facts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  assert.equal(facts.length, 3);

  const first = facts[0];
  assert.equal(first.key, 'BCIN-7669');
  assert.equal(first.url, 'https://jira.example.com/browse/BCIN-7669');
  assert.equal(first.title, 'Save fails on translated prompts');
  assert.equal(first.priority, 'High');
  assert.equal(first.status, 'Open');
  assert.equal(first.summary, 'Save fails on translated prompts');
});

test('buildRawDefectFacts handles missing assignee and resolutiondate gracefully', () => {
  const raw = {
    issues: [
      {
        key: 'X-1',
        fields: {
          summary: 'Test issue',
          status: { name: 'Open' },
          priority: { name: 'Low' },
          assignee: null,
          resolutiondate: null,
          comment: { comments: [] },
        },
      },
    ],
  };
  const facts = buildRawDefectFacts(raw, 'https://jira.example.com');
  assert.equal(facts[0].key, 'X-1');
  assert.equal(facts[0].status, 'Open');
});

test('buildRawPrFacts extracts number, url, title, repo, risk_level, summary', () => {
  const facts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  assert.equal(facts.length, 2);

  const first = facts[0];
  assert.equal(first.number, 12);
  assert.equal(first.url, 'https://github.com/org/workstation-report-editor/pull/12');
  assert.equal(first.title, 'Fix prompt save retry logic');
  assert.equal(first.repo, 'workstation-report-editor');
  assert.equal(first.risk_level, 'HIGH');
  assert.equal(first.summary, 'Touches prompt serialization and save flow');
});

test('buildRawPrFacts returns empty array when no top_risky_prs', () => {
  const facts = buildRawPrFacts({ pr_count: 0 });
  assert.deepEqual(facts, []);
});

test('buildSubagentPrompt contains all defect keys', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    null,
    1,
  );
  assert.match(prompt, /BCIN-7669/);
  assert.match(prompt, /BCIN-7727/);
  assert.match(prompt, /BCIN-8001/);
});

test('buildSubagentPrompt contains both rubric file paths', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    null,
    1,
  );
  assert.match(prompt, /report-generation-rubric\.md/);
  assert.match(prompt, /report-review-rubric\.md/);
});

test('buildSubagentPrompt contains all 12 required section headings', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    null,
    1,
  );
  for (const heading of SECTION_HEADINGS) {
    assert.match(prompt, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('buildSubagentPrompt includes review notes path on round > 1', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    '/tmp/run/context/report_review_notes.md',
    2,
  );
  assert.match(prompt, /report_review_notes\.md/);
});

test('buildSubagentPrompt does not include prior review instruction on round 1', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    null,
    1,
  );
  assert.doesNotMatch(prompt, /Prior Review Notes/);
});

test('buildSubagentPrompt specifies output file paths for draft and review artifacts', () => {
  const defectFacts = buildRawDefectFacts(SAMPLE_JIRA_RAW, 'https://jira.example.com');
  const prFacts = buildRawPrFacts(SAMPLE_PR_IMPACT_SUMMARY);
  const prompt = buildSubagentPrompt(
    { defects: defectFacts, prs: prFacts, routeKind: 'reporter_scope_single_key', runKey: 'BCIN-7289', runDir: '/tmp/run' },
    { generationRubric: '/skill/references/report-generation-rubric.md', reviewRubric: '/skill/references/report-review-rubric.md' },
    null,
    1,
  );
  assert.match(prompt, /BCIN-7289_REPORT_DRAFT\.md/);
  assert.match(prompt, /report_review_notes\.md/);
  assert.match(prompt, /report_review_delta\.md/);
});

test('buildManifest produces valid JSON with count=1 and one request', () => {
  const manifest = buildManifest('Do the task');
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'defects-analysis-report');
  assert.equal(manifest.count, 1);
  assert.equal(manifest.requests.length, 1);
  assert.ok(manifest.requests[0].openclaw);
  assert.ok(manifest.requests[0].openclaw.args);
  assert.match(manifest.requests[0].openclaw.args.task, /Do the task/);
});

test('build_report_spawn_manifest.mjs CLI writes manifest file and prints SPAWN_MANIFEST', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-spawn-manifest-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      run_key: 'BCIN-7289',
      route_kind: 'reporter_scope_single_key',
      phase5_round: 0,
    }),
  );
  await writeFile(join(runDir, 'context', 'jira_raw.json'), JSON.stringify(SAMPLE_JIRA_RAW));
  await writeFile(
    join(runDir, 'context', 'feature_metadata.json'),
    JSON.stringify({
      feature_key: 'BCIN-7289',
      feature_title: 'Embed Library Report Editor',
      release_version: '26.04',
    }),
  );
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    JSON.stringify(SAMPLE_PR_IMPACT_SUMMARY),
  );

  const { spawnSync } = await import('node:child_process');
  const scriptPath = new URL('../lib/build_report_spawn_manifest.mjs', import.meta.url).pathname;
  const result = spawnSync(process.execPath, [scriptPath, runDir, 'BCIN-7289'], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_SERVER: 'https://jira.example.com' },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);

  const manifestPath = join(runDir, 'phase5_spawn_manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.count, 1);
  assert.match(manifest.requests[0].openclaw.args.task, /BCIN-7669/);

  await rm(runDir, { recursive: true, force: true });
});
