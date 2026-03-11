# QA Plan Orchestrator Phase 4-5 Round Progression Fix Design

> **Design ID:** `fqpo-phase45-round-progression-2026-03-12`
> **Date:** 2026-03-12
> **Status:** Draft
> **Scope:** Fix Phase 4a, 4b, 5a, 5b, and the shared round helpers so reruns continue to `r3`, `r4`, and beyond instead of reusing `r1` or `r2`.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

- Repository root: `/Users/xuyin/Documents/Repository/openclaw-qa-workspace`
- Target skill package: `workspace-planner/skills/qa-plan-orchestrator`
- Shared skills reused directly:
  - `.agents/skills/jira-cli`
  - `.agents/skills/confluence`
  - `.agents/skills/feishu-notify`
- Design dependencies applied:
  - `clawddocs`
  - `agent-idempotency`
  - `skill-creator`
  - `code-structure-quality`
  - `openclaw-agent-design-review`

## 1. Design Deliverables

- Primary artifact:
  - `workspace-planner/skills/qa-plan-orchestrator/docs/PHASE45_ROUND_AND_REVIEW_ARTIFACT_FIX_DESIGN.md`
- Reviewer artifacts:
  - `workspace-planner/skills/qa-plan-orchestrator/docs/reviews/fqpo-phase45-round-progression-2026-03-12/design_review_report.md`
  - `workspace-planner/skills/qa-plan-orchestrator/docs/reviews/fqpo-phase45-round-progression-2026-03-12/design_review_report.json`

## 2. AGENTS.md Sync

- Root and subtree `AGENTS.md` files remain valid.
- No phase ordering changes:
  - `phase4a -> phase4b -> phase5a -> phase5b -> phase6 -> phase7`
- No Phase 0 behavior changes:
  - keep `REPORT_STATE`
  - keep user-choice gating
  - keep archive-before-overwrite
- No new skill package is introduced.

## 3. Skills Content Specification

### 3.1 `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`

Entrypoint skill path:

- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`

Purpose:

- Orchestrate script-driven feature QA planning with deterministic round allocation for Phase 4-6 draft-producing reruns.

When to trigger:

- Any feature QA planning run in `workspace-planner`.
- Any rerun triggered by `return_to_phase`.
- Any resume flow where prior drafts already exist and the next round must be determined safely.

Input contract:

- `feature_id`: string, required.
- `run_dir`: optional path, default `workspace-planner/skills/qa-plan-orchestrator/runs/` plus the feature-specific subfolder.
- `task.json`: persisted workflow state.
- `run.json`: persisted runtime and validation history.

Output contract:

- `phaseN_spawn_manifest.json` with a reserved `requested_round` for Phase 4a, 4b, 5a, 5b, and 6.
- Phase-scoped draft files:
  - `drafts/qa_plan_phase4a_rROUND-N.md`
  - `drafts/qa_plan_phase4b_rROUND-N.md`
  - `drafts/qa_plan_phase5a_rROUND-N.md`
  - `drafts/qa_plan_phase5b_rROUND-N.md`
  - `drafts/qa_plan_phase6_rROUND-N.md`

Workflow/phase responsibilities:

1. Load state and sync durable draft discovery.
2. Reserve the next unique phase round before spawn.
3. Write the spawn manifest with `requested_round`.
4. Spawn subagents as-is from the manifest.
5. Run `--post` and promote the reserved round only after success.

Error/ambiguity policy:

- Never silently reuse a previously reserved round.
- Never infer a successful rerun from a stale manifest alone.
- If a required input draft is missing, stop the phase with an explicit error.
- If `return_to_phase` is not set, do not force a rerun.

Quality rules:

- Phase rounds must be monotonic per attempt.
- `phaseN_round` remains the completed-round field.
- `phaseN_reserved_round` becomes the highest allocated round field.
- Folder layout remains unchanged.

Classification:

- `workspace-local`

Why this placement:

- The state machine, scripts, and artifact layout are planner-specific and not reusable as a shared global skill.

Existing skills reused directly:

- `jira-cli` for Jira evidence.
- `confluence` for Confluence evidence.
- `feishu-notify` for final notification.

Why direct reuse is sufficient:

- no wrapper skill is required because this design changes only local round allocation and validation behavior
- Jira, Confluence, and Feishu integration contracts already exist and remain canonical in their shared skills
- direct reuse is sufficient because the bug is in local manifest/state ownership, not in shared integration behavior

## 4. reference.md Content Specification

### 4.1 `workspace-planner/skills/qa-plan-orchestrator/reference.md`

Must include:

- state invariants:
  - `REPORT_STATE` unchanged
  - `reserved_round >= completed_round`
  - `next_round = max(completed_round, reserved_round, discovered_round) + 1`
- field-level schema updates:
  - `phase4a_reserved_round`
  - `phase4b_reserved_round`
  - `phase5a_reserved_round`
  - `phase5b_reserved_round`
  - `phase6_reserved_round`
  - `run.json.round_reservation_history`
- path conventions:
  - no new folders
  - manifests keep `output_draft_path`
  - manifests add `requested_round`
- validation rules:
  - post-validation uses manifest `requested_round` as the attempt authority
  - success promotes `phaseN_round`
  - failure does not roll back `phaseN_reserved_round`
- recovery rules:
  - legacy runs hydrate missing reserved-round fields from completed-round fields and discovered drafts
  - smart refresh and full regenerate clear both completed and reserved round fields

## 5. Workflow Design

### Overview

Current contract:

- reruns should create `r2`, `r3`, `r4`, and so on

Current implementation gap:

1. `scripts/lib/workflowState.mjs`
   - `getNextPhaseRound` only uses `task.PHASE-ID_round + 1`
   - `syncTaskDraftState` only heals from already-existing draft files
2. `scripts/lib/runPhase.mjs`
   - `runSpawnPhase` writes a manifest but does not persist a round reservation first
3. `scripts/lib/qaPlanValidators.mjs`
   - `validateRoundProgression` validates against completed state, not against a persisted reservation ledger

Observed failure mode:

1. `r1` succeeds
2. rerun requests `r2`
3. `r2` fails before post-validation promotes it or before a durable draft is discoverable
4. next retry recomputes the next round from stale completed state and reuses `r2`
5. users never see `r3` or `r4`

Design decision:

- move round ownership from successful-output state to manifest-reservation state

### Workflow chart

```text
Phase 0
  -> unchanged REPORT_STATE and idempotency behavior

