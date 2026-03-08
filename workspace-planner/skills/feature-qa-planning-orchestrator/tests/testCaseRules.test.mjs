import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANONICAL_TOP_LEVEL_CATEGORIES,
  findExecutabilityIssues,
  findMissingTemplateCategories,
  stripTemplateAnnotations,
  validateTestCaseMarkdown,
  validateTopLevelStructure,
} from '../scripts/lib/testCaseRules.mjs';

const VALID_MARKDOWN = `# Feature\n\n## E2E - P1\n\n### Primary user flow\n- In Library Web authoring, open the editor\n  - Verify the report canvas loads\n\n## Core Functional Coverage - P1\n\n### Edit flow\n- In Library Web authoring, add one metric\n  - Verify the metric appears in the grid\n\n## xFunction\n\n### Cross-surface parity\n- In Workstation, repeat the edit flow\n  - Verify the same metric appears in the template\n\n## Error handling / Special cases\n\n### Resume failure branch\n- In Library Web authoring, click Resume Data Retrieval after opening the report in pause mode\n  - Verify the report returns to Data Pause Mode on the same canvas\n\n## Accessibility\n\n### Focus behavior\n- N/A — no new accessibility impact introduced by this scope\n\n## i18n\n\n### Locale behavior\n- N/A — no locale-sensitive change is in scope\n\n## performance\n\n### Performance coverage\n- N/A — no explicit performance-sensitive change in scope\n\n## upgrade / compatability\n\n### Upgrade coverage\n- N/A — no upgrade-specific impact in scope\n\n## Embedding\n\n### Embedding coverage\n- N/A — not an embedding feature\n\n## AUTO: Automation-Only Tests\n\n### Internal-only validation\n- Verify automation-only checks for background retry state\n\n## 📎 Artifacts Used\n\n- context/jira_issue_BCIN-6709.md\n`;

test('canonical categories are all required semantically', () => {
  const missing = findMissingTemplateCategories('# T\n\n## EndToEnd\n');
  assert.ok(missing.includes('Functional'));
  assert.ok(missing.includes('📎 Artifacts Used'));
  assert.equal(missing.length < CANONICAL_TOP_LEVEL_CATEGORIES.length, true);
});

test('structure validator accepts aliases only for EndToEnd and Functional', () => {
  const result = validateTopLevelStructure(VALID_MARKDOWN);
  assert.equal(result.ok, true);
  assert.deepEqual(result.illegalHeadings, []);
  assert.deepEqual(result.missingCategories, []);
});

test('structure validator rejects illegal custom top-level headings', () => {
  const markdown = VALID_MARKDOWN.replace('## xFunction', '## UI Testing');
  const result = validateTopLevelStructure(markdown);
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('UI Testing'));
  assert.ok(result.missingCategories.includes('xFunction'));
});

test('executability validator flags vague and technical manual wording', () => {
  const markdown = VALID_MARKDOWN.replace(
    '### Resume failure branch\n- In Library Web authoring, click Resume Data Retrieval after opening the report in pause mode\n  - Verify the report returns to Data Pause Mode on the same canvas',
    '### Resume failure branch\n- Recover from a supported report execution or manipulation error\n  - Verify correct recovery\n- cmdMgr.reset()'
  );

  const issues = findExecutabilityIssues(markdown);
  assert.ok(issues.some((issue) => issue.code === 'EXEC_VAGUE_TRIGGER'));
  assert.ok(issues.some((issue) => issue.code === 'EXEC_VAGUE_EXPECTED_RESULT'));
  assert.ok(issues.some((issue) => issue.code === 'EXEC_CODE_VOCAB_IN_MANUAL'));
});

test('full markdown validation fails for annotations and contract violations', () => {
  const markdown = stripTemplateAnnotations(`${VALID_MARKDOWN}\n- Trigger error [(STEP)]`);
  const result = validateTestCaseMarkdown(markdown.replace('## Embedding', '## Platform'));
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('Platform'));
  assert.ok(result.missingCategories.includes('Embedding'));
});
