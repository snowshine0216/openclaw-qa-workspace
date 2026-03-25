# P4B-LAYERING-001 — Phase 4b Contract Benchmark Assessment (BCED-2416, report-editor)

## Scope under test
- **Primary phase/checkpoint:** **Phase 4b**
- **Case family:** phase contract
- **Priority:** advisory
- **Evidence mode:** blind pre defect
- **Case focus (must be explicit):** **Canonical top-layer grouping without collapsing scenarios**

## What Phase 4b is required to do (per snapshot contract)
From `skill_snapshot/references/phase4b-contract.md`, Phase 4b must:
1. **Group** the Phase 4a draft into the **canonical top-layer taxonomy**.
2. **Preserve scenario granularity** (anti-compression): do **not** merge away distinct scenarios, including explicit rule: 
   - “Do not merge distinct Workstation-only and Library-gap scenarios when their outcomes or risks differ.”
3. **Preserve layering**:
   - top category → subcategory → scenario → atomic action chain → observable verification leaves
4. **Not shrink coverage** and not drop/merge pack-backed candidates where applicable.
5. **Not do few-shot cleanup** (owned by Phase 6).
6. Allow **at most one** bounded supplemental research pass *only if grouping evidence is insufficient*, and save it under `context/` with `research_phase4b_<feature-id>_*.md`.

Canonical top-layer categories required:
- `EndToEnd`
- `Core Functional Flows`
- `Error Handling / Recovery`
- `Regression / Known Risks`
- `Compatibility`
- `Security`
- `i18n`
- `Accessibility`
- `Performance / Resilience`
- `Out of Scope / Assumptions`

## Evidence available in this benchmark bundle
This benchmark provides feature/background evidence (not an actual run output):
- A consolidated feature write-up: **“BCED-2416 — Embedding Dashboard Editor in Workstation”** with extensive scenario bullets across launch, save, cancel/close, auth, navigation, export, UI, performance, security/ACL, compatibility, environment-specific.
- Jira raw + customer-scope JSON (customer signal present).

## Phase 4b alignment check (against benchmark expectations)
### Expectation 1: Case focus explicitly covered — canonical top-layer grouping without collapsing scenarios
**Status: Not demonstrable with provided evidence.**

Reason:
- The benchmark evidence set does **not** include any Phase 4b artifact such as:
  - `drafts/qa_plan_phase4b_r<round>.md` (required output)
  - `phase4b_spawn_manifest.json` (required orchestrator-managed spawn manifest)
  - any indication of how scenarios were grouped into canonical top-layer categories
- While the fixture write-up lists many scenario topics (e.g., “Editor Launch & Activation”, “Save / Save As”, “Cancel / Close”, etc.), there is **no produced Phase 4b grouped plan** showing:
  - the canonical top-layer headings
  - preservation of subcategory layer
  - that scenarios were not merged (anti-compression)

### Expectation 2: Output aligns with primary phase phase4b
**Status: Not demonstrable with provided evidence.**

Reason:
- Phase 4b alignment is primarily evidenced by the existence and shape of `drafts/qa_plan_phase4b_r<round>.md` and passing of Phase 4b post validators (coverage preservation against Phase 4a, canonical layering, scenario granularity, executable steps, E2E minimum).
- None of those runtime artifacts or validation outputs are included in the benchmark evidence bundle.

## Conclusion
With the evidence provided, we can restate the Phase 4b contract and confirm the benchmark’s intended focus; however, we **cannot** determine whether the orchestrator/skill execution produced a Phase 4b output that performs **canonical top-layer grouping without collapsing scenarios**, because no Phase 4b run artifacts are present.

## What would be required to prove compliance (missing artifacts)
To assess this benchmark as pass/fail, the following Phase 4b artifacts must be available:
1. `drafts/qa_plan_phase4a_r<round>.md` (input lineage)
2. `drafts/qa_plan_phase4b_r<round>.md` (required Phase 4b output)
3. `phase4b_spawn_manifest.json` (orchestrator spawn contract for the canonical top-layer grouper)
4. Any Phase 4b bounded research artifacts, if used: `context/research_phase4b_BCED-2416_*.md`
5. (Optional but strong) Phase 4b post validation record indicating:
   - `validate_phase4b_category_layering`
   - `validate_scenario_granularity`
   - `validate_draft_coverage_preservation`
   - `validate_e2e_minimum`
   - `validate_executable_steps`

---

## Execution summary
- Reviewed the **Phase 4b contract** and **canonical top-layer taxonomy** from the skill snapshot.
- Checked the provided BCED-2416 fixture materials for Phase 4b output evidence.
- Determined the benchmark expectation (canonical top-layer grouping without collapsing scenarios) **cannot be verified** because the required Phase 4b draft/manifest artifacts are not included in the evidence set.