# RE-DEFECT-FEEDBACKLOOP-001

## Verdict

Advisory verdict: not satisfied.

## Phase8 Contract Review

The current `qa-plan-orchestrator` snapshot does not expose a native Phase 8 runtime contract. `SKILL.md` defines phases `0` through `7` only, with the last scripted step being finalization in Phase 7 (`skill_snapshot/SKILL.md:77-157`). The closest existing checkpoints are:

- Phase 5b shipment-checkpoint review and release recommendation (`skill_snapshot/README.md:49-50`, `skill_snapshot/references/review-rubric-phase5b.md:5-29`)
- Phase 7 developer smoke generation from promoted plan content (`skill_snapshot/README.md:20-23`, `skill_snapshot/scripts/lib/finalPlanSummary.mjs:79-109`, `skill_snapshot/scripts/lib/finalPlanSummary.mjs:202-213`)

That is a useful adjacent behavior, but it is not a declared `phase8` contract.

## Defect Feedback Loop Assessment

The snapshot has a partial precursor for historical-defect reuse, but not the blind-safe feedback loop required by this case.

What exists:

- Phase 4a requires knowledge-pack items to map to scenarios, release gates, or explicit exclusions (`skill_snapshot/references/phase4a-contract.md:68-73`).
- Phase 5a forbids acceptance while any knowledge-pack capability or required interaction pair lacks mapped coverage (`skill_snapshot/references/review-rubric-phase5a.md:96-99`).
- Phase 5b requires relevant historical analogs to appear as explicit `[ANALOG-GATE]` items in the release recommendation or developer-smoke follow-up (`skill_snapshot/references/review-rubric-phase5b.md:22-29`, `skill_snapshot/references/review-rubric-phase5b.md:76-77`).
- The report-editor knowledge pack hard-codes two analog gates, sourced from `DE332260` and `DE331555` (`skill_snapshot/knowledge-packs/report-editor/pack.json:12-23`).

What is missing for this benchmark:

- The blind bundle is customer-only by contract (`benchmark_request.json:19-33`).
- The copied customer-scope export for `BCIN-7289` reports `customer_signal_present: false` and no explicit customer references (`inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json:10-18`).
- The copied adjacent-issues export contains prior defects, but the same export reports `support_signal_issue_keys: []` and `customer_signal_present: false` (`inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json:4-7`, `inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json:154-155`).
- The workflow explicitly keeps supporting issues in `context_only_no_defect_analysis` mode and forbids routing them into defect-analysis behavior (`skill_snapshot/SKILL.md:18-22`, `skill_snapshot/README.md:53-58`, `skill_snapshot/references/context-coverage-contract.md:21-29`).

Result:

The snapshot does not show a runtime mechanism that reads eligible prior customer defects from the provided blind fixture and injects them into the next-feature QA plan. Instead, it relies on pre-modeled knowledge-pack analog gates. That is weaker than the benchmark focus, which requires an explicit defect feedback loop from prior defects into the next plan.

## Expectation Check

| Expectation | Result | Evidence |
| --- | --- | --- |
| `[phase_contract][advisory] Case focus is explicitly covered: defect feedback loop injects scenarios from prior defects into next feature QA plan` | Not met | Historical analog handling exists, but it is knowledge-pack driven and not injected from the blind customer-only fixture for `BCIN-7289` (`skill_snapshot/references/review-rubric-phase5b.md:22-29`, `skill_snapshot/knowledge-packs/report-editor/pack.json:12-23`, `inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json:10-18`). |
| `[phase_contract][advisory] Output aligns with primary phase phase8` | Not met | The authoritative snapshot defines phases `0` through `7` only and provides no Phase 8 entrypoint or artifact contract (`skill_snapshot/SKILL.md:77-157`). |

## Minimum Change Needed

To satisfy this case without breaking the current blind policy, the workflow would need one explicit post-review checkpoint, whether named `phase8` or folded into an existing late phase, that:

1. reads prior-defect candidates from saved run artifacts under the customer-only blind policy,
2. injects eligible prior-defect scenarios or gates into the active QA plan, and
3. records an explicit zero-case outcome when no eligible customer defects exist instead of silently falling back to generic analog gates.
