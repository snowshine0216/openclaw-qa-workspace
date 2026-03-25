# Feature QA Planning Orchestrator Remediation Implementation Summary

**Date:** 2026-03-10  
**Source design:** `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_SPEC.md`

## What changed

### 1. Package cleanup

- Trimmed `README.md` into a short package map instead of a second contract summary.
- Sharpened `SKILL.md` so it owns workflow entry, reference load order, and high-level operating rules only.
- Sharpened `reference.md` so it owns runtime state, artifact naming, phase gates, source-routing, spawn-history structure, and validator inventory.
- Updated `references/docs-governance.md` to distinguish active docs from archived docs.
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

## Changelog — 2026-03-10 follow-up hardening

### Workflow contract hardening
- Made source-family context gathering explicit in `SKILL.md` core invariants and Phase 1.
- Required one dedicated context-gathering sub-agent per requested source family when multiple source families are present.
- Added fail-closed routing rules so Jira/Confluence/GitHub primary evidence cannot be replaced by browser scraping or generic web fetch.
- Added source-specific Phase 1 sub-agent contracts for Jira, Confluence, GitHub, and Figma.
- Added source-specific completion standards so a source gather is not considered done just because it returned some files.

### Phase 0 / Phase 1 runtime enforcement
- Strengthened Phase 0 runtime setup rules to require:
  - canonical required skill/path per source family
  - availability validation
  - auth/access validation
  - explicit route approval
- Updated Phase 1 to validate both:
  - `evaluateSpawnPolicy({ requestedSourceFamilies, spawnHistory })`
  - `evaluateEvidenceCompleteness({ requestedSourceFamilies, spawnHistory, hasSupportingArtifacts })`
- Added Phase 1 remediation rules so recovery is source-local by default and preserves already-valid artifacts.

### Validator and test hardening (`scripts/lib/contextRules.mjs`)
- Expanded `APPROVED_SOURCE_RULES` from a single approved skill to `approvedSkills` plus additional enforcement metadata.
- Tightened `evaluateRuntimeSetup(...)` to validate:
  - duplicate/missing setup entries
  - canonical skill routing
  - pass status
  - availability validation
  - auth validation
  - explicit route approval
  - primary/supporting reference classification
  - presence of at least one primary reference
- Tightened `evaluateSpawnPolicy(...)` to validate:
  - exactly one dedicated spawn per requested source family
  - canonical approved skill per source family
  - explicit browser/web-fetch bans where required
  - completed status
  - artifact-path presence
- Added `evaluateSourceArtifactCompleteness(...)` for per-source artifact checks.
- Added `evaluateEvidenceCompleteness(...)` for requested-source completeness checks.
- Added supporting-artifact enforcement so declared supporting artifacts require `supporting_artifact_summary_<FEATURE_ID>.md`.

### Supporting-artifact model
- Added explicit supporting-artifact rules to `SKILL.md`.
- Clarified that the primary feature spec remains authoritative for workflow and scope.
- Required supporting artifacts to be used for risk-learning, regression hardening, parity gaps, and negative coverage.
- Added guardrail that supporting artifacts must not silently redefine feature scope without user confirmation.
- Added canonical artifact `context/supporting_artifact_summary_<feature-id>.md` when supporting artifacts are part of the requested evidence set.

### State contract and naming consistency
- Added `has_supporting_artifacts` to both `task.json` and `run.json` required fields.
- Updated the state update rule so supporting-artifact state changes require both state files to be updated.
- Added naming convention note:
  - `camelCase` for JavaScript/runtime fields
  - `snake_case` for persisted state fields
- Wired `hasSupportingArtifacts` through the documented Phase 0 and Phase 1 examples in `SKILL.md`.

### Test coverage follow-up
- Updated `tests/contextRules.test.mjs` to cover:
  - stricter runtime setup requirements
  - dedicated spawn enforcement
  - artifact completeness per source family
  - supporting-artifact summary enforcement
  - primary/supporting classification requirements
  - snake_case compatibility where applicable

## Validation run

Ran:

- `npm test`
- `node --test skills/qa-plan-orchestrator/tests/contextRules.test.mjs`

Result:

- Initial broad validation run: `42` tests passed, `0` tests failed
- Follow-up targeted validator/runtime test run: `17` tests passed, `0` tests failed

## Active docs after cleanup

Main `docs/` now contains only active material:

- `DOCS_GOVERNANCE.md`
- `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_SPEC.md`
- `FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_IMPLEMENTATION_SUMMARY.md`

Historical design material now lives under:

- `docs/archive/`
