# Benchmark Result: P0-IDEMPOTENCY-001

Verdict: FAIL (blocking)

- Feature: `BCIN-976`
- Feature family: `report-editor`
- Primary phase: `phase0`
- Evidence mode: `blind_pre_defect`

## Scope

Blind feature evidence stayed within the copied customer-only bundle. `BCIN-976.customer-scope.json` confirms `BCIN-976` is a customer-signaled report-editor feature under `all_customer_issues_only`, with explicit customer references and no non-customer issue expansion.

## Phase 0 Assessment

What works:

- The phase0 contract is defined as runtime setup plus `REPORT_STATE` classification and request artifact generation in `skill_snapshot/SKILL.md:79-89`.
- Runtime state classification is implemented in `skill_snapshot/scripts/lib/workflowState.mjs:205-221`, which returns `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, or `FRESH` from final, draft, and context artifact presence.
- Phase0 calls that classifier and writes request-fulfillment artifacts in `skill_snapshot/scripts/lib/runPhase.mjs:104-138` and `skill_snapshot/scripts/lib/runPhase.mjs:626-645`.
- Existing request-fulfillment state is intentionally preserved across reruns via `mergeRequestFulfillment` in `skill_snapshot/scripts/lib/runPhase.mjs:864-882`, and the phase0 shell test includes `test_reuse_preserves_existing_request_fulfillment` in `skill_snapshot/scripts/test/phase0.test.sh:102-141`.

Blocking failure:

- The documented non-fresh resume path is not implemented.
- `skill_snapshot/SKILL.md:89` says phase0 must offer `full_regenerate`, `smart_refresh`, and `reuse`, then continue from the current phase on `reuse`.
- `skill_snapshot/reference.md:50-63` likewise documents `reuse / resume` behavior for `FINAL_EXISTS` and `DRAFT_EXISTS`, with no-reset continuation after `scripts/apply_user_choice.sh`.
- The actual handler only accepts `full_regenerate` and `smart_refresh` in `skill_snapshot/scripts/lib/applyUserChoice.mjs:18-19`, rejects any other mode in `skill_snapshot/scripts/lib/applyUserChoice.mjs:60-64`, and only emits next phases for those two modes in `skill_snapshot/scripts/lib/applyUserChoice.mjs:116-129`.
- The bundled tests also cover only `full_regenerate`, `smart_refresh`, and invalid-mode rejection in `skill_snapshot/scripts/test/apply_user_choice.test.sh:18-52` and `skill_snapshot/tests/applyUserChoice.test.mjs:8-103`.

Conclusion:

`REPORT_STATE` classification itself exists, but the required resume semantics are not stable because the contract advertises `reuse` / `resume` while the implementation rejects those modes. That is a blocking phase0 contract miss for this case family.

## Expectation Status

- `[phase_contract][blocking] Case focus is explicitly covered: REPORT_STATE and resume semantics remain stable` -> FAIL
- `[phase_contract][blocking] Output aligns with primary phase phase0` -> PASS

## Execution Limits

Targeted runtime verification was partially blocked by the workspace image: the bundled phase0 and apply-choice scripts depend on `node`, and the local environment does not provide it. See `outputs/phase0_test.log` and `outputs/applyUserChoice_node_test.log`. This blocker does not change the source-level contract mismatch above.
