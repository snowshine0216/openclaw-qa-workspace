# BCIN-7289 Phase4a Blind Scenario Draft

## Phase Alignment

- Primary phase: `phase4a`
- Artifact intent: blind scenario drafting only
- Outcome: constrained draft completed; not promotable as customer-backed coverage under the supplied blind policy

## Evidence Gate

- Feature context available: `BCIN-7289.issue.raw.json`
  - Summary: "Embed Library Report Editor into the Workstation report authoring."
  - Description explicitly references prompt support as a driver for embedding the Library report editor into Workstation report authoring.
- Customer-scope export: `BCIN-7289.customer-scope.json`
  - `customer_signal_present: false`
  - Note: no explicit customer references were found on the feature issue.
- Adjacent issue export: `BCIN-7289.adjacent-issues.summary.json`
  - `customer_signal_present: false`
  - Relevant issue summaries exist for prompt behavior, template save, report builder loading, and visible title behavior, but they are not customer-qualified under `all_customer_issues_only`.

## Focus Coverage Matrix

| Focus area | Draft scenario coverage | Fixture cues | Evidence status |
| --- | --- | --- | --- |
| Prompt handling | `S1` | Feature description; `BCIN-7730`, `BCIN-7685`, `BCIN-7677`, `BCIN-7707`, `BCIN-7708` | Adjacent issue cues only, not customer-qualified |
| Template save | `S1` | `BCIN-7688`, `BCIN-7667`, `BCIN-7669` | Adjacent issue cues only, not customer-qualified |
| Report builder loading | `S2` | `BCIN-7727`, `BCIN-7668`, `BCIN-7693` | Adjacent issue cues only, not customer-qualified |
| Visible report title outcomes | `S3` | `BCIN-7674`, `BCIN-7719`, `BCIN-7722` | Adjacent issue cues only, not customer-qualified |

## Scenario Drafts

### S1. Prompted Template Creation and Save Path

- Goal: draft the user flow where a report is created from a template that requires prompt interaction, then saved as a new report or template.
- Preconditions: Workstation launches the embedded Library report editor for a template-backed report flow with prompt support enabled.
- Draft steps:
  1. Start report creation from a template that requires a prompt.
  2. Verify the prompt is shown before the report flow continues.
  3. Supply prompt answers and continue into the embedded editor.
  4. Use save or save as to create a new report or save a new template.
  5. Revisit the prompt state after save-as or after choosing to discard current answers.
- Expected visible outcomes:
  - The prompt is shown when required and accepts user input.
  - Prompt answers are passed into the embedded report flow.
  - Saving from a template creates the intended new object instead of overwriting the source template.
  - Template-related save affordances remain usable when saving a newly created report as a template.
  - Prompt state behaves consistently after save-as or discard choices.
- Evidence basis:
  - Feature description establishes prompt support as a primary embedding driver.
  - Adjacent issue cues: `BCIN-7730`, `BCIN-7685`, `BCIN-7677`, `BCIN-7707`, `BCIN-7708`, `BCIN-7688`, `BCIN-7667`, `BCIN-7669`.
- Draft status: retained as a `phase4a` scenario draft only; not customer-backed under the supplied blind policy.

### S2. Report Builder Loading from Prompt or Folder Navigation

- Goal: draft the user flow where the embedded report builder loads prompt-related elements when the user navigates folders.
- Preconditions: A report is open in the embedded editor and prompt or report builder navigation is available.
- Draft steps:
  1. Open report builder or the prompt element browser from the embedded editor.
  2. Navigate into a folder and double-click to load its elements.
  3. Wait for the element list to render and continue interacting with the builder.
  4. Dismiss any transient dialog or loading state and confirm the editor remains usable.
- Expected visible outcomes:
  - Elements load successfully after folder navigation.
  - The editor does not remain in an empty or indefinitely loading state.
  - Loading indicators are singular and transient rather than duplicated or stuck.
- Evidence basis:
  - Feature summary supports the embedded editor transition.
  - Adjacent issue cues: `BCIN-7727`, `BCIN-7668`, `BCIN-7693`.
- Draft status: retained as a `phase4a` scenario draft only; not customer-backed under the supplied blind policy.

### S3. Visible Report Title Lifecycle

- Goal: draft the visible-title behavior for newly created reports and saved reports in the embedded editor window.
- Preconditions: The user can create a blank report, intelligent cube report, or report builder window inside Workstation using the embedded editor.
- Draft steps:
  1. Create a new report flow and observe the initial visible title.
  2. Continue into the editing surface and confirm the title remains human-readable.
  3. Save the report with an explicit object name.
  4. Observe the visible title after save.
- Expected visible outcomes:
  - The initial title is a readable product title rather than an internal key or placeholder string.
  - The title updates after save to reflect the saved object name or the intended report type label.
  - Localized title text remains readable where localization applies.
- Evidence basis:
  - Adjacent issue cues: `BCIN-7674`, `BCIN-7719`, `BCIN-7722`.
- Draft status: retained as a `phase4a` scenario draft only; not customer-backed under the supplied blind policy.

## Phase4a Disposition

- `phase4a` expectation met: the draft explicitly covers prompt handling, template save, report builder loading, and visible report title outcomes.
- Constraint carried forward: no supplied issue in the blind bundle is customer-qualified, so these scenarios remain draft hypotheses rather than promoted customer-backed scenarios.
- Promotion recommendation: hold at `phase4a` until customer-qualified evidence is provided or the blind evidence policy changes.
