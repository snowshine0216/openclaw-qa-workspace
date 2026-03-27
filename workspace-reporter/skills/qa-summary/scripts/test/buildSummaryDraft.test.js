import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSummaryDraft } from '../lib/buildSummaryDraft.mjs';

const FEATURE_OVERVIEW = '### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |';

test('renders section 1 plus sections 2 through 12 in fixed order', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 1, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 1\. Feature Overview/);
  assert.match(result.markdown, /### 2\. Background & Solution/);
  assert.match(result.markdown, /### 3\. Code Changes Summary/);
  assert.match(result.markdown, /### 11\. Automation Coverage/);
  assert.match(result.markdown, /### 12\. Known Limitations/);
  assert.equal(result.metadata.sectionsPresent, 12);
});

test('renders zero-defect tables without omitting required sections', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 0,
      openDefects: 0,
      noDefectsFound: true,
      defects: [],
      prs: [],
    },
  });
  assert.match(result.markdown, /No feature defects were found/);
  assert.match(result.markdown, /Overall risk: LOW/);
  assert.match(result.markdown, /Total defects: 0/);
  assert.match(result.markdown, /Open defects: 0/);
  assert.match(result.markdown, /### 6\. Resolved Defects Detail/);
});

test('renders Code Changes Summary from both defect-fix and feature PR entries', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 1,
      openDefects: 0,
      defects: [
        {
          key: 'BCIN-1',
          url: 'https://jira/browse/BCIN-1',
          status: 'Resolved',
          priority: 'P1',
          summary: 'Resolved defect',
          resolution: 'Done',
        },
      ],
      prs: [
        {
          sourceKind: 'defect_fix',
          repository: 'org/repo',
          number: 10,
          url: 'https://github.com/org/repo/pull/10',
          linkedDefectKeys: ['BCIN-1'],
        },
        {
          sourceKind: 'feature_change',
          repository: 'org/repo',
          number: 11,
          url: 'https://github.com/org/repo/pull/11',
        },
      ],
    },
  });
  assert.match(result.markdown, /Code Changes Summary/);
  assert.match(result.markdown, /Defect Fix/);
  assert.match(result.markdown, /Feature PR/);
  assert.match(result.markdown, /\[BCIN-1\]\(https:\/\/jira\/browse\/BCIN-1\)/);
  assert.equal(result.metadata.sectionsPresent, 12);
});

test('applies approval feedback overrides to the regenerated draft', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 0,
      openDefects: 0,
      resolvedDefects: 0,
      noDefectsFound: true,
      defects: [],
      prs: [],
    },
    approvalFeedback:
      'Add missing PR https://github.com/org/release/pull/88. Risk should be HIGH. Hold release until the rollout note is updated.',
  });

  assert.match(result.markdown, /\[#88\]\(https:\/\/github\.com\/org\/release\/pull\/88\)/);
  assert.match(result.markdown, /Overall risk: HIGH/);
  assert.match(result.markdown, /Release recommendation: Hold release pending approval revisions\./);
  assert.match(result.markdown, /Approval feedback addressed:/);
});

test('derives severity counts from defect priorities for open and resolved rows', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 7,
      openDefects: 4,
      resolvedDefects: 3,
      defects: [
        { key: 'BCIN-1', status: 'Open', priority: 'Critical', summary: 'a', resolution: '', url: '' },
        { key: 'BCIN-2', status: 'Open', priority: 'High', summary: 'b', resolution: '', url: '' },
        { key: 'BCIN-3', status: 'Open', priority: 'Medium', summary: 'c', resolution: '', url: '' },
        { key: 'BCIN-4', status: 'Open', priority: 'Low', summary: 'd', resolution: '', url: '' },
        { key: 'BCIN-5', status: 'Resolved', priority: 'P0', summary: 'e', resolution: 'Done', url: '' },
        { key: 'BCIN-6', status: 'Resolved', priority: 'P2', summary: 'f', resolution: 'Done', url: '' },
        { key: 'BCIN-7', status: 'Done', priority: 'P3', summary: 'g', resolution: 'Done', url: '' },
      ],
      prs: [],
    },
  });

  assert.match(result.markdown, /\| Open \| 1 \| 1 \| 1 \| 1 \| 4 \|/);
  assert.match(result.markdown, /\| Resolved \| 1 \| 0 \| 1 \| 1 \| 3 \|/);
  assert.match(result.markdown, /\| Total \| 2 \| 1 \| 2 \| 2 \| 7 \|/);
});

