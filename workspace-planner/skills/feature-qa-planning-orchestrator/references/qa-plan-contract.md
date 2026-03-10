# QA Plan Contract

## Who Must Obey This Contract

Write, review, and refactor all obey this contract.

## Output Shape

- Output must be valid XMindMark.
- The template is not advisory. It is the required scaffold.
- The final artifact is a unified QA plan, not a stitched collection of source summaries.
- The central topic is a plain first line, followed by nested bullet hierarchy.

## Required Shape

- No `Setup:` sections
- No legacy `Action:` / `Expected:` labels
- One or more top-level category nodes
- One or more subcategory nodes per active category
- Scenario descriptions beneath each subcategory
- Nested atomic user-visible actions beneath each scenario
- Observable nested outcome bullets beneath the action chain
- Optional HTML comments for traceability or reviewer-only notes

## Scenario Contract

Each scenario must include:

- scenario description
- one or more atomic user-visible action steps
- one or more observable outcome bullets
- optional HTML comment for traceability
- a priority marker on the containing subcategory

A scenario is invalid if it lacks an observable user action or observable expected result.

Scenarios must also preserve required distinctness:

- if two source-backed flows have different user-visible triggers, outcomes, or risk ownership, they must not be collapsed into one umbrella scenario
- explicitly separate known-risk or reviewer-mandated splits instead of merging them into one broad scenario

## Priority Contract

- `P1` — directly relates to code change or core risk
- `P2` — important adjacent coverage
- `P3` — exploratory or low-risk coverage

Do not remove or ignore priority markers.

## Evidence Usage Contract

- Every artifact read during Phases 4a, 4b, 5, and 6 must be tracked in `artifact_lookup_<feature-id>.md`
- Coverage artifacts and review artifacts must already exist on disk before later phases cite them
- Internal APIs, services, bridge functions, and implementation hooks do not belong in main manual step wording

## Out-of-Scope Contract

- Missing coverage must be visible
- Every exclusion must name the reason and supporting evidence or user confirmation

## Review Fail Conditions

Review must reject drafts that:

- are structurally valid but not executable
- leave blocking findings unresolved
- silently drop unclear steps instead of rewriting, researching, or preserving them with a comment and next action

## Validation Expectations

The orchestrator must run deterministic validators for:

- coverage-ledger completeness
- XMindMark hierarchy
- executable-step quality
- review delta
- unresolved-step handling
