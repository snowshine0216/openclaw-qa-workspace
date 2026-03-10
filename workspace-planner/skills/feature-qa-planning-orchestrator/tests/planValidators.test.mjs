import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  validateContextIndex,
  validateCoverageLedger,
  validateE2EMinimum,
  validateExecutableSteps,
  validateReviewDelta,
  validateUnresolvedStepHandling,
} from '../scripts/lib/qaPlanValidators.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const VALIDATE_PLAN_ARTIFACT = join(__dirname, '..', 'scripts', 'lib', 'validate_plan_artifact.mjs');

function runValidatorCli(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [VALIDATE_PLAN_ARTIFACT, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('validateContextIndex accepts a user-facing index with classification and candidates', () => {
  const content = `# Context Index

## Feature Summary
- summary

## Feature Classification
- user_facing
- source artifact: jira_issue_BCIN-1.md
- note: end-to-end coverage required

## Source Inventory
- artifact | source family | why it matters | confidence

## Primary User Journeys
- Create report | Help menu | create content | report opens

## Entry Points
- Help menu | jira_issue_BCIN-1.md

## Core Capability Families
- Report creation

## Error / Recovery Behaviors
- trigger: save error

## Known Risks / Regressions
- risk: save regression

## Permissions / Auth / Data Constraints
- role required

## Environment / Platform Constraints
- web

## Setup / Fixtures Needed
- sample dataset

## Unsupported / Deferred / Ambiguous
- none

## Mandatory Coverage Candidates
- C1 | Report creation | E2E | jira_issue_BCIN-1.md

## Traceability Map
- F1 | jira_issue_BCIN-1.md | fact | normalized | planning consequence
`;

  const result = validateContextIndex(content);
  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
});

test('validateContextIndex rejects user-facing indexes without mandatory coverage candidates', () => {
  const content = `# Context Index

## Feature Summary
- summary

## Feature Classification
- user_facing
- source artifact: jira_issue_BCIN-1.md
- note: end-to-end coverage required

## Source Inventory
- artifact | source family | why it matters | confidence

## Primary User Journeys
- Create report | Help menu | create content | report opens

## Entry Points
- Help menu | jira_issue_BCIN-1.md

## Core Capability Families
- Report creation

## Error / Recovery Behaviors
- trigger: save error

## Known Risks / Regressions
- risk: save regression

## Permissions / Auth / Data Constraints
- role required

## Environment / Platform Constraints
- web

## Setup / Fixtures Needed
- sample dataset

## Unsupported / Deferred / Ambiguous
- none

## Mandatory Coverage Candidates

## Traceability Map
- F1 | jira_issue_BCIN-1.md | fact | normalized | planning consequence
`;

  const result = validateContextIndex(content);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /mandatory coverage candidates/i);
});

test('validateCoverageLedger rejects missing candidate classifications', () => {
  const result = validateCoverageLedger(
    `# Coverage Ledger

## Coverage Rules Used
- rule

## Scenario Mapping Table
- C1 | Report creation | jira_issue_BCIN-1.md | E2E | EndToEnd | Create report | P1 | covered | note

## Coverage Distribution Summary
- summary

## Explicit Exclusions
- none
`,
    ['C1', 'C2']
  );

  assert.equal(result.ok, false);
  assert.deepEqual(result.missingCandidates, ['C2']);
});

test('validateE2EMinimum rejects user-facing plans without EndToEnd section', () => {
  const result = validateE2EMinimum(`Feature QA Plan

- Core Functional Flows
    * Functional case
        - Action: click Create
            - Expected: draft opens
`, { featureClassification: 'user_facing' });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /EndToEnd/i);
});

test('validateE2EMinimum rejects EndToEnd scenarios without expected result even when later sections have one', () => {
  const result = validateE2EMinimum(`Feature QA Plan

- EndToEnd
    * Main flow <P1>
        - Action: open the report
- Core Functional Flows
    * Functional case <P2>
        - Action: click Save
            - Expected: success banner appears
`, { featureClassification: 'user_facing' });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /completion\/result/i);
});

test('validateE2EMinimum rejects non-user-facing plans without explicit omission reason', () => {
  const result = validateE2EMinimum(`Feature QA Plan

- Core Functional Flows
    * Background sync <P1>
        - Action: trigger sync from admin panel
            - Expected: sync status updates
`, { featureClassification: 'non_user_facing' });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /non-user-facing/i);
});

test('validateExecutableSteps flags banned vague phrases and implementation-heavy wording', () => {
  const result = validateExecutableSteps(`Feature QA Plan

- EndToEnd
    * Main flow <P1>
        - Action: call RenderProxy.updateFuncReactComponent and verify correct behavior
            - Expected: ensure it works
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /verify correct behavior/i);
  assert.match(result.failures.join('\n'), /implementation/i);
});

test('validateExecutableSteps rejects scenarios missing expected result even when the draft has another valid scenario', () => {
  const result = validateExecutableSteps(`Feature QA Plan

- EndToEnd
    * Main flow <P1>
        - Action: open the report
    * Secondary flow <P2>
        - Action: click Save
            - Expected: success banner appears
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Expected result is missing/i);
});

test('validateReviewDelta rejects unresolved blocking findings', () => {
  const result = validateReviewDelta(`# Review Delta

## Source Review
- review_qa_plan_BCIN-1.md

## Blocking Findings Resolution
- F1 | missing E2E journey | added one | drafts/qa_plan_v2.md | partially_resolved

## Non-Blocking Findings Resolution
- none

## Still Open
- F1 still open

## Evidence Added / Removed
- none

## Verdict After Refactor
- reject
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /partially_resolved/i);
});

test('validateReviewDelta accepts explicit none marker when no blocking findings existed', () => {
  const result = validateReviewDelta(`# Review Delta

## Source Review
- review_qa_plan_BCIN-1.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- advisory A | cleaned wording

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- accept
`);

  assert.equal(result.ok, true);
});

test('validateUnresolvedStepHandling requires comment and next action when unresolved items remain', () => {
  const result = validateUnresolvedStepHandling(
    `# QA Plan Review

## Unresolved Executability Items
- trigger unclear after research
`,
    `Feature QA Plan

- Error Handling / Recovery
    * Error flow <P1>
        - Action: reproduce backend timeout
            - Expected: timeout banner appears
`,
    []
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /next action/i);
});

test('validateUnresolvedStepHandling rejects unrelated comments that do not preserve the unresolved item', () => {
  const result = validateUnresolvedStepHandling(
    `# QA Plan Review

## Unresolved Executability Items
- trigger still unclear for timeout recovery banner
`,
    `Feature QA Plan

- Error Handling / Recovery
    * Different error flow <P1>
        - Action: reproduce validation error
            - Expected: validation error appears
        - Comment: unrelated note
        - next action: ask QA for screenshot
`,
    ['context/research_executability_validation_error_BCIN-1.md']
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /timeout recovery banner/i);
});

test('validate_coverage_ledger cli allows zero candidate ids when the ledger explicitly records none', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'coverage_cli_'));
  const file = join(tmp, 'coverage-ledger.md');
  await writeFile(file, `# Coverage Ledger

## Coverage Rules Used
- rule

## Scenario Mapping Table
- none

## Coverage Distribution Summary
- summary

## Explicit Exclusions
- none
`);

  const result = await runValidatorCli(['validate_coverage_ledger', file]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});
