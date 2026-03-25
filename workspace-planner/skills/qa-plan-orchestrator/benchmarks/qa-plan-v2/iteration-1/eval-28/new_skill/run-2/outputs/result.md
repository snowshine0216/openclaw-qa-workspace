# VIZ-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCED-4860)

## Scope
Benchmark case family: **phase contract**

Primary phase under test: **Phase 1 (context intake / spawn planning)**

Focus requirement (must be explicitly covered): **context intake preserves donut-label assumptions for label visibility, density limits, and overlap-sensitive presentation**.

Evidence mode: **blind_pre_defect** (do not infer defects; only verify that Phase 1 would intake/route context needed for later QA planning).

## Evidence available for Phase 1 context intake
From the provided fixture bundle:

- **BCED-4860** Jira issue raw export
  - Summary: **"[Dev] Support data label for each slice in Donut chart."**
  - Parent: **BCED-4814** — "[Auto Dash Requirement] Support data label for each slice in Donut chart."
- Customer scope export indicates **no explicit customer signal**.
- Parent feature summary export.

## Phase 1 contract alignment (what Phase 1 must do)
Per skill snapshot, Phase 1 is limited to:
- generating **phase1_spawn_manifest.json** with **one spawn request per requested source family** (plus any support-only Jira digestion requests when provided), and
- Phase 1 `--post` validating spawn policy and evidence completeness.

## Benchmark expectation coverage assessment (focus: donut labels visibility/density/overlap)
### What the evidence actually contains
The only feature-specific functional text available in the provided evidence is:
- "Support data label for each slice in Donut chart" (BCED-4860/BCED-4814).

The evidence bundle does **not** include any explicit mention of:
- label **visibility rules** (e.g., always-on vs conditional, minimum slice angle/size thresholds)
- **density limits** (e.g., max number of slices that can show labels before switching behavior)
- **overlap-sensitive presentation** (e.g., collision avoidance, leader lines, hiding labels when overlapping, prioritization)

### Phase 1 implication
To satisfy the benchmark focus at Phase 1, the context intake/spawn planning would need to ensure it captures or requests context that preserves those donut-label assumptions (typically via additional Jira description/AC, design spec, PRD, screenshots, or linked issues).

With the provided blind bundle evidence alone, we cannot confirm that Phase 1 would:
- recognize the missing label-visibility/density/overlap assumptions as required context to fetch, nor
- encode any spawn requests aimed at collecting those specifics.

## Verdict (Phase 1, advisory)
**Not demonstrated / insufficient evidence for the benchmark focus.**

Reason: In the provided Phase 1 intake evidence for BCED-4860, the donut-label focus areas (visibility, density limits, overlap behavior) are not present, and no Phase 1 spawn manifest artifact is provided to show that the orchestrator would seek/retain that context.

## Required remediation to meet this benchmark expectation (Phase 1)
Within Phase 1 (spawn planning), ensure context intake explicitly drives evidence collection for donut-label assumptions by:
- including Jira evidence capture that targets **acceptance criteria / requirements text** describing:
  - when labels are shown/hidden,
  - how many labels are supported,
  - what happens on overlap (hide, truncate, leader lines, prioritization, etc.), and
- if such details are not in the story, spawning additional source-family requests (still within allowed Phase 1 behavior) to pull parent/adjacent requirement context that defines these assumptions.

(Advisory: this is a Phase 1 planning requirement; no defect analysis is implied.)