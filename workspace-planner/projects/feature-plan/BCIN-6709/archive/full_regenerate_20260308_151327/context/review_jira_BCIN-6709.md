# Jira Review Findings — BCIN-6709 Test Key Points Draft v1

## Scope
Reviewed `projects/feature-plan/BCIN-6709/drafts/test_key_points_xmind_v1.md` against Jira-only evidence:
- `projects/feature-plan/BCIN-6709/context/qa_plan_atlassian_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/jira_issue_BCIN-6709.txt`
- `projects/feature-plan/BCIN-6709/context/jira_issue_BCIN-7543.txt`

## Findings

### 1) Wrong priority: pause/data-retrieval recovery is treated as P1 instead of core coverage
- **Draft location**: `P1 Pause/data-retrieval switching around recovery`
- **Why this is an issue**: Jira evidence names this as a dedicated implementation subtask: `BCIN-7589 report-editor handle pause and data retrival status switch`.
- **Source basis**: BCIN-7543 subtask list.
- **Recommendation**: Move this scenario to **P0** because it is part of the explicit feature implementation trail, not optional regression coverage.

### 2) Missing explicit coverage for the BIWeb XML command <os 8 subtask
- **Why this is an issue**: Jira lists `BCIN-7583 BIWeb xml command <os 8` as a named subtask, but the draft has no explicit testcase or note mapping to this behavior.
- **Source basis**: BCIN-7543 subtask list.
- **Recommendation**: Add a testcase or an explicit non-applicable note tied to this subtask so the Jira implementation trail is fully covered.

### 3) Unsupported expectation: specific error taxonomy and modal variants are not evidenced in Jira-only sources
- **Draft examples**:
  - `Show an Application Error modal`
  - `Show a Server Error modal`
  - `Compare Application Error and Server Error variants`
- **Why this is an issue**: Jira-only evidence says error handling should improve and mentions new strings / error transform work, but it does **not** confirm these exact modal classes or that both variants must be validated as distinct product requirements.
- **Source basis**:
  - BCIN-6709 description only states users should continue editing after errors instead of reopening.
  - BCIN-7543 subtasks mention error transform / new string, but do not define the exact modal taxonomy.
- **Recommendation**: Reword these cases so they validate observable recovery/error messaging without asserting unsupported modal names, unless another artifact supplies that detail.

### 4) Unsupported expectation: exact dialog copy is asserted without Jira evidence
- **Draft examples**:
  - `The dialog title is Report Cannot Be Executed.`
  - `The message tells the user to click OK to return to Data Pause Mode`
  - `The visible message reads One or more datasets failed to load.`
- **Why this is an issue**: Jira-only materials do not provide these exact strings.
- **Source basis**:
  - BCIN-7543 includes a `New string` subtask, but the allowed evidence does not contain the actual approved copy.
- **Recommendation**: Replace exact-string assertions with evidence-backed wording such as “error copy clearly explains the failure and recovery action,” unless the real copy is available from an allowed source.

### 5) Unsupported expectation: Show Details / Hide details behavior is not evidenced in Jira-only sources
- **Draft location**: `P0 Details toggle behavior in error dialogs`
- **Why this is an issue**: Jira-only evidence does not mention a details expander, collapsed state, or toggle-label behavior.
- **Source basis**: None of the allowed Jira artifacts mention Show Details / Hide details UI.
- **Recommendation**: Remove or downgrade unless supported by another allowed artifact.

### 6) Unsupported expectation: Send Email visibility rules are not evidenced in Jira-only sources
- **Draft location**: `P1 Send Email visibility rules`
- **Why this is an issue**: The Jira-only evidence contains no requirement or comment about a Send Email action.
- **Source basis**: Not present in BCIN-6709, BCIN-7543, or the Atlassian context summary.
- **Recommendation**: Remove this section from the Jira-grounded draft unless another approved artifact supports it.

### 7) Unsupported expectation: truncation-specific vs non-truncation recovery handling is not evidenced in Jira-only sources
- **Draft location**: `P1 Non-truncation failures keep distinct handling`
- **Why this is an issue**: Jira-only evidence does not mention truncation, maximum rows, or a special truncation recovery model.
- **Source basis**: Not present in the allowed sources.
- **Recommendation**: Remove or restate at a higher level around “different error types remain correctly handled” only if tied directly to the `Research and handle kinds of errors` subtask.

### 8) Unsupported expectation: cross-surface Library/web vs Report Editor comparison is not clearly required by Jira-only evidence
- **Draft location**: `P1 Cross-surface consistency`
- **Why this is an issue**: Jira evidence centers on continuing editing in the report/editor flow. The Atlassian context notes Library/web PR references, but does not establish a user requirement that equivalent failures must be compared across surfaces.
- **Source basis**:
  - BCIN-6709 problem statement is about not losing edits in report editing.
  - BCIN-7543 subtasks are report-editor heavy.
- **Recommendation**: Keep Report Editor recovery coverage as primary. Only retain cross-surface comparison if another artifact explicitly requires parity.

### 9) Unsupported expectation: reload flicker / duplicate recovery screens is not evidenced in Jira-only sources
- **Draft location**: `P1 Recovered report state coherence` → `Recovery does not show repeated reload flicker or duplicate recovery screens`
- **Why this is an issue**: Jira-only evidence does not mention flicker, duplicate screens, or animation/rendering defects.
- **Source basis**: Not present in the allowed Jira artifacts.
- **Recommendation**: Remove this expectation or replace it with a directly supported observable outcome: the recovered report remains usable and coherent.

### 10) Several P0/P1 steps are too vague to execute consistently
- **Draft examples**:
  - `Trigger a recoverable report error after making visible edits`
  - `Trigger a recoverable prompt execution failure`
  - `Trigger the same recoverable failure during reprompt`
  - `Encounter an error during pause or data retrieval transitions`
- **Why this is an issue**: Jira tells reviewers *what behavior matters* (continue editing, prompt cancel return, document view remains visible, pause/data retrieval switching, undo/redo reset) but these rows do not tell QA what concrete user action should produce the condition.
- **Source basis**:
  - BCIN-6709 and BCIN-7543 identify target behaviors at a feature/subtask level only.
- **Recommendation**: Rewrite each row with a concrete user flow tied to the named Jira behavior, e.g. prompt cancel flow, error during report execution, error while document view is open, error during pause/data retrieval transition.

### 11) Unsupported expectation: “undo and redo are not cleared unnecessarily” over-asserts behavior not stated in Jira
- **Draft location**: `P0 Undo/redo coherence after recoverable recreation`
- **Why this is an issue**: The Jira subtask says `mojo to canctrol the undo redo reset`, which indicates undo/redo handling is in scope, but Jira-only evidence does not prove the required outcome is “not cleared unnecessarily.” The expected behavior could be preserve, reset, or selectively reset.
- **Source basis**: BCIN-7543 subtask list only.
- **Recommendation**: Rephrase to validate that undo/redo behavior after recovery matches the intended design and does not leave the report in an inconsistent state, without assuming preservation is always correct.

## Summary
The draft is directionally aligned with Jira on the main feature goal: recover from report errors without forcing reopen, preserve editing continuity, and cover prompt/document-view/pause-data-retrieval/undo-redo themes from the BCIN-7543 subtasks. The main Jira-grounded issues are:
- one likely priority mistake (`pause/data-retrieval` should be P0),
- one missing explicit subtask mapping (`BIWeb xml command <os 8`),
- multiple unsupported UI/copy assertions not present in Jira-only evidence,
- and several vague trigger steps that should be rewritten into executable user actions.
