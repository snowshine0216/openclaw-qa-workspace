# Benchmark Case P6-QUALITY-POLISH-001 — Phase 6 Contract Check (BCIN-6709)

## Scope
- **Primary feature:** BCIN-6709
- **Feature family / knowledge pack:** report-editor
- **Primary phase under test:** **Phase 6** (final quality pass)
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory
- **Case focus:** **final quality pass preserves layering and executable wording**

## What Phase 6 must demonstrate (per orchestrator contract)
Phase 6 is a **final layering/search/few-shots quality pass** that:
1. Preserves the **canonical layering** down to observable verification leaves.
2. Ensures scenarios use **executable wording** (atomic action chains + observable outcomes).
3. Produces required Phase 6 artifacts and a `quality_delta` that explicitly audits preservation of support-derived and deep-research-backed coverage.

### Required Phase 6 outputs (contract)
- `drafts/qa_plan_phase6_r<round>.md`
- `context/quality_delta_<feature-id>.md`

### Required `quality_delta` sections (Phase 6 rubric)
- `## Final Layer Audit`
- `## Few-Shot Rewrite Applications`
- `## Exceptions Preserved`
- `## Verdict`

### Final layering model (Phase 6 rubric)
1. central topic
2. canonical top category
3. subcategory
4. scenario
5. atomic action chain
6. observable verification leaves

## Evidence available in this benchmark
Only the following feature fixture evidence is provided:
- Jira raw issue JSON for **BCIN-6709**
- Customer-scope JSON indicating explicit customer references and labels

From the Jira description (fixture): the feature motivation is that **report errors force users to exit/reopen and lose editing**, causing customer complaints and escalation.

## Determination: Can Phase 6 quality-polish compliance be verified from provided evidence?
**No.** With the provided evidence bundle, we cannot verify Phase 6 compliance with the benchmark focus (“final quality pass preserves layering and executable wording”), because the evidence set does **not** include any Phase 6 artifacts (or any draft lineage artifacts).

### Missing required Phase 6 proof points (blocked)
To demonstrate Phase 6 alignment and satisfy this benchmark’s phase-contract expectations, we would need (at minimum):
- `drafts/qa_plan_phase6_r1.md` (or later round): to inspect **layering** and **executable wording**.
- `context/quality_delta_BCIN-6709.md`: to confirm the required sections exist and that it explicitly states reviewed/support/deep-research coverage was preserved.
- (Implied by rubric inputs) latest Phase 5b draft + Phase 5a/5b deltas/notes to verify **preservation** across the final polish step.

## Phase 6-focused checklist (what would be checked if artifacts were present)
If the Phase 6 artifacts were available, verification would focus on:
- **Layering correctness:** each scenario nests action steps then deeper observable verification leaves (no flattened “Expected:” labels).
- **Executable wording:** steps are atomic, testable, and sequenced; verification leaves are observable outcomes.
- **No scope loss:** scenarios covering “error encounter → recovery without losing edits” remain present through the final cleanup.
- **Quality delta completeness:** includes the four required sections and explicitly records preservation of support-derived and deep-research-backed coverage.

## Verdict (advisory)
**Blocked** — Phase 6 contract compliance for BCIN-6709 cannot be demonstrated with the provided blind_pre_defect fixture evidence because the required Phase 6 deliverables (`qa_plan_phase6_r<round>.md` and `quality_delta_BCIN-6709.md`) are not included.