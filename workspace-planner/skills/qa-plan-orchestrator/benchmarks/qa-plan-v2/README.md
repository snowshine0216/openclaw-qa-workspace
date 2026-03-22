# QA Plan Benchmark v2

This is the first real multi-case benchmark version for `qa-plan-orchestrator`.

Use this version for meaningful benchmark comparisons and skill-evolution decisions.

Why `v2`:

1. `qa-plan-v1` is a seed benchmark used only to validate infrastructure.
2. `qa-plan-v2` freezes the first real multi-case matrix across features, phases, checkpoints, and replay surfaces.

Do not run evolution comparisons against `qa-plan-v1`.

## Strategy

`qa-plan-v2` is a global benchmark, not a single-feature benchmark.

Recommendation:

1. keep one global benchmark version for `qa-plan-orchestrator`
2. represent multiple feature families inside the case catalog
3. compare candidate skill changes against one shared benchmark surface

Why:

1. the skill is one orchestrator and should be measured against global non-regression
2. single-family benchmarks are too easy to overfit
3. holdout and cross-family protection matter more than per-family local wins

This does not mean every feature family must have the same number of cases. It means they live under one benchmark version and one acceptance policy.

## Why Evidence Mode Matters

Known defects can bias benchmark results.

If a benchmark case is executed using inputs that already contain:

1. linked defects
2. defect-analysis runs
3. self-test gap analysis
4. QA-plan cross-analysis
5. postmortem-derived knowledge created after the original QA planning moment

then the case is no longer a clean forward-looking planning benchmark.

To make that explicit, every case in `qa-plan-v2` must declare `evidence_mode`.

Supported values:

1. `blind_pre_defect`
   - use only customer-issue evidence and exclude non-customer issues
   - define the allowed blind evidence through one frozen `blind_pre_defect_bundle` in `fixtures_manifest.json`
   - use this for true no-regression and predictive planning checks
2. `retrospective_replay`
   - use known defect history and retrospective evidence on purpose
   - use this for skill-improvement and missed-coverage replay
3. `holdout_regression`
   - use unrelated features or cases to prevent overfitting
   - use this as the anti-regression guardrail

### Acceptance intent

As a rule:

1. do not let replay improvements hide blind regressions
2. do not let replay-heavy cases become the only benchmark evidence
3. keep holdout cases green before accepting a skill change

## Files

- `benchmark_manifest.json`
  - benchmark policy
  - defines blocking and advisory case ids
  - defines scoring groups and acceptance policy
- `cases.json`
  - benchmark case catalog
  - one object per case
- `fixtures_manifest.json`
  - frozen fixture inventory used by this benchmark version
- `grading_rubric.md`
  - how graders should judge outputs for this benchmark version
- `iteration-0/`
  - prepared baseline workspace for the current champion skill

## Relationship Between `cases.json` And `benchmark_manifest.json`

Treat them as `catalog` and `policy`.

### `cases.json`

This is the source of truth for case definitions.

Each case defines:

- `case_id`
- `feature_id`
- `feature_family`
- `knowledge_pack_key`
- `primary_phase`
- `kind`
- `evidence_mode`
- `blocking`
- `fixture_refs`
- `benchmark_profile`
- `focus`

Do not inline all raw benchmark materials into `cases.json`.

`cases.json` should stay at the benchmark-intent level. Put Jira ids, design-doc references, GitHub PR references, and other frozen evidence under `fixtures_manifest.json`, then reference the bundle id from `fixture_refs`.

Example:

```json
{
  "case_id": "P5B-ANALOG-GATE-001",
  "feature_id": "BCIN-7289",
  "feature_family": "report-editor",
  "knowledge_pack_key": "report-editor",
  "primary_phase": "phase5b",
  "kind": "checkpoint_enforcement",
  "evidence_mode": "retrospective_replay",
  "blocking": true,
  "fixture_refs": ["BCIN-7289-defect-analysis-run"],
  "benchmark_profile": "global-cross-feature-v1",
  "focus": "historical analogs become required-before-ship gates"
}
```

