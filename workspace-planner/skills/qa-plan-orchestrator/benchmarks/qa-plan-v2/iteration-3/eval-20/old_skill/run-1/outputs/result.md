# Phase 5b Checkpoint Enforcement Review — BCVE-6678 (Export) — Google Sheets dashboard export coverage

## Benchmark intent (checkpoint enforcement, advisory)
Ensure the Phase 5b shipment-checkpoint review explicitly covers the case focus:
- Google Sheets **dashboard export** coverage distinguishes:
  - **Supported formats**
  - **Entry points**
  - **Output expectations**

This benchmark is **blind pre-defect**: use only provided fixture evidence; do not infer missing product behavior.

---

## Evidence-based scope anchors (from fixture)
- Feature: **BCVE-6678**
- Labels: **Export**, **Library_and_Dashboards** (indicates dashboard/library context is in scope)
- Adjacent issues (parented):
  - **BCIN-7106** (Story): *"[Report] Application Level Default value for Google Sheets Export"*
  - **BCIN-7636** (Defect): *"Update some strings under application's report export setting dialog"*
  - **BCIN-7595** (Defect): *"[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"*

These anchors justify that QA coverage should include **Google Sheets export settings and export flows** and that **UI entry points/settings dialogs** exist and are relevant.

---

## Phase 5b checkpoint enforcement (advisory): what must be present in the QA plan
The QA plan (as reviewed at Phase 5b) should contain scenarios that *explicitly* distinguish the following for **Google Sheets dashboard export**:

### A) Supported formats
Scenarios must enumerate/export-UI validate the *supported* output type(s) for dashboard export to Google Sheets, and distinguish them from other export types.
- Coverage requirement (advisory):
  - Validate that **Google Sheets export** is available as a selectable option where expected.
  - Validate that non-Google-Sheets formats are not incorrectly represented as Google Sheets exports.

### B) Entry points
Scenarios must cover at least the identified UX surfaces implied by evidence:
- “**Application’s report export setting dialog**” (BCIN-7636)
- “**Application editor** → Report Export Settings header / scroll behavior” (BCIN-7595)
- “**Application level default value** for Google Sheets export” (BCIN-7106)

For checkpoint readiness, these should be treated as distinct entry points/flows rather than a single generic “export” scenario.

### C) Output expectations
Scenarios must define observable output expectations for a Google Sheets export.
Because the provided evidence does not specify exact file structure/behavior, expectations must remain **black-box and verifiable**, such as:
- Export completes successfully and produces a Google Sheets artifact in the expected destination (e.g., downloadable file or linked Sheets destination, depending on product behavior).
- Result is readable/openable and contains the exported dashboard content in some form.
- Errors are surfaced clearly when export cannot be completed.

---

## Phase 5b checkpoint mapping (rubric-aligned)
This is how the case focus should be represented in Phase 5b checkpoint outputs.

### Checkpoint 1 — Requirements Traceability (advisory)
- The plan should trace scenarios back to the evidence anchors:
  - App-level default for Google Sheets export (BCIN-7106)
  - Export setting dialog strings (BCIN-7636)
  - App editor export settings header/scroll behavior (BCIN-7595)

### Checkpoint 2 — Black-Box Behavior Validation (advisory)
- Scenarios explicitly validate:
  - User can initiate dashboard export to **Google Sheets** via each entry point
  - Export operation success/failure behavior is observable and asserted

### Checkpoint 3 — Integration Validation (advisory)
- Since this is a Google Workspace integration initiative parent (PRD-75: “Google Workspace (GWS) Integration” in the raw issue parent field), the plan should include integration-flavored checks such as:
  - Export target accessibility/permissions (as applicable)
  - Behavior when integration is unavailable

(Do not over-specify mechanics beyond evidence; keep checks framed as integration readiness.)

### Checkpoint 9 — Auditability (advisory)
- Scenario expectations should include evidence outputs usable for QA audit (e.g., capture export setting values, timestamps, identifiable export result).

### Checkpoint 15 — Final Release Gate (advisory)
- Release recommendation must confirm dashboard Google Sheets export coverage is present and distinguishable by format/entry point/output.

---

## Benchmark verdict (for this benchmark case)
**Blocker to demonstrating compliance:** The provided benchmark evidence does **not** include the Phase 5b required artifacts (checkpoint audit/delta, Phase 5b draft) or the Phase 5a draft that Phase 5b validates against.

Therefore, within this benchmark run (evidence-limited), we can only state the **expected Phase 5b-aligned checkpoint enforcement criteria** for BCVE-6678; we cannot verify whether the orchestrator output actually contains the required distinctions.

---

## Minimal acceptance criteria to satisfy this benchmark (what Phase 5b output must show)
To pass this checkpoint-enforcement benchmark, the Phase 5b outputs for BCVE-6678 should demonstrate:
1. **Checkpoint audit** explicitly calls out whether the plan distinguishes:
   - supported Google Sheets export format(s)
   - entry points (settings dialog, application editor header/scroll context, application-level default)
   - output expectations
2. **Checkpoint delta** either:
   - `accept` and states the above is already covered, or
   - `return phase5b` (or `return phase5a`) with explicit remediation items to add/clarify those distinctions.
3. The **Phase 5b draft** contains scenario nodes for Google Sheets dashboard export that are **not generic**, but explicitly separated by:
   - entry point
   - output assertion

---

# Execution summary (short)
- Generated a Phase 5b checkpoint-enforcement focused review for BCVE-6678 using only the provided fixture evidence.
- Mapped the benchmark’s Google Sheets dashboard export focus to Phase 5b rubric checkpoints and listed the concrete acceptance criteria Phase 5b artifacts must show.
- Verification of actual Phase 5b compliance is blocked because Phase 5b artifacts (checkpoint_audit/checkpoint_delta/phase5b draft) are not included in the evidence bundle.