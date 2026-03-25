---
name: qa-plan-evolution
description: Evolves an existing skill through a bounded champion-vs-challenger loop. Use whenever the user asks to improve a skill, reduce misses or blind spots in a skill output, compare known defects to generated outputs, add feature-specific knowledge packs, or run repeatable eval-safe skill improvement with a maximum iteration cap.
---

# QA Plan Evolution

## Quick Start (Recommended for 1–2 Feature Families)

If you only have one or two feature families and defect evidence is manually available:

1. **Phase A** — Enrich the feature family knowledge pack with defect-derived gaps
2. **Phase B** — Run `qa-plan-orchestrator` and verify planner output covers those gaps
3. **Phase C** — Run `npm run benchmark:v2:run` against the benchmark; accept if non-regressing

See `docs/SIMPLIFIED_EVOLUTION_MODEL.md` for a detailed walkthrough.

Use the full 7-phase automated pipeline (detailed below) when:
- You have 3+ feature families with real knowledge packs
- Automated defect evidence refresh is required across multiple runs
- Replay evidence must be gated automatically


This skill is the canonical entrypoint for repeatable skill self-improvement in OpenClaw workspaces.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`
2. Interact with the user only for `REPORT_STATE` choices or final approval decisions
3. When any phase prints `SPAWN_MANIFEST: <path>`, spawn from that manifest, wait, then rerun the same phase with `--post`

The orchestrator does not perform evolution logic inline. It does not score candidates manually, rewrite target files inline, or skip validations. All logic must live in scripts and persisted artifacts.

## Required References

Always read:

- `reference.md`

When the target skill is `qa-plan-orchestrator`, also read:

- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`
- `workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md`
- `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
- `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
- `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
- `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`

There is no separate planner workflow file: this skill plus the target docs above are the only entrypoints.

**qa-plan-orchestrator benchmark defaults:**
- **Canonical benchmark command:** `npm run benchmark:v2:run` (from `workspace-planner/skills/qa-plan-orchestrator/`). This invokes `benchmarks/qa-plan-v2/scripts/run_benchmark.mjs`, which uses `benchmark-runner-llm.mjs` as the executor.
- Orchestrator `benchmark_profile`:
  - Use `qa-plan-knowledge-pack-coverage` for blind/holdout-only iterations and knowledge-pack-driven mutation work.
  - Use `qa-plan-defect-recall` when replay evidence is intentionally enabled or defect-derived gaps are the primary driver.
- qa-plan-v2 benchmark manifest profile: `global-cross-feature-v1`
- Default `evidence_mode`: `blind_pre_defect`
  - Use `blind_pre_defect` when starting a new run or when defect fixtures are not yet available.
  - Add `retrospective_replay` only when `defect_analysis_run_key` is explicitly provided by the operator.
  - Do not switch to `retrospective_replay` automatically; newly logged defects must not interfere with the mutation decision.
  - `holdout_regression` cases run as part of the blocking gate without a separate flag.
- Benchmark campaign root: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/`
- Blocking case IDs: see `benchmark_manifest.json` under the benchmark root. A challenger is rejected if any blocking case fails.

After each iteration (Phase 4–5), run the benchmark check:
```bash
node workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/score_iteration.mjs \
  --iteration <n> --profile global-cross-feature-v1
```

For qa-plan iteration comparison:

- Default promotion path: `benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs`
- Synthetic fallback only: `benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs`
- Synthetic scorecards must carry `scoring_fidelity: "synthetic"` and `decision.result: "blocked_synthetic"`; they are not promotion-eligible