test('lists each open defect in section 5 with review-required columns', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 2,
      openDefects: 1,
      resolvedDefects: 1,
      defects: [
        {
          key: 'BCIN-1',
          status: 'Open',
          priority: 'High',
          summary: 'Login button is disabled',
          resolution: '',
          url: 'https://jira/browse/BCIN-1',
          notes: 'Pending backend validation',
        },
        {
          key: 'BCIN-2',
          status: 'Resolved',
          priority: 'P2',
          summary: 'Resolved defect',
          resolution: 'Done',
          url: 'https://jira/browse/BCIN-2',
        },
      ],
      prs: [],
    },
  });

  assert.match(result.markdown, /### 5\. Defect Status Summary/);
  assert.match(result.markdown, /\| Defect ID \| Summary \| Status \| Priority \| Notes \|/);
  assert.match(result.markdown, /\| \[BCIN-1\]\(https:\/\/jira\/browse\/BCIN-1\) \| Login button is disabled \| Open \| High \| Pending backend validation \|/);
});

test('includes resolved Highest and Blocker defects in section 6 details', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 3,
      openDefects: 0,
      resolvedDefects: 3,
      defects: [
        { key: 'BCIN-1', status: 'Resolved', priority: 'Highest', summary: 'critical one', resolution: 'Done', url: 'https://jira/browse/BCIN-1' },
        { key: 'BCIN-2', status: 'Closed', priority: 'Blocker', summary: 'critical two', resolution: 'Done', url: 'https://jira/browse/BCIN-2' },
        { key: 'BCIN-3', status: 'Done', priority: 'P2', summary: 'normal', resolution: 'Done', url: 'https://jira/browse/BCIN-3' },
      ],
      prs: [],
    },
  });

  assert.match(result.markdown, /\[BCIN-1\]\(https:\/\/jira\/browse\/BCIN-1\)/);
  assert.match(result.markdown, /\[BCIN-2\]\(https:\/\/jira\/browse\/BCIN-2\)/);
  assert.match(result.markdown, /1 additional resolved defects \(P2\/P3\) not shown/);
});

test('reports omitted resolved P2 and P3 defects even when section 6 has no P0 or P1 rows', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 2,
      openDefects: 0,
      resolvedDefects: 2,
      defects: [
        { key: 'BCIN-1', status: 'Resolved', priority: 'P2', summary: 'medium', resolution: 'Done', url: 'https://jira/browse/BCIN-1' },
        { key: 'BCIN-2', status: 'Closed', priority: 'P3', summary: 'low', resolution: 'Done', url: 'https://jira/browse/BCIN-2' },
      ],
      prs: [],
    },
  });

  assert.match(result.markdown, /No defect-fixing changes were identified\./);
  assert.match(result.markdown, /2 additional resolved defects \(P2\/P3\) not shown\./);
});

test('derives overall risk from defect severity instead of open defect count alone', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 1,
      openDefects: 1,
      resolvedDefects: 0,
      defects: [
        {
          key: 'BCIN-1',
          status: 'Open',
          priority: 'Low',
          summary: 'Minor cosmetic issue',
          resolution: '',
          url: 'https://jira/browse/BCIN-1',
        },
      ],
      prs: [],
    },
  });

  assert.match(result.markdown, /Overall risk: MEDIUM/);
  assert.doesNotMatch(result.markdown, /Overall risk: HIGH/);
});

