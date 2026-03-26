import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRuntimeSetup,
  evaluateSpawnPolicy,
  evaluateSourceArtifactCompleteness,
  evaluateEvidenceCompleteness,
  collectRequiredGithubUrls,
  collectRequiredIssueKeys,
  evaluateGithubFetch,
  evaluateIssueFetch,
  extractIssueKeysFromText,
  getApprovedSourceRule,
} from '../scripts/lib/contextRules.mjs';

test('extracts linked issues and comment references, excluding subtasks logic entirely', () => {
  const keys = collectRequiredIssueKeys({
    mainIssueKey: 'BCIN-6709',
    linkedIssues: [
      { inwardIssue: { key: 'BCIN-6706' } },
      { outwardIssue: { key: 'BCIN-974' } },
    ],
    comments: [
      { body: 'Need coverage for BCEN-4129 and BCIN-6706 too.' },
      { body: 'Ignore random text.' },
    ],
    projectPrefixes: ['BCIN', 'BCEN'],
  });

  assert.deepEqual(keys, ['BCIN-6709', 'BCIN-6706', 'BCIN-974', 'BCEN-4129']);
});

test('issue fetch gate fails when required issue content is missing or incomplete', () => {
  const result = evaluateIssueFetch({
    requiredIssueKeys: ['BCIN-6709', 'BCIN-6706', 'BCEN-4129'],
    fetchedIssues: [
      { key: 'BCIN-6709', summary: 'Main issue', description: 'Full desc' },
      { key: 'BCIN-6706', summary: 'Linked issue', description: '' },
    ],
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, ['BCEN-4129']);
  assert.deepEqual(result.invalid, ['BCIN-6706']);
});

test('collects github urls from provided urls and jira/comment bodies', () => {
  const urls = collectRequiredGithubUrls({
    providedUrls: ['https://github.com/a/b/pull/1'],
    issueBodies: ['See https://github.com/x/y/pull/22 for client changes'],
    comments: [{ body: 'Also test https://github.com/m/n/compare/base...head' }],
  });

  assert.deepEqual(urls, [
    'https://github.com/a/b/pull/1',
    'https://github.com/x/y/pull/22',
    'https://github.com/m/n/compare/base...head',
  ]);
});

test('github diff gate fails when required diff is missing', () => {
  const result = evaluateGithubFetch({
    requiredUrls: ['https://github.com/a/b/pull/1', 'https://github.com/x/y/pull/22'],
    fetchedDiffs: [{ url: 'https://github.com/a/b/pull/1' }],
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, ['https://github.com/x/y/pull/22']);
});

test('extractIssueKeysFromText honors project prefix filter', () => {
  const keys = extractIssueKeysFromText('BCIN-1 BCEN-2 ABC-3', ['BCIN', 'BCEN']);
  assert.deepEqual(keys, ['BCIN-1', 'BCEN-2']);
});

test('getApprovedSourceRule returns shared-skill routing for system-of-record sources', () => {
  assert.deepEqual(getApprovedSourceRule('jira'), {
    approvedSkills: ['jira-cli'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  });
  assert.deepEqual(getApprovedSourceRule('confluence'), {
    approvedSkills: ['confluence'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  });
  assert.deepEqual(getApprovedSourceRule('github'), {
    approvedSkills: ['github'],
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
    requiresDedicatedSpawn: true,
    requiresAvailabilityValidation: true,
    requiresAuthValidation: true,
  });
});

test('evaluateRuntimeSetup rejects missing or wrong source-family setup entries', () => {
  const result = evaluateRuntimeSetup({
    requestedSourceFamilies: ['jira', 'confluence', 'github'],
    setupEntries: [
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        status: 'pass',
        availabilityValidation: 'jira me',
        authValidation: 'jira me',
        routeApproved: true,
        referenceClassifications: ['primary'],
      },
      {
        sourceFamily: 'confluence',
        approvedSkill: 'browser',
        status: 'pass',
        availabilityValidation: 'manual',
        authValidation: 'manual',
        routeApproved: true,
        referenceClassifications: ['supporting'],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /confluence must use one of \[confluence\]/i);
  assert.match(result.failures.join('\n'), /missing runtime setup entry for source family: github/i);
});

test('evaluateRuntimeSetup accepts snake_case contract fields', () => {
  const result = evaluateRuntimeSetup({
    requestedSourceFamilies: ['jira', 'confluence'],
    setupEntries: [
      {
        source_family: 'jira',
        approved_skill: 'jira-cli',
        status: 'pass',
        availability_validation: 'jira me',
        auth_validation: 'jira me',
        route_approved: true,
        reference_classifications: ['primary'],
      },
      {
        source_family: 'confluence',
        approved_skill: 'confluence',
        status: 'pass',
        availability_validation: 'confluence access',
        auth_validation: 'confluence access',
        route_approved: true,
        reference_classifications: ['supporting'],
      },
    ],
  });

  assert.equal(result.ok, true);
  assert.equal(result.hasSupportingArtifacts, true);
});

test('evaluateSpawnPolicy enforces disallowed methods for jira/confluence/github (approved skills)', () => {
  const result = evaluateSpawnPolicy({
    requestedSourceFamilies: ['jira', 'figma'],
    spawnHistory: [
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        artifactPaths: ['context/jira.md'],
        status: 'completed',
        disallowedTools: ['generic web fetch'],
      },
      {
        sourceFamily: 'figma',
        approvedSkill: 'browser-or-approved-local-snapshot',
        artifactPaths: ['context/figma.md'],
        status: 'completed',
        disallowedTools: [],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /jira must explicitly disallow browser fetch\/scraping/i);
});

test('evaluateSpawnPolicy enforces one dedicated spawn per requested source family', () => {
  const result = evaluateSpawnPolicy({
    requestedSourceFamilies: ['jira', 'confluence'],
    spawnHistory: [
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        artifactPaths: ['context/jira.md'],
        status: 'completed',
        disallowedTools: ['browser fetch', 'generic web fetch'],
      },
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        artifactPaths: ['context/jira-2.md'],
        status: 'completed',
        disallowedTools: ['browser fetch', 'generic web fetch'],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /jira must have exactly one dedicated spawn, got 2/i);
  assert.match(result.failures.join('\n'), /confluence must have exactly one dedicated spawn, got 0/i);
});

test('evaluateSpawnPolicy accepts snake_case contract fields', () => {
  const result = evaluateSpawnPolicy({
    requestedSourceFamilies: ['jira', 'figma'],
    spawnHistory: [
      {
        source_family: 'jira',
        approved_skill: 'jira-cli',
        artifact_paths: ['context/jira.md'],
        status: 'completed',
        disallowed_tools: ['browser fetch', 'generic web fetch'],
      },
      {
        source_family: 'figma',
        approved_skill: 'browser-or-approved-local-snapshot',
        artifact_paths: ['context/figma.md'],
        status: 'completed',
        disallowed_tools: ['generic web fetch'],
      },
    ],
  });

  assert.equal(result.ok, true);
});

test('evaluateSourceArtifactCompleteness rejects missing required jira artifacts', () => {
  const result = evaluateSourceArtifactCompleteness({
    sourceFamily: 'jira',
    artifactPaths: ['context/jira_issue_BCED-2416.md'],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /jira_related_issues_<FEATURE_ID>\.md/i);
});

test('evaluateSourceArtifactCompleteness accepts complete github artifacts', () => {
  const result = evaluateSourceArtifactCompleteness({
    sourceFamily: 'github',
    artifactPaths: [
      'context/github_diff_BCED-2416.md',
      'context/github_traceability_BCED-2416.md',
    ],
  });

  assert.equal(result.ok, true);
});

test('evaluateEvidenceCompleteness enforces required artifacts per requested source family', () => {
  const result = evaluateEvidenceCompleteness({
    requestedSourceFamilies: ['jira', 'confluence', 'github', 'figma'],
    spawnHistory: [
      {
        sourceFamily: 'jira',
        artifactPaths: [
          'context/jira_issue_BCED-2416.md',
          'context/jira_related_issues_BCED-2416.md',
        ],
      },
      {
        sourceFamily: 'confluence',
        artifactPaths: ['context/confluence_design_BCED-2416.md'],
      },
      {
        sourceFamily: 'github',
        artifactPaths: ['context/github_diff_BCED-2416.md'],
      },
      {
        sourceFamily: 'figma',
        artifactPaths: ['context/figma/figma_metadata_BCED-2416.md'],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /github_traceability_<FEATURE_ID>\.md/i);
});

test('evaluateEvidenceCompleteness requires supporting artifact summary when supporting artifacts are declared', () => {
  const result = evaluateEvidenceCompleteness({
    requestedSourceFamilies: ['jira'],
    hasSupportingArtifacts: true,
    spawnHistory: [
      {
        sourceFamily: 'jira',
        artifactPaths: [
          'context/jira_issue_BCED-2416.md',
          'context/jira_related_issues_BCED-2416.md',
        ],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /supporting_issue_summary_<FEATURE_ID>\.md/i);
});

test('evaluateEvidenceCompleteness accepts snake_case artifact path fields', () => {
  const result = evaluateEvidenceCompleteness({
    requestedSourceFamilies: ['jira', 'figma'],
    hasSupportingArtifacts: true,
    spawnHistory: [
      {
        source_family: 'jira',
        artifact_paths: [
          'context/jira_issue_BCED-2416.md',
          'context/jira_related_issues_BCED-2416.md',
          'context/supporting_artifact_summary_BCED-2416.md',
        ],
      },
      {
        source_family: 'figma',
        artifact_paths: ['context/figma/figma_metadata_BCED-2416.md'],
      },
    ],
  });

  assert.equal(result.ok, true);
});

test('evaluateRuntimeSetup requires at least one primary reference classification', () => {
  const result = evaluateRuntimeSetup({
    requestedSourceFamilies: ['jira'],
    setupEntries: [
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        status: 'pass',
        availabilityValidation: 'jira me',
        authValidation: 'jira me',
        routeApproved: true,
        referenceClassifications: ['supporting'],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /at least one primary reference/i);
});
