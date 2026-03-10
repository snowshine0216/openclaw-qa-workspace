import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRuntimeSetup,
  evaluateSpawnPolicy,
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
    approvedSkill: 'jira-cli',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  });
  assert.deepEqual(getApprovedSourceRule('confluence'), {
    approvedSkill: 'confluence',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  });
  assert.deepEqual(getApprovedSourceRule('github'), {
    approvedSkill: 'github',
    allowsBrowserFetch: false,
    allowsGenericWebFetch: false,
  });
});

test('evaluateRuntimeSetup rejects missing or wrong source-family setup entries', () => {
  const result = evaluateRuntimeSetup({
    requestedSourceFamilies: ['jira', 'confluence', 'github'],
    setupEntries: [
      { sourceFamily: 'jira', approvedSkill: 'jira-cli', status: 'pass' },
      { sourceFamily: 'confluence', approvedSkill: 'browser', status: 'pass' },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /confluence must use confluence/i);
  assert.match(result.failures.join('\n'), /missing runtime setup entry for source family: github/i);
});

test('evaluateRuntimeSetup accepts snake_case contract fields', () => {
  const result = evaluateRuntimeSetup({
    requestedSourceFamilies: ['jira', 'confluence'],
    setupEntries: [
      { source_family: 'jira', approved_skill: 'jira-cli', status: 'pass' },
      { source_family: 'confluence', approved_skill: 'confluence', status: 'pass' },
    ],
  });

  assert.equal(result.ok, true);
});

test('evaluateSpawnPolicy enforces explicit tool bans for jira/confluence/github', () => {
  const result = evaluateSpawnPolicy({
    spawnHistory: [
      {
        sourceFamily: 'jira',
        approvedSkill: 'jira-cli',
        artifactPaths: ['context/jira.md'],
        disallowedTools: ['generic web fetch'],
      },
      {
        sourceFamily: 'figma',
        approvedSkill: 'browser-or-approved-local-snapshot',
        artifactPaths: ['context/figma.md'],
        disallowedTools: [],
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /jira must explicitly disallow browser use/i);
});

test('evaluateSpawnPolicy accepts snake_case contract fields', () => {
  const result = evaluateSpawnPolicy({
    spawnHistory: [
      {
        source_family: 'jira',
        approved_skill: 'jira-cli',
        artifact_paths: ['context/jira.md'],
        disallowed_tools: ['browser', 'generic web fetch'],
      },
      {
        source_family: 'figma',
        approved_skill: 'browser-or-approved-local-snapshot',
        artifact_paths: ['context/figma.md'],
        disallowed_tools: ['generic web fetch'],
      },
    ],
  });

  assert.equal(result.ok, true);
});
