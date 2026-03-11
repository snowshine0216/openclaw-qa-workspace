# QA Plan Orchestrator Rename And Runs Relayout Design

> **Design ID:** `qa-plan-orchestrator-rename-runs-relayout-2026-03-11`
> **Date:** 2026-03-11
> **Status:** Draft
> **Scope:** Simplify the planner skill surface by removing workspace-local `qa-plan-*` helper skills, consolidating the surviving orchestrator skill, relocating runtime outputs under the skill package `runs/` tree, and correcting core planning-contract behavior that currently shrinks coverage or mis-tracks round progression.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

Design basis:
- Current entrypoint skill: `workspace-planner/skills/qa-plan-orchestrator/`
- Current runtime root: `workspace-planner/projects/feature-plan/<feature-id>/`
- Current workspace contract: `workspace-planner/AGENTS.md` still points all feature QA planning work to `qa-plan-orchestrator`
- Current source routing already prefers shared skills:
  - Jira -> `jira-cli`
  - Confluence -> `confluence`
  - GitHub -> `github`
  - Figma -> browser/snapshots

Skills/process applied in this design:
- `clawddocs`: no external Clawdbot contract change is required for this workspace-local refactor
- `agent-idempotency`: preserve `REPORT_STATE`, archive-before-overwrite, and `task.json` / `run.json` semantics
- `skill-creator`: rename and rewrite the surviving skill contract so the trigger language is explicit and shorter
- `code-structure-quality`: collapse duplicated workspace-local skill wrappers and keep one canonical owner for planner orchestration

Assumptions locked by this design:
1. The replacement skill name is `qa-plan-orchestrator`.
2. "remove skills for qa-plan-*" means the workspace should stop shipping all auxiliary workspace-local `qa-plan-*` packages, not only the eight explicitly typed in the request.
3. The request token `include` is treated as a typo or shorthand, not as a real on-disk skill name.
4. Existing shared skills remain the system of record for Jira, Confluence, GitHub, and notification behavior; no new wrapper skills are introduced.

## 1. Design Goals

This design is not only a package rename and run-root relayout.
It must also lock the planning behavior that the surviving orchestrator owns.

Primary design goals:

1. Keep one canonical workspace-local owner for feature QA planning:
   - `workspace-planner/skills/qa-plan-orchestrator/`
2. Move all per-feature runtime state to the skill-local `runs/<feature-id>/` tree and update every active reference accordingly.
3. Fix draft round progression so Phase 4a, 4b, 5a, 5b, and 6 produce true phase-scoped iterations instead of repeatedly collapsing back to `r1`.
4. Stop review and refactor rounds from narrowing plan scope simply because a concern is not restated in the latest design doc.
5. Make coverage monotonic across rounds:
   - later rounds may reorganize, split, clarify, or deepen coverage
   - later rounds must not silently remove, defer, or demote already-supported concerns
6. Make `Out of Scope / Assumptions` a justified exception bucket only:
   - it must not be used as a sink for live concerns that were already in scope
7. Add one explicit `Phase 5a Acceptance Gate`:
   - Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved
8. Encourage review phases to use bounded supplemental research when the current artifact set cannot support evaluation or when more knowledge is required to preserve or deepen coverage.
9. Update `reference.md`, `SKILL.md`, active phase contracts, and tests so the runtime contract matches the reshaped skill package.

Current implementation note:

1. current Phase 5a and Phase 5b spawn task generation already permits one bounded supplemental research pass
2. this design change is therefore primarily clarifying and strengthening the review contract
3. no immediate spawn-script change is required merely to allow bounded supplemental research
4. script changes are only required later if the workspace wants strict enforcement, explicit audit logging, or a hard search-before-scope-reduction gate

## 2. Design Deliverables

This design defines one surviving workspace-local skill package plus a full reference sweep.

