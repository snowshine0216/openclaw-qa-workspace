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

test('integration: final test case markdown must include all categories and no jargon headings', () => {
  const markdown = `# BCIN-6709\n\n## EndToEnd - P1\n\n### Continue editing after a max rows error - P1\n- Open report\n\n## Report Creator Dialog - P3\n- Not applicable for this feature because no creation dialog is changed.\n\n## Error handling / Special cases - P1\n- Trigger row limit error\n\n## Security Test - P3\n- Confirm user-facing error messages stay free of internal details.\n\n## Pendo - P3\n- Not applicable for this feature because no analytics instrumentation is changed.\n\n## performance - P2\n- Recovery completes in an acceptable time for report editing.\n\n## Platform - P2\n- Validate in supported browsers.\n\n## upgrade  / compatability - P2\n- Existing consumption mode remains unchanged.\n\n## Accessibility - P2\n- Dialog focus is accessible.\n\n## Embedding - P3\n- Not applicable for this feature because embedding behavior is not changed.\n\n## i18n - P3\n- Not applicable for this feature because no new localized strings are introduced.\n`;
  const result = validateTestCaseMarkdown(markdown);
  assert.equal(result.ok, true);
});
