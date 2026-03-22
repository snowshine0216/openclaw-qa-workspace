# Defect Evidence Automation For QA Plan Evolution

## Overview

This document defines the intended outcome for evolving `workspace-planner/skills/qa-plan-orchestrator` through the shared `.agents/skills/qa-plan-evolution` without requiring an operator to manually prepare gap-analysis inputs for each run.

The core requirement is:

1. `qa-plan-evolution` must automatically obtain defect-derived gap evidence when the target skill is `qa-plan-orchestrator` and the selected benchmark profile requires replay or retrospective evidence.
2. `defects-analysis` must remain the producer of defect review artifacts.
3. `qa-plan-evolution` must transform those artifacts into normalized gap observations, mutation hypotheses, and benchmarked candidate changes.
4. `qa-plan-orchestrator` must remain the mutation target, not a manually pre-fixed dependency.

This design exists to prevent a degenerate workflow where the operator manually runs defect analysis, manually prepares gap markdown, then manually feeds that evidence into evolution. That flow defeats the purpose of repeatable skill evolution.

## Problem Statement

The current repository already contains the right conceptual pieces:

1. `defects-analysis` can produce retrospective analysis artifacts.
2. `qa-plan-evolution` already defines gap taxonomy buckets and a qa-plan-specific benchmark path.
3. `qa-plan-v2` already includes replay-oriented benchmark cases for SDK-visible contracts, interaction audits, analog gates, and developer smoke output.

However, the current workflow is still too dependent on operator-prepared evidence. The operator should not have to manually create or curate gap markdown as a precondition to evolving `qa-plan-orchestrator`.

The intended system behavior is:

1. operator selects `qa-plan-orchestrator` as the target skill
2. operator provides feature context such as `feature_id`, `feature_family`, and optionally `knowledge_pack_key`
3. `qa-plan-evolution` determines whether defect evidence is required for the selected profile
4. if required evidence is missing or stale, `qa-plan-evolution` automatically refreshes it by invoking `workspace-reporter/skills/defects-analysis`
5. the evolution run consumes the resulting artifacts and converts them into normalized gap observations
6. candidate mutations are proposed and benchmarked
7. only benchmark-approved mutations are accepted

## Design Goal

The design goal is not "improve `qa-plan-orchestrator` directly before evolution starts."

The design goal is:

1. make `qa-plan-evolution` the owner of defect-evidence acquisition for qa-plan evolution
2. make `defects-analysis` the owner of defect-evidence generation
3. make `qa-plan-v2` the owner of mutation acceptance and regression blocking
4. keep `qa-plan-orchestrator` as the system under evolution

This keeps the workflow faithful to champion-vs-challenger mutation instead of collapsing into a manual redesign process.

## Non-Goals

This design does not require:

1. manually editing `qa-plan-orchestrator` before running evolution
2. manually preparing `*_QA_PLAN_CROSS_ANALYSIS.md` or `*_SELF_TEST_GAP_ANALYSIS.md` before each evolution run
3. embedding defect-analysis logic directly into `qa-plan-orchestrator`
4. weakening the benchmark gate so that structural changes can bypass replay validation

## Primary References

This design is grounded in the following repository artifacts and should explicitly cite them during implementation and review:

1. User-provided retrospective references:
   - `workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
   - `workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
2. Shared evolution contract:
   - `.agents/skills/qa-plan-evolution/SKILL.md`
   - `.agents/skills/qa-plan-evolution/reference.md`
3. Reporter evidence producer:
   - `workspace-reporter/skills/defects-analysis/SKILL.md`
   - `workspace-reporter/skills/defects-analysis/reference.md`
