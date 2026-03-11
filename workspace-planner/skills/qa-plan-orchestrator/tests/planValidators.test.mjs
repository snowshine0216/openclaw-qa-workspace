import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  validateCoveragePreservationAudit,
  validateCheckpointAudit,
  validateCheckpointDelta,
  validateContextIndex,
  validateContextCoverageAudit,
  validateCoverageLedger,
  validateDraftCoveragePreservation,
  validateE2EMinimum,
  validateExecutableSteps,
  validateFinalLayering,
  validatePhase5aAcceptanceGate,
  validatePhase4aSubcategoryDraft,
  validatePhase4bCategoryLayering,
  validateQualityDelta,
  validateRoundProgression,
  validateScenarioGranularity,
  validateSectionReviewChecklist,
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
  assert.match(result.failures.join('\n'), /end-to-end journey/i);
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
  assert.match(result.failures.join('\n'), /observable expected outcomes/i);
});

test('validatePhase4aSubcategoryDraft rejects canonical top-layer leakage in the subcategory draft', () => {
  const result = validatePhase4aSubcategoryDraft(`Feature QA Plan (BCIN-4A)

- Security
    * Authentication <P1>
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Phase 4a must stay below canonical top-layer grouping/i);
});

test('validatePhase4bCategoryLayering requires canonical top layers and a subcategory layer', () => {
  const result = validatePhase4bCategoryLayering(`Feature QA Plan (BCIN-4B)

- EndToEnd
    * Authentication
        - Sign in succeeds <P1>
            - Open the login page
                - Enter valid credentials
                    - Click Sign in
                        - Dashboard loads
- Core Functional Flows
    * Profile management
        - Update the display name <P2>
            - Open profile settings
                - Update the display name
                    - Saved confirmation appears
`);

  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
});

test('validatePhase4bCategoryLayering rejects scenarios directly under the top layer', () => {
  const result = validatePhase4bCategoryLayering(`Feature QA Plan (BCIN-4B)

- EndToEnd
    * Sign in succeeds <P1>
        - Open the login page
            - Enter valid credentials
                - Dashboard loads
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /subcategory layer/i);
});