Primary deliverables:
- Consolidate the surviving runtime package under `workspace-planner/skills/qa-plan-orchestrator/`
- Move per-feature runtime state from `workspace-planner/projects/feature-plan/<feature-id>/` to `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/`
- Delete the obsolete workspace-local helper skill packages:
  - `workspace-planner/skills/qa-plan-atlassian/`
  - `workspace-planner/skills/qa-plan-confluence-review/`
  - `workspace-planner/skills/qa-plan-figma/`
  - `workspace-planner/skills/qa-plan-github/`
  - `workspace-planner/skills/qa-plan-parity-checker/`
  - `workspace-planner/skills/qa-plan-performance-dimension/`
  - `workspace-planner/skills/qa-plan-refactor/`
  - `workspace-planner/skills/qa-plan-review/`
  - `workspace-planner/skills/qa-plan-synthesize/`
  - `workspace-planner/skills/qa-plan-write/`
- Update all skill-name, package-path, runtime-path, eval, test, `reference.md`, and documentation references to the new canonical package and runtime root
- Correct round-number semantics for Phase 4a, 4b, 5a, 5b, and 6 so new rounds always advance to the next `r<round>`
- Tighten the review/refactor contract so later rounds enrich or preserve coverage instead of shrinking it
- Add active-contract rules that forbid moving a live concern to `Out of Scope / Assumptions` just because the latest design doc did not restate it
- Produce reviewer artifacts at:
  - `projects/agent-design-review/qa-plan-orchestrator-rename-runs-relayout-2026-03-11/design_review_report.md`
  - `projects/agent-design-review/qa-plan-orchestrator-rename-runs-relayout-2026-03-11/design_review_report.json`

Non-deliverables:
- No workflow phase order changes
- No removal of `task.json` or `run.json`
- No new shared skill creation
- No implementation in this design step

## 3. AGENTS.md Sync

Required AGENTS updates:

1. Root `AGENTS.md`
   - Replace references to `qa-plan-orchestrator` with `qa-plan-orchestrator`
   - Keep the test-planning orchestration order unchanged
   - Update any examples that still point to `projects/feature-plan/<feature-id>/`

2. `workspace-planner/AGENTS.md`
   - Update "ALWAYS use `qa-plan-orchestrator`" to `qa-plan-orchestrator`
   - Rewrite the feature-planning runtime description so outputs live under the skill-local `runs/` tree
   - Remove any implication that workspace-local `qa-plan-*` helper skills remain valid entrypoints

3. Any nested prompts or workflow docs under `.cursor/` that still mention the old skill
   - update the canonical skill name
   - update the runtime root examples

## 4. Skills Content Specification

### 3.1 `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`

Purpose:
- Orchestrate the full script-driven feature QA planning workflow from Phase 0 through Phase 7.
- Own the runtime state, phase loop, spawn-manifest handling, and promotion flow for a single feature run.

When to trigger:
- Use whenever the user asks to create, refresh, resume, or finalize a feature QA plan in `workspace-planner`.
- Use whenever a request mentions feature QA planning, testcase planning, plan regeneration, or resuming a partially completed planner run.
- Use as the only workspace-local entrypoint for the feature QA planning pipeline.

Input contract:
- `feature_id`: string, example `BCIN-6709`, source user request or upstream planner context
- `requested_source_families`: list of strings, example `jira,confluence,github,figma`, source user request or Phase 0 defaults
- `run_dir`: optional absolute path, default `<skill-root>/runs/<feature-id>/`
- `mode`: optional Phase 0 user choice, one of `reuse`, `resume`, `smart_refresh`, `full_regenerate`

Output contract:
- Runtime artifacts under `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/`
- Status lines that point to phase outputs or spawn manifests
- Promoted final artifact `runs/<feature-id>/qa_plan_final.md`

Workflow/phase responsibilities:
- Run `scripts/phaseN.sh`
- handle `REPORT_STATE` user choice without bypassing archive behavior
- spawn subagents from manifest payloads
- wait for completion
- re-enter the script with `--post`
- stop on non-zero exit

Error/ambiguity policy:
- never overwrite an existing final without archive
- never auto-pick a destructive reset when prior artifacts exist
- stop if required source access fails in Phase 0

Quality rules:
- the skill is the only workspace-local owner of planner orchestration
- shared evidence collection must directly reuse `jira-cli`, `confluence`, `github`, and browser/snapshots
- all per-feature outputs must stay under `runs/<feature-id>/`
- script examples and validation commands must use `run-dir`, not `project-dir`
- later review rounds must preserve or enrich evidence-backed coverage
- a concern already supported by evidence must not be removed, deferred, or pushed into `Out of Scope / Assumptions` unless the source evidence or explicit user direction proves that treatment is correct

