# Canonical QA Plan Contract

Use this contract for every unified QA-plan artifact produced by the QA-planning workflow.

## Coverage model (not fixed headings)

The plan must cover required behavior domains. Section names are flexible and feature-fit.

### Required coverage domains

Consider for every feature:

- primary functional behavior
- error handling / recovery
- state transition / continuity
- user-visible messaging or status
- cross-flow / multi-step interactions
- compatibility / scope guard
- nonfunctional considerations when relevant

### Optional-but-always-considered domains

- boundary conditions
- input validation
- privilege / role / entitlement
- empty / null / stale / partial data states
- interruption / cancel / retry
- configuration variations
- platform / browser / environment differences
- accessibility, i18n, performance, embedding / integration

### Rule

- These are consideration checkpoints, not mandatory sections.
- If a checkpoint is irrelevant, consciously mark it as not applicable.
- If relevant, it must appear in some section.
- Each section should declare the required coverage domains it owns with `<!-- Coverage domains: ... -->` when the heading alone is not self-evident.
- See `references/coverage-domains.md` for per-section checkpoint prompts.

## Section structure

- E2E is optional and replaceable. If the feature has no meaningful end-to-end journey, omit or replace with a better top-level area.
- Functional is a semantic planning area, not a single mandatory heading. Split into feature-relevant functional areas (e.g. Functional - Pause Mode, Functional - Running Mode, Error Handling, Recovery Behavior).
- Top-level sections must be semantically clear and feature-fit, not mechanically uniform.
- Acceptable patterns: Functional - Pause Mode, Error Handling, Recovery Behavior, Privilege / Permission, Configuration / Validation, UI - Messaging, Compatibility, Accessibility, Platform.

## N/A rule

- Every section that exists must have content or an explicit N/A.
- If a section is not applicable: `N/A — <concise reason>`.

## Manual testcase executability contract

Every manual testcase must make these four items explicit:

1. surface or location
2. concrete trigger
3. concrete user action
4. observable expected result

If one of the four items is unknown:
- resolve it from cached context first
- then look up saved Confluence or background research
- save any new background artifact before reuse
- if still unknown, leave `<!-- TODO: specify trigger/action/result -->`
- never replace the missing detail with vague wording

## Source-usage contract

- Confluence drives main feature behavior and primary flow.
- Jira provides repro fixtures, customer-facing failures, and missing coverage.
- GitHub provides boundary conditions, edge cases, performance-sensitive risk, and automation-only reasoning.
- Figma/UX evidence tightens wording, visible-state checks, and user workflow clarity.
- The final plan must not read like per-source silos stitched together.

## Output-quality contract

The final plan should read like `docs/BCIN-6709_qa_plan.md`:

- structured by user-facing behavior
- concise
- easy to understand
- grouped rather than repetitive
- comments used for rationale, not to carry the manual steps

## Vagueness blacklist

Do not use wording like:

- `Recover from a supported report execution or manipulation error`
- `Perform another valid editing action`
- `Observe the recovered state`
- `Verify correct recovery`
- `Matches documented branch behavior`

Rewrite them into explicit trigger/action/result language.
