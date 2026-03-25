# Benchmark evaluation — VIZ-P1-CONTEXT-INTAKE-001 (Phase 1 contract)

Feature: **BCED-4860**  
Feature family: **visualization**  
Primary phase under test: **phase1 (context intake / spawn planning)**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**  
Focus: **context intake preserves donut-label assumptions for label visibility, density limits, and overlap-sensitive presentation**

## What Phase 1 is contractually responsible for (per snapshot)
Phase 1 is limited to:
- Generating **one spawn request per requested source family**, plus support-only Jira digestion requests if supporting issues are provided.
- Producing: **`phase1_spawn_manifest.json`**.
- Post-step validation (`phase1.sh --post`) ensures spawn policy, evidence completeness, support summaries/relation map, and non-defect routing.

Phase 1 does **not** author test coverage content/assumptions itself; it ensures the right evidence-collection tasks will be spawned so later phases can preserve/encode those assumptions.

## Benchmark expectation coverage check (advisory)
### Expectation A
**“Case focus is explicitly covered: context intake preserves donut-label assumptions for label visibility, density limits, and overlap-sensitive presentation.”**

**Status: NOT DEMONSTRATED with provided evidence (blocker: missing phase1 outputs).**

Rationale using only provided evidence:
- The only feature evidence provided is the Jira export bundle for BCED-4860 and adjacency metadata.
- There is **no provided `phase1_spawn_manifest.json`** (nor any Phase 1 script stdout) showing that context intake would:
  - route to evidence sources that define donut chart data label behavior, or
  - explicitly instruct evidence gatherers to capture label-visibility rules, density limits, and overlap resolution.
- The BCED-4860 Jira issue export in the fixture is largely metadata and does **not** include acceptance criteria or detailed functional requirements in the shown excerpt (the `description` field is `null` in the snippet), so the donut-label assumptions cannot be reconstructed from the fixture alone.

What can be inferred (insufficient for the benchmark):
- The summary indicates scope: **“Support data label for each slice in Donut chart.”** (BCED-4860) and parent **“[Auto Dash Requirement] Support data label for each slice in Donut chart.”** (BCED-4814). This suggests label behavior matters, but does not provide the required “assumptions” (visibility, density, overlap handling) nor show Phase 1 preserved them.

### Expectation B
**“Output aligns with primary phase phase1.”**

**Status: NOT DEMONSTRATED with provided evidence (blocker: missing phase1 artifact).**

Rationale:
- Phase 1 alignment is judged via the existence/shape/intent of **`phase1_spawn_manifest.json`** and its Phase 1 constraints (source-family routing, support-only policy, etc.).
- No Phase 1 artifacts are included in the benchmark evidence, so we cannot verify alignment.

## Conclusion (advisory)
With the evidence provided, this benchmark case **cannot be passed** because the key Phase 1 deliverable (**spawn manifest**) and/or Phase 1 validation outputs are not available to verify that context intake would preserve donut-label assumptions for label visibility, density limits, and overlap-sensitive presentation.

If `phase1_spawn_manifest.json` were available, the minimal evidence to satisfy this benchmark would be:
- At least one spawn request that collects authoritative donut-chart label behavior requirements (e.g., Jira/Confluence/GitHub design/spec source family as applicable).
- Task text or routing that explicitly calls out capturing:
  - label visibility rules (when labels show/hide)
  - density/maximum label count constraints
  - overlap resolution strategy (hide, truncate, leader lines, collision avoidance)