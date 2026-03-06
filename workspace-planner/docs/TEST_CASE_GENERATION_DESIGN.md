# Test Case Generation Design (Planner Agent)

## Overview

This document defines the logic, workflows, and output rules for **test case generation** by the Planner Agent (`workspace-planner`). The Planner is the "Test Generator" in the OpenClaw system — it reads feature artifacts (QA plans, Jira tickets, Confluence docs) and serializes detailed, **Playwright-compatible** Markdown specs (`.md`) for the Tester Agent to consume.

**What the Planner produces → what the Tester consumes:**

```
Planner Agent (workspace-planner)
  └─ specs/<domain>/<feature>/<scenario>.md   ← Planner output

Tester Agent (workspace-tester)
  └─ tests/specs/<domain>/<feature>/<scenario>.spec.ts  ← Generated from above
```

**Key constraints:**
- Output is always **Markdown (`.md`)**, never JSON. The Playwright Generator consumes Markdown plans.
- The Healer consumes failing Playwright `.spec.ts` tests plus debug context/logs, not plan Markdown as its primary input.
- Steps must use **role/label/text** phrasing so the Generator can map to `getByRole`, `getByText`, and the Healer can correlate with `playwright-cli snapshot` output.
- Every spec must reference `**Seed:** \`tests/seed.spec.ts\`` for authenticated context bootstrap.
- Browser tooling policy:
  - Default browser inspection/execution uses **Playwright CLI** (`playwright-cli open`, `snapshot`, `screenshot`).
  - If using Playwright MCP in Tester workflows, it must be integrated via the installed `mcporter` skill (no direct ad-hoc MCP usage outside skill guidance).

---

## Entry Points

| Condition | Scenario |
|-----------|----------|
| QA plan exists at `projects/feature-plan/<feature-id>/qa_plan_final.md` | **Scenario 1** — Generate directly from the plan |
| No QA plan; user provides Jira key, Confluence URL, or mission | **Scenario 2** — Create QA plan first, then Scenario 1 |

---

## Output Path Convention

Planner writes specs to the **feature-plan directory** (co-located with the QA plan). The Tester reads from the Tester workspace. Use **Option A** (path handoff) unless the Tester cannot cross-read.

| Context | Planner writes to | Tester reads from |
|---------|-------------------|-------------------|
| Feature-plan specs | `projects/feature-plan/<feature-id>/specs/<domain>/<feature>/<scenario>.md` | Same path (cross-read) or copy to `workspace-tester/projects/library-automation/specs/` |
| Standalone (no QA plan) | `projects/testcase-plan/<feature-id>/specs/<domain>/<feature>/<scenario>.md` | Copy to `workspace-tester/projects/library-automation/specs/` |

**Path segments:**
- `<domain>` — top-level feature area, e.g. `report-editor`, `dashboard-editor`
- `<feature>` — specific feature folder, e.g. `report-undo-redo`, `report-page-by`
- `<scenario>` — one file per test scenario, e.g. `authoringClear.md`, `page-by-2.md`

