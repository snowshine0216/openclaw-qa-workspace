---
description: |
  Feature-test workflow with QA plan resolution, test environment/objects (testcase.md), site knowledge search, test execution, and reporting.
  Input: issue key + optional QA plan path. Output: execution-summary.md, screenshots, optional Jira issues.
  Uses site-knowledge-search, test-report and mcporter skills. Idempotent with archive-before-overwrite.
---

# Feature-Test Workflow

**Trigger:** Feature test command with issue key (e.g., `BCIN-1234`) and optional QA plan path.
**Output:** `projects/test-cases/<key>/reports/execution-summary.md`, screenshots, optional Jira issues.
**Design Reference:** [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](../../docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md) §3.

**Working directory:** defaults to `workspace-tester`. Run root: `projects/test-cases/<issue-key>/`.


---

## Plan Resolution Order

Resolve QA plan path in this precedence:

1. **Explicit input path** — user-provided path
2. **workspace-planner** — `workspace-planner/projects/test-plans/<issue-key>/qa-plan-final.md`
3. **Legacy fallback** — `workspace-tester/projects/test-cases/<issue-key>/qa-plan-final.md`

---

## Phase 0: Idempotency and Run Preparation

### Actions

1. Ensure run root exists: `projects/test-cases/<issue-key>/`. if not, create it.
2. Run `scripts/check_resume.sh <issue-key>`.
3. Parse output for `REPORT_STATE` and `TASK_STATE`.
4. Classify state and present allowed options per agent-idempotency:

   | REPORT_STATE | Allowed options |
   |--------------|-----------------|
   | `FINAL_EXISTS` | Use Existing / Smart Refresh / Full Regenerate |
   | `DRAFT_EXISTS` | Resume / Smart Refresh / Full Regenerate |
   | `CONTEXT_ONLY` | Generate from Cache / Re-fetch + Regenerate |
   | `FRESH` | Start New Run |

5. If overwrite/regenerate selected: archive previous output to `archive/` first.
   - Archive naming: `<key>_OUTPUT_FINAL_<YYYYMMDD>.md` (append `_HHmm` on same-day collision).
6. Initialize or update `task.json` and `run.json`.

### User Interaction

1. **Done:** State classification completed and options presented.
2. **Blocked:** Waiting for user choice when prior artifacts exist.
3. **Questions:** Choose one option (`Use Existing`, `Smart Refresh`, `Full Regenerate`, `Resume`, `Generate from Cache`).
4. **Assumption policy:** If user intent is ambiguous, stop and ask. Do not auto-pick destructive refresh.

### State Updates

- `task.json.current_phase = "phase_0_prepare"`
- `task.json.overall_status = "plan_check"` (unless terminal reuse path selected)
- Update `updated_at` in both state files

### Verification

```bash
scripts/check_resume.sh BCIN-1234
jq -r '.overall_status,.current_phase' projects/test-cases/BCIN-1234/task.json
```

---

## Phase 1: QA Plan Resolution

### Actions

1. Resolve QA plan path using defined precedence. You must look up the qa plan path in  `workspace-planner/projects/test-plans/<issue-key>/qa-plan-final.md` 
2. If no plan found: ask for approval to invoke planner.
3. On approval: call `sessions_spawn` to invoke `planner` sub-agent to generate a QA plan; wait for completion announce.
4. Persist resolved `plan_path` in `task.json`.

### User Interaction

1. **Done:** Plan path resolved and recorded.
2. **Blocked:** Plan missing and planner invocation not approved.
3. **Questions:** Approve planner invocation now or stop run.
4. **Assumption policy:** Do not invoke planner without explicit user approval.

### State Updates

- `task.json.current_phase = "phase_1_plan_resolution"`
- On success: `task.json.overall_status = "plan_ready"`
- If spawned: `planner_invoked = true`, `planner_spawned_at` = ISO8601

### Verification

