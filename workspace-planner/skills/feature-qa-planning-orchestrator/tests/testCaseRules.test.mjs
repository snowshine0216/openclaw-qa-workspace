import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import {
  CANONICAL_TOP_LEVEL_CATEGORIES,
  findExecutabilityIssues,
  findMissingTemplateCategories,
  stripTemplateAnnotations,
  validateTestCaseMarkdown,
  validateTopLevelStructure,
} from '../scripts/lib/testCaseRules.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const VALID_MARKDOWN = `# Feature

## EndToEnd - P1

### Pause mode | Row-limit error | Resume returns to editable report - P1
- Open the report in pause mode and click Resume Data Retrieval
  - Verify the report returns to pause mode on the same canvas

## Functional - Pause Mode

### Pause mode | Retry path | Second action is accepted - P1
- Trigger the known pause-mode recovery path and click Resume Data Retrieval again
  - Verify the second request is sent instead of hanging

## Functional - Running Mode

### Running mode | Modeling-service error | Undo is cleared - P1
- Lower Results Set Row Limit from Advanced Properties and dismiss the error
  - Verify Undo is disabled after recovery

## Functional - Modeling Service Non-Crash Path

### Non-crash path | View-filter removal | Editor remains interactive - P1
- Remove an attribute that is used in a view filter
  - Verify the editor remains interactive after the validation error

## Functional - MDX / Engine Errors

### Engine error | Correct and retry | Editor remains open - P1
- Trigger the known MDX or engine error fixture and dismiss the dialog
  - Verify the report remains open for continued editing

## Functional - Prompt Flow

### Prompt flow | Prompt apply error | Prompt answers are preserved - P1
- Submit the prepared prompt answers that trigger the prompt recovery path
  - Verify the prompt reopens with the previous answers preserved

## xFunctional

### Cross-flow stability
- Recover from one supported error and trigger a second supported error in the same session
  - Verify the second recovery still works

## UI - Messaging

### Report Failed to Run
- Trigger the recoverable execution failure dialog
  - Verify the body text says the report cannot be executed and clicking OK returns to Data Pause Mode

## Platform

### Browser coverage
- N/A — browser sweep is not part of this fixture-level contract test
`;

test('canonical categories match the generalized QA plan contract', () => {
  assert.deepEqual(CANONICAL_TOP_LEVEL_CATEGORIES, [
    'EndToEnd',
    'Functional - Pause Mode',
    'Functional - Running Mode',
    'Functional - Modeling Service Non-Crash Path',
    'Functional - MDX / Engine Errors',
    'Functional - Prompt Flow',
    'xFunctional',
    'UI - Messaging',
    'Platform',
  ]);
});

test('structure validator accepts the BCIN-6709 acceptance artifact', async () => {
  const acceptancePath = join(__dirname, '..', '..', '..', '..', 'docs', 'BCIN-6709_qa_plan.md');
  const markdown = await readFile(acceptancePath, 'utf8');
  const result = validateTopLevelStructure(markdown);
  assert.equal(result.ok, true);
  assert.deepEqual(result.illegalHeadings, []);
  assert.deepEqual(result.missingCategories, []);
});

test('structure validator rejects illegal custom top-level headings', () => {
  const markdown = VALID_MARKDOWN.replace('## UI - Messaging', '## Analytics');
  const result = validateTopLevelStructure(markdown);
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('Analytics'));
  assert.ok(result.missingCategories.includes('UI - Messaging'));
});

test('executability validator flags vague and technical manual wording', () => {
  const markdown = VALID_MARKDOWN.replace(
    '### Pause mode | Retry path | Second action is accepted - P1\n- Trigger the known pause-mode recovery path and click Resume Data Retrieval again\n  - Verify the second request is sent instead of hanging',
    '### Pause mode | Retry path | Second action is accepted - P1\n- When an error occurs, click OK\n  - Verify correct recovery after recovery\n- cmdMgr.reset()'
  );

  const issues = findExecutabilityIssues(markdown);
  assert.ok(issues.some((issue) => issue.code === 'EXEC_VAGUE_TRIGGER'));
  assert.ok(issues.some((issue) => issue.code === 'EXEC_VAGUE_EXPECTED_RESULT'));
  assert.ok(issues.some((issue) => issue.code === 'EXEC_CODE_VOCAB_IN_MANUAL'));
});

test('full markdown validation fails for annotations and missing plan sections', () => {
  const markdown = stripTemplateAnnotations(`${VALID_MARKDOWN}\n- Trigger error [(STEP)]`);
  const result = validateTestCaseMarkdown(markdown.replace('## Platform', '## Browser Support'));
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('Browser Support'));
  assert.ok(result.missingCategories.includes('Platform'));
});

test('missing-category helper reports removed QA plan sections', () => {
  const missing = findMissingTemplateCategories('# T\n\n## EndToEnd\n');
  assert.ok(missing.includes('Functional - Prompt Flow'));
  assert.ok(missing.includes('UI - Messaging'));
  assert.ok(missing.includes('Platform'));
});