### `fixtures_manifest.json`

This is the source of truth for frozen evidence bundles.

For `blind_pre_defect`, each case must reference exactly one fixture with:

- `type: blind_pre_defect_bundle`
- `cutoff_policy: all_customer_issues_only`
- `issue_scope.include_issue_classes: ["customer"]`
- `issue_scope.exclude_issue_classes: ["non_customer"]`
- `materials`

Example:

```json
{
  "fixture_id": "BCIN-7289-blind-pre-defect-bundle",
  "type": "blind_pre_defect_bundle",
  "feature_id": "BCIN-7289",
  "feature_family": "report-editor",
  "cutoff_policy": "all_customer_issues_only",
  "issue_scope": {
    "include_issue_classes": ["customer"],
    "exclude_issue_classes": ["non_customer"]
  },
  "materials": [
    {
      "material_type": "jira_feature",
      "source_id_or_url": "BCIN-7289",
      "included_in_blind": true
    }
  ]
}
```

### `benchmark_manifest.json`

This is the source of truth for benchmark behavior.

It defines:

- which case ids are blocking
- which case ids are advisory
- how the benchmark is scored
- how acceptance is decided

Current linkage is by `case_id`:

- `blocking_case_ids`
- `advisory_case_ids`

The benchmark runner validates that every case id named in the manifest exists in `cases.json`.

### Rule

If you add a case to `cases.json`, also classify it in `benchmark_manifest.json`.

### Global benchmark rule

When extending to other features, add them as new cases under the same global benchmark when:

1. they are still evaluating `qa-plan-orchestrator`
2. they share the same overall acceptance policy
3. you want cross-family non-regression protection

Create a new benchmark version instead when:

1. the scoring model changes materially
2. the fixture universe changes materially
3. the benchmark scope changes from one orchestrator to something else
4. the case set changes after real execution has already begun

## How To Add Cases

### When it is safe

You can add or edit cases freely only before real `qa-plan-v2` execution starts.

Once real benchmark runs exist, treat `qa-plan-v2` as frozen.

If you need to change the benchmark after that, create `qa-plan-v3` instead.

### Step 1: Add the case to `cases.json`

Add a new object to `cases.json`.

Example:

```json
{
  "case_id": "P4A-SAVE-OVERRIDE-001",
  "feature_id": "BCIN-7289",
  "primary_phase": "phase4a",
  "kind": "defect_replay",
  "blocking": true,
  "focus": "save override path is represented as an explicit scenario with overwrite confirmation and success criteria"
}
```

### Step 2: Classify the case in `benchmark_manifest.json`

If the case is blocking, add its `case_id` to `blocking_case_ids`.

If the case is advisory, add its `case_id` to `advisory_case_ids`.

Each case should appear in exactly one of those lists.

### Step 3: Regenerate the prepared baseline

Run:

```bash
npm run benchmark:v2:prepare
```

This regenerates:

- `iteration-0/benchmark_context.json`
- `iteration-0/eval-*`
- `iteration-0/spawn_manifest.json`
- `iteration-0/champion_snapshot/`

## Case Field Guide

- `case_id`
  - stable benchmark identifier
- `feature_id`
  - feature or docs target used by the case
- `feature_family`
  - logical product or capability family such as `report-editor`, `dashboard-editor`, or `docs`
- `knowledge_pack_key`
  - the domain pack this case expects the planner to use
- `primary_phase`
  - the main phase or checkpoint this case tests
- `kind`
  - benchmark family
  - current families:
    - `phase_contract`
    - `defect_replay`
    - `checkpoint_enforcement`
    - `holdout_regression`
- `evidence_mode`
  - what kind of evidence the benchmark case is allowed to use
  - supported values:
    - `blind_pre_defect`
    - `retrospective_replay`
    - `holdout_regression`
- `blocking`
  - whether the case is intended to block candidate acceptance
- `fixture_refs`
  - fixture ids this case depends on
  - `blind_pre_defect` cases must reference exactly one `blind_pre_defect_bundle`