test('elevates overall risk when defect-fix PR analysis reports high regression risk', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 1,
      openDefects: 0,
      resolvedDefects: 1,
      defects: [
        {
          key: 'BCIN-1',
          status: 'Resolved',
          priority: 'P2',
          summary: 'Resolved issue',
          resolution: 'Done',
          url: 'https://jira/browse/BCIN-1',
        },
      ],
      prs: [
        {
          sourceKind: 'defect_fix',
          repository: 'org/repo',
          number: 10,
          url: 'https://github.com/org/repo/pull/10',
          riskLevel: 'HIGH',
          linkedDefectKeys: ['BCIN-1'],
        },
      ],
    },
  });

  assert.match(result.markdown, /Overall risk: HIGH/);
  assert.match(result.markdown, /Release recommendation: Hold release pending focused QA review\./);
});

test('elevates overall risk from planner-only P1 markers when no defects are open', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: '## Regression Known Risks\n- Monitor checkout rollback path <P1>',
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 0,
      openDefects: 0,
      resolvedDefects: 0,
      noDefectsFound: true,
      defects: [],
      prs: [],
    },
  });

  assert.match(result.markdown, /Overall risk: MEDIUM/);
});

test('builds sections 7 through 11 from planner evidence before using pending placeholders', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: [
        '# Feature QA Plan (BCIN-7289)',
        '',
        '- Regression / Known Risks',
        '    * Save, Save As, and template-related flows do not regress under embedded authoring <P1>',
        '',
        '- Permissions / Security / Data Safety',
        '    * Respect report edit and save privileges in embedded authoring <P1>',
        '',
        '- Observability / Performance / UX Feedback',
        '    * Cold first open or first create remains usable in embedded report authoring <P1>',
        '',
        '- EndToEnd',
        '    * Edit an existing report in Workstation using the embedded report editor path <P1>',
        '',
        '- Core Functional Flows',
        '    * Select the correct editor path based on version and new-editor preference <P1>',
      ].join('\n'),
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 1,
      openDefects: 1,
      resolvedDefects: 0,
      defects: [
        {
          key: 'BCIN-1',
          status: 'Open',
          priority: 'P1',
          summary: 'Permission regression',
          resolution: '',
          url: 'https://jira/browse/BCIN-1',
          notes: 'Verify restricted save paths and role gating.',
        },
      ],
      prs: [
        {
          sourceKind: 'defect_fix',
          repository: 'org/repo',
          number: 10,
          url: 'https://github.com/org/repo/pull/10',
          riskLevel: 'HIGH',
          linkedDefectKeys: ['BCIN-1'],
          notes: 'Touches save and role-gating flows.',
        },
      ],
    },
  });

  assert.match(result.markdown, /### 7\. Test Coverage/);
  assert.match(result.markdown, /EndToEnd coverage includes: Edit an existing report/);
  assert.match(result.markdown, /### 8\. Performance/);
  assert.match(result.markdown, /Cold first open or first create remains usable/);
  assert.match(result.markdown, /### 9\. Security \/ Compliance/);
  assert.match(result.markdown, /Respect report edit and save privileges/);
  assert.match(result.markdown, /### 10\. Regression Testing/);
  assert.match(result.markdown, /Save, Save As, and template-related flows do not regress/);
  assert.match(result.markdown, /### 11\. Automation Coverage/);
  assert.match(result.markdown, /Defect-driven automation priority: BCIN-1/);
  assert.doesNotMatch(result.markdown, /\[PENDING — Test coverage data from planner and defect context\.\]/);
});

// New tests for Section 2 Background & Solution

test('renders Section 2 Background & Solution from planner intro text', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: '## 1. Introduction\n\nAs users migrate from the old UI, they need new capabilities in the updated product.\n',
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 2\. Background & Solution/);
  assert.match(result.markdown, /As users migrate from the old UI/);
});

test('renders Section 2 Background & Solution with PENDING when no intro text in planner', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: '## Some Other Section\n\n- item one\n',
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 2\. Background & Solution/);
  assert.match(result.markdown, /PENDING — No background or solution context found/);
});

test('renders Section 2 Out of Scope bullets from planner assumptions section', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: [
        '## 1. Introduction',
        '',
        'Background text here.',
        '',
        '## Design Assumptions & Scope',
        '',
        '- Remove privilege checks for edit mode',
        '- Out of Scope / Assumptions',
        '    * i18n, Accessibility, and Performance testing are not applicable based on available evidence <P2>',
      ].join('\n'),
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 2\. Background & Solution/);
  assert.match(result.markdown, /Out of Scope:/);
  assert.match(result.markdown, /i18n, Accessibility, and Performance testing are not applicable/);
});

