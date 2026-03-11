# Defect Test Skill - Agent Design

> **Design ID:** `defect-test-skill-2026-03-12`
> **Date:** 2026-03-12
> **Status:** Draft
> **Scope:** Redesign single-defect test execution as a workspace-local script-driven skill that consumes the shared single-defect-analysis skill output.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

- Base requirements read:
  - `.agents/skills/openclaw-agent-design/SKILL.md`
  - `.agents/skills/openclaw-agent-design/reference.md`
  - `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
  - `workspace-tester/.agents/workflows/defect-test.md`
  - `workspace-reporter/.agents/workflows/single-defect-analysis.md`
- Mandatory design dependencies:
  - `clawddocs` consulted for OpenClaw conventions and skill-first architecture.
  - `agent-idempotency` applied for canonical Phase 0 behavior.
  - `skill-creator` applied for workspace-local skill contract design.
  - `code-structure-quality` applied for script boundary design.
  - `openclaw-agent-design-review` is a blocking gate before finalization.
- Code quality requirements incorporated from `code-quality-orchestrator`:
  - Phase orchestration in scripts, reusable logic in `scripts/lib/`.
  - Tests in `scripts/test/` with one-to-one mapping from script inventory.
  - Behavior/test matrix and explicit smoke/validation commands.

---

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `workspace-tester/skills/defect-test/SKILL.md` | Workspace-local skill entrypoint contract. |
| CREATE | `workspace-tester/skills/defect-test/reference.md` | State/path/schema contract for tester workflow. |
| CREATE | `workspace-tester/skills/defect-test/scripts/orchestrate.sh` | Script-driven orchestrator loop. |
| CREATE | `workspace-tester/skills/defect-test/scripts/check_resume.sh` | Canonical `REPORT_STATE` classifier for tester run artifacts. |
| CREATE | `workspace-tester/skills/defect-test/scripts/archive_run.sh` | Archive-before-overwrite policy. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase0.sh` | State check + analysis dependency resolution. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase1.sh` | Shared analysis intake and validation. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase2.sh` | Site knowledge integration. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase3.sh` | FC + exploratory execution orchestration. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase4.sh` | Report generation and callback payload. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase5.sh` | Reporter callback dispatch and retry flags. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase6.sh` | Optional Jira mutation gate under approval. |
| CREATE | `workspace-tester/skills/defect-test/scripts/phase7.sh` | Final notification with pending fallback. |
| CREATE | `workspace-tester/skills/defect-test/scripts/notify_feishu.sh` | Notification wrapper. |
| CREATE | `workspace-tester/skills/defect-test/scripts/lib/*.sh` | Path/state/manifest/callback/test-exec helpers. |
| CREATE | `workspace-tester/skills/defect-test/scripts/test/*.test.js` | Script-level test stubs. |
| UPDATE | `workspace-tester/.agents/workflows/defect-test.md` | Keep as compatibility doc; point to skill entrypoint contract. |

---

## 2. AGENTS.md Sync

- `workspace-tester/AGENTS.md`:
  - Route single-defect runs to `workspace-tester/skills/defect-test/SKILL.md` as canonical flow.
  - Clarify dependency: `defect-test` must resolve shared-analysis artifacts under `.agents/skills/single-defect-analysis/runs/<issue_key>/`.
  - Clarify approval policy: no approval for normal testing phases; approval required only for destructive/external mutations (Jira comment/create/transition) and manual override actions for final notification retry decisions.
- Root `AGENTS.md`:
  - No mandatory-skill change needed.
  - Skill placement reflects shared (`.agents/skills`) + workspace-local (`workspace-tester/skills`) split.

---

## 3. Skills Content Specification

### 3.1 `workspace-tester/skills/defect-test/SKILL.md`

Purpose:
- Execute FC and exploratory testing for one defect issue, using shared analysis artifacts and producing tester run evidence plus callback status.

When to trigger:
- Input is a single Jira issue key/URL and no pre-existing feature QA plan.
- Tester resumes or refreshes an existing defect test run.
- Upstream workflow requests defect retest after code change.