- `benchmark_profile`
  - grouping label for the benchmark campaign, currently `global-cross-feature-v1`
- `focus`
  - the exact failure mode or behavior under test

## How To Extend To Other Features

Add new cases for the new feature family in `cases.json`.

Recommended minimum bundle for a new family:

1. one `phase_contract` case
2. one `checkpoint_enforcement` case
3. one `holdout_regression` case

Add `defect_replay` when you have real historical misses for that family.

Example skeleton:

```json
{
  "case_id": "DASH-P5B-GATE-001",
  "feature_id": "BCIN-8100",
  "feature_family": "dashboard-editor",
  "knowledge_pack_key": "dashboard-editor",
  "primary_phase": "phase5b",
  "kind": "checkpoint_enforcement",
  "evidence_mode": "blind_pre_defect",
  "blocking": true,
  "fixture_refs": ["DASH-8100-defect-history"],
  "benchmark_profile": "global-cross-feature-v1",
  "focus": "historical dashboard rendering regressions are promoted to required gates"
}
```

Then update:

1. `benchmark_manifest.json`
   - add the case id to `blocking_case_ids` or `advisory_case_ids`
   - add the new family to `supported_feature_families` when needed
2. `fixtures_manifest.json`
   - register the new fixture ids
3. rerun `npm run benchmark:v2:prepare`

### Choosing `evidence_mode`

Use `blind_pre_defect` when:

1. you want to know whether the skill would have produced a good plan before defects were known
2. the inputs are restricted to customer issues only
3. the inputs exclude non-customer issues and post-defect retrospective analysis

Use `retrospective_replay` when:

1. you intentionally want to test whether known misses are now covered
2. the inputs depend on defect-analysis or gap-analysis artifacts

Use `holdout_regression` when:

1. the case is meant to ensure changes for one family do not degrade another case
2. the case is acting as anti-overfitting protection

## How To Run

### Prepare the baseline workspace

From `workspace-planner/skills/qa-plan-orchestrator/`:

```bash
npm run benchmark:v2:prepare
```

This will:

1. refresh `iteration-0/champion_snapshot/`
2. materialize one `eval-N/` directory per case
3. create `with_skill/run-1..run-3`
4. create `without_skill/run-1..run-3`
5. write `iteration-0/spawn_manifest.json`

### Materialize a batch checklist

`benchmark:v2:batch` requires a completed `benchmark:v2:prepare` run first.

To materialize one baseline-execution batch from the prepared manifest:

```bash
npm run benchmark:v2:batch -- --batch 1
```

This writes:

- `iteration-0/batches/batch-1/batch_manifest.json`
- `iteration-0/batches/batch-1/batch_checklist.md`

Use this when you want a concrete per-batch execution surface without re-reading the full `spawn_manifest.json`.

Batches are for the `iteration-0` baseline workflow. Iteration comparison for challenger scoring is separate and uses `run_iteration_compare.mjs`.

Natural-language command example for an agent:

```text
Materialize benchmark batch 1 for qa-plan-v2 and show me the generated batch manifest and checklist paths.
```

### Materialize a feature-family checklist

To materialize one family-focused execution surface from the prepared manifest:

```bash
npm run benchmark:v2:family -- --family report-editor
```

This writes:

- `iteration-0/families/report-editor/family_manifest.json`
- `iteration-0/families/report-editor/family_checklist.md`

Family materialization filters the prepared `spawn_manifest.json` by `feature_family` while keeping the shared iteration workspace intact.

### Execute the benchmark

Use:

- `iteration-0/spawn_manifest.json`

Each task contains:

- case metadata
- the benchmark prompt
- `with_skill_runs`
- `without_skill_runs`

For `qa-plan-v2`, the prepared baseline currently expects:

- `33` cases
- `3` runs per configuration
- `198` total runs

For one-click batch execution, use:

```bash
npm run benchmark:v2:execute:codex -- --batch 1
```

Equivalent explicit form:

