---
description: |
  Defect-test workflow for single Jira issue without pre-existing QA plan.
  Integrates with Reporter Agent (single-defect-analysis) for testing plan and handoff.
  Input: issue key or URL. Output: execution-summary.md, screenshots, reporter callback.
  Uses site-knowledge-search and test-report skills. Idempotent with archive-before-overwrite.
---

# Defect-Test Workflow

**Trigger:** Single Jira issue key or URL (e.g., `BCIN-7890` or `https://*.atlassian.net/browse/BCIN-7890`) without a pre-existing feature QA plan.
**Output:** `projects/test-cases/<key>/reports/execution-summary.md`, screenshots, reporter callback with PASS/FAIL.
**Design Reference:** [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](../../docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md) §4.

**Reporter integration:** [workspace-reporter/.agents/workflows/single-defect-analysis.md](../../../workspace-reporter/.agents/workflows/single-defect-analysis.md)

**Working directory:** `workspace-tester` for all paths. Run root: `projects/test-cases/<issue-key>/`.

---

## Reporter Artifacts (Canonical)

The Reporter Agent produces these artifacts consumed by this workflow:

| Artifact | Path |
|----------|------|
| Testing plan | `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md` |
| Tester handoff | `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/tester_handoff.json` |

`tester_handoff.json` fields: `issue_key`, `testing_plan_path`, `risk_level`, `fc_steps_count`, `exploratory_required`, `affected_domains`, `generated_at`.

---

## Phase 0: Idempotency and Reporter Decision

### Actions

1. Ensure run root exists: `projects/test-cases/<issue-key>/`.
2. Run `scripts/check_resume.sh <issue-key>`.
3. Parse output for `REPORT_STATE` and `TASK_STATE`.
4. Classify state and present allowed options per agent-idempotency:

   | REPORT_STATE | Allowed options |
   |--------------|-----------------|
   | `FINAL_EXISTS` | Use Existing / Smart Refresh / Full Regenerate |
   | `DRAFT_EXISTS` | Resume / Smart Refresh / Full Regenerate |
   | `CONTEXT_ONLY` | Generate from Cache / Re-fetch + Regenerate |
   | `FRESH` | Start New Run |

5. Determine whether reporter artifacts already exist:
   - `workspace-reporter/projects/defects-analysis/<issue-key>/<issue-key>_TESTING_PLAN.md`
   - `workspace-reporter/projects/defects-analysis/<issue-key>/tester_handoff.json`
6. If reporter artifacts missing: ask for approval to invoke reporter via `sessions_spawn`.
7. On approval: spawn Reporter with single-defect-analysis workflow; wait for completion.
8. If overwrite/regenerate selected: archive previous output to `archive/` first.
   - Archive naming: `<key>_OUTPUT_FINAL_<YYYYMMDD>.md` (append `_HHmm` on same-day collision).
9. Initialize or update `task.json` and `run.json`.

### User Interaction

1. **Done:** Resume/regenerate path selected; reporter artifacts available or spawn completed.
2. **Blocked:** Waiting for user choice or reporter availability.
3. **Questions:** Reuse existing reporter artifacts or regenerate; approve reporter spawn if missing.
4. **Assumption policy:** Do not respawn reporter without approval when usable artifacts already exist.

### State Updates

- `task.json.current_phase = "phase_0_prepare"`
- `task.json.overall_status = "waiting_for_reporter"` when waiting for reporter output
- If spawned: `reporter_invoked = true`, `reporter_spawned_at` = ISO8601
- Update `updated_at` in both state files

### Verification

```bash
scripts/check_resume.sh BCIN-7890
jq -r '.reporter_invoked,.overall_status' projects/test-cases/BCIN-7890/task.json
```

---

## Phase 1: Reporter Intake

### Actions

1. Read reporter testing plan: `workspace-reporter/projects/defects-analysis/<issue-key>/<issue-key>_TESTING_PLAN.md`.
2. Read handoff: `workspace-reporter/projects/defects-analysis/<issue-key>/tester_handoff.json`.
3. Validate FC steps, domains, exploratory flags.
4. Normalize execution checklist for tester run.

### User Interaction

1. **Done:** Handoff artifacts validated and accepted.
2. **Blocked:** Required reporter artifact missing or malformed.
3. **Questions:** Retry wait for reporter output or stop.
4. **Assumption policy:** Do not fabricate missing handoff fields.

### State Updates

- `task.json.current_phase = "phase_1_reporter_intake"`
- `task.json.overall_status = "testing"` when intake completes

### Verification

```bash
test -f workspace-reporter/projects/defects-analysis/BCIN-7890/BCIN-7890_TESTING_PLAN.md && echo OK
test -f workspace-reporter/projects/defects-analysis/BCIN-7890/tester_handoff.json && echo OK
```

---

## Phase 2: Site Knowledge Search

### Actions

1. Derive keywords from issue summary and `tester_handoff.json.affected_domains`.
2. Invoke **site-knowledge-search** skill — read `skills/site-knowledge-search/SKILL.md`.
3. Skill writes `projects/test-cases/<key>/site_context.md`.
4. Record freshness timestamps in `run.json`.

### User Interaction

1. **Done:** Site context artifact generated.
2. **Blocked:** No searchable domain mapping and no fallback context.
3. **Questions:** Proceed with `other` domain fallback or stop.
4. **Assumption policy:** Do not hide domain uncertainty.

### State Updates

