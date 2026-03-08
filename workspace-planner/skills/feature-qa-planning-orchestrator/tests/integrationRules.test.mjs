import test from 'node:test';
import assert from 'node:assert/strict';
import { collectRequiredGithubUrls, collectRequiredIssueKeys, evaluateGithubFetch, evaluateIssueFetch } from '../scripts/lib/contextRules.mjs';
import { validateTestCaseMarkdown } from '../scripts/lib/testCaseRules.mjs';

test('integration: generation must stop when jira issue evidence is incomplete', () => {
  const requiredIssueKeys = collectRequiredIssueKeys({
    mainIssueKey: 'BCIN-6709',
    linkedIssues: [{ outwardIssue: { key: 'BCIN-6706' } }],
    comments: [{ body: 'Please also consider BCEN-4129' }],
    projectPrefixes: ['BCIN', 'BCEN'],
  });
  const fetchStatus = evaluateIssueFetch({
    requiredIssueKeys,
    fetchedIssues: [{ key: 'BCIN-6709', summary: 'Main', description: 'Desc' }],
  });
  assert.equal(fetchStatus.ok, false);
  assert.deepEqual(fetchStatus.missing, ['BCIN-6706', 'BCEN-4129']);
});

test('integration: generation must stop when github diff evidence is incomplete', () => {
  const requiredUrls = collectRequiredGithubUrls({
    providedUrls: ['https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport'],
    issueBodies: [],
    comments: [{ body: 'Need mojo too https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport' }],
  });
  const diffStatus = evaluateGithubFetch({
    requiredUrls,
    fetchedDiffs: [{ url: 'https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport' }],
  });
  assert.equal(diffStatus.ok, false);
  assert.deepEqual(diffStatus.missing, ['https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport']);
});

test('integration: final QA plan markdown accepts the generalized section set', () => {
  const markdown = `# BCIN-6709

## EndToEnd - P1

### Pause mode | Row-limit error | Keep editing - P1
- Open a report in pause mode and click Resume Data Retrieval
  - Verify the report remains in the same session

## Functional - Pause Mode

### Pause retry
- Trigger the known pause-mode recovery path and click Resume Data Retrieval again
  - Verify the request is accepted instead of hanging

## Functional - Running Mode

### Running-mode recovery
- Lower Results Set Row Limit and dismiss the error
  - Verify Undo is disabled after recovery

## Functional - Modeling Service Non-Crash Path

### View-filter validation
- Remove an attribute used in a view filter
  - Verify the editor remains interactive

## Functional - MDX / Engine Errors

### Engine error
- Trigger the known engine error fixture and dismiss the dialog
  - Verify the report remains open for continued editing

## Functional - Prompt Flow

### Prompt recovery
- Submit the prepared prompt answers that trigger prompt recovery
  - Verify the prompt reopens with the previous answers preserved

## xFunctional

### Cross-flow stability
- N/A — no cross-flow scenario is in scope for this fixture

## UI - Messaging

### Dialog copy
- Verify the message says the report cannot be executed and OK returns to Data Pause Mode

## Platform

### Browser coverage
- N/A — no browser matrix is in scope for this fixture
`;
  const result = validateTestCaseMarkdown(markdown);
  assert.equal(result.ok, true);
});