Classification:
- `workspace-local`

Why this placement:
- the workflow is specific to `workspace-planner`, its phase contracts, and its feature-plan artifact model

Existing skills reused directly:
- `jira-cli` — Jira reads and related issue discovery
- `confluence` — Confluence reads and searches
- `github` — GitHub auth and diff/PR evidence
- `feishu-notify` — final notification behavior

### 3.2 Removed workspace-local `qa-plan-*` skills

Purpose:
- None after this refactor. Their responsibilities are absorbed either by the orchestrator contract or by direct reuse of existing shared skills.

Removal rule:
- Delete every workspace-local `qa-plan-*` package other than the renamed orchestrator.
- Do not replace deleted packages with new wrappers unless a later design identifies a real contract gap.

Replacement mapping:

| Removed package | Replacement owner |
|---|---|
| `qa-plan-atlassian` | `qa-plan-orchestrator` + direct `jira-cli` / `confluence` reuse |
| `qa-plan-confluence-review` | `qa-plan-orchestrator` Phase 7 validation gate or a future shared reviewer if needed |
| `qa-plan-figma` | `qa-plan-orchestrator` manifest task using browser/snapshot flow |
| `qa-plan-github` | `qa-plan-orchestrator` + direct `github` reuse |
| `qa-plan-parity-checker` | `qa-plan-orchestrator` internal validators |
| `qa-plan-performance-dimension` | `qa-plan-orchestrator` internal review/quality pass |
| `qa-plan-refactor` | `qa-plan-orchestrator` Phase 5a / 5b / 6 manifests |
| `qa-plan-review` | `qa-plan-orchestrator` Phase 5a / 5b manifests |
| `qa-plan-synthesize` | `qa-plan-orchestrator` Phase 4a / 4b manifests |
| `qa-plan-write` | `qa-plan-orchestrator` Phase 4a / 4b / 6 manifests |

Quality rule:
- after implementation there must be exactly one workspace-local feature QA planning entrypoint: `qa-plan-orchestrator`

## 5. reference.md Content Specification

### 4.1 `workspace-planner/skills/qa-plan-orchestrator/reference.md`

Must include:
- unchanged `REPORT_STATE` semantics:
  - `FINAL_EXISTS`
  - `DRAFT_EXISTS`
  - `CONTEXT_ONLY`
  - `FRESH`
- new runtime root convention:
  - `<skill-root>/runs/<feature-id>/` (default run dir)
- run-root artifact families:
  - `context/`
  - `drafts/`
  - `archive/`
  - `task.json`
  - `run.json`
  - phase manifest files
  - `qa_plan_final.md`
- path terminology update:
  - `project-dir` -> `run-dir`
  - `projectDir` -> `runDir`
  - `scripts/apply_user_choice.sh` CLI contract must change from `<mode> <feature-id> <project-dir>` to `<mode> <feature-id> <run-dir>`
  - `scripts/lib/applyUserChoice.mjs` parameter and local-variable terminology must change from `projectDir` to `runDir`
- validation commands rewritten to use `runs/<feature-id>/`
- `Round Progression Contract`:
  - the first successful draft for a phase writes `r1`
  - every later rerun for that same phase writes the next real round
  - rerouting through `return_to_phase` must not reset the destination phase counter
  - no later round may overwrite an earlier round artifact name
  - `latest_draft_path` must always point to the newest accepted draft
- `Coverage Preservation Contract`:
  - later rounds are allowed to split, clarify, regroup, and deepen coverage
  - later rounds are not allowed to silently remove a supported concern because it is absent from a narrower summary or design doc
  - refactor and review stages must prefer enrichment over scope reduction
  - when the current artifact set is not enough to evaluate a concern confidently, review phases should prefer bounded supplemental research over scope reduction
- `Out of Scope / Assumptions Contract`:
  - this section is only for explicit exclusions, unsupported paths, or user-confirmed deferrals
  - a previously in-scope concern must not be moved there without evidence or explicit user direction
- `Phase 5a Acceptance Gate`:
  - Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved
- failure and recovery examples for:
  - concurrent run conflict
  - smart refresh on new runtime root
  - final overwrite with archive

### 4.2 `workspace-planner/skills/qa-plan-orchestrator/references/*.md`

Must include:
- examples updated to `runs/<feature-id>/context/...` and `runs/<feature-id>/drafts/...`
- no surviving references to deleted workspace-local `qa-plan-*` packages
- phase guidance that still references shared skills by name where applicable
- explicit round and coverage rules where the phase contract depends on them:
  - Phase 4a / 4b write contracts must describe how new rounds are named
  - Phase 5a / 5b / 6 review contracts must prohibit silent scope shrinkage
  - Phase 5a and 5b rubrics must state: "Do not remove, defer, or move a concern to Out of Scope unless the evidence or explicit user instruction requires it"
  - Phase 5a and 5b rubrics should explicitly encourage one bounded supplemental research pass with approved tools when the current artifacts cannot support evaluation

## 6. Workflow Design

Entrypoint skill path:
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`

### Phase 0: Existing-State Check And Run Preparation

Actions:
1. Compute `run_dir` as `<skill-root>/runs/<feature-id>/` unless explicitly provided.
2. Classify state using the canonical `REPORT_STATE` model.
3. Archive old final or draft outputs before overwrite.
4. Initialize or update `task.json` and `run.json` in the run root.

User Interaction:
1. Done: state classified and options shown.
2. Blocked: waiting on user choice when prior output exists.

State Updates:
1. Preserve all current status fields.
3. Keep existing field names stable unless a direct rename is required for path terminology.
4. Apply-user-choice terminology must be updated consistently:
   - shell entrypoint argument name: `run-dir`
   - Node helper parameter name: `runDir`
   - no active help text, usage text, or error text may still say `project-dir` / `projectDir`

Verification:
```bash
jq -r '.overall_status,.current_phase,.report_state' workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/task.json
jq -r '.run_key,.updated_at' workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/run.json
```

### Phase 1: Evidence Gathering

Actions:
1. Build one spawn request per requested source family.
2. Direct each request to shared-skill or browser-based evidence collection.
3. Save all context artifacts under `runs/<feature-id>/context/`.

User Interaction:
1. Done: manifest created and evidence collection launched.
2. Blocked: required auth or access precheck failed.
3. Questions: only if required source routing is ambiguous.
4. Assumption policy: no deleted workspace-local `qa-plan-*` packages are allowed as collectors.

State Updates:
1. `run.json.spawn_history` continues to record Phase 1 completion.
2. `task.json.completed_source_families` remains unchanged semantically.

Verification:
```bash
test -f workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/phase1_spawn_manifest.json
test -d workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context
```

### Phases 2-6: Artifact Indexing, Coverage, Drafting, Review, And Quality Pass

Actions:
1. Keep the current phase ordering unchanged.
2. Rewrite every script and manifest example so all artifacts resolve from `runs/<feature-id>/`.
3. Continue using manifest-driven subagent calls where the current workflow already does.
4. Keep review/refactor behavior inside the orchestrator-owned phase system rather than separate workspace-local skill packages.
5. Fix round progression so every new phase rerun writes a new `qa_plan_phaseN_r<round>.md` artifact instead of collapsing back to `r1`.
6. Treat review and refactor as coverage-enrichment passes:
   - they may split merged nodes
   - they may add missing coverage implied by saved evidence
   - they may clarify traceability and expected outcomes
   - they must not silently narrow scope
7. During Phase 5a and later:
   - do not remove, defer, or move a concern to `Out of Scope / Assumptions`
   - unless source evidence or explicit user direction justifies that outcome
8. During Phase 5a and Phase 5b:
   - use local run artifacts first
   - when those artifacts still cannot support evaluation, use one bounded supplemental research pass with approved shared tools
   - save the new research artifact under `context/`
   - use the new evidence to preserve or deepen the QA plan rather than shrink it

Implementation boundary:

1. current spawned task text already permits this bounded supplemental research behavior
2. this design does not require an immediate spawn-script change just to keep that permission
3. later script or validator work is only needed if the workspace wants deterministic enforcement or explicit proof that the research pass was attempted and recorded

User Interaction:
1. Done: each phase writes to the new run root.
2. Blocked: validator failure or missing prerequisite artifact.
3. Questions: only when review deltas route back ambiguously.
4. Assumption policy: do not reintroduce deleted `qa-plan-*` skill packages as hidden dependencies.

State Updates:
1. Phase round counters must advance monotonically per phase:
   - `phase4a_round`
   - `phase4b_round`
   - `phase5a_round`
   - `phase5b_round`
   - `phase6_round`
2. The first draft in a phase writes `r1`; the next rerun for that same phase writes `r2`, then `r3`, and so on.
3. `latest_draft_path` must point into `runs/<feature-id>/drafts/` and must always reference the most recent accepted draft artifact for the current round.
4. `return_to_phase` may request another round, but it must not reset the destination phase counter.

Verification:
```bash
test -f workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/artifact_lookup_<feature-id>.md
test -f workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/coverage_ledger_<feature-id>.md
test -d workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/drafts
```

### Phase 7: Finalization And Notification

Actions:
1. Require explicit approval before promotion.
2. Archive any existing `qa_plan_final.md` in `runs/<feature-id>/archive/`.
3. Promote the selected draft to `runs/<feature-id>/qa_plan_final.md`.
4. Write finalization metadata and trigger notification through the existing shared notification path.

User Interaction:
1. Done: final plan promoted in the new run root.
2. Blocked: approval missing or notification failed.
3. Questions: none beyond the approval checkpoint.
4. Assumption policy: finalization never writes back into `workspace-planner/projects/feature-plan/`.

State Updates:
1. Preserve `notification_pending` behavior.
2. Preserve `finalized_at`.

Verification:
```bash
test -f workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/qa_plan_final.md
test -f workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/context/finalization_record_<feature-id>.md
```

## 7. State Schemas

### `task.json`

Required fields preserved:
- `feature_id`
- `run_key`
- `overall_status`
- `current_phase`
- `report_state`
- `requested_source_families`
- `completed_source_families`
- `has_supporting_artifacts`
- `latest_draft_version`
- `latest_draft_path`
- `latest_draft_phase`
- `phase4a_round`
- `phase4b_round`
- `phase5a_round`
- `phase5b_round`
- `phase6_round`
- `return_to_phase`
- `created_at`
- `updated_at`

Allowed additive fields:
- `run_dir`

### `run.json`

Required fields preserved:
- `run_key`
- `started_at`
- `updated_at`
- `runtime_setup_generated_at`
- `data_fetched_at`
- `artifact_index_generated_at`
- `coverage_ledger_generated_at`
- `draft_generated_at`
- `review_completed_at`
- `refactor_completed_at`
- `finalized_at`
- `notification_pending`
- `has_supporting_artifacts`
- `spawn_history`
- `validation_history`
- `blocking_issues`

Allowed additive fields:
- `run_dir`

Schema invariants:
- file names stay the same
- state semantics stay the same
- only the parent directory changes
- round counters are append-only within a run unless the user explicitly chooses a destructive reset mode
- `latest_draft_path` and `latest_draft_phase` must never point backward to an older surviving round after a newer round is accepted

## 8. Coverage Preservation Contract

This refactor must preserve a stronger planning contract, not only a new directory layout.

`Coverage Preservation Contract`:

1. Evidence-backed concerns discovered in earlier rounds stay in scope unless evidence or the user explicitly removes them.
2. A later design summary is not sufficient reason to delete a previously supported node.
3. Review/refactor rounds should bias toward:
   - keeping the node
   - splitting the node
   - clarifying the node
   - adding missing expected outcomes
   - attaching stronger evidence
   - using bounded supplemental research when local artifacts still cannot support evaluation
4. Review/refactor rounds should not bias toward:
   - deleting the node
   - hiding the node under `Out of Scope / Assumptions`
   - downgrading the node without evidence

Bounded supplemental research encouragement:

1. use local run artifacts first
2. when the existing artifact set still cannot support evaluation or a confident rewrite, use one bounded supplemental research pass
3. use only approved tools for that pass:
   - `jira-cli`
   - `confluence`
   - `tavily-search`
4. save all newly gathered evidence under `runs/<feature-id>/context/`
5. prefer using the new evidence to preserve, split, clarify, and deepen coverage instead of shrinking the plan

`Round Progression Contract`:

1. the first successful draft for a phase writes `r1`
2. every later rerun for that same phase writes the next real round
3. rerouting through `return_to_phase` must not reset the destination phase counter
4. no later round may overwrite an earlier round artifact name
5. `latest_draft_path` must always point to the newest accepted draft

Required reviewer language to carry into active rubrics:

```text
Do not remove, defer, or move a concern to Out of Scope.
Only do so when source evidence or explicit user direction requires it.
Otherwise enrich the plan by preserving, splitting, clarifying, or extending coverage.
```

`Out of Scope / Assumptions Contract`:

1. this section is only for explicit exclusions, unsupported paths, or user-confirmed deferrals
2. a previously in-scope concern must not be moved there without evidence or explicit user direction

`Phase 5a Acceptance Gate`:

1. Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved

## 9. Implementation Layers

Layer ownership after the refactor:

1. Skill contract layer
   - `SKILL.md`
   - `reference.md`
   - `references/*.md`
   - `README.md`

2. Runtime orchestration layer
   - `scripts/phase*.sh`
   - `scripts/*_build_spawn_manifest.mjs`
   - `scripts/record_spawn_completion.sh`

3. Runtime support and validation layer
   - `scripts/lib/runtimeEnv.mjs`
   - `scripts/lib/workflowState.mjs`
   - `scripts/lib/applyUserChoice.mjs`
   - `scripts/lib/artifactLookup.mjs`
   - `scripts/lib/recordSpawnCompletion.mjs`
   - `scripts/lib/validate_plan_artifact.mjs`
   - `scripts/lib/save_context.sh`
   - `scripts/lib/validate_context.sh`

4. Verification layer
   - `scripts/test/*`
   - `tests/*`
   - `evals/*`

Boundary rules:
- one canonical workspace-local owner: `qa-plan-orchestrator`
- all external evidence adapters remain shared skills
- run-path resolution belongs to runtime support utilities, not duplicated across phase scripts
- deleted `qa-plan-*` directories must not continue to own any active validation or artifact logic

## 10. Script Inventory And Function Specifications

### 8.1 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh`

Invocation:
- `bash scripts/phase0.sh <feature-id> [run-dir]`

Inputs / outputs / artifacts:
- input feature id
- optional run dir
- writes runtime setup files, `task.json`, and `run.json`
- classifies runtime state

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | resolve run root, run Phase 0, emit status | argv | stdout, runtime files | creates or updates run dir | exits non-zero on invalid state or conflicting active run |

### 8.2 `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh` through `phase7.sh`

Invocation:
- `bash scripts/phaseN.sh <feature-id> <run-dir> [--post]`

Inputs / outputs / artifacts:
- use `run_dir` exclusively
- write manifests and phase artifacts under `runs/<feature-id>/`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | phase orchestration per contract | argv | stdout, phase artifacts | reads and writes task/run state | exits non-zero on missing prerequisite, failed validation, or missing artifacts |

### 8.3 `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runtimeEnv.mjs`

Invocation:
- `node scripts/lib/runtimeEnv.mjs <feature-id> <requested-sources> [output-dir]`

Inputs / outputs / artifacts:
- computes default output dir as `runs/<feature-id>/context`
- validates source access
- writes runtime setup markdown and json

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `buildRuntimeSetup` | build runtime setup payload for requested sources | feature id, requested sources, output dir | setup object, setup files | writes setup files | throws or reports blockers when source validation fails |
| `runRuntimeSetupCli` | CLI wrapper and default path resolution | argv | stdout, exit code | writes setup files | exits non-zero when access validation fails |

### 8.4 `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`

Invocation:
- internal library only

Inputs / outputs / artifacts:
- reads and writes `task.json` and `run.json`
- owns run-root path helpers

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| exported state helpers | normalize state reads, writes, counters, and path derivation | file paths and state payloads | normalized state objects | file IO | throws on malformed or missing required state |

Round-specific requirement for the later implementation:
- phase round helpers must return the next real round number for the destination phase
- rerouting back to Phase 4a, 4b, 5a, 5b, or 6 must not collapse output naming back to `r1`

### 8.5 `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs`

Invocation:
- internal library used by `scripts/apply_user_choice.sh`

Inputs / outputs / artifacts:
- mode, feature id, run dir
- archives or clears files according to `REPORT_STATE` choice
- terminology rename is mandatory in both layers:
  - `scripts/apply_user_choice.sh` usage text and argv naming must use `run-dir`
  - `scripts/lib/applyUserChoice.mjs` exported function signatures, local variables, and error messages must use `runDir`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| exported mode handlers | apply `reuse`, `resume`, `smart_refresh`, or `full_regenerate` in the new run root | mode, run dir | updated state | archive writes and cleanup | throws on unsupported mode or missing run dir |

### 8.6 `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs`, `recordSpawnCompletion.mjs`, and validators

Invocation:
- internal libraries only

Inputs / outputs / artifacts:
- operate on `runs/<feature-id>/context` and `runs/<feature-id>/drafts`
- no `projects/feature-plan` references may remain

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| artifact lookup helpers | classify and index context artifacts | context files | artifact index rows | file reads | fail on malformed artifacts |
| spawn completion helpers | record completed evidence fetches | manifest data, run state | updated `run.json` | file writes | fail on inconsistent artifact paths |
| validator helpers | enforce plan and phase contracts | artifact paths | validation result | none beyond logs | fail with explicit validation errors |

Validator-specific requirement for the later implementation:
- validate round progression and draft-path updates for repeated Phase 4a / 4b / 5a / 5b / 6 runs
- validate that review/refactor phases do not silently remove evidence-backed concerns
- no validator or spawn-builder change is required merely to permit bounded supplemental research, because current Phase 5a / 5b task generation already permits it
- future changes are only needed if the workspace wants deterministic enforcement or explicit research-attempt logging

### 8.7 `workspace-planner/skills/qa-plan-orchestrator/evals/*`

Invocation:
- `node evals/run_evals.mjs`
- `bash evals/post_run.sh <workspace>`

Inputs / outputs / artifacts:
- rename eval metadata to `qa-plan-orchestrator`
- update fixture paths from `workspace-planner/projects/feature-plan/...` to `workspace-planner/skills/qa-plan-orchestrator/runs/...`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| eval runners | execute and compare skill behavior | eval prompts, fixtures | eval workspaces and reports | creates eval workspace files | fail when fixture paths or skill name are stale |

## 11. Script Test Stub Matrix

Standards Exception Note:
- For this script-bearing skill package, `scripts/test/` remains the canonical test location for shell-oriented phase and helper-script coverage. This intentionally overrides any generic preference for a top-level `tests/` location when the script under test lives under `scripts/`.

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` | fresh run; new-run reuse; conflicting active run | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` | shared-skill source routing; manifest path rewrite; no deleted qa-plan skill names | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/check_runtime_env.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/check_runtime_env.test.sh` | default output dir = `runs/.../context`; Jira/Confluence/GitHub auth pass; blocked source | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/check_runtime_env.test.sh` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase3_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase3_build_spawn_manifest.test.mjs` | manifest paths use `runs/...`; reference instructions avoid deleted skills | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase3_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4a_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a_build_spawn_manifest.test.mjs` | draft paths rewritten; trigger text uses `qa-plan-orchestrator` | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4b_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b_build_spawn_manifest.test.mjs` | canonical grouping artifacts under `runs/...`; no stale skill name | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5a_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a_build_spawn_manifest.test.mjs` | review artifact paths under `runs/...`; no separate review/refactor skill references | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5b_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b_build_spawn_manifest.test.mjs` | checkpoint paths under `runs/...`; routing unchanged | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase6_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6_build_spawn_manifest.test.mjs` | final-quality paths under `runs/...`; no stale skill name | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6_build_spawn_manifest.test.mjs` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/record_spawn_completion.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/record_spawn_completion.test.sh` | completion writes correct run-root paths | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/record_spawn_completion.test.sh` |

## 10. Files To Create / Update

Create or rename:
- `workspace-planner/skills/qa-plan-orchestrator/` from the current `qa-plan-orchestrator/` tree
- `workspace-planner/skills/qa-plan-orchestrator/runs/` as the canonical runtime root

Delete:
- `workspace-planner/skills/qa-plan-atlassian/`
- `workspace-planner/skills/qa-plan-confluence-review/`
- `workspace-planner/skills/qa-plan-figma/`
- `workspace-planner/skills/qa-plan-github/`
- `workspace-planner/skills/qa-plan-parity-checker/`
- `workspace-planner/skills/qa-plan-performance-dimension/`
- `workspace-planner/skills/qa-plan-refactor/`
- `workspace-planner/skills/qa-plan-review/`
- `workspace-planner/skills/qa-plan-synthesize/`
- `workspace-planner/skills/qa-plan-write/`

Update in the renamed skill package:
- `SKILL.md`
- `reference.md`
- `README.md`
- `package.json`
- `evals/evals.json`
- `evals/run_evals.mjs`
- `evals/README.md`
- `evals/post_run.sh`
- `references/*.md`
- `docs/*.md`
- `scripts/*.sh`
- `scripts/*_build_spawn_manifest.mjs`
- `scripts/lib/*.mjs`
- `scripts/lib/*.sh`
- `scripts/test/*`
- `tests/*`

Terminology-specific required updates:
- `workspace-planner/skills/qa-plan-orchestrator/scripts/apply_user_choice.sh`
  - rename CLI usage/help text and internal variable terminology from `project-dir` to `run-dir`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs`
  - rename function parameters, local variables, and error/help text from `projectDir` to `runDir`

Update outside the package:
- `AGENTS.md`
- `workspace-planner/AGENTS.md`
- repo docs and plans that still mention the old skill or the old runtime root
- any fixture or review notes that encode the old package path

Reference sweep rule:
- use repository-wide search for both `qa-plan-orchestrator` and `projects/feature-plan/`
- implementation is not complete until both searches return either zero active references or only archived/historical files explicitly left unchanged

## 11. README Impact

`README.md` for the renamed skill must explicitly state:
- the skill is now `qa-plan-orchestrator`
- `runs/<feature-id>/` is the only active runtime root
- workspace-local `qa-plan-*` helper packages were removed
- evidence collection uses shared skills directly

## 12. Backfill Coverage Table

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase0.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase0.test.sh` | conflicting active run states |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/check_runtime_env.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/check_runtime_env.test.sh` | blocked auth precheck |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase1.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase1.test.sh` | disallowed deleted-skill routing |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/record_spawn_completion.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/record_spawn_completion.test.sh` | artifact paths still point at `projects/feature-plan` |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runtimeEnv.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/contextRules.test.mjs` | default output dir remains stale |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/applyUserChoice.test.mjs` | archive behavior broken in `runs/...` root |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/artifactLookup.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/artifactLookup.test.mjs` | context indexing misses new root |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/normalizeSpawnInput.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/normalizeSpawnInput.test.mjs` | stale agent id or path fields |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/planValidators.test.mjs` | validators still mention old draft paths |
| `workspace-planner/skills/qa-plan-orchestrator/docs` contract references | `workspace-planner/skills/qa-plan-orchestrator/tests/docsContract.test.mjs` | docs still mention deleted skills or old runtime root |

## 13. Quality Gates

- [ ] The only active workspace-local feature planning skill is `qa-plan-orchestrator`.
- [ ] All deleted `qa-plan-*` packages are either removed or explicitly archived outside active skill lookup paths.
- [ ] `REPORT_STATE` semantics remain unchanged.
- [ ] `task.json` and `run.json` semantics remain unchanged except for additive path metadata.
- [ ] All active runtime artifacts resolve under `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-id>/`.
- [ ] No active script, test, eval, or doc still points at `qa-plan-orchestrator`.
- [ ] No active script, test, eval, or doc still points at `projects/feature-plan/<feature-id>/` for planner output.
- [ ] Shared evidence collection still directly reuses `jira-cli`, `confluence`, `github`, and browser/snapshots.
- [ ] Validation coverage includes both path relayout regressions and stale-name regressions.

## 14. References

- `workspace-planner/AGENTS.md`
- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/agent-idempotency/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `skill-creator` skill dependency
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
