# Skill Artifact Root Extraction Plan

## Overview

This plan extracts live benchmark runtime state, live run trees, and runtime snapshots out of skill source folders and into one workspace-root artifact home.

Primary goal:

- stop benchmark trees, snapshots, and live run folders from appearing inside skill packages where `SKILL.md` discovery, repo scans, and agent context assembly can accidentally treat them as active skills

Secondary goals:

- preserve current `REPORT_STATE`, resume, and idempotency behavior
- keep benchmark fixtures and intentionally checked-in frozen benchmark baselines usable as evidence
- provide one canonical artifact-root contract that other skills can reuse later
- migrate all still-supported benchmark families, including `qa-plan-v1`, so the pollution fix is complete rather than partial

Scope decision:

- land this in **two PRs**, not one
- PR1 fixes the highest-risk pollution path with the smallest durable diff:
  - shared artifact-root resolver
  - live run-root migration for `qa-plan-evolution`, `qa-plan-orchestrator`, and `defects-analysis`
  - repo ignore rules
  - explicit discovery-owner contract
- PR2 moves mutable benchmark runtime state and hardens runtime isolation:
  - split definition/archive/runtime roots
  - migrate legacy benchmark runtime trees
  - strengthen overlap/isolation checks
  - add benchmark-specific smoke coverage

This plan assumes the new root will be:

- `workspace-artifacts/skills/`

Rationale:

- it is explicit, not hidden
- it stays at workspace root, away from source-owned skill trees
- it can host both shared-skill and workspace-local-skill artifacts without inventing multiple conventions
- it gives one runtime-only home for live state while letting checked-in archive evidence stay source-owned

## Review Verdict

The current diff does **not fully fix** the pollution problem.

What it does fix:

- benchmark requests now carry a separate `canonical_skill_root` and `skill_snapshot_path`
- benchmark prompts explicitly tell the runner to treat benchmark-local and snapshot-local `SKILL.md` files as evidence only
- tests cover the metadata contract and prompt wording

What it does not fix:

- live artifact trees still physically live under skill-owned directories
- the runtime still copies benchmark `inputs/` and links `skill_snapshot/` into run workspaces without any filesystem-level exclusion mechanism
- the benchmark guard only prevents the canonical root from being *inside* the benchmark tree; it does not eliminate benchmark-owned skill-shaped folders from the repository
- `qa-plan-v1` benchmark runtime trees are still active and still live under the skill source tree
- there is no explicit repo policy saying `workspace-artifacts/` is runtime-only, gitignored, and excluded from skill-discovery / repo-scan inputs

## What Already Exists

