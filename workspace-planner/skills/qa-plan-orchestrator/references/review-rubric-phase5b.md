# Phase 5b Review Rubric

Derived from `references/checkpoints.md`. Treat this file as the normalized runtime contract for shipment-readiness review.

## Purpose

Run explicit shipment-readiness checkpoints after Phase 5a and before the final Phase 6 cleanup.

## Required Outputs

- `context/checkpoint_audit_<feature-id>.md`
- `context/checkpoint_delta_<feature-id>.md`
- `drafts/qa_plan_phase5b_r<round>.md`

## Required Inputs

- latest `drafts/qa_plan_phase5a_r<round>.md` or the latest draft returned from Phase 6
- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `context/artifact_lookup_<feature-id>.md`

## Review + Refactor Behavior

- Evaluate every checkpoint in this rubric against the current draft and available evidence.
- Refactor the plan only for checkpoint-backed gaps that are fixable in the current round.
- Do not remove, defer, or move a concern to Out of Scope unless source evidence or explicit user direction requires it.
- Produce a Release Recommendation that matches the checkpoint evidence.
- Historical analogs that remain relevant must be rendered as explicit `[ANALOG-GATE]` entries in the release recommendation or developer smoke follow-up.
- Rewrite `artifact_lookup_<feature-id>.md` for the successful round so new context artifacts and preserved read-state remain visible.

## Bounded Research Rule

- Use local run artifacts first.
- When checkpoint evidence is still insufficient, do at most one bounded supplemental research pass.
- Save any new research artifact under `context/` using the `research_phase5b_<feature-id>_*.md` pattern.
- Use bounded research before shrinking scope when checkpoint evidence is insufficient.

## Pass / Return Criteria

- `checkpoint_delta_<feature-id>.md` must end with an explicit disposition:
  - `accept`
  - `return phase5a`
  - `return phase5b`
- `accept` means the round passes and can hand off to Phase 6.
- `return phase5a` means checkpoint review found foundational issues that require another Phase 5a review/refactor round.
- `return phase5b` means shipment-checkpoint fixes are still incomplete and Phase 5b must run again.

## Required Checkpoints

- `Checkpoint 1` Requirements Traceability
- `Checkpoint 2` Black-Box Behavior Validation
- `Checkpoint 3` Integration Validation
- `Checkpoint 4` Environment Fidelity
- `Checkpoint 5` Regression Impact
- `Checkpoint 6` Non-Functional Quality
- `Checkpoint 7` Test Data Quality
- `Checkpoint 8` Exploratory Testing
- `Checkpoint 9` Auditability
- `Checkpoint 10` AI Hallucination Check
- `Checkpoint 11` Mutation Testing
- `Checkpoint 12` Contract Testing
- `Checkpoint 13` Chaos and Resilience
- `Checkpoint 14` Shift-Right Monitoring
- `Checkpoint 15` Final Release Gate
- `Checkpoint 16` i18n Dialog Coverage
- `supporting_context_and_gap_readiness`

## Required Sections

### `checkpoint_audit_<feature-id>.md`

- `## Checkpoint Summary`
- `## Blocking Checkpoints`
- `## Advisory Checkpoints`
- `## Release Recommendation`

The checkpoint summary must include an explicit `supporting_context_and_gap_readiness` row and route back to `phase5a` when supporting context or report-editor gap coverage is not release-ready.
The release recommendation must enumerate all `[ANALOG-GATE]` items that remain blocking before ship.

### `checkpoint_delta_<feature-id>.md`

- `## Blocking Checkpoint Resolution`
- `## Advisory Checkpoint Resolution`
- `## Final Disposition`