Input contract:
- `issue_key`: string, example `BCIN-7890`.
- `issue_url`: string optional.
- `refresh_mode`: enum optional (`use_existing`, `smart_refresh`, `full_regenerate`, `generate_from_cache`, `resume`).
- `analysis_mode`: enum optional (`reuse_existing_analysis`, `refresh_analysis`).
- `callback_target`: object optional for reporter callback routing.

Output contract:
- `<skill-root>/runs/<issue_key>/reports/execution-summary.md`
- `<skill-root>/runs/<issue_key>/screenshots/<step>.png`
- `<skill-root>/runs/<issue_key>/task.json`
- `<skill-root>/runs/<issue_key>/run.json`
- `<skill-root>/runs/<issue_key>/phase0_spawn_manifest.json` when shared analysis must be run.

Workflow/phase responsibilities:
- Orchestrator executes phase scripts only.
- Phase 0 resolves analysis dependency and may spawn shared `single-defect-analysis`.
- Execution/reporting/callback lifecycle handled by script phases; no inline artifact writes in SKILL instructions.

Error/ambiguity policy:
- Stop and ask for destructive mode choice on non-fresh states.
- Stop on missing shared-analysis artifacts after spawn/post cycle.
- Do not auto-approve Jira mutations.
- Persist callback and notification retry state in `task.json`/`run.json`.

Quality rules:
- Runtime artifacts only under `workspace-tester/skills/defect-test/runs/<issue_key>/`.
- Shared-analysis artifacts read from `.agents/skills/single-defect-analysis/runs/<issue_key>/`.
- No hardcoded absolute paths; derive workspace root from script location.
- `scripts/lib/` contains reusable logic.
- `scripts/test/` has one-to-one coverage stubs.

Classification:
- `workspace-local`

Why this placement:
- Execution tooling, environment assumptions, and evidence contracts are specific to tester workspace operations.

Existing skills reused directly:
- `site-knowledge-search` - context enrichment for execution.
- `test-report` - standardized execution summary generation.
- `jira-cli` - optional bug comment/create/transition under explicit approval.
- `feishu-notify` - final summary dispatch.
- `github` - optional if execution needs PR metadata lookup.
- `confluence` - not required in this flow; explicit non-use.

---

## 4. reference.md Content Specification

### 4.1 `workspace-tester/skills/defect-test/reference.md`

Must include:
- State machine/invariants:
  - Canonical `REPORT_STATE` for tester-run artifacts.
  - Analysis dependency invariant: shared-analysis artifacts must exist before phase1 intake.
  - Destructive mutation approval gates and notification fallback invariant.
- Schema contracts:
  - `task.json` and `run.json` additive fields.
  - callback payload schema to shared analysis skill phase6 input.
- Path conventions:
  - `SKILL_ROOT` and `WORKSPACE_ROOT` derivation from script path.
  - shared-analysis root computed as `${WORKSPACE_ROOT}/.agents/skills/single-defect-analysis`.
- Validation commands:
  - check resume, analysis artifact presence checks, callback smoke checks, test stubs.
- Failure/recovery examples:
  - missing analysis artifacts.
  - spawn timeout.
  - reporter callback failure and retry.
  - final notification failure with `notification_pending`.
- Package defaults/exceptions:
  - OpenClaw `scripts/test/` convention.

---

## 5. Workflow Design

Entrypoint skill path: `workspace-tester/skills/defect-test/SKILL.md`

Orchestrator contract:
1. Run `phaseN.sh <issue_key> <run_dir>`.
2. If `SPAWN_MANIFEST` is emitted, spawn requests, wait, run `phaseN.sh --post`.
3. Stop on non-zero exit.

### Phase 0: Existing-State Check and Analysis Dependency Resolution

Actions:
1. Resolve `SKILL_ROOT`, `WORKSPACE_ROOT`, and `RUN_DIR` from script location.
2. Run `check_resume.sh` and classify canonical `REPORT_STATE`.
3. For existing states, prompt for canonical mode (`use_existing`, `smart_refresh`, `full_regenerate`, `generate_from_cache`, `resume`).
4. Compute shared analysis run path:
   - `${WORKSPACE_ROOT}/.agents/skills/single-defect-analysis/runs/<issue_key>/`
5. If analysis artifacts missing (`<issue_key>_TESTING_PLAN.md`, `tester_handoff.json`):
   - emit `phase0_spawn_manifest.json` to run shared `single-defect-analysis`.
