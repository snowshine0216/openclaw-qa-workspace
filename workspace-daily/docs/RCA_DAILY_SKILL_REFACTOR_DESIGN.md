# RCA Daily Skill Refactor — Agent Design

> **Design ID:** `rca-daily-skill-refactor-2026-03-06`
> **Date:** 2026-03-06
> **Status:** Draft
> **Scope:** Refactor `workspace-daily/projects/rca-daily` into a skill-first RCA workflow with shared RCA capabilities, shared spawn-agent compatibility, and a workspace-local orchestrator.
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

## 0. Environment Setup

Runtime and tool requirements:
- OpenClaw with `sessions_spawn` support in both CLI and TUI contexts
- Shared skills linked into `~/.openclaw/skills` via `./src/init-skills` or `make init-skills`
- Jira access via shared `jira-cli`
- Optional Feishu notification reuse via shared `feishu-notify`
- Node.js available for non-trivial helper scripts under skill `scripts/`
- Jira update path must support ADF description updates and comment posting with user mentions
- Access to `/api/jira/customer-defects/details/?status=completed&limit=500` for early owner extraction

Assumptions:
- The workflow scope is RCA generation only.
- The old `workspace-daily/projects/rca-daily` implementation is fully deprecated once the new skill-based workflow is implemented.
- No legacy checkpointing/state logic must be preserved beyond adopting the canonical Phase 0 `REPORT_STATE` contract.

