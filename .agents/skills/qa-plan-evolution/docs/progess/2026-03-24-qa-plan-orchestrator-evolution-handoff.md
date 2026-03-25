# QA Plan Evolution Handoff

Date: 2026-03-24
Target skill: `workspace-planner/skills/qa-plan-orchestrator`
Feature family: `report-editor`
Feature id: `BCIN-7289`
Mode: `qa-plan-defect-recall`
Defect analysis run key: `BCIN-7289`

## Current State

Primary clean evolution run:
- run key: `qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z`
- run root: `/tmp/qa-plan-evolution-runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z`

Task state:
- `current_phase: "phase2"`
- `current_iteration: 2`
- `rejected_iterations: [1]`
- `consecutive_rejections: 1`

## What Was Fixed

### 1. Evolution runner correctness

Fixed in `qa-plan-evolution`:
- rejected mutations are now persisted and skipped on later iterations in the same run

Relevant files:
- `.agents/skills/qa-plan-evolution/scripts/lib/mutationPlanner.mjs`
- `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase3.mjs`
- `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase6.mjs`

### 2. Snapshot validation reliability

Fixed in the real `qa-plan-orchestrator` tree:
- copied candidate snapshots can now pass smoke off-tree
- canonical skill root can be injected for snapshot validation
- canonical `node_modules` can be linked into snapshots when needed
- local path assumptions around markxmind / workflowState were hardened

### 3. Executed benchmark reliability

Fixed in the real `qa-plan-orchestrator` tree:
- benchmark LLM client retries transient `502` / timeout / fetch failures
- benchmark LLM client now has explicit request timeout handling
- executed compare is resumable and reruns only incomplete run directories

Relevant files:
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/llmApiClient.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/gradingHarness.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs`

Validation:
- `cd workspace-planner/skills/qa-plan-orchestrator && npm test`
- passed after the reliability work

## Executed Compare Result For Iteration 1

The real executed compare for iteration 1 was completed successfully after resumable reruns.

Observed result:
- `comparison_mode: "executed_benchmark_compare"`
- `scoring_fidelity: "executed"`
- final challenger result: `reject`

Observed acceptance summary:
- `blocking_cases_pass: false`
- `blind_pre_defect_non_regression: true`
- `retrospective_replay_improved: true`
- `holdout_regression_non_regression: true`
- `non_target_family_non_regression: true`

Observed score deltas:
- blind primary: `0.9733` vs reference `0.96` (`+0.0133`)
- replay primary: `1.0` vs reference `0.7611` (`+0.2389`)
- holdout primary: `1.0` vs reference `1.0`

## Actual Challenger Blocking Cases From Iteration 1

Only two blocking cases failed for `new_skill` in the executed run:

1. `P1-SUPPORT-CONTEXT-001`
- phase: `phase1`
- mode: `blind_pre_defect`
- pass rate: `2/3`
- failed run: `run-3`
- missed expectations:
  - supporting issues stay `context_only_no_defect_analysis` and produce summaries
  - output aligns with primary phase `phase1`

2. `P3-RESEARCH-ORDER-001`
- phase: `phase3`
- mode: `blind_pre_defect`
- pass rate: `2/3`
- failed run: `run-3`
- missed expectations:
  - Tavily-first then Confluence fallback ordering
  - output aligns with primary phase `phase3`

Everything else required for promotion was non-regressing or improved.

## Iteration 2 Candidate Patch

Iteration 2 candidate was patched only in the candidate snapshot under:
- `/tmp/qa-plan-evolution-runs/qa-plan-orchestrator__report-editor__replay__fresh-start__final-green-baseline__20260324T020710Z/candidates/iteration-2/candidate_snapshot`

Patched files:
- `scripts/lib/spawnManifestBuilders.mjs`
- `scripts/lib/workflowState.mjs`
- `SKILL.md`
- `reference.md`
- `scripts/test/spawnManifestBuilders.test.mjs`

Intent:
- make Phase 1 supporting-issue prompts explicitly state support issues remain `context_only_no_defect_analysis` context evidence and never become defect-analysis triggers
- make Phase 3 deep-research prompts explicitly state Tavily-first ordering and Confluence fallback reason in written artifacts
- tighten generated request requirement success predicates to mirror that wording

Observed validation:
- targeted candidate test passed:
  - `node --test scripts/test/spawnManifestBuilders.test.mjs`
- `phase4 ok: iteration-2`
- `phase5 ok: iteration-2 accept=false blocking=true`

Important note:
- iteration 2 has only been through the standard Phase 4 / Phase 5 path so far
- its current root `iteration-2/scorecard.json` is still synthetic and not promotion-eligible until the real executed compare finishes

## Iteration 2 Executed Compare Status

The real executed compare for iteration 2 was launched outside the sandbox and is resumable.

At handoff time:
- many executed run artifacts already exist under:
  - `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-2/`
- but the compare had not yet finished rewriting top-level executed summary artifacts

Latest observed partial state:
- `execution_requests: 118`
- `completed_gradings: 117`
- `missing_gradings: 1`

Latest remaining incomplete run observed:
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-2/eval-20/old_skill/run-1`