> **⚠️ Path confirmation required:** The agent must always derive a proposed path from the feature ID and QA plan context, present it to the user, and wait for explicit approval **before writing any spec files**. See [Phase 3 — Pre-requisite Confirmation](#phase-3--pre-requisite-confirmation-interactive).

**Example proposal presented to user:**
```
Proposed output path:
  specs/report-editor/report-undo-redo/
  → 5 spec files: authoringClear.md, authoringEditReport.md, authoringNewReport.md, consumption.md, consumptionClear.md
  Full path: projects/feature-plan/BCIN-1234/specs/report-editor/report-undo-redo/

Confirm path, or provide a different domain/feature name?
```

---

## Spec Format (Canonical)

Every generated `.md` file MUST use this structure exactly:

```markdown
# [Application/Feature] — [Scenario Name]

**Seed:** `tests/seed.spec.ts`

## Application Overview
[One or two sentences: what this scenario tests and why.]

## Test Scenarios

### 1. [Scenario Label]

**Steps:**
1. [Action verb] [target by role/label/visible text]
2. ...

**Expected Results:**
- [Measurable, observable outcome]
- ...

### 2. [Next Scenario Label]

**Steps:**
...

**Expected Results:**
...
```

### Semantic Step Rules (Critical for Auto-Healing)

The Healer maps spec steps to `playwright-cli snapshot` element refs (e.g. `e1 [button "Undo"]`). Steps that reference IDs or CSS classes break auto-healing.

| ✅ Do | ❌ Don't |
|-------|---------|
| Click the "Submit" button | Click `#submit-btn` |
| Type "user@test.com" in the Email field | Enter email in input |
| Select "Q1 2024" from the Date filter dropdown | Use the date picker |
| Check the "Remember me" checkbox | Check remember |
| Verify the heading "Welcome" is visible | Verify success message appears |
| Click Undo | Click the undo icon |

**Allowed action verbs:** `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`, `Navigate to`.

### Real Example (report-editor undo/redo)

```markdown
# Report Undo/Redo — Authoring Clear

**Seed:** `tests/seed.spec.ts`

## Application Overview
Report Editor Undo/Redo functionality covering join type changes, prompt application,
attribute form updates, and reprompt flows.

## Test Scenarios

### 1. Undo/Redo for join and prompt

**Steps:**
1. Navigate to the report editor by URL (dossier TC85614JoinOnMetric)
2. Open context menu for "Freight" → select "Join Type" → "Inner Join"
3. Switch to design mode, click "Apply" in prompt editor
4. Change number format for "Freight" to Fixed in the metrics drop zone
5. Open context menu for "Freight" → select "Join Type" → "Outer Join"
6. Wait for undo/redo UI to update

**Expected Results:**
- Undo/Redo buttons are disabled after updating the join type for Freight

### 2. Attribute form undo/redo

**Steps:**
1. Update attribute forms for "Customer" in Page By drop zone to "Show attribute name once"
2. Click Undo
3. Click Redo

**Expected Results:**
- After Undo: attribute form for "Customer" reverts to default
- After Redo: attribute form for "Customer" shows "Show attribute name once"
```

---

## Scenario 1: Generate from an Existing QA Plan

**Trigger:** `projects/feature-plan/<feature-id>/qa_plan_final.md` exists.

### Phase 0 — Idempotency Check & Pre-Flight (Always First)

**Design Reference:** Phase 0 aligns with **agent-idempotency** skill and **openclaw-agent-design** check-resume pattern. See reference workflows: `workspace-reporter/.agents/workflows/qa-summary.md`, `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`.

**Steps (never skip):**

1. **Accept target:** Get Feature ID (e.g. `BCIN-1234`) and any additional artifacts from the user.
2. **Double confirm:** Based on provided artifacts, double confirm requirements and raise questions if doubts exist. **ONLY proceed with user approval.**
3. **Working directory:** Ensure working directory is `projects/feature-plan/<feature-id>/`. Scripts run from feature dir use `../scripts/` (e.g. `../scripts/check_resume_testcase.sh <feature-id>`).
4. **Run idempotency script:** Execute `../scripts/check_resume_testcase.sh <feature-id>`. Parse `REPORT_STATE` from output.
5. **Handle REPORT_STATE — STOP and present options before any external call:**

| REPORT_STATE | Condition | Action |
|--------------|-----------|--------|
| **FINAL_EXISTS** | All planned specs exist; `testcase_task.json` is `completed` | Display freshness (QA plan age, specs age). **STOP.** Offer: (A) Use Existing / (B) Smart Refresh / (C) Full Regenerate. If (C), archive before proceeding. |
| **DRAFT_EXISTS** | Some specs exist; task shows `current_phase` in progress | **STOP.** Offer: (A) Resume / (B) Smart Refresh / (C) Full Regenerate. |
| **CONTEXT_ONLY** | QA plan read, `data_fetched_at` in task, no spec files yet | **STOP.** Offer: (A) Generate from Cache / (B) Re-fetch + Regenerate. |
| **FRESH** | No `testcase_task.json`, no specs | Initialize `testcase_task.json` and proceed. |

6. **Archive before overwrite:** If user chooses Smart Refresh or Full Regenerate and specs exist, move existing `specs/<domain>/<feature>/` to `archive/specs_<YYYYMMDD>/` before any overwrite. **Never silently overwrite.**
7. **Resume handling:** If script outputs `RESUMABLE` and `resume_from: <phase>`, skip to that phase without re-running prior phases.

**Cache freshness display (required):** Before presenting options, state data ages explicitly:
> *"[Feature-id] test specs were last generated on 2026-01-28 (3 days ago). QA plan: 5 days old. Specs: 5/5 complete."*

**Task file:** Use `testcase_task.json` in `projects/feature-plan/<feature-id>/` to avoid conflict with the `feature-qa-planning-orchestrator` skill's `task.json`. Implements state machine per openclaw-agent-design §3.

```json
{
  "run_key": "<feature-id>:testcase",
  "overall_status": "in_progress",
  "current_phase": "read_qa_plan",
  "updated_at": "<ISO8601>",
  "phases": {
    "read_qa_plan": { "status": "pending" },
    "context_research": { "status": "pending" },
    "research_ambiguous": { "status": "pending" },
    "prerequisite_confirmation": { "status": "pending" },
    "markdown_generation": {
      "status": "pending",
      "written_count": 0,
      "total_count": null
    },
    "done": { "status": "pending" }
  },
  "data_fetched_at": null,
  "output_generated_at": null,
  "subtask_timestamps": {},
  "output_path": "specs/<domain>/<feature>",
  "archive_log": [],
  "notification_pending": null
}
```

> **Resume logic for `markdown_generation`:** If `DRAFT_EXISTS` is detected and `current_phase` is `markdown_generation`, compare `subtask_timestamps` keys to the full planned spec list. Resume from the first spec not yet present in `subtask_timestamps`. Update `written_count` after each file is written. `total_count` is set during Phase 3 once spec filenames are confirmed.

**Progress notification:** Inform the user — *"⏳ Phase 0 complete. State: FRESH / DRAFT_EXISTS / FINAL_EXISTS / CONTEXT_ONLY. Proceeding to read QA plan and context artifacts."*

### Phase 1 — Read QA Plan & Context Artifacts

Read **all available** artifacts from `projects/feature-plan/<feature-id>/`:

| File | What it provides |
|------|-----------------|
| `qa_plan_final.md` | Test scenarios, acceptance criteria, risk areas |
| `context/jira.json` | Feature requirements, user stories, ACs |
| `context/confluence.md` | Internal product documentation |
| `context/qa_plan_atlassian_<id>.md` | Structured test area analysis from Jira + Confluence |
| `context/qa_plan_defect_analysis_<id>.md` | Known defects; drives negative/regression test cases |
| `context/qa_plan_background_<id>.md` | External research (tavily-search results) |
| `context/github_diff.md` | Code changes; pinpoints what to test precisely |
| `context/figma.md` | UI layout/flow reference for step phrasing |

Derive from these:
- **Test objects**: pages, components, user flows to test
- **Test data**: accounts, credentials, roles, environment URLs
- **Known risks**: areas where defects were found before

Update `testcase_task.json`: `current_phase: context_research`, `data_fetched_at: <now>`.

**Progress notification:** Inform the user — *"⏳ Phase 1 complete. QA plan and N context artifacts read. Checking for ambiguous steps."*

### Phase 2 — Research Ambiguous Steps

**Never assume** UI interactions. If steps or flows are unclear after reading the QA plan:

| When | Tool | How |
|------|------|-----|
| UI flow or product behavior unclear | `tavily-search` | Search official docs, help center, user guides |
| Internal product config or selectors | `confluence` | `confluence search "<keyword>"` or `confluence read <page-id>` |
| OpenClaw-specific QA plan lookup | `clawddocs` | Look up existing plans or product docs in the OpenClaw knowledge base |
| Feature-specific context is in the QA plan | QA plan context files | Re-read `context/` artifacts (don't re-fetch unless Smart Refresh) |

**⛔ User Permission Gate (before any external call):**
If any `tavily-search`, `confluence`, or remote `clawddocs` fetch calls are needed, **pause and summarize** which steps are unclear and which tools will be used. Present to the user:
```
I plan to look up N unclear step(s) via <tool>:
  - "<unclear step or flow>"
  - ...
Proceed with research? (Y / Skip — generate from QA plan only)
```
Only call external tools after the user confirms. If the user skips, generate specs from existing QA plan context only and note any assumptions inline.
`clawddocs` local cache/index reads are allowed without this gate; only remote fetches need confirmation.

Update `testcase_task.json`: `current_phase: prerequisite_confirmation`.

**Progress notification:** Inform the user — *"⏳ Phase 2 complete. Research done (or skipped — steps were clear). Moving to pre-requisite confirmation."*

### Phase 3 — Pre-requisite Confirmation (Interactive)

Before generating **any** spec files, **pause and present a confirmation summary** to the user. Do not write files until the user approves all items below.

1. **Output path (mandatory — confirm first):**
   - Propose the `<domain>/<feature>` path derived from the QA plan and feature ID.
   - List the planned scenario file names.
   - Show the full resolved path (e.g. `projects/feature-plan/BCIN-1234/specs/report-editor/report-undo-redo/`).
   - **Wait for explicit user approval.** If the user changes the domain or feature name, update `testcase_task.json` `output_path` before proceeding.

   ```
   Proposed output path:
     specs/<domain>/<feature>/
     → N spec files: <scenario1>.md, <scenario2>.md, ...
     Full path: projects/feature-plan/<feature-id>/specs/<domain>/<feature>/

   Confirm path, or provide a different domain/feature name?
   ```

2. **Test objects:** Which pages, components, or flows to test? (derive from QA plan, confirm any gaps)
3. **User accounts:** Credentials, roles (admin/viewer/editor), or mock users needed?
4. **Environment:** Target URL (staging/prod), feature flags, config needed?
5. **Mock data:** API stubs, seed data, or test dataset required for idempotent runs?

Do not proceed to generation without user confirmation on **all** items above, especially the output path.

**Progress notification:** Once user confirms — *"✅ Phase 3 confirmed. Output path: `specs/<domain>/<feature>/`. Starting spec generation."*

### Phase 4 — Generate Markdown Specs

Update `testcase_task.json`: `current_phase: markdown_generation`.

**Generation rules:**

1. **One scenario file per feature flow** — prefer granular files (e.g., `authoringClear.md`, `authoringEditReport.md`) over a single large file. This reduces Healer scope on failure.
2. **Apply test categories from QA plan** — generate coverage across:
   - Positive (happy path): valid flows, expected outcomes
   - Negative (error paths): invalid input, access denied, missing data
   - Boundary: edge values (empty state, max items, min/max length)
   - Regression: prior defect scenarios from `qa_plan_defect_analysis_<id>.md`
3. **Use the `test-case-generator` skill** to synthesize steps from the QA plan and context artifacts.
4. **Every spec must include:**
   - `**Seed:** \`tests/seed.spec.ts\`` at the top
   - An `## Application Overview` section (1–2 sentences)
   - Steps written in semantic role/label/text style (see rules above)
   - Explicit `**Expected Results:**` for every scenario
5. **After writing each spec:** Update `testcase_task.json` `subtask_timestamps["spec:<scenario>"]`. Notify the user inline — *"📝 Written `<scenario>.md` (<M of N>)."*
6. **After all specs:** Set `output_generated_at`, `output_path`, `overall_status: completed`, `current_phase: done`.

### Phase 5 — Notification & Tester Handoff

#### 5.1 Feishu DM (Completion Notification)

Use the `feishu` skill to send a DM to the user:

```
✅ Test specs generated
  Feature:    <FEATURE_ID>
  Domain:     <domain>/<feature>
  Specs:      <N> files written
  Path:       projects/feature-plan/<feature-id>/specs/<domain>/<feature>/
  Files:      <scenario1>.md, <scenario2>.md, ...
  Generated:  <UTC TIMESTAMP>
Next step: Hand off to Tester Agent to generate .spec.ts and run tests.
```

If any specs were **skipped or partially written** (e.g. due to interruption), append:
```
⚠️ Partial generation: <M> of <N> specs written. Run again to resume.
```

**If Feishu fails:** Log to `testcase_task.json` → `notification_pending` with the full message text. On the next run, retry before starting any other phase.

```json
"notification_pending": {
  "channel": "feishu_dm",
  "message": "✅ Test specs generated — <FEATURE_ID> — <N> files at specs/<domain>/<feature>/",
  "failed_at": "<UTC TIMESTAMP>"
}
```

#### 5.2 Tester Handoff

**⛔ Human Approval Gate (mandatory):**
- Before notifying or invoking Tester, present a handoff summary and wait for explicit user approval.
- Do not hand off automatically after spec generation.

```text
Proposed tester handoff:
  Feature: <FEATURE_ID>
  Path: workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/
  Files: <scenario1>.md, <scenario2>.md, ...
  Chain: playwright-test-generator -> playwright-test-healer

Proceed with tester handoff? (Y / No)
```

Notify the Tester Agent with:
- **Feature ID** (e.g. `BCIN-1234`)
- **Domain & feature** (e.g. `report-editor`, `report-undo-redo`)
- **Specs path** (absolute or repo-relative)
- **List of generated spec files**

The Tester reads the `.md` files, generates `tests/specs/<domain>/<feature>/*.spec.ts` via the Playwright Generator, and runs them via `npx playwright test`.

**Mandatory handoff payload (machine-readable):**

```json
{
  "feature_id": "<FEATURE_ID>",
  "domain": "<domain>",
  "feature": "<feature>",
  "specs_path": "workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/",
  "spec_files": ["<scenario1>.md", "<scenario2>.md"],
  "seed": "tests/seed.spec.ts",
  "requested_chain": ["playwright-test-generator", "playwright-test-healer"]
}
```

**Tester acknowledgment contract (required):**
- Tester must return an ack containing:
  - `status: received`
  - `read_path_ok: true|false`
  - `detected_spec_count: <N>`
  - `next_step: generation_started | blocked`
- If `read_path_ok=false`, planner switches to Option B copy flow (or asks user to approve copy) before retrying handoff.

---

## Scenario 2: No QA Plan — End-to-End Flow

**Trigger:** User provides a Jira ticket, Confluence URL, or free-form mission but no `qa_plan_final.md` exists.

### Steps

1. **Context Enrichment** (when artifacts are minimal):
   - Use `clawddocs` to look up any existing OpenClaw plans or product docs matching the feature
   - Use `tavily-search` to gather product documentation, user guides, or technical references
   - Use `confluence search "<keyword>"` to find internal docs
   - Save outputs to `projects/feature-plan/<feature-id>/context/` (e.g. `context/qa_plan_background_<feature-id>.md`)
   - **Confirm with user:** Summarize your understanding and wait for approval before proceeding

2. **Create QA Plan:**
   Trigger the `feature-qa-planning-orchestrator` skill (`workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`). Pass the feature ID and all available artifacts (Jira key, Confluence URL, GitHub PR, Figma URL). The skill handles context gathering, synthesis, review, and publication to `qa_plan_final.md`.

3. **Transition to Scenario 1:**
   Once `qa_plan_final.md` is ready, run **Scenario 1 Phase 0** (idempotency check via `check_resume_testcase.sh` for `testcase_task.json` and specs), then proceed through Phases 1–5 as normal.

---

## Task File Reference

Two task files are used to avoid conflicts when both workflows run for the same feature:

| Directory | Task File | Owned by |
|-----------|-----------|----------|
| `projects/feature-plan/<feature-id>/` | `task.json` | `feature-qa-planning-orchestrator` skill |
| `projects/feature-plan/<feature-id>/` | `testcase_task.json` | This workflow (test case generation) |
| `projects/testcase-plan/<feature-id>/` | `task.json` | Standalone test case generation (no feature-plan) |

**Error recovery:** If `testcase_task.json` is missing but spec files exist on disk, reconstruct state:
- Count `.md` files in `specs/<domain>/<feature>/` → present as `DRAFT_EXISTS` or `FINAL_EXISTS` depending on completeness
- Check `qa_plan_final.md` modification time → use as `data_fetched_at` estimate
- Prompt: *"Task file missing. Found N spec files. QA plan last modified X days ago. Resume from inferred state or restart?"*

---

## agent-idempotency Domain Mapping

Map generic agent-idempotency concepts to this workflow (see `.cursor/skills/agent-idempotency/SKILL.md` § Applying to Your Domain):

| Generic Concept | Test Case Generation |
|------------------|----------------------|
| Run key | `<feature-id>:testcase` |
| Primary data source | QA plan (`qa_plan_final.md`) + context artifacts |
| Primary cache files | `context/*.md`, `context/jira.json`, `context/github_diff.md` |
| Sub-tasks | Individual spec files (`<scenario>.md`) |
| Sub-task cache files | `specs/<domain>/<feature>/<scenario>.md` |
| Final output | All planned specs written; `testcase_task.json` → `overall_status: completed` |
| Draft output | Partial specs written; `testcase_task.json` → `current_phase` in progress |
| `data_fetched_at` | When QA plan + context were last read |
| Smart Refresh trigger | QA plan or context changed |
| Sub-task staleness rule | Specs re-generated when QA plan changes |

---

## Script: check_resume_testcase.sh

**File to create:** `workspace-planner/projects/feature-plan/scripts/check_resume_testcase.sh`

Implements the **agent-idempotency** tiered existence check for the test case generation workflow. Run from `projects/feature-plan/<feature-id>/` as `../scripts/check_resume_testcase.sh <feature-id>`.

**Behavior:**

1. **Emit REPORT_STATE first** (idempotency before any API):
   - **FINAL_EXISTS** — All planned specs exist; `testcase_task.json` shows `overall_status: completed`. Output freshness (QA plan age, specs age). Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate.
   - **DRAFT_EXISTS** — Some specs exist; task shows `current_phase` in progress. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate.
   - **CONTEXT_ONLY** — `data_fetched_at` present in task; `qa_plan_final.md` or context exists; no spec files yet. Options: (A) Generate from Cache (B) Re-fetch + Regenerate.
   - **FRESH** — No `testcase_task.json` or specs. Proceed.
2. **Parse `testcase_task.json`** → `current_phase`, `overall_status`, `phases`.
3. **If RESUMABLE** → Output `resume_from: <phase>`.

**Output format:** Emit `REPORT_STATE=<value>` for agent to parse. Display freshness (timestamps) before options.

---

## Tester Handoff Options

### Option A — Path Notification (Preferred)

Pass the specs path to the Tester. No file duplication.

**Precondition check (required before Option A):**
- Perform a read-probe in handoff: tester must confirm `read_path_ok=true` and report `detected_spec_count`.
- If probe fails, fallback to Option B copy flow; do not proceed with a blind path-only handoff.

Include in the handoff:
- Feature ID (e.g. `BCIN-1234`)
- Specs path: `workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/`
- List of spec files generated

### Option B — Copy Script

If the Tester workflow requires specs under its own canonical path:

```bash
# From workspace root
./scripts/copy-specs-to-tester.sh <feature-id> <domain> <feature>
# Source: workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/
# Destination: workspace-tester/projects/library-automation/specs/<domain>/<feature>/
```

Use Option B only if the Tester cannot cross-read the Planner's workspace.

> **⚠️ Deferred:** `copy-specs-to-tester.sh` does not yet exist. Create it only if Option A proves insufficient. Until then, default to Option A.

---

## Skills Used

| Skill | When to use |
|-------|-------------|
| `test-case-generator` | Step synthesis during Markdown generation. Drives scenario coverage. |
| `mcporter` | Required bridge when Tester uses Playwright MCP server tooling; use skill-mediated integration only. |
| `feishu` | Send completion DM and per-phase progress notifications to user |
| `clawddocs` | Look up existing OpenClaw QA plans or product-specific docs before assuming steps |
| `tavily-search` | Research UI flows, official docs, or user guides when steps are unclear |
| `confluence` | Read internal product docs, config, or selector references |
| `docs-organization-governance` | Apply when creating or placing new doc locations |
| `agent-idempotency` | Archive, cache reuse, and state management rules |

---

## Quick Reference

| Item | Value |
|------|-------|
| Spec format | Markdown (`.md`), Playwright-compatible |
| Spec path (feature-plan) | `projects/feature-plan/<feature-id>/specs/<domain>/<feature>/<scenario>.md` |
| Spec path (standalone) | `projects/testcase-plan/<feature-id>/specs/<domain>/<feature>/<scenario>.md` |
| Task file (feature-plan) | `testcase_task.json` (no conflict with `task.json`) |
| Task file (standalone) | `task.json` |
| Seed reference (mandatory) | `**Seed:** \`tests/seed.spec.ts\`` |
| Tester executable output | `workspace-tester/projects/library-automation/tests/specs/<domain>/<feature>/<scenario>.spec.ts` |
| Action verb list | `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`, `Navigate to` |

---

## Quick Checklist (openclaw-agent-design)

Before finalizing this design or workflow implementation:

- [x] **agent-idempotency** skill applied to Phase 0 (tiered existence check, archive-before-overwrite, freshness display)
- [x] `check_resume_testcase.sh` implemented and run from Phase 0
- [x] `testcase_task.json` schema includes `phases`, `updated_at`, `written_count`/`total_count` for state machine + granular resume
- [x] User confirmation gates in Phase 2 (before `tavily-search`/`confluence`) **and** Phase 3 (before writing spec files)
- [x] Phase-end progress notifications at end of each phase
- [x] Feishu notification + `notification_pending` fallback on failure
- [x] Spec file title uses `# [Application/Feature] — [Scenario Name]` (no trailing `Test Plan` suffix). Align `test-case-generator` SKILL.md example to match.
- [x] `copy-specs-to-tester.sh` deferred — use Option A (path notification) by default

**Agent Integration (see [Agent Integration](#agent-integration) section):**

- [x] Workflow file `.agents/workflows/test-case-generation.md` created
- [x] AGENTS.md: "Core Workflow: Test Case Generation" section added after Feature QA Planning
- [x] AGENTS.md: `test-case-generator` skill sub-section updated per design
- [x] `test-case-generator` SKILL.md: state file clarification (3a), workflow cross-reference (3b), action verb constraint in Use Cases (3c)
- [x] **Implementation sync completed (2026-03-01):** Workflow handoff approval gate + tester ack contract and AGENTS Phase 5 wording aligned to this design

---

## References

- [feature-qa-planning-orchestrator](../skills/feature-qa-planning-orchestrator/SKILL.md) — Upstream skill (creates `qa_plan_final.md`); Phase 0 reference
- [test-case-generator skill](../skills/test-case-generator/SKILL.md) — Core skill for step synthesis
- [TESTER_AGENT_DESIGN.md](../../workspace-tester/docs/TESTER_AGENT_DESIGN.md) — Tester layout, seed.spec.ts, Generator/Healer flow
- [TESTER_AUTOMATION_DESIGN.md](../../docs/TESTER_AUTOMATION_DESIGN.md) — Agent roles, Playwright-CLI exclusivity, Healer routing
- [agent-idempotency](../../.cursor/skills/agent-idempotency/SKILL.md) — Cache reuse, archive, error recovery
- [docs-organization-governance](../../.cursor/skills/docs-organization-governance/SKILL.md) — File placement rules
- [Playwright CLI](https://github.com/microsoft/playwright-cli) — CLI for browser interactions (`open`, `snapshot`, `screenshot`)
- [Playwright Test Agents](https://playwright.dev/docs/test-agents) — Planner → specs, Generator → tests, Healer → fixes
- Real spec examples: `workspace-tester/projects/library-automation/specs/report-editor/report-undo-redo/`

---

## Agent Integration

> This section defines the **three implementation artifacts** needed to make this design usable by the Planner Agent. In OpenClaw/Clawdbot, an **Agent** is an AI runtime that reads `AGENTS.md` (operating instructions + memory) and boots skills from `<workspace>/skills/` on every session start. Therefore:
> - `AGENTS.md` = the primary place the agent learns about available workflows
> - `.agents/workflows/` = the slash-command workflow files the agent can invoke
> - `skills/` = reusable tool instructions the agent loads per-task

---

### Part 1 — New Workflow File

**File to create:** `.agents/workflows/test-case-generation.md`

**Frontmatter description:**
```yaml
---
description: Generate Playwright-compatible Markdown spec files from an existing QA plan or from scratch (Jira/Confluence/mission). Produces specs/<domain>/<feature>/<scenario>.md for the Tester Agent to consume.
---
```

**Slash command:** `/test-case-generation`

**Structure** (mirrors the phases in this design doc 1-to-1):

```
## Entry Point Detection
  if qa_plan_final.md exists → Scenario 1: Phase 0
  else                       → Scenario 2: Context Enrichment → `feature-qa-planning-orchestrator` → Phase 0

## Scenario 2 — No QA Plan (Pre-step)
  1. Context Enrichment (clawddocs / tavily-search / confluence)
  2. Confirm understanding with user
  3. Trigger `feature-qa-planning-orchestrator` skill
  4. Once qa_plan_final.md ready → proceed to Phase 0

## Phase 0 — Idempotency Check & Pre-Flight
  Run ../scripts/check_resume_testcase.sh <feature-id>. Parse REPORT_STATE.
  State classification: FRESH / DRAFT_EXISTS / FINAL_EXISTS / CONTEXT_ONLY
  Double confirm with user; archive before overwrite; initialize testcase_task.json on FRESH

## Phase 1 — Read QA Plan & Context Artifacts
  Read all files from projects/feature-plan/<feature-id>/
  Update testcase_task.json: current_phase → context_research

## Phase 2 — Research Ambiguous Steps
  clawddocs → OpenClaw-specific lookup only
  tavily-search → external UI flows / product docs
  confluence → internal product docs / selectors
  Optional UI ambiguity branch: use playwright-test-planner only as a subagent for discovery notes, then normalize back into canonical Markdown spec format
  Skip if all steps are clear from QA plan

## Phase 3 — Pre-requisite Confirmation (BLOCKING — wait for user)
  Present: output path + test objects + user accounts + environment + mock data
  Do NOT write any files until user explicitly approves

## Phase 4 — Generate Markdown Specs
  Use test-case-generator skill
  One .md file per scenario; write sequentially; update testcase_task.json after each

## Phase 5 — Notification & Tester Handoff
  5.1 Feishu DM via feishu skill (with fallback to notification_pending in testcase_task.json)
  5.2 Tester handoff only after explicit human approval (Option A with read-probe by default)
```

**Task file ownership** (to avoid conflict with `feature-qa-planning-orchestrator`):
- This workflow owns `testcase_task.json` (never `task.json`)

---

### Part 2 — AGENTS.md Additions

**File to modify:** `AGENTS.md`

Add a **new section** immediately after "Core Workflow: Feature QA Planning (Master Orchestrator)":

```markdown
## Core Workflow: Test Case Generation (Spec Generator)

When the user wants to generate Playwright-compatible test spec files for a feature, trigger this workflow.

Trigger: User asks to generate test cases, test specs, or spec files for a feature ID.
  ↓
Trigger the `/test-case-generation` workflow (file: `.agents/workflows/test-case-generation.md`)
  ↓
Entry routing:
  • qa_plan_final.md EXISTS → Phase 0 (existence check)
  • No qa_plan_final.md   → Scenario 2 (context enrichment → `feature-qa-planning-orchestrator` → Phase 0)

Key phases:
  0. Existence check — classify state, initialize testcase_task.json
  1. Read QA plan & context/ artifacts — derive test objects, data, risks
  2. Research ambiguous steps — use clawddocs / tavily-search / confluence only when unclear
  3. Pre-requisite confirmation (BLOCKING) — present path + objects + env + data; wait for approval
  4. Generate Markdown specs — one .md per scenario via test-case-generator skill
  5. Feishu DM + Tester Agent handoff (human approval required before handoff)

State file: testcase_task.json (separate from task.json owned by `feature-qa-planning-orchestrator`)
Output: projects/feature-plan/<feature-id>/specs/<domain>/<feature>/<scenario>.md
```

Also **update** the existing "Skills & Tools → test-case-generator Skill" sub-section to read:

```markdown
### test-case-generator Skill
Used during Phase 4 of /test-case-generation to synthesize Playwright-compatible Markdown spec files.
- Source: QA plan + context/ artifacts from feature-plan directory
- Output: specs/<domain>/<feature>/<scenario>.md (one file per scenario)
- Rules: semantic step phrasing (role/label/text), mandatory Seed reference, Expected Results per scenario
- See: TEST_CASE_GENERATION_DESIGN.md, .agents/workflows/test-case-generation.md
```

---

### Part 3 — `test-case-generator` Skill Updates

**File to modify:** `skills/test-case-generator/SKILL.md`

Three targeted additions:

#### 3a — State file clarification (add to "Test Case Management" section)
```markdown
**State tracking:** Use `testcase_task.json` (not `task.json`) to track generation progress.
Update `subtask_timestamps["spec:<scenario>"]` after each file is written.
Task file lives at: `projects/feature-plan/<feature-id>/testcase_task.json`
```

#### 3b — Workflow cross-reference (add to "Integration Points" section)
```markdown
- **test-case-generation workflow**: This skill is invoked by `.agents/workflows/test-case-generation.md`
  Phase 4. Do not invoke it standalone outside that workflow unless the user explicitly requests ad-hoc
  generation.
```

#### 3c — Action verb constraint (replace existing Use Cases step 4)

Current text:
> "Serialize detailed Markdown specs one by one under `specs/<domain>/<feature>/`"

Replace with:
> "Serialize detailed Markdown specs one by one under `specs/<domain>/<feature>/` (e.g. `specs/report-editor/report-undo-redo/`). Use **only** these action verbs: `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`, `Navigate to`. Steps referencing IDs or CSS classes break auto-healing."
