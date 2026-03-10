# BCIN-7289 — QA-Focused Gap and Risk Summary

Saved: 2026-03-10
Purpose: normalized Phase 1 background-research summary for downstream coverage mapping

## Executive normalization
BCIN-7289 is a **report-editor convergence feature**: Workstation should use an embedded Library report-authoring experience when compatibility gates allow, while still preserving required Workstation-native shell behaviors.

For QA, the highest risk is **state integrity across the boundary between embedded Library logic and Workstation-native integration**. The defect question is rarely just “does the button exist?”; it is more often “does the report remain in the right state after routing, save, prompt, cancel, error, close, or recovery?”

## 1) Primary gap categories to model

### G1. Classic vs embedded routing gap
Risk that the wrong editor opens, both editors partially initialize, or visibility logic mixes classic and embedded commands.

Validate across:
- Web/Library version < 26.04 vs >= 26.04
- new-editor preference OFF vs ON
- create vs edit entry points
- restart/reconnect after preference or environment changes

### G2. Library parity vs Workstation shell gap
Risk that embedded Library authoring works functionally, but Workstation-native integrations do not behave correctly.

Key shells/integrations:
- save as dialog
- comments/template dialog flow
- object editor / properties launch
- close window
- window title sync
- instance cleanup on close

### G3. Intentional UI delta vs regression gap
Risk that known layout/style differences are either wrongly filed as bugs or, worse, real functional regressions are excused as “expected differences.”

Watchpoints:
- Format/View menu structure changes
- Library-style confirm dialogs and fonts
- second-level menu placement
- absence/presence of menu categories in embedded mode

### G4. Report-state gap
Risk that the report enters the wrong execution/editing state during embedded interactions.

State families:
- pause mode
- running mode
- prompt / reprompt
- cancel execution
- save during/after state changes
- error recovery returning to pause/edit state

## 2) Highest-priority risk themes

### R1. Entry-point parity
All of these can route differently and must preserve expected context:
- edit report
- new report from plus icon/menu
- create from template
- subset report from dataset
- cube / MDX / FFSQL / Python report entry points
- context-menu edit
- drill/link-driven entry into other content

### R2. Save / Save As continuity
Expected failure classes:
- wrong dialog surface
- missing template/comment-related options
- stale title after save/save as
- saved object not visible until refresh
- unsaved-change prompt missing or incorrect on close
- duplicate/incorrect save-related menu state

### R3. Close / cancel / navigation lifecycle
Expected failure classes:
- close action bypasses confirmation when report changed
- cancel/goBack/goHome/exit edit mode closes or routes incorrectly
- editor closes but instance is not cleaned up
- user lands on Library home/login page unexpectedly
- stale window or orphaned session remains after close

### R4. Auth / ACL / session handling
Expected failure classes:
- OAuth / SDK / connector auth popup failure in embedded host
- session timeout shows wrong Library surface
- privilege mismatch between open/edit/save flows
- read-only user still sees mutable affordances
- save destination restrictions not surfaced correctly

### R5. Performance regression
Expected failure classes:
- cold first open/create significantly slower than classic editor
- warm reopen still sluggish because both classic and embedded assets load
- poor scroll smoothness
- lag after first manipulation/prompt submit
- host-specific differences on Windows vs Mac

### R6. Recovery / continue-editing state loss
Using BCIN-6709 as analogous report-editor evidence, the most report-specific failures are:
- recoverable error still forces exit/reopen
- document view remains stale/broken after error
- prompt answers are lost unexpectedly
- report returns to wrong state after error handling
- undo/redo history is reset or preserved incorrectly for the manipulation type

## 3) What should be treated as true parity requirements
These areas most likely need parity or near-parity outcomes:
- core create/edit/save flows
- correct editor chosen for gating conditions
- object editor/properties/comments integration
- prompt and cancel behavior that preserves expected report context
- auth/session outcomes that do not leak users to wrong surfaces
- title/object refresh after save-related actions
- close and cleanup semantics

## 4) What may legitimately differ but still needs verification
These may be acceptable differences if behavior is still correct and intentional:
- component styling/fonts
- confirm-dialog look and wording
- menu hierarchy/location differences
- some Workstation-specific shell presentation details

QA should verify these as **intentional deltas**, not assume either equivalence or defect.

## 5) Special report-editor attention areas
These are the report-editor-specific checks most likely to be missed if the team treats BCIN-7289 like generic dashboard parity:
- pause mode ↔ running mode transitions
- prompt / reprompt answer preservation
- rerender of document view after recoverable failure
- interaction between manipulation errors and undo/redo history
- save behavior after execution-state changes
- remaining inside current report context after cancel/error instead of navigating away

## 6) Analogous defect heuristics to reuse
### From BCED-2416 architecture-adjacent evidence
Carry forward as heuristics, not requirements:
- missing save-dialog controls
- saved object visibility refresh defects
- unsmooth scrolling
- cold-load performance regression
- embedded auth popup failures
- duplicate menu/context actions
- stale title/menu refresh state
- navigation to wrong surface after cancel/timeout

### From BCIN-6709 report-state evidence
Carry forward as heuristics, not requirements:
- recreate-instance recovery paths
- return-to-pause-mode expectation after specific failures
- rerender doc view when state becomes stale
- different undo/redo behavior for modeling-service manipulations
- prompt/reprompt-specific recovery behavior

## 7) Suggested downstream coverage priorities
If later phases need a risk-first ordering, prioritize in this order:
1. editor routing matrix and entry-point coverage
2. save / save as / title / refresh continuity
3. close / cancel / goBack / goHome lifecycle
4. auth / ACL / session timeout correctness
5. prompt / pause / recovery / undo-redo state integrity
6. performance and scroll responsiveness
7. UI/menu delta validation

## Bottom line for the orchestrator
BCIN-7289 should be planned as a **desktop-shell + embedded-editor state-integration feature**, not just a visual parity feature.

The most important downstream planning assumption is:
> if create/edit/save/cancel/error/recovery transitions keep the report in the wrong state, the feature is effectively broken even when most Library UI appears correctly inside Workstation.

BCED-2416 and BCIN-6709 are useful only as supporting risk patterns:
- **BCED-2416** = analogous embedded parity architecture warnings
- **BCIN-6709** = analogous report-editor recovery/state-machine warnings