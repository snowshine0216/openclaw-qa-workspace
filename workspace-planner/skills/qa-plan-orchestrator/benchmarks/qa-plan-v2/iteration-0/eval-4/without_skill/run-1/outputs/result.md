# Phase4a Benchmark Result — P4A-SDK-CONTRACT-001

| Field | Value |
|---|---|
| Feature | BCIN-7289 |
| Feature family | report-editor |
| Primary phase | phase4a |
| Evidence mode | retrospective_replay |
| Case family | defect replay |
| Priority | blocking |
| Verdict | FAIL |

## Decision

The phase4a contract is not satisfied by the replayed evidence. The missing behavior is explicit coverage of SDK/API visible outcomes: `setWindowTitle` was treated as implementation detail instead of being converted into executable phase4a scenarios with rendered-title assertions.

## Why This Fails The Benchmark

- The replayed analysis explicitly states that the phase4a subcategory-draft writer dropped SDK functions that appeared only in prose, including `setWindowTitle`.
- Three defects map to the same missed contract surface:
  - BCIN-7674: blank report opened with `newReportWithApplication`
  - BCIN-7719: Intelligent Cube report title was incorrect and remained stale after save
  - BCIN-7733: edit flow showed the wrong title
- The benchmark expectation says SDK/API visible outcomes like window title must become explicit scenarios in phase4a. The evidence shows they were not.

## Evidence Used

| Evidence file | Replay signal |
|---|---|
| `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` | States that `setWindowTitle` was captured in design evidence but never translated into a verifiable scenario, and identifies this as a phase4a writer gap. |
| `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` | Gap 5 says the plan lacked a window-title scenario across blank create, Intelligent Cube create, and edit modes. |
| `inputs/fixtures/BCIN-7289-defect-analysis-run/source/context/jira_issues/BCIN-7674.json` | Reproduced blank-create title defect. |
| `inputs/fixtures/BCIN-7289-defect-analysis-run/source/context/jira_issues/BCIN-7719.json` | Reproduced Intelligent Cube title defect and stale title after save. |
| `inputs/fixtures/BCIN-7289-defect-analysis-run/source/context/jira_issues/BCIN-7733.json` | Reproduced edit-entry defect associated with incorrect title behavior in the replay analysis. |

## Required Phase4a Output Delta

To satisfy this benchmark while staying aligned to phase4a, the subcategory draft must emit explicit executable scenarios for the rendered window title contract instead of assuming create/edit flows cover it implicitly.

### Subcategory Draft: SDK/API Visible Outcomes — Window Title

#### Scenario 1 — Blank report creation sets the correct native window title

- Priority: P2
- SDK/API contract: `setWindowTitle`
- Entry point: Workstation new report editor, blank report creation
- Steps:
  1. Connect Workstation to Library with the new report editor enabled.
  2. Create a blank report from the Workstation new report editor.
  3. Observe the native window title immediately after the editor opens.
- Expected results:
  - The title is `New Report` or the active-locale equivalent.
  - The title does not expose internal keys such as `newReportWithApplication`.

#### Scenario 2 — New Intelligent Cube report sets the correct title and updates it after save

- Priority: P2
- SDK/API contract: `setWindowTitle`
- Entry point: Dataset blade -> new Intelligent Cube report
- Steps:
  1. Create a new Intelligent Cube report from a dataset entry point.
  2. Observe the native window title when the editor opens.
  3. Save the report.
  4. Observe the native window title again after save completes.
- Expected results:
  - The initial title is `New Intelligent Cube Report` or the active-locale equivalent.
  - After save, the title updates to the saved report name.
  - The title does not remain stale as the pre-save placeholder name.

#### Scenario 3 — Double-click edit opens with the actual report name in the native title

- Priority: P2
- SDK/API contract: `setWindowTitle`
- Entry point: Double-click existing report to edit in Workstation
- Steps:
  1. From Workstation, double-click an existing report to open it in the new editor.
  2. Observe the native window title after the editor loads.
- Expected results:
  - The title shows the actual report name.
  - The title is not blank, stale, or inherited from another create/edit path.

## Benchmark Pass Condition

This benchmark passes only if the phase4a artifact contains explicit scenarios equivalent to the three scenarios above, or a single standalone scenario with the same three entry points and rendered-title assertions. Evidence from the replay shows that condition was not met.