```bash
jq -r '.plan_path,.planner_invoked,.overall_status' projects/test-cases/BCIN-1234/task.json
```

---

## Phase 2: Read Test Environment and Objects

### Actions

1. **Check existence:** Resolve testcase path: `workspace-planner/projects/feature-plan/<issue-key>/testcase.md`.
2. **If no testcase.md:**
   - Require user to provide one:
     - **Option A:** Upload in chat — agent saves to `workspace-planner/projects/feature-plan/<issue-key>/testcase.md`.
     - **Option B:** User places file in that folder and confirms.
   - Create folder if missing: `workspace-planner/projects/feature-plan/<issue-key>/`.
   - Block until `testcase.md` exists and is valid markdown testcase content before proceeding.
   - Validation minimum: file is non-empty and contains at least one explicit testcase section/item.
3. **If testcase.md exists:**
   - Ask user: "Do you need to refresh the test environment and objects? (Y/N)"
   - **If Y:** Ask user to provide a new file (upload in chat or place in folder); overwrite after confirmation.
   - **If N:** Proceed to Phase 3 (Site Knowledge Search).
4. Persist `testcase_path` in `task.json`.

### User Interaction

| State | User Action |
|-------|-------------|
| **Blocked (no testcase.md)** | Upload file in chat or place in folder and confirm |
| **Blocked (refresh requested)** | Provide new file (upload or place) |
| **Done** | Proceed to site-knowledge-search |

### State Updates

- `task.json.current_phase = "phase_2_test_env"`
- `task.json.testcase_path` = full path to `testcase.md`
- `task.json.overall_status = "test_env_ready"`
- `task.json.testcase_resolved_at` = ISO8601
- Update `updated_at` in both state files

### Verification

```bash
test -f ../workspace-planner/projects/feature-plan/BCIN-1234/testcase.md && echo OK
jq -r '.testcase_path,.overall_status' projects/test-cases/BCIN-1234/task.json
```

---

## Phase 3: Site Knowledge Search

### Actions

1. **Prerequisite:** Phase 2 (`testcase.md`) must be resolved before this phase.
2. Derive keywords from issue summary, description, plan components, domain labels, and `testcase.md`.
   - Example: `keywords=["create report","report filter","CalendarFilter"]` `domains=["filter","report-editor"]`
3. Invoke **site-knowledge-search** skill — read `skills/site-knowledge-search/SKILL.md`.
4. Skill writes `projects/test-cases/<key>/site_context.md`.
5. Record freshness timestamps in `run.json`.

### User Interaction

1. **Done:** Site context artifact generated.
2. **Blocked:** Both search backends unavailable and no fallback data.
3. **Questions:** Continue in degraded mode or stop.
4. **Assumption policy:** Do not hide degraded search quality; surface clearly.

### State Updates

- `task.json.current_phase = "phase_3_site_knowledge"`
- `task.json.site_context_path` = full path to `site_context.md`
- `task.json.overall_status = "testing"`
- `run.json.site_context_generated_at` = ISO8601

### Verification

```bash
test -f projects/test-cases/BCIN-1234/site_context.md && echo OK
jq -r '.site_context_path,.overall_status' projects/test-cases/BCIN-1234/task.json
```

---

## Phase 4: Execute Test Cases

### Actions

1. Read `testcase_path` (test environment and objects) and `site_context_path` before each test case.
2. Execute cases via Playwright MCP (`mcporter`) and capture evidence.
3. If locator guidance is insufficient: refresh site knowledge once, then retry per policy.
4. Record PASS/FAIL/BLOCKED per case.
5. Save screenshots to `projects/test-cases/<key>/screenshots/<step>.png`.

### User Interaction

1. **Done:** Execution records and screenshots captured.
2. **Blocked:** Environment/data/access blockers prevent execution.
3. **Questions:** Retry blocked cases now or finalize with blocked status.
4. **Assumption policy:** Do not silently skip required cases.