test('validatePhase4bCategoryLayering accepts non-canonical top layer when top_layer_exception comment exists', () => {
  const result = validatePhase4bCategoryLayering(`Feature QA Plan (BCIN-4B)

<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->
- Custom Workflow
    * Subcategory
        - Custom scenario <P1>
            - Open the page
                - Expected outcome
`);

  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
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

test('validateReviewDelta rejects invalid final disposition', () => {
  const result = validateReviewDelta(`# Review Delta

## Source Review
- review_qa_plan_BCIN-1.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- none

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- retry later
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /invalid disposition/i);
});

test('validateContextCoverageAudit rejects review notes that do not account for each context artifact section', () => {
  const reviewNotes = `# Review Notes

## Context Artifact Coverage Audit
- context/jira_issue_BCIN-1.md | ## Feature Summary | consumed | EndToEnd > Authentication | primary journey | covered

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | pass | jira_issue_BCIN-1.md | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
`;
  const requiredArtifacts = [
    'context/jira_issue_BCIN-1.md::## Feature Summary',
    'context/confluence_design_BCIN-1.md::## Edge Cases',
  ];

  const result = validateContextCoverageAudit(reviewNotes, requiredArtifacts);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /confluence_design_BCIN-1\.md/i);
});

test('validateCoveragePreservationAudit rejects silent node removal without a coverage audit section', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP1)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
`;
  const afterDraft = `Feature QA Plan (BCIN-CP1)

- Core Functional Flows
    * Save
        - Rename report <P1>
            - Open the rename dialog
                - Updated name appears in the header
`;
  const reviewNotes = `# Review Notes

## Context Artifact Coverage Audit
- context/jira_issue_BCIN-CP1.md | ## Feature Summary | consumed | Core Functional Flows > Save | jira traceability | covered

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | deferred | current draft | not applicable
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | deferred | current draft | not applicable
- Regression / Known Risks | risky flows are isolated | deferred | current draft | not applicable
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | not applicable
- Security | permission-sensitive flows stay separate | deferred | current draft | not applicable
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not applicable
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not applicable
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not applicable
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none
`;

  const result = validateCoveragePreservationAudit(reviewNotes, beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Coverage Preservation Audit/i);
  assert.match(result.failures.join('\n'), /Save report/i);
});

test('validateCoveragePreservationAudit rejects unjustified move to Out of Scope', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP2)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
`;
  const afterDraft = `Feature QA Plan (BCIN-CP2)

- Out of Scope / Assumptions
    * Save
        - Save report <P1>
            - Coverage deferred for cleanup convenience
`;
  const reviewNotes = `# Review Notes

## Context Artifact Coverage Audit
- context/jira_issue_BCIN-CP2.md | ## Feature Summary | consumed | Core Functional Flows > Save | jira traceability | covered

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | moved_to_out_of_scope | none | pass | narrowed after the latest summary removed it
`;

  const result = validateCoveragePreservationAudit(reviewNotes, beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Out of Scope/i);
  assert.match(result.failures.join('\n'), /evidence or explicit user direction/i);
});

test('validateCoveragePreservationAudit rejects missing audit rows when prior round had more scenarios', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP3)

- EndToEnd
    * Report creation
        - Create report <P1>
            - Open the create dialog
                - Draft report opens
- Core Functional Flows
    * Save
        - Save report <P2>
            - Click Save
                - Save banner appears
`;
  const afterDraft = `Feature QA Plan (BCIN-CP3)

- EndToEnd
    * Report creation
        - Create report <P1>
            - Open the create dialog
                - Draft report opens
`;
  const reviewNotes = `# Review Notes

## Coverage Preservation Audit
- EndToEnd > Report creation > Create report | present_in_prior_round | preserved | jira_issue_BCIN-CP3.md | pass | retained
`;

  const result = validateCoveragePreservationAudit(reviewNotes, beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /missing coverage audit row/i);
  assert.match(result.failures.join('\n'), /Save report/i);
});

test('validateCoveragePreservationAudit rejects audit rows that claim preserved coverage when the rewritten draft removed it', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP3B)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
`;
  const afterDraft = `Feature QA Plan (BCIN-CP3B)

- Core Functional Flows
    * Rename
        - Rename report <P1>
            - Open rename dialog
                - Updated title appears
`;
  const reviewNotes = `# Review Notes

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | preserved | jira_issue_BCIN-CP3B.md | pass | retained after refactor
`;

  const result = validateCoveragePreservationAudit(reviewNotes, beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /claims preserved/i);
});

test('validateCoveragePreservationAudit accepts true one-to-many splits when multiple preserved children exist', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP3C)

- Core Functional Flows
    * Save flows
        - Save and save as stay available <P1>
            - Open the file menu
                - Save and Save As remain available
`;
  const afterDraft = `Feature QA Plan (BCIN-CP3C)

- Core Functional Flows
    * Save
        - Save report stays available <P1>
            - Open the file menu
                - Save remains available
    * Save As
        - Save As stays available <P1>
            - Open the file menu
                - Save As remains available
`;
  const reviewNotes = `# Review Notes

## Coverage Preservation Audit
- Core Functional Flows > Save flows > Save and save as stay available | present_in_prior_round | split_into_save_and_save_as | jira_issue_BCIN-CP3C.md | pass | split broad scenario into separate save and save as coverage
`;

  const result = validateCoveragePreservationAudit(reviewNotes, beforeDraft, afterDraft);
  assert.equal(result.ok, true);
});