Phase 4a / 4b / 5a / 5b / 6 pre-run
  -> load state
  -> sync discovered drafts
  -> reserve next round in task.json
  -> append reservation entry to run.json
  -> write manifest with requested_round
  -> spawn subagent

Phase 4a / 4b / 5a / 5b / 6 post-run
  -> read manifest requested_round
  -> validate draft path == requested_round path
  -> on success: promote reserved round into phaseN_round
  -> update latest_draft_path/latest_draft_phase
  -> preserve return_to_phase semantics

Retry after failed rerun
  -> next round = max(completed_round, reserved_round, discovered_round) + 1
  -> request r3/r4/... even if prior retry never promoted
```

### Folder structure

No folder-layout change:

```text
workspace-planner/skills/qa-plan-orchestrator/runs/
  feature-specific subfolder
  context/
  drafts/
    qa_plan_phase4a_r<round>.md
    qa_plan_phase4b_rROUND-N.md
    qa_plan_phase5a_rROUND-N.md
    qa_plan_phase5b_rROUND-N.md
    qa_plan_phase6_rROUND-N.md
  task.json
  run.json
  phase4a_spawn_manifest.json
  phase4b_spawn_manifest.json
  phase5a_spawn_manifest.json
  phase5b_spawn_manifest.json
  phase6_spawn_manifest.json