### State Updates

- `task.json.current_phase = "phase_4_execution"`
- Keep `task.json.overall_status = "testing"`
- Update progress timestamps in `run.json.subtask_timestamps`

### Verification

```bash
ls -1 projects/test-cases/BCIN-1234/screenshots | head
```

---

## Phase 5: Reporting and Defect Gate

### Actions

1. Invoke **test-report** skill — read `skills/test-report/SKILL.md`.
2. Skill generates `projects/test-cases/<key>/reports/execution-summary.md`.
3. For failed cases: skill invokes **bug-report-formatter**.
4. Ask user: "Bug(s) detected. Log to Jira? (Y/N)".
5. If approved: use **jira-cli** to create issues and attach screenshots.

### User Interaction

1. **Done:** Execution summary and bug docs prepared.
2. **Blocked:** Waiting for Jira logging approval when failures exist.
3. **Questions:** Create Jira issues now (Y/N).
4. **Assumption policy:** Never auto-create Jira tickets.

### State Updates

- `task.json.current_phase = "phase_5_reporting"`
- Set `result`, `evidence_path`, `test_completed_at`
- `task.json.overall_status = "test_complete"`

### Verification

```bash
test -f projects/test-cases/BCIN-1234/reports/execution-summary.md && echo OK
jq -r '.result,.overall_status' projects/test-cases/BCIN-1234/task.json
```

---

## Phase 6: Completion Notification

### Actions

1. Send Feishu completion message (via `message` or `feishu` skill). 
2. If send fails: persist full payload to `run.json.notification_pending`.
3. If send succeeds: clear `notification_pending`.

### User Interaction

1. **Done:** Notification attempt recorded with final status.
2. **Blocked:** Delivery failure requiring retry.
3. **Questions:** Retry notification now or defer.
4. **Assumption policy:** Do not mark run fully completed if notification state is unknown.

### State Updates

- `task.json.current_phase = "phase_6_notify"`
- `task.json.overall_status = "completed"` only after completion contract is satisfied
- Update `run.json`: `notification_pending`, `last_notification_attempt_at`

### Verification

```bash
jq -r '.notification_pending // empty' projects/test-cases/BCIN-1234/run.json
jq -r '.overall_status' projects/test-cases/BCIN-1234/task.json
```

---

## Status Transition Map

| From | Event | To |
|------|-------|-----|
| `plan_check` | plan resolved | `plan_ready` |
| `plan_ready` | testcase.md resolved | `test_env_ready` |
| `test_env_ready` | site context generated | `testing` |
| `testing` | report generated | `test_complete` |
| `test_complete` | notify contract completed | `completed` |
| any | unrecoverable error | `failed` |

---

## Artifact Paths (Canonical)

| Artifact | Path |
|----------|------|
| Run root | `projects/test-cases/<key>/` |
| Test environment/objects | `workspace-planner/projects/feature-plan/<key>/testcase.md` |
| Site context | `projects/test-cases/<key>/site_context.md` |
| Task state | `projects/test-cases/<key>/task.json` |
| Run metadata | `projects/test-cases/<key>/run.json` |
| Execution report | `projects/test-cases/<key>/reports/execution-summary.md` |
| Screenshots | `projects/test-cases/<key>/screenshots/<step>.png` |
| Archive | `projects/test-cases/<key>/archive/` |

---

## Skills Reference

| Skill | Phase | Purpose |
|-------|-------|---------|
| `site-knowledge-search` | 3 | Search site knowledge, write site_context.md |
| `test-report` | 5 | Generate execution-summary.md, bug docs, Jira gate |
| `bug-report-formatter` | 5 | Format bug reports (invoked by test-report) |
| `jira-cli` | 5 | Create Jira issues (only after user confirms) |
| `playwright-cli` / `mcporter` | 4 | Browser automation |
| `message` / `feishu` | 6 | Completion notification |
