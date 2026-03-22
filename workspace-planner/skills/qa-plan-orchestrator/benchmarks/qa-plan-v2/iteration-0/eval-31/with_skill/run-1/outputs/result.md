[FILE: ./outputs/result.md]

# EXPORT-P4A-SCENARIO-DRAFT-001 — Phase 4a Scenario Draft (BCVE-6678)

## Phase metadata (contract alignment)
- **Feature:** BCVE-6678  
- **Feature family / knowledge pack:** export  
- **Primary phase under test:** **phase4a (scenario drafting)**  
- **Evidence mode:** blind_pre_defect  
- **Priority:** advisory  
- **Benchmark profile:** global-cross-feature-v1  
- **Focus requirement:** scenario drafting **distinguishes dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes**.

---

## 4a. Scenario draft set (dashboard-level → Google Sheets)

### Scenario 4a-S1 — Dashboard-level export to Google Sheets via “Export” path (default options)
**Goal:** Validate the primary dashboard-level path to export into Google Sheets and confirm a visible completion outcome.

- **Preconditions**
  - User has access to a dashboard with export permission.
  - Dashboard contains at least one widget with data (enough to export).

- **Steps**
  1. Open the target dashboard.
  2. Locate the dashboard-level **Export** control (not a per-tile/per-widget menu).
  3. Choose **Google Sheets** as the export destination/format.
  4. Leave options at defaults (do not toggle optional settings).
  5. Start the export.

- **Option combination covered**
  - Destination: **Google Sheets**
  - Options: **defaults** (no explicit option toggles)

- **Expected visible completion outcomes**
  - A clear in-product completion signal appears (e.g., success toast, “Export started”, or “Export complete” messaging).
  - If the product opens/redirects to Google Sheets (or provides a link), the user sees an actionable outcome indicating where the export went.

---

### Scenario 4a-S2 — Dashboard-level export to Google Sheets via “Share/Send/Publish” path (default options)
**Goal:** Distinguish an alternate dashboard-level path (if present) that also yields a Google Sheets export, ensuring it is not conflated with the primary Export control.

- **Preconditions**
  - Same as 4a-S1.

- **Steps**
  1. Open the target dashboard.
  2. Use the dashboard-level **Share/Send/Publish** entry point (or equivalent non-“Export” menu) if available.
  3. Select the option that produces a **Google Sheets** output (or “Send to Google Sheets”).
  4. Leave options at defaults.
  5. Initiate the action.

- **Option combination covered**
  - Entry point: **Share/Send/Publish path** (distinct from Export menu/button)
  - Destination: **Google Sheets**
  - Options: **defaults**

- **Expected visible completion outcomes**
  - A clear completion signal is displayed.
  - The UI outcome (link, opened sheet, confirmation) is **visibly attributable to the Share/Send/Publish path** (to distinguish from the Export path).

---

### Scenario 4a-S3 — Dashboard-level export to Google Sheets with option toggles (format/content variations)
**Goal:** Cover option combinations that commonly exist on export dialogs (scope/content/format toggles) and verify completion outcomes remain visible and correct.

- **Preconditions**
  - Same as 4a-S1.
  - Export dialog for Google Sheets offers at least one configurable option (examples: “current view vs full data”, “include filters”, “include hidden”, “separate sheets per tab”, etc.).

- **Steps**
  1. Open the target dashboard.
  2. Start dashboard-level **Export → Google Sheets**.
  3. Modify **Option A** (e.g., include/exclude something, or choose a scope variant).
  4. Modify **Option B** (if present) to create a non-default combination.
  5. Start the export.

- **Option combinations covered**
  - Destination: Google Sheets
  - Options: **non-default** (at least two toggles or one toggle + one scope selector)

- **Expected visible completion outcomes**
  - Completion signal is displayed (success/started/completed).
  - The resulting Google Sheet (or link) reflects the chosen options in an observable way (e.g., extra tabs, included fields, or changed scope).

---

### Scenario 4a-S4 — Dashboard-level export to Google Sheets with a “cancel/close” before completion (negative completion outcome)
**Goal:** Verify visible outcomes when the export is not completed (user cancels or closes), ensuring the completion state is distinguishable from success.

- **Preconditions**
  - Same as 4a-S1.

- **Steps**
  1. Open dashboard.
  2. Begin **Export → Google Sheets**.
  3. Before starting the export, click **Cancel/Close** in the dialog (or back out).
     - *If cancellation is only possible after starting, start export then cancel from progress UI if available.*
  4. Observe UI state.

- **Option combinations covered**
  - Destination: Google Sheets
  - Action: **user-initiated abort** (cancel/close)

- **Expected visible completion outcomes**
  - A visible outcome indicates the export did **not** proceed (no success confirmation; optionally a cancellation message).
  - No Google Sheet is opened/linked as a “completed” export.

---

### Scenario 4a-S5 — Dashboard-level export to Google Sheets with an error outcome (auth/permission or integration failure)
**Goal:** Ensure a visible completion outcome exists for failure modes specific to Google Sheets export (integration/auth/permissions), distinct from a generic “export failed” without context.

- **Preconditions**
  - User is in a state likely to trigger an integration issue (e.g., not connected to Google, expired auth) **or** export is attempted with insufficient permissions.

- **Steps**
  1. Open dashboard.
  2. Start **Export → Google Sheets**.
  3. Proceed until the point where authorization/integration is required (if prompted).
  4. Intentionally fail the auth step (decline consent / use account without permission) **or** trigger the known permission limitation.
  5. Observe UI response.

- **Option combinations covered**
  - Destination: Google Sheets
  - Outcome: **error**

- **Expected visible completion outcomes**
  - A visible error outcome is shown to the user.
  - Error messaging is specific enough to identify it as a Google Sheets export failure (not a silent failure).
  - User sees next-step guidance (reconnect, permissions, retry) if the UI provides it.

---

## Coverage statement (focus requirement)
This phase 4a draft explicitly distinguishes:
- **Dashboard-level Google Sheets export paths:**  
  - Primary **Export → Google Sheets** path (4a-S1, 4a-S3, 4a-S4, 4a-S5)  
  - Alternate **Share/Send/Publish → Google Sheets** path (4a-S2)  
- **Option combinations:**  
  - Defaults (4a-S1, 4a-S2)  
  - Non-default multi-option variations (4a-S3)  
  - Abort/cancel (4a-S4)  
  - Error/auth/permission failure (4a-S5)  
- **Visible completion outcomes:**  
  - Success/started/completed (4a-S1–S3)  
  - Cancelled/not completed (4a-S4)  
  - Failure with Google Sheets-specific messaging (4a-S5)

---

[FILE: ./outputs/execution_notes.md]

## Evidence used
- **None provided in the prompt beyond fixture name**, and fixture bundle had **no local path**:
  - Fixture reference: **BCVE-6678-blind-pre-defect-bundle** (unavailable locally)

## Files produced
- `./outputs/result.md`
- `./outputs/execution_notes.md`

## Blockers / gaps
- Could not consult `./skill_snapshot/SKILL.md` or any companion references because **no repository file contents were provided in evidence**.
- Could not use customer issues (“all_customer_issues_only”) because **no customer-issue evidence items were provided**.
- As a result, scenarios are drafted at contract/feature-focus level without product-specific UI labels beyond the benchmark focus terms.


Execution summary:
- Produced a phase4a-aligned scenario draft for BCVE-6678 focusing on dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes. Evidence fixtures and SKILL.md were not accessible (no local paths/content), documented as blockers.