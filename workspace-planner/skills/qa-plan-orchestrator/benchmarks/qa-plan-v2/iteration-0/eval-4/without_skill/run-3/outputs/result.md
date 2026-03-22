# Phase4a Retrospective Replay — BCIN-7289

- Case: `P4A-SDK-CONTRACT-001`
- Feature: `BCIN-7289`
- Feature family: `report-editor`
- Primary phase: `phase4a`
- Evidence mode: `retrospective_replay`
- Verdict: `PASS`

## Contract Check

| Benchmark expectation | Result | Fixture basis |
|---|---|---|
| SDK/API visible outcomes like window title become explicit scenarios | PASS | `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` says Phase 4a dropped `setWindowTitle` because it appeared only in prose, and must generate a dedicated rendered-outcome scenario. `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` defines the missing window-title scenario explicitly. |
| Output aligns with primary phase `phase4a` | PASS | This artifact is a Phase 4a scenario-draft addendum, not a later-phase audit or release recommendation. |

## Phase4a Scenario-Draft Addendum

Section placement: `Compatibility / Workstation shell integration` (inferred from the fixture language describing window title as a rendered contract between the embedded editor and Workstation native window management).

### Scenario 1 — Window title is correct for each creation and edit mode [P2]

Purpose: verify the rendered outcome of `setWindowTitle`; do not treat "editor opens" as implicit coverage for title correctness.

Preconditions:
- Workstation is connected to the BCIN-7289 test environment.
- New report editor is enabled.
- A report template and an editable existing report are available.

Entry points:
- Create a blank report.
- Create a New Intelligent Cube Report.
- Double-click an existing report to edit it.
- Create a new report from a template.

Expected results:
- Blank report title shows `New Report` or the active-locale equivalent, and never the raw token `newReportWithApplication`.
- New Intelligent Cube Report title shows `New Intelligent Cube Report` or the active-locale equivalent when the editor opens.
- After the first save in the Intelligent Cube flow, the title updates to the saved report name and does not remain on the temporary creation title.
- Double-click edit shows the actual report name in the Workstation window title.
- Template-sourced creation shows the new report name, not the template name, in the title bar.

Defect coverage:
- `BCIN-7674`
- `BCIN-7719`
- `BCIN-7733`
- Template-name title variant called out in Gap 5

### Scenario 2 — Window title strings render in the active locale for report-entry modes [P2]

Purpose: make title localization an explicit executable check instead of leaving it implied by broader i18n coverage.

Preconditions:
- User locale is set to Chinese.
- New report editor is enabled.

Entry points:
- Create a blank report.
- Create a New Intelligent Cube Report.
- Open any report entry path that surfaces a report-editor title in the shell.

Expected results:
- Title strings render in the active locale rather than English fallback text.
- No raw English creation labels remain in the title bar for blank report, Intelligent Cube Report, or related report-entry titles.
- The localized title remains correct after save or reopen.

Defect coverage:
- `BCIN-7721`
- `BCIN-7722`

## Evidence Trace

| Evidence | What it proves |
|---|---|
| `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` Root Cause D | `setWindowTitle` was a missed SDK-visible contract and should have become a dedicated scenario in Phase 4a. |
| `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` Enhancement 1 | Phase 4a must scan SDK/API tables and emit explicit scenarios for user-visible rendered outcomes. |
| `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 5 | Defines the missing scenario shape for window-title correctness across blank create, Intelligent Cube create, edit, and template-sourced create. |
| `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 7 | Shows title localization was also missing from explicit QA-plan coverage. |
| `context/jira_issues/BCIN-7674.json` | Blank-create path produced raw token title `newReportWithApplication`. |
| `context/jira_issues/BCIN-7719.json` | Intelligent Cube create path had wrong title and stale post-save title behavior. |
| `context/jira_issues/BCIN-7733.json` | Edit entry path needed an explicit title check on double-click edit. |
| `context/jira_issues/BCIN-7722.json` | Title localization must be checked as a visible outcome, not assumed. |

## Outcome

This replay satisfies the benchmark case because the Phase 4a output now contains explicit executable scenarios for the SDK-visible title contract, including cross-mode and locale-sensitive variants, instead of relying on broader "editor opens" scenarios to imply coverage.
