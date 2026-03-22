# P4A-MISSING-SCENARIO-001

## Replay Verdict

`advisory fail`

The copied retrospective evidence shows that BCIN-7289 did not have phase4a-ready scenario coverage for the benchmark focus areas:

- `template-save`: the retrospective cross-analysis calls out a missing standalone scenario for template-sourced report creation plus save.
- `report-builder loading`: the retrospective cross-analysis calls out a missing scenario for Report Builder prompt element loading after double-click.

This is best classified as a phase4a miss because the corrective action needed is scenario-generation output, not a later review-only note.

## Evidence

### 1. Report Builder loading was missing as an executable scenario

- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:86-100` labels this as `Gap 2 — Report Builder Prompt Element Loading` and supplies the missing scenario text.
- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:42-48` says BCIN-7727 hit a code path with no QA-plan scenario and that Report Builder existed only as a fixture type, not an interaction scenario.
- `context/jira_issues/BCIN-7727.json:2-8` anchors the defect: Report Builder fails to load prompt elements after the folder interaction.

### 2. Template-save was not generated as its own standalone scenario

- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:104-120` labels this as `Gap 3 — Template-Sourced Report Creation + Save` and supplies the missing scenario text.
- `context/jira_issues/BCIN-7667.json:2-8` anchors the defect: creating from a template and saving overwrote the source template instead of creating a new report.
- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:18-24` adds nuance: the template-save behavior may have existed only buried inside a broader plan/checklist path. For this benchmark, that still counts as a phase4a miss because the path was not emitted as a distinct executable scenario.

## Phase4a Replay Output

Minimal phase4a-style scenario additions needed to satisfy this benchmark case:

### Core Functional Flows > Save and Save-As

**Scenario:** New Report created from a template saves as a new report (does not overwrite template) `[P1]`

**Defect anchor:** BCIN-7667

**Steps**

1. Connect Workstation to a qualifying server.
2. Click `File -> New Report` and choose a template such as `Product sales template`.
3. Author or accept the pre-filled report.
4. Click `File -> Save`.

**Expected results**

- The save creates a new report in the target folder.
- The source template is not overwritten or modified.
- The new report appears in the target folder immediately.

### Core Functional Flows > Report Editing Flow / Prompt Handling

**Scenario:** Report Builder loads attribute/metric elements correctly after double-click `[P1]`

**Defect anchor:** BCIN-7727

**Steps**

1. Open a report with an attribute or metric element prompt in the embedded editor.
2. Enter Report Builder view.
3. Double-click an attribute or metric to load its elements.

**Expected results**

- Elements load and are available for selection.
- No error appears.
- No empty element list appears.

## Benchmark Expectation Check

- `Case focus explicitly covered`: Yes. The replay output explicitly covers both template-save and report-builder loading.
- `Aligned with primary phase phase4a`: Yes. The output is written as scenario-generation content that phase4a should have emitted.
- `Does the baseline satisfy the case`: No. The evidence only surfaces these scenarios retrospectively as missing additions.
