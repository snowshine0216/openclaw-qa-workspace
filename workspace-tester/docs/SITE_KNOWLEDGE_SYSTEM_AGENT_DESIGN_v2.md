# Site Knowledge System - Agent-Side Design (v2)

> **Design ID:** `site-knowledge-agent-v2`
> **Date:** 2026-03-04
> **Status:** Draft - TDD Phase
> **Parent Design:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
> **Scope:** Tester Agent runtime search of site knowledge and context propagation to test execution workflows.
>
> **Constraint:** This is a design artifact. Do not implement code changes until this design is approved.

---

## 0. Design Authority and Migration Note

### 0.1 Normative scope

This document is the **normative source** for Site Knowledge behavior in:

- feature-test workflow design
- defect-test workflow design
- site-context artifact generation and use
- test reporting handoff expectations

### 0.2 Design-only update policy

This revision updates design contracts only. It does **not** perform code/workflow/skill implementation.

### 0.3 Known cross-doc mismatch and migration requirement

Current `AGENTS.md` still uses `memory/tester-flow/runs/...` in parts of the tester flow. This design standardizes on `projects/test-cases/<key>/...`.

Follow-up (outside this design-only change):

1. Align `AGENTS.md` path contracts to this design.
2. Align `.agents/workflows/feature-test.md` and `.agents/workflows/defect-test.md` when created.
3. Align `scripts/check_resume.sh` behavior to this design contract.

### 0.4 Path resolution base (single execution context)

All operational paths and commands in this document are resolved from:

- `workspace-tester/` as the working directory (CWD base)

Path style rule:

1. Use workspace-root-relative paths only (example: `projects/test-cases/BCIN-1234/task.json`).
2. For sibling workspaces, use explicit CWD-resolvable relative paths (`../workspace-planner/...`, `../workspace-reporter/...`).
3. Do not mix repo-root-prefixed paths and CWD-relative paths in the same command contract.
4. Legacy `memory/tester-flow/runs/...` paths may appear only in migration compatibility notes.

### 0.5 Gate compatibility command (legacy canonical form)

For OpenClaw design-review compatibility during migration, keep this exact canonical verification command in the design:

```bash
jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json
```

---

## 1. Site Knowledge Search Design

### 1.1 Overview

The Tester Agent searches pre-generated site knowledge at runtime and writes resolved context to a run-scoped artifact used by test execution.

Generation-side design is in:
[SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)

Search backends:

1. `qmd search` (BM25 keyword search)
2. OpenClaw `memory_search` (hybrid semantic/keyword, when available)

Rule:

- `qmd` usage in this design is BM25 only: `qmd search`
- No `qmd vsearch`, `qmd query`, or `qmd embed` required for this runtime flow.

### 1.2 Canonical runtime paths

For work item key `BCIN-1234`:

- run root: `projects/test-cases/BCIN-1234/`
- site context: `projects/test-cases/BCIN-1234/site_context.md`
- task state: `projects/test-cases/BCIN-1234/task.json`
- run metadata: `projects/test-cases/BCIN-1234/run.json`
- report: `projects/test-cases/BCIN-1234/reports/execution-summary.md`
- screenshots: `projects/test-cases/BCIN-1234/screenshots/<step>.png`

### 1.3 Domain and keyword derivation

Domain sources:

- defect-test: `tester_handoff.json.affected_domains`
- feature-test: QA plan domain labels and component names

Canonical domains(example):

- `filter`
- `search`
- `dashboard-editor`
- `report-editor`
- `export`


Keyword sources:

1. issue summary
2. issue description
3. domain labels
4. component names from QA plan or testing plan

### 1.4 Search execution contract

Ordered flow:

1. Read `memory/site-knowledge/SITEMAP.md` to identify index coverage.
2. Run OpenClaw `memory_search` when tool is available in current runtime.
3. Run BM25 search per keyword:
   - `qmd search "<keyword>" -c site-knowledge --json -n 10`
4. Merge, deduplicate, and write findings to `site_context.md`.

`site_context.md` minimum sections:

1. Search Inputs (keywords, domains, timestamp)
2. Resolved Components
3. Locator Hints
4. Workflow Hints
5. Gaps and Fallback Notes

### 1.5 Error handling contract

1. If `qmd` is unavailable, continue with `memory_search` only and record warning in `site_context.md`.
2. If `memory_search` is unavailable, continue with `qmd` only and record warning in `site_context.md`.
3. If both fail, write an explicit failure note to `site_context.md` and continue with degraded execution mode.

### 1.6 Skill contract (`site-knowledge-search`)

Planned skill path:

