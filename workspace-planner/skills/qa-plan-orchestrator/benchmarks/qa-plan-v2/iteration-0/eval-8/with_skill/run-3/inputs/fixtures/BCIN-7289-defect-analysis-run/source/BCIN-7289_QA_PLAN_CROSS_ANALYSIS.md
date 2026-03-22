# BCIN-7289 — Defect vs QA Plan Cross-Analysis

**Prepared:** 2026-03-21  
**Defects analyzed:** 26 (13 Done, 13 Open)  
**QA plan draft:** `qa_plan_phase6_r1.md`  
**Context sources used:** defect_index.json, jira_raw.json, PR data, coverage_ledger, deep_research_synthesis, bced_2416_lessons

---

## Part 1 — Which Issues Should Have Been Caught During Self-Testing

These are defects that map to scenarios **already covered or clearly implied** in the QA plan. They should have surfaced during the developer's own self-testing (or QA smoke testing) before formal QA execution. The fact that they became filed defects indicates the self-test bar was not met.

---

### 🔴 Tier 1 — Critical path failures (must-find before any hand-off)

| Defect | Priority | Status | QA Plan Scenario | Why It Should Have Been Caught |
|--------|----------|--------|-----------------|-------------------------------|
| **BCIN-7667** | High | Done | E2E "Create Report End-to-End Journey"; Core "Report Creation — Main Menu Entry Points"; "Template Operations" | Creating a report from a template and hitting Save is the most basic create+save flow. Any single run of the E2E journey would trigger this. The scenario explicitly checks "The report is saved successfully" — template-sourced save is the same entry point. |
| **BCIN-7669** | High | **Open** | Core "Save and Save-As — Save overrides trigger native Workstation comments dialog" | Overwriting an existing report is directly described in "Save overrides" + "Save As folder visibility" scenarios. The JS crash (`Cannot read properties of null (reading saveAs)`) means the save handler was never exercised against an overwrite target. |
| **BCIN-7675** | High | Done | Performance "Embedded editor first-open time is within acceptable range" | An 80% regression (9s vs. 5s) for a Platform Analytics project blank report is exactly what the performance scenario is designed to catch. The BCED-2416 analog had a +20s first-open flag; this is the same class of defect. |
| **BCIN-7677** | High | Done | Core "Save and Save-As — Save As opens native Workstation Save-As dialog" | The scenario explicitly exercises Save-As + prompt options. The "do not prompt" flag not being respected is observable on the first run of this scenario. |
| **BCIN-7673** | High | Done | Core "Convert to Cube and Datamart — Convert to Cube shows Library-style confirm dialog" | Converting to IC/Datamart and checking the dialog content is a P1 scenario. `\n` rendering in the confirm message string is immediately visible. |
| **BCIN-7685** | High | Done | E2E "Edit Report End-to-End Journey" — any scenario that runs a prompt-based report | Cannot pass prompt answer is a blocking failure on any prompted report. The E2E flow includes executing and saving prompt-based reports. |
| **BCIN-7687** | High | Done | Core "Save and Save-As with Native Workstation Dialog" — save of subset report | Saving a newly created subset report is SU-11 and is covered in P1. The `instanceId` null error is a crash on the save path. |
| **BCIN-7704** | High | Done | Compatibility "UI and Behavior Parity Gaps — FORMAT and VIEW menu categories appear at second level" | This is literally an explicit P2 scenario in the plan. Opening the menu bar and checking FORMAT/VIEW presence is trivial. |
| **BCIN-7724** | High | Done | Core "Save and Save-As — Save overrides trigger native Workstation comments dialog" | A 400 error on replace/overwrite is a direct failure of the save-override flow which is a P1 scenario. |
| **BCIN-7707** | High | Done | Core "Close and Cancel — Closing editor with unsaved changes prompts confirm dialog" | Discard current answer → report re-runs is part of the prompt + discard interaction, which is covered under Close/Cancel and Save scenarios. |

**Summary:** 10 of the 13 High-priority defects fall into flows that are explicitly P1 scenarios in the QA plan. They are all basic, observable, first-run failures. None require edge-case setup.

---

### 🟡 Tier 2 — Should surface in normal P1/P2 execution