6. If artifacts exist:
   - offer analysis choice: reuse vs refresh (refresh triggers shared skill spawn).
7. On destructive run mode, archive prior tester artifacts.

User interaction checkpoints:
1. Done: mode selected and analysis dependency satisfied.
2. Blocked: waiting for mode choice or analysis refresh decision.
3. Questions: reuse existing analysis or refresh analysis.
4. Assumption policy: never auto-refresh analysis when reusable artifacts exist.

State updates:
1. `task.json.current_phase = "phase0_prepare"`.
2. `task.json.overall_status = "in_progress"` or `waiting_for_analysis`.
3. `run.json.updated_at` refreshed.

Verification:
```bash
workspace-tester/skills/defect-test/scripts/check_resume.sh BCIN-7890 \
  workspace-tester/skills/defect-test/runs/BCIN-7890
test -f .agents/skills/single-defect-analysis/runs/BCIN-7890/BCIN-7890_TESTING_PLAN.md
```

### Phase 1: Shared Analysis Intake

Actions:
1. Read testing plan and `tester_handoff.json` from shared-analysis run root.
2. Validate handoff schema and extract FC/exploratory scope.
3. Normalize execution queue artifact for phase3.

User interaction checkpoints:
1. Done: intake validated.
2. Blocked: missing/malformed analysis artifacts.
3. Questions: if shared run is stale, ask whether to refresh shared analysis.
4. Assumption policy: do not fabricate missing handoff fields.

State updates:
1. `task.json.current_phase = "phase1_analysis_intake"`.
2. `task.json.overall_status = "testing"`.

Verification:
```bash
jq -r '.risk_level,.fc_steps_count' .agents/skills/single-defect-analysis/runs/BCIN-7890/tester_handoff.json
```

### Phase 2: Site Knowledge Context

Actions:
1. Invoke `site-knowledge-search`.
2. Persist result to `<run_dir>/site_context.md`.
3. Update freshness metadata.

User interaction checkpoints:
1. Done: site context available.
2. Blocked: no domain mapping and no fallback.
3. Questions: proceed with fallback domain or stop.
4. Assumption policy: do not hide uncertainty in domain mapping.

State updates:
1. `task.json.current_phase = "phase2_site_context"`.
2. `run.json.site_context_generated_at` set.

Verification:
```bash
test -f workspace-tester/skills/defect-test/runs/BCIN-7890/site_context.md
```

### Phase 3: FC and Exploratory Execution

Actions:
1. Execute FC steps from shared testing plan.
2. Execute exploratory charter when required by handoff.
3. Capture screenshots/logs and per-step results.
4. Persist `raw_results.json`.

User interaction checkpoints:
1. Done: all executable steps attempted and recorded.
2. Blocked: environment/tooling blockers prevent mandatory step completion.
3. Questions: retry unstable steps or finalize as blocked.
4. Assumption policy: no PASS for unexecuted mandatory steps.

State updates:
1. `task.json.current_phase = "phase3_execute"`.
2. `run.json.subtask_timestamps.execution` set.

Verification:
```bash
test -f workspace-tester/skills/defect-test/runs/BCIN-7890/raw_results.json
```

### Phase 4: Execution Report Build

Actions:
1. Invoke `test-report` to render `reports/execution-summary.md`.
2. Validate report contains totals and evidence links.
3. Persist summarized result and evidence index.

User interaction checkpoints:
1. Done: report generated.
2. Blocked: report generation failure or malformed raw results.
3. Questions: if report incomplete, ask whether to rerun partial execution.
4. Assumption policy: do not emit callback without report path.

State updates:
1. `task.json.current_phase = "phase4_report"`.
2. `task.json.result`, `task.json.evidence_path`, `task.json.test_completed_at` set.

Verification:
```bash
test -f workspace-tester/skills/defect-test/runs/BCIN-7890/reports/execution-summary.md
```

### Phase 5: Callback to Shared Analysis Skill

Actions:
1. Build callback payload for shared-analysis phase6.
2. Notify shared-analysis skill run owner with PASS/FAIL + evidence.
3. On failure, set `task.json.reporter_notification_pending = true`.

User interaction checkpoints:
1. Done: callback accepted or pending persisted.
2. Blocked: callback endpoint unavailable.
3. Questions: retry callback now vs defer to resume.
4. Assumption policy: never mark callback success without explicit acknowledgment.