For the qa-plan target, the active benchmark is `qa-plan-v2` (not the skill's own `evals/evals.json`). The skill's own evals remain the smoke gate; `qa-plan-v2` cases are the acceptance gate for challenger promotion.

When defect evidence is part of the benchmark, also read:

- `workspace-reporter/skills/defects-analysis/SKILL.md`
- `workspace-reporter/skills/defects-analysis/reference.md`

## Runtime Layout

All artifacts for one evolution run live under `<skill-root>/runs/<run-key>/`:

```text
<skill-root>/runs/<run-key>/
  context/
  drafts/
  candidates/
    iteration-1/
  benchmarks/
  archive/
  jobs/
  task.json
  run.json
  phase1_spawn_manifest.json
  evolution_final.md
```

## Input Contract

Required inputs:

- `target_skill_path`
- `target_skill_name`

Optional inputs:

- `feature_id`
- `feature_family`
- `knowledge_pack_key` (optional for qa-plan; inferred from `feature_family`, then benchmark cases by `feature_id`, else `general`)
- `max_iterations` (default `10`, hard cap `10`)
- `refresh_mode`
- `defect_analysis_run_key`
- `benchmark_profile`

## Output Contract

Always:

- `<skill-root>/runs/<run-key>/task.json`
- `<skill-root>/runs/<run-key>/run.json`
- `<skill-root>/runs/<run-key>/context/evidence_freshness_<run-key>.md`
- `<skill-root>/runs/<run-key>/context/defect_evidence_<run-key>.json` (when defects-analysis evidence is active)
- `<skill-root>/runs/<run-key>/context/gap_taxonomy_<run-key>.md`
- `<skill-root>/runs/<run-key>/context/mutation_backlog_<run-key>.md`
- `<skill-root>/runs/<run-key>/benchmarks/scoreboard_<run-key>.json`
- `<skill-root>/runs/<run-key>/evolution_final.md` (when the run is finalized)

Per iteration:

- `candidates/iteration-<n>/candidate_plan.md`
- `candidates/iteration-<n>/candidate_patch_summary.md`
- `candidates/iteration-<n>/validation_report.md`
- `candidates/iteration-<n>/score.json`
- `candidates/iteration-<n>/decision.md`

## Phase Contract

### Phase 0

- initialize runtime state
- run `REPORT_STATE`
- normalize inputs
- lock `max_iterations`
- detect target-skill family

### Phase 1

- inspect evidence freshness
- bootstrap missing knowledge pack files (`pack.json` + `pack.md`) when required and block until `bootstrap_status` is `ready`
- regenerate missing or stale prerequisites
- **proactively** spawn defects-analysis via `scripts/spawn_defects_analysis.sh` when the profile's `defects_analysis_refresh` is not `"none"` and a `defect_analysis_run_key` or `feature_id` is available — this happens before the freshness blocking gate so analysis always runs first; re-runs phase1 with `--post` after the spawn completes
- persist resolved reporter artifact paths into `context/defect_evidence_<run-key>.json`
- require defect-analysis artifacts when benchmark policy says they are mandatory

### Phase 2

- create gap taxonomy
- classify misses into reusable root-cause buckets
- create bounded mutation hypotheses

### Phase 3

- select one mutation for the current challenger
- rank candidates by: **severity → mutation category → bucket priority → earliest affected phase**
  - `knowledge_pack_enrichment` (targets `knowledge-packs/` files) — highest priority
  - `rubric_update` (targets `review-rubric-*`, `phase4a-contract`, `phase5a/5b` references)
  - `template_update` (targets `SKILL.md`, `reference.md`, or template files)
  - `collection_stage` (targets scripts, phase scripts, or anything else) — lowest priority
- skip mutations whose source gaps were already accepted in prior iterations
- prepare candidate patch plan
- update feature knowledge-pack deltas when required

### Phase 4

- run target skill smoke tests
- run target skill evals
- run qa-plan benchmark comparison
  - default to executed benchmark comparison
  - include replay cases only when `defect_analysis_run_key` is provided
  - treat synthetic comparison as a non-gating fallback only

### Phase 5

- score challenger vs champion
- reject on any blocking regression
- persist acceptance or rejection decision

### Phase 6

- archive the prior champion and accepted candidate snapshot
- restore rejected candidate snapshots to champion baseline before next iteration
- on accepted `--finalize`, promote candidate edits into target skill and create a local git commit
- optional `--auto-push` pushes the finalize commit
- require explicit approval before finalizing an accepted challenger
- stop rejected runs when max iterations or three consecutive rejections is reached
- emit final summary and next-step guidance

## Mutation Priority

When multiple mutations are pending, Phase 3 selects using this four-tier sort:

| Priority | Category | Target file patterns |
|---|---|---|
| 1 (highest) | `knowledge_pack_enrichment` | `knowledge-pack/`, `/pack.json`, `/pack.md` |
| 2 | `rubric_update` | `review-rubric`, `phase4a-contract`, `phase5a`, `phase5b` |
| 3 | `template_update` | `SKILL.md`, `reference.md`, `template` |
| 4 (lowest) | `collection_stage` | scripts, phase runners, anything else |

Within the same category, mutations are further sorted by severity (high → medium → low), then bucket rank, then earliest affected phase.

The bucket rank has been aligned with the category order: `knowledge_pack_gap` is rank 1, `traceability_gap` is rank 8.

## Evolution Rules

1. Do not mutate more than one bounded hypothesis per iteration.
2. Do not accept a challenger that regresses blocking evals or smoke tests.
3. Do not exceed `10` iterations.
4. When defect-analysis evidence is stale, refresh it before proposing skill changes.
5. Feature knowledge-pack requirements must map to concrete scenarios, gates, or explicit exclusions.
6. Preserve target-skill idempotency semantics and runtime state contracts unless the iteration explicitly benchmarks a contract change.

## Scripts

- `scripts/orchestrate.sh [--with-phase0] --run-key ...` — one cycle (phase1–6, optionally phase0)
- `scripts/phase0.sh` … `scripts/phase6.sh` — individual phases
- `scripts/spawn_defects_analysis.sh` — refresh reporter evidence and ensure `gap_bundle_<run-key>.json`
- `scripts/check_runtime_env.sh` — node/jq checks
- `scripts/check_resume.sh` — inspect the canonical operator summary for resume
- `scripts/progress.sh` — read-only async reconciliation and expected-artifact summary

Benchmark profiles for generic targets are defined in `evals/evals.json`. For the `qa-plan-orchestrator` target, the active benchmark is `qa-plan-v2` at `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/` with profile `global-cross-feature-v1`.
