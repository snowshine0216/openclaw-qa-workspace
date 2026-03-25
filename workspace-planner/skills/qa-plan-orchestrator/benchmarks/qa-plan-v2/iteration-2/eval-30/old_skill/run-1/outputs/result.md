# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Phase-Contract Check (Advisory)

## Benchmark focus
Context intake (before any scenario drafting) must preserve:
1) **Google Sheets export entry points**
2) **Scope boundaries**
3) **Format constraints**

Primary benchmark feature: **BCVE-6678**
Feature family / knowledge pack: **export**
Evidence mode: **blind_pre_defect**
Primary phase under test: **phase1**

## What Phase 1 is required to do (per skill snapshot)
Phase 1 contract is **spawn-only**:
- Generate **one spawn request per requested source family**, plus support-only Jira digestion spawns if supporting issues are provided.
- Output: `phase1_spawn_manifest.json`
- `--post` then validates spawn policy & evidence completeness.

Therefore, for this benchmark, the “pass” condition is whether Phase 1 intake would **carry forward** the critical context items (entry points, boundaries, constraints) by ensuring the right source-family evidence is requested/collected (via spawns), *not* by drafting scenarios.

## Context items that must be preserved for later phases (intake checklist)

### A) Google Sheets export entry points (must be captured as evidence targets)
From the provided fixture evidence, the feature is in the **Export** domain (label: `Export`) and is tied to Google Sheets export behavior via adjacent work.

**Entry-point candidates implied by evidence that Phase 1 must ensure are investigated/collected (via source-family spawns):**
- **Application-level Report Export Settings dialog** (implied by adjacent defects about “application’s report export setting dialog” and header behavior)
- **Report/Application editor export settings area** (implied by adjacent defect “[Application editor] Refine UI… Report Export Settings header…”) 
- **Default values for Google Sheets export (application level)** (explicit in adjacent story summary)

These are not “confirmed UI locations” from the feature description (not available in this blind bundle), but they are the **minimum preserved entry-point hypotheses** that Phase 1 should keep intact by routing evidence collection to Jira/source artifacts that describe the UI/UX and defaults.

### B) Scope boundaries (must be explicitly fenced before drafting)
From fixture evidence:
- **In-scope theme:** Google Sheets export defaults and export settings UI strings/header behavior (adjacent issues)
- **Out-of-scope not evidenced:** other export formats (PDF/PPT/Excel/CSV), unrelated Google Workspace integrations, customer/support-driven constraints (customer signal is absent)

Scope boundaries that intake must preserve:
- Focus on **Google Sheets export** (not generic export), and specifically **application-level defaults** / **export settings UI**.
- No customer/support scope is indicated: `customer_signal_present: false` and `support_signal_issue_keys: []`.

### C) Format constraints (constraints on the QA plan output are *not* a Phase 1 deliverable, but must be preserved as requirements for later phases)
Skill snapshot mandates:
- Final/draft QA plans must be **valid XMindMark**
- No `Setup:` sections
- No legacy `Action:` / `Expected:` labels
- Atomic nested action steps and observable expected leaves

Phase 1 should not draft, but must not lose these constraints; they are global constraints from the orchestrator contract.

## Evidence available in this benchmark bundle (blind pre-defect)
Phase 1 intake has access (in this benchmark) to:
- **BCVE-6678 issue raw JSON** (truncated in bundle)
- **Customer scope export**: confirms **no customer signal**
- **Adjacent issues summary**: 3 parented issues that strongly shape entry points/scope

## Advisory verdict: Does Phase 1 context-intake (as specified) preserve the required context?

### What can be confirmed from evidence
- **Export family** is clearly indicated by the feature label `Export`.
- Google Sheets export is **strongly implicated** by adjacent story: `BCIN-7106` “Application Level Default value for Google Sheets Export”.
- UI entry points around **Report Export Settings dialog/header/strings** are implicated by adjacent defects `BCIN-7636` and `BCIN-7595`.
- Customer/support scope should **not** be pulled in as mandatory context: both exports indicate **no customer/support signal**.

### Phase 1 contract alignment check (advisory)
Because Phase 1 must only produce a spawn manifest, the benchmark is satisfied **only if** the Phase 1 spawn plan would:
- Include **Jira** as a requested source family (to pull BCVE-6678 + the adjacent issues and/or linked requirements)
- Avoid inventing scope or constraints beyond what Jira/context exports provide
- Not require support-only digestion spawns (none are provided in fixture)

### Blocker to a definitive pass/fail
This benchmark run does **not** include the actual `phase1_spawn_manifest.json` output or the list of `requested_source_families` from `task.json`.
Without the manifest, we cannot verify that Phase 1 actually:
- Routed to the correct source family (Jira)
- Preserved the entry-point hypotheses by collecting evidence for export-settings UI and Google Sheets default settings

**Result (advisory):** *Insufficient observable Phase 1 artifact to confirm compliance.*

## What Phase 1 output would need to show to pass (acceptance criteria for this benchmark)
To demonstrate that context intake preserved entry points, boundaries, and format constraints *before drafting*, Phase 1 should produce a `phase1_spawn_manifest.json` that (at minimum):
- Spawns a **Jira evidence collection/digestion** request for **BCVE-6678**.
- Ensures Jira context includes the **adjacent/parented issues** set (or explicit follow-up Jira fetches) for:
  - `BCIN-7106` (Google Sheets export default value)
  - `BCIN-7636` (strings under report export settings dialog)
  - `BCIN-7595` (header behavior in report export settings)
- Does **not** spawn support-only Jira digestion (since no supporting_issue_keys are provided and support signals are empty).
- Leaves QA plan format constraints to later phases (no drafting in Phase 1), but does not contradict the global XMindMark constraints.

---

# Short execution summary
- Evaluated Phase 1 contract expectations from the skill snapshot and compared them to the provided blind-pre-defect fixture evidence for BCVE-6678.
- Identified the minimum entry points and scope boundaries implied by adjacent issues (Google Sheets export defaults; report export settings dialog/header/strings).
- Could not verify Phase 1 compliance because the required Phase 1 artifact (`phase1_spawn_manifest.json`) and requested source families were not included in the benchmark evidence bundle.