State updates:
1. `task.json.current_phase = "phase5_callback"`.
2. `task.json.reporter_notification_pending` set/cleared.

Verification:
```bash
jq -r '.reporter_notification_pending,.result' workspace-tester/skills/defect-test/runs/BCIN-7890/task.json
```

### Phase 6: Optional Jira Mutation Gate (Destructive/External)

Actions:
1. If user requests Jira mutation for failed or passed outcomes, execute via `jira-cli`:
   - comment existing issue
   - create regression issue
   - transition original issue
2. Require explicit approval before any mutation.

User interaction checkpoints:
1. Done: requested mutation completed or intentionally skipped.
2. Blocked: awaiting explicit approval.
3. Questions: select mutation mode and target keys.
4. Assumption policy: no Jira mutation without explicit approval.

State updates:
1. `task.json.current_phase = "phase6_mutation_gate"`.
2. `task.json.mutation_actions` appended additively.

Verification:
```bash
jq -r '.mutation_actions // [] | length' workspace-tester/skills/defect-test/runs/BCIN-7890/task.json
```

### Phase 7: Final Notification and Completion

Actions:
1. Send final run summary through `feishu-notify`.
2. Persist `run.json.notification_pending` when send fails.
3. Mark run completion.

User interaction checkpoints:
1. Done: final status set; notification attempted.
2. Blocked: notification channel failure.
3. Questions: retry now or leave pending for resume.
4. Assumption policy: never discard pending notifications.

State updates:
1. `task.json.current_phase = "phase7_complete"`.
2. `task.json.overall_status = "completed"` when completion contract met.
3. `run.json.notification_pending` set/cleared.

Verification:
```bash
jq -r '.overall_status' workspace-tester/skills/defect-test/runs/BCIN-7890/task.json
jq -r '.notification_pending // empty' workspace-tester/skills/defect-test/runs/BCIN-7890/run.json
```

### Status Transition Map

| From | Event | To |
|------|-------|----|
| `in_progress` | analysis available | `testing` |
| `testing` | execution finished | `test_complete` |
| `test_complete` | callback sent | `callback_complete` |
| `callback_complete` | notification completed | `completed` |
| any | unrecoverable error | `failed` |

---

## 6. State Schemas

### 6.1 `task.json`

Path: `workspace-tester/skills/defect-test/runs/<issue_key>/task.json`

```json
{
  "run_key": "BCIN-7890",
  "overall_status": "in_progress",
  "current_phase": "phase0_prepare",
  "analysis_run_dir": ".agents/skills/single-defect-analysis/runs/BCIN-7890",
  "analysis_mode": "reuse_existing_analysis",
  "result": null,
  "evidence_path": null,
  "test_completed_at": null,
  "reporter_notification_pending": false,
  "mutation_actions": [],
  "phases": {
    "phase0_prepare": { "status": "completed" },
    "phase1_analysis_intake": { "status": "pending" }
  },
  "created_at": "2026-03-12T00:00:00Z",
  "updated_at": "2026-03-12T00:00:00Z"
}
```

Compatibility notes:
- Legacy semantics preserved.
- New fields additive: `analysis_run_dir`, `analysis_mode`, `mutation_actions`.

### 6.2 `run.json`

Path: `workspace-tester/skills/defect-test/runs/<issue_key>/run.json`

```json
{
  "data_fetched_at": null,
  "site_context_generated_at": null,
  "output_generated_at": null,
  "subtask_timestamps": {},
  "spawn_history": {},
  "notification_pending": null,
  "updated_at": "2026-03-12T00:00:00Z"
}
```

---

## 7. Implementation Layers

```text
workspace-tester/skills/defect-test/
  SKILL.md
  reference.md
  runs/
    <issue-key>/
  scripts/
    orchestrate.sh
    check_resume.sh
    archive_run.sh
    phase0.sh
    phase1.sh
    phase2.sh
    phase3.sh
    phase4.sh
    phase5.sh
    phase6.sh
    phase7.sh
    notify_feishu.sh
    lib/
      path_resolver.sh
      state_store.sh
      manifest_io.sh
      analysis_dependency.sh
      execution_runner.sh
      callback_client.sh
      retry.sh
    test/
      *.test.js
```