```

## 6. State Schemas

### `task.json`

Keep existing fields:

- `phase4a_round`
- `phase4b_round`
- `phase5a_round`
- `phase5b_round`
- `phase6_round`
- `latest_draft_path`
- `latest_draft_phase`
- `return_to_phase`

Additive fields:

- `phase4a_reserved_round`
- `phase4b_reserved_round`
- `phase5a_reserved_round`
- `phase5b_reserved_round`
- `phase6_reserved_round`

Meaning:

- `phaseN_round`: highest completed round
- `phaseN_reserved_round`: highest allocated round

Rules:

1. default all reserved-round fields to `0`
2. never decrease a reserved-round field
3. on success, set `phaseN_round = requested_round`
4. on failure, leave `phaseN_round` unchanged

### `run.json`

Additive field:

- `round_reservation_history`

Entry shape:

```json
{
  "phase": "phase5a",
  "requested_round": 3,
  "manifest_path": "phase5a_spawn_manifest.json",
  "output_draft_path": "drafts/qa_plan_phase5a_r3.md",
  "reservation_status": "reserved",
  "reserved_at": "2026-03-12T08:00:00.000Z",
  "promoted_at": null
}
```

## 7. Implementation Layers

### Functional Design 1

Goal:

- keep Phase 0 and phase routing unchanged

Required Change for Each Phase:

Phase 0:

- no change

Phase 4a, 4b, 5a, 5b, 6:

- preserve `return_to_phase`
- preserve existing artifact paths
- preserve post-validation boundaries

### Functional Design 2

Goal:

- reserve a unique round before manifest emission

Required Change for Each Phase:

Phase 4a:

- reserve and persist `phase4a_reserved_round`

Phase 4b:

- reserve and persist `phase4b_reserved_round`

Phase 5a:

- reserve and persist `phase5a_reserved_round`

Phase 5b:

- reserve and persist `phase5b_reserved_round`

Phase 6:

- use the same reservation contract because the helper is shared

### Functional Design 3

Goal:

- promote only successful reserved rounds

Required Change for Each Phase:

Phase 4a, 4b, 5a, 5b, 6:

1. read `requested_round` from the manifest during `--post`
2. validate produced path against that requested round
3. promote completed round on success only

### Functional Design 4

Goal:

- stay backward-compatible with legacy runs and refresh flows

Required Change for Each Phase:

All tracked draft phases:

1. hydrate missing reserved-round fields from:
   - current completed round
   - discovered drafts
2. reset reserved-round fields during:
   - `full_regenerate`
   - `smart_refresh`

## 8. Script Inventory and Function Specifications

Standards Exception Note:

- this design is script-bearing
- OpenClaw script tests remain under `scripts/test/`, which is the explicit domain exception for this workspace

### `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`

| function | responsibility | inputs | outputs | side effects | failure mode |
| --- | --- | --- | --- | --- | --- |
| `defaultTask` | add additive reserved-round defaults | `featureId`, `runKey` | task object | none | incorrect defaults leave reserved fields undefined |
| `syncTaskDraftState` | heal completed state from durable drafts while keeping reserved rounds monotonic | `task`, `runDir` | normalized task | none | stale draft discovery causes inconsistent round state |
| `getNextPhaseRound` | compute `max(completed, reserved, discovered) + 1` | `task`, `phaseId` | integer round | none | reused completed-only logic would reissue `r2` |
| `reservePhaseRound` | persist the next unique round before manifest emission | `task`, `phaseId` | reserved round number | updates `task.phaseN_reserved_round` | failure to persist reservation before spawn reopens the bug |

### `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`

| function | responsibility | inputs | outputs | side effects | failure mode |
| --- | --- | --- | --- | --- | --- |
| `buildSingleRequest` | include `source.requested_round` and phase-scoped draft output path | `phaseId`, `featureId`, `runDir`, `task`, `reservedRound` | normalized request | none | missing requested-round metadata breaks post-validation authority |
| `resolvePhasePaths` | derive output path from the reserved round | `phaseId`, `featureId`, `runDir`, `task`, `reservedRound` | input/output path map | none | recomputing from completed-only state reuses stale rounds |

### `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs`

| function | responsibility | inputs | outputs | side effects | failure mode |
| --- | --- | --- | --- | --- | --- |
| `runSpawnPhase` | reserve round state before manifest emission and spawn | `featureId`, `runDir`, `phaseId`, `post` | manifest path or post result | updates `task.json` and `run.json` reservation history | spawn can reuse `r2` if reservation is not saved first |
| `readExpectedOutputDraftPath` or replacement helper | read `requested_round` and expected draft path from manifest | `runDir`, `phaseId` | manifest round metadata | none | post-validation can drift if it reads only file discovery |
| `postValidatePhase4a/4b/5a/5b/6` | promote reserved round on successful validation only | `featureId`, `runDir`, `state` | pass or thrown validation error | updates completed-round fields and latest-draft pointers | failed retries can falsely promote or can roll state backward |

### `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs`

| function | responsibility | inputs | outputs | side effects | failure mode |
| --- | --- | --- | --- | --- | --- |
| `validateRoundProgression` | compare produced round to requested round, completed round, and latest discovered round | `task`, `phaseId`, `producedDraftPath`, `expectedDraftPath` | `{ ok, failures }` | none | validator can allow stale round reuse if it ignores reservation semantics |

### `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs`

| function | responsibility | inputs | outputs | side effects | failure mode |
| --- | --- | --- | --- | --- | --- |
| `applyUserChoice` | reset completed and reserved round fields during refresh/regenerate flows | `mode`, `featureId`, `runDir` | updated task/run state | clears phase 2+ artifacts and round counters | stale reserved counters survive reset and skip or reuse rounds |

## 9. Script Test Stub Matrix

| Script Path | Test Stub Path | Scenario | Validation Command | Pass Criteria |
| --- | --- | --- | --- | --- |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/workflowState.test.mjs` | reserved round advances to `r3` even when only `r1` is durable | `node --test workspace-planner/skills/qa-plan-orchestrator/tests/workflowState.test.mjs` | all round-hydration and reserved-round cases pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs` | `workspace-planner/skills/qa-plan-orchestrator/tests/planValidators.test.mjs` | reject produced `r2` when manifest requested `r3`; allow `r4` after reserved `r3` | `node --test workspace-planner/skills/qa-plan-orchestrator/tests/planValidators.test.mjs` | all round-progression checks pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4a_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a_build_spawn_manifest.test.mjs` | manifest requests the next reserved round | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a_build_spawn_manifest.test.mjs` | expected `requested_round` and path assertions pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4b_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b_build_spawn_manifest.test.mjs` | rerun from a later phase advances to `r3+` | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b_build_spawn_manifest.test.mjs` | later-phase rerun path assertions pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5a_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a_build_spawn_manifest.test.mjs` | failed prior `r2` reservation leads to `r3` next | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a_build_spawn_manifest.test.mjs` | manifest requests the next unused round |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5b_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b_build_spawn_manifest.test.mjs` | repeated reruns continue to `r4` | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b_build_spawn_manifest.test.mjs` | manifest requests the next unused round |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase6_build_spawn_manifest.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6_build_spawn_manifest.test.mjs` | shared round helper stays consistent in Phase 6 | `node --test workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6_build_spawn_manifest.test.mjs` | Phase 6 requests the next unused round |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4a.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a.test.sh` | shell-level rerun after failed reservation advances to the next round | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a.test.sh` | shell rerun assertions pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase4b.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b.test.sh` | shell-level later-phase rerun advances to `r3+` | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b.test.sh` | shell rerun assertions pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5a.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a.test.sh` | failed `r2` retry followed by another retry produces `r3` | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a.test.sh` | post-validation promotion and retry assertions pass |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/phase5b.sh` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b.test.sh` | failed `r3` retry followed by another retry produces `r4` | `bash workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b.test.sh` | post-validation promotion and retry assertions pass |

