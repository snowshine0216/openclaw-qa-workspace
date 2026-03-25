# VIZ-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

## Benchmark focus (must be preserved by Phase 1 context intake)
**Context intake preserves donut-label assumptions for:**
- **Label visibility** (labels should exist/be attempted per slice)
- **Density limits** (many slices → labels may need limiting/selection)
- **Overlap-sensitive presentation** (avoid collisions/overlaps; layout may adjust)

## What Phase 1 is expected to do (per orchestrator contract)
From the provided skill snapshot, **Phase 1** is constrained to:
- Generate **one spawn request per requested source family** (plus support-only Jira digestion when supporting issues exist).
- Output **`phase1_spawn_manifest.json`**.
- In `--post`, validate spawn policy, evidence completeness, support relation map/summaries, and **non-defect routing**.

Phase 1 **does not** draft test scenarios or make visualization-domain assumptions inline; it only routes evidence collection via spawned tasks.

## Evidence available in this benchmark bundle (blind pre-defect)
Only the following feature context evidence is provided:
- Jira raw issue: **BCED-4860** summary: **"[Dev] Support data label for each slice in Donut chart."**
- Parent feature summary: **BCED-4814**: **"[Auto Dash Requirement] Support data label for each slice in Donut chart."**
- Customer scope export indicates **no explicit customer signal**.

## Phase 1 context-intake coverage vs. benchmark focus
### What is explicitly present in the provided context
- The feature intent clearly includes **per-slice data labels** for **donut chart**.

### What is *not* present in the provided context (but required by this benchmark focus)
The provided evidence does **not** include explicit requirements/assumptions for:
- **Label visibility rules** (when labels show/hide, thresholds, settings, interactions)
- **Density limits** (max labels, prioritization, truncation, “show top N”, etc.)
- **Overlap/collision handling** (leader lines, repositioning, hiding, anti-overlap algorithms)

## Determination (Phase 1 contract satisfaction for this benchmark)
**Not demonstrated / Advisory gap.**

Given the phase model in the snapshot, Phase 1 can only satisfy this benchmark if its spawned context-intake requests are designed to **capture and preserve** the above donut-label assumptions (visibility, density limits, overlap-sensitive presentation). In this benchmark run, **no Phase 1 spawn manifest or spawned evidence outputs are provided**, and the only available Jira text is the high-level per-slice label request.

Therefore, using only the provided evidence, we **cannot verify** that Phase 1 context intake preserves the donut-label assumptions required by the benchmark focus.

## What would need to be present to pass this Phase 1 benchmark (artifact-level expectation)
To demonstrate Phase 1 meets the benchmark focus, the Phase 1 output set would need to include (at minimum):
- A **`phase1_spawn_manifest.json`** that routes evidence collection to sources likely to contain donut label behavior specs (e.g., Jira description/AC, linked design docs/Confluence, design specs, prior behavior references), explicitly targeting:
  - label visibility behavior
  - density/too-many-slices behavior
  - overlap/collision behavior
- Resulting saved context artifacts under **`context/`** (produced by those spawns) that record those assumptions as evidence for later phases.

---

# Execution summary
- Primary phase checked: **Phase 1** (spawn planning / context intake routing)
- Case focus checked: **donut per-slice labels → visibility, density limits, overlap-sensitive presentation**
- Outcome: **Cannot confirm / advisory gap** because Phase 1 artifacts (spawn manifest + collected context outputs) are not included in the provided evidence bundle; Jira summaries alone do not encode the required assumptions.