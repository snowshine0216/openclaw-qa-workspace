# QA Plan Evolution Remediation Plan

## Overview

This plan converts the current `qa-plan-evolution` MVP into a design-compliant implementation, with `qa-plan-orchestrator` as the first full target and `generic-skill-regression` preserved as the minimal reusable path.

This plan is implementation-ready. It defines:

1. files to change
2. files to create
3. expected content changes
4. validation expectations
5. execution order

## Architecture

### Current implementation status

1. Phase entry scripts exist and the generic happy-path integration test passes.
2. `generic-skill-regression` is implemented through the shared gap-source pipeline.
3. `qa-plan-*` profiles have implemented evidence refresh, Phase 2 gap derivation, replay gating, and target-skill hooks; the remaining work is documentation and artifact alignment.

### Target state

The shared orchestrator must:

1. preserve the Phase 0 / `REPORT_STATE` model
2. remain profile-driven
3. keep target-specific logic in adapters and target-skill artifacts
4. publish reviewable artifacts at each phase
5. reject regressions via benchmark-based scoring

## Functional Design 1

### Goal

Implement the orchestrator contract for manifest-driven refresh and rerun behavior.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/orchestrate.sh`
2. `.agents/skills/qa-plan-evolution/SKILL.md`
3. `.agents/skills/qa-plan-evolution/reference.md`

**Files to create:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/manifestRunner.mjs`

**Expected content changes:**

1. `orchestrate.sh`
   - detect `SPAWN_MANIFEST: <path>` in phase output
   - dispatch the manifest
   - wait for completion
   - rerun the same phase with `--post`
2. `manifestRunner.mjs`
   - validate manifest shape
   - execute supported manifest actions
   - return exit status and rerun signal
3. `SKILL.md` and `reference.md`
   - align runtime behavior with the implemented manifest loop

**Validation expectations:**

1. A phase that emits a manifest no longer aborts the whole run.
2. The rerun path is deterministic and artifact-safe.

## Functional Design 2

### Goal

Make Phase 1 freshness and blocking rules profile-driven and correct.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/evidenceFreshness.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/evidence/adapters/qa-plan.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase1.mjs`
4. `.agents/skills/qa-plan-evolution/evals/evals.json`

**Expected content changes:**

1. `evidenceFreshness.mjs`
   - distinguish required vs optional evidence
   - block on `missing` or `stale` required inputs
   - surface source-specific freshness metadata
2. `qa-plan.mjs`
   - validate knowledge-pack presence and version
   - validate defects-analysis freshness metadata
3. `phase1.mjs`
   - emit a real refresh manifest for required stale dependencies
   - refuse Phase 2 when required evidence is unresolved
4. `evals/evals.json`
   - declare required evidence hooks per profile

**Validation expectations:**

1. Missing `report-editor` knowledge pack blocks `qa-plan-defect-recall`.
2. Optional evidence does not block unrelated profiles.

## Functional Design 3

### Goal

Make Phase 2 evidence-driven and generalized across skills.

### Required Change

Use the patch in:

1. `.agents/skills/qa-plan-evolution/docs/PHASE2_GENERALIZED_GAP_ANALYSIS_PATCH.md`

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/mutationBacklog.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase2.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/loadProfile.mjs`
4. `.agents/skills/qa-plan-evolution/evals/evals.json`

**Files to create:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/index.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/targetEvalFailures.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/contractDrift.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/smokeRegressions.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/replayEvalMisses.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/knowledgePackCoverage.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/defectsCrossAnalysis.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/lib/gapTaxonomy.mjs`

**Expected content changes:**

1. remove placeholder backlog generation
2. derive observations from profile-selected gap sources
3. keep shared taxonomy and mutation contract
4. allow generic profiles to evolve without planner-only inputs

**Validation expectations:**

1. Every mutation candidate is evidence-backed.
2. `generic-skill-regression` requires no defects-analysis artifacts.
3. `qa-plan-*` profiles consume planner-specific evidence only when enabled.

## Functional Design 4

### Goal

Implement real Phase 4 validation and Phase 5 scoring for qa-plan profiles.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/runTargetValidation.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase4.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/scoreCandidate.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase5.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/benchmarkCatalog.mjs`

**Expected content changes:**

1. run ordered validation buckets:
   - smoke
   - contract evals
   - replay evals when profile-enabled
   - knowledge-pack coverage or holdout evals when profile-enabled
2. compute real profile metrics:
   - `defect_recall_score`
   - `contract_compliance_score`
   - `knowledge_pack_coverage_score`
   - `regression_count`
3. update run-local and canonical benchmark outputs

**Validation expectations:**

1. recall regression is rejected
2. blocking eval failure is rejected
3. clean improvement without regression is accepted

## Functional Design 5

### Goal

Implement champion promotion and stop rules correctly in Phase 6.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase6.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/snapshot.mjs`
3. `.agents/skills/qa-plan-evolution/reference.md`

**Expected content changes:**

1. archive prior champion on accepted promotion
2. persist accepted and rejected mutation summaries
3. enforce stop on:
   - max iteration
   - no blocking gaps remain
   - three consecutive rejections
   - explicit user stop
4. require explicit approval before final promotion

**Validation expectations:**

1. accepted iteration archives the prior champion and writes final summary artifacts
2. rejected iterations route back to Phase 2 until stop conditions are met

## Functional Design 6

### Goal

Complete the qa-plan target-skill hooks required by the shared orchestrator.

### Required Change

**Files to change:**

1. `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
2. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
3. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`
4. `workspace-planner/skills/qa-plan-orchestrator/scripts/phase7.sh`
5. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs`
6. `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
7. `workspace-planner/skills/qa-plan-orchestrator/README.md`

**Files to create:**

1. `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.md`
2. `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`

**Expected content changes:**

1. `phase4a-contract.md`
   - require SDK/API visible-outcome scenarios
   - require knowledge-pack item mapping to scenario, gate, or explicit exclusion
2. `review-rubric-phase5a.md`
   - add cross-section interaction audit
   - add knowledge-pack coverage audit
3. `review-rubric-phase5b.md`
   - add explicit `[ANALOG-GATE]` review requirements
4. `phase7.sh` and `finalPlanSummary.mjs`
   - generate deterministic `developer_smoke_test_<feature-id>.md`
   - include P1 plus analog-gate rows
5. `evals/evals.json`
   - add replay and knowledge-pack eval groups
6. `README.md`
   - document knowledge packs, replay evals, and developer smoke output

**Validation expectations:**

1. new replay eval groups fail on known misses before fixes
2. developer smoke artifact is deterministic and diffable

## Functional Design 7

### Goal

Make `defects-analysis` a reusable freshness source for evolution runs.

### Required Change

**Files to change:**

1. `workspace-reporter/skills/defects-analysis/reference.md`
2. `workspace-reporter/skills/defects-analysis/scripts/phase0.sh`
3. `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

**Expected content changes:**

1. emit additive freshness metadata:
   - source issue timestamp
   - PR timestamp
   - upstream QA plan timestamp
   - knowledge-pack version used
2. emit optional evolution-friendly outputs:
   - self-test gap analysis
   - QA plan cross-analysis
3. support regeneration only when stale

**Validation expectations:**

1. existing reporter workflows remain valid
2. additive metadata is available to Phase 1 and Phase 2 adapters

## Tests

### Goal

Raise the test surface to the level required by the design.

### Required Change

**Files to create:**

1. `.agents/skills/qa-plan-evolution/scripts/test/phase0.test.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/test/phase1.test.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/test/phase2.test.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/test/phase3.test.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/test/phase4.test.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/test/phase5.test.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/test/phase6.test.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/test/evidenceFreshness.test.mjs`
9. `.agents/skills/qa-plan-evolution/scripts/test/gapSources.test.mjs`
10. `.agents/skills/qa-plan-evolution/scripts/test/fixtures/phase2/generic-skill-regression/`
11. `.agents/skills/qa-plan-evolution/scripts/test/fixtures/phase2/qa-plan-defect-recall/`

**Files to change:**

1. `.agents/skills/qa-plan-evolution/package.json`
2. `.agents/skills/qa-plan-evolution/scripts/test/run-integration.sh`

**Expected content changes:**

1. include qa-plan-profile coverage in the test matrix
2. keep the generic fixture integration test
3. add manifest/rerun and required-evidence blocking tests

**Validation expectations:**

1. `npm test` covers both generic and qa-plan paths
2. required-source failures are asserted in tests, not just manual review

## Documentation Changes

### Files to change

1. `.agents/skills/qa-plan-evolution/README.md`
2. `.agents/skills/qa-plan-evolution/SKILL.md`
3. `.agents/skills/qa-plan-evolution/reference.md`

### Expected content changes

1. document `gap_sources`
2. document profile-driven evidence and scoring
3. document manifest/rerun behavior
4. document the difference between generic and qa-plan profiles

## Implementation Order

1. manifest-driven orchestration
2. Phase 1 freshness and blocking
3. qa-plan knowledge packs and eval hooks
4. Phase 2 generalized gap analysis
5. Phase 4 validation and Phase 5 scoring
6. Phase 6 promotion and stop rules
7. defects-analysis freshness metadata
8. full test expansion
9. final doc sync

## Quality Gates

- [ ] Manifest-driven rerun path implemented
- [ ] Required evidence blocks correctly by profile
- [ ] Phase 2 uses normalized evidence observations only
- [ ] Qa-plan replay scoring is real, not placeholder
- [ ] Champion promotion and stop rules match the design
- [ ] Qa-plan knowledge-pack and replay hooks exist
- [ ] Defects-analysis emits freshness metadata for evolution runs
- [ ] `npm test` covers generic and qa-plan paths