Boundary rules (`code-structure-quality`):
- `orchestrate.sh` owns phase sequencing only.
- `phaseN.sh` scripts own phase-level coordination only.
- `scripts/lib/` owns reusable transformations and side-effect wrappers.
- `scripts/test/` validates phase behavior and side-effect contracts.

Path derivation rule (no hardcoded absolute path):
- `SCRIPT_DIR="$(cd "$(dirname \"$0\")" && pwd)"`
- `SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"`
- `WORKSPACE_ROOT="$(cd "${SKILL_ROOT}/../../.." && pwd)"`
- `ANALYSIS_ROOT="${WORKSPACE_ROOT}/.agents/skills/single-defect-analysis"`

---

## 8. Script Inventory and Function Specifications

### 8.1 `workspace-tester/skills/defect-test/scripts/orchestrate.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/orchestrate.sh <issue_key>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | phase loop execution with spawn/post | argv | stdout logs | runs phase scripts | non-zero exit on phase failure |
| `run_phase` | one-phase execution with optional spawn handling | phase id | phase status | may spawn subagents | invalid manifest or post failure |

### 8.2 `workspace-tester/skills/defect-test/scripts/check_resume.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/check_resume.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | classify canonical tester `REPORT_STATE` | run dir | `REPORT_STATE=...` | none | missing/corrupted state files |

### 8.3 `workspace-tester/skills/defect-test/scripts/archive_run.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/archive_run.sh <run_dir> <mode>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | archive old tester artifacts before overwrite | run dir | archive entry log | moves files | collision or fs failure |

### 8.4 `workspace-tester/skills/defect-test/scripts/phase0.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase0.sh <issue_key> <run_dir> [--post]`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | resolve run mode and analysis dependency state | key/mode | optional `phase0_spawn_manifest.json` | may trigger spawn requirement | unresolved mode or invalid issue key |
| `post_check` | validate analysis artifacts after spawn | analysis run dir | pass/fail | reads analysis artifacts | missing required files |

### 8.5 `workspace-tester/skills/defect-test/scripts/phase1.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase1.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | intake and validate shared analysis handoff | analysis artifacts | normalized execution queue | writes queue file | schema mismatch |

### 8.6 `workspace-tester/skills/defect-test/scripts/phase2.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase2.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | run site-knowledge-search and persist context | keywords | `site_context.md` | skill invocation | no context/failure |

### 8.7 `workspace-tester/skills/defect-test/scripts/phase3.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase3.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | execute FC/exploratory test queue and persist raw results | plan + site context | `raw_results.json` | screenshots/logs captured | environment blocker |

### 8.8 `workspace-tester/skills/defect-test/scripts/phase4.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase4.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | call `test-report` and persist summary pointers | raw results | `reports/execution-summary.md` | report generation | malformed inputs or tool failure |

### 8.9 `workspace-tester/skills/defect-test/scripts/phase5.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase5.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | dispatch callback to shared-analysis run | result/evidence | callback ack state | callback side effect | callback endpoint failure |

### 8.10 `workspace-tester/skills/defect-test/scripts/phase6.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase6.sh <issue_key> <run_dir> --action <mode>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | perform approved Jira mutations | action/approval | mutation record | Jira API side effect | missing approval |

### 8.11 `workspace-tester/skills/defect-test/scripts/phase7.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/phase7.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | send final summary and set completion status | summary payload | final task state | Feishu side effect | notification failure |

### 8.12 `workspace-tester/skills/defect-test/scripts/notify_feishu.sh`

