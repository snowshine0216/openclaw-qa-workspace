# Benchmark Result

## Verdict

FAIL

BCIN-976 stays within the blind customer-only fixture scope, but the phase0 resume contract is not stable. The active phase0 contract requires `apply_user_choice.sh` to handle `reuse` or `resume` after `REPORT_STATE` detection, while the implementation only accepts `full_regenerate` and `smart_refresh`.

## Evidence

1. The active phase0 contract requires `REPORT_STATE` handling plus a post-choice call to `scripts/apply_user_choice.sh`, and it explicitly includes `reuse` for phase0 resume flow. See `skill_snapshot/SKILL.md` lines 79-89.
2. The runtime reference defines `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, and `FRESH`, says `reuse` or `resume` must continue from current state without reset, and again requires `scripts/apply_user_choice.sh <mode> <feature-id> <run-dir>` after the user choice. See `skill_snapshot/reference.md` lines 46-63.
3. The implementation does not satisfy that contract. `skill_snapshot/scripts/lib/applyUserChoice.mjs` lines 18-19 define the only supported modes as `full_regenerate` and `smart_refresh`; lines 60-64 reject any other mode as invalid; lines 116-125 expose the same two-mode CLI.
4. The active docs are also inconsistent for `CONTEXT_ONLY`: `skill_snapshot/SKILL.md` line 89 uses `reuse`, while `skill_snapshot/reference.md` line 52 says `generate from cache`. That inconsistency reinforces that the phase0 resume semantics are not stable.
5. Phase0 alignment itself is present. `skill_snapshot/scripts/lib/runPhase.mjs` lines 104-138 classify `report_state`, set `current_phase` to `phase_0_runtime_setup`, and write phase0 request artifacts. `skill_snapshot/scripts/lib/runPhase.mjs` lines 626-645 write `supporting_issue_request_<feature-id>.md` and `request_fulfillment_<feature-id>.{md,json}`. `skill_snapshot/scripts/lib/workflowState.mjs` lines 205-221 implement `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, and `FRESH`.
6. Test coverage does not protect the missing resume path. `skill_snapshot/tests/applyUserChoice.test.mjs` lines 8-92 and `skill_snapshot/scripts/test/apply_user_choice.test.sh` lines 18-47 cover `full_regenerate`, `smart_refresh`, and invalid-mode rejection, but no `reuse` or `resume` success case.
7. The blind fixture scope is customer-only and valid for this review: `inputs/fixtures/BCIN-976-blind-pre-defect-bundle/materials/BCIN-976.customer-scope.json` lines 44-48 show `customer_signal_present: true` and `customer_issue_policy: "all_customer_issues_only"`.

## Expectation Check

- `[phase_contract][blocking] Case focus is explicitly covered: REPORT_STATE and resume semantics remain stable`: Failed. The documented `reuse` or `resume` path is missing from the mode handler.
- `[phase_contract][blocking] Output aligns with primary phase phase0`: Passed. The snapshot still defines and implements phase0 artifact generation and `REPORT_STATE` classification.

## Conclusion

This benchmark case should be graded as a blocking failure. The skill snapshot is phase0-aligned, but it does not preserve the promised resume semantics for existing draft or final states.