---

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.agents/skills/rca/SKILL.md` | shared RCA generation contract reused across workspaces |
| CREATE | `.agents/skills/rca/reference.md` | canonical RCA inputs, outputs, artifact map, and phase notes |
| CREATE | `.agents/skills/spawn-agent-session/SKILL.md` | shared OpenClaw-compatible agent spawning contract for CLI and TUI |
| CREATE | `.agents/skills/spawn-agent-session/reference.md` | spawn conventions, payload shape, compatibility notes |
| UPDATE | `.agents/skills/jira-cli/SKILL.md` | add ADF description update and comment-with-mentions support |
| UPDATE | `.agents/skills/jira-cli/reference.md` | define payload contracts for description writes and mention-safe comments |
| UPDATE | `.agents/skills/openclaw-agent-design/SKILL.md` | explicitly require separate shared spawn-agent skills when spawning is reusable |
| UPDATE | `.agents/skills/openclaw-agent-design/reference.md` | add spawn-agent placement guidance under shared-vs-local rules |
| CREATE | `workspace-daily/skills/rca-orchestrator/SKILL.md` | workspace-local orchestration entrypoint |
| CREATE | `workspace-daily/skills/rca-orchestrator/reference.md` | daily scheduling/orchestration behavior and artifact policy |
| CREATE | `workspace-daily/skills/rca-orchestrator/scripts/` | helper automation only; no project-folder dependency |
| UPDATE | `workspace-daily/AGENTS.md` | add routing for RCA generation and skill ownership |
| UPDATE | `README.md` | add shared-skill notes for RCA + spawn-agent pattern if repo-level skill guidance needs expansion |
| CREATE | `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md` | this design document |
| REMOVE (post-implementation) | `workspace-daily/projects/rca-daily/` | fully deprecated legacy project after successful migration |

---

## 2. AGENTS.md Sync

Sections to update:
- **Mandatory Skills**: add explicit use of `rca-orchestrator` for daily RCA workflow entry.
- **Skills Reference**: document `.agents/skills/rca`, `.agents/skills/spawn-agent-session`, enhanced `.agents/skills/jira-cli`, and `workspace-daily/skills/rca-orchestrator`.
- **Workflow Routing**: state that RCA generation must go through the skill-first flow, not `projects/rca-daily` scripts.
- **Artifact Rules**: define date-based daily artifact folders and skill-owned intermediate state.
- **Deprecation Note**: mark `workspace-daily/projects/rca-daily` as legacy and remove references after migration.

---

## 3. Skills Design

### 3.1 `rca` skill

Planned path: `.agents/skills/rca/`

Classification:
- `shared`

Why this placement:
- RCA generation logic is reusable beyond `workspace-daily`.
- The current implementation mixes fetch, transform, and output formatting in a project-local bundle. That is dumb and makes reuse painful.
- The RCA contract should be canonical once, with workspace-specific orchestration layered on top.

Inputs:
- `issue_key`: string, example `BCIN-5286`
- `issue_payload_path`: string, example `scripts/runs/2026-03-06/cache/issues/BCIN-5286.json`
- `context_path`: string or null, example `scripts/runs/2026-03-06/cache/pr/BCIN-5286.txt`
- `output_style`: enum, example `daily-summary`
- `run_root`: string, example `workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06`

Outputs:
- RCA markdown per issue
- normalized RCA input JSON per issue
- run metadata for orchestration layer consumption

Existing skills reused directly:
- enhanced `jira-cli` — canonical source for Jira issue retrieval, ADF description updates, and comment posting with mentions
- `feishu-notify` — only if a later notification phase is retained

### 3.2 `spawn-agent-session` skill

Planned path: `.agents/skills/spawn-agent-session/`

Classification:
- `shared`

Why this placement:
- The current `generate-rcas-via-agent.js` proves spawning is reusable behavior, not a one-off RCA hack.
- CLI and TUI both need one canonical way to shape spawn requests and parse results.
- If spawning stays embedded inside local scripts, every workflow will reinvent the same brittle wrapper. That’s bad architecture.

Inputs:
- `agent_id`: string, example `gpt-5.3-codex`
- `mode`: enum, example `run`
- `runtime`: enum, example `acp` or `subagent`
- `task`: string, example `Generate RCA for BCIN-5286 using attached payload`
- `attachments`: array, example `[{ name: "rca-input.json", ... }]`
- `label`: string, example `rca-BCIN-5286`
- `thread`: boolean, example `false`

Outputs:
- normalized spawn request
- session key / label mapping
- result handoff contract for caller skills

Existing skills reused directly:
- none; this skill exists because reusable spawning needs an explicit higher-level contract not covered by raw tool calls alone

### 3.3 `rca-orchestrator` skill

Planned path: `workspace-daily/skills/rca-orchestrator/`

Classification:
- `workspace-local`

Why this placement:
- Daily RCA scheduling, grouping, and date-folder artifact management are specific to `workspace-daily`.
- This layer should own orchestration only: selection, batching, state tracking, and final daily summary assembly.
- It must not re-own RCA generation logic already owned by the shared `rca` skill.

Inputs:
- `run_date`: string, example `2026-03-06`
- `issue_selection`: array or query descriptor
- `refresh_mode`: enum, example `use_existing|smart_refresh|full_regenerate`
- `spawn_model`: string, example `gpt-5.3-codex`

Outputs:
- daily run folder
- final daily summary
- per-issue RCA outputs
- `task.json` and `run.json`
- logs and cache metadata

Existing skills reused directly:
- `rca` — issue-level RCA generation
- `spawn-agent-session` — session spawning abstraction
- enhanced `jira-cli` — issue fetches, owner extraction, description updates, and comment posting with mentions
- `feishu-notify` — optional final notification phase

---

## 4. Workflow Design (Skill-First)

Entrypoint skill path: `workspace-daily/skills/rca-orchestrator/SKILL.md`

### Artifact Model

Canonical run root:
- `workspace-daily/skills/rca-orchestrator/scripts/runs/<date>/`

Structure:
```text
workspace-daily/skills/rca-orchestrator/
├── SKILL.md
├── reference.md
└── scripts/
    ├── check_resume.sh
    ├── lib/
    ├── task.json                # optional root template only; active state lives per run
    ├── run.json                 # optional root template only; active state lives per run
    └── runs/
        └── 2026-03-06/
            ├── task.json
            ├── run.json
            ├── manifest.json
            ├── cache/
            │   ├── issues/
            │   ├── pr/
            │   └── rca-input/
            ├── output/
            │   ├── rca/
            │   └── summary/
            ├── logs/
            └── archive/