## 10. Files To Create / Update

### Create

- `workspace-planner/skills/qa-plan-orchestrator/docs/PHASE45_ROUND_AND_REVIEW_ARTIFACT_FIX_DESIGN.md`
- `workspace-planner/skills/qa-plan-orchestrator/docs/reviews/fqpo-phase45-round-progression-2026-03-12/design_review_report.md`
- `workspace-planner/skills/qa-plan-orchestrator/docs/reviews/fqpo-phase45-round-progression-2026-03-12/design_review_report.json`

### Update

- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/README.md`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/applyUserChoice.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/tests/workflowState.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/tests/planValidators.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a_build_spawn_manifest.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b_build_spawn_manifest.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a_build_spawn_manifest.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b_build_spawn_manifest.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6_build_spawn_manifest.test.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4a.test.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b.test.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a.test.sh`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5b.test.sh`

## 11. README Impact

- add one short note that Phase 4-6 reruns are attempt-scoped
- make `r3+` an expected outcome, not an anomaly
- keep README concise and point deeper state rules to `reference.md`

## 12. Backfill Coverage Table

| Risk | Current Gap | Backfill Requirement |
| --- | --- | --- |
| Failed rerun reuses `r2` forever | no manifest-time reservation owner | add reserved-round fields and reservation history |
| Legacy runs start with missing reserved-round fields | no additive hydration rule | hydrate from completed round and discovered drafts |
| Phase 4 shell behavior drifts from Phase 5 shell behavior | shell rerun checks are weak in Phase 4 | add explicit Phase 4 shell rerun regression tests |
| Validator accepts stale path assumptions | validator reasons mostly from completed state | compare against manifest `requested_round` |

## 13. Quality Gates

- [ ] Phase 0 / `REPORT_STATE` remains unchanged
- [ ] Round reservation is persisted before spawn
- [ ] Successful post-validation promotes the reserved round
- [ ] Failed reruns do not roll reserved rounds backward
- [ ] `r3` and `r4` behavior is covered in tests
- [ ] `SKILL.md`, `reference.md`, and `README.md` are updated with the same semantics

## 14. References

- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
