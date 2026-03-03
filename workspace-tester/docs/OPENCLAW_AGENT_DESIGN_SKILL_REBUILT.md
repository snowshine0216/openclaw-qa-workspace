# OPENCLAW Agent Design Skill Guide (workspace-tester)

Practical usage guide for `openclaw-agent-design` in this repo.
Focus: state-machine workflow design for `workspace-tester` runtime.

## 1) Purpose

This guide defines how to design or update OpenClaw workflows so they are:
1. Resumable through canonical state files (`task.json` and `run.json`).
2. Idempotent at Phase 0 before external calls.
3. Explicitly user-confirmed at decision points.
4. Compatible with OpenClaw subagent runtime and Codex hook runtime.
5. Review-gated before finalization.

Primary workflow target in this repo:
`workspace-tester/.agents/workflows/planner-spec-generation-healing.md`.

## 2) When to use / when not

Use when:
1. You change workflow phases (`R0`, `P0`-`P5`).
2. You change `task.json`/`run.json` contracts.
3. You change runtime entrypoints under `workspace-tester/src/tester-flow/` (for example `run_phase2.sh` or `runner.mjs`).
4. You change planner/generator/healer orchestration contracts.
5. You change final summary or Feishu notification logic.

Do not use when:
1. You only write or heal Playwright specs.
2. You only run test execution with no workflow-design changes.
3. You only edit prose docs that do not alter runtime behavior.

## 3) Mandatory gates (agent-idempotency + openclaw-agent-design-reviewer)

Run these gates in strict order:
1. Draft/update with `openclaw-agent-design`.
2. Run `agent-idempotency` review for Phase 0 and refactor before final draft.
3. Run `openclaw-agent-design-reviewer` and capture report artifacts.
4. If reviewer status is `fail`, revise and rerun reviewer.
5. Finalize only if status is `pass` or `pass_with_advisories`.

Phase 0 requirements from idempotency gate:
1. Classify state: `FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH`.
2. Show freshness timestamps before user choice.
3. Offer explicit options: `Use Existing | Smart Refresh | Full Regenerate | Resume | Generate from Cache`.
4. Archive before overwrite.

Mandatory final workflow actions:
1. Write execution summary.
2. Set final state.
3. Send Feishu notification.
4. On send failure, set `run.json.notification_pending=<full payload>`.

## 4) Canonical paths

All paths are repo-relative.

1. Workflow: `workspace-tester/.agents/workflows/planner-spec-generation-healing.md`
2. Runtime core: `workspace-tester/src/tester-flow/runner.mjs`
3. Entrypoints:
   - `workspace-tester/src/tester-flow/run_r0.sh`
   - `workspace-tester/src/tester-flow/run_phase0.sh`
   - `workspace-tester/src/tester-flow/run_phase1.sh`
   - `workspace-tester/src/tester-flow/run_phase2.sh`
   - `workspace-tester/src/tester-flow/run_phase3.sh`
   - `workspace-tester/src/tester-flow/run_phase4.sh`
   - `workspace-tester/src/tester-flow/run_phase5.sh`
   - `workspace-tester/src/tester-flow/run_full_flow.sh`
4. State root pattern: `workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/`
5. Required state files:
   - `workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/task.json`
   - `workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/run.json`
6. Review artifacts:
   - `projects/agent-design-review/$DESIGN_ID/design_review_report.md`
   - `projects/agent-design-review/$DESIGN_ID/design_review_report.json`

## 5) Phase-by-phase workflow (R0, P0-P5) with user interaction contract

Global assumption policy: never assume missing context.
If requirements are ambiguous, stop and ask the user before proceeding.

| Phase | Core actions | User interaction contract |
|---|---|---|
| `R0` route | Normalize key aliases, choose mode, decide planner route, create run namespace. | Done: route/mode persisted. Blocked: key or mode invalid. Questions: confirm mode when multiple routes fit. |
| `P0` preflight | Apply idempotency classification, enforce mode lock, resolve inputs, persist `report_state`. | Done: safe options shown. Blocked: corrupted state or rejected mode shift. Questions: user chooses reuse/refresh/regenerate path. |
| `P1` intake | Build intake files, enforce seed metadata, generate manifest, save fetch timestamp. | Done: non-empty manifest saved. Blocked: source input missing/invalid. Questions: optional missing scenarios skip or block. |
| `P2` generate | Invoke generator per manifest item, retry once, persist generated and failed lists. | Done: each item resolved to pass/fail. Blocked: generator unavailable. Questions: continue with partial generation or stop. |
| `P3` execute | Run baseline test pass with `--retries=0`, default project `chromium`, update failed list. | Done: baseline outcome stored. Blocked: infra/env failure. Questions: proceed to heal when failures are infra-caused. |
| `P4` heal | If failures exist, run bounded heal loop (max 3 rounds), rerun failed set only, emit healing report when unresolved. | Done: heal result persisted. Blocked: healer unavailable. Questions: accept unresolved after round 3 or escalate manual debug. |
| `P5` finalize | Write summary, set overall status, send Feishu, persist fallback payload on send failure. | Done: final state + summary complete. Blocked: notification transport failure. Questions: retry pending notification now or on next run. |

User Interaction:
Done: every phase must report concrete completed outputs.
Blocked: every phase must report explicit blockers and cause.
Questions: every phase must ask required user decisions before continuing.

## 6) OpenClaw vs Codex execution model

