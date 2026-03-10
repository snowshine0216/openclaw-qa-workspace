# Phase 4b Contract

## Purpose

Group the Phase 4a draft into the canonical top-layer taxonomy without merging away scenario granularity.

## Output

- `drafts/qa_plan_phase4b_r<round>.md`

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

When a scenario does not fit a canonical layer, preserve the original grouping and add:

```md
<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->
```
