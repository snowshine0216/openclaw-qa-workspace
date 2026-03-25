# Phase 6 Review Rubric

## Purpose

Produce the final layered QA plan after Phase 5b and enforce final-quality structure before promotion.

## Required Inputs

- latest Phase 5b draft
- `review_notes_<feature-id>.md`
- `review_delta_<feature-id>.md`
- `checkpoint_audit_<feature-id>.md`
- `checkpoint_delta_<feature-id>.md`

## Required Outputs

- `drafts/qa_plan_phase6_r<round>.md`
- `context/quality_delta_<feature-id>.md`

## Final Layering

1. central topic
2. canonical top category
3. subcategory
4. scenario
5. atomic action chain
6. observable verification leaves

## Coverage Rule

- preserve reviewed coverage scope from Phase 5b unless an explicit exclusion is carried with evidence
- preserve support-derived scenarios, Workstation functionality scenarios, and Library-vs-Workstation gap scenarios through the final cleanup pass
- preserve pack-backed scenarios through the final cleanup pass and record that preservation explicitly in `quality_delta_<feature-id>.md`

## Required `quality_delta_<feature-id>.md` Sections

- `## Final Layer Audit`
- `## Few-Shot Rewrite Applications`
- `## Exceptions Preserved`
- `## Verdict`

The final layer audit must explicitly note that support-derived coverage and deep-research-backed coverage were preserved.
When `coverage_ledger_<feature-id>.json` contains pack-backed candidates, `quality_delta_<feature-id>.md` must explicitly state that pack-backed scenarios were preserved.