- `qa-plan-evolution` already has one canonical run-root chokepoint in [paths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs#L18); this should be redirected, not replaced with a new run model.
- `qa-plan-orchestrator` already centralizes default run-dir resolution and legacy run adoption in [workflowState.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs#L352) and [workflowState.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs#L734); the design should extend those chokepoints rather than spread path logic across every phase shell.
- benchmark v2 already has a path-contract module and tests for canonical skill roots and snapshot separation in [benchmarkSkillPaths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs) and [benchmarkSkillPaths.test.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/tests/benchmarkSkillPaths.test.mjs); this design should evolve that contract, not invent a second one.

## NOT In Scope

- a repo-wide artifact manager for unrelated skills beyond `qa-plan-evolution`, `qa-plan-orchestrator`, and `defects-analysis`
- retiring `qa-plan-v1` in this change set; the supported path remains migration, not deprecation
- rewriting every persisted state file to carry new artifact metadata when existing relative-path semantics already work
- solving generic benchmark fixture hygiene for arbitrary third-party trees beyond the explicit roots mounted by current benchmark runners

## Current Architecture

### Current problem points

1. `qa-plan-evolution` run roots are still anchored under the shared skill package:
   - [paths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs#L18)

2. `qa-plan-orchestrator` run helpers still default to `<skill-root>/runs/<feature-id>`:
   - [save_context.sh](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh#L11)

3. Benchmark requests add the right metadata, but only as request fields:
   - [executeSelectionV2.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/executeSelectionV2.mjs#L145)

4. The runner guidance is prompt-only:
   - [benchmarkRunnerPrompt.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkRunnerPrompt.mjs#L53)

5. The Codex runtime still materializes copied benchmark inputs and optional `skill_snapshot` into the workspace:
   - [codexBenchmarkRuntime.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/codexBenchmarkRuntime.mjs#L34)

6. `qa-plan-v1` benchmark scripts are still shipped and therefore must either migrate or be retired in the same design:
   - [package.json](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/package.json#L7)

### Workflow chart

```text
Today
skill source tree
├── SKILL.md
├── reference.md
├── runs/
├── benchmarks/
│   ├── fixtures/
│   ├── iteration-0/
│   │   ├── champion_snapshot/
│   │   └── eval-*/
│   └── iteration-N/
│       └── candidate_snapshot/
└── scripts/

Target
skill source tree
├── SKILL.md
├── reference.md
├── benchmarks/
│   ├── qa-plan-v1/
│   │   ├── benchmark_manifest.json
│   │   ├── fixtures_manifest.json
│   │   ├── fixtures/
│   │   └── archive/
│   │       └── iteration-0/
│   └── qa-plan-v2/
│       ├── benchmark_manifest.json
│       ├── cases.json
│       ├── fixtures_manifest.json
│       ├── fixtures/
│       └── archive/
│           └── iteration-0/
└── scripts/

workspace-artifacts/skills/
├── shared/
│   └── qa-plan-evolution/
│       └── runs/<run-key>/
├── workspace-planner/
│   └── qa-plan-orchestrator/
│       ├── runs/<feature-id>/
│       └── benchmarks/
│           ├── qa-plan-v1/
│           │   ├── history.json
│           │   ├── iteration-1/
│           │   └── iteration-N/
│           └── qa-plan-v2/
│               ├── history.json
│               ├── iteration-1/
│               │   ├── champion_snapshot/
│               │   └── eval-*/
│               └── iteration-N/
│                   └── candidate_snapshot/
└── workspace-reporter/
    └── defects-analysis/
        └── runs/<run-key>/
```

## Architecture

### Artifact root contract

Introduce one shared resolver module that maps a skill package to its artifact home.

Proposed canonical roots:

- shared skill: `workspace-artifacts/skills/shared/<skill-name>/`
- workspace-local skill: `workspace-artifacts/skills/<workspace-name>/<skill-name>/`

Required invariants:

- source skill directories never own live `runs/`, live benchmark `iteration-*`, or live snapshot directories after migration
- benchmark fixtures, manifests, and intentionally checked-in frozen baselines remain readable and versioned under source-owned benchmark definition/archive trees
- executed iterations, live snapshots, scorecards, and mutable benchmark history move under the artifact root
- `workspace-artifacts/` is runtime-only: it is not a checked-in source tree, not a skill-discovery root, and not a canonical evidence-definition home
- repo-level ignore rules must exclude `workspace-artifacts/` from git and from any repo-scan / context-assembly flows that look for active `SKILL.md` packages
- archive-only benchmark evidence must live under an explicit `archive/` subtree and be treated as frozen evidence, never as an active skill root
- path resolution must support one shared `ARTIFACT_ROOT` override for tests and backfills; existing explicit `--run-root`, `FQPO_RUN_DIR`, and similar workflow-specific overrides remain the escape hatches
- existing state files must still serialize relative paths where portable, absolute paths only at runtime boundaries
- when both legacy in-skill and canonical artifact-root copies exist, runtime reads silently prefer the canonical artifact-root copy
- discovery exclusion must be enforced in-repo by a repo-policy test, not documentation alone

### Discovery owner boundary

The pollution bug has two owners, and this design must name both explicitly:

1. **In-repo owner**
   - any helper, script, or test in this repository that scans for active skill packages must treat `workspace-artifacts/` and source-owned `benchmarks/*/archive/` as excluded inputs unless a caller explicitly asks for evidence files.
   - the in-repo enforcement point is `workspace-planner/skills/qa-plan-orchestrator/tests/workspaceArtifactPolicy.test.mjs`.

2. **External owner**
   - any external skill-discovery or context-assembly system that receives repository paths from this repo must consume an explicit allowlist rooted in source-owned skill trees, never a broad recursive repo scan.
   - if the external owner cannot be changed in this PR series, PR1 still documents the boundary in `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md` and limits the repo-owned side to explicit allowlists and ignore rules.

This plan does **not** assume the in-repo test alone fixes external discovery. It only proves the repository side obeys the contract.

### Folder structure

```text
skill source tree
├── SKILL.md
├── reference.md
├── benchmarks/
│   ├── qa-plan-v1/
│   │   ├── benchmark_manifest.json
│   │   ├── fixtures_manifest.json
│   │   ├── fixtures/
│   │   └── archive/
│   └── qa-plan-v2/
│       ├── benchmark_manifest.json
│       ├── cases.json
│       ├── fixtures_manifest.json
│       ├── fixtures/
│       └── archive/
└── scripts/

workspace-artifacts/
└── skills/
    ├── shared/
    │   └── qa-plan-evolution/
    │       ├── runs/
    │       └── logs/
    ├── workspace-planner/
    │   └── qa-plan-orchestrator/
    │       ├── runs/
    │       └── benchmarks/
    │           ├── qa-plan-v1/
    │           │   ├── history.json
    │           │   ├── iteration-1/
    │           │   └── iteration-N/
    │           └── qa-plan-v2/
    │               ├── history.json
    │               ├── iteration-1/
    │               └── iteration-N/
    └── workspace-reporter/
        └── defects-analysis/
            └── runs/
```

### Migration principles

1. Keep source-of-truth behavior separate from source-of-truth code.
2. Treat live benchmark snapshots as runtime artifacts, and treat intentionally checked-in baselines as archive evidence.
3. Make path resolution centralized before moving files.
4. Support a compatibility read window so existing runs can still resume.
5. Update docs and tests in the same change set as runtime code.
6. Prefer boring precedence rules: canonical artifact-root silently wins over legacy when both exist.
7. Move only runtime-owned state under `workspace-artifacts/`; checked-in definitions and frozen archive evidence stay under source-owned benchmark trees.
8. Sequence the work so shared resolver and live run-path migration land before benchmark runtime relocation and policy enforcement.

### Delivery strategy

This design lands in two PRs.

PR1: run roots and discovery boundary

1. add the shared resolver and lock the override contract
2. migrate live run roots for `qa-plan-evolution`, `qa-plan-orchestrator`, and `defects-analysis`
3. update repo ignore rules plus source-owned docs to define the runtime-only boundary
4. add the in-repo policy guard and document the external discovery owner

PR2: benchmark runtime relocation and isolation

1. split benchmark definition/archive roots from benchmark runtime roots
2. migrate legacy benchmark runtime state for `qa-plan-v1` and `qa-plan-v2`
3. enforce runtime isolation with realpath-aware overlap checks
4. update benchmark smoke/integration coverage

## Functional Design 1

### Goal

Create a shared artifact-path API and switch callers from hardcoded `<skill-root>/runs` and `<skill-root>/benchmarks` assumptions to canonical artifact-root resolution.

### Required Change for Each Phase

#### Phase A: Add shared resolver

Create:

- `.agents/skills/lib/artifactRoots.mjs`

Expected content changes:

- export helpers to resolve:
  - repo root
  - workspace artifact root
  - skill artifact root by workspace and skill name
  - run root
  - benchmark runtime root
- support `ARTIFACT_ROOT` for tests and backfills
- do not add benchmark-family-specific or tool-specific artifact-root env vars; rely on existing explicit run-root overrides where a workflow already has one

Non-goal:

- do not turn this module into a generic benchmark-definition registry; benchmark definition roots stay local to the benchmark packages

#### Phase B: Convert current hardcoded callers

Modify:

- [.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs)
- [.agents/skills/qa-plan-evolution/scripts/lib/phases/common.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/phases/common.mjs)
- [.agents/skills/qa-plan-evolution/scripts/orchestrate.sh](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/orchestrate.sh)
- [workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh)
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_context.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`

Expected content changes:

- replace direct `<skill-root>/runs/...` defaults with artifact-root lookups
- keep `FQPO_RUN_DIR` / `--run-root` override semantics intact
- keep legacy migration logic, but make it point from old in-skill locations to new artifact locations

#### Validation expectations

- unit tests prove each resolver maps to the correct workspace-root artifact path
- existing run-root override tests still pass
- old runs under in-skill locations can still be resumed during the compatibility window
- PR1 does not yet relocate benchmark iteration trees; it only gives them a future canonical root contract

## Functional Design 2

### Goal

Move `qa-plan-orchestrator` benchmark execution state out of the skill source tree while keeping the benchmark package contract intact for every still-supported benchmark family.

### Required Change for Each Phase

#### Phase A: Split static benchmark definition from executed benchmark state

Keep in source tree:

- `benchmark_manifest.json`
- `cases.json`
- `fixtures_manifest.json`
- `fixtures/`
- scripts and rubric docs
- `archive/` for intentionally checked-in frozen benchmark baselines

Applies to:

- `benchmarks/qa-plan-v1/`
- `benchmarks/qa-plan-v2/`

Move to artifact root:

- mutable `history.json`
- live `iteration-*`
- live `champion_snapshot/`
- live `candidate_snapshot/`
- `eval-*/`
- generated benchmark summaries and scorecards

Expected content changes:

- add benchmark-path helpers so “definition root” and “runtime root” are distinct
- add an explicit `benchmarkArchiveRoot` for checked-in frozen baselines that must remain versioned
- rename variables where needed to stop overloading one `benchmarkRoot` for both concepts
- keep benchmark manifests and fixtures checked in under the source benchmark tree; do not duplicate them under `workspace-artifacts/`
- move any intentionally preserved checked-in baseline evidence under `benchmarks/<family>/archive/` so archive-only material is clearly separated from live runtime roots

#### Phase B: Update benchmark runtime callers

Modify:

- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1/scripts/run_iteration0.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1/scripts/lib/iteration0Benchmark.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_benchmark.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkV2.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/executeSelectionV2.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/gradingHarness.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/iterationCompareCommon.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/scoreBenchmarkV2.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/batchRunnerV2.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/familyRunnerV2.mjs`

Expected content changes:

- use `benchmarkDefinitionRoot` for checked-in manifests and fixtures
- use `benchmarkArchiveRoot` for checked-in frozen baseline evidence
- use `benchmarkRuntimeRoot` for iterations, history, snapshots, scorecards, and batch outputs
- make `canonical_skill_root` point to source skill root
- make `skill_snapshot_path` point to runtime snapshot under the artifact root
- extend path validation so benchmark runtime roots are never inside skill source roots
- migrate `qa-plan-v1` runtime outputs under `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1/` or explicitly remove support for `qa-plan-v1` in the same change set; this design chooses migration, not retirement
- update the `qa-plan-v1` library-level path helpers in `scripts/lib/iteration0Benchmark.mjs`, not only the top-level runner, so `DEFAULT_BENCHMARK_ROOT`, `getIterationDir`, snapshot seeding, and eval workspace creation all root under `workspace-artifacts/`
- stop all new writes to source-owned `archive/` trees after migration; archive roots become read-only evidence
- legacy benchmark runtime migration uses the same boring precedence rule as live runs:
  - canonical runtime root silently wins if already present
  - legacy source-tree benchmark runtime is adopted only when the canonical runtime root is absent
  - migration is atomic at the benchmark-family runtime-root level, not file-by-file
  - same-filesystem moves may use `rename`
  - cross-filesystem moves must stage-copy under the artifact root, validate, then promote
  - failed migration must remove incomplete staging output and leave the canonical runtime root absent
  - if both legacy and canonical benchmark runtime roots exist and differ, runtime uses canonical and records a machine-readable divergence note in benchmark metadata

#### Phase C: Strengthen isolation at runtime

Modify:

- [workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/codexBenchmarkRuntime.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/codexBenchmarkRuntime.mjs)
- [workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkRunnerPrompt.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkRunnerPrompt.mjs)
- [workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs)

Expected content changes:

- treat `forbidden_skill_roots` as runtime policy, not metadata only
- when materializing benchmark workspaces, ensure no benchmark-owned `SKILL.md` trees are present except the explicitly mounted `skill_snapshot/`
- ensure source-owned archive trees are mounted only as read-only evidence roots when a test or replay intentionally references them
- fail fast if source skill root, runtime snapshot root, and fixture roots overlap unexpectedly
- normalize compared paths through realpath resolution before overlap checks so symlink aliases cannot bypass isolation rules

#### Validation expectations

- benchmark prepare/run/aggregate tests pass with runtime state rooted under `workspace-artifacts/`
- `qa-plan-v1` benchmark prepare/aggregate paths also write only under `workspace-artifacts/`
- no executed benchmark output is written inside `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-*`
- no executed benchmark output is written inside source-owned `benchmarks/*/archive/`
- request payload tests assert split definition/runtime roots, not only metadata fields
- benchmark migration tests prove failed `rename`/copy promotion cannot leave a half-written canonical benchmark runtime root
- dual-root benchmark tests prove canonical silently wins when legacy and canonical runtime trees coexist

## Functional Design 3

### Goal

Move live run artifacts for `qa-plan-evolution`, `qa-plan-orchestrator`, and dependent reporter runs to the artifact root without breaking resume or migration.

### Required Change for Each Phase

#### Phase A: qa-plan-evolution

Modify:

- [.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs)
- `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase0.mjs`
- `.agents/skills/qa-plan-evolution/scripts/check_resume.sh`
- `.agents/skills/qa-plan-evolution/scripts/progress.sh`
- `.agents/skills/qa-plan-evolution/scripts/orchestrate.sh`

Expected content changes:

- canonical run root becomes `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/`
- pruning operates on artifact-root siblings, never inside the skill package
- `.canonical-run-root` pointers continue to work for explicit overrides and existing tmp roots

#### Phase B: qa-plan-orchestrator

Modify:

- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runtimeEnv.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_context.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs`

Only touch individual `phase*.sh` wrappers if a wrapper still computes or exports a run path after the central chokepoints are updated.

Expected content changes:

- canonical run root becomes `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/runs/<feature-id>/`
- `FQPO_RUN_DIR` remains the escape hatch for explicit non-canonical runs
- legacy in-skill runs can be adopted or migrated on first write
- when both a legacy in-skill run and a canonical artifact-root run exist, all resume/read logic silently prefers the canonical artifact-root run
- first-write migration must be atomic at the run-directory level:
  - acquire a per-run migration lock before any rename or staged copy so concurrent resumes cannot migrate the same run twice
  - prefer `rename` when source and destination are on the same filesystem
  - otherwise copy into a staging directory under the artifact root and promote only after the copy completes
  - if staging copy fails, delete the incomplete staging directory and leave the canonical destination absent
  - if a second process loses the lock, it re-reads the canonical destination and uses that result instead of retrying migration
- dual-root divergence is not a prompt case; runtime still silently prefers canonical, but the implementation should record a machine-readable note in run metadata when both roots exist and differ

#### Phase C: defects-analysis dependency surface

Modify:

- `workspace-reporter/skills/defects-analysis` run-path helpers and any scripts that hardcode `runs/`
- `.agents/skills/qa-plan-evolution/scripts/spawn_defects_analysis.sh`
- benchmark fixtures or docs that point at reporter run paths

Expected content changes:

- reporter live runs move to `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/<run-key>/`
- historical paths in frozen fixtures stay frozen as source references only when intentionally versioned

#### Validation expectations

- resume checks work for pre-migration and post-migration runs
- dual-root tests prove canonical silently wins when both roots exist
- migration atomicity tests prove failed copy/rename attempts cannot leave a half-written canonical run directory behind
- divergence tests prove canonical wins deterministically even when legacy and canonical contents differ
- no new `runs/` directories are created under migrated skill source trees
- end-to-end smoke runs for qa-plan-evolution and qa-plan-orchestrator produce artifacts only under `workspace-artifacts/`

## Data Models

### Artifact location metadata

State files that currently store relative locations should continue to do so, but relative to the new canonical artifact root when the target is runtime-owned.

Default rule:

- add **no new persistent metadata fields** in PR1 unless an active resume or diagnostics flow needs them

Optional additions when they unlock a concrete migration/debug requirement:

- `artifact_root_version: 1`
- `artifact_root_kind: "workspace-artifacts"`
- `canonical_artifact_root`

Use only where needed for migration clarity. Do not rewrite every state file unless it unlocks resume or diagnostics.

## Tests

Stub tests only for the implementation phase:

1. Resolver tests
   - shared skill artifact root resolves to `workspace-artifacts/skills/shared/<skill>/...`
   - workspace-local skill artifact root resolves to `workspace-artifacts/skills/<workspace>/<skill>/...`
   - `ARTIFACT_ROOT` override works for tests and backfills without changing source-owned definition roots
   - no benchmark-family-specific artifact-root env vars are required beyond `ARTIFACT_ROOT` and existing explicit run-root escapes

2. qa-plan-evolution path tests
   - Phase 0 initializes runs under the new artifact root
   - prune logic deletes only old artifact-root siblings
   - explicit `--run-root` overrides still work

3. qa-plan-orchestrator path tests
   - save/validate helpers default to new artifact-root run directories
   - workflow state migration still resumes legacy runs
   - when both legacy and canonical roots exist, canonical silently wins
   - when legacy and canonical roots differ, canonical still wins and run metadata records the divergence
   - failed migration copy/rename cannot leave a partially populated canonical run directory
   - concurrent first-write migration attempts serialize behind a per-run lock and converge on the same canonical run root
   - `runPhase.mjs` and `runtimeEnv.mjs` continue to derive the same default run root as `workflowState.mjs`

4. Benchmark path tests
   - benchmark definition root stays in source tree
   - benchmark archive root stays in source tree and remains read-only
   - runtime history and iterations are written under artifact root
   - snapshots live only under artifact root
   - runtime isolation rejects overlapping roots
   - runtime isolation rejects realpath-equivalent overlaps through symlinks
   - `qa-plan-v1` scripts no longer write under source-tree iteration folders
   - `qa-plan-v1/scripts/lib/iteration0Benchmark.mjs` roots iteration, snapshot, and eval workspace writes under the artifact root, not the source benchmark tree
   - preserved checked-in baseline evidence is reachable through `archive/` without being treated as the active benchmark runtime root

5. End-to-end smoke tests
   - benchmark prepare/run/aggregate succeeds with no writes under source-tree `iteration-*`
   - benchmark prepare/run/aggregate succeeds with no writes under source-owned `archive/`
   - `benchmark:iteration0:prepare` / `benchmark:iteration0:aggregate` succeed with runtime writes only under `workspace-artifacts/`
   - qa-plan-evolution resume succeeds from migrated artifact-root state

6. Repo-policy / discovery exclusion tests
   - add `workspace-planner/skills/qa-plan-orchestrator/tests/workspaceArtifactPolicy.test.mjs` as the in-repo guard that proves `workspace-artifacts/` and source-owned benchmark `archive/` trees are excluded from skill discovery and repo-scan context assembly
   - document the external discovery owner and boundary explicitly in `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md`; the in-repo test does not claim to validate external scanners

## Documentation Changes

### AGENTS.md

Update root and workspace-specific AGENTS files to say:

- live runs and benchmark iterations belong under `workspace-artifacts/skills/...`
- source skill trees are code, checked-in benchmark definitions, and explicit archive-only evidence only
- `workspace-artifacts/` is runtime-only and must not be treated as an active skill-discovery root
- source-owned `benchmarks/*/archive/` trees are frozen evidence only and must not be treated as active skill roots

### Skill docs

Update:

- `.agents/skills/qa-plan-evolution/SKILL.md`
- `.agents/skills/qa-plan-evolution/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/README.md`
- `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md`

Expected content changes:

- replace `<skill-root>/runs/...` language with `workspace-artifacts/...`
- split “benchmark definition root” from “benchmark archive root” and “benchmark runtime root”
- document the compatibility window for legacy in-skill runs
- document that canonical artifact-root state silently wins over legacy in-skill state when both exist
- document that checked-in frozen baselines live under `archive/` and are read-only evidence

### New docs

Create:

- `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md`

Expected content:

- canonical folder taxonomy
- path ownership rules
- runtime-only / gitignored policy for `workspace-artifacts/`
- archive-only policy for `benchmarks/*/archive/`
- in-repo enforcement point: `workspace-planner/skills/qa-plan-orchestrator/tests/workspaceArtifactPolicy.test.mjs`
- ownership note for discovery exclusion: either the in-repo scanner/test that enforces exclusion, or the external tool boundary that is responsible for never treating `workspace-artifacts/` as an active skill root
- migration guidance for future skills

### Repo ignore rules

Update root `.gitignore` to add:

- `workspace-artifacts/`

Expected content changes:

- artifact runtime trees are excluded from version control by default
- benchmark fixtures and manifests remain versioned under source-owned benchmark trees

## Implementation Checklist

### PR1

1. Add shared artifact-root resolver helpers.
2. Convert `qa-plan-evolution` run-root resolution to the new artifact root.
3. Convert `qa-plan-orchestrator` run-root resolution to the new artifact root through `workflowState.mjs`, `runPhase.mjs`, `runtimeEnv.mjs`, and the save/validate helpers.
4. Move `defects-analysis` live runs to the new artifact root and update `spawn_defects_analysis.sh`.
5. Add root `.gitignore` coverage for `workspace-artifacts/`.
6. Add the repo-policy guard test for `workspace-artifacts/` and `benchmarks/*/archive/` discovery exclusion.
7. Document the in-repo and external discovery-owner boundaries.
8. Update AGENTS and skill docs to describe the new run-root contract.
9. Run targeted resume/smoke flows and verify no new `runs/` directories are created under migrated skill source trees.

### PR2

1. Split benchmark definition root, benchmark archive root, and benchmark runtime root for both `qa-plan-v1` and `qa-plan-v2`.
2. Move live iteration/history/snapshot writes to the artifact root and relocate intentionally preserved baselines under `benchmarks/*/archive/`.
3. Add migration logic for legacy benchmark runtime trees, with canonical silently preferred on dual-root detection.
4. Make benchmark and run-root migration atomic: `rename` when possible, otherwise stage-copy then promote, never exposing a half-written canonical destination.
5. Make runner isolation enforce forbidden roots at runtime, not only in prompt text.
6. Update tests for benchmark runtime, archive/runtime separation, policy exclusion, migration locking, divergence handling, and resume compatibility.
7. Run targeted benchmark smoke flows and verify no new artifact writes land in live skill source trees or source-owned archive trees.

## References

- [benchmarkSkillPaths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkSkillPaths.mjs)
- [benchmarkRunnerPrompt.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkRunnerPrompt.mjs)
- [codexBenchmarkRuntime.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/codexBenchmarkRuntime.mjs)
- [paths.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs)
- [save_context.sh](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/scripts/lib/save_context.sh)

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | clean | mode: SELECTIVE_EXPANSION, 0 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 2 | issues_open | 11 issues, 2 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | clean | score: 8/10 -> 10/10, 12 decisions |

**UNRESOLVED:** 1 decision
**VERDICT:** CEO + DESIGN CLEARED; eng review required.
