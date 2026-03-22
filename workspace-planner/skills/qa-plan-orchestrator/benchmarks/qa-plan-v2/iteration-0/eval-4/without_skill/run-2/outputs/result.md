# Phase4a Retrospective Replay Assessment — P4A-SDK-CONTRACT-001

- Feature: `BCIN-7289`
- Feature family: `report-editor`
- Phase under test: `phase4a`
- Evidence mode: `retrospective_replay`
- Verdict on baseline replay: `FAIL`

## Decision

The baseline replay does not satisfy the phase4a benchmark contract.

The copied evidence explicitly says the phase4a subcategory-draft writer dropped SDK/API-visible outcomes instead of turning them into executable scenarios:

- `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
  - Root Cause D says `setWindowTitle` was treated as trivial and never translated into a verifiable outcome.
  - The same file says the Phase 4a writer used coverage-ledger scenario units only, while SDK functions that appeared only in prose were silently dropped.
- `inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
  - Gap 5 identifies `Window title correctness across modes` as `Not tested in any scenario`.
  - Gap 10 says the double-click edit entry point must be added to that title scenario.

The missing phase4a coverage is visible in three replay defects tied to the same rendered SDK contract:

| Defect | Replay evidence | Missing explicit phase4a scenario outcome |
|---|---|---|
| `BCIN-7674` | Blank create shows `newReportWithApplication` in the window title | Blank-report title must be validated explicitly |
| `BCIN-7719` | New Intelligent Cube Report title is incorrect and remains stale after save | IC create/save title transition must be validated explicitly |
| `BCIN-7733` | Edit via double-click opens with incorrect/stale title path | Edit-mode title must be validated explicitly |

## Minimal Phase4a-Compliant Output

The following is the minimum phase4a scenario content needed to satisfy this benchmark case.

### Core Functional Flows

#### SDK/API Visible Outcome Scenario — `setWindowTitle`

**Scenario:** Window title is correct for each creation and edit mode  
**Priority:** `P2`  
**Why this must exist in phase4a:** `setWindowTitle` is a user-visible SDK integration contract, so the rendered title must be tested directly rather than treated as implicit coverage under "editor opens."

**Coverage:**

1. Blank new report
   - Create a blank report from the embedded editor entry point.
   - Verify the window title is `New Report` or the active-locale equivalent.
   - Verify the title is not `newReportWithApplication` or any untranslated/internal key.

2. New Intelligent Cube Report
   - Create a new Intelligent Cube Report from the dataset/intelligent cube entry point.
   - Verify the initial window title is `New Intelligent Cube Report` or the active-locale equivalent.
   - Save the report and verify the title updates correctly after save instead of remaining a stale prior mode name.

3. Edit existing report
   - Open an existing report in edit mode, including the double-click entry path called out in the replay.
   - Verify the window title shows the actual report name.
   - Verify the title does not remain blank, stale, or mapped to a different report/editor mode.

4. Template-sourced create path
   - Create a new report from a template.
   - Verify the title reflects the new report flow or resulting saved report name, not the source template identity.

**Acceptance signal:** Every creation/edit mode renders the correct human-readable title in the Workstation window, with no untranslated key, stale mode name, or wrong report name.

**Replay traceability:** `BCIN-7674`, `BCIN-7719`, `BCIN-7733`, plus Gap 5 and Gap 10 in the cross-analysis artifact.

## Benchmark Expectation Check

| Expectation | Result | Basis |
|---|---|---|
| SDK/API visible outcomes like window title become explicit scenarios | `FAIL` in baseline replay | Replay evidence says the scenario was missing and the SDK-visible outcome was dropped in phase4a |
| Output aligns with primary phase `phase4a` | `PASS` for this benchmark deliverable | This result is framed as a phase4a scenario-generation contract assessment and supplies the missing phase4a scenario content directly |

## Notes

- No direct copied phase4a draft artifact was present in the fixture set.
- The verdict therefore relies on retrospective replay artifacts that explicitly attribute the omission to phase4a behavior, which is sufficient for this benchmark case.
