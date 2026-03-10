# QA Plan Contract

## Who Must Obey This Contract

Write, review, and refactor all obey this contract.

## Output Shape

- Output must be valid XMindMark.
- The template is not advisory. It is the required scaffold.
- The final artifact is a unified QA plan, not a stitched collection of source summaries.

## Required Top-Level Sections

Unless explicitly not applicable with a reason:
- `EndToEnd`
- `Core Functional Flows`
- `Error Handling / Recovery`
- `Regression / Known Risks`
- `Permissions / Security / Data Safety`
- `Compatibility / Platform / Environment`
- `Observability / Performance / UX Feedback`
- `Out of Scope / Assumptions`

## Scenario Contract

Each scenario must include:
- scenario title
- setup when needed
- one or more user-visible action steps
- observable expected result
- optional verification note
- priority marker

A scenario is invalid if it lacks an observable user action or observable expected result.

## E2E Minimum

- `EndToEnd` is mandatory unless the feature is explicitly non-user-facing, and the reason must be written under `Out of Scope / Assumptions`.
- EndToEnd journey types must be selected based on the feature lifecycle.
- Do not force `create/edit/save` when the feature lifecycle is view-only, approval-only, routing-only, background-processing, or otherwise shaped differently.

## Priority Contract

- `P1` — directly relates to code change or core risk
- `P2` — maybe influenced or important adjacent coverage
- `P3` — exploratory, low-risk, or nice-to-have coverage

Do not remove or ignore priority markers.

## Evidence Usage Contract

- Every mandatory coverage candidate from `context_index` must be represented in the draft or explicitly excluded.
- Source evidence must be normalized into the context index before it influences the plan.
- Internal APIs, services, bridge functions, and implementation hooks do not belong in main manual step wording.

## Out-of-Scope Contract

- Missing coverage must be visible.
- Every exclusion must name the reason and supporting evidence or user confirmation.

## Review Fail Conditions

Review must reject drafts that:
- are structurally valid but not executable
- lose E2E coverage required by the context index
- leave blocking findings unresolved
- silently drop unclear steps instead of rewriting, researching, or preserving them with a comment and next action

## Validation Expectations

The orchestrator must run deterministic validators for:
- context-index structure
- coverage-ledger completeness
- EndToEnd minimum
- executable-step quality
- review delta
- unresolved-step handling
