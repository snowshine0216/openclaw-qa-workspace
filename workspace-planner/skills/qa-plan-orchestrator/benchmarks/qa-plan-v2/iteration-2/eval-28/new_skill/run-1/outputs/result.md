# VIZ-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

Feature: **BCED-4860**  
Feature family: **visualization**  
Primary phase under test: **Phase 1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**

## What Phase 1 must demonstrate for this benchmark
This benchmark’s Phase 1 expectation is that **context intake preserves donut-label assumptions** so downstream phases can plan QA coverage correctly—specifically assumptions about:

1. **Label visibility** (when labels should show/hide)
2. **Density limits** (how many slices/labels can be shown before suppression/abbreviation)
3. **Overlap-sensitive presentation** (collision avoidance; inside/outside placement; truncation; leader lines; etc.)

In the script-driven orchestrator model, Phase 1 evidence of this is typically expressed by:
- generating a **Phase 1 spawn manifest** that routes to the correct evidence sources to capture these assumptions, and/or
- ensuring the Phase 1 intake request content explicitly calls out these donut-label constraints as required context.

## Evidence available in this benchmark bundle (blind pre-defect)
From the provided fixture evidence:

- Jira story **BCED-4860** summary: **“[Dev] Support data label for each slice in Donut chart.”**
- Parent feature **BCED-4814** summary: **“[Auto Dash Requirement] Support data label for each slice in Donut chart.”**
- No customer signal present at export time.

## Assessment against the benchmark focus (Phase 1)
### Coverage of donut-label assumptions in intake context
- The available issue/parent summaries establish the *topic* (“data label for each slice in Donut chart”).
- However, within the evidence provided, there is **no explicit captured context** for:
  - label visibility rules (e.g., minimum slice size, inner/outer radius constraints, user toggles)
  - density limits (e.g., maximum number of slices that will show labels, aggregation/“Other”, sampling)
  - overlap/collision behavior (hide, reposition, truncate, leader lines)

Because this benchmark is specifically about **preserving those assumptions during context intake**, merely having the story summary is **not sufficient evidence** that the Phase 1 orchestrator intake preserves these constraints.

### Phase alignment
- This benchmark requires Phase 1 alignment. Phase 1’s contractual artifact is **`phase1_spawn_manifest.json`** (plus spawned evidence later saved under `context/`).
- The provided evidence bundle does **not** include:
  - `phase1_spawn_manifest.json`, or
  - any Phase 1 subagent task text showing that the manifest/intake explicitly targets donut-label visibility/density/overlap constraints.

## Verdict (advisory)
**Not demonstrated with provided evidence.**

Reason: The benchmark focus (donut-label visibility/density/overlap assumptions preserved at intake) requires Phase 1 manifest/task evidence or equivalent Phase 1 intake artifact content. The fixture evidence provided only contains Jira issue metadata and does not show Phase 1 spawn requests or intake preservation of the specific donut-label assumptions.

## What would be needed to pass this Phase 1 benchmark (for this feature)
Within Phase 1 artifacts/evidence, we would need to see at least one of the following (ideally both):

1. **Phase 1 spawn manifest request(s)** that explicitly fetch or summarize requirements relevant to donut label behavior, such as:
   - Jira description/comments/ACs that mention label collision/visibility limits
   - linked design/spec (if any) that defines overlap handling, truncation, leader lines, label placement
2. **Phase 1 task text** (in the spawn manifest) that explicitly instructs the evidence-gathering subagent to extract and preserve assumptions about:
   - when labels are shown/hidden
   - what happens under high slice counts
   - how overlap is resolved

Without those, downstream phases could easily miss the benchmark’s required donut-label constraints.

---

## Short execution summary
Only the provided snapshot + fixture JSON evidence was used. The evidence does not include Phase 1 outputs (e.g., `phase1_spawn_manifest.json`) or any explicit intake capture of donut label visibility/density/overlap assumptions. Therefore, Phase 1 benchmark satisfaction cannot be demonstrated from this bundle.