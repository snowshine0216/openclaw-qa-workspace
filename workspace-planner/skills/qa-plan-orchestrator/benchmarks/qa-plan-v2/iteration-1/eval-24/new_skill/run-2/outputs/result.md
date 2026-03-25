# NE-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check (BCED-1719)

## Benchmark scope
- **Feature:** BCED-1719
- **Feature family / knowledge pack:** native-embedding
- **Primary phase under test:** **Phase 1**
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory
- **Case focus:** ensure **context intake** preserves:
  1) **component-stack constraints**
  2) **embedding lifecycle assumptions**
  3) **integration-sensitive customer expectations**

## What Phase 1 must do (per orchestrator contract)
Phase 1 is a **spawn-manifest generation** checkpoint.
- Generates **one spawn request per requested source family** (and supporting Jira digestion requests if provided).
- Writes: `phase1_spawn_manifest.json`
- Post step (`--post`) validates:
  - spawn policy
  - evidence completeness
  - support relation map + summaries when applicable
  - correct routing for support issues (`context_only_no_defect_analysis`)

## Context intake extracted from provided evidence (BCED-1719)
### A) Component-stack constraints captured
From Jira raw issue fields and labels:
- Labels: **`Embedding_SDK`**, **`Library_and_Dashboards`**
  - Indicates the feature touches an **Embedding SDK** surface and also **Library/Dashboards** integration surfaces.
- Issue type: **Feature** under initiative “Enhance Embedding & Integration Capabilities” (parent PRD-125).
- Work is tracked for release/fixVersion: **26.04**.

**Phase 1 implication:** context intake should treat this as cross-surface (SDK + UI surfaces) and therefore ensure Phase 1 spawns cover at least Jira ingestion (authoritative) and any configured additional source families required by the run configuration (not provided in evidence bundle).

### B) Embedding lifecycle assumptions captured
From labels and feature family:
- Feature family explicitly **native-embedding** (benchmark metadata).
- Label **Embedding_SDK** implies lifecycle concerns such as:
  - SDK initialization/embedding entrypoints
  - compatibility/versioning constraints
  - integration flows between embedded surfaces and platform components

**Phase 1 implication:** even in blind_pre_defect mode, Phase 1 context intake must preserve these assumptions as **constraints to be researched/covered in later phases**, not prematurely scoped out.

### C) Integration-sensitive customer expectations captured
From `BCED-1719.customer-scope.json`:
- **Customer signal present:** `true`
- Customer references appear in Jira custom fields:
  - `{ CVS Pharmacy, Inc. - CS0928640 }`
- Policy note: “Feature carries explicit customer references in Jira custom fields.”

**Phase 1 implication:** context intake must preserve that this work is **customer-driven / integration-sensitive** and ensure spawns (at minimum Jira) retain these fields as evidence inputs for later coverage and prioritization.

## Phase 1 alignment assessment (contract-level)
### What can be verified from evidence
Using only the snapshot and fixture bundle, we can verify the **Phase 1 contract expectations that are about *what must be preserved as inputs***:
- The evidence bundle contains explicit signals for:
  - component stack: **Embedding SDK + Library/Dashboards**
  - customer expectation: **CVS / CS0928640**
  - integration framing via parent initiative “Embedding & Integration Capabilities”

These are the required context elements the orchestrator/Phase 1 must not lose.

### What cannot be verified from evidence (blocker to full Phase 1 validation)
The benchmark requires Phase 1 output alignment, but the evidence bundle does **not** include:
- a produced `phase1_spawn_manifest.json`
- `task.json` / `run.json` indicating `requested_source_families`
- any Phase 1 `--post` validation output

Therefore we cannot confirm (from provided evidence) whether Phase 1 actually:
- generated spawn requests per requested source family
- included Jira/support digestion requests correctly
- enforced support-only policy routing in `--post`

## Advisory verdict for this benchmark case
- **Context-intake focus coverage (advisory):** **Covered in available inputs** — the provided fixtures clearly express component-stack constraints and customer integration sensitivity that Phase 1 must preserve.
- **Phase 1 output alignment (advisory):** **Not verifiable from provided evidence** — Phase 1 manifest and post-validation artifacts are not included in the bundle.

## Minimal Phase 1 contract checklist for BCED-1719 (what Phase 1 should ensure)
If Phase 1 were executed for this case, its spawn manifest / routing should at least preserve and carry forward:
- **Feature family:** native-embedding
- **Key surfaces:** Embedding SDK + Library/Dashboards
- **Customer sensitivity:** CVS Pharmacy / CS0928640 present
- **Release context:** fixVersion 26.04

And it should generate spawns for the requested evidence sources (at minimum **Jira**) with no defect-analysis behavior implied by customer/support context.