- `task.json.current_phase = "phase_2_site_knowledge"`
- `task.json.site_context_path` = full path to `site_context.md`
- Keep `task.json.overall_status = "testing"`
- `run.json.site_context_generated_at` = ISO8601

### Verification

```bash
test -f projects/test-cases/BCIN-7890/site_context.md && echo OK
jq -r '.site_context_path,.overall_status' projects/test-cases/BCIN-7890/task.json
```

---

## Phase 3: FC and Exploratory Execution

### Actions

1. Read `site_context_path` before each test step.
2. Execute FC steps from testing plan (FC-01, FC-02, …).
3. Execute exploratory charter when `tester_handoff.json.exploratory_required` is true.
4. Capture screenshot/log evidence and case outcomes.
5. Save screenshots to `projects/test-cases/<key>/screenshots/<step>.png`.
6. Record PASS/FAIL/BLOCKED per step.

### User Interaction

1. **Done:** All executable FC/exploratory steps attempted.
2. **Blocked:** Environment/app blocker prevents completion.
3. **Questions:** Retry unstable steps or finalize with BLOCKED.
4. **Assumption policy:** Do not claim PASS for unexecuted mandatory steps.

### State Updates

- `task.json.current_phase = "phase_3_execution"`
- Keep `task.json.overall_status = "testing"`
- Update progress timestamps in `run.json.subtask_timestamps`

### Verification

```bash
ls -1 projects/test-cases/BCIN-7890/screenshots | head
```

---

## Phase 4: Callback and Reporting

### Actions

1. Invoke **test-report** skill — read `skills/test-report/SKILL.md`.
2. Skill generates `projects/test-cases/<key>/reports/execution-summary.md`.
3. Persist `result`, `evidence_path`, `test_completed_at` in `task.json`.
4. Notify Reporter Agent with PASS/FAIL and evidence via `sessions_spawn`:
   - Context: "Test outcome for <ISSUE_KEY>: <PASS|FAIL>. Execution report: workspace-tester/projects/test-cases/<ISSUE_KEY>/reports/execution-summary.md. Screenshots: workspace-tester/projects/test-cases/<ISSUE_KEY>/screenshots/. Proceed with Phase 7 of single-defect-analysis workflow."
5. If callback fails: set `task.json.reporter_notification_pending = true`.

### User Interaction

1. **Done:** Report generated and callback attempted.
2. **Blocked:** Reporter callback failed.
3. **Questions:** Retry reporter callback now or defer.
4. **Assumption policy:** Do not mark callback success without send confirmation.

### State Updates

- `task.json.current_phase = "phase_4_callback_reporting"`
- Set `result`, `evidence_path`, `test_completed_at`
- `task.json.overall_status = "test_complete"`
- On spawn success: `reporter_notification_pending = false`
- On spawn failure: `reporter_notification_pending = true`

### Verification

```bash
test -f projects/test-cases/BCIN-7890/reports/execution-summary.md && echo OK
jq -r '.reporter_notification_pending,.result,.overall_status' projects/test-cases/BCIN-7890/task.json
```

---

## Phase 5: Completion Notification

### Actions

1. Send Feishu completion summary (via `message` or `feishu` skill).
2. If send fails: persist full payload to `run.json.notification_pending`.
3. If send succeeds: clear `notification_pending`.

### User Interaction

1. **Done:** Notification state finalized.
2. **Blocked:** Feishu send failure.
3. **Questions:** Retry now or keep pending for next resume.
4. **Assumption policy:** Do not silently drop failed notifications.

### State Updates

- `task.json.current_phase = "phase_5_notify"`
- `task.json.overall_status = "completed"` only when completion contract is satisfied
- Update `run.json`: `notification_pending`, `last_notification_attempt_at`

### Verification

```bash
jq -r '.notification_pending // empty' projects/test-cases/BCIN-7890/run.json
jq -r '.overall_status' projects/test-cases/BCIN-7890/task.json
```

---

## Status Transition Map

| From | Event | To |
|------|-------|-----|
| `plan_check` | reporter path selected | `waiting_for_reporter` or `testing` |
| `waiting_for_reporter` | intake complete | `testing` |
| `testing` | report generated | `test_complete` |
| `test_complete` | notify contract completed | `completed` |
| any | unrecoverable error | `failed` |

---

## Artifact Paths (Canonical)

| Artifact | Path |
|----------|------|
| Run root | `projects/test-cases/<key>/` |
| Site context | `projects/test-cases/<key>/site_context.md` |
| Task state | `projects/test-cases/<key>/task.json` |
| Run metadata | `projects/test-cases/<key>/run.json` |
| Execution report | `projects/test-cases/<key>/reports/execution-summary.md` |
| Screenshots | `projects/test-cases/<key>/screenshots/<step>.png` |
| Archive | `projects/test-cases/<key>/archive/` |
| Reporter testing plan (read) | `workspace-reporter/projects/defects-analysis/<key>/<key>_TESTING_PLAN.md` |
| Reporter handoff (read) | `workspace-reporter/projects/defects-analysis/<key>/tester_handoff.json` |

---

## Skills Reference

| Skill | Phase | Purpose |
|-------|-------|---------|
| `site-knowledge-search` | 2 | Search site knowledge, write site_context.md |
| `test-report` | 4 | Generate execution-summary.md |
| `playwright-cli` / `mcporter` | 3 | Browser automation for FC and exploratory steps |
| `message` / `feishu` | 5 | Completion notification |
| `sessions_spawn` | 0, 4 | Invoke Reporter Agent; callback Reporter with outcome |
