# VIZ-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-4860)

## Benchmark focus
Verify **Phase 1 (context intake)** preserves **donut chart data-label assumptions** needed downstream:
- **Label visibility** expectations (when labels should show/hide)
- **Density limits** (many slices / small slices)
- **Overlap-sensitive presentation** (collision/overlap handling)

## Evidence available (blind pre-defect)
From the provided fixture bundle:
- **BCED-4860** summary: **"[Dev] Support data label for each slice in Donut chart."**
- Parent feature **BCED-4814** summary: **"[Auto Dash Requirement] Support data label for each slice in Donut chart."**
- No description text was present in the raw issue export (description: `null`).
- No linked issues; no explicit customer signal.

## Phase 1 alignment (what Phase 1 must produce)
Per skill snapshot, **Phase 1 work/output is limited to generating a spawn manifest** to collect evidence per requested source family (plus support-only Jira digestion if provided):
- Required artifact: `phase1_spawn_manifest.json`
- Phase 1 `--post` validates spawn policy, evidence completeness, support relation map/summaries, and non-defect routing.

## Contract coverage vs. benchmark focus
### What is preserved by the provided context today
- The *high-level intent* is captured: donut chart slices need **data labels per slice**.

### What is *not* present in the provided context (gaps vs. benchmark focus)
The current evidence does **not** contain any explicit assumptions/requirements about:
- **Visibility rules** (e.g., always show vs. conditional show; thresholds)
- **Density limits** (max labels, behavior with many categories, minimum slice angle/area)
- **Overlap/collision handling** (hide, truncate, leader lines, smart repositioning, prioritization)

Because the issue description is `null` and there are no linked/supporting issues in the fixture, **these assumptions cannot be confirmed as “preserved” solely from the provided evidence**.

## Phase 1 advisory requirement to satisfy this benchmark
To satisfy “context intake preserves donut-label assumptions…”, **Phase 1 must route collection** that can capture the missing label behavior constraints. In Phase 1 terms, that means the spawn manifest must include **Jira evidence gathering** for BCED-4860 (and likely its parent BCED-4814) sufficient to extract:
- Acceptance criteria / design notes
- Any comments describing label collision/density behavior
- Any linked PR/spec references that describe donut label rendering constraints

## Benchmark verdict (Phase 1, advisory)
**Not demonstrably satisfied with the provided blind pre-defect evidence.**

Rationale: The only available context is the story/parent summaries. Those do not encode the benchmark’s required assumptions (visibility, density, overlap-sensitive behavior). Under the orchestrator contract, Phase 1 would need to generate evidence-collection spawns to preserve these assumptions, but **no Phase 1 spawn manifest or collected context artifacts were provided in this benchmark evidence**, so we cannot verify the benchmark focus is explicitly covered at context-intake time.