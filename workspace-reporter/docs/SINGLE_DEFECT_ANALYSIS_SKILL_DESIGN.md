# Single Defect Analysis Skill - Agent Design

> **Design ID:** `single-defect-analysis-skill-2026-03-12`
> **Date:** 2026-03-12
> **Status:** Draft
> **Scope:** Redesign single-defect analysis as a shared script-driven skill entrypoint with canonical Phase 0 idempotency and tester handoff output.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

- Base requirements read:
  - `.agents/skills/openclaw-agent-design/SKILL.md`
  - `.agents/skills/openclaw-agent-design/reference.md`
  - `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
  - `workspace-reporter/.agents/workflows/single-defect-analysis.md`
- Mandatory design dependencies:
  - `clawddocs` consulted for OpenClaw conventions and skill-first architecture.
  - `agent-idempotency` applied for Phase 0 `REPORT_STATE`, resume, and archive-before-overwrite semantics.
  - `skill-creator` applied for `SKILL.md` trigger/input/output contract structure.
  - `code-structure-quality` applied for script/lib/test boundaries and side-effect ownership.
  - `openclaw-agent-design-review` is a blocking gate before finalization.
- Code quality requirements incorporated from `code-quality-orchestrator`:
  - Thin orchestration scripts.
  - Reusable logic in `scripts/lib/`.
  - Script test stubs in `scripts/test/` with one-to-one mapping.
  - Behavior/test matrix and explicit validation commands.

---

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.agents/skills/single-defect-analysis/SKILL.md` | Shared skill entrypoint contract. |
| CREATE | `.agents/skills/single-defect-analysis/reference.md` | Canonical workflow/state/path contract. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/orchestrate.sh` | Script-driven orchestrator loop. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/check_resume.sh` | Canonical `REPORT_STATE` classifier for this skill. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/archive_run.sh` | Archive-before-overwrite handling. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase0.sh` | Existing-state check and run prep. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase1.sh` | Jira issue context fetch. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase2.sh` | PR discovery and PR-analysis spawn manifest/post-check. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase3.sh` | FC risk scoring. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase4.sh` | Testing plan generation. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase5.sh` | Tester handoff + callback payload generation. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase6.sh` | Test outcome intake and status update. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/phase7.sh` | Destructive Jira mutation gate + final notification. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/notify_feishu.sh` | Notification wrapper with `run.json.notification_pending` fallback. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/lib/*.sh` | Shared helpers (path, state, manifest, jira/github wrappers, scoring). |
| CREATE | `.agents/skills/single-defect-analysis/scripts/test/*.test.js` | Script-level test stubs (OpenClaw `scripts/test/` convention). |
| UPDATE | `workspace-reporter/.agents/workflows/single-defect-analysis.md` | Route to skill entrypoint, keep legacy doc as thin shim. |

---

## 2. AGENTS.md Sync

- `workspace-reporter/AGENTS.md`:
  - Keep routing rule ("single Jira issue -> single-defect-analysis"), but update text to reference `.agents/skills/single-defect-analysis/SKILL.md` as canonical implementation contract.
  - Remove "confirm before every step" expectation for this flow; keep approvals only for destructive/external mutations (Jira comment/create/transition and final notification dispatch retries when manual override is needed).
- Root `AGENTS.md`:
  - No new mandatory-skill changes required.
  - Mention new shared skill placement as part of skill inventory refresh if inventory is maintained manually.

---

## 3. Skills Content Specification

### 3.1 `.agents/skills/single-defect-analysis/SKILL.md`

Purpose:
- Generate single-defect testing analysis artifacts used by tester workflows: testing plan, risk summary, and tester handoff payload.

When to trigger:
- User or subagent asks to analyze one Jira issue key/URL for FC verification planning.
- Tester workflow requires analysis artifacts and they are missing/stale.
- Resume/regenerate request exists for one `issue_key` under skill `runs/`.

Input contract:
- `issue_key`: string, example `BCIN-7890`, source user input or caller skill.
- `issue_url`: string optional, example `https://<org>.atlassian.net/browse/BCIN-7890`.
- `refresh_mode`: enum optional (`use_existing`, `smart_refresh`, `full_regenerate`, `generate_from_cache`, `resume`), source Phase 0 choice.
- `invoked_by`: string optional, example `workspace-tester/skills/defect-test`.
- `callback_target`: object optional, example `{ "skill": "defect-test", "run_key": "BCIN-7890" }`.

Output contract:
- `<skill-root>/runs/<issue_key>/<issue_key>_TESTING_PLAN.md`
- `<skill-root>/runs/<issue_key>/tester_handoff.json`
- `<skill-root>/runs/<issue_key>/task.json`
- `<skill-root>/runs/<issue_key>/run.json`
- `<skill-root>/runs/<issue_key>/phase2_spawn_manifest.json` when PR analysis subagents are required.

Workflow/phase responsibilities:
- Orchestrator calls phase scripts only.
- For spawn-enabled phases, orchestrator executes `phaseN.sh`, reads `SPAWN_MANIFEST`, waits for completion, then runs `phaseN.sh --post`.
- Inline reasoning never writes core artifacts directly; scripts own all side effects.

Error/ambiguity policy:
- Stop and ask when `REPORT_STATE` requires a destructive path choice.
- Stop and ask for malformed issue key input.
- Retry transient CLI failures via shared retry helper before failing phase.
- Persist recovery context in `task.json`/`run.json` before exit.

Quality rules:
- Canonical `REPORT_STATE` semantics from `.agents/skills/openclaw-agent-design/reference.md`.
- Runtime artifacts only under `<skill-root>/runs/<issue_key>/`.
- No hardcoded absolute paths; derive from script location.
- Script tests live in `scripts/test/`.
- Thin orchestration; business logic in `scripts/lib/`.

Classification:
- `shared`

Why this placement:
- Analysis artifacts are consumed by reporter and tester domains; shared location prevents duplication and supports cross-workspace reuse.

Existing skills reused directly:
- `jira-cli` - issue context and mutation operations.
- `github` - PR metadata/diff retrieval.
- `feishu-notify` - terminal notification dispatch.
- `confluence` - not required in this workflow; explicit non-use.
- Direct reuse is sufficient for listed shared skills; no wrapper is introduced because there is no contract gap.

---

## 4. reference.md Content Specification

### 4.1 `.agents/skills/single-defect-analysis/reference.md`

Must include:
- State machine and invariants:
  - Canonical `REPORT_STATE` (`FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`).
  - Destructive mutation approval gates (Jira comment/create/transition).
  - Notification fallback invariant: failed sends must persist `run.json.notification_pending` with full payload.
- Field-level schemas:
  - `task.json` phase markers and lifecycle fields.
  - `run.json` freshness, spawn, and notification fields.
  - `tester_handoff.json` schema and required fields.
- Path conventions:
  - Skill root derivation from script path.
  - Run root derivation: `<skill-root>/runs/<issue_key>/`.
  - Archive location and naming.
- Validation commands:
  - `check_resume.sh`, phase smoke commands, `jq` schema checks, script tests.
- Failure/recovery examples:
  - Missing Jira credentials.
  - No PR links.
  - Spawn timeout or partial PR analysis.
  - Notification send failure with pending payload persistence.
- Package defaults and exceptions:
  - OpenClaw `scripts/test/` exception is canonical for this package.

---

## 5. Workflow Design

Entrypoint skill path: `.agents/skills/single-defect-analysis/SKILL.md`

Orchestrator contract (same pattern as `qa-plan-orchestrator`):
1. Call `phaseN.sh <issue_key> <run_dir>`.
2. If stdout prints `SPAWN_MANIFEST: <path>`, spawn listed subagent requests, wait, then call `phaseN.sh --post`.
3. Stop immediately on non-zero exit.

### Phase 0: Existing-State Check and Run Preparation

Actions:
1. Resolve `SKILL_ROOT` and `RUN_DIR` from script path (no hardcoded absolute path).
2. Run `scripts/check_resume.sh <issue_key> <run_dir>` and classify canonical `REPORT_STATE`.
3. For `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, present canonical options and map to mode.
4. On regenerate modes, run `scripts/archive_run.sh` before overwrite.
5. Initialize or patch `task.json` and `run.json` additively.

User interaction checkpoints:
1. Done: `REPORT_STATE` classified and mode selected.
2. Blocked: waiting for mode choice when prior artifacts exist.
3. Questions: `use_existing` vs `smart_refresh` vs `full_regenerate` vs `generate_from_cache` vs `resume`.
4. Assumption policy: never auto-pick destructive mode.

State updates:
1. `task.json.current_phase = "phase0_prepare"`.
2. `task.json.overall_status = "in_progress"`.
3. `run.json.updated_at` refreshed.

Verification:
```bash
.agents/skills/single-defect-analysis/scripts/check_resume.sh BCIN-7890 \
  .agents/skills/single-defect-analysis/runs/BCIN-7890
jq -r '.overall_status,.current_phase' .agents/skills/single-defect-analysis/runs/BCIN-7890/task.json
```

### Phase 1: Issue Context Fetch

Actions:
1. Use `jira-cli` to fetch issue JSON into `context/issue.json`.
2. Normalize key fields into `context/issue_summary.json`.
3. Extract PR URLs from description/comments.

User interaction checkpoints:
1. Done: issue context captured.
2. Blocked: Jira auth/permission failure.
3. Questions: if issue key invalid, ask for corrected key.
4. Assumption policy: do not continue with partial/invalid issue payload.

State updates:
1. `task.json.current_phase = "phase1_issue_fetch"`.
2. `run.json.data_fetched_at` set.

Verification:
```bash
test -f .agents/skills/single-defect-analysis/runs/BCIN-7890/context/issue.json
```

### Phase 2: PR Analysis Spawn and Consolidation

Actions:
1. If PR links exist, write `phase2_spawn_manifest.json` with one request per PR (max configurable concurrency).
2. Spawn PR analyzer subagents that use `github` skill and write `context/prs/<pr>_impact.md`.
3. On `--post`, validate required PR artifacts and build `context/affected_domains.json`.
4. If no PR links, write `context/no_pr_links.md` and continue.

User interaction checkpoints:
1. Done: PR impacts consolidated or no-PR marker persisted.
2. Blocked: spawn failures or missing required post artifacts.
3. Questions: on partial PR analysis, ask whether to continue with incomplete coverage.
4. Assumption policy: never fabricate PR impact output.

State updates:
1. `task.json.current_phase = "phase2_pr_analysis"`.
2. `run.json.subtask_timestamps.pr_analysis` set.
3. `run.json.spawn_history.phase2` updated.

Verification:
```bash
test -f .agents/skills/single-defect-analysis/runs/BCIN-7890/context/affected_domains.json
```

### Phase 3: FC Risk Scoring

Actions:
1. Apply weighted risk matrix to issue + PR context.
2. Persist score/rationale to `context/fc_risk.json`.

User interaction checkpoints:
1. Done: risk profile persisted.
2. Blocked: missing mandatory fields for scoring.
3. Questions: if missing priority/status, ask whether to use fallback defaults.
4. Assumption policy: no hidden defaults for missing mandatory fields.

State updates:
1. `task.json.current_phase = "phase3_risk_scoring"`.
2. `task.json.fc_risk` set additively.

Verification:
```bash
jq -r '.score,.risk_level' .agents/skills/single-defect-analysis/runs/BCIN-7890/context/fc_risk.json
```

### Phase 4: Testing Plan Generation

Actions:
1. Build `<issue_key>_TESTING_PLAN.md` from issue, PR, and risk data.
2. Enforce output format for FC steps and exploratory charter.

User interaction checkpoints:
1. Done: plan document generated.
2. Blocked: template rendering failure.
3. Questions: if FC reproduction steps missing in issue, request minimal user supplement.
4. Assumption policy: do not invent domain-specific steps without evidence.

State updates:
1. `task.json.current_phase = "phase4_plan_generated"`.
2. `task.json.testing_plan_generated_at` set.
3. `run.json.output_generated_at` set.

Verification:
```bash
test -f .agents/skills/single-defect-analysis/runs/BCIN-7890/BCIN-7890_TESTING_PLAN.md
```

### Phase 5: Tester Handoff and Initial Notification

Actions:
1. Write `tester_handoff.json` with risk, domains, FC/exploratory requirements.
2. Emit callback payload for tester skill consumption.
3. Send Feishu "analysis ready" notification through `feishu-notify`.
4. If send fails, persist full pending payload to `run.json.notification_pending`.

User interaction checkpoints:
1. Done: handoff artifact ready; notification attempted.
2. Blocked: notification channel unavailable.
3. Questions: if callback target missing, ask caller to provide fallback handoff channel.
4. Assumption policy: never drop failed notification payload.

State updates:
1. `task.json.current_phase = "phase5_handoff_ready"`.
2. `task.json.tester_notified_at` set on success.
3. `run.json.notification_pending` set/cleared.

Verification:
```bash
test -f .agents/skills/single-defect-analysis/runs/BCIN-7890/tester_handoff.json
jq -r '.notification_pending // empty' .agents/skills/single-defect-analysis/runs/BCIN-7890/run.json
```

### Phase 6: Test Outcome Intake

Actions:
1. Ingest tester callback payload and execution report path.
2. Validate callback authenticity and run key matching.
3. Persist result summary and evidence pointers.

User interaction checkpoints:
1. Done: PASS/FAIL outcome recorded.
2. Blocked: missing execution report or mismatched run key.
3. Questions: ask for corrected callback payload if malformed.
4. Assumption policy: do not mark result without evidence path.

State updates:
1. `task.json.current_phase = "phase6_outcome_intake"`.
2. `task.json.test_result`, `task.json.evidence_path`, `task.json.test_completed_at` set.

Verification:
```bash
jq -r '.test_result,.evidence_path' .agents/skills/single-defect-analysis/runs/BCIN-7890/task.json
```

### Phase 7: Destructive Jira Mutation Gate and Final Notification

Actions:
1. If `PASS`: optional Jira transition/comment path behind explicit user approval gate.
2. If `FAIL`: optional Jira comment/new-bug creation path behind explicit user approval gate.
3. Dispatch final Feishu completion/failure summary.
4. On notification failure, persist complete payload in `run.json.notification_pending`.

User interaction checkpoints:
1. Done: outcome closed or no-mutation path finalized; final notification attempted.
2. Blocked: awaiting approval for Jira mutation.
3. Questions: choose mutation action (comment/create/transition/no action).
4. Assumption policy: never mutate Jira without explicit approval.

State updates:
1. `task.json.current_phase = "phase7_finalize"`.
2. `task.json.overall_status` transitions to `completed` or mutation-specific terminal status.
3. `run.json.notification_pending` set/cleared.

Verification:
```bash
jq -r '.overall_status,.current_phase' .agents/skills/single-defect-analysis/runs/BCIN-7890/task.json
jq -r '.notification_pending // empty' .agents/skills/single-defect-analysis/runs/BCIN-7890/run.json
```

### Status Transition Map

| From | Event | To |
|------|-------|----|
| `in_progress` | phase0 mode selected | `in_progress` |
| `in_progress` | plan generated | `awaiting_tester` |
| `awaiting_tester` | callback received | `result_recorded` |
| `result_recorded` | mutation approved and done | `completed` |
| `result_recorded` | no mutation requested | `completed` |
| any | unrecoverable error | `failed` |

---

## 6. State Schemas

### 6.1 `task.json`

Path: `.agents/skills/single-defect-analysis/runs/<issue_key>/task.json`

```json
{
  "run_key": "BCIN-7890",
  "mode": "single_issue_testing_plan",
  "overall_status": "in_progress",
  "current_phase": "phase0_prepare",
  "invoked_by": "workspace-tester/skills/defect-test",
  "invoked_at": "2026-03-12T00:00:00Z",
  "testing_plan_generated_at": null,
  "tester_notified_at": null,
  "test_result": null,
  "test_completed_at": null,
  "evidence_path": null,
  "phases": {
    "phase0_prepare": { "status": "completed" },
    "phase1_issue_fetch": { "status": "pending" }
  },
  "created_at": "2026-03-12T00:00:00Z",
  "updated_at": "2026-03-12T00:00:00Z"
}
```

Additive compatibility notes:
- Existing semantic keys are preserved.
- New keys are additive (`invoked_by`, `test_result`, `evidence_path`).

### 6.2 `run.json`

Path: `.agents/skills/single-defect-analysis/runs/<issue_key>/run.json`

```json
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "subtask_timestamps": {},
  "spawn_history": {},
  "notification_pending": null,
  "updated_at": "2026-03-12T00:00:00Z"
}
```

`notification_pending` contract:
- Full payload object, not boolean.
- Cleared only on confirmed successful send.

---

## 7. Implementation Layers

```text
.agents/skills/single-defect-analysis/
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
      retry.sh
      jira_client.sh
      github_client.sh
      risk_score.sh
      plan_render.sh
    test/
      *.test.js
```

Boundary rules (`code-structure-quality`):
- `orchestrate.sh` only controls phase order, user checkpoints, and spawn-post loop.
- `phaseN.sh` handles phase orchestration and delegates transformations to `lib/`.
- `lib/` owns deterministic transformations and side-effect adapters.
- `scripts/test/` covers scripts and key lib adapters.

Path derivation rule (no hardcoded absolute paths):
- `SCRIPT_DIR="$(cd "$(dirname \"$0\")" && pwd)"`
- `SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"`
- `RUN_DIR="${SKILL_ROOT}/runs/${ISSUE_KEY}"`

---

## 8. Script Inventory and Function Specifications

### 8.1 `.agents/skills/single-defect-analysis/scripts/orchestrate.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/orchestrate.sh <issue_key>`

Inputs / outputs / artifacts:
- Input: `issue_key`, optional mode flags.
- Output: phase progression and terminal status in `task.json`.
- Side effects: phase script execution and spawn handling.

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Run phase loop with spawn/post pattern | argv | stdout logs | executes scripts and updates task state | exits non-zero on phase error |
| `run_phase` | Execute one phase and optional `--post` | phase id | phase stdout | may spawn subagents | returns failure on missing manifest/post failure |

### 8.2 `.agents/skills/single-defect-analysis/scripts/check_resume.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/check_resume.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Emit canonical `REPORT_STATE` and freshness | run files | `REPORT_STATE=<...>` | none | invalid run dir / unreadable files |

### 8.3 `.agents/skills/single-defect-analysis/scripts/archive_run.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/archive_run.sh <run_dir> <mode>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Archive outputs before destructive regenerate | run dir | archive path log | moves old artifacts to `archive/` | archive collision / fs error |

### 8.4 `.agents/skills/single-defect-analysis/scripts/phase0.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase0.sh <issue_key> <run_dir> [--post]`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Prepare run and map Phase 0 mode | key/mode | updated task/run state | writes task/run files | missing user choice for non-fresh states |

### 8.5 `.agents/skills/single-defect-analysis/scripts/phase1.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase1.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Fetch issue context via `jira-cli` adapter | issue key | `context/issue.json` | Jira API calls | auth, not found, rate-limit failures |

### 8.6 `.agents/skills/single-defect-analysis/scripts/phase2.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase2.sh <issue_key> <run_dir> [--post]`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Emit PR analysis spawn manifest or no-PR marker | issue context | `phase2_spawn_manifest.json` or marker | writes manifest | malformed PR URL extraction |
| `post_check` | Validate spawned PR outputs and synthesize domain map | PR impact files | `context/affected_domains.json` | reads/writes context files | missing required PR outputs |

### 8.7 `.agents/skills/single-defect-analysis/scripts/phase3.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase3.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Score FC risk and write rationale | issue/pr context | `context/fc_risk.json` | writes risk file | incomplete context for mandatory signals |

### 8.8 `.agents/skills/single-defect-analysis/scripts/phase4.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase4.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Render `<issue_key>_TESTING_PLAN.md` | normalized context | testing plan markdown | writes output file | template render failure |

### 8.9 `.agents/skills/single-defect-analysis/scripts/phase5.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase5.sh <issue_key> <run_dir>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Build tester handoff and attempt ready notification | plan/risk | `tester_handoff.json` | sends Feishu message | notification channel failure |

### 8.10 `.agents/skills/single-defect-analysis/scripts/phase6.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase6.sh <issue_key> <run_dir> --callback <path>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Ingest tester callback payload and evidence pointers | callback payload | updated task fields | writes task/run | callback schema mismatch |

### 8.11 `.agents/skills/single-defect-analysis/scripts/phase7.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/phase7.sh <issue_key> <run_dir> --action <mode>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Perform approved Jira mutations and final notification | action flags | terminal task state | Jira and Feishu side effects | unapproved mutation request |

### 8.12 `.agents/skills/single-defect-analysis/scripts/notify_feishu.sh`

Invocation:
- `.agents/skills/single-defect-analysis/scripts/notify_feishu.sh <run_dir> <payload_json>`

| function | responsibility | inputs | outputs | side effects | failure mode |
|----------|----------------|--------|---------|--------------|--------------|
| `main` | Send notification using `feishu-notify` and persist fallback | payload | send status | updates `run.json.notification_pending` | send/CLI failure |

---

## 9. Script Test Stub Matrix

Standards Exception Note:
- OpenClaw script-bearing design uses `scripts/test/` as the canonical test location. This is a documented domain exception to the generic top-level `tests/` layout.

Behavior/Test Matrix:

| Behavior | Type | Covered By |
|----------|------|------------|
| Canonical `REPORT_STATE` classification and options | Unit + integration | `check_resume.test.js`, `phase0.test.js` |
| Archive-before-overwrite on destructive modes | Integration | `archive_run.test.js` |
| Spawn-manifest lifecycle (`phase2` + `--post`) | Integration | `phase2.test.js`, `orchestrate.test.js` |
| Risk scoring determinism | Unit | `phase3.test.js` |
| Testing plan output contract | Integration | `phase4.test.js` |
| Notification pending fallback | Integration | `phase5.test.js`, `notify_feishu.test.js` |
| Jira mutation approval gate | Unit + integration | `phase7.test.js` |

| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `.agents/skills/single-defect-analysis/scripts/orchestrate.sh` | `.agents/skills/single-defect-analysis/scripts/test/orchestrate.test.js` | phase order; spawn manifest path; stop-on-error | `node --test .agents/skills/single-defect-analysis/scripts/test/orchestrate.test.js` |
| `.agents/skills/single-defect-analysis/scripts/check_resume.sh` | `.agents/skills/single-defect-analysis/scripts/test/check_resume.test.js` | `FINAL_EXISTS`; `DRAFT_EXISTS`; `CONTEXT_ONLY`; `FRESH` | `node --test .agents/skills/single-defect-analysis/scripts/test/check_resume.test.js` |
| `.agents/skills/single-defect-analysis/scripts/archive_run.sh` | `.agents/skills/single-defect-analysis/scripts/test/archive_run.test.js` | archive naming; collision suffix; no-overwrite | `node --test .agents/skills/single-defect-analysis/scripts/test/archive_run.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase0.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase0.test.js` | choice gating; additive state updates; missing choice failure | `node --test .agents/skills/single-defect-analysis/scripts/test/phase0.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase1.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase1.test.js` | Jira success; auth failure; malformed issue | `node --test .agents/skills/single-defect-analysis/scripts/test/phase1.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase2.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase2.test.js` | manifest emit; no-PR path; post-validation failure | `node --test .agents/skills/single-defect-analysis/scripts/test/phase2.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase3.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase3.test.js` | scoring matrix; missing signal rejection | `node --test .agents/skills/single-defect-analysis/scripts/test/phase3.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase4.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase4.test.js` | markdown contract; exploratory section inclusion/omission | `node --test .agents/skills/single-defect-analysis/scripts/test/phase4.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase5.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase5.test.js` | handoff schema; notify success; pending fallback | `node --test .agents/skills/single-defect-analysis/scripts/test/phase5.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase6.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase6.test.js` | callback ingestion; schema mismatch | `node --test .agents/skills/single-defect-analysis/scripts/test/phase6.test.js` |
| `.agents/skills/single-defect-analysis/scripts/phase7.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase7.test.js` | approval gate; Jira transition/comment/create paths | `node --test .agents/skills/single-defect-analysis/scripts/test/phase7.test.js` |
| `.agents/skills/single-defect-analysis/scripts/notify_feishu.sh` | `.agents/skills/single-defect-analysis/scripts/test/notify_feishu.test.js` | send success; `notification_pending` persistence | `node --test .agents/skills/single-defect-analysis/scripts/test/notify_feishu.test.js` |

---

## 10. Files To Create / Update

| Action | Path | Expected Change |
|--------|------|-----------------|
| CREATE | `.agents/skills/single-defect-analysis/SKILL.md` | Script-first entrypoint contract and phase loop instructions. |
| CREATE | `.agents/skills/single-defect-analysis/reference.md` | State machine, schemas, path contracts, validation commands, recovery rules. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/*` | Orchestrator, phases, utilities. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/lib/*` | Deterministic logic and side-effect adapters. |
| CREATE | `.agents/skills/single-defect-analysis/scripts/test/*` | One-to-one script test stubs. |
| UPDATE | `workspace-reporter/.agents/workflows/single-defect-analysis.md` | Convert to compatibility shim that points to skill entrypoint. |
| UPDATE | `workspace-reporter/AGENTS.md` | Sync routing language and approval policy boundaries. |

Validation expectations:
- `check_resume.sh` returns canonical states.
- All script stubs runnable via `node --test`.
- Phase smoke run produces run folder at `.agents/skills/single-defect-analysis/runs/<issue_key>/`.

---

## 11. README Impact

- Add `.agents/skills/single-defect-analysis/README.md` only if workspace policy requires skill-specific README files.
- If README is maintained:
  - Include runtime folder contract (`runs/<issue_key>/`).
  - Include command examples for orchestrator and phase smoke tests.
  - Include non-hardcoded path derivation rule and required external skills.
- If README is not policy-required, no README change is required.

---

## 12. Backfill Coverage Table

| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `.agents/skills/single-defect-analysis/scripts/orchestrate.sh` | `.agents/skills/single-defect-analysis/scripts/test/orchestrate.test.js` | spawn post-check failure |
| `.agents/skills/single-defect-analysis/scripts/check_resume.sh` | `.agents/skills/single-defect-analysis/scripts/test/check_resume.test.js` | corrupted state files |
| `.agents/skills/single-defect-analysis/scripts/archive_run.sh` | `.agents/skills/single-defect-analysis/scripts/test/archive_run.test.js` | archive collision handling |
| `.agents/skills/single-defect-analysis/scripts/phase0.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase0.test.js` | missing selection for non-fresh state |
| `.agents/skills/single-defect-analysis/scripts/phase1.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase1.test.js` | Jira auth failure |
| `.agents/skills/single-defect-analysis/scripts/phase2.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase2.test.js` | missing spawned PR outputs |
| `.agents/skills/single-defect-analysis/scripts/phase3.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase3.test.js` | incomplete scoring inputs |
| `.agents/skills/single-defect-analysis/scripts/phase4.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase4.test.js` | template render failure |
| `.agents/skills/single-defect-analysis/scripts/phase5.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase5.test.js` | handoff validation failure |
| `.agents/skills/single-defect-analysis/scripts/phase6.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase6.test.js` | callback schema mismatch |
| `.agents/skills/single-defect-analysis/scripts/phase7.sh` | `.agents/skills/single-defect-analysis/scripts/test/phase7.test.js` | unapproved mutation attempt |
| `.agents/skills/single-defect-analysis/scripts/notify_feishu.sh` | `.agents/skills/single-defect-analysis/scripts/test/notify_feishu.test.js` | notification persistence failure |

---

## 13. Quality Gates

- [ ] Skill-first entrypoint remains `.agents/skills/single-defect-analysis/SKILL.md`.
- [ ] Canonical Phase 0 `REPORT_STATE` semantics preserved.
- [ ] `task.json` / `run.json` changes are additive and backward-compatible.
- [ ] Runtime artifacts are only under `<skill-root>/runs/<issue_key>/`.
- [ ] No hardcoded absolute file paths in script contracts.
- [ ] Shared-skill placement is justified and reusable.
- [ ] Existing shared skill direct reuse validated (`jira-cli`, `github`, `feishu-notify`).
- [ ] `confluence` is intentionally not used and documented as non-required.
- [ ] `scripts/`, `scripts/lib/`, and `scripts/test/` boundaries follow `code-structure-quality`.
- [ ] One-to-one script-to-test stub mapping is complete.
- [ ] Behavior/test matrix includes unit and integration coverage expectations (`function-test-coverage`).
- [ ] Destructive/external-mutation actions are gated by explicit user approval.
- [ ] Final notification phase includes `run.json.notification_pending` fallback on send failure.
- [ ] Reviewer gate (`openclaw-agent-design-review`) passes with no P0/P1 findings.
- [ ] Review artifact outputs are recorded:
  - `projects/agent-design-review/single-defect-analysis-skill-2026-03-12/design_review_report.md`
  - `projects/agent-design-review/single-defect-analysis-skill-2026-03-12/design_review_report.json`

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
- `workspace-reporter/.agents/workflows/single-defect-analysis.md`
