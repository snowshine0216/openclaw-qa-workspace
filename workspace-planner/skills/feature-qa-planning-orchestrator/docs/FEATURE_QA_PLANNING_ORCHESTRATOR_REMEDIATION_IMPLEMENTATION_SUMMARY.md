# Feature QA Planning Orchestrator Remediation Implementation Summary

**Date:** 2026-03-10  
**Source design:** `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_SPEC.md`

## What changed

### 1. Package cleanup

- Trimmed `README.md` into a short package map instead of a second contract summary.
- Sharpened `SKILL.md` so it owns workflow entry, reference load order, and high-level operating rules only.
- Sharpened `reference.md` so it owns runtime state, artifact naming, phase gates, source-routing, spawn-history structure, and validator inventory.
- Updated `docs/DOCS_GOVERNANCE.md` to distinguish active docs from archived docs.
- Moved superseded enhancement-era docs under `docs/archive/` and marked them `Superseded`.

### 2. Contract updates

Updated active contract files to reflect the remediation design:

- `references/context-index-schema.md`
  - added scenario-unit requirements
  - clarified that capability families are grouping aids, not sufficient planning units
- `references/context-coverage-contract.md`
  - added approved source-family collection paths
  - added `runtime_setup_<feature-id>.md`
  - added `scenario_units_<feature-id>.md`
  - added standalone-mapping rule for `must_stand_alone` scenario units
- `references/qa-plan-contract.md`
  - added scenario distinctness rule
  - added requirement to preserve scenario granularity from normalization
- `references/review-rubric.md`
  - added merged `must_stand_alone` scenario units as a blocking condition
  - documented structured rewrite-request expectations
- `templates/qa-plan-template.md`
  - added a writer note to preserve standalone scenario granularity

### 3. Runtime/source-routing implementation

Added executable routing helpers in `scripts/lib/contextRules.mjs`:

- `APPROVED_SOURCE_RULES`
- `normalizeSourceFamily`
- `getApprovedSourceRule`
- `evaluateRuntimeSetup`
- `evaluateSpawnPolicy`

These helpers now make the Jira/Confluence/GitHub/Figma collection policy testable in code rather than documentation-only.

### 4. Validator implementation

Extended `scripts/lib/qaPlanValidators.mjs` with:

- tighter coverage-ledger id extraction for scenario-level mapping rows
- `validateScenarioGranularity(...)`

`validateScenarioGranularity(...)` now checks:

- missing `must_stand_alone` mappings
- merged standalone scenario ids
- invalid non-standalone resolution types
- generic expected-result wording in mapped scenarios
- unresolved `split_required` rewrite requests
- claimed split resolutions that do not actually change scenario titles

Extended `scripts/lib/validate_plan_artifact.mjs` with:

- `validate_scenario_granularity <scenario-units> <coverage-ledger> <draft> [review-rewrite-requests] [review-delta]`

### 5. Runtime helper deployment

Updated `scripts/lib/deploy_runtime_context_tools.sh` so the runtime helper bundle now also deploys:

- `contextRules.mjs`

## Test updates

Updated:

- `tests/contextRules.test.mjs`
  - source-routing helper coverage
  - runtime-setup validation coverage
  - spawn-policy enforcement coverage
- `tests/planValidators.test.mjs`
  - one-to-one scenario granularity pass case
  - collapsed save/save as/comments/template failure case
  - merged Mojo/Library error failure after `split_required`
  - CLI coverage for `validate_scenario_granularity`
- `tests/deploy_runtime_context_tools.test.mjs`
  - deployment coverage for `contextRules.mjs`
- `tests/docsContract.test.mjs`
  - active-vs-archive docs assertions
  - remediation-era artifact and source-routing assertions

## Validation run

Ran:

- `npm test`

Result:

- `42` tests passed
- `0` tests failed

## Active docs after cleanup

Main `docs/` now contains only active material:

- `DOCS_GOVERNANCE.md`
- `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_SPEC.md`
- `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_IMPLEMENTATION_SUMMARY.md`

Historical design material now lives under:

- `docs/archive/`