test('validateSectionReviewChecklist requires a rewrite request for blocking findings', () => {
  const reviewNotes = `# Review Notes

## Context Artifact Coverage Audit
- context/jira_issue_BCIN-1.md | ## Feature Summary | consumed | EndToEnd > Authentication | primary journey | covered

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | fail | jira_issue_BCIN-1.md | add recovery outcome
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | pass | current draft | none
- Regression / Known Risks | risky flows are isolated | pass | github_diff_BCIN-1.md | none
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | confluence_design_BCIN-1.md | await browser matrix
- Security | permission-sensitive flows stay separate | pass | jira_issue_BCIN-1.md | none
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not in scope
- Accessibility | keyboard/focus coverage is explicit when applicable | deferred | current draft | not in scope
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not in scope
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- BF1 | EndToEnd | Missing recovery outcome | no visible completion or recovery state | add recovery outcome

## Advisory Findings
- none

## Rewrite Requests
- none
`;

  const result = validateSectionReviewChecklist(reviewNotes);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /BF1/i);
  assert.match(result.failures.join('\n'), /rewrite request/i);
});

test('validateCheckpointAudit requires evidence for every checkpoint and a release recommendation', () => {
  const checkpointAudit = `# Checkpoint Audit

## Checkpoint Summary
- Requirements Traceability | Checkpoint 1 | pass | jira_issue_BCIN-1.md | none
- Black-Box Behavior Validation | Checkpoint 2 | pass | qa_plan_phase5a_r1.md | none

## Blocking Checkpoints
- none

## Advisory Checkpoints
- none
`;

  const result = validateCheckpointAudit(checkpointAudit);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Checkpoint 3/i);
  assert.match(result.failures.join('\n'), /Release Recommendation/i);
});

test('validateCheckpointDelta rejects resolved blockers without a recorded change', () => {
  const checkpointDelta = `# Checkpoint Delta

## Blocking Checkpoint Resolution
- Checkpoint 3 | real integration coverage was missing | none | resolved

## Advisory Checkpoint Resolution
- none

## Final Disposition
- return phase5b
`;

  const result = validateCheckpointDelta(checkpointDelta);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Checkpoint 3/i);
  assert.match(result.failures.join('\n'), /recorded change/i);
});

test('validateCheckpointDelta rejects invalid final disposition', () => {
  const checkpointDelta = `# Checkpoint Delta

## Blocking Checkpoint Resolution
- none

## Advisory Checkpoint Resolution
- none

## Final Disposition
- escalate later
`;

  const result = validateCheckpointDelta(checkpointDelta);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /invalid disposition/i);
});

