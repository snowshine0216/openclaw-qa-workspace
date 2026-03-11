# Context Index Schema

## Feature Summary

- plain-language summary
- affected user type
- business intent

## Feature Classification

- `user_facing` or `non_user_facing`
- supporting source artifact or explicit user confirmation
- note about EndToEnd requirement

## Source Inventory

- artifact
- source family
- why it matters
- confidence
- policy tag (`primary`, `support_context`, `deep_research`, `deep_research_fallback`, `request_audit`)

## Primary User Journeys

- journey name
- trigger/entry
- user goal
- completion signal

## Entry Points

- entry point
- source evidence

## Core Capability Families

- one normalized capability family per bullet

## Scenario Units

- scenario id
- parent capability family
- user-visible trigger
- required visible outcome
- recommended section
- priority
- source artifacts
- merge policy (`must_stand_alone` | `may_merge_with_same_outcome` | `out_of_scope_only_with_reason`)

Capability families are grouping aids only. Distinct user-visible flows with different triggers, outcomes, or risks must become separate scenario units.

## Error / Recovery Behaviors

- trigger
- recovery expectation
- evidence
- trigger status

## Known Risks / Regressions

- risk source
- risk summary
- coverage implication

## Permissions / Auth / Data Constraints

- roles
- auth flows
- restrictions

## Environment / Platform Constraints

- platform or environment
- support rule

## Setup / Fixtures Needed

- test data
- account role
- prerequisite environment

## Unsupported / Deferred / Ambiguous

- unresolved item
- reason
- proposed treatment

## Mandatory Coverage Candidates

- candidate id
- capability or journey
- recommended coverage type
- source artifacts

Scenario units and mandatory coverage candidates may overlap, but they are not interchangeable:

- coverage candidates prove nothing was silently dropped
- scenario units preserve testcase granularity
- priority behavior is unchanged in this pass
- support issue summaries and deep research artifacts become mandatory coverage candidates when the request requires them

## Traceability Map

- fact id
- artifact source
- extracted fact
- normalized interpretation
- planning consequence