| Defect | Priority | Status | QA Plan Scenario | Why It Should Have Been Caught |
|--------|----------|--------|-----------------|-------------------------------|
| **BCIN-7674** | Low | Done | E2E "Create Report End-to-End Journey" + any scenario that creates a blank report | Window title "newReportWithApplication" is visible immediately when the editor opens. Any create-blank-report run would show it. |
| **BCIN-7680** | Low | Done | Core "Link Drill and Drill Behaviors — Link to another report opens in a new editor window in edit mode" | After linking to target report, target not in running mode. This is SU-20 / P2. |
| **BCIN-7695** | Low | Open | Compatibility "UI and Behavior Parity Gaps — Property dialogs and object editors open in Library style" | Copy SQL tooltip is a visible UI element. Any run that uses the copy SQL button in the editor would surface it. |
| **BCIN-7691** | Low | Done | Core "Save and Save-As — Save As folder visibility is immediate" | Folder not refreshed after save-to-folder — this is exactly MCC-16 / F-08 (DE332260 analog), marked as a critical known risk from BCED-2416 history. This is a P1 scenario. Should have been caught on first save. |
| **BCIN-7719** | High | Done | E2E "Create Report End-to-End Journey" + scenario for creating blank report | Window title "New Intelligent Cube Report" incorrect. Title is visible immediately on open. `setWindowTitle` is a documented SDK integration point. |
| **BCIN-7727** | High | **Open** | Core "Report Editing Flow — Existing report opens in embedded editor via right-click Edit" + any Report Builder prompt scenario | Report Builder failing to load elements after double-click is observable on the first attempt to use attribute/metric element prompts. There is no scenario in the QA plan specifically for Report Builder double-click element loading — **this is a gap** (see Part 2). |

---

### 🔵 Tier 3 — Should surface in targeted P2 or regression execution

| Defect | Priority | Status | Note |
|--------|----------|--------|------|
| **BCIN-7688** | Low | Open | "Set as template" checkbox disabled on new report save. The QA plan has "Save Dialog Completeness — DE331555 analog" explicitly as a Regression scenario — this IS that analog. |
| **BCIN-7693** | Low | Open | Session timeout → unknown error. Covered by `Error Handling / Recovery — Session expiry during authoring shows session expiry dialog` (P2). |
| **BCIN-7708** | Lowest | Open | Confirm-close popup not shown when prompt editor is open. Covered by `Close and Cancel Behaviors — Closing editor with unsaved changes prompts confirm dialog` (P1). The prompt-editor-open variant is an edge case, but the base scenario covers the same code path. |
| **BCIN-7709** | Lowest | Open | Multiple X clicks → multiple popups. Same scenario as above; multi-click edge case. |
| **BCIN-7733** | High | **Open** | Double-click to edit → wrong title. Window title setting via `setWindowTitle` SDK call is directly referenced in design. While no QA scenario specifically tests edit-mode window titles, this flows from the E2E edit scenario. |
| **BCIN-7730** | Low | **Open** | Template + prompt pause mode → won't run. Prompt pause mode execution of a template-sourced report. The template scenario exists; prompt pause mode is tested in BCIN-7677 area. This combination is an uncovered intersection — see Part 2. |

---

## Part 2 — What Needs Enhancement in the QA Plan

The following gaps are identified by comparing actual defects found against the scenario coverage in `qa_plan_phase6_r1.md`.

---

### Gap 1 — Save-Override with Existing Report Name (CRITICAL GAP)

**Missing scenario:** The QA plan tests Save and Save-As as separate happy paths, but has no explicit scenario for **overwriting an existing report** (Save → same name → confirm overwrite → success).

**Why this matters:** BCIN-7669 (open, High, no PR) is exactly this — a JS crash when the user tries to save over an existing report. BCIN-7724 (400 error on replace) is the same flow. Two High defects hit this specific path; neither is clearly called out in the plan.

**Enhancement needed:**
```
- Save overrides an existing report without error [P1]
    - Open an existing report in the embedded editor, make a change
    - Click File → Save
    - When prompted to overwrite, confirm the overwrite
    - The report is saved without error
    - No JS error or 400 HTTP error occurs
    - The updated report is visible in the folder immediately
```

---

### Gap 2 — Report Builder Prompt Element Loading (HIGH GAP)

**Missing scenario:** No scenario covers **Report Builder double-click interaction to load attribute or metric elements** in a prompt.

**Why this matters:** BCIN-7727 (open, High, no PR) — fails to load elements in prompt after double-clicking in Report Builder. This is a core authoring action for any report with element selection prompts. The plan has prompt-handling scenarios only through save-side behavior (do-not-prompt, pause mode) but not through the authoring-side prompt setup.

**Enhancement needed:**
```
- Report Builder loads attribute/metric elements correctly after double-click [P1]
    - Open a report with an attribute or metric element prompt in the embedded editor
    - Enter Report Builder view
    - Double-click an attribute or metric to load its elements
    - Elements load and are available for selection
    - No error or empty element list appears
```