Invocation:
- `workspace-tester/skills/defect-test/scripts/notify_feishu.sh <run_dir> <payload_json>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | send final notification with fallback persistence | payload | send status | updates `run.json.notification_pending` | send failure |

---

## 9. Script Test Stub Matrix

Behavior/Test Matrix:

| Behavior | Type | Covered By |
|----------|------|------------|
| Canonical tester `REPORT_STATE` handling | Unit + integration | `check_resume.test.js`, `phase0.test.js` |
| Shared-analysis dependency resolution | Integration | `phase0.test.js`, `phase1.test.js` |
| No hardcoded path derivation correctness | Unit | `path_resolver.test.js` |
| Execution evidence contract | Integration | `phase3.test.js`, `phase4.test.js` |
| Callback pending retry semantics | Integration | `phase5.test.js` |
| Jira mutation approval gate | Unit + integration | `phase6.test.js` |
| Final notification pending fallback | Integration | `phase7.test.js`, `notify_feishu.test.js` |

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `workspace-tester/skills/defect-test/scripts/orchestrate.sh` | `workspace-tester/skills/defect-test/scripts/test/orchestrate.test.js` | phase order; spawn lifecycle; stop-on-error | `node --test workspace-tester/skills/defect-test/scripts/test/orchestrate.test.js` |
| `workspace-tester/skills/defect-test/scripts/check_resume.sh` | `workspace-tester/skills/defect-test/scripts/test/check_resume.test.js` | canonical states and freshness reporting | `node --test workspace-tester/skills/defect-test/scripts/test/check_resume.test.js` |
| `workspace-tester/skills/defect-test/scripts/archive_run.sh` | `workspace-tester/skills/defect-test/scripts/test/archive_run.test.js` | archive policy and naming collisions | `node --test workspace-tester/skills/defect-test/scripts/test/archive_run.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase0.sh` | `workspace-tester/skills/defect-test/scripts/test/phase0.test.js` | analysis exists/missing; reuse/refresh decision; spawn manifest emit | `node --test workspace-tester/skills/defect-test/scripts/test/phase0.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase1.sh` | `workspace-tester/skills/defect-test/scripts/test/phase1.test.js` | handoff validation success/failure | `node --test workspace-tester/skills/defect-test/scripts/test/phase1.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase2.sh` | `workspace-tester/skills/defect-test/scripts/test/phase2.test.js` | site context generation and fallback | `node --test workspace-tester/skills/defect-test/scripts/test/phase2.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase3.sh` | `workspace-tester/skills/defect-test/scripts/test/phase3.test.js` | result capture, blockers, screenshot indexing | `node --test workspace-tester/skills/defect-test/scripts/test/phase3.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase4.sh` | `workspace-tester/skills/defect-test/scripts/test/phase4.test.js` | execution summary generation and contract checks | `node --test workspace-tester/skills/defect-test/scripts/test/phase4.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase5.sh` | `workspace-tester/skills/defect-test/scripts/test/phase5.test.js` | callback success/failure and pending flag | `node --test workspace-tester/skills/defect-test/scripts/test/phase5.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase6.sh` | `workspace-tester/skills/defect-test/scripts/test/phase6.test.js` | approval gate and mutation branches | `node --test workspace-tester/skills/defect-test/scripts/test/phase6.test.js` |
| `workspace-tester/skills/defect-test/scripts/phase7.sh` | `workspace-tester/skills/defect-test/scripts/test/phase7.test.js` | completion status and notification fallback | `node --test workspace-tester/skills/defect-test/scripts/test/phase7.test.js` |
| `workspace-tester/skills/defect-test/scripts/notify_feishu.sh` | `workspace-tester/skills/defect-test/scripts/test/notify_feishu.test.js` | send success and `notification_pending` persistence | `node --test workspace-tester/skills/defect-test/scripts/test/notify_feishu.test.js` |

---

## 10. Files To Create / Update

| Action | Path | Expected Change |
|--------|------|-----------------|
| CREATE | `workspace-tester/skills/defect-test/SKILL.md` | Script-driven tester skill contract. |
| CREATE | `workspace-tester/skills/defect-test/reference.md` | State/path/schema/recovery rules. |
| CREATE | `workspace-tester/skills/defect-test/scripts/*` | Orchestrator and phase scripts. |
| CREATE | `workspace-tester/skills/defect-test/scripts/lib/*` | Shared logic and adapters. |
| CREATE | `workspace-tester/skills/defect-test/scripts/test/*` | One-to-one script tests. |
| UPDATE | `workspace-tester/.agents/workflows/defect-test.md` | Convert to compatibility shim referencing skill entrypoint. |
| UPDATE | `workspace-tester/AGENTS.md` | Sync routing and approval policy boundaries. |

Validation expectations:
- Shared-analysis dependency check works against `.agents/skills/single-defect-analysis/runs/<issue_key>/`.
- All script tests executable via `node --test`.
- End-to-end smoke run produces artifacts under `workspace-tester/skills/defect-test/runs/<issue_key>/`.

---

## 11. README Impact

- Add `workspace-tester/skills/defect-test/README.md` only if local policy requires README for skills.
- If maintained:
  - document dependency on shared analysis skill path.
  - include orchestrator run command and callback retry guidance.
  - include artifact contracts under `runs/<issue_key>/`.
- If README files are intentionally omitted by policy, no README change is required.

---

## 12. Backfill Coverage Table

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `workspace-tester/skills/defect-test/scripts/orchestrate.sh` | `workspace-tester/skills/defect-test/scripts/test/orchestrate.test.js` | spawn/post failure |
| `workspace-tester/skills/defect-test/scripts/check_resume.sh` | `workspace-tester/skills/defect-test/scripts/test/check_resume.test.js` | invalid run state files |
| `workspace-tester/skills/defect-test/scripts/archive_run.sh` | `workspace-tester/skills/defect-test/scripts/test/archive_run.test.js` | archive collision |
| `workspace-tester/skills/defect-test/scripts/phase0.sh` | `workspace-tester/skills/defect-test/scripts/test/phase0.test.js` | missing analysis + spawn failure |
| `workspace-tester/skills/defect-test/scripts/phase1.sh` | `workspace-tester/skills/defect-test/scripts/test/phase1.test.js` | malformed handoff file |
| `workspace-tester/skills/defect-test/scripts/phase2.sh` | `workspace-tester/skills/defect-test/scripts/test/phase2.test.js` | context generation failure |
| `workspace-tester/skills/defect-test/scripts/phase3.sh` | `workspace-tester/skills/defect-test/scripts/test/phase3.test.js` | execution blocker path |
| `workspace-tester/skills/defect-test/scripts/phase4.sh` | `workspace-tester/skills/defect-test/scripts/test/phase4.test.js` | report generation failure |
| `workspace-tester/skills/defect-test/scripts/phase5.sh` | `workspace-tester/skills/defect-test/scripts/test/phase5.test.js` | callback failure and pending state |
| `workspace-tester/skills/defect-test/scripts/phase6.sh` | `workspace-tester/skills/defect-test/scripts/test/phase6.test.js` | mutation without approval |
| `workspace-tester/skills/defect-test/scripts/phase7.sh` | `workspace-tester/skills/defect-test/scripts/test/phase7.test.js` | final notify failure |
| `workspace-tester/skills/defect-test/scripts/notify_feishu.sh` | `workspace-tester/skills/defect-test/scripts/test/notify_feishu.test.js` | pending payload write failure |

---

## 13. Quality Gates

- [ ] Skill-first entrypoint remains `workspace-tester/skills/defect-test/SKILL.md`.
- [ ] Canonical Phase 0 `REPORT_STATE` behavior preserved.
- [ ] `task.json`/`run.json` schema changes are additive.
- [ ] Runtime artifacts live only under `workspace-tester/skills/defect-test/runs/<issue_key>/`.
- [ ] Analysis dependency path contract is enforced:
  - `.agents/skills/single-defect-analysis/runs/<issue_key>/`.
- [ ] No hardcoded absolute paths in script contracts.
- [ ] Reuse existing skills directly where appropriate (`site-knowledge-search`, `test-report`, `jira-cli`, `feishu-notify`).
- [ ] `confluence` is intentionally non-required for this flow and documented.
- [ ] `scripts/`, `scripts/lib/`, `scripts/test/` boundaries satisfy `code-structure-quality`.
- [ ] One-to-one script-to-test mapping complete.
- [ ] Behavior/test matrix includes unit and integration coverage expectations (`function-test-coverage`).
- [ ] Explicit user approval gate exists only for destructive/external mutations.
- [ ] Final notification fallback persists `run.json.notification_pending`.
- [ ] Reviewer gate (`openclaw-agent-design-review`) passes with no P0/P1 findings.

---

## 14. References

- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/openclaw-agent-design-review/reference.md`
- `.agents/skills/agent-idempotency/SKILL.md`
- `.agents/skills/code-quality-orchestrator/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `/Users/xuyin/.codex/skills/.system/skill-creator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-tester/.agents/workflows/defect-test.md`
- `workspace-reporter/.agents/workflows/single-defect-analysis.md`
