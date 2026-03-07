import test from 'node:test';
import assert from 'node:assert/strict';
import {
  collectRequiredGithubUrls,
  collectRequiredIssueKeys,
  evaluateGithubFetch,
  evaluateIssueFetch,
  extractIssueKeysFromText,
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
