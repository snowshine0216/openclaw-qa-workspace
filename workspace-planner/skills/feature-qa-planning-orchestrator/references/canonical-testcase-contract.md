# Canonical QA Plan Contract

Use this contract for every unified QA-plan artifact produced by the QA-planning workflow.

## Required top-level sections

Preserve these semantic buckets in this exact order:

1. `## EndToEnd`
2. `## Functional - Pause Mode`
3. `## Functional - Running Mode`
4. `## Functional - Modeling Service Non-Crash Path`
5. `## Functional - MDX / Engine Errors`
6. `## Functional - Prompt Flow`
7. `## xFunctional`
8. `## UI - Messaging`
9. `## Platform`

## Section-flexibility rule

- `EndToEnd` may be renamed with a close semantic alias such as `End to End` or `E2E`.
- All other sections must remain present.
- Small text adjustments are acceptable only if the section still maps clearly to the same semantic bucket.
- Do not merge, drop, or replace required sections.

## N/A rule

- Every required section must remain present even when there is no meaningful coverage.
- If a section is not applicable, add one concise leaf node:
  - `N/A — no messaging change in scope`
  - `N/A — no cross-functional combination test needed for this feature`
  - `N/A — browser sweep deferred to release validation`

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
