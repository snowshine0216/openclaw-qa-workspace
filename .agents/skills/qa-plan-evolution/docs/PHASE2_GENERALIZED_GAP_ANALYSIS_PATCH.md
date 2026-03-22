# Phase 2 Generalized Gap Analysis Patch

## Overview

This patch makes Phase 2 evidence-driven without hard-coding `qa-plan-orchestrator` behavior into the shared orchestrator.

The core rule is:

1. `benchmark_profile` selects the gap sources.
2. Gap-source adapters normalize findings into one shared observation model.
3. Phase 2 maps those observations into the shared taxonomy.
4. Phase 2 builds one bounded mutation per hypothesis from normalized observations.

`defects-analysis` is therefore a `qa-plan-*` profile capability, not a universal dependency.

## Goal

Replace placeholder mutation generation with a profile-driven pipeline that works for:

1. `qa-plan-defect-recall`
2. `qa-plan-knowledge-pack-coverage`
3. `generic-skill-regression`
4. future target-skill profiles that provide different evidence sources

## Non-Goals

1. Do not change the Phase 0-6 numbering model.
2. Do not make all skills depend on `defects-analysis`.
3. Do not move target-skill-specific parsing into generic phase entrypoints.
4. Do not auto-apply candidate patches in Phase 2.

## Design Decision

Phase 2 must consume normalized `GapObservation` records from source adapters. The adapters are selected by `benchmark_profile`. The taxonomy and mutation contract remain shared across all target skills.

## Patch To Apply To The Existing Design Doc

Target design doc:

- `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`

### 1. Architecture Section Update

Replace the current Phase 2 description with this rule:

> Phase 2 is profile-driven. It does not directly parse target-specific artifacts inline. Instead, it resolves `gap_sources` from the selected `benchmark_profile`, loads one adapter per enabled source, collects normalized `GapObservation` records, maps them into the shared taxonomy, and derives one bounded mutation candidate per hypothesis cluster.

Add this subsection under `## Architecture` after `### Target skill profile (generalization)`:

#### Gap-source model

Each `benchmark_profile` declares `gap_sources`. A gap source is an adapter-backed evidence input that can produce normalized findings for Phase 2.

Shared orchestrator responsibilities:

1. resolve enabled `gap_sources`
2. invoke the corresponding adapter
3. collect `GapObservation[]`
4. map observations into shared taxonomy buckets
5. create bounded mutation backlog entries

Target-skill responsibilities:

1. provide source artifacts that adapters can read
2. keep source-specific parsing in adapter modules
3. keep target-specific file targeting and eval mapping reviewable in artifacts

Example profile-to-source mapping:

| Profile | Gap sources |
|---|---|
| `generic-skill-regression` | `target_eval_failures`, `contract_drift`, `smoke_regressions` |
| `qa-plan-defect-recall` | `target_eval_failures`, `replay_eval_misses`, `defects_cross_analysis`, `knowledge_pack_coverage` |
| `qa-plan-knowledge-pack-coverage` | `target_eval_failures`, `knowledge_pack_coverage`, `contract_drift` |

### 2. Functional Design 2 Replacement

Replace the current `## Functional Design 2` section with the following behavior.

#### Goal

Derive the gap taxonomy and mutation backlog from profile-declared evidence sources instead of placeholder heuristics.

#### Required Change For Phase 2

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase2.sh`

**Primary implementation module:** `.agents/skills/qa-plan-evolution/scripts/lib/mutationBacklog.mjs`

**New support modules:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/index.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/targetEvalFailures.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/contractDrift.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/smokeRegressions.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/replayEvalMisses.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/knowledgePackCoverage.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/defectsCrossAnalysis.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/lib/gapTaxonomy.mjs`

**Script Purpose:** Build the gap taxonomy and mutation backlog from normalized evidence observations selected by `benchmark_profile`.

**Detailed Implementation:**

1. Load the selected profile from `.agents/skills/qa-plan-evolution/evals/evals.json`.
2. Resolve `gap_sources` from the profile.
3. Invoke one adapter per enabled source.
4. Require adapter outputs to conform to `GapObservation`.
5. Reject Phase 2 when a profile-required source is missing and Phase 1 allowed progress only because the source was optional.
6. Map each observation into one or more shared taxonomy buckets.
7. Cluster related observations into one bounded mutation candidate per hypothesis.
8. Reject any mutation candidate that:
   - has no source observations
   - has empty `target_files`
   - has empty `evals_affected`
   - mixes multiple root-cause hypotheses

### 3. Data Models Section Addition

Add this subsection under `## Data Models`.

#### `GapObservation`

```json
{
  "id": "obs-qa-plan-cross-analysis-001",
  "source_type": "defects_cross_analysis",
  "source_path": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md",
  "summary": "QA plan missed save-dialog interactivity scenario",
  "details": "Known defect indicates the prior QA plan lacked an actionable scenario for dialog completeness and interactivity.",
  "taxonomy_candidates": [
    "missing_scenario",
    "knowledge_pack_gap"
  ],
  "target_files": [
    "workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md",
    "workspace-planner/skills/qa-plan-orchestrator/evals/evals.json"
  ],
  "evals_affected": [
    "defect_recall_replay",
    "knowledge_pack_coverage"
  ],
  "knowledge_pack_key": "report-editor",
  "confidence": "high",
  "blocking": true
}
```

#### `GapSourceResult`

```json
{
  "source_type": "knowledge_pack_coverage",
  "required": true,
  "status": "ok",
  "observations": [
    {
      "id": "obs-pack-001"
    }
  ],
  "errors": []
}
```

Allowed `status` values:

1. `ok`
2. `no_findings`
3. `missing_source`
4. `unparseable`
5. `blocked`

#### `MutationCandidate`

```json
{
  "mutation_id": "mut-knowledge-pack-coverage-001",
  "root_cause_bucket": "knowledge_pack_gap",
  "source_observation_ids": [
    "obs-pack-001",
    "obs-qa-plan-cross-analysis-001"
  ],
  "target_files": [
    "workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md",
    "workspace-planner/skills/qa-plan-orchestrator/evals/evals.json"
  ],
  "expected_gain": "Improve report-editor coverage and defect replay recall for save dialog issues.",
  "regression_risk": "medium",
  "evals_affected": [
    "defect_recall_replay",
    "knowledge_pack_coverage"
  ],
  "knowledge_pack_delta": "Add save-dialog completeness and interactivity gates to report-editor knowledge pack.",
  "status": "pending"
}
```

### 4. Evals Manifest Patch

Update `.agents/skills/qa-plan-evolution/evals/evals.json` to add `gap_sources` to each profile.

Required shape:

```json
{
  "id": "qa-plan-defect-recall",
  "gap_sources": [
    "target_eval_failures",
    "replay_eval_misses",
    "defects_cross_analysis",
    "knowledge_pack_coverage"
  ]
}
```

```json
{
  "id": "qa-plan-knowledge-pack-coverage",
  "gap_sources": [
    "target_eval_failures",
    "knowledge_pack_coverage",
    "contract_drift"
  ]
}
```

```json
{
  "id": "generic-skill-regression",
  "gap_sources": [
    "target_eval_failures",
    "contract_drift",
    "smoke_regressions"
  ]
}
```

### 5. Implementation File Patch Map

#### File: `.agents/skills/qa-plan-evolution/scripts/lib/mutationBacklog.mjs`

Replace placeholder logic with three exported steps:

1. `collectGapSourceResults({ repoRoot, runRoot, task, profile })`
2. `buildGapTaxonomy({ sourceResults })`
3. `buildMutationBacklog({ taxonomy, sourceResults, task })`

Expected behavior:

1. no synthetic placeholder gaps
2. all gaps traceable to one or more `GapObservation`
3. all mutations traceable to one or more `GapObservation`

#### File: `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase2.mjs`

Keep it thin. It should:

1. load task/run context
2. call the new Phase 2 library pipeline
3. persist `gap_taxonomy_*` and `mutation_backlog_*`
4. refuse to advance when required source results are `missing_source`, `unparseable`, or `blocked`

#### File: `.agents/skills/qa-plan-evolution/scripts/lib/loadProfile.mjs`

No behavioral change beyond validating that `gap_sources` is an array when present.

#### New directory: `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/`

Each module exports:

```js
export function collect<SourceName>Observations(context) {
  return {
    source_type: '<source_type>',
    required: true,
    status: 'ok',
    observations: [],
    errors: [],
  };
}
```

Rules:

1. adapters only read artifacts
2. adapters do not mutate target files
3. adapters must emit normalized observations
4. adapters may emit `no_findings`
5. adapters must not invent target files without evidence

### 6. Qa-Plan Adapter-Specific Notes

`qa-plan` uses extra adapters but stays inside the same shared Phase 2 pipeline.

#### `defects_cross_analysis`

Reads:

1. `workspace-reporter/skills/defects-analysis/runs/<feature-or-defect>/..._QA_PLAN_CROSS_ANALYSIS.md`
2. `workspace-reporter/skills/defects-analysis/runs/<feature-or-defect>/..._SELF_TEST_GAP_ANALYSIS.md`

Outputs observations such as:

1. missing scenario
2. scenario too shallow
3. interaction gap
4. developer artifact missing

#### `knowledge_pack_coverage`

Reads:

1. target knowledge pack
2. target eval definitions
3. target contract files

Outputs observations when a knowledge-pack requirement does not map to:

1. a scenario
2. a gate
3. an explicit exclusion

### 7. Generic Skill Notes

Generic target skills do not need `defects-analysis`. They can still evolve via:

1. `target_eval_failures`
2. `contract_drift`
3. `smoke_regressions`

This keeps the shared orchestrator reusable for non-planner skills.

## Tests

### Files To Create

1. `.agents/skills/qa-plan-evolution/scripts/test/phase2.test.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/test/gapSources.test.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/test/fixtures/phase2/generic-skill-regression/`
4. `.agents/skills/qa-plan-evolution/scripts/test/fixtures/phase2/qa-plan-defect-recall/`

### Required Test Cases

1. `generic-skill-regression` builds observations without `defects-analysis`.
2. `qa-plan-defect-recall` consumes defects cross-analysis observations when present.
3. required source missing causes Phase 2 failure.
4. optional source missing does not block.
5. mutation backlog rejects empty `target_files`.
6. mutation backlog rejects mixed multi-hypothesis candidates.
7. every mutation candidate retains `source_observation_ids`.

## Validation Expectations

1. No Phase 2 artifact contains placeholder gaps unrelated to real evidence.
2. Every backlog item links back to normalized source observations.
3. `generic-skill-regression` runs without planner-specific dependencies.
4. `qa-plan-*` profiles consume planner-specific evidence only when the profile enables it.
5. Phase 2 output remains stable and diffable across reruns with identical evidence.

## Implementation Checklist

1. Add `gap_sources` to shared benchmark profiles.
2. Create `gapSources/` adapter modules.
3. Refactor `mutationBacklog.mjs` to operate on normalized observations.
4. Update `phase2.mjs` to block on required-source failures.
5. Add fixtures for generic and qa-plan profiles.
6. Add Phase 2 unit and integration tests.