```bash
npm run benchmark:v2:execute -- \
  --batch 1 \
  --executor-script benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs \
  --grader-script benchmarks/qa-plan-v2/scripts/benchmark-grader.mjs
```

For a family-only run, use:

```bash
npm run benchmark:v2:execute:family:codex -- --family report-editor
```

Equivalent explicit form:

```bash
npm run benchmark:v2:execute:family -- \
  --family report-editor \
  --executor-script benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs \
  --grader-script benchmarks/qa-plan-v2/scripts/benchmark-grader.mjs
```

`benchmark:v2:execute:family:codex` is only a convenience wrapper. It pre-fills the standard Codex-backed runner and grader scripts.

Use the plain non-`:codex` command when you want to swap the runner or grader explicitly.

Example with the local fallback grader:

```bash
npm run benchmark:v2:execute:family -- \
  --family report-editor \
  --executor-script benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs \
  --grader-script benchmarks/qa-plan-v2/scripts/benchmark-grader-local.mjs \
  --reuse-executor-output \
  --no-fail-fast
```

Equivalent shortcut:

```bash
npm run benchmark:v2:execute:family:local-grade -- --family report-editor --no-fail-fast
```

This path reuses existing runner outputs when `outputs/`, `timing.json`, and `execution_transcript.log` already exist, and only fills in missing `grading.json` files with the local deterministic grader.

Execution contract:

- the executor script is invoked once per run with `--request <run-dir>/execution_request.json`
- it must write outputs under `run.output_dir`
- it may write `outputs/metrics.json` with `total_tokens`
- the grader script is optional only if the executor itself writes `grading.json`
- the harness writes `timing.json` and refreshes the batch manifest/checklist after execution
- set `CODEX_BIN=/path/to/codex` only when you need to override the installed Codex CLI
- set `CODEX_BENCHMARK_MODEL=<model>` to pin a non-default model for runner/grader calls

Each `execution_request.json` includes:

- case metadata, prompt, expectations, and fixture refs
- isolated copied fixture inputs under `run-dir/inputs/fixtures/`
- `skill_snapshot_path` for `with_skill` runs and `null` for `without_skill`
- canonical paths for `output_dir`, `grading.json`, `timing.json`, and transcript log

### Grade the runs

Each run directory must receive:

- `grading.json`
- `timing.json`
- outputs under `outputs/`

### Aggregate the results

After all runs are graded:

```bash
npm run benchmark:v2:aggregate
```

This writes:

- `iteration-0/benchmark.json`
- `iteration-0/benchmark.md`

### Compute the scorecard

For iteration comparisons after `benchmark.json` exists:

```bash
npm run benchmark:v2:score -- --iteration 1 --comparison-mode executed_benchmark_compare --primary-configuration new_skill --reference-configuration old_skill
```

The scorer evaluates acceptance by `evidence_mode`:

1. no regression on `blind_pre_defect`
2. improvement on `retrospective_replay`
3. no regression on `holdout_regression`

### Executed vs synthetic iteration comparison

- `scripts/run_iteration_compare.mjs` is the promotion path. It assembles `benchmark.json` from real per-run `outputs/`, `grading.json`, and `timing.json`.
- `scripts/lib/publishIterationComparison.mjs` is a synthetic structural fallback. It does not execute the benchmark and cannot promote a challenger.
- Replay cases are opt-in. Without `defect_analysis_run_key`, iteration comparison includes only `blind_pre_defect` and `holdout_regression`.

## Practical Workflow

### Before execution starts

1. edit `cases.json`
2. update `benchmark_manifest.json`
3. run `npm run benchmark:v2:prepare`
4. inspect `iteration-0/spawn_manifest.json`

### After execution starts

1. do not change `qa-plan-v2`
2. if the benchmark definition must change, create `qa-plan-v3`

## Important Distinction

- `qa-plan-v1`
  - seed benchmark
  - infrastructure validation only
- `qa-plan-v2`
  - real multi-case benchmark
  - use this one for meaningful baseline, comparison, and skill-evolution decisions
