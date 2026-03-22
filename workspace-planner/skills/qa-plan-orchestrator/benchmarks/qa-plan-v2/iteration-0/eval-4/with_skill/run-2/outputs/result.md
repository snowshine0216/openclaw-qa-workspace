# P4A-SDK-CONTRACT-001

## Verdict

PASS for the current `qa-plan-orchestrator` skill snapshot on this `phase4a` retrospective replay.

## Expectation Check

- `[defect_replay][blocking]` Case focus is explicitly covered: PASS. The phase `4a` contract says `SDK/API visible outcomes must remain testable in scenario leaves`, the `report-editor` knowledge pack requires `window title correctness`, and the same pack lists `setWindowTitle` as an SDK-visible contract.
- `[defect_replay][blocking]` Output aligns with primary phase `phase4a`: PASS. The contract requires a subcategory-only draft with `subcategory -> scenario -> atomic action chain -> observable verification leaves`, and forbids canonical top-layer grouping in this phase.

## Replay Evidence

- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` identifies Root Cause D: `setWindowTitle` was treated as trivial instead of becoming a verifiable scenario, exposing BCIN-7674, BCIN-7719, and BCIN-7733.
- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` calls out Gap 5: `Window Title Correctness for All Creation Modes`, with the missing scenario explicitly tied to `setWindowTitle`.
- `BCIN-7289_REPORT_FINAL.md` and `context/defect_index.json` show user-visible title defects in blank-create and Intelligent Cube flows, confirming this is a black-box outcome rather than implementation detail.
- `references/qa-plan-benchmark-spec.md` lists `window title correctness` as a recommended retrospective replay target and `knowledge_pack_coverage` target.

## Phase4a-Aligned Coverage Example

The benchmark focus is satisfied only if Phase `4a` turns the SDK-visible outcome into explicit executable scenarios, for example:

```md
Feature QA Plan (BCIN-7289)

<!-- trace: deep_research_synthesis_report_editor_BCIN-7289.md -->
- Window title behavior
    * Blank report creation shows the correct title <P1>
        - Create a blank report in the embedded Workstation editor
            - The window title shows `New Report` or the locale-equivalent title
            - The window title does not show `newReportWithApplication`
    * Intelligent Cube creation shows the correct title and saved-name update <P1>
        - Create a new Intelligent Cube report from a dataset entry point
            - The window title shows `New Intelligent Cube Report` or the locale-equivalent title
            - Save the report
                - The window title updates to the saved report name
    * Editing an existing report shows the actual report name in the title <P1>
        - Double-click an existing report to edit it in Workstation
            - The embedded editor opens
                - The window title shows the actual report name
```

This example stays inside `phase4a` rules: no canonical top-layer buckets, explicit scenario nodes, atomic actions, and observable leaves.
