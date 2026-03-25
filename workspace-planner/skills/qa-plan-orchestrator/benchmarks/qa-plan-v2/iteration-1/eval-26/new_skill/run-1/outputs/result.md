# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check (BCIN-7231)

## Benchmark intent (phase1, advisory)
Verify that **Phase 1 context intake** (before any scenario drafting) preserves:
- **Banding requirements** (rows/columns/header-based application)
- **Style constraints** (ability to format banding colors)
- **Rendering assumptions** (Modern Grid in dashboards; readability enhancement)

This benchmark is **blind_pre_defect** and evaluates whether the orchestrator’s **Phase 1 contract/workflow** ensures these requirements are captured and routed into context evidence collection (via spawn manifest), rather than being lost or deferred to later drafting.

## Evidence-derived feature context that must be preserved (pre-scenarios)
From the provided Jira issue payload for **BCIN-7231**:
- Current limitation in Modern Grid:
  - Users can only enable **banding in rows**.
  - Users **cannot format the colors**.
  - Users **cannot enable banding in columns**.
  - Users **cannot apply the banding color by row/column header**.
- Product intent:
  - These banding functions are supported in **Report**.
  - Need to bring **all the banding functions** to **Modern Grid in dashboards**.
  - Banding is positioned as a readability enhancement for the grid.

Customer signal:
- Customer references exist (customer-scope export indicates explicit customer references in Jira custom fields), so Phase 1 intake should preserve that this feature has **customer signal present**.

## Phase 1 contract alignment (what Phase 1 is responsible for)
Based on the orchestrator contract (skill snapshot):
- Phase 1 work is to **generate a spawn request per requested source family** (plus support-only Jira digestion when provided).
- Phase 1 output is **`phase1_spawn_manifest.json`**.
- Phase 1 `--post` validates **spawn policy and evidence completeness**.

## Contract coverage assessment vs benchmark focus
### What is demonstrably satisfied by the provided evidence
- The orchestrator package explicitly defines that Phase 1 is **context/evidence intake planning** (manifest generation), which is the correct checkpoint for “preserving requirements before scenario drafting.”
- The feature evidence provided (BCIN-7231 Jira JSON) clearly contains the **banding + styling + header/row/column** requirement set, which are the benchmark’s required context elements.

### What cannot be demonstrated in this benchmark run (blocker)
The benchmark asks to “demonstrate whether the skill satisfies this benchmark case” specifically that context intake preserves these requirements **before scenario drafting**, which in this workflow is concretely expressed as:
- Phase 1 producing a **spawn manifest** that ensures Jira (and any other requested source families) are collected into `context/` so the requirements are retained for later phases.

However, the provided benchmark evidence does **not** include any Phase 1 runtime artifacts (no `phase1_spawn_manifest.json`, no `run.json`/`task.json`, no Phase 1 script stdout), so we cannot verify:
- Which **requested_source_families** were selected for BCIN-7231 in this run
- Whether Phase 1 actually generated a manifest that would collect/retain the banding/style/rendering requirements in `context/`
- Whether Phase 1 `--post` validation would pass/fail on evidence completeness

## Verdict (advisory)
**Inconclusive / Not provable from provided evidence.**

- The feature evidence itself contains the necessary banding/style/rendering assumptions that *should* be preserved.
- The orchestrator contract states Phase 1 is responsible for spawning evidence collection.
- But without the Phase 1 spawn manifest artifact (or equivalent Phase 1 outputs), this benchmark cannot confirm the system actually preserves these requirements through Phase 1 context intake in a concrete run.

## Minimum artifact(s) needed to make this benchmark provable
To conclusively satisfy this phase1 benchmark, the evidence bundle would need at least one of:
- `phase1_spawn_manifest.json` for BCIN-7231 (showing Jira source-family intake planned), and/or
- Phase 1 script output indicating manifest creation + `--post` validation success.

---

## Short execution summary
Checked the Phase 1 workflow contract in the provided skill snapshot and extracted the banding/style/rendering requirements from the BCIN-7231 Jira fixture. Determined that Phase 1 preservation cannot be verified because no Phase 1 runtime artifacts (e.g., `phase1_spawn_manifest.json`) are present in the benchmark evidence bundle.