| Concern | OpenClaw execution | Codex execution |
|---|---|---|
| Orchestration primitive | `sessions_spawn` specialist agents | hook commands (`--generator-cmd`, `--healer-cmd`, `--notify-cmd`) |
| Payload style | natural-language task payload | shell/env contract payload |
| Success criterion | subagent success + expected artifact | command exit code + expected artifact |
| Failure signal | subagent error/no artifact | non-zero exit or missing artifact |
| State ownership | same canonical state files (`task.json` and `run.json`) | same canonical state files (`task.json` and `run.json`) |

Invariant: both models must keep identical phase boundaries, state writes, and notification fallback behavior.

## 7) sessions_spawn templates for planner/generator/healer

Use these payload templates for OpenClaw subagent delegation.

Planner payload template:
```text
Agent: playwright-test-planner
Goal: prepare planner artifacts for ${WORK_ITEM_KEY}
Required outputs:
- qa_plan_final.md
- specs/*.md
Return: planner artifact root path
```

Generator payload template:
```text
Agent: playwright-test-generator
Goal: generate one Playwright spec
Inputs:
- WORK_ITEM_KEY=${WORK_ITEM_KEY}
- SOURCE_MARKDOWN=${SOURCE_MARKDOWN}
- TARGET_SPEC_PATH=${TARGET_SPEC_PATH}
- SEED_REFERENCE=${SEED_REFERENCE}
- FRAMEWORK_PROFILE_PATH=${FRAMEWORK_PROFILE_PATH}
- RUN_DIR=${RUN_DIR}
Constraint: exit non-zero if target spec is not created
```

Healer payload template:
```text
Agent: playwright-test-healer
Goal: heal failing specs for ${WORK_ITEM_KEY}
Inputs:
- FAILED_SPECS=${FAILED_SPECS}
- FRAMEWORK_PROFILE_PATH=${FRAMEWORK_PROFILE_PATH}
- RUN_DIR=${RUN_DIR}
Constraints:
- max 3 rounds
- rerun failed set only
- preserve original test intent
```

## 8) State contract (task.json/run.json fields)

`task.json` required fields:
1. `work_item_key`
2. `overall_status` (`running|completed|failed`)
3. `current_phase` (`phase_0_preflight` ... `phase_5_finalize`)
4. `execution_mode` (`planner_first|direct|provided_plan`)
5. `agents_root` (must be `.agents`)
6. `discovery_policy` (must be `workspace_root_only`)
7. `phase_status` map with each phase status (`pending|running|completed|failed`)
8. `healing.max_rounds` (must be `3`)
9. `healing.current_round`
10. `healing.status` (`not_started|in_progress|passed|failed`)
11. `updated_at` (ISO8601)

`run.json` required fields:
1. `execution_mode`
2. `pre_route_decision_log[]`
3. `resolved_plan_inputs[]`
4. `intake_manifest_path`
5. `generated_specs[]`
6. `failed_specs[]`
7. `report_state` (`FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH`)
8. `data_fetched_at`
9. `output_generated_at`
10. `notification_pending` (`string|null`)

State behavior requirements:
1. Persist state after every phase transition.
2. Never silently mutate mode when `mode_locked=true`.
3. Keep notification payload when Feishu send fails.

## 9) Acceptance checks commands

Run from repo root:

```bash
test -f workspace-tester/.agents/workflows/planner-spec-generation-healing.md && echo OK_WORKFLOW
test -f workspace-tester/src/tester-flow/runner.mjs && echo OK_RUNNER
WORK_ITEM_KEY=BCIN-6709
jq -r '.agents_root' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.execution_mode' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.execution_mode' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.healing.max_rounds' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.notification_pending // empty' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```

Mandatory notification fallback verification command:

```bash
jq -r '.notification_pending // empty' "workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
# reviewer-compat canonical check string:
jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json
```

## 10) Failure modes + fixes

| Failure mode | Typical cause | Fix |
|---|---|---|
| Mode mismatch on resume | requested mode differs from locked run mode | fail fast unless `--new-run-on-mode-change true` |
| Planner artifacts missing | `planner_first` inputs not present | provide `PLANNER_PRESOLVE_CMD` and rerun `R0` |
| Generator unavailable | hook/subagent missing | set `PLAYWRIGHT_GENERATOR_CMD` or spawn generator agent |
| Seed missing in intake file | no `**Seed:**` line | inject seed metadata before `P2` |
| Heal loop still failing | flaky selector or environment issue | stop at round 3, write `workspace-tester/memory/tester-flow/runs/$WORK_ITEM_KEY/healing/healing_report.md`, escalate |
| Feishu send failed | notify command error/network issue | store full payload in `run.json.notification_pending` and retry later |
| Corrupt state json | interrupted run/manual edit | reconstruct minimal state from artifacts, then ask user how to resume |

## 11) Definition of done

Design update is done only when all are true:
1. All 11 sections in this guide are satisfied by the design.
2. Phase 0 idempotency contract is explicit and user-driven.
3. Every phase includes `Done`, `Blocked`, and `Questions` checkpoints.
4. Ambiguity handling is explicit: ask user instead of assuming.
5. OpenClaw and Codex execution models are both documented and equivalent in invariants.
6. `task.json` and `run.json` fields are explicit and verifiable.
7. Acceptance commands run against canonical paths.
8. Final Feishu step plus `notification_pending` fallback is present.
9. Reviewer artifacts exist and reviewer status is `pass` or `pass_with_advisories`.
10. Documentation impact is declared, including explicit user-facing `README.md` impact (`updated`, `no change`, or `not applicable` with reason).
