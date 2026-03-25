# Phase 4b Contract

## Purpose

Group the Phase 4a draft into the canonical top-layer taxonomy without merging away scenario granularity.

## Required Inputs

- latest `drafts/qa_plan_phase4a_r<round>.md`
- any supporting `context/` artifacts needed to justify grouping decisions
- `context/artifact_lookup_<feature-id>.md` so the round can record what it read

## Required Output

- `drafts/qa_plan_phase4b_r<round>.md`

## Output Shape

- preserve the XMindMark central topic line
- group scenarios under canonical top-layer categories
- preserve the subcategory layer between top layer and scenario
- preserve scenario nodes, atomic action chains, and observable verification leaves
- grouping and refactor may not silently shrink coverage
- when `coverage_ledger_<feature-id>.json` contains pack-backed candidates, grouping must not drop or merge scenarios that trace to those candidates
- do not apply few-shot cleanup in this phase; Phase 6 owns the final few-shot rewrite pass

## Canonical Top Layer

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

## Layering Rules

- top category
- subcategory
- scenario
- atomic action chain
- observable verification leaves

## Bounded Research Rule

- Use local run artifacts first.
- When grouping evidence is still insufficient, do at most one bounded supplemental research pass.
- Save any new research artifact under `context/` using the `research_phase4b_<feature-id>_*.md` pattern.
- Update `artifact_lookup_<feature-id>.md` for the artifacts read in the round.

## Anti-Compression Rule

- Do not merge distinct Workstation-only and Library-gap scenarios when their outcomes or risks differ.
- Relation-map-derived support risks must remain visible after canonical grouping.

When a scenario does not fit a canonical layer, preserve the original grouping and add:

```md
<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->
```