test('validateFinalLayering rejects drafts that skip the subcategory layer', () => {
  const result = validateFinalLayering(`Feature QA Plan (BCIN-6)

- EndToEnd
    * Sign in succeeds <P1>
        - Open the login page
            - Enter valid credentials
                - Click Sign in
                    - Dashboard loads
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /subcategory layer/i);
});

test('validateQualityDelta requires final layer audit and verdict sections', () => {
  const result = validateQualityDelta(`# Quality Delta

## Final Layer Audit
- EndToEnd > Authentication > Sign in succeeds | canonical layering retained | pass | none

## Few-Shot Rewrite Applications
- FS1 | EndToEnd > Authentication | vague wording | concrete wording | applied

## Exceptions Preserved
- none
`);

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /Verdict/i);
});

test('validateDraftCoveragePreservation rejects phase6 drafts that silently shrink reviewed coverage', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4)

- EndToEnd
    * Report creation
        - Create report <P1>
            - Open the create dialog
                - Draft report opens
- Core Functional Flows
    * Save
        - Save report <P2>
            - Click Save
                - Save banner appears
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4)

- EndToEnd
    * Report creation
        - Create report <P1>
            - Open the create dialog
                - Draft report opens
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /silent coverage regression/i);
  assert.match(result.failures.join('\n'), /Save report/i);
});

test('validateDraftCoveragePreservation allows clarified wording when the reviewed scenario remains equivalent', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4B)

- Core Functional Flows
    * Notifications
        - Open unread notification details <P2>
            - Open notifications panel
                - Click the unread item
                    - Notification details drawer opens
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4B)

- Core Functional Flows
    * Notifications
        - Inspect unread notification details <P2>
            - Open notifications panel
                - Click the unread item
                    - Notification details drawer opens
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft);
  assert.equal(result.ok, true);
});

test('validateDraftCoveragePreservation rejects opposite scenario wording that only partially overlaps', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4C)

- Core Functional Flows
    * Notifications
        - Open unread notification details <P2>
            - Open notifications panel
                - Click the unread item
                    - Notification details drawer opens
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4C)

- Core Functional Flows
    * Notifications
        - Inspect read notification details <P2>
            - Open notifications panel
                - Click a previously read item
                    - Notification details drawer opens
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /silent coverage regression/i);
});

test('validateDraftCoveragePreservation rejects contradictory action changes even when wording largely overlaps', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4D)

- Core Functional Flows
    * Scheduling
        - Enable export scheduling <P2>
            - Open scheduling settings
                - Turn scheduling on
                    - Scheduled export remains enabled
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4D)

- Core Functional Flows
    * Scheduling
        - Disable export scheduling <P2>
            - Open scheduling settings
                - Turn scheduling off
                    - Scheduled export is disabled
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /silent coverage regression/i);
});

test('validateDraftCoveragePreservation accepts regrouping from phase4a into phase4b when scenarios are preserved', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4E)

- Authentication
    * Sign in succeeds <P1>
        - Open the login page
            - Enter valid credentials
                - Dashboard loads successfully
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4E)

- EndToEnd
    * Authentication
        - Sign in succeeds <P1>
            - Open the login page
                - Enter valid credentials
                    - Dashboard loads successfully
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft, { allowTopLayerChange: true });
  assert.equal(result.ok, true);
});

test('validateDraftCoveragePreservation accepts evidence-backed out-of-scope exclusions after retitling', () => {
  const beforeDraft = `Feature QA Plan (BCIN-CP4F)

- Core Functional Flows
    * Scheduling
        - Enable export scheduling <P2>
            - Open scheduling settings
                - Turn scheduling on
                    - Scheduled export remains enabled
`;
  const afterDraft = `Feature QA Plan (BCIN-CP4F)

- Out of Scope / Assumptions
    * Export scheduling excluded by admin-only constraint <P2>
        - Evidence: confluence admin-only note confirms export scheduling is unsupported for this release
`;

  const result = validateDraftCoveragePreservation(beforeDraft, afterDraft);
  assert.equal(result.ok, true);
});

test('validatePhase5aAcceptanceGate rejects accept when coverage audit still requires rewrite', () => {
  const reviewNotes = `# Review Notes

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | removed | jira_issue_BCIN-80.md | rewrite_required | restore as standalone scenario
`;
  const reviewDelta = `# Review Delta

## Verdict After Refactor
- accept
`;

  const result = validatePhase5aAcceptanceGate(reviewNotes, reviewDelta, []);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /cannot return accept/i);
  assert.match(result.failures.join('\n'), /rewrite_required/i);
});

test('validatePhase5aAcceptanceGate rejects accept when round-integrity failures remain unresolved', () => {
  const reviewNotes = `# Review Notes

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | preserved | jira_issue_BCIN-80.md | pass | retained
`;
  const reviewDelta = `# Review Delta

## Verdict After Refactor
- accept
`;

  const result = validatePhase5aAcceptanceGate(reviewNotes, reviewDelta, ['Phase 5a rerun reused r1 instead of advancing to r2']);
  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /round-integrity/i);
  assert.match(result.failures.join('\n'), /reused r1/i);
});

test('validateRoundProgression rejects reruns that reuse the current round instead of advancing', () => {
  const result = validateRoundProgression({
    task: {
      phase5a_round: 2,
      return_to_phase: 'phase5a',
    },
    phaseId: 'phase5a',
    producedDraftPath: 'drafts/qa_plan_phase5a_r2.md',
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /advancing beyond r2/i);
});

test('validateRoundProgression rejects drafts that do not match the manifest-requested round', () => {
  const result = validateRoundProgression({
    task: {
      phase5a_round: 2,
      return_to_phase: 'phase5a',
    },
    phaseId: 'phase5a',
    producedDraftPath: 'drafts/qa_plan_phase5a_r2.md',
    expectedDraftPath: 'drafts/qa_plan_phase5a_r3.md',
  });

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /manifest requested r3/i);
});

const SAVE_SCENARIO_UNITS_FIXTURE = `# Scenario Units

## Scenario Units
- S_SAVE | F_SAVE | Save report | click Save | native save dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
- S_SAVE_AS | F_SAVE | Save As report | click Save As | native save as dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
`;

const SCENARIO_UNITS_FIXTURE = `# Scenario Units

## Scenario Units
- S_SAVE | F_SAVE | Save report | click Save | native save dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
- S_SAVE_AS | F_SAVE | Save As report | click Save As | native save as dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
- S_COMMENTS | F_SAVE | Save comments dialog | confirm save comments | comments dialog appears | Core Functional Flows | P1 | confluence.md | must_stand_alone
- S_TEMPLATE | F_SAVE | Set as template | choose Set as Template | template option is applied | Core Functional Flows | P1 | confluence.md | must_stand_alone
- S_MOJO_ERR | F_ERROR | Mojo-handled error | trigger editor-side error | error dialog dismisses without closing the editor | Error Handling / Recovery | P1 | confluence.md | must_stand_alone
- S_LIBRARY_ERR | F_ERROR | Library-handled error | trigger library-side error | error dialog closes the editor window | Error Handling / Recovery | P1 | confluence.md | must_stand_alone
`;

test('validateScenarioGranularity accepts one-to-one must_stand_alone mappings', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Regression / Known Risks | Save report keeps native dialog ownership | standalone | covered
- S_SAVE_AS | Regression / Known Risks | Save As report keeps native dialog ownership | standalone | covered
`;

  const draft = `Feature QA Plan

- Regression / Known Risks
    * Save report keeps native dialog ownership <P1>
        - Action: click Save from embedded authoring
            - Expected: the native Workstation save dialog opens and the report stays in the same window
    * Save As report keeps native dialog ownership <P1>
        - Action: click Save As from embedded authoring
            - Expected: the native Workstation save as dialog opens with the current report context intact
`;

  const result = validateScenarioGranularity(
    SAVE_SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft
  );

  assert.equal(result.ok, true);
});

test('validateScenarioGranularity rejects collapsed save/save as/comments/template testcase', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE, S_SAVE_AS, S_COMMENTS, S_TEMPLATE | Core Functional Flows | Save and template flows stay correct | approved_merge | covered
`;

  const draft = `Feature QA Plan

- Core Functional Flows
    * Save and template flows stay correct <P1>
        - Action: use one of the save-related actions
            - Expected: the flow remains usable
`;

  const result = validateScenarioGranularity(
    SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /must_stand_alone/i);
  assert.match(result.failures.join('\n'), /generic expected-result wording/i);
});

test('validateScenarioGranularity rejects merged mojo and library errors after split_required', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_MOJO_ERR, S_LIBRARY_ERR | Error Handling / Recovery | Error outcomes differ by owner | standalone | covered
`;

  const draft = `Feature QA Plan

- Error Handling / Recovery
    * Error outcomes differ by owner <P1>
        - Action: trigger an editor-side error and then a library-side error
            - Expected: the flow remains usable
`;

  const rewriteRequests = `# Review Rewrite Requests

## Rewrite Requests
- RR1 | S_MOJO_ERR, S_LIBRARY_ERR | split_required | split Mojo and Library error outcomes into separate testcases | required
`;

  const reviewDelta = `# Review Delta

## Blocking Findings Resolution
- RR1 | Error outcomes differ by owner | Error outcomes differ by owner | claimed split | resolved
`;

  const result = validateScenarioGranularity(
    SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft,
    rewriteRequests,
    reviewDelta
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /split_required/i);
});