```

Daily artifacts inside `<date>/`:
- `manifest.json` — issue list and batch metadata
- `cache/issues/*.json` — Jira source payloads
- `cache/owners/*.json` — owner extraction payloads from `/api/jira/customer-defects/details/?status=completed&limit=500`
- `cache/pr/*.txt` — PR/context source artifacts used to build RCA
- `cache/rca-input/*.json` — normalized per-issue RCA inputs
- `output/rca/*.md` — per-issue RCA outputs
- `output/adf/*.json` — per-issue ADF documents prepared for Jira description updates
- `output/comments/*.json` — finalized comment payloads with mention metadata
- `output/summary/daily-summary.md` — final daily summary
- `logs/*.log` — run logs
- `task.json` / `run.json` — canonical state files
- `archive/` — previous draft/final artifacts for the same date when regenerating

This keeps the folder clean, date-scoped, and debuggable. The current flat `output/` dump is a mess.

### Phase 0: Existing-State Check and Run Preparation

Actions:
1. Run `scripts/check_resume.sh <date>` against `scripts/runs/<date>/`.
2. Classify the run using canonical `REPORT_STATE`: `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, or `FRESH`.
3. Present refresh/resume options before any external fetch or spawn.
4. Archive prior active output for the same date before overwrite/regenerate.
5. Initialize `task.json` and `run.json` in the run folder.

User Interaction:
1. Done: existing state classified and options presented.
2. Blocked: waiting for user decision if a dated run already exists.
3. Questions: choose `Use Existing`, `Smart Refresh`, `Full Regenerate`, `Resume`, or `Generate from Cache`.
4. Assumption policy: never auto-regenerate a dated run with existing final output.

State Updates:
1. `task.json.current_phase = "phase_0_prepare_run"`
2. `run.json.updated_at` set on each write.

Verification:
```bash
workspace-daily/skills/rca-orchestrator/scripts/check_resume.sh 2026-03-06
jq -r '.overall_status,.current_phase' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/task.json
```

### Phase 1: Issue Discovery, Owner Extraction, and Manifest Build

Actions:
1. Gather the issue set for the day using explicit input or query-based selection.
2. Fetch `/api/jira/customer-defects/details/?status=completed&limit=500` and cache the response under `cache/owners/`.
3. Extract the proposed owner for each issue early, preserving the raw owner evidence needed for later comment mentions.
4. If owner resolution is missing or weak, mark the issue for warning-level follow-up instead of hard failure.
5. Normalize the issue list plus owner metadata into `manifest.json`.
6. Record batch metadata in `run.json`.

User Interaction:
1. Done: dated manifest is created with owner metadata.
2. Blocked: issue query returns nothing or owner API fails completely.
3. Questions: if selection query is ambiguous, stop and ask.
4. Assumption policy: never silently widen the issue scope and never guess a mention target without traceable owner evidence; unresolved owner becomes a warning, not a hard stop.

State Updates:
1. `task.json.current_phase = "phase_1_manifest"`
2. `task.json.phases.phase_1_manifest.status = "completed"`

Verification:
```bash
jq -r '.run_date,.total_issues' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/manifest.json
jq -r '.issues[] | [.issue_key, .proposed_owner.display_name] | @tsv' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/manifest.json
```

### Phase 2: Source Data Fetch and Normalization

Actions:
1. Fetch issue payloads via `jira-cli` into `cache/issues/`.
2. Fetch or collect supplemental context into `cache/pr/` when required.
3. Normalize per-issue inputs into `cache/rca-input/`.
4. Store `data_fetched_at` in `run.json`.

User Interaction:
1. Done: source inputs are cached and traceable.
2. Blocked: Jira/auth failures or missing issue data.
3. Questions: if required source context is missing and RCA quality would suffer, stop and ask.
4. Assumption policy: do not fabricate missing context.

State Updates:
1. `task.json.current_phase = "phase_2_fetch_and_normalize"`
2. `run.json.data_fetched_at = <ISO8601>`

Verification:
```bash
find workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/cache -type f | sort
```

### Phase 3: Per-Issue RCA Generation

Actions:
1. For each normalized RCA input, invoke the shared `rca` skill.
2. When agent execution is required, call the shared `spawn-agent-session` skill to produce consistent `sessions_spawn` requests.
3. Persist each RCA markdown into `output/rca/`.
4. Track per-issue status in `task.json.phases.phase_3_generate.items`.

User Interaction:
1. Done: each issue has a deterministic RCA result or explicit failure record.
2. Blocked: spawn failures, agent errors, or invalid RCA outputs.
3. Questions: if batch policy for partial failures is unclear, stop and ask.
4. Assumption policy: do not silently drop failed issues from the summary.

State Updates:
1. `task.json.current_phase = "phase_3_generate_rca"`
2. `run.json.subtask_timestamps.<issue_key> = <ISO8601>`

Verification:
```bash
find workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/output/rca -type f | sort
```

### Phase 4: Jira Description Update and Comment Publication

Actions:
1. Convert each RCA markdown output into ADF.
2. Update the Jira issue `description` field using the enhanced shared `jira-cli` contract.
3. Build a Jira comment payload containing only the executive summary and mentions for `lizhu@microstrategy` plus the extracted proposed owner when available.
4. Add the comment only after the description update succeeds.
5. If owner resolution is unavailable, post the executive-summary comment tagging `lizhu@microstrategy` only and mark the issue as partial success.
6. Validate that the comment request succeeded and record comment identifiers in run metadata.


User Interaction:
1. Done: each issue description is updated and the executive-summary comment is posted.
2. Blocked: ADF conversion fails, Jira description update fails, or comment creation fails.
3. Questions: if Jira target mapping is ambiguous, stop and ask.
4. Assumption policy: do not post the comment until description update succeeds, and do not claim success unless comment creation is confirmed by Jira. Missing proposed owner is a warning path that downgrades the issue to partial success.

State Updates:
1. `task.json.current_phase = "phase_4_publish_to_jira"`
2. `run.json.output_generated_at = <ISO8601>`
3. `run.json.jira_publish.<issue_key>.description_updated = true|false`
4. `run.json.jira_publish.<issue_key>.comment_added = true|false`
5. `run.json.jira_publish.<issue_key>.status = success|partial_success|failed`

Verification:
```bash
find workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/output/adf -type f | sort
find workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/output/comments -type f | sort
jq -r '.jira_publish' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/run.json
```

### Phase 5: Daily Summary Assembly and Finalization

Actions:
1. Aggregate per-issue RCA outputs and Jira publish results into one dated daily summary.
2. Write final summary to `output/summary/daily-summary.md`.
3. Optionally send or queue notification using `feishu-notify`.
4. In the Feishu notification, mark any missing-owner Jira publish as `partial success`.
5. If notification fails, persist fallback payload in `run.json.notification_pending`.
6. Mark the run complete.

User Interaction:
1. Done: run closed and status durable.
2. Blocked: notification failure only blocks publish, not artifact completion.
3. Questions: if delivery target is missing, stop and ask.
4. Assumption policy: never discard pending notification payload.

State Updates:
1. `task.json.current_phase = "phase_5_finalize"`
2. `task.json.overall_status = "completed"`

Verification:
```bash
test -f workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/output/summary/daily-summary.md
jq -r '.overall_status,.current_phase' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/task.json
jq -r '.notification_pending' workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-06/run.json
```

### Status Transition Map

| From | Event | To |
|------|-------|-----|
| `fresh` | run initialized | `in_progress` |
| `in_progress` | source cache ready | `context_ready` |
| `context_ready` | RCA generation started | `generating` |
| `generating` | Jira description update + comment publish completed | `published` |
| `published` | final summary written | `completed` |
| any | unrecoverable error | `failed` |

---

## 5. State Schemas

### `task.json`

Path: `workspace-daily/skills/rca-orchestrator/scripts/runs/<date>/task.json`

Fields:
- `run_key`: string, equal to `<date>`
- `overall_status`: string
- `current_phase`: string
- `created_at`: ISO8601
- `updated_at`: ISO8601
- `phases`: object
- `items`: object keyed by issue key for per-issue generation status

Write rule:
- Preserve canonical semantics from `openclaw-agent-design/reference.md`.
- Add `items` only as an additive extension for batch issue tracking.
- Update `updated_at` on every write.

Example additive shape:
```json
{
  "run_key": "2026-03-06",
  "overall_status": "in_progress",
  "current_phase": "phase_3_generate_rca",
  "updated_at": "2026-03-06T09:00:00Z",
  "phases": {
    "phase_1_manifest": { "status": "completed" },
    "phase_2_fetch_and_normalize": { "status": "completed" },
    "phase_3_generate_rca": { "status": "in_progress" }
  },
  "items": {
    "BCIN-5286": { "status": "completed" },
    "BCIN-6936": { "status": "failed" }
  }
}
```

### `run.json`

Path: `workspace-daily/skills/rca-orchestrator/scripts/runs/<date>/run.json`

Fields:
- `data_fetched_at`: ISO8601 or null
- `output_generated_at`: ISO8601 or null
- `notification_pending`: string or null
- `updated_at`: ISO8601
- `subtask_timestamps`: object keyed by issue key
- `spawn_sessions`: object keyed by issue key with session metadata
- `jira_publish`: object keyed by issue key with description/comment publish results

Write rule:
- Preserve canonical semantics.
- Add `subtask_timestamps` and `spawn_sessions` as additive batch-run metadata.
- Never store secrets or auth payloads.

---

## 6. Implementation Layers

### Skill Placement Rules

- Shared reusable RCA generation → `.agents/skills/rca/`
- Shared reusable spawn abstraction → `.agents/skills/spawn-agent-session/`
- Workspace-specific daily orchestration → `workspace-daily/skills/rca-orchestrator/`
- Shell/Node helpers → `<skill-root>/scripts/`
- Shared helper libraries → `<skill-root>/scripts/lib/`
- Active run data → `workspace-daily/skills/rca-orchestrator/scripts/runs/<date>/`

### Existing Shared Skills to Reuse Directly

Reuse directly by default:
- enhanced `jira-cli`
- `feishu-notify`

Do not create wrappers for these unless a real contract gap appears.

### `scripts/check_resume.sh`

Usage: `workspace-daily/skills/rca-orchestrator/scripts/check_resume.sh <date>`

Must emit:
- `REPORT_STATE=<FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH>`
- `TASK_STATE=<status>`

Mapping for dated RCA runs:
- `FINAL_EXISTS` → `output/summary/daily-summary.md` exists
- `DRAFT_EXISTS` → partial outputs or incomplete summary exist
- `CONTEXT_ONLY` → manifest/cache exist but no RCA summary exists
- `FRESH` → no dated run folder exists or folder is empty

---

## 7. Files To Create / Update

1. `.agents/skills/rca/SKILL.md` — create
2. `.agents/skills/rca/reference.md` — create
3. `.agents/skills/spawn-agent-session/SKILL.md` — create
4. `.agents/skills/spawn-agent-session/reference.md` — create
5. `.agents/skills/openclaw-agent-design/SKILL.md` — update to require shared spawn-agent skill when reusable
6. `.agents/skills/openclaw-agent-design/reference.md` — update placement/reference guidance
7. `workspace-daily/skills/rca-orchestrator/SKILL.md` — create
8. `workspace-daily/skills/rca-orchestrator/reference.md` — create
9. `workspace-daily/skills/rca-orchestrator/scripts/` — create helper scripts and dated run storage
10. `workspace-daily/AGENTS.md` — update
11. `README.md` — update if shared skill guidance needs new RCA/spawn-agent examples
12. OpenClaw cron config/docs — add daily randomized-8AM scheduling in `Asia/Shanghai`
13. `workspace-daily/docs/RCA_DAILY_SKILL_REFACTOR_DESIGN.md` — create
14. `workspace-daily/projects/rca-daily/` — remove after implementation cutover validation

---

## 8. README Impact

User-facing README impact:
- `README.md`: **updated**
- Reason: shared-skill guidance should mention the RCA/spawn-agent pattern as a canonical example of shared reusable skills plus a workspace-local orchestrator.

Workspace-local README impact:
- `workspace-daily/README.md`: **not applicable**
- Reason: no current file exists.

---

## 9. Cron Design

OpenClaw cron requirement:
- Schedule the RCA daily orchestrator once per day in timezone `Asia/Shanghai`.
- Run during the 8 AM hour with randomized minute selection.
- Persist the chosen minute in cron config or generated schedule metadata so the run is stable until intentionally rotated.

Recommended design:
1. Generate a random minute `0-59` during cron setup or regeneration.
2. Store that chosen minute in workflow config owned by `workspace-daily/skills/rca-orchestrator/`.
3. Register a cron entry equivalent to `<random-minute> 8 * * *` with timezone `Asia/Shanghai`.
4. Trigger the `rca-orchestrator` skill entrypoint, not legacy shell scripts.

Cron payload requirements:
- `run_date` defaults to current date in `Asia/Shanghai`
- `refresh_mode` defaults to `smart_refresh`
- The cron-triggered run must still respect Phase 0 state checks and avoid destructive overwrite

OpenClaw config impact:
- document the cron job in repo docs and AGENTS references
- do not point cron to `workspace-daily/projects/rca-daily`
- point cron to the skill-first orchestrator path only

## 10. Migration Design

### Legacy-to-New Mapping

| Legacy path | New owner | New path |
|---|---|---|
| `workspace-daily/projects/rca-daily/src/utils/generate-rcas-via-agent.js` | shared spawn abstraction | `.agents/skills/spawn-agent-session/scripts/` |
| `workspace-daily/projects/rca-daily/src/fetchers/fetch-rca.sh` | shared RCA or enhanced `jira-cli` use | `.agents/skills/rca/scripts/` or direct reuse |
| `workspace-daily/projects/rca-daily/src/core/process-rca.sh` | shared RCA generation | `.agents/skills/rca/scripts/` |
| `workspace-daily/projects/rca-daily/src/integrations/update-jira-latest-status.sh` | enhanced shared Jira publishing | `.agents/skills/jira-cli/scripts/` |
| `workspace-daily/projects/rca-daily/src/bin/daily-rca-check.sh` | workspace-local orchestrator | `workspace-daily/skills/rca-orchestrator/scripts/` |
| `workspace-daily/projects/rca-daily/src/bin/run-complete-rca-workflow.sh` | workspace-local orchestrator | `workspace-daily/skills/rca-orchestrator/scripts/` |
| `workspace-daily/projects/rca-daily/output/*` | dated run folder | `workspace-daily/skills/rca-orchestrator/scripts/runs/<date>/...` |
| `workspace-daily/projects/rca-daily/docs/*` | workspace docs (design only) | `workspace-daily/docs/` |

### Deprecation Rule

Once the skill-first workflow is implemented and validated:
1. Freeze the old project folder.
2. Verify equivalent output exists under the new skill-owned run layout.
3. Remove `workspace-daily/projects/rca-daily/` completely.

No half-migration. Keeping both active would be a maintenance trap.

---

## 11. Quality Gates

- [x] Design defines workflow entrypoints as skills, not only scripts
- [x] Shared vs workspace-local placement is explicit and justified
- [x] `.agents/skills/` is treated as canonical for shared skills
- [x] Canonical Phase 0 `REPORT_STATE` behavior is preserved
- [x] `task.json` / `run.json` compatibility is preserved with additive batch fields only
- [x] `skill-creator` is required for new or materially redesigned skills
- [x] `code-structure-quality` is applied to ownership and boundary design
- [x] Existing shared skills `jira-cli` and `feishu-notify` are reused directly where appropriate
- [x] Jira publish design covers ADF description updates and executive-summary comment success confirmation with mentions
- [x] Owner extraction from `/api/jira/customer-defects/details/?status=completed&limit=500` is explicit in the workflow
- [x] OpenClaw cron design covers daily randomized scheduling in `Asia/Shanghai` during the 8 AM hour
- [x] AGENTS.md sync is explicit
- [x] README impact is explicit
- [ ] Reviewer report artifacts are generated
- [ ] Reviewer status (`openclaw-agent-design-review`) recorded as `pass` or `pass_with_advisories`

Reviewer note:
- This design doc is ready for formal review, but the review artifacts are intentionally not generated yet because the current request is design-doc only.

---

## 12. References

- `.agents/skills/openclaw-agent-design/SKILL.md`
- `.agents/skills/openclaw-agent-design/reference.md`
- `.agents/skills/openclaw-agent-design-review/SKILL.md`
- `.agents/skills/agent-idempotency/SKILL.md`
- `.agents/skills/code-structure-quality/SKILL.md`
- `.agents/skills/clawddocs/SKILL.md`
- `workspace-daily/projects/rca-daily/src/utils/generate-rcas-via-agent.js`
- `workspace-daily/projects/rca-daily/README.md`
- `workspace-daily/AGENTS.md`
