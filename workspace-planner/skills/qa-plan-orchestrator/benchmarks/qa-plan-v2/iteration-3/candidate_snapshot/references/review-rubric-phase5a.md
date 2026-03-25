# Phase 5a Review Rubric

## Purpose

Review the draft against the real `context/` artifact set, prove no coverage leak, and refactor the draft before handing off to Phase 5b.

## Required Outputs

- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `drafts/qa_plan_phase5a_r<round>.md`

## Required Inputs

- latest `drafts/qa_plan_phase4b_r<round>.md` or the latest draft returned from a later phase
- every intermediate artifact already present under `context/`
- `context/artifact_lookup_<feature-id>.md`

## Review + Refactor Behavior

- Audit the real `context/` artifact set, not just the latest draft.
- Review every active top-layer section against the canonical checklist.
- Refactor the draft only when findings are evidence-backed.
- Do not remove, defer, or move a concern to Out of Scope.
- Only do so when source evidence or explicit user direction requires it.
- Otherwise enrich the plan by preserving, splitting, clarifying, or extending coverage.
- Self-review the rewritten draft before finishing the round.
- Rewrite `artifact_lookup_<feature-id>.md` for the successful round so new context artifacts and preserved read-state remain visible.

## Bounded Research Rule

- Use local run artifacts first.
- When evidence is still insufficient, do at most one bounded supplemental research pass.
- Save any new research artifact under `context/` using the `research_phase5a_<feature-id>_*.md` pattern.
- Bounded research should be used before shrinking scope when the local artifact set is not enough to evaluate a concern confidently.

## Pass / Return Criteria

- `review_delta_<feature-id>.md` must end with an explicit disposition:
  - `accept`
  - `return phase5a`
- `accept` means the round passes and clears any pending Phase 5a rerun.
- `return phase5a` means the round needs another bounded Phase 5a review/refactor pass before handing off to Phase 5b.
- Phase 5a Acceptance Gate: `accept` is forbidden while any round-integrity or coverage-preservation item remains `rewrite_required` or otherwise unresolved.
- `accept` is forbidden while any required pack-backed row in `coverage_ledger_<feature-id>.json` remains `unmapped`.

## Required Sections

### `review_notes_<feature-id>.md`

- `## Context Artifact Coverage Audit`
- `## Supporting Artifact Coverage Audit`
- `## Deep Research Coverage Audit`
- `## Coverage Preservation Audit`
- `## Knowledge Pack Coverage Audit`
- `## Cross-Section Interaction Audit`
- `## Section Review Checklist`
- `## Blocking Findings`
- `## Advisory Findings`
- `## Rewrite Requests`

### `review_delta_<feature-id>.md`

- `## Source Review`
- `## Blocking Findings Resolution`
- `## Non-Blocking Findings Resolution`
- `## Still Open`
- `## Evidence Added / Removed`
- `## Verdict After Refactor`

## Section Review Checklist

Every active plan section must be explicitly assessed:

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

## Coverage Preservation Audit

Each affected node must record:

- rendered plan path
- prior-round status
- current-round status
- evidence source
- disposition (`pass` | `rewrite_required`)
- reason

## Request Fulfillment Gate

- `accept` is forbidden while `request_fulfillment_<feature-id>.json` still contains unsatisfied blocking requirements.
- `accept` is forbidden while any knowledge-pack capability or required interaction pair lacks a mapped scenario, gate, or explicit exclusion.
- `Knowledge Pack Coverage Audit` rows must cite the concrete `knowledge_pack_row_id` values that were preserved, mapped, gated, or explicitly excluded.
- `accept` is forbidden while any `interaction_pairs` entry from the active knowledge pack lacks a cross-section scenario audit entry in `## Cross-Section Interaction Audit`.
- `accept` is forbidden while any `state_transitions` entry from the active knowledge pack lacks a mapped scenario chain (from-state → trigger → to-state → observable outcome) in the plan.

## Report-Editor Interaction Audit Anchor

- When the active knowledge pack is `report-editor`, `## Cross-Section Interaction Audit` must include explicit audit rows for:
  - `template-based creation` + `pause-mode prompts`
  - `close-confirmation` + `prompt editor open`
  - `save-as-overwrite` + `template-save`
  - `prompt-pause-mode` + `report-builder-loading`
- Each report-editor interaction-audit row must cite the concrete `knowledge_pack_row_id` or interaction-pair identity from `coverage_ledger_<feature-id>.json`; generic prose is insufficient.
- The audit must verify that the cited interaction pair still maps to a concrete scenario, gate, or explicit exclusion after the Phase 5a refactor.
- These stronger interaction-audit rules are report-editor-only and must not be applied as a generic rewrite requirement for unrelated families.