test('validateScenarioGranularity allows explicit_exclusion for must_stand_alone scenario units', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Out of Scope / Assumptions | Save report excluded by user confirmation | explicit_exclusion | excluded
`;

  const draft = `Feature QA Plan

- Out of Scope / Assumptions
    * Save report excluded by user confirmation
        - Reason: the user confirmed this legacy save path is out of scope for the run
        - Evidence: user confirmation
`;

  const result = validateScenarioGranularity(
    SAVE_SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /S_SAVE_AS/);
  assert.doesNotMatch(result.failures.join('\n'), /S_SAVE must use standalone or explicit_exclusion/i);
});

test('validateScenarioGranularity rejects unresolved non-split required rewrites', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Regression / Known Risks | Save report keeps native dialog ownership | standalone | covered
`;

  const draft = `Feature QA Plan

- Regression / Known Risks
    * Save report keeps native dialog ownership <P1>
        - Action: click Save from embedded authoring
            - Expected: the flow remains usable
`;

  const rewriteRequests = `# Review Rewrite Requests

## Rewrite Requests
- RR2 | S_SAVE | expected_result_too_vague | replace generic expected result with a visible dialog outcome | required
`;

  const reviewDelta = `# Review Delta

## Blocking Findings Resolution
- RR2 | Save report keeps native dialog ownership | Save report keeps native dialog ownership | unchanged | resolved
`;

  const result = validateScenarioGranularity(
    SAVE_SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft,
    rewriteRequests,
    reviewDelta
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /RR2/);
  assert.match(result.failures.join('\n'), /expected_result_too_vague/i);
});

test('validateScenarioGranularity cli validates scenario units against ledger and draft', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'granularity_cli_'));
  const scenarioUnitsPath = join(tmp, 'scenario_units.md');
  const coverageLedgerPath = join(tmp, 'coverage_ledger.md');
  const draftPath = join(tmp, 'draft.md');

  await writeFile(scenarioUnitsPath, SAVE_SCENARIO_UNITS_FIXTURE);
  await writeFile(coverageLedgerPath, `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Regression / Known Risks | Save report keeps native dialog ownership | standalone | covered
- S_SAVE_AS | Regression / Known Risks | Save As report keeps native dialog ownership | standalone | covered
`);
  await writeFile(draftPath, `Feature QA Plan

- Regression / Known Risks
    * Save report keeps native dialog ownership <P1>
        - Action: click Save from embedded authoring
            - Expected: the native Workstation save dialog opens and the report stays in the same window
    * Save As report keeps native dialog ownership <P1>
        - Action: click Save As from embedded authoring
            - Expected: the native Workstation save as dialog opens with the current report context intact
`);

  const result = await runValidatorCli([
    'validate_scenario_granularity',
    scenarioUnitsPath,
    coverageLedgerPath,
    draftPath,
  ]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate_plan_artifact cli supports new phase4a validator', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'phase4a_cli_'));
  const draftPath = join(tmp, 'draft.md');
  await writeFile(draftPath, `Feature QA Plan (BCIN-CLI)

- Authentication <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
`);

  const result = await runValidatorCli(['validate_phase4a_subcategory_draft', draftPath]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
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

// ---------------------------------------------------------------------------
// CLI tests — validate_context_index
// ---------------------------------------------------------------------------

test('validate_context_index cli passes for a valid user-facing index', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'ctx_idx_cli_'));
  const file = join(tmp, 'context_index.md');
  await writeFile(file, `# Context Index

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
`);

  const result = await runValidatorCli(['validate_context_index', file]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate_context_index cli fails when user-facing index has no mandatory coverage candidates', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'ctx_idx_cli_'));
  const file = join(tmp, 'context_index.md');
  await writeFile(file, `# Context Index

## Feature Summary
- summary

## Feature Classification
- user_facing
- source artifact: jira_issue_BCIN-1.md

## Source Inventory
- artifact | source family | why | confidence

## Primary User Journeys
- flow

## Entry Points
- entry

## Core Capability Families
- family

## Error / Recovery Behaviors
- error

## Known Risks / Regressions
- risk

## Permissions / Auth / Data Constraints
- none

## Environment / Platform Constraints
- web

## Setup / Fixtures Needed
- none

## Unsupported / Deferred / Ambiguous
- none

## Mandatory Coverage Candidates

## Traceability Map
- F1 | jira_issue_BCIN-1.md | fact | normalized | consequence
`);

  const result = await runValidatorCli(['validate_context_index', file]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /VALIDATION_FAILED/);
  assert.match(result.stderr, /mandatory coverage candidates/i);
  await rm(tmp, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// CLI tests — validate_e2e_minimum
// ---------------------------------------------------------------------------

test('validate_e2e_minimum cli passes for user-facing plan with EndToEnd and expected result', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'e2e_cli_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `Feature QA Plan

- EndToEnd
    * Report creation
        - Full report creation flow <P1>
            - Open the feature
                - Click Create
                    - The report opens in the workspace
- Core Functional Flows
    * Editing
        - Edit title <P2>
            - Double-click the title field
                - The title field becomes editable
`);

  const result = await runValidatorCli(['validate_e2e_minimum', file, 'user_facing']);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate_e2e_minimum cli fails for user-facing plan missing EndToEnd section', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'e2e_cli_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `Feature QA Plan

- Core Functional Flows
    * Edit title <P2>
        - Action: double-click the title field
            - Expected: the title field becomes editable
`);

  const result = await runValidatorCli(['validate_e2e_minimum', file, 'user_facing']);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /VALIDATION_FAILED/);
  assert.match(result.stderr, /end-to-end journey/i);
  await rm(tmp, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// CLI tests — validate_executable_steps
// ---------------------------------------------------------------------------

test('validate_executable_steps cli passes for clean steps', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'exec_cli_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `Feature QA Plan (BCIN-1)

- High
    * Reporting <P1>
        - Open the report page
            - Click "Save"
                - Native save dialog appears
                - Report title remains unchanged
`);

  const result = await runValidatorCli(['validate_executable_steps', file]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate_executable_steps cli fails for banned vague phrases', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'exec_cli_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `Feature QA Plan

- EndToEnd
    * Report creation flow <P1>
        - Action: open the report and verify correct behavior
            - Expected: ensure it works
`);

  const result = await runValidatorCli(['validate_executable_steps', file]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /VALIDATION_FAILED/);
  assert.match(result.stderr, /verify correct behavior/i);
  await rm(tmp, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// CLI tests — validate_review_delta
// ---------------------------------------------------------------------------

test('validate_review_delta cli passes when blocking findings section contains none marker', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'delta_cli_'));
  const file = join(tmp, 'review_delta.md');
  await writeFile(file, `# Review Delta

## Source Review
- review_qa_plan_BCIN-1.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- NB1 | cleaned up wording | advisory

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- accept
`);

  const result = await runValidatorCli(['validate_review_delta', file]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /VALIDATION_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate_review_delta cli fails when a blocking finding has partially_resolved status', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'delta_cli_'));
  const file = join(tmp, 'review_delta.md');
  await writeFile(file, `# Review Delta

## Source Review
- review_qa_plan_BCIN-1.md

## Blocking Findings Resolution
- F1 | old title | new title | split attempted | partially_resolved

## Non-Blocking Findings Resolution
- none

## Still Open
- F1

## Evidence Added / Removed
- none

## Verdict After Refactor
- reject
`);

  const result = await runValidatorCli(['validate_review_delta', file]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /VALIDATION_FAILED/);
  assert.match(result.stderr, /partially_resolved/i);
  await rm(tmp, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Unit tests — validateScenarioGranularity edge cases
// ---------------------------------------------------------------------------

const MAY_MERGE_SCENARIO_UNITS_FIXTURE = `# Scenario Units

## Scenario Units
- S_SUBSET_WH | F_CREATE | Create subset from warehouse | select warehouse source | subset dataset appears | Core Functional Flows | P1 | confluence.md | may_merge_with_same_outcome
- S_SUBSET_DB | F_CREATE | Create subset from database | select database source | subset dataset appears | Core Functional Flows | P1 | confluence.md | may_merge_with_same_outcome
`;

test('validateScenarioGranularity accepts approved_merge for may_merge_with_same_outcome units', () => {
  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SUBSET_WH, S_SUBSET_DB | Core Functional Flows | Create subset from various sources | approved_merge | covered
`;

  const draft = `Feature QA Plan

- Core Functional Flows
    * Create subset from various sources <P1>
        - Action: select warehouse source then repeat with database source
            - Expected: subset dataset appears in both cases
`;

  const result = validateScenarioGranularity(
    MAY_MERGE_SCENARIO_UNITS_FIXTURE,
    coverageLedger,
    draft
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
});

test('validateScenarioGranularity rejects approved_merge for must_stand_alone units', () => {
  const scenarioUnits = `# Scenario Units

## Scenario Units
- S_SAVE | F_SAVE | Save report | click Save | native save dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
- S_SAVE_AS | F_SAVE | Save As report | click Save As | native save as dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
`;

  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE, S_SAVE_AS | Regression / Known Risks | Save flows | approved_merge | covered
`;

  const draft = `Feature QA Plan

- Regression / Known Risks
    * Save flows <P1>
        - Action: click Save or Save As
            - Expected: the appropriate dialog appears
`;

  const result = validateScenarioGranularity(
    scenarioUnits,
    coverageLedger,
    draft
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /must_stand_alone/i);
});

test('validateScenarioGranularity rejects missing_visible_outcome rewrite when generic wording remains', () => {
  const scenarioUnits = `# Scenario Units

## Scenario Units
- S_SAVE | F_SAVE | Save report | click Save | native save dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
`;

  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Regression / Known Risks | Save report dialog flow | standalone | covered
`;

  const draft = `Feature QA Plan

- Regression / Known Risks
    * Save report dialog flow <P1>
        - Action: click Save from the toolbar
            - Expected: the flow remains usable
`;

  const rewriteRequests = `# Review Rewrite Requests

## Rewrite Requests
- RR3 | S_SAVE | missing_visible_outcome | replace generic expected result with the specific dialog that appears | required
`;

  const reviewDelta = `# Review Delta

## Blocking Findings Resolution
- RR3 | Save report dialog flow | Save report dialog flow | no change | resolved
`;

  const result = validateScenarioGranularity(
    scenarioUnits,
    coverageLedger,
    draft,
    rewriteRequests,
    reviewDelta
  );

  assert.equal(result.ok, false);
  assert.match(result.failures.join('\n'), /RR3/);
});

test('validateScenarioGranularity passes when missing_visible_outcome rewrite is properly resolved', () => {
  const scenarioUnits = `# Scenario Units

## Scenario Units
- S_SAVE | F_SAVE | Save report | click Save | native save dialog appears | Regression / Known Risks | P1 | confluence.md | must_stand_alone
`;

  const coverageLedger = `# Coverage Ledger

## Scenario Mapping Table
- S_SAVE | Regression / Known Risks | Save report opens native dialog | standalone | covered
`;

  const draft = `Feature QA Plan

- Regression / Known Risks
    * Save report opens native dialog <P1>
        - Action: click Save from the toolbar
            - Expected: the native Workstation save dialog opens and the report window remains open
`;

  const rewriteRequests = `# Review Rewrite Requests

## Rewrite Requests
- RR3 | S_SAVE | missing_visible_outcome | replace generic expected result with the specific dialog that appears | required
`;

  const reviewDelta = `# Review Delta

## Blocking Findings Resolution
- RR3 | Save report dialog flow | Save report opens native dialog | renamed and added visible outcome | resolved
`;

  const result = validateScenarioGranularity(
    scenarioUnits,
    coverageLedger,
    draft,
    rewriteRequests,
    reviewDelta
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.failures, []);
});
