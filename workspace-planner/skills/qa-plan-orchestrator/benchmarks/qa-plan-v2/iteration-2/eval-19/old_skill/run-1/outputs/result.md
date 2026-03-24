# Benchmark Artifact — Phase 4a Coverage Check

**Benchmark case:** VIZ-P4A-HEATMAP-HIGHLIGHT-001  
**Primary feature:** BCVE-6797  
**Feature family / knowledge pack:** visualization  
**Primary phase under test:** **phase4a**  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  

## What Phase 4a Must Demonstrate (per contract)
Phase 4a output must be a **subcategory-only** QA draft (no canonical top-layer grouping), with:
- central topic
- subcategory
- scenarios
- atomic action chains
- observable verification leaves

Additionally, for this benchmark focus, the Phase 4a scenario set must **explicitly cover heatmap highlighting effect scenarios** across:
- **Activation** (how highlight is triggered)
- **Persistence** (how long highlight remains / what interactions keep it)
- **Reset** (how highlight clears)

## Evidence Available In This Benchmark Bundle
The provided fixture evidence for BCVE-6797 includes:
- BCVE-6797 Jira issue raw JSON (truncated)
- customer-scope export
- linked-issues summary

From linked-issues summary, there is a directly relevant linked feature:
- **BCDA-8396 — “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap”**

## Phase 4a Alignment Assessment (Blind, Pre-Defect)
### Can we verify the Phase 4a deliverable exists and aligns?
**No.** The benchmark evidence does **not** include any Phase 4a runtime artifacts (e.g., `drafts/qa_plan_phase4a_r1.md`) nor the Phase 4a spawn manifest output (`phase4a_spawn_manifest.json`).

Because Phase 4a is the primary checkpoint under test, the key artifact to assess—`drafts/qa_plan_phase4a_r<round>.md`—is not present in the evidence.

### Can we verify the case focus is explicitly covered?
**No.** Although the fixture indicates heatmap highlight optimization is in scope via linked issue **BCDA-8396**, there is **no Phase 4a draft** to confirm explicit scenario coverage for:
- highlight activation
- highlight persistence
- highlight reset behavior

## Benchmark Verdict (Phase Contract — Advisory)
**Not demonstrable from provided evidence (blocked by missing Phase 4a output artifact).**

- **[phase_contract][advisory] Focus explicitly covered (activation/persistence/reset):** **Cannot verify** (no Phase 4a draft provided)
- **[phase_contract][advisory] Output aligns with phase4a:** **Cannot verify** (no `qa_plan_phase4a` draft present)

## What Would Be Required to Pass This Benchmark
To demonstrate compliance in Phase 4a, the evidence bundle would need to include the Phase 4a draft artifact (at minimum):
- `drafts/qa_plan_phase4a_r1.md`

And that draft would need a **Heatmap (or equivalent visualization subcategory)** section containing scenarios explicitly covering:
- **Activation**: e.g., tap cell / tap legend entry / select a range (as applicable)
- **Persistence**: e.g., highlight remains when scrolling, switching tabs, or after transient UI actions (as applicable)
- **Reset**: e.g., tap blank area, clear selection action, navigation away/back, change filters, etc.

(Exact mechanics must be evidence-backed, but the benchmark requirement is that these three behavior buckets are explicitly represented.)