4. Qa-plan target and benchmark references:
   - `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
   - `workspace-planner/skills/qa-plan-orchestrator/reference.md`
   - `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`
   - `workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md`
   - `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/benchmark_manifest.json`

## Target End State

For a qa-plan evolution run, the operator should be able to do only this:

1. choose `target_skill_path=workspace-planner/skills/qa-plan-orchestrator`
2. provide `feature_id`, `feature_family`, and the benchmark profile
3. start the evolution run

The system should do the rest automatically:

1. decide whether defect evidence is required
2. call `defects-analysis` when required evidence is absent or stale
3. consume the generated artifacts
4. classify gaps into evolution taxonomy buckets
5. generate one bounded mutation
6. benchmark the mutation
7. accept or reject it

## Responsibility Split

### `workspace-reporter/skills/defects-analysis`

This skill remains the canonical producer of retrospective defect evidence.

It should produce:

1. human-readable analysis documents for reviewers
2. machine-readable gap data for evolution

It should not:

1. mutate `qa-plan-orchestrator`
2. decide which challenger mutation to apply
3. decide benchmark acceptance

### `.agents/skills/qa-plan-evolution`

This skill becomes the orchestration owner for:

1. deciding when defect evidence is required
2. refreshing that evidence automatically
3. normalizing the evidence into gap taxonomy observations
4. selecting one mutation per iteration
5. running validation and benchmark comparison
6. promoting or rejecting the challenger

It should not require manual defect-gap preparation for normal qa-plan evolution runs.

### `workspace-planner/skills/qa-plan-orchestrator`

This skill remains the target under evolution.

It is the component that receives candidate mutations such as:

1. stronger Phase 4a contract rules
2. stronger Phase 5a interaction review rules
3. stronger Phase 5b analog-gate rules
4. improved developer smoke artifact generation
5. feature-family knowledge-pack improvements

It must not absorb the orchestration responsibility that belongs in `qa-plan-evolution`.

### `qa-plan-v2` benchmark

The benchmark remains the acceptance gate.

It answers:

1. did the challenger improve retrospective replay behavior?
2. did the challenger preserve blind planning quality?
3. did the challenger preserve holdout regression behavior?
4. did the challenger satisfy the required blocking cases?

It does not replace evidence acquisition or mutation planning.

## Required Workflow

### Phase 0

The operator starts an evolution run with:

1. `target_skill_path`
2. `target_skill_name`
3. `feature_id`
4. `feature_family`
5. benchmark profile

The run is initialized normally under:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/
```

### Phase 1: Automatic defect-evidence acquisition

When the target skill is `qa-plan-orchestrator`, Phase 1 must behave as follows:

1. inspect the selected benchmark profile
2. determine whether replay or retrospective defect evidence is required
3. inspect whether a valid defects-analysis run already exists for the feature
4. if the defects-analysis artifacts are missing or stale, invoke `workspace-reporter/skills/defects-analysis` via a dedicated spawn script (`scripts/spawn_defects_analysis.sh`)
   - this script must translate the evolution run's context (`feature_id`) into `defects-analysis` inputs (`issue_key` or `feature_key`)
   - it must pass `invoked_by=qa-plan-evolution`
5. after the defects-analysis run finishes, check whether the `gap_bundle_<run-key>.json` artifact was produced
   - if it is absent, invoke the gap bundle generation phase explicitly via `scripts/spawn_defects_analysis.sh --phase gap-bundle`
   - this is the only trigger path for gap bundle generation; the operator cannot and does not call it directly
6. prefer `smart_refresh` over destructive regeneration when cached evidence is still reusable
7. persist the resulting artifact paths into the evolution run context

This phase must support two input modes:

1. explicit `defect_analysis_run_key`
2. no run key provided, but enough feature context exists to derive or create one automatically

The second mode is the default path for normal operators.

### Phase 2: Gap normalization

Phase 2 must consume the defect-analysis outputs and convert them into normalized observations.

The important point is that benchmark input must not be raw markdown prose. Instead:

1. `defects-analysis` produces readable retrospective markdown (`_SELF_TEST_GAP_ANALYSIS.md` and `_QA_PLAN_CROSS_ANALYSIS.md`)
2. `defects-analysis` also produces a machine-readable gap artifact (`gap_bundle_<run-key>.json`)
3. `qa-plan-evolution` phase 2 implements a structured normalizer (`scripts/lib/defectsCrossAnalysis.mjs`) to read that machine-readable artifact first
4. markdown remains supplemental evidence for audit and human review

The normalized gap observations must map into the shared taxonomy already defined by `qa-plan-evolution`, including:

1. `missing_scenario`
2. `scenario_too_shallow`
3. `analog_risk_not_gated`
4. `interaction_gap`
5. `sdk_or_api_visible_contract_dropped`
6. `developer_artifact_missing`
7. `traceability_gap`
8. `knowledge_pack_gap`

### Phase 3: Mutation planning

Phase 3 must select exactly one bounded mutation based on the normalized gaps.

**Selection Algorithm:**
1. prioritize by severity (`high` > `medium` > `low`)
2. prioritize by root cause bucket (e.g., `developer_artifact_missing` > `analog_risk_not_gated`)
3. if multiple gaps have identical priority, select the one affecting the earliest target Phase (e.g., mutating Phase 4 before Phase 5)

If multiple gaps exist (e.g., all 6 gaps from `BCIN-7289`), the evolution orchestrator will address them sequentially across multiple iterations within the same run. The operator limits this via `max_iterations`. If a challenger is accepted by the benchmark, the orchestrator begins the next iteration by consuming the remaining unaddressed gaps from the same `gap_bundle`.

Examples:

1. strengthen `phase4a-contract.md` so visible SDK outcomes become explicit scenarios
2. strengthen `review-rubric-phase5a.md` so interaction pairs are mandatory
3. strengthen `review-rubric-phase5b.md` so analog risks become blocking gates
4. improve `finalPlanSummary.mjs` so developer smoke output is actionable and deterministic
5. update a feature-family knowledge pack to preserve historical defect knowledge

### Phase 4 and 5: Benchmark-driven acceptance

The mutation is then validated against the canonical qa-plan benchmark.

The benchmark should continue to judge:

1. blocking case pass/fail
2. replay behavior
3. blind planning quality preservation
4. holdout regression preservation

The benchmark should not require an operator to manually construct replay inputs if the evolution orchestrator can derive them from `defects-analysis`.

## Artifact Contract Changes

## 1. `defects-analysis` must produce a machine-readable gap bundle

The missing piece is not more markdown. The missing piece is a deterministic artifact for evolution intake.

Recommended new artifact:

```text
workspace-reporter/skills/defects-analysis/runs/<run-key>/context/gap_bundle_<run-key>.json
```

Minimum schema:

```json
{
  "run_key": "BCIN-7289",
  "generated_at": "2026-03-21T00:00:00Z",
  "feature_id": "BCIN-7289",
  "feature_family": "report-editor",
  "source_artifacts": [
    "BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md",
    "BCIN-7289_SELF_TEST_GAP_ANALYSIS.md"
  ],
  "gaps": [
    {
      "gap_id": "gap-001",
      "root_cause_bucket": "developer_artifact_missing",
      "severity": "high",
      "title": "Developer smoke artifact missing",
      "summary": "P1 scenarios exist in the QA plan but are not converted into a developer-facing smoke checklist.",
      "source_defects": ["BCIN-7667", "BCIN-7677"],
      "affected_phase": "phase7",
      "recommended_target_files": [
        "workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs"
      ],
      "recommended_change_type": "artifact_generation",
      "generalization_scope": "feature_family",
      "feature_family": "report-editor"
    }
  ]
}
```

Markdown artifacts remain required for reviewers, but the gap bundle becomes the primary machine-readable input for evolution.

## 2. `qa-plan-evolution` must treat defects-analysis as a first-class evidence source