Follow-up checks showed the missing run kept moving across different run dirs, so the resumable compare was still making progress rather than deadlocking on one fixed run.

However, when checked most recently before restart, there was no active long-running compare/runner/grader process still visible from the outer shell, so the remaining work should be resumed by rerunning executed compare again.

## Benchmark Matrix Inconsistency

Still present:
- `benchmark_manifest.json` includes `P4A-MISSING-SCENARIO-001` in `blocking_case_ids`
- `cases.json` marks the same case with `"blocking": false`

This did not block the challenger because `new_skill` passed that case, but the matrix should be normalized later.

## Next Step

1. Rerun the real executed compare for iteration 2 and let resumable compare consume the remaining partial artifacts.
2. Once `iteration-2/benchmark.json` and `iteration-2/scorecard.json` are rewritten as `executed`, inspect whether `P1-SUPPORT-CONTEXT-001` and `P3-RESEARCH-ORDER-001` were actually fixed.

## Iteration 2 Final Executed Result

The real executed compare for iteration 2 completed successfully after multiple resumable reruns.

Final artifact state:
- `execution_requests: 198`
- `completed_gradings: 198`
- `missing_gradings: 0`

Final result:
- `comparison_mode: "executed_benchmark_compare"`
- `scoring_fidelity: "executed"`
- decision: `reject`

Final score summary:
- blind primary: `0.6867` vs reference `0.58` (`+0.1067`)
- replay primary: `0.6944` vs reference `0.8611` (`-0.1667`)
- holdout primary: `1.0` vs reference `1.0`

Acceptance summary:
- `blocking_cases_pass: false`
- `blind_pre_defect_non_regression: true`
- `retrospective_replay_improved: false`
- `holdout_regression_non_regression: true`
- `non_target_family_non_regression: false`

Scorecard reason:
- non-target family regressions:
  - `blind_pre_defect:docs(-0.3334)`
  - `blind_pre_defect:export(-0.2222)`
  - `blind_pre_defect:native-embedding(-0.1111)`

## What Iteration 2 Actually Proved

The narrow Phase 1 / Phase 3 contract-wording patch was not enough.

Observed challenger failures for `new_skill` now include:

Blocking blind/replay cases:
- `P1-SUPPORT-CONTEXT-001` — pass rate `0.6667`
- `P3-RESEARCH-ORDER-001` — pass rate `0.6667`
- `P4A-SDK-CONTRACT-001` — pass rate `0.0`
- `P4A-MISSING-SCENARIO-001` — pass rate `0.6667`
- `P5A-INTERACTION-AUDIT-001` — pass rate `0.6667`
- `P5B-ANALOG-GATE-001` — pass rate `0.6667`
- `RE-P5B-SHIP-GATE-001` — pass rate `0.0`

Advisory/non-target failures expanded substantially in:
- `docs`
- `export`
- `native-embedding`
- plus additional advisory misses in `visualization`, `search-box-selector`, and report-editor advisory blind cases

Practical conclusion:
- iteration 2 improved neither replay nor non-target stability enough
- the mutation was too local and wording-oriented
- the next iteration should not continue with only support/research contract wording tweaks

## Recommended Next Mutation Direction

Next iteration should shift to replay/checkpoint behavior, not just blind contract wording.

Best next focus area:
- `phase4a` / `phase5a` / `phase5b` report-editor replay contracts
- especially:
  - SDK-visible outcomes
  - interaction audit enforcement
  - analog-gate shipment gating
  - blind shipment checkpoint coverage

Secondary constraint:
- explicitly guard non-target blind families from collateral wording regressions
- do not broaden generic phase5b / docs language in ways that flatten family-specific expectations

In other words:
- iteration 1 revealed Phase 1 / Phase 3 blind misses
- iteration 2 showed that a local wording patch is too weak and can hurt broader fidelity
- iteration 3 should target replay/checkpoint evidence handling with tighter report-editor-specific boundaries and better non-target isolation

## Proposed Iteration 3 Mutation Plan

### Goal

Improve report-editor replay/checkpoint fidelity without widening collateral blind regressions in non-target families.

### Primary Cases To Target

Blocking replay / checkpoint cases to improve:
- `P4A-SDK-CONTRACT-001`
- `P5A-INTERACTION-AUDIT-001`
- `P5B-ANALOG-GATE-001`

Blocking blind / shipment case still failing:
- `RE-P5B-SHIP-GATE-001`

Blind contract misses still not solved cleanly:
- `P1-SUPPORT-CONTEXT-001`
- `P3-RESEARCH-ORDER-001`

### Core Strategy

Do **not** continue broad global wording edits in `SKILL.md` / `reference.md` first.

Instead:
- strengthen report-editor-specific replay and shipment-checkpoint requirements where the writer/reviewer actually consume them
- keep those requirements scoped behind active knowledge-pack / report-editor conditions so `docs`, `export`, and `native-embedding` do not inherit unrelated stronger wording

### Files To Change

1. `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`

Required change:
- add a report-editor-specific replay anchor section for SDK-visible outcomes and required scenario coverage, parallel to the earlier report-editor anchor style
- explicitly require:
  - `setWindowTitle` coverage to map to visible scenario leaves
  - prompt-editor / report-builder interaction coverage
  - template-save / prompt-pause / builder-loading chains
  - workstation title correctness on edit

Why:
- directly addresses `P4A-SDK-CONTRACT-001`
- keeps replay-specific report-editor needs local to Phase 4a drafting instead of broadening every family

2. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`

Required change:
- make `Cross-Section Interaction Audit` more concrete for report-editor when the active knowledge pack is `report-editor`
- require explicit audit rows for:
  - `template-based creation` + `pause-mode prompts`
  - `close-confirmation` + `prompt editor open`
  - `save-as-overwrite` + `template-save`
  - `prompt-pause-mode` + `report-builder-loading`
- require the audit to cite concrete `knowledge_pack_row_id` / pair identity instead of generic prose

Why:
- directly targets `P5A-INTERACTION-AUDIT-001`
- avoids non-target regressions by scoping stronger interaction audit only when the report-editor pack is active

3. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`

Required change:
- add a report-editor shipment gate subsection that requires explicit release-gate or scenario coverage for:
  - save dialog completeness/interactivity
  - prompt element loading after interaction
  - template with prompt pause mode running after creation
  - blind shipment checkpoint for prompt lifecycle / template flow / builder loading / close-or-save safety
- require `[ANALOG-GATE]` entries to reference concrete analog row ids and visible outcomes, not generic release text

Why:
- directly targets `P5B-ANALOG-GATE-001`
- likely improves `RE-P5B-SHIP-GATE-001`

4. `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`

Possible targeted change only if needed after reviewing the existing rows:
- add missing canonical keywords for shipment / builder / prompt lifecycle phrasing if the benchmark phrasing is not well aligned with current retrieval terms
- do **not** broaden unrelated families or add generic wording

Why:
- only use this if retrieval mismatch is the root issue
- keep pack edits bounded and evidence-backed

5. `workspace-planner/skills/qa-plan-orchestrator/scripts/test/*` and `tests/*`

Add regression coverage for:
- report-editor-specific Phase 4a anchor presence
- report-editor-specific Phase 5a interaction-audit requirements
- report-editor-specific Phase 5b analog-gate / shipment-gate requirements
- non-target-family isolation (stronger report-editor rules must not become generic requirements for `docs`, `export`, or `native-embedding`)

### Files To Avoid Changing First

Avoid making iteration 3 primarily about:
- `SKILL.md`
- `reference.md`
- generic Phase 1 / Phase 3 wording

Reason:
- iteration 2 already showed that broad contract-language tweaks can move the benchmark in the wrong direction and create non-target blind regressions

### Expected Outcome If Successful

Best-case iteration-3 benchmark effects:
- improve replay pass rates for:
  - `P4A-SDK-CONTRACT-001`
  - `P5A-INTERACTION-AUDIT-001`
  - `P5B-ANALOG-GATE-001`
- improve or at least stabilize `RE-P5B-SHIP-GATE-001`
- preserve non-target blind family scores by keeping the stronger rules report-editor-specific

### Mutation Shape Recommendation

Recommended mutation category:
- `rubric_update`

Recommended write scope:
- Phase 4a / Phase 5a / Phase 5b reference contracts first
- only then pack keywords if the replay case evidence still suggests retrieval mismatch

### Validation Recommendation

For iteration 3:
1. run candidate smoke and contract evals as usual
2. run real executed compare, not synthetic-only interpretation
3. explicitly inspect:
   - replay case deltas for report-editor
   - non-target blind family deltas for `docs`, `export`, `native-embedding`

Promotion should be considered only if replay improves **and** the non-target blind regressions disappear.
