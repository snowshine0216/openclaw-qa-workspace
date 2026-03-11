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
- Otherwise enrich the plan by preserving, splitting, clarifying, extending, or safely deduplicating coverage.
- Deduplication is allowed only when the resulting plan still preserves the same practical trigger, risk rationale, and observable outcome coverage.
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

## Required Sections

### `review_notes_<feature-id>.md`

- `## Context Artifact Coverage Audit`
- `## Supporting Artifact Coverage Audit`
- `## Deep Research Coverage Audit`
- `## Coverage Preservation Audit`
- `## Section Review Checklist`
- `## Blocking Findings`
- `## Advisory Findings`
- `## Rewrite Requests`

#### Context Artifact Coverage Audit format

Do not summarize an artifact as `all sections`.
List explicit rows for each heading that materially influenced the round.

Preferred row shape:
- `context/<artifact>.md | ## Exact Heading | consumed | <mapped plan section> | <checkpoint> | <notes>`

If a validator or script expects exact headings, use the exact heading text from the source artifact.

#### Blocking Findings ↔ Rewrite Requests linkage rule

The `required action` text in `## Blocking Findings` must closely match the action text in the corresponding `## Rewrite Requests` row.
Avoid shorthand in one section and long-form wording in the other.

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

### Preservation and Deduplication Rules

- record rows not only for removed or changed scenarios, but also for prior reviewed scenarios that were:
  - preserved
  - clarified
  - merged safely
  - replaced by richer executable coverage
  - converted from a stub into executable scenarios
- if a prior stub is replaced by executable coverage, the audit must explicitly say that the stub was replaced and why the new scenarios preserve the concern more faithfully
- do not leave a row as `rewrite_required` after the rewritten draft already resolved the concern; resolved rows must be updated to `pass` before `accept`
- do not deduplicate by theme alone; only deduplicate when the resulting scenario still covers the same trigger, risk, and observable outcome

## Request Fulfillment Gate

- `accept` is forbidden while `request_fulfillment_<feature-id>.json` still contains unsatisfied blocking requirements.

### Preservation and Deduplication Rules

- record rows not only for removed or changed scenarios, but also for prior reviewed scenarios that were:
  - preserved
  - clarified
  - merged safely
  - replaced by richer executable coverage
  - converted from a stub into executable scenarios
- if a prior stub is replaced by executable coverage, the audit must explicitly say that the stub was replaced and why the new scenarios preserve the concern more faithfully
- do not leave a row as `rewrite_required` after the rewritten draft already resolved the concern; resolved rows must be updated to `pass` before `accept`
- do not deduplicate by theme alone; only deduplicate when the resulting scenario still covers the same trigger, risk, and observable outcome
