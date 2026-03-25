# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check (BCIN-7231)

## Scope
- **Benchmark feature:** BCIN-7231
- **Feature family / knowledge pack:** modern-grid
- **Primary phase under test:** **Phase 1** (spawn-manifest generation for evidence intake)
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory
- **Case focus (must be preserved before scenario drafting):**
  1) **Banding requirements**
  2) **Style constraints** (format/colors)
  3) **Rendering assumptions** (row/column header application, row vs column banding)

## Evidence available (blind pre-defect)
From `BCIN-7231.issue.raw.json` description (partial but explicit):
- Current Modern Grid limitations:
  - Banding can only be enabled **in rows**.
  - Users **cannot format colors**.
  - Users **cannot enable banding in columns**.
  - Users **cannot apply banding color by row/column header**.
- Stated goal: bring **all Report banding functions** to **Modern Grid in dashboards**.

From `BCIN-7231.customer-scope.json`:
- Customer signals exist; no additional functional constraints beyond confirming customer scope is present.

## Phase 1 contract alignment (what Phase 1 must ensure)
Per orchestrator workflow snapshot:
- Phase 1 work is **not** to draft scenarios; it must:
  - Generate **one spawn request per requested source family** needed to collect evidence.
  - Ensure any support-only Jira digestion requests are explicitly marked **`context_only_no_defect_analysis`**.
  - Preserve context needed for later phases by routing to evidence collection that will capture:
    - requirements for **row vs column banding**
    - **color/formatting** controls
    - **header-based** banding application behavior
    - any **rendering behavior/assumptions** (visual results, interactions, constraints)

## Assessment: Does the provided evidence demonstrate Phase 1 satisfies this case focus?
**Cannot be demonstrated from provided benchmark evidence.**

Reasoning constrained to evidence:
- The evidence bundle includes:
  - the skill workflow contract (how Phase 1 should behave)
  - the Jira issue payload for BCIN-7231 with explicit banding/style/rendering requirements
- The bundle **does not include** Phase 1 runtime outputs for this feature (e.g., `phase1_spawn_manifest.json`) nor any generated context artifacts under `context/`.
- Therefore, we cannot verify that Phase 1 actually:
  - routed the correct source-family evidence requests, or
  - captured/encoded the banding/style/rendering assumptions into context artifacts prior to drafting.

### What would be required to prove compliance (Phase 1 artifact expectations)
To satisfy this benchmark case focus at Phase 1, the run would need to show (at minimum):
- A produced `phase1_spawn_manifest.json` for BCIN-7231 whose spawn requests are sufficient to ingest evidence covering:
  - **Row banding enablement** (existing) and **column banding enablement** (new)
  - **Banding color formatting / style controls**
  - **Apply banding by row header / column header** (rendering + interaction)
  - Any dashboard Modern Grid rendering constraints relevant to banding
- If any supporting issues are included, their summaries must explicitly state they are **context-only** and **not defect-analysis triggers**.

## Advisory outcome (phase_contract / phase1)
- **Status:** **Not verifiable** with the provided blind-pre-defect bundle.
- **Primary gap:** missing Phase 1 produced artifacts (spawn manifest and any context intake outputs) that would demonstrate preservation/routing of banding/style/rendering assumptions.