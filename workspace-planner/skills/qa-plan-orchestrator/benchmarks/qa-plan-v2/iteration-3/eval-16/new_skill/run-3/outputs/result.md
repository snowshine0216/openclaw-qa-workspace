# GRID-P4A-BANDING-001 — Phase4a contract check (BCIN-7231)

## Verdict (advisory)
**Cannot be demonstrated / Blocked by missing Phase 4a runtime artifacts.**

This benchmark case requires showing Phase **4a** alignment (subcategories-only draft output) for **modern-grid banding** scenarios. The provided evidence includes **skill workflow contracts** and **a single feature Jira snapshot**, but **does not include** any Phase 4a run outputs (e.g., `drafts/qa_plan_phase4a_r1.md`) or the Phase 4a prerequisites (`context/artifact_lookup_*.md`, `context/coverage_ledger_*.md/.json`). Therefore, we cannot verify that the orchestrator/phase4a writer produced an artifact that meets the Phase 4a contract or covers the case focus.

## What the benchmark expects to be evidenced in Phase 4a
Per `skill_snapshot/references/phase4a-contract.md`, Phase 4a must produce a **subcategory-only** QA draft with:
- Central topic
- Subcategory → scenario → atomic action chain → observable verification leaves
- **No canonical top-level categories** (e.g., Security/Compatibility/E2E/i18n)

And the case focus must be explicitly covered:
- **Modern grid banding scenarios** distinguishing:
  - styling variants
  - interactions
  - backward-compatible rendering outcomes

## Evidence we do have (feature intent)
From `fixture:BCIN-7231-blind-pre-defect-bundle/BCIN-7231.issue.raw.json` (Jira description excerpt):
- Current modern grid limitations:
  - can only enable banding in **rows**
  - cannot **format colors**
  - cannot enable banding in **columns**
  - cannot apply banding color by **row/column header**
- Goal:
  - “bring all the banding functions to Modern Grid in dashboards”

This is sufficient to define the Phase 4a scenario themes that *should* appear, but not sufficient to prove Phase 4a output compliance.

## Minimum artifact needed to satisfy this benchmark case
To demonstrate Phase 4a alignment and case-focus coverage, the evidence bundle would need to include at least:
- `drafts/qa_plan_phase4a_r1.md` for BCIN-7231 (or later round)
- plus Phase 4a required inputs referenced by the contract:
  - `context/artifact_lookup_BCIN-7231.md`
  - `context/coverage_ledger_BCIN-7231.md` (and `.json` if pack active)
  - (optional) knowledge pack artifacts if active

Without those, we cannot check:
- Whether the draft stays **subcategory-first** (no top-layer leakage)
- Whether scenarios are written with **atomic nested steps** and **observable verification leaves**
- Whether banding coverage includes **styling variants + interactions + backward-compat rendering outcomes**

## Blockers
1. **No Phase 4a draft artifact provided** (`drafts/qa_plan_phase4a_r<round>.md`).
2. **No Phase 4a prerequisite context artifacts provided** (`artifact_lookup`, `coverage_ledger`).
3. Evidence mode is **blind_pre_defect** and the fixture bundle only includes Jira snapshots; there is no run directory content to validate Phase 4a compliance.