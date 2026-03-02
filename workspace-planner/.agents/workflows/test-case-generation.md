---
description: Generate Playwright-compatible Markdown spec files from an existing QA plan or from scratch (Jira/Confluence/mission). Produces specs/<domain>/<feature>/<scenario>.md for the Tester Agent to consume.
---

# Test Case Generation Workflow

Use this workflow when the user wants to generate test case spec files for a feature. Two entry points exist depending on whether a QA plan already exists.

## Entry Point Detection

```
if projects/feature-plan/<feature-id>/qa_plan_final.md exists
  → Scenario 1: Generate directly from Phase 0
else
  → Scenario 2: No QA plan — run Context Enrichment first, then trigger /feature-qa-planning, then proceed to Phase 0
```

---

## Scenario 2 — No QA Plan (Pre-step before Phase 0)

**Trigger:** User provides a Jira key, Confluence URL, GitHub PR, or free-form mission but no `qa_plan_final.md` exists.

1. **Context Enrichment:**
   - Use `tavily-search` to gather product documentation, user guides, or technical references.
   - Use `confluence search "<keyword>"` to find internal docs.
   - Save all outputs to `projects/feature-plan/<feature-id>/context/` (e.g. `context/qa_plan_background_<feature-id>.md`).

2. **Confirm understanding:** Summarize what you found and wait for user approval before proceeding.

3. **Create QA Plan:**
   Trigger the `/feature-qa-planning` workflow (`.agents/workflows/feature-qa-planning.md`). Pass all available artifacts (Jira key, Confluence URL, GitHub PR, Figma URL).

4. **Transition:** Once `qa_plan_final.md` is ready, proceed to **Phase 0** below.

---

## Scenario 1 — Generate from Existing QA Plan

### Phase 0 — Idempotency Check & Pre-Flight (Always First)

**Design reference:** `docs/TEST_CASE_GENERATION_DESIGN.md`; aligns with agent-idempotency + openclaw-agent-design. Run `../scripts/check_resume_testcase.sh <feature-id>` from `projects/feature-plan/<feature-id>/`.

1. **Accept target:** Get Feature ID and artifacts from user.
2. **Double confirm:** Double confirm requirements, raise questions if unclear. **ONLY proceed with user approval.**
3. **Working directory:** Ensure `projects/feature-plan/<feature-id>/`. Scripts use `../scripts/`.
4. **Run:** `../scripts/check_resume_testcase.sh <feature-id>`. Parse `REPORT_STATE`.
5. **Handle REPORT_STATE — STOP before any external call:**
   - **FINAL_EXISTS:** Display freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive before proceeding.
   - **DRAFT_EXISTS:** STOP. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate.
   - **CONTEXT_ONLY:** STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate.
   - **FRESH:** Proceed. Initialize `testcase_task.json`.
6. **Archive before overwrite:** If Smart Refresh or Full Regenerate chosen and specs exist, move to `archive/specs_<YYYYMMDD>/` first.
7. **Resume:** If script outputs `RESUMABLE` and `resume_from: <phase>`, skip to that phase.

**Initialize `testcase_task.json`** (for FRESH; include `phases`, `updated_at`, `written_count`/`total_count` per state machine):
```json
{
  "run_key": "<feature-id>:testcase",
  "overall_status": "in_progress",
  "current_phase": "read_qa_plan",
  "updated_at": "<ISO8601>",
  "phases": {
    "read_qa_plan": {"status":"pending"},
    "context_research": {"status":"pending"},
    "research_ambiguous": {"status":"pending"},
    "prerequisite_confirmation": {"status":"pending"},
    "markdown_generation": {"status":"pending", "written_count": 0, "total_count": null},
    "done": {"status":"pending"}
  },
  "data_fetched_at": null,
  "output_generated_at": null,
  "subtask_timestamps": {},
  "output_path": "specs/<domain>/<feature>",
  "archive_log": [],
  "notification_pending": null
}
```
*Set `phases.markdown_generation.total_count` during Phase 3 once spec filenames are confirmed.*

**Notify user:** _"⏳ Phase 0 complete. State: FRESH / DRAFT_EXISTS / FINAL_EXISTS / CONTEXT_ONLY. Proceeding to read QA plan and context artifacts."_

---

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

**Notify user:** _"⏳ Phase 1 complete. QA plan and N context artifacts read. Checking for ambiguous steps."_

---

### Phase 2 — Research Ambiguous Steps

**Never assume** UI interactions. If steps or flows are unclear after reading the QA plan:

| When | Tool | How |
|------|------|-----|
| UI flow or product behavior unclear | `tavily-search` | Search official docs, help center, user guides |
| Internal product config or selectors | `confluence` | `confluence search "<keyword>"` or `confluence read <page-id>` |
| OpenClaw-specific QA plan lookup | `clawddocs` | Look up existing plans or product docs in the OpenClaw knowledge base |
| Feature-specific context is in the QA plan | QA plan context files | Re-read `context/` artifacts (don't re-fetch unless Smart Refresh) |

Optional branch:
- If UI behavior remains ambiguous after docs/context review, use `playwright-test-planner` only as a discovery subagent and normalize findings back into canonical Markdown spec format.

**⛔ User Permission Gate (before any external call):**
If any `tavily-search` or `confluence` calls are needed, **pause and summarize** which steps are unclear and which tools will be used. Present to the user:
```
I plan to look up N unclear step(s) via <tool>:
  - "<unclear step or flow>"
  - ...
Proceed with research? (Y / Skip — generate from QA plan only)
```
Only call external tools after the user confirms. If the user skips, generate specs from existing QA plan context only and note any assumptions inline.

Update `testcase_task.json`: `current_phase: prerequisite_confirmation`.

**Notify user:** _"⏳ Phase 2 complete. Research done (or skipped — steps were clear). Moving to pre-requisite confirmation."_

---

### Phase 3 — Pre-requisite Confirmation (Interactive — BLOCKING)

**Do not write any spec files until the user explicitly approves all items below.**

Present a confirmation summary containing:

1. **Output path (mandatory — confirm first):**
   - Propose the `<domain>/<feature>` path derived from the QA plan and feature ID.
   - List all planned scenario file names.
   - Show the full resolved path.
   ```
   Proposed output path:
     specs/<domain>/<feature>/
     → N spec files: <scenario1>.md, <scenario2>.md, ...
     Full path: projects/feature-plan/<feature-id>/specs/<domain>/<feature>/

   Confirm path, or provide a different domain/feature name?
   ```
   If the user changes the path: update `testcase_task.json` → `output_path` before proceeding.

2. **Test objects:** Which pages, components, or flows to test? (derive from QA plan, confirm any gaps)
3. **User accounts:** Credentials, roles (admin/viewer/editor), or mock users needed?
4. **Environment:** Target URL (staging/prod), feature flags, config needed?
5. **Mock data:** API stubs, seed data, or test dataset required for idempotent runs?

**Wait hard here.** Do not proceed until the user explicitly approves.

**Notify user on approval:** _"✅ Phase 3 confirmed. Output path: `specs/<domain>/<feature>/`. Starting spec generation."_

---

### Phase 4 — Generate Markdown Specs

Update `testcase_task.json`: `current_phase: markdown_generation`.

**Use the `test-case-generator` skill** to synthesize steps from the QA plan and context artifacts.

**Generation rules:**

1. **One scenario file per feature flow** — prefer granular files (e.g., `authoringClear.md`, `authoringEditReport.md`) over a single large file. This reduces Healer scope on failure.
2. **Apply all test categories from QA plan:**
   - Positive (happy path): valid flows, expected outcomes
   - Negative (error paths): invalid input, access denied, missing data
   - Boundary: edge values (empty state, max items, min/max length)
   - Regression: prior defect scenarios from `qa_plan_defect_analysis_<id>.md`
3. **Every spec must include:**
   - `**Seed:** \`tests/seed.spec.ts\`` at the top
   - An `## Application Overview` section (1–2 sentences)
   - Steps written in semantic role/label/text style (see `test-case-generator` skill)
   - Explicit `**Expected Results:**` for every scenario
4. **Action verbs** (only these): `Click`, `Type`, `Fill`, `Select`, `Check`, `Uncheck`, `Press`, `Hover`, `Drag`, `Verify`, `Wait for`, `Navigate to`
5. **After writing each spec:** Update `testcase_task.json` → `subtask_timestamps["spec:<scenario>"]`, increment `phases.markdown_generation.written_count`. Notify user inline: _"📝 Written `<scenario>.md` (M of N)."_
6. **After all specs:** Set `output_generated_at`, `output_path`, `overall_status: completed`, `current_phase: done`. Set `phases.markdown_generation.total_count` at start of Phase 4 (from Phase 3 confirmed spec list).

**Spec format (canonical):**
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
```

---

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

If any specs were **skipped or partially written**, append:
```
⚠️ Partial generation: <M> of <N> specs written. Run again to resume.
```

**If Feishu fails:** Log to `testcase_task.json` → `notification_pending`. On the next run, retry before starting any phase.

#### 5.2 Tester Handoff (Option A — Preferred)

**⛔ Human approval gate (mandatory):**
Before notifying or invoking Tester, present:
```text
Proposed tester handoff:
  Feature: <FEATURE_ID>
  Path: workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/
  Files: <scenario1>.md, <scenario2>.md, ...
  Chain: playwright-test-generator -> playwright-test-healer

Proceed with tester handoff? (Y / No)
```

Pass the specs path to the Tester Agent (no file duplication):

- **Feature ID** (e.g. `BCIN-1234`)
- **Domain & feature** (e.g. `report-editor`, `report-undo-redo`)
- **Specs path:** `workspace-planner/projects/feature-plan/<feature-id>/specs/<domain>/<feature>/`
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
- `status: received`
- `read_path_ok: true|false`
- `detected_spec_count: <N>`
- `next_step: generation_started | blocked`

If `read_path_ok=false`, switch to Option B copy flow (or ask user to approve copy) before retrying handoff.

---

## Task File Reference

| Directory | Task File | Owned by |
|-----------|-----------|----------|
| `projects/feature-plan/<feature-id>/` | `task.json` | `feature-qa-planning` workflow |
| `projects/feature-plan/<feature-id>/` | `testcase_task.json` | This workflow |
| `projects/testcase-plan/<feature-id>/` | `task.json` | Standalone (no feature-plan) |

**Error recovery:** If `testcase_task.json` is missing but spec files exist, reconstruct state by counting `.md` files and checking `qa_plan_final.md` modification time. Present as `DRAFT_EXISTS` or `FINAL_EXISTS`. Prompt: _"Task file missing. Found N spec files. QA plan last modified X days ago. Resume from inferred state or restart?"_

---

## Skills Used

| Skill | When to use |
|-------|-------------|
| `test-case-generator` | Step synthesis during Markdown generation |
| `feishu` | Send completion DM and per-phase progress notifications |
| `clawddocs` | Look up OpenClaw-specific QA plans or product docs |
| `tavily-search` | Research UI flows or official docs when steps are unclear |
| `confluence` | Read internal product docs and selector references |
| `docs-organization-governance` | Apply when creating or placing new doc locations |
| `agent-idempotency` | Archive, cache reuse, and state management rules |

---

## References

- [TEST_CASE_GENERATION_DESIGN.md](../docs/TEST_CASE_GENERATION_DESIGN.md) — Full design specification for this workflow
- [feature-qa-planning.md](feature-qa-planning.md) — Upstream workflow (creates `qa_plan_final.md`)
- [test-case-generator skill](../skills/test-case-generator/SKILL.md) — Core step synthesis skill
- [TESTER_AGENT_DESIGN.md](../../workspace-tester/docs/TESTER_AGENT_DESIGN.md) — Tester layout, seed.spec.ts, Generator/Healer flow
