# P7-DEV-SMOKE-001 Result

## Verdict

**FAIL (blocking)**

The snapshot contains the intended phase7 developer smoke logic, but the shipped phase7 entrypoint does not reliably execute that logic. As a result, the benchmark focus is only satisfied at the helper level, not at the orchestrator-contract level that phase7 is supposed to expose.

## Expectation Check

| Expectation | Status | Evidence |
|---|---|---|
| Case focus is explicitly covered: developer smoke checklist is derived from P1 and analog-gate scenarios | **PARTIAL** | The requirement is explicit in the BCIN-7289 replay evidence: the retrospective enhancement says Phase 7 should generate a developer smoke artifact from all P1 and `[ANALOG-GATE]` scenarios (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:180-202`). The snapshot implementation also does exactly that in `skill_snapshot/scripts/lib/finalPlanSummary.mjs:63-109,184-213`, and the behavior is covered by tests in `skill_snapshot/scripts/test/finalPlanSummary.test.mjs:60-121`. |
| Output aligns with primary phase `phase7` | **FAIL** | The official entrypoint is `scripts/phase7.sh` (`skill_snapshot/SKILL.md:153-157`). In the CLI module, the file-mode entrypoint calls `runPhaseCli()` without awaiting it (`skill_snapshot/scripts/lib/runPhase.mjs:959-960`). In replay, `bash ./skill_snapshot/scripts/phase7.sh BCIN-7289 ./outputs/phase7_replay` exited without producing any phase7 artifacts. Only an explicit awaited module invocation produced `qa_plan_final.md`, `context/finalization_record_BCIN-7289.md`, `context/final_plan_summary_BCIN-7289.md`, and `context/developer_smoke_test_BCIN-7289.md` under `outputs/phase7_replay/`. |

## Evidence Summary

The BCIN-7289 fixture makes the phase7 need concrete. The self-testing gap analysis says the missing developer artifact was the root cause for seven missed defects and prescribes a Phase 7 output that is derived from all P1 and analog-risk scenarios (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md:16-24,90-107,180-202`). The cross-analysis also shows the relevant BCIN-7289 defects map directly to P1 and analog-backed scenarios such as save override, template save, folder visibility, and save dialog completeness (`inputs/fixtures/BCIN-7289-defect-analysis-run/source/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md:16-31,39-57,67-120`). The report-editor knowledge pack preserves the same focus by naming analog gates for folder visibility and save dialog completeness (`skill_snapshot/knowledge-packs/report-editor/pack.md:12-25`).

The implementation path is present. `runPhase7` promotes the final draft and then calls `generateFinalPlanSummaryFromRunDir` (`skill_snapshot/scripts/lib/runPhase.mjs:152-174`). That helper writes `context/developer_smoke_test_<feature-id>.md` and populates it from every non-top-level bullet tagged `<P1>` or `[ANALOG-GATE]` (`skill_snapshot/scripts/lib/finalPlanSummary.mjs:63-109,184-213`). The README also states that Phase 7 produces `developer_smoke_test_<feature-id>.md` derived from P1 and `[ANALOG-GATE]` scenarios (`skill_snapshot/README.md:13-23`).

The contract is inconsistent, and the shipped phase entrypoint is the blocker. `SKILL.md` phase7 text only mentions `final_plan_summary_<feature-id>.md` and not the developer smoke artifact (`skill_snapshot/SKILL.md:153-157`). `reference.md` Phase 7 artifact families also omit `developer_smoke_test_<feature-id>.md` (`skill_snapshot/reference.md:205-208`). More importantly, the executable file-mode entrypoint does not await `runPhaseCli()` (`skill_snapshot/scripts/lib/runPhase.mjs:959-960`). In this replay environment that defect is observable: the shell entrypoint returned without generating any phase7 outputs, while an explicit awaited invocation of `runPhaseCli(['phase7', ...])` did generate the expected phase7 artifacts under `outputs/phase7_replay/`, including [`developer_smoke_test_BCIN-7289.md`](/var/folders/l6/943vfmlj0_70tww5dbqq4cr40000gq/T/qa-plan-benchmark-runner-8mi0QD/outputs/phase7_replay/context/developer_smoke_test_BCIN-7289.md).

## Conclusion

The skill snapshot demonstrates the intended phase7 developer smoke behavior, but the benchmark case is not satisfied because the orchestrator-facing phase7 entrypoint is not dependable. This is blocking for a phase7 checkpoint case.

## Minimal Remediation

1. Fix the CLI entrypoint by awaiting `runPhaseCli()` in `skill_snapshot/scripts/lib/runPhase.mjs`.
2. Update the phase7 contract in `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md` so `developer_smoke_test_<feature-id>.md` is an explicit Phase 7 artifact.
3. Keep the existing extraction behavior from `finalPlanSummary.mjs`, which already derives the smoke checklist from P1 and `[ANALOG-GATE]` scenarios.
