import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import {
  CANONICAL_TOP_LEVEL_CATEGORIES,
  findExecutabilityIssues,
  findMissingCoverageDomains,
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
  assert.deepEqual(result.missingCoverageDomains, []);
});

test('structure validator rejects illegal custom top-level headings', () => {
  const markdown = VALID_MARKDOWN.replace('## UI - Messaging', '## Analytics');
  const result = validateTopLevelStructure(markdown);
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('Analytics'));
  assert.ok(result.missingCoverageDomains.includes('user-visible messaging or status'));
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
  assert.ok(result.missingCoverageDomains.includes('compatibility / scope guard'));
});

test('missing-category helper reports removed QA plan sections', () => {
  const missing = findMissingTemplateCategories('# T\n\n## EndToEnd\n');
  assert.ok(missing.includes('Functional - Prompt Flow'));
  assert.ok(missing.includes('UI - Messaging'));
  assert.ok(missing.includes('Platform'));
});

test('flexible validation accepts Error Handling as replacement for Functional - MDX', () => {
  const withErrorHandling = VALID_MARKDOWN.replace('## Functional - MDX / Engine Errors', '## Error Handling');
  const result = validateTopLevelStructure(withErrorHandling);
  assert.equal(result.ok, true);
  assert.equal(result.illegalHeadings.length, 0);
});

test('generalized validation accepts replacement sections when coverage ownership is explicit', () => {
  const minimalFlexible = `# T

## Recovery Control
<!-- Coverage domains: primary functional behavior; error handling / recovery; state transition / continuity -->
### Recovery path - P1
- In report editor, trigger the recovery dialog
  - Perform Resume Data Retrieval
    - Verify the report returns to the same editing session

## Workflow Guardrails
<!-- Coverage domains: cross-flow / multi-step interactions; compatibility / scope guard -->
- N/A — this fixture only validates ownership comments

## Visible Status
<!-- Coverage domains: user-visible messaging or status; nonfunctional considerations when relevant -->
- N/A — this fixture only validates ownership comments
`;
  const result = validateTopLevelStructure(minimalFlexible);
  assert.equal(result.ok, true);
  assert.deepEqual(result.missingCoverageDomains, []);
});

test('generalized validation rejects vague custom headings even with ownership comments', () => {
  const markdown = `# T

## Misc
<!-- Coverage domains: primary functional behavior; state transition / continuity -->
### Placeholder - P1
- In editor, trigger entry
  - Perform action
    - Verify result

## Error Handling
### Recovery
- N/A — fixture

## Cross-Flow
### Cross-flow
- N/A — fixture

## UI - Messaging
### Messaging
- N/A — fixture

## Compatibility
### Compatibility
- N/A — fixture
`;
  const result = validateTopLevelStructure(markdown);
  assert.equal(result.ok, false);
  assert.ok(result.illegalHeadings.includes('Misc'));
});

test('findMissingCoverageDomains reports missing domains', () => {
  const noError = `# T
## Primary Area
<!-- Coverage domains: primary functional behavior -->
- N/A
## UI - Messaging
<!-- Coverage domains: user-visible messaging or status -->
- N/A
`;
  const missing = findMissingCoverageDomains(noError);
  assert.ok(missing.includes('error handling / recovery'));
  assert.ok(missing.includes('state transition / continuity'));
  assert.ok(missing.includes('cross-flow / multi-step interactions'));
  assert.ok(missing.includes('compatibility / scope guard'));
});

test('structure validator accepts generic section names with explicit ownership comments', () => {
  const genericPlan = `# Feature

## Recovery Control

<!-- Coverage domains: primary functional behavior; error handling / recovery; state transition / continuity -->

### Primary recovery path - P1
- In surface, trigger entry
  - Perform action
    - Verify result

## Multi-Surface Guard

<!-- Coverage domains: cross-flow / multi-step interactions; compatibility / scope guard -->

### Cross-flow guardrail - P2
- N/A — fixture

## Visible Status

<!-- Coverage domains: user-visible messaging or status; nonfunctional considerations when relevant -->

### Messaging check - P2
- N/A — fixture
`;
  const result = validateTopLevelStructure(genericPlan);
  assert.equal(result.ok, true);
  assert.equal(result.illegalHeadings.length, 0);
  assert.deepEqual(result.missingCoverageDomains, []);
});
