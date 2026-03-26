# PPT Agent Edit Enrichment Plan - Part 2

> Design ID: `ppt-agent-edit-enrichment-2026-03-26-part2`
> Date: 2026-03-26
> Status: Draft
> Scope: `revise` action handling with `replace_existing` merge-back contract
> Note: This is Part 2 of a split design. See Part 1 for baseline verification, slide briefs, visual planning, and other functional designs.

## Reference to Part 1

This document assumes familiarity with Part 1, which covers:

- Overview and problem statement
- Architecture foundations
- Data models and canonical artifacts
- Functional Design 0: Baseline Verification
- Functional Design 1: Canonical Slide Brief Enrichment
- Functional Design 2: Composition Planning And Anchor Semantics
- Functional Design 4: Image Meta Prompt Pipeline
- Functional Design 5: Presenter-Grade Notes
- Functional Design 6: Evaluation And Quality Gates

## Structured-Rebuild Merge-Back Contract

This section is extracted from the Architecture section in Part 1 and is critical for understanding the `replace_existing` merge-back implementation.

### Structured-Rebuild Merge-Back Contract

`structured_rebuild` is a single-slide operation, not a second deck-authoring
workflow.

```text
slide_brief
  -> structured-slide-spec
  -> build one rebuilt slide through shared pptx renderer
  -> export slide package artifact
  -> replace or insert exactly one target slide in working/unpacked deck
  -> re-run preservation audit on neighboring untouched slides
```

Required merge-back rules:

- the rebuild unit is exactly one target slide per `structured_rebuild` action
- the structured renderer must emit a deterministic single-slide package artifact under the run root
- the merge-back algorithm must be documented explicitly, not left to implementation inference:
  1. render the rebuilt slide into a temporary single-slide deck package
  2. extract only the target slide XML, slide rels, referenced media parts, and any required local theme/layout dependencies
  3. allocate non-conflicting slide part names, relationship IDs, and slide IDs in the destination package
  4. update `ppt/presentation.xml`, `ppt/_rels/presentation.xml.rels`, and `[Content_Types].xml`
  5. copy media/theme dependencies only when they are actually referenced by the rebuilt slide package
  6. validate neighboring untouched slide order and referenced media after reinsertion
- merge-back must declare:
  - target slide number
  - action kind: `replace_existing` or `insert_after`
  - source package path
  - preserved neighboring slide numbers
- merge-back must update the existing edit workspace, not create a second final deck and diff decks later
- untouched slides before and after the rebuilt slide must remain in the same order and retain their existing preservation expectations
- preservation audit runs after reinsertion so a rebuilt slide cannot silently disturb adjacent untouched slides
- if single-slide reinsertion cannot be completed deterministically, the run must fail closed instead of silently falling back to a deck-wide rebuild

Performance constraint for merge-back:

- per-slide `structured_rebuild` may build a local package/spec artifact and run lightweight package validation only
- per-slide `structured_rebuild` must not trigger a full-deck render, full-deck evaluation, or deck-wide before/after comparison loop
- the workflow performs one full-deck render/eval pass only after all edits and rebuilds have been merged into the working deck

## Functional Design 3: Reuse-First Structured Execution

### Goal

Keep low-risk seed-preserving edits in OOXML, but route complex slides through the
existing structured `pptx` renderer instead of building a second component engine.

### Required changes

Files to change:

- `.agents/skills/ppt-agent/scripts/lib/pptx-edit-ops.js`
- `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
- `.agents/skills/ppt-agent/scripts/lib/build-pptx-from-handoff.js`
- `.agents/skills/pptx/scripts/lib/render-slide-from-spec.js`

Files to create:

- `.agents/skills/ppt-agent/scripts/lib/structured-slide-spec.js`

Expected content changes:

- keep seed duplication for preservation-safe `light_edit`
- route complex `add_after` and complex `revise` actions to `structured_rebuild`
- generate a normalized structured slide spec from the canonical slide brief
- emit a deterministic single-slide package artifact for every `structured_rebuild`
- define the exact OOXML reinsertion algorithm for `insert_after` and `replace_existing`
- preserve source-deck theme identity on rebuilt slides unless the run is in
  explicit restyle mode or the source theme is unusable
- reuse existing structured families first, adding only the minimum extra family support needed for edit-mode parity
- avoid creating a new OOXML-native `component-renderers.js` stack
- keep edit-specific theme/routing/merge metadata in `ppt-agent`; `pptx` only consumes generic structured slide specs
- forbid full-deck render/eval inside the per-slide rebuild loop

Validation expectations:

- newly added complex slides can render through the structured builder with at least one of table, image panel, comparison columns, process flow, or metric panel
- edit mode preserves original media when `image_strategy=preserve`
- edit mode can add new non-text components without altering untouched slides
- structured rebuild fails closed if single-slide reinsertion is not deterministic


## Merge-Back Test Cases

### Unit tests — `tests/merge-back.test.js`

One test file per exported function in `merge-back.js`:

**`extractSlidePackage(sourcePackagePath, slideFile)`**
- extracts slide XML, slide rels, and referenced media from a single-slide package
- throws if the source package path does not exist
- throws if the target slide file is not present in the package

**`allocateNonConflictingIds(destUnpackedRoot, candidateRid, candidateSlideId)`**
- returns a non-conflicting `rId` when the candidate is already taken
- returns a non-conflicting `slideId` when the candidate is already taken
- [CRITICAL] throws with a structured error if allocation cannot resolve after exhausting the ID space (fail-closed on ID collision)

**`updatePresentationXml(unpackedRoot, slideFile, rid, slideId, actionKind, targetSlideFile)`**
- `insert_after`: inserts the new `<p:sldId>` entry immediately after the target slide entry
- `replace_existing`: replaces the target slide entry in-place, preserving all other entries
- [CRITICAL] throws if the resulting slide order does not match the expected order (fail-closed on broken presentation order)
- throws if `actionKind` is not `insert_after` or `replace_existing`

**`updateContentTypes(unpackedRoot, slideFile)`**
- adds the `<Override>` entry when it is missing
- is idempotent when the entry already exists
- [CRITICAL] throws if `[Content_Types].xml` does not exist (fail-closed on missing override)

**`copyMediaDependencies(sourceUnpackedRoot, destUnpackedRoot, referencedMedia)`**
- copies only media files that are referenced by the rebuilt slide
- skips media files that already exist in the destination with the same content hash
- does not copy unreferenced media from the source package

**`validateNeighboringSlides(unpackedRoot, targetSlideNumber, originalSlideIndex)`**
- passes when the 2 immediate neighbors (N-1, N+1) are structurally unchanged
- [CRITICAL] throws with a structured error listing which neighbor drifted when a neighbor's XML hash differs from the original slide index (fail-closed on neighbor drift)
- handles edge cases: first slide (no N-1), last slide (no N+1)

### Unit tests — `tests/structured-slide-spec.test.js`

**`buildStructuredSlideSpec(slideBrief, themeSnapshot)`**
- converts a canonical slide brief to a normalized structured spec with layout, content, and design tokens
- maps each supported layout family: `comparison_matrix`, `process_flow`, `data_panel`, `two_column`, `title_hero`, `section_divider`, `decision_grid`
- falls back to `two_column` for unrecognized layout hints
- throws if `slideBrief` is missing required fields (`slide_number`, `title`)
- applies theme tokens from `themeSnapshot` when present
- falls back to default design tokens when `themeSnapshot` is null or unusable

### Integration tests — `tests/workflow-edit-structured-mergeback.test.js`

- `insert_after` success path: rewires slide IDs, rel IDs, and content types correctly; deck order matches expected sequence
- `replace_existing` success path: keeps deck order stable while replacing only the target slide; neighboring slides are byte-identical to originals
- [CRITICAL] fail-closed on rel-ID collision: throws structured error, working deck is untouched
- [CRITICAL] fail-closed on missing `[Content_Types].xml` override: throws structured error, working deck is untouched
- [CRITICAL] fail-closed on broken presentation order: throws structured error, working deck is untouched
- [CRITICAL] fail when neighboring untouched slides drift structurally after rebuild: throws structured error identifying which neighbor drifted
- `structured_rebuild` action routing in `edit-handoff.js`: `applyAction()` dispatches to merge-back path when `action.action === "structured_rebuild"`
- theme preservation: rebuilt slide uses tokens from `source-theme-snapshot.json` when present; falls back to default tokens when snapshot is absent
- performance: merge-back for a single slide completes in under 2000ms (guards against accidental full-deck render inside the loop)

### E2E test — `tests/workflow-edit-structured-rebuild-e2e.test.js`

- complete `structured_rebuild` workflow: edit-run produces slide brief → `structured-slide-spec.js` converts brief → renderer emits single-slide package at `artifacts/rebuilt-slide-{N}.pptx` → merge-back inserts into working deck → finalize produces output deck with rebuilt slide in correct position

## Implementation Notes

The merge-back algorithm must be implemented with extreme care:

1. Single-slide rebuild is a surgical operation, not a deck-wide rewrite
2. The algorithm must be deterministic and fail-closed
3. Neighboring untouched slides must remain structurally unchanged
4. Full-deck render/eval is forbidden inside the per-slide rebuild loop
5. Performance constraint: only one full-deck render/eval pass after all edits merge

## References

- Part 1: PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART1.md
- `.agents/skills/ppt-agent/scripts/lib/pptx-edit-ops.js`
- `.agents/skills/ppt-agent/scripts/lib/edit-handoff.js`
- `.agents/skills/ppt-agent/scripts/lib/build-pptx-from-handoff.js`
- `.agents/skills/pptx/scripts/lib/render-slide-from-spec.js`

## Review Decisions

Decisions made during `/plan-eng-review` on 2026-03-26:

1. Single-slide package artifacts stored as `artifacts/rebuilt-slide-{slideNumber}.pptx`
2. Theme identity passed via `artifacts/source-theme-snapshot.json` written during baseline verification
3. Fail-closed means: abort entire run, preserve working deck untouched, emit structured error artifact
4. Merge-back algorithm lives in a dedicated `merge-back.js` module (not inlined in `edit-handoff.js`)
5. Preservation audit checks only 2 immediate neighbors (N-1, N+1) after reinsertion
6. Refactor `edit-handoff.js` to extract shared `applySlideAction()` pattern before adding `structured_rebuild`

## NOT In Scope

- Full-deck render/eval inside the per-slide rebuild loop (explicitly forbidden by performance constraint)
- Deck-wide before/after comparison after each `structured_rebuild` (single pass after all edits only)
- Second OOXML-native component engine (reusing existing `pptx` structured renderer)
- Explicit restyle mode (theme preservation in scope; restyle deferred)
- Artifact retention policy for single-slide packages (captured in TODOS.md as P2)
- Run-state manifest contract for artifact keying (captured in TODOS.md as P1)

## What Already Exists

- `pptx-edit-ops.js` — `registerSlideInPresentation`, `removeSlideFromPresentation`, `listPresentationSlides` primitives (reused by merge-back)
- `render-slide-from-spec.js` — 7 layout families already implemented (reused by structured_rebuild)
- `create-deck-from-spec.js` — full deck builder from structured specs (reused for single-slide package)
- `build-pptx-from-handoff.js` — handoff → spec → render pipeline (extended for single-slide path)
- `edit-handoff.js` — action routing pattern for existing actions (extended for `structured_rebuild`)

## Additional Files To Create

Beyond what the plan already lists:

- `.agents/skills/ppt-agent/scripts/lib/merge-back.js` — dedicated merge-back module with explicit functions per step
- `.agents/skills/ppt-agent/tests/merge-back.test.js` — unit tests for each merge-back function

## Additional Test Requirements

All test requirements are now specified in the Merge-Back Test Cases section above. Summary of test files:

- `tests/merge-back.test.js` — unit tests for each exported function in `merge-back.js`
- `tests/structured-slide-spec.test.js` — unit tests for brief → spec conversion
- `tests/workflow-edit-structured-mergeback.test.js` — integration tests including all 4 critical fail-closed paths
- `tests/workflow-edit-structured-rebuild-e2e.test.js` — E2E test for the full structured_rebuild workflow

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | mode: SELECTIVE_EXPANSION, 0 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 8 | CLEAR (PLAN) | 8 issues resolved, 4 critical gaps addressed in design |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 8/10 → 10/10, 12 decisions |

**UNRESOLVED:** 0 unresolved decisions
**VERDICT:** ALL REVIEWS CLEARED — Plan is ready for implementation. All 4 critical test gaps have been specified in the Merge-Back Test Cases section with concrete test specs.