---

### Gap 3 — Template-Sourced Report Creation + Save (HIGH GAP)

**Missing scenario:** "New Report from Template" is not an explicit scenario in the plan. Only blank report and dataset-scoped creation are covered.

**Why this matters:** BCIN-7667 (High, Done) — creating a report from a template, hitting Save, caused the save to overwrite the source template instead of creating a new report. This is a **distinct create path** that the plan does not cover as a scenario unit. The coverage ledger lists "New Report" entry points but does not enumerate the template-based path separately.

**Enhancement needed:**
```
- New Report created from a template saves as a new report (does not overwrite template) [P1]
    - Connect Workstation to a qualifying server
    - Click File → New Report and choose a template (e.g. Product sales template)
    - Author or accept the pre-filled report
    - Click File → Save
    - The save creates a new report in the target folder
    - The source template is NOT overwritten or modified
    - The new report appears in the target folder immediately
```

---

### Gap 4 — Prompt Pause Mode + Template Combination (MEDIUM GAP)

**Missing scenario:** The combination of **template-sourced report + prompt with pause mode** is not tested as a joint scenario.

**Why this matters:** BCIN-7730 (Low, Open) — creating a report by template when the report has a prompt configured as "pause mode" causes the report not to run after creation. Neither the template scenario nor the pause-mode scenario alone would expose this; it's the combination.

**Enhancement needed:**
```
- Template report with pause-mode prompt executes correctly after creation [P2]
    - Open a report template that contains a prompt configured with pause mode
    - Create a new report using this template
    - Execute the report
    - The report runs and respects the pause mode prompt behavior
    - The report does not hang, fail, or show an error state
```

---

### Gap 5 — Window Title Correctness for All Creation Modes (MEDIUM GAP)

**Missing scenario:** The QA plan has no scenario validating the **window title** set by `setWindowTitle` SDK call across different creation/edit modes.

**Why this matters:** Three defects hit window title: BCIN-7674 ("newReportWithApplication" on blank create), BCIN-7719 ("New Intelligent Cube Report" title wrong), BCIN-7733 (wrong title on edit). The SDK `setWindowTitle` is a documented integration point. The plan mentions the editor opens but never checks what title appears.

**Enhancement needed:**
```
- Window title is correct for each creation and edit mode [P2]
    - For blank new report: title is "New Report" (or locale equivalent), NOT "newReportWithApplication"
    - For new Intelligent Cube Report: title is "New Intelligent Cube Report" (or locale equivalent)
    - For edit existing report: title shows the actual report name
    - For template-sourced new report: title is the new report name, not the template name
```

---

### Gap 6 — Save Dialog Completeness for Newly Created Reports (MEDIUM GAP — DE331555 Analog)

**Present but underpowered:** The plan has "Save Dialog Completeness — User comments dialog shows all expected fields when saving a new report (DE331555 analog)" as a P1 Regression scenario. However, the observable outcome only checks for "Certify" and "Set as template" checkboxes.

**Why this matters:** BCIN-7688 (Low, Open) — "Set as template" **checkbox is disabled** (not missing, but non-interactive) when saving a newly created report. The existing scenario checks for presence; it does not check that the checkbox is **enabled and interactive**.

**Enhancement needed:** Extend the existing scenario to explicitly state:
```
- All expected dialog fields are present AND interactive (not disabled/greyed out)
    - The "Set as template" checkbox is enabled when saving a newly created report
    - The "Certify" checkbox is enabled (if applicable to user privilege)
```

---

### Gap 7 — i18n: Convert to Intelligent Cube / Datamart Dialog Buttons (MEDIUM GAP)

**Missing scenario:** The i18n section covers File menu labels, FORMAT/VIEW hierarchy, and Workstation native save/save-as dialogs. It does **not** cover the **Library-style Convert to Cube / Convert to Datamart confirmation dialog** in non-English locales.

**Why this matters:** BCIN-7720 (Low, Open), BCIN-7721 (Low, Open), BCIN-7722 (Low, Open) — all three i18n defects are in the convert-to-IC dialogs and new report window titles. The QA plan's i18n coverage stops at save/template dialogs and menus.

**Enhancement needed:**
```
- Convert to Intelligent Cube dialog Confirm/Cancel buttons render correctly in active locale [P2]
    - Switch to a non-English locale (e.g., Simplified Chinese)
    - Initiate Convert to Intelligent Cube from the embedded editor
    - The Library-style confirm dialog appears
    - Confirm/Cancel button labels appear in the active locale (not English fallback)
    - The new Intelligent Cube Report window title appears in the active locale
```