- `skills/site-knowledge-search/SKILL.md`

Inputs:

- `key`: string, example `BCIN-1234`
- `keywords`: string array
- `domains`: string array

Output:

- `projects/test-cases/<key>/site_context.md`

---

## 2. Shared Idempotency and State Contract

This section applies to both feature-test and defect-test workflows.

### 2.1 Idempotency classification (Phase 0)

Before any external call, classify run state:

1. `FINAL_EXISTS` - final report exists
2. `DRAFT_EXISTS` - partial/draft artifacts exist without final completion
3. `CONTEXT_ONLY` - cache/context exists without final output
4. `FRESH` - no artifacts

### 2.2 User options by state

| State | Allowed options |
|------|------------------|
| `FINAL_EXISTS` | Use Existing / Smart Refresh / Full Regenerate |
| `DRAFT_EXISTS` | Resume / Smart Refresh / Full Regenerate |
| `CONTEXT_ONLY` | Generate from Cache / Re-fetch + Regenerate |
| `FRESH` | Start New Run |

Semantics:

- Smart Refresh: refresh stale/missing pieces only
- Full Regenerate: rebuild everything
- Resume: continue from recorded phase
- Use Existing: return existing completed result

### 2.3 Archive-before-overwrite

Rule:

- Never overwrite an existing final artifact directly.
- Move prior output to `archive/` under run root before regeneration.

Archive naming:

- `<key>_OUTPUT_FINAL_<YYYYMMDD>.md`
- if same-day collision: append `_HHmm`

### 2.4 Shared task.json schema

Path:

- `projects/test-cases/<key>/task.json`

Contract fields:

- `run_key`: string
- `mode`: `feature_test | defect_test`
- `overall_status`: `plan_check | plan_ready | waiting_for_reporter | testing | test_complete | completed | failed`
- `current_phase`: string
- `issue_key`: string
- `plan_path`: string or null
- `site_context_path`: string or null
- `result`: `PASS | FAIL | BLOCKED | null`
- `evidence_path`: string or null
- `planner_invoked`: boolean
- `planner_spawned_at`: ISO8601 or null
- `reporter_invoked`: boolean
- `reporter_spawned_at`: ISO8601 or null
- `reporter_notification_pending`: boolean
- `test_completed_at`: ISO8601 or null
- `created_at`: ISO8601
- `updated_at`: ISO8601

Write rule:

- Every write must update `updated_at`.
- Use atomic write strategy (tmp file then rename).

### 2.5 Shared run.json schema

Path:

- `projects/test-cases/<key>/run.json`

Contract fields:

- `run_key`: string
- `data_fetched_at`: ISO8601 or null
- `site_context_generated_at`: ISO8601 or null
- `subtask_timestamps`: object
- `notification_pending`: string or null (full Feishu payload on failure)
- `last_notification_attempt_at`: ISO8601 or null
- `updated_at`: ISO8601

### 2.6 Resume script contract

Script path:

- `scripts/check_resume.sh`

Usage:

- `scripts/check_resume.sh <issue-key>`

Must emit both:

1. `REPORT_STATE=<FINAL_EXISTS|DRAFT_EXISTS|CONTEXT_ONLY|FRESH>`
2. `TASK_STATE=<PLAN_READY|WAITING_FOR_REPORTER|TESTING|TEST_COMPLETE|COMPLETED|FAILED|NONE>`

---

## 3. Feature-Test Workflow (NLG Contract)

### 3.1 Overview

Workflow path to create:

- `.agents/workflows/feature-test.md`

Trigger:

- feature test command with issue key and optional QA plan path

Default plan resolution order:

1. explicit input path
2. `../workspace-planner/projects/test-plans/<issue-key>/qa-plan-final.md`
3. legacy fallback: `../workspace-planner/projects/test-plans/<issue-key>/test-plan.md`

### Phase 0: Idempotency and Run Preparation

Actions:

1. Ensure run root exists under `projects/test-cases/<issue-key>/`.
2. Run `scripts/check_resume.sh <issue-key>`.
3. Classify `REPORT_STATE` and present allowed options.
4. If overwrite/regenerate selected, archive previous output first.
5. Initialize or update `task.json` and `run.json`.

User Interaction:

1. Done: state classification completed and options presented.
2. Blocked: waiting for user choice when prior artifacts exist.
3. Questions: choose one option (`Use Existing`, `Smart Refresh`, `Full Regenerate`, `Resume`, `Generate from Cache`).
4. Assumption policy: if user intent is ambiguous, stop and ask. Do not auto-pick destructive refresh.

State Updates:

1. Set `task.json.current_phase = "phase_0_prepare"`.
2. Set `task.json.overall_status = "plan_check"` unless terminal reuse path selected.
3. Update `updated_at` in both state files.

Verification:

```bash
scripts/check_resume.sh BCIN-1234
jq -r '.overall_status,.current_phase' projects/test-cases/BCIN-1234/task.json
```

### Phase 1: QA Plan Resolution

Actions:

1. Resolve QA plan path using defined precedence.
2. If no plan found, ask for approval to invoke planner.
3. On approval, call `sessions_spawn` to invoke `planner` sub-agent and wait for completion announce.
4. Persist resolved `plan_path`.

User Interaction:

1. Done: plan path resolved and recorded.
2. Blocked: plan missing and planner invocation not approved.
3. Questions: approve planner invocation now or stop run.
4. Assumption policy: do not invoke planner without explicit user approval.

State Updates:

1. `task.json.current_phase = "phase_1_plan_resolution"`
2. on success: `task.json.overall_status = "plan_ready"`
3. if spawned: set `planner_invoked = true`, `planner_spawned_at` timestamp

Verification:

```bash
jq -r '.plan_path,.planner_invoked,.overall_status' projects/test-cases/BCIN-1234/task.json
```

### Phase 2: Site Knowledge Search

Actions:

1. Derive keywords from issue + plan components + domain labels.
2. Invoke `site-knowledge-search` skill.
3. Write `site_context.md` to run root.
4. Record freshness timestamps in `run.json`.

User Interaction:

1. Done: site context artifact generated.
2. Blocked: both search backends unavailable and no fallback data.
3. Questions: continue in degraded mode or stop.
4. Assumption policy: do not hide degraded search quality; surface clearly.

State Updates:

1. `task.json.current_phase = "phase_2_site_knowledge"`
2. `task.json.site_context_path` set
3. `task.json.overall_status = "testing"`
4. `run.json.site_context_generated_at` set

Verification:

```bash
test -f projects/test-cases/BCIN-1234/site_context.md && echo OK
jq -r '.site_context_path,.overall_status' projects/test-cases/BCIN-1234/task.json
```

### Phase 3: Execute Test Cases

Actions:

1. Read `site_context_path` before each test case.
2. Execute cases via Playwright MCP (`mcporter`) and capture evidence.
3. If locator guidance is insufficient, refresh site knowledge once, then retry per policy.
4. Record PASS/FAIL/BLOCKED per case.

User Interaction:

1. Done: execution records and screenshots captured.
2. Blocked: environment/data/access blockers prevent execution.
3. Questions: retry blocked cases now or finalize with blocked status.
4. Assumption policy: do not silently skip required cases.

State Updates:

1. `task.json.current_phase = "phase_3_execution"`
2. keep `task.json.overall_status = "testing"`
3. update progress timestamps

Verification:

```bash
ls -1 projects/test-cases/BCIN-1234/screenshots | head
```

### Phase 4: Reporting and Defect Gate

Actions:

1. Invoke `test-report` skill to generate execution summary.
2. For failed cases, invoke `bug-report-formatter`.
3. Ask user whether to create Jira issues.
4. If approved, use `jira-cli` to create issues.

User Interaction:

1. Done: execution summary and bug docs prepared.
2. Blocked: waiting for Jira logging approval when failures exist.
3. Questions: create Jira issues now (Y/N).
4. Assumption policy: never auto-create Jira tickets.

State Updates:

1. `task.json.current_phase = "phase_4_reporting"`
2. set `result`, `evidence_path`, `test_completed_at`
3. set `task.json.overall_status = "test_complete"`

Verification:

```bash
test -f projects/test-cases/BCIN-1234/reports/execution-summary.md && echo OK
jq -r '.result,.overall_status' projects/test-cases/BCIN-1234/task.json
```

### Phase 5: Completion Notification

Actions:

1. Send Feishu completion message.
2. If send fails, persist full payload to `run.json.notification_pending`.
3. If send succeeds, clear `notification_pending`.

User Interaction:

1. Done: notification attempt recorded with final status.
2. Blocked: delivery failure requiring retry.
3. Questions: retry notification now or defer.
4. Assumption policy: do not mark run fully completed if notification state is unknown.

State Updates:

1. `task.json.current_phase = "phase_5_notify"`
2. `task.json.overall_status = "completed"` only after completion contract is satisfied
3. update notification fields in `run.json`

Verification:

```bash
jq -r '.notification_pending // empty' projects/test-cases/BCIN-1234/run.json
# migration compatibility check (current AGENTS gate)
jq -r '.notification_pending // empty' memory/tester-flow/runs/BCIN-1234/run.json
jq -r '.overall_status' projects/test-cases/BCIN-1234/task.json
```

### 3.2 Feature-test status transition map

| From | Event | To |
|------|-------|----|
| `plan_check` | plan resolved | `plan_ready` |
| `plan_ready` | site context generated | `testing` |
| `testing` | report generated | `test_complete` |
| `test_complete` | notify contract completed | `completed` |
| any | unrecoverable error | `failed` |

---

## 4. Defect-Test Workflow (NLG Contract)

### 4.1 Overview

Workflow path to create:

- `.agents/workflows/defect-test.md`

Trigger:

- single Jira issue key or URL without a pre-existing feature QA plan

Reporter integration source workflow:

- `../workspace-reporter/.agents/workflows/single-defect-analysis.md`

Canonical reporter artifacts used by tester:

- `../workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`
- `../workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/tester_handoff.json`

### Phase 0: Idempotency and Reporter Decision

Actions:

1. Run `scripts/check_resume.sh <issue-key>` for existing tester state.
2. Classify run state and present idempotency options.
3. Determine whether reporter artifacts already exist.
4. If missing and approved, invoke reporter via `sessions_spawn`.

User Interaction:

1. Done: resume/regenerate path selected.
2. Blocked: waiting for user choice or reporter availability.
3. Questions: reuse existing reporter artifacts or regenerate.
4. Assumption policy: do not respawn reporter without approval when usable artifacts already exist.

State Updates:

1. `task.json.current_phase = "phase_0_prepare"`
2. set `reporter_invoked` and `reporter_spawned_at` if spawned
3. `task.json.overall_status = "waiting_for_reporter"` when waiting

Verification:

```bash
jq -r '.reporter_invoked,.overall_status' projects/test-cases/BCIN-7890/task.json
```

### Phase 1: Reporter Intake

Actions:

1. Read reporter testing plan and handoff json.
2. Validate FC steps, domains, exploratory flags.
3. Normalize execution checklist for tester run.

User Interaction:

1. Done: handoff artifacts validated and accepted.
2. Blocked: required reporter artifact missing or malformed.
3. Questions: retry wait for reporter output or stop.
4. Assumption policy: do not fabricate missing handoff fields.

State Updates:

1. `task.json.current_phase = "phase_1_reporter_intake"`
2. `task.json.overall_status = "testing"` when intake completes

Verification:

```bash
test -f ../workspace-reporter/projects/defects-analysis/BCIN-7890/BCIN-7890_TESTING_PLAN.md && echo OK
test -f ../workspace-reporter/projects/defects-analysis/BCIN-7890/tester_handoff.json && echo OK
```

### Phase 2: Site Knowledge Search

Actions:

1. Derive keywords from issue summary + `affected_domains`.
2. Run `site-knowledge-search`.
3. Persist `site_context.md` and timestamps.

User Interaction:

1. Done: context file generated.
2. Blocked: no searchable domain mapping and no fallback context.
3. Questions: proceed with `other` domain fallback or stop.
4. Assumption policy: do not hide domain uncertainty.

State Updates:

1. `task.json.current_phase = "phase_2_site_knowledge"`
2. set `site_context_path`
3. keep `task.json.overall_status = "testing"`

Verification:

```bash
test -f projects/test-cases/BCIN-7890/site_context.md && echo OK
```

### Phase 3: FC and Exploratory Execution

Actions:

1. Execute FC steps from testing plan.
2. Execute exploratory charter when required.
3. Capture screenshot/log evidence and case outcomes.

User Interaction:

1. Done: all executable FC/exploratory steps attempted.
2. Blocked: environment/app blocker prevents completion.
3. Questions: retry unstable steps or finalize with BLOCKED.
4. Assumption policy: do not claim PASS for unexecuted mandatory steps.

State Updates:

1. `task.json.current_phase = "phase_3_execution"`
2. keep `task.json.overall_status = "testing"`

Verification:

```bash
ls -1 projects/test-cases/BCIN-7890/screenshots | head
```

### Phase 4: Callback and Reporting

Actions:

1. Generate `execution-summary.md` via `test-report`.
2. Persist result and evidence path.
3. Notify reporter with PASS/FAIL and evidence via `sessions_spawn`.
4. If callback fails, set `task.json.reporter_notification_pending = true`.

User Interaction:

1. Done: report generated and callback attempted.
2. Blocked: reporter callback failed.
3. Questions: retry reporter callback now or defer.
4. Assumption policy: do not mark callback success without send confirmation.

State Updates:

