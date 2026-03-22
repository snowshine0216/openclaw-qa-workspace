# RE-P4A-SCENARIO-DRAFT-001

## Phase Alignment
- Primary phase: `phase4a`
- Artifact type: blind scenario draft
- Feature: `BCIN-7289`
- Feature family: `report-editor`
- Priority: advisory

This deliverable stays at scenario-draft depth. It defines what coverage must exist for the embedded report-editor flow without expanding into full procedural test cases, execution logs, or defect triage.

## Blind Evidence Limits
- `BCIN-7289.customer-scope.json` reports `customer_signal_present: false` and notes that no explicit customer references were found on the feature.
- `BCIN-7289.adjacent-issues.summary.json` is included in the copied blind bundle, but it also reports `customer_signal_present: false`.
- Because the customer-only blind slice is effectively empty, the draft below uses the copied feature record as primary evidence and treats the copied adjacent defect summaries as advisory functional adjacency, not confirmed customer incidents.

## Scenario Anchor
`BCIN-7289` describes embedding the Library Report Editor into Workstation report authoring because the legacy Workstation prompt implementation is older and separate from Library prompt handling. The scenario surface should therefore concentrate on the places where the embedded-editor handoff is most likely to regress: prompt behavior, template-origin saves, report builder loading, and visible title updates.

## Drafted Scenarios

### S1. Prompted Template Creation Preserves Prompt Behavior
Draft:
- Start a new report from a template that contains prompts in the embedded Library report editor inside Workstation.
- Exercise normal prompt display, pause-mode prompting, discard-answer behavior, and "do not prompt" behavior during create and save-as flows.

Visible outcomes to carry forward:
- Prompt is shown when the flow says it should be shown.
- Prompt answers are passed into the report correctly.
- Discarding current answers clears them for the next create/save decision.
- "Do not prompt" prevents an unnecessary re-prompt.

Evidence basis:
- `BCIN-7289` feature description calls out prompt-support mismatch as a core reason for the work.
- Copied adjacent defect summaries: `BCIN-7730`, `BCIN-7685`, `BCIN-7707`, `BCIN-7677`.

### S2. Template-Origin Saves Preserve Object Intent
Draft:
- From a report created by template, save the result as a new report and cover "set as template" behavior where that option is expected to be available.

Visible outcomes to carry forward:
- Saving does not silently overwrite the source template or source report.
- "Set as template" remains available when a newly created report can be saved as a template.
- Save behavior matches the object type the user selected.

Evidence basis:
- Copied adjacent defect summaries: `BCIN-7667`, `BCIN-7688`.

### S3. Report Builder Loads Prompt Elements After Navigation
Draft:
- From the embedded editor, open prompt-related builder navigation and double-click into folders that contain selectable elements.

Visible outcomes to carry forward:
- Elements load after folder navigation.
- Report Builder does not stay empty or stall after double-clicking into a folder.

Evidence basis:
- Copied adjacent defect summary: `BCIN-7727`.

### S4. Visible Report Title Is Human-Readable Before And After Save
Draft:
- Check the title shown when opening a blank or new report and again after saving the object.

Visible outcomes to carry forward:
- The initial title is human-readable and product-correct for the object type.
- Internal keys such as `newReportWithApplication` are never exposed.
- After save, the title updates to the saved report or object name.

Evidence basis:
- Copied adjacent defect summaries: `BCIN-7674`, `BCIN-7719`.
- Optional localization follow-on if later phases expand coverage: `BCIN-7722`.

## Combined Scenario Thread
Use one end-to-end narrative in later phases:

1. Launch the embedded Library report editor from Workstation report authoring.
2. Create a report from a template with prompts.
3. Confirm prompt display and answer persistence or discard behavior.
4. Navigate prompt elements in Report Builder and confirm content loads.
5. Save as a new report and verify template-related save semantics.
6. Confirm the visible title is correct before save and updated after save.

## Benchmark Expectation Check
- Explicit coverage of prompt handling, template save, report builder loading, and visible report title outcomes: met.
- Output aligned to `phase4a`: met, because this is a scenario draft rather than a detailed test script or execution report.

## Confidence
Advisory only. Confidence is limited by the blind bundle's lack of confirmed customer-signal issues, so this should be treated as the minimum defensible phase `4a` scenario surface for later refinement.