The evolution run should persist:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/context/defect_evidence_<run-key>.json
```

This artifact should record:

1. whether the evidence was reused or refreshed
2. which defects-analysis run was selected
3. which files were consumed
4. freshness status
5. whether replay evidence was enabled for this run

## 3. Gap taxonomy must be driven by structured evidence first

`scripts/lib/defectsCrossAnalysis.mjs` should consume the new gap bundle first and fall back to markdown parsing only for backward compatibility.

The fallback parser is transitional only. It should not remain the primary path for qa-plan evolution.

## 4. Gap Bundle Generation: Single-Phase Implementation in `defects-analysis`

### Overview

Gap bundle generation is now implemented as an additive defects-analysis phase. The shared evolution skill can invoke `phase_gap_bundle.sh`, consume `gap_bundle_<run-key>.json`, and fall back to markdown parsing only for backward compatibility. This section records the intended contract for maintaining that implementation.

### Trigger contract

Gap bundle generation is **a single dedicated phase** inside `defects-analysis`:

- It is **not triggered during a normal operator-initiated defects-analysis run**.
- It is **only triggered when `invoked_by=qa-plan-evolution`** is present in the run context.
- It is **only ever called from `qa-plan-evolution`** via `scripts/spawn_defects_analysis.sh --phase gap-bundle`.
- A normal defects-analysis run (invoked by an operator or by another workflow) must complete without running this phase.

This keeps gap analysis a controlled, non-disruptive extension of the defect reporting pipeline.

### Phase name and script

```text
workspace-reporter/skills/defects-analysis/scripts/phase_gap_bundle.sh <raw-input> <run-dir>
```

This script is self-contained and has no dependency on the main phase sequence (phases 0–5). It reads only from already-present `context/` artifacts.

### Inputs (reads from existing run context)

| File | Purpose |
|---|---|
| `context/jira_raw.json` | Source of defect list (keys, summaries, priorities, statuses) |
| `context/pr_impact_summary.json` (optional) | PR-level change context |
| `<run-key>_REPORT_FINAL.md` | Final defect analysis report |
| `context/upstream_qa_plan_metadata.json` (optional) | Upstream QA plan cross-reference |

All these files must already exist from the normal Phase 0–5 run. If `_REPORT_FINAL.md` is absent, the phase must exit with an error.

### Implementation: LLM subagent step

Because gap classification requires reasoning (understanding *why* a defect was missed by the QA plan), the script must invoke an LLM step:

1. `phase_gap_bundle.sh` assembles a structured prompt from the context artifacts.
2. It writes the prompt to:
   ```text
   context/gap_bundle_prompt_<run-key>.md
   ```
3. It emits a `SPAWN_MANIFEST` that instructs `qa-plan-evolution` to run a single subagent with the prompt.
4. The subagent returns a structured JSON response matching the gap bundle schema.
5. `phase_gap_bundle.sh --post` is called after the subagent completes.

### Post-step outputs

The `--post` step must produce all three artifacts:

```text
workspace-reporter/skills/defects-analysis/runs/<run-key>/context/gap_bundle_<run-key>.json
workspace-reporter/skills/defects-analysis/runs/<run-key>/<run-key>_SELF_TEST_GAP_ANALYSIS.md
workspace-reporter/skills/defects-analysis/runs/<run-key>/<run-key>_QA_PLAN_CROSS_ANALYSIS.md
```

- `gap_bundle_<run-key>.json` is the machine-readable artifact consumed by `qa-plan-evolution`.
- `_SELF_TEST_GAP_ANALYSIS.md` is deterministically rendered from the gap bundle (no LLM needed for this step).
- `_QA_PLAN_CROSS_ANALYSIS.md` is deterministically rendered from the gap bundle.

### Prompt contract for the LLM subagent

The generated prompt in `gap_bundle_prompt_<run-key>.md` must instruct the LLM to:

1. Read the defect list and final report.
2. For each defect that was filed *after* the QA plan was completed, classify why it was missed using exactly the taxonomy below:
   - `missing_scenario`
   - `scenario_too_shallow`
   - `analog_risk_not_gated`
   - `interaction_gap`
   - `sdk_or_api_visible_contract_dropped`
   - `developer_artifact_missing`
   - `traceability_gap`
   - `knowledge_pack_gap`
3. Aggregate individual defect misses into gap entries (multiple defects can share one gap root cause).
4. Return a valid JSON object matching the gap bundle schema exactly (no markdown, no preamble).

The LLM must be explicitly instructed to return **only the JSON object** with no prose wrapping so the `--post` step can parse it directly.

### Idempotency rule

If `context/gap_bundle_<run-key>.json` already exists and its `generated_at` timestamp is newer than the `_REPORT_FINAL.md` modification time, the phase must skip re-generation and emit `GAP_BUNDLE_REUSED: <path>` to stdout. `qa-plan-evolution` must handle this token and skip the subagent spawn.

## 5. Defect Feedback Loop (Out of Scope for Core Evolution Engine)

The "gap injection" feedback loop between features (Enhancement 5 in `BCIN-7289`) requires modifying `qa-plan-orchestrator` workflows (adding a Phase 8 or a new tool), rather than being part of the `qa-plan-evolution` core workflow itself. The evolution orchestrator's only role here is to eventually mutate `qa-plan-orchestrator` to add that capability.

## Operator Experience

The operator should not need to do this:

1. run `defects-analysis` manually
2. inspect the generated markdown manually
3. decide which gap markdown should be copied into the evolution run
4. pass those files manually into the benchmark

The operator should only need to do this:

1. select target skill
2. select feature context
3. start the run

Everything else should be handled by the evolution workflow.

## Generalization To Other Feature Families

This design must not stay hardcoded to `BCIN-7289` or `report-editor`.

The correct generalization model is:

1. each defects-analysis run declares `feature_family`
2. each gap bundle records whether a gap is feature-specific or family-general
3. `qa-plan-evolution` aggregates gap evidence by feature family
4. mutations can target:
   - core qa-plan contracts
   - family knowledge packs
   - benchmark cases
5. benchmark holdouts verify that a mutation helping one family does not break another

This allows the same mechanism to evolve qa-plan behavior for:

1. report-editor
2. native-embedding
3. modern-grid
4. visualization
5. export
6. search-box-selector

## Implementation Priority

### Priority 1: automate evidence acquisition

Change the evolution workflow first so it can automatically call `defects-analysis` and record the resulting evidence paths.

Why first:

1. this removes the operator burden immediately
2. this creates a repeatable intake path for all later mutations
3. it preserves the purpose of evolution instead of replacing it with manual setup

### Priority 2: add machine-readable gap output to `defects-analysis`

Why second:

1. markdown-only ingestion is too fragile
2. structured gaps allow deterministic mutation planning
3. the same evidence can later be reused by other families and benchmarks

### Priority 3: tighten benchmark-to-evidence alignment

Why third:

1. replay cases should consume automatically refreshed evidence
2. the benchmark should validate challenger quality, not operator preparation skill

### Priority 4: expand family-aware reuse

Why fourth:

1. once the pipeline works for one feature family, the next scaling lever is family packs and cross-family holdouts

## Acceptance Criteria

This design is successful only when all of the following are true:

1. an operator can start qa-plan evolution without manually generating gap markdown first
2. `qa-plan-evolution` automatically refreshes `defects-analysis` evidence when required
3. `defects-analysis` produces both human-readable and machine-readable gap outputs
4. Phase 2 produces a normalized gap taxonomy from structured evidence
5. Phase 3 proposes evidence-backed bounded mutations
6. benchmark replay cases consume the resulting evidence path without manual wiring
7. accepted mutations improve qa-plan behavior without reducing blind or holdout quality

## Summary

The correct architecture is not:

1. manually fix `qa-plan-orchestrator`
2. run evolution afterward

The correct architecture is:

1. `defects-analysis` automatically generates defect-derived evidence
2. `qa-plan-evolution` automatically refreshes and consumes that evidence
3. `qa-plan-evolution` mutates `qa-plan-orchestrator`
4. `qa-plan-v2` decides whether the mutation is good enough to keep

That is the smallest design that preserves the value of evolution while removing manual gap preparation from the operator workflow.

## References

1. `workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
2. `workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
3. `.agents/skills/qa-plan-evolution/SKILL.md`
4. `.agents/skills/qa-plan-evolution/reference.md`
5. `workspace-reporter/skills/defects-analysis/SKILL.md`
6. `workspace-reporter/skills/defects-analysis/reference.md`
7. `workspace-planner/skills/qa-plan-orchestrator/reference.md`
8. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`
9. `workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md`
10. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/benchmark_manifest.json`
