# QA Plan Evolution Status

Date: 2026-03-25
Target skill: `workspace-planner/skills/qa-plan-orchestrator`
Feature family: `report-editor`
Feature id: `BCIN-7289`
Run key: `qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z`
Run root: `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z`

## Current State

This evolution run is finished.

Final run state:
- `overall_status: "completed"`
- `current_phase: "phase6"`
- `current_iteration: 3`
- `accepted_iteration: null`
- `rejected_iterations: [1, 2, 3]`
- `consecutive_rejections: 3`

Important implication:
- there is nothing left to resume inside this run
- the next attempt should start as a new run with a new mutation direction

## Final Benchmark Result

Iteration 3 completed with a real executed compare, not synthetic fallback.

Canonical artifact:
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-3/scorecard.json`

Executed result:
- `comparison_mode: "executed_benchmark_compare"`
- `scoring_fidelity: "executed"`
- decision: `reject`

Acceptance summary:
- `blocking_cases_pass: false`
- `blind_pre_defect_non_regression: true`
- `retrospective_replay_improved: false`
- `holdout_regression_non_regression: false`
- `non_target_family_non_regression: false`

Mode score summary:
- blind primary: `0.6533` vs reference `0.6` (`+0.0533`)
- replay primary: `0.8333` vs reference `0.8611` (`-0.0278`)
- holdout primary: `0.9167` vs reference `1.0` (`-0.0833`)

Non-target blind family deltas:
- `docs: -0.1667`
- `export: -0.0555`
- `native-embedding: -0.1111`

Other blind deltas:
- `report-editor: +0.0833`
- `modern-grid: +0.0833`
- `visualization: +0.25`
- `search-box-selector: +0.0`

Scorecard rejection reason:
- `One or more acceptance checks failed. Non-target family regressions: blind_pre_defect:docs(-0.1667), blind_pre_defect:export(-0.0555), blind_pre_defect:native-embedding(-0.1111).`

## What Iteration 3 Changed

Iteration 3 was a bounded `rubric_update` mutation against the candidate snapshot only.

Changed files:
- `references/phase4a-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `tests/docsContract.test.mjs`

Intent:
- add report-editor-only replay anchors in Phase 4a
- add report-editor-only interaction-audit anchors in Phase 5a
- add report-editor-only shipment-gate anchors in Phase 5b
- prove those stronger rules stay scoped to `report-editor`

Local validation result before executed compare:
- smoke: pass
- contract evals: pass
- docs/manifest regression tests: pass

Practical conclusion:
- the scoped rubric mutation was valid and test-clean
- but it did not improve replay enough
- and it still correlated with blind regressions in unrelated families

## Why The Run Stopped

The run stopped because the workflow policy says to stop after `3` consecutive rejections.

This is expected behavior, not an infrastructure failure.

Final run summary artifact:
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/evolution_final.md`

## What To Do Next

Do not continue mutating this run in place.

Recommended next step:
1. start a fresh evolution run from the current champion baseline
2. use the iteration 3 executed result as evidence input, not as a patch base
3. avoid another rubric-only mutation as the primary move

Recommended next mutation direction:
- shift from report-editor rubric wording to cross-family behavior isolation
- inspect executed failures in `docs`, `export`, and `native-embedding`
- find what report-editor-specific wording or retrieval behavior is still leaking into blind non-target runs
- prefer a mutation in planner/runtime selection logic, retrieval gating, or benchmark-facing collection-stage behavior if that is where the leak actually lives

Concrete follow-up investigation:
1. diff the executed outputs for `old_skill` vs `new_skill` in iteration 3 for:
   - `docs`
   - `export`
   - `native-embedding`
2. identify the exact phrasing or planning behavior that regressed those families
3. separately inspect the replay misses that remained in report-editor despite the new anchors
4. only then pick the next bounded hypothesis

## Suggested Fresh-Run Goal

Use the next run to answer this narrower question:

`How do we improve report-editor replay/holdout fidelity without reducing blind fidelity in docs/export/native-embedding?`

That likely means the next hypothesis should be about:
- family-conditioned retrieval or application of knowledge-pack evidence
- stricter isolation between report-editor-specific anchors and generic planner behavior
- possibly benchmark/runtime path logic rather than more reference-file wording

## Key Artifacts

Executed benchmark result:
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-3/scorecard.json`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-3/benchmark.json`

Run finalization:
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/task.json`
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/run.json`
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/evolution_final.md`

Iteration 3 candidate artifacts:
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/candidates/iteration-3/candidate_plan.md`
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/candidates/iteration-3/candidate_patch_summary.md`
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/candidates/iteration-3/validation_report.json`
- `.agents/skills/qa-plan-evolution/runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/candidates/iteration-3/decision.md`