1. `task.json.current_phase = "phase_4_callback_reporting"`
2. set `result`, `evidence_path`, `test_completed_at`
3. set `task.json.overall_status = "test_complete"`

Verification:

```bash
jq -r '.reporter_notification_pending,.result,.overall_status' projects/test-cases/BCIN-7890/task.json
```

### Phase 5: Completion Notification

Actions:

1. Send Feishu completion summary.
2. Persist `run.json.notification_pending` on failure.
3. Clear pending notification payload on success.

User Interaction:

1. Done: notification state finalized.
2. Blocked: Feishu send failure.
3. Questions: retry now or keep pending for next resume.
4. Assumption policy: do not silently drop failed notifications.

State Updates:

1. `task.json.current_phase = "phase_5_notify"`
2. set `task.json.overall_status = "completed"` only when completion contract satisfied

Verification:

```bash
jq -r '.notification_pending // empty' projects/test-cases/BCIN-7890/run.json
# migration compatibility check (current AGENTS gate)
jq -r '.notification_pending // empty' memory/tester-flow/runs/BCIN-7890/run.json
jq -r '.overall_status' projects/test-cases/BCIN-7890/task.json
```

### 4.2 Defect-test status transition map

| From | Event | To |
|------|-------|----|
| `plan_check` | reporter path selected | `waiting_for_reporter` or `testing` |
| `waiting_for_reporter` | intake complete | `testing` |
| `testing` | report generated | `test_complete` |
| `test_complete` | notify contract completed | `completed` |
| any | unrecoverable error | `failed` |

---

## 5. Supporting Skill Contracts

### 5.1 `test-report` skill

Planned skill path:

- `skills/test-report/SKILL.md`

Purpose:

- produce standardized `execution-summary.md`
- trigger bug document generation for failed cases
- gate Jira creation behind explicit user confirmation

Inputs:

- `key`
- test case outcome set
- evidence paths

Output:

- `projects/test-cases/<key>/reports/execution-summary.md`

### 5.2 AGENTS.md references (to be synchronized later)

Target sections to update in `AGENTS.md`:

1. Site Knowledge Search section
2. Skills Reference (`site-knowledge-search`, `test-report`)
3. Feature-test and defect-test workflow routing references

---

## 6. Evidence and Quality Gates

### 6.1 Design quality gate checklist

- [x] Internal path consistency fixed
- [x] Phase numbering consistency fixed (feature and defect both 0-5)
- [x] Per-phase user interaction contract included (`Done/Blocked/Questions`)
- [x] Anti-assumption policy stated in every phase
- [x] Idempotency states and options defined
- [x] Archive-before-overwrite contract defined
- [x] Feishu fallback contract defined (`run.json.notification_pending`)
- [x] Verification commands included for notification fallback
- [x] README impact explicitly addressed

### 6.2 Reviewer status summary (design process)

1. Initial review result on pre-update v2: `fail`.
2. Rewrite direction review result: `pass_with_advisories` (no P0/P1 blockers).

Reference artifacts:

- `/tmp/openclaw-review/site-knowledge-agent-v2/pass1/design_review_report.md`
- `/tmp/openclaw-review/site-knowledge-agent-v2/pass1/design_review_report.json`
- `/tmp/openclaw-review/site-knowledge-agent-v2/pass2/design_review_report.md`
- `/tmp/openclaw-review/site-knowledge-agent-v2/pass2/design_review_report.json`

---

## 7. Files To Update in Implementation Phase (Not in This Design-Only Change)

1. `.agents/workflows/feature-test.md` (create)
2. `.agents/workflows/defect-test.md` (create)
3. `skills/site-knowledge-search/SKILL.md` (create)
4. `skills/test-report/SKILL.md` (create)
5. `scripts/check_resume.sh` (create/update)
6. `AGENTS.md` (sync to this design)
7. OpenClaw runtime config for `memory_search` extra path (`memory/site-knowledge`)

---

## 8. README Impact

User-facing README impact for this design update:

- `tools/sitemap-generator/README.md`: **no change in this design-only commit**.
- Reason: this revision changes runtime workflow contracts, not sitemap generator behavior.

---

## 9. References

- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
- [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md)
- [single-defect-analysis.md](../../workspace-reporter/.agents/workflows/single-defect-analysis.md)
- [qmd](https://github.com/tobi/qmd)
- [Clawdbot Sub-Agents](https://docs.clawd.bot/tools/subagents)
- [ACP Agents](https://docs.clawd.bot/tools/acp-agents)
- [OpenClaw memory concepts](https://openclaw.im/docs/concepts/memory)