test('performance section renders not-applicable justification from Out of Scope planner section', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: [
        '## Design Assumptions & Scope',
        '',
        '- Out of Scope / Assumptions',
        '    * i18n, Accessibility, and Performance testing are not applicable based on available evidence <P2>',
      ].join('\n'),
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 8\. Performance/);
  assert.match(result.markdown, /Not applicable:/);
  assert.match(result.markdown, /i18n, Accessibility, and Performance testing are not applicable/);
});

test('security section renders draft label when planner has security scenarios', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: [
        '- Permissions / Security / Data Safety',
        '    * Validate role-based access for the new feature <P1>',
      ].join('\n'),
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 9\. Security \/ Compliance/);
  assert.match(result.markdown, /⚠️ Draft — Planned coverage, not yet executed:/);
  assert.match(result.markdown, /Validate role-based access for the new feature/);
});

test('regression section renders draft label when planner has regression scenarios', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: [
        '- Regression / Known Risks',
        '    * Verify that existing save flows are not broken <P1>',
      ].join('\n'),
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 10\. Regression Testing/);
  assert.match(result.markdown, /⚠️ Draft — Planned regression scenarios, not yet executed:/);
  assert.match(result.markdown, /Verify that existing save flows are not broken/);
});

test('zero defects with elevated risk renders risk explanation bullet', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: { planMarkdown: '- E2E Testing\n  * Some scenario <P1>' },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: {
      totalDefects: 0,
      openDefects: 0,
      noDefectsFound: true,
      analysisRiskLevel: 'MEDIUM',
      defects: [],
      prs: [],
    },
  });
  assert.match(result.markdown, /Note: Risk elevated to MEDIUM/);
  assert.match(result.markdown, /QA testing not yet commenced/);
  assert.match(result.markdown, /not open defects/);
});

test('zero defects with LOW risk does NOT render risk elevation explanation', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, noDefectsFound: true, defects: [], prs: [] },
  });
  assert.doesNotMatch(result.markdown, /Note: Risk elevated/);
  assert.match(result.markdown, /Overall risk: LOW/);
});

// Section 12 — Known Limitations tests

test('section 12 renders PENDING when no known limitations data', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 12\. Known Limitations/);
  assert.match(result.markdown, /PENDING — No known limitations identified/);
});

test('section 12 renders lines from knownLimitationsSeed when provided', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
    knownLimitationsSeed: { lines: ['i18n not in scope', 'offline mode deferred'], raw: '' },
  });
  assert.match(result.markdown, /### 12\. Known Limitations/);
  assert.match(result.markdown, /i18n not in scope/);
  assert.match(result.markdown, /offline mode deferred/);
  // Section 12 specifically should not show PENDING
  assert.doesNotMatch(result.markdown, /### 12\. Known Limitations[\s\S]*?PENDING/);
});

test('section 12 renders from backgroundSolutionData.outOfScopeLines when no seed provided', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      backgroundSolutionData: {
        outOfScopeLines: ['accessibility not applicable', 'performance deferred'],
      },
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 12\. Known Limitations/);
  assert.match(result.markdown, /accessibility not applicable/);
  assert.match(result.markdown, /performance deferred/);
});

test('section 12 renders from QA plan ## Known Limitations heading when no seed or outOfScopeLines', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {
      planMarkdown: '## Known Limitations\n- browser extension not supported\n',
    },
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.match(result.markdown, /### 12\. Known Limitations/);
  assert.match(result.markdown, /browser extension not supported/);
});

test('sectionsPresent is 12', async () => {
  const result = await buildSummaryDraft({
    featureKey: 'BCIN-7289',
    plannerContext: {},
    featureOverviewTable: FEATURE_OVERVIEW,
    defectSummary: { totalDefects: 0, openDefects: 0, defects: [], prs: [] },
  });
  assert.equal(result.metadata.sectionsPresent, 12);
});
