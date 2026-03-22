# Phase 4a — Scenario Drafting (BCVE-6678, Export family)

## Scope / intent (phase4a)
Draft export scenarios for **dashboard-level Google Sheets export** that clearly distinguish:
1) the **export paths** a user can take from a dashboard,
2) the **option combinations** available/selected during export, and
3) the **visible completion outcomes** presented to the user.

Priority: **Advisory**  
Evidence mode: **blind_pre_defect** (customer issues only)  
Note: No customer-issue evidence was provided in the fixture bundle, so scenarios below are drafted from the benchmark prompt constraints only.

---

## Scenario set: Dashboard → Google Sheets export

### Scenario 4A-1: Dashboard-level export to Google Sheets via primary “Export” action
**Goal:** Validate the main dashboard export path to Google Sheets produces a visible “completed” outcome.

- **Entry point / Path**
  - From a **dashboard** page, user triggers export via the primary **Export** control (e.g., toolbar/menu export entry).
- **Options / Combinations**
  - Format target: **Google Sheets**
  - If an “export scope” option exists: default scope (no changes)
  - If an “include/exclude” option exists: defaults (no changes)
- **Expected visible completion outcomes**
  - UI indicates export completion (e.g., success toast/banner/modal state) and/or confirms the Google Sheet was created/openable.
  - User can see a clear affordance to open/access the generated Google Sheet (link/button) or a message that it was created.

---

### Scenario 4A-2: Dashboard-level export to Google Sheets via overflow/menu path
**Goal:** Distinguish the alternate dashboard export path (overflow/ellipsis) and verify completion outcome is still visible.

- **Entry point / Path**
  - From a **dashboard**, user opens an overflow menu (e.g., “…” or “More”) and selects **Export → Google Sheets**.
- **Options / Combinations**
  - Format: **Google Sheets**
  - Keep all other options at default values.
- **Expected visible completion outcomes**
  - Export completion is surfaced in the UI (success confirmation).
  - Completion state is consistent with Scenario 4A-1 (no “silent” completion).

---

### Scenario 4A-3: Dashboard export with option combination: current view vs full dashboard
**Goal:** Ensure the scenario drafting covers **option combinations** and their effect on completion messaging.

- **Entry point / Path**
  - From a **dashboard**, user triggers Export (either primary Export button or menu path).
- **Options / Combinations**
  - Format: **Google Sheets**
  - Export scope option toggled:
    - Variant A: **Current view** (e.g., filters applied / current tab)
    - Variant B: **Full dashboard** (all tabs/tiles)
- **Expected visible completion outcomes**
  - For each variant, the user receives a completion signal.
  - The completion outcome indicates what was exported (at least enough to avoid ambiguity between current-view vs full-dashboard).

---

### Scenario 4A-4: Dashboard export with option combination: include filters / applied filters reflected
**Goal:** Cover common option combination around filters and verify user can tell export completed with the chosen scope.

- **Entry point / Path**
  - From a **dashboard**, initiate Export → Google Sheets.
- **Options / Combinations**
  - Format: **Google Sheets**
  - Option: **Include applied filters** (On) vs (Off) (if available)
- **Expected visible completion outcomes**
  - Completion is visible for both variants.
  - If the product surfaces export details, it should not contradict the selected option (no mismatch implied in confirmation).

---

### Scenario 4A-5: Dashboard export initiated from an individual tile/card context vs dashboard-level context
**Goal:** Distinguish **dashboard-level** Google Sheets export paths from tile/card-level export paths, focusing on completion outcome clarity.

- **Entry point / Path**
  - Variant A: From dashboard-level Export control (dashboard context)
  - Variant B: From a tile/card context menu within the dashboard (tile context)
- **Options / Combinations**
  - Format: **Google Sheets**
  - Keep other options default.
- **Expected visible completion outcomes**
  - Completion message makes it clear what was exported (dashboard vs tile), avoiding ambiguous “Export complete” without scope context.
  - The user can access the generated Google Sheet for both paths.

---

### Scenario 4A-6: Cancellation / interruption during Google Sheets export and completion outcome behavior
**Goal:** Ensure visible outcomes are well-defined when the export does not complete.

- **Entry point / Path**
  - Start Export → Google Sheets from a dashboard.
- **Options / Combinations**
  - Any (use defaults); focus is on interruption.
- **Expected visible completion outcomes**
  - If user cancels (or navigates away) before completion, UI does **not** show a false success completion.
  - If export continues in background, UI should indicate status appropriately (in-progress vs completed) and later show completion.

---

## Phase4a checkpoint mapping (contract alignment)
- **Distinguishes dashboard-level Google Sheets export paths:** Scenarios 4A-1, 4A-2, 4A-5
- **Covers option combinations:** Scenarios 4A-3, 4A-4 (and default handling in 4A-1/2)
- **Defines visible completion outcomes:** All scenarios explicitly specify success/clarity requirements; 4A-6 covers non-success/interrupted outcomes

---

## Evidence note (blind_pre_defect constraint)
No customer-issue evidence was provided in the listed fixtures, so this phase4a output is a **scenario draft baseline** derived solely from the benchmark prompt’s focus and constraints.