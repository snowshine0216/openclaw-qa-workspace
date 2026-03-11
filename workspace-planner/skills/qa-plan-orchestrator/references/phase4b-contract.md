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
- do not apply few-shot cleanup in this phase; Phase 6 owns the final few-shot rewrite pass
- treat validator-safe structure as mandatory: canonical top layers must be real top-level bullets, subcategories must be grouping-only bullets, and executable scenarios must be the only nodes carrying priority tags

## Validator-Safe Layering Rules

- top-level canonical labels must be actual top-level bullets, not just markdown headings
- every canonical top layer used in the draft must contain both:
  - a subcategory layer
  - a scenario layer
- subcategory/grouping bullets must never carry `<P1>` / `<P2>` tags
- executable scenario bullets must carry priority tags when they are intended to be preserved as scenarios
- do not duplicate the same label as both:
  - a grouping/subcategory node
  - and a summary scenario node
  unless preservation logic truly requires the older title to survive as a scenario
- if preservation logic requires an older scenario title, prefer renaming the grouping layer rather than duplicating the same label for both grouping and execution

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

## Deduplication Rules

Use deduplication only when it preserves coverage.

- prefer one executable scenario per unique trigger + risk + observable outcome combination
- if two nodes share the same practical trigger, same risk rationale, and same user-visible outcome, merge them into one clearer executable scenario
- if two nodes differ in trigger, risk, or visible outcome in a meaningful way, keep them separate
- do not keep both:
  - a summary scenario that only restates a subcategory title
  - and detailed child scenarios with the same effective scope
- if a prior reviewed title must be preserved, the preserved scenario must add explicit retained-coverage value; it must not be a redundant heading in scenario form
- when a stub or placeholder is replaced by richer executable coverage, replace the stub or clearly mark it as superseded in later review artifacts; do not keep both as active executable content

## Bounded Research Rule

- Use local run artifacts first.
- When grouping evidence is still insufficient, do at most one bounded supplemental research pass.
- Save any new research artifact under `context/` using the `research_phase4b_<feature-id>_*.md` pattern.
- Update `artifact_lookup_<feature-id>.md` for the artifacts read in the round.

When a scenario does not fit a canonical layer, preserve the original grouping and add:

```md
<!-- top_layer_exception: kept under original grouping because no canonical layer fit without losing meaning -->
```
