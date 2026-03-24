# HOLDOUT-REGRESSION-002

- Feature: `BCIN-976`
- Feature family: `report-editor`
- Primary phase: `holdout`
- Evidence mode: `holdout_regression`
- Verdict: `PASS (review-based; local Node execution unavailable)`

## Holdout Focus

This case checks that promotion/finalization behavior remains stable on another report-editor feature, not the replay-focused feature lineage. `BCIN-976` fits that role: the fixture bundle shows a distinct report-editor feature about exporting reports from Library edit mode, with explicit customer signal present in the customer-scope export.

Evidence used:

- `inputs/fixtures/BCIN-976-blind-pre-defect-bundle/materials/BCIN-976.issue.raw.json`
  - summary: `Ability to export reports from edit mode in Library.`
  - priority: `High`
  - status: `In Progress`
  - fix version: `26.04`
- `inputs/fixtures/BCIN-976-blind-pre-defect-bundle/materials/BCIN-976.customer-scope.json`
  - `customer_signal_present: true`
  - `customer_issue_policy: all_customer_issues_only`
- `skill_snapshot/docs/QA_PLAN_BENCHMARK_SPEC.md:835-837`
  - holdout regression should use non-`BCIN-7289` features from the same skill family

## Promotion / Finalization Stability Review

The snapshot keeps Phase 7 promotion behavior explicit and guarded for any feature run:

- `skill_snapshot/SKILL.md:153-157`
  - Phase 7 runs `scripts/phase7.sh`
  - archives any existing final
  - promotes the best available draft
  - writes a finalization record
  - generates `final_plan_summary_<feature-id>.md`
  - requires explicit approval before running
- `skill_snapshot/reference.md:258-260`
  - promotion/finalization is blocked when blocking `request_requirements` remain unsatisfied
- `skill_snapshot/reference.md:313-322`
  - Phase 7 is still the approval-gated promotion checkpoint after Phase 6 validation

The implementation matches that contract:

- `skill_snapshot/scripts/lib/runPhase.mjs:152-174`
  - loads state
  - calls `assertRequestFulfillmentReady`
  - archives any existing `qa_plan_final.md`
  - copies the selected draft into `qa_plan_final.md`
  - writes `context/finalization_record_<feature-id>.md`
  - regenerates `context/final_plan_summary_<feature-id>.md`
  - marks `phase_7_finalization` completed
- `skill_snapshot/scripts/lib/runPhase.mjs:884-930`
  - refuses finalization if `request_fulfillment_<feature-id>.json` is missing
  - refuses finalization when blocking request requirements are unsatisfied
  - refuses finalization when required evidence artifacts were deleted or moved
  - records supporting-context and deep-research lineage for the finalization record

## Regression Evidence

Static regression coverage for this finalization path is present in the snapshot:

- `skill_snapshot/scripts/test/phase7.test.sh:7-33`
  - successful promotion, archive/write path, finalization record content, and Feishu-failure fallback
- `skill_snapshot/scripts/test/phase7.test.sh:39-58`
  - promotion uses the latest available round draft
- `skill_snapshot/scripts/test/phase7.test.sh:60-80`
  - promotion is blocked when blocking request requirements are still unsatisfied
- `skill_snapshot/scripts/test/phase7.test.sh:82-98`
  - promotion trusts `request_fulfillment_<feature-id>.json` over stale cached run state
- `skill_snapshot/scripts/test/phase7.test.sh:100-123`
  - promotion is blocked if a required artifact no longer exists

The benchmark layer also keeps holdout as its own no-regression gate:

- `skill_snapshot/docs/QA_PLAN_BENCHMARK_SPEC.md:650-682`
  - holdout regression exists to protect unrelated flows from replay-driven overfitting
  - acceptance requires no regression for `holdout_regression`
- `skill_snapshot/tests/benchmarkV2Scorer.test.mjs:34-60`
  - holdout scores are computed separately by evidence mode
- `skill_snapshot/tests/benchmarkV2Scorer.test.mjs:63-105`
  - acceptance requires blind non-regression, replay improvement, and holdout non-regression together
- `skill_snapshot/tests/benchmarkV2Scorer.test.mjs:149-183`
  - missing holdout evidence is rejected instead of silently passing

## Expectation Check

- `[holdout_regression][blocking] Case focus is explicitly covered`
  - Satisfied. The reviewed Phase 7 contract, implementation, and regression tests all preserve guarded promotion/finalization behavior in a feature-agnostic way, so another report-editor feature such as `BCIN-976` remains on the same stable finalization path.
- `[holdout_regression][blocking] Output aligns with primary phase holdout`
  - Satisfied. This artifact is a holdout regression assessment for `BCIN-976`; it does not invent a replay artifact or draft-phase deliverable.

## Limits

I could not execute the Node-based snapshot tests in this workspace because `node` is not installed. The verdict is therefore based on direct review of the skill contract, implementation, bundled tests, and the copied `BCIN-976` fixture evidence.