---

### Gap 8 — Session Timeout: Redirect vs. Unknown Error (LOW-MEDIUM GAP)

**Present but outcome is weak:** The plan states "The session expiry error dialog appears via the Workstation error handler." The actual failure (BCIN-7693) is that the dialog shows an **unknown error** and does **not redirect to the login page**.

**Enhancement needed:** Sharpen the acceptance criteria:
```
- Session expiry during authoring shows a meaningful error and offers a path to re-login [P2]
    - The session expiry dialog message is human-readable (not "unknown error")
    - The user is offered an action to re-authenticate (e.g., redirect to login page or re-login button)
    - The dialog does not trap the user with no recovery path
```

---

### Gap 9 — Confirm-to-Close Dialog When Prompt Editor is Open (LOW GAP)

**Missing variant:** The close-with-unsaved-changes scenario tests closing the main editor. It does not test closing when a **prompt editor panel is simultaneously open**.

**Why this matters:** BCIN-7708 (Lowest, Open) — the confirm-to-close popup is not shown when the prompt editor is open. This is a specific state that the base scenario doesn't exercise.

**Enhancement needed:**
```
- Closing editor while prompt editor is open triggers confirm dialog correctly [P2]
    - Open a report with prompts in the embedded editor
    - Open the prompt editor panel
    - Without closing the prompt editor, click the Close button for the main editor
    - The confirm-to-close dialog appears
    - The dialog is not suppressed by the presence of the open prompt editor
```

---

### Gap 10 — Double-Click to Edit: Entry Point Not Tested for Title Correctness (LOW GAP)

**The edit scenario tests that the report opens** but not that **the Workstation editor window title reflects the correct report name** when entering via double-click.

**Why this matters:** BCIN-7733 (High, Open) — double-clicking to edit a report results in an incorrect/stale title. The edit scenario checks that "The embedded Library report editor opens with the report loaded" but says nothing about the title.

This is already partially captured in Gap 5 (Window Title Correctness). Add the specific double-click entry point to that scenario.

---

## Summary Table

| Gap # | Area | Severity | Defects Exposed | QA Plan Status |
|-------|------|----------|----------------|----------------|
| Gap 1 | Save-override with existing report | 🔴 Critical | BCIN-7669, BCIN-7724 | Missing scenario |
| Gap 2 | Report Builder prompt element loading | 🔴 Critical | BCIN-7727 | Missing scenario |
| Gap 3 | Template-sourced report creation + save | 🔴 High | BCIN-7667 | Missing scenario |
| Gap 4 | Template + prompt pause mode combination | 🟡 Medium | BCIN-7730 | Missing combination scenario |
| Gap 5 | Window title correctness across modes | 🟡 Medium | BCIN-7674, BCIN-7719, BCIN-7733 | Not tested in any scenario |
| Gap 6 | Save dialog field interactivity (not just presence) | 🟡 Medium | BCIN-7688 | Existing scenario too shallow |
| Gap 7 | i18n: Convert-to-IC dialog + window titles | 🟡 Medium | BCIN-7720, BCIN-7721, BCIN-7722 | i18n section missing this dialog |
| Gap 8 | Session timeout: error quality + re-login path | 🟢 Low-Medium | BCIN-7693 | Outcome criteria too weak |
| Gap 9 | Close confirmation when prompt editor is open | 🟢 Low | BCIN-7708 | Missing state variant |
| Gap 10 | Double-click edit: window title | 🟢 Low | BCIN-7733 | Subsumes into Gap 5 |

---

## Self-Testing Accountability Summary

Of the 26 defects:

- **16 defects** (all 10 Tier 1 + 6 Tier 2) should have been caught by any developer running the P1 QA scenarios as a self-test checklist before hand-off. They represent basic first-run observable failures with no special setup.
- **6 defects** (Tier 3) would reasonably surface in a complete P2 pass or targeted regression.
- **4 defects** (BCIN-7720/21/22/30) are in gaps the QA plan itself does not cover — i18n dialog variants and the template+pause combination.

**Root cause pattern:** The self-testing bar was not met. BCIN-7667, BCIN-7669, BCIN-7675, BCIN-7677, BCIN-7685, BCIN-7687 are all first-run failures on P1 scenarios that require only a single valid execution to reproduce. These are the kind of defects that a developer running "smoke test before PR" would find within 30 minutes.
