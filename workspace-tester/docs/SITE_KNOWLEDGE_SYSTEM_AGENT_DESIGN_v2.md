# Site Knowledge System — Agent-Side Design (v2)

> **Design ID:** `site-knowledge-agent-v2`
> **Date:** 2026-03-04
> **Status:** Draft — TDD Phase
> **Parent Design:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
> **Scope:** How the Tester Agent searches site knowledge and propagates context at test-run time.
>
> **⚠️ Constraint:** This document is in TDD design phase.
> Implementation code MUST NOT be written until the design is approved.

---

## 1. Site Knowledge Search Design

### 1.1 Overview

This section describes the **agent-side** of the Site Knowledge System — how the Tester Agent **searches** the pre-generated `memory/site-knowledge/` files at runtime and propagates context to sub-agents (Planner, Generator, Healer).

The generation side (how the files are produced) is covered in the parent design:
[SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md).

**Search Strategy: qmd BM25 + OpenClaw memorySearch**

The agent uses **two search backends** (use one or both):

1. **qmd search** — BM25 keyword search only (`qmd search`). Fast, no embeddings required.
2. **OpenClaw memorySearch** — Semantic search (vector + keyword hybrid) when running inside OpenClaw.

**qmd uses only `qmd search`** — no `qmd vsearch`, no `qmd query`, no `qmd embed`. BM25 works without model downloads.

---

### 1.2 Workflow

```
Phase 0.5 [Site Knowledge Search]:
  1. Determine affected domain from:
       - QA plan / issue labels (Core Workflow)
       - tester_handoff.json: affected_domains (Single-Issue FC Flow — from single-defect-analysis workflow)
  2. Derive search keywords from:
       - Issue summary + description
       - Domain labels (filter, autoAnswers, aibot)
       - Component names from testing plan / QA spec
  3. Search site knowledge (BOTH methods when available):
       - qmd:  qmd search "keyword" -c site-knowledge --json -n 10
       - OpenClaw: memory_search tool (when available)
  4. Store resolved content into run context:
       projects/test-cases/<key>/site-context.md
```

---

### 1.3 Domains

**Domains** are derived from:

| Source | How domains are obtained |
|--------|--------------------------|
| **Defect-test** | `tester_handoff.json` → `affected_domains` (Reporter infers from PR diff file paths) |
| **Feature-test** | QA plan domain labels, component names |

**Canonical domain list:** `filter`, `autoAnswers`, `aibot`, `other` (catch-all from Reporter).

---

### 1.4 Skills

#### site-knowledge-search Skill (to create)

**Path:** `workspace-tester/skills/site-knowledge-search/SKILL.md`

**Purpose:** Encapsulate qmd + memory_search. Outputs `site_context.md` Mainly used in feature-test and defect-test workflows.

**Inputs:**
- `key` — string (e.g., `BCIN-1234`)
- `keywords` — string or string[] (derived from issue summary, domain labels, component names)
- `domains` — string[] (e.g., `["filter", "autoAnswers", "aibot"]`)

**Output:**
- `site_context.md` — resolved content with relevant component sections, CSS locator hints, sample worklows.


**Detailed document to create:** `workspace-tester/skills/site-knowledge-search/SKILL.md`

| Section | Content |
|---------|---------|
| **Name** | `site-knowledge-search` |
| **Description** | Search site knowledge (locators, UI components, sample workflows). **Must** look up `memory/site-knowledge/SITEMAP.md` to find the index, then run OpenClaw `memory_search` — in addition to qmd BM25 search. |
| **When to use** | MANDATORY before every test execution (feature-test Phase 2, defect-test Phase 1.5b). |
| **Inputs** | keywords, domains, key |
| **Search flow** | 1. L ook up `memory/site-knowledge/SITEMAP.md` to find the index; 2. Run OpenClaw `memory_search` . 3. Run qmd BM25 search. `qmd search "<keyword>" -c site-knowledge --json -n 10`|
| **Output** | `<workspace-folder>/projects/test-cases/<key>/site_context.md` |
| **Keyword derivation** | From issue summary, affected_domains, QA plan component names |
| **Error handling** | If qmd not installed: log warning, use memory_search only. If both fail: document in site_context.md, continue with empty context. |

**AGENTS.md integration:** After creating this skill, add to `workspace-tester/AGENTS.md` under "Skills Reference" or "Site Knowledge Search":

```markdown
### site-knowledge-search
- Read skill doc: `workspace-tester/skills/site-knowledge-search/SKILL.md`
- Use for searching WDIO page objects, locators, UI components before test execution
- MANDATORY: Run on every test execution (feature-test and defect-test workflows)
```

---

### 1.5 Environment Setup and Configuration

#### qmd Setup (BM25 Only)

| Requirement | Details |
|-------------|---------|
| **Runtime** | Node.js >= 22 (prefer Node over Bun on macOS — see [qmd#184](https://github.com/tobi/qmd/issues/184)) |
| **Storage** | Index only (~tens of MB); no model download for BM25 |
| **macOS** | `brew install sqlite` (for FTS5 extensions) |

**Environment variables (optional, Mac Intel):**

```bash
export NODE_LLAMA_CPP_CMAKE_OPTION_GGML_CUDA=OFF
```

**Install and configure:**

```bash
# Install qmd globally
npm install -g @tobilu/qmd

# Add site-knowledge as a collection (run from workspace-tester root)
qmd collection add memory/site-knowledge --name site-knowledge --mask "**/*.md"

# BM25 index is built automatically; no qmd embed needed
```

**Search command (BM25 only):**

```bash
qmd search "CalendarFilter" -c site-knowledge --json -n 10
```

#### OpenClaw memorySearch Setup

When the Tester Agent runs inside OpenClaw, add `memory/site-knowledge` to the watched paths.

**Minimal config:**

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "extraPaths": ["memory/site-knowledge"],
        "sync": { "watch": true }
      }
    }
  }
}
```

---

### 1.6 Test Suggestions

| Test | Purpose |
|------|---------|
| **Playground smoke** | Run `node tools/sitemap-generator/playground/run.mjs` → verify `qmd search "CalendarFilter" -c site-knowledge --json -n 5` returns results |
| **Keyword derivation** | Given issue summary + affected_domains, verify derived keywords match expected (filter, CalendarFilter, etc.) |
| **site_context.md output** | Run search → verify output contains relevant component sections, locator hints |
| **test memory search** | in openclaw, ask related questions to verify memory search is working |

---

## 2. Feature Test Workflow

### 2.1 Overview

**Path:** `workspace-tester/.agents/workflows/feature-test.md`

**Trigger:** Feature test invocation (issue key or QA plan path). QA plan may or may not exist.

**Invocation:** User command or master agent handoff with issue key or QA plan path.

**Plan-Path**: defaults to `workspace-planner/projects/test-plans/<issue-key>/qa-plan-fianl.md` [to update to Agents.md]

**QA Plan Missing Handling:** If it is a feature test and no QA plan is found at `projects/test-plans/<issue-key>/test-plan.md` or the provided path:
1. **Notify user** — "No QA plan found for <issue-key>. A QA plan is required to run feature tests."
2. **Offer option** — "Invoke playwright-test-planner to create a QA plan? (Y/N)"
3. **If approved** — use `sessions_spawn` to invoke `playwright-test-planner` agent. Wait for completion (see §2.2.1). Update `task.json` with `plan_path`, `planner_invoked: true`, `planner_spawned_at`.
4. **If not approved** — Stop. Do not proceed to Phase 2.

**Output:**
- `projects/test-cases/<key>/reports/execution-summary.md`
- `projects/test-cases/<key>/screenshots/<step>.png`
- Handoff to qa-report (issue summaries, evidence paths)

**Source:** `[extract to feature-test workflow]` in AGENTS.md — Core Workflow: Test Execution.

---

### 2.2 Workflow Phases

| Phase | Action | Artifacts |
|-------|--------|-----------|
| **0. Init + QA Plan Check** | Create `projects/test-cases/<key>/task.json` (see §2.5). Resolve plan path from input (explicit path or `projects/test-plans/<issue-key>/test-plan.md`). **If plan found:** set `plan_path`, `overall_status: plan_ready`. **If plan not found:** (1) Notify user: "No QA plan found for <issue-key>. A QA plan is required." (2) Offer: "Invoke planner agent to create a QA plan? (Y/N)" (3) If Y: `sessions_spawn` planner (§2.2.1); wait for announce; set `plan_path`, `planner_invoked: true`, `planner_spawned_at`. (4) If N: stop. Update `task.json` after each change. | `task.json` |
| **1. Load QA Plan** | Read test plan from `plan_path` in task.json. Extract issue key, test cases, prerequisites, test data. Verify environment availability. Update `task.json.updated_at`. | `task.json` |
| **2. Site Knowledge Search** | **MANDATORY.** Invoke **site-knowledge-search** skill. Derive keywords from QA plan, domain labels, component names. Save to `projects/test-cases/<key>/site_context.md`. Update `task.json` with `site_context_path`, `overall_status: testing`. | `site_context.md`, `task.json` |
| **3. Execute Tests** | **Read `site_context_path` from task.json before each test case.** Use Playwright MCP via mcporter skills. For each test case, if fails to execute, reference `site_context.md` for locators, take screenshots, record PASS/FAIL. If unclear, re-run site knowledge search; if still insufficient, use tavily/confluence search, and append to `site_context.md`. | `screenshots/<step>.png`, run state |
| **4. Document Results** | Invoke **test-report skill** to produce execution report. Organize screenshots by test case. Update `task.json` with `result`, `evidence_path`, `test_completed_at`, `overall_status: test_complete`. | `reports/execution-summary.md`, `task.json` |
| **5. Notify User** | Send summary via Feishu (chat-id from TOOLS.md). Set `overall_status: completed`. | Feishu message |

#### 2.2.1 sessions_spawn for Sub-Agent (playwright-test-planner)

Per [Clawdbot Sub-Agents docs](https://docs.clawd.bot/tools/subagents), use the `sessions_spawn` tool:

| Parameter | Value |
|-----------|-------|
| `task` | Required. Task string instructing the planner to create a QA plan for `<issue-key>`. Example: "Create a QA test plan for Jira issue BCIN-1234. Output to `projects/test-plans/BCIN-1234/test-plan.md`. Invoke playwright-test-planner workflow." |
| `agentId` | `planner`|
| `label` | Optional. e.g. `"planner-bcin-1234"` |
| `runTimeoutSeconds` | Optional. Default from `agents.defaults.subagents.runTimeoutSeconds`; recommend 900 for planner. |

**Behavior:** `sessions_spawn` is non-blocking; it returns `{ status: "accepted", runId, childSessionKey }` immediately. The sub-agent runs in background; on completion it **announces** a result back to the requester chat. The Tester Agent must **wait for the announce** (poll `/subagents info <runId>` or rely on channel delivery) before reading `plan_path` and proceeding to Phase 1.

**ACP harness (Codex, Cursor, Gemini CLI):** Use `sessions_spawn` with `runtime: "acp"` per [ACP Agents](https://docs.clawd.bot/tools/acp-agents).

#### 2.2.2 task.json Update Rules

| When | Fields to Update |
|------|-------------------|
| Phase 0 start | `mode`, `issue_key`, `overall_status`, `created_at`, `updated_at` |
| Plan resolved | `plan_path`, `overall_status: plan_ready` |
| Planner spawned | `plan_path`, `planner_invoked: true`, `planner_spawned_at` (ISO8601), `updated_at` |
| Phase 2 done | `site_context_path`, `overall_status: testing`, `updated_at` |
| Phase 4 done | `result`, `evidence_path`, `test_completed_at`, `overall_status: test_complete`, `updated_at` |
| Phase 6 done | `overall_status: completed`, `updated_at` |

**Rule:** Always set `updated_at` to current ISO8601 on any write. Use atomic write (write to temp file, then rename) to avoid corruption on interrupt.

#### 2.2.3 Task Resume

Before Phase 0, run `workspace-tester/scripts/check_resume.sh <key>` (see §5 Files to Create). It emits `TASK_STATE` and resume guidance.

| `task.json.overall_status` | Action |
|----------------------------|--------|
| absent or `plan_check` | Proceed with Phase 0 |
| `plan_ready` | Skip to Phase 1 |
| `testing` | Resume from Phase 3 (re-read `site_context_path` from task.json) |
| `test_complete` | **STOP.** Present existing report; offer: Use Existing / Re-run |
| `completed` | **STOP.** Present existing report. |

**Idempotency:** If `test_complete` or `completed`, present existing report; ask user to re-run or use existing.

---

### 2.3 Skills

| Skill | Phase | Purpose |
|-------|-------|---------|
| **site-knowledge-search** | 2 | Search workflows, locators, UI components; save site_context.md |
| **test-report** | 4 | Format execution report |
| **mcporter** (mcporter) | 3 | invoke playwright MCP |
| **Feishu** | 6 | Notify user |

---

### 2.4 Use Example

**With QA plan present:**
```
User: "Run feature tests for BCIN-1234."

Agent:
  0. Init task.json, resolve plan_path → found. plan_ready.
  1. Load QA plan → extract issue key BCIN-1234, test cases, domains (filter, autoAnswers)
  2. site-knowledge-search keywords="CalendarFilter filter autoAnswers" domains=["filter","autoAnswers"] output_path="projects/test-cases/BCIN-1234/site_context.md"
  3. Execute each TC via Playwright MCP, reference site_context.md for locators
  4. test-report → execution-summary.md
  5. Handoff to qa-report (2 failures)
  6. Feishu: "Feature test complete for BCIN-1234. 8 passed, 2 failed. Report: ..."
```

**With QA plan missing (planner invoked):**
```
User: "Run feature tests for BCIN-1234"

Agent:
  0. Init task.json, resolve plan_path → not found. Notify: "No QA plan found. Invoke playwright-test-planner? (Y/N)"
  User: Y
  0. sessions_spawn playwright-test-planner (§2.2.1) → plan at projects/test-plans/BCIN-1234/test-plan.md. Update task.json: planner_invoked=true, planner_spawned_at.
  1. Load QA plan → ...
  (Phases 2–6 as above)
```

---

### 2.5 task.json Schema (Feature-Test Mode)

The workflow **registers** run state in `projects/test-cases/<key>/task.json`. Path: `workspace-tester/projects/test-cases/<key>/task.json`.

**Example (minimal):**

```json
{
  "run_key": "BCIN-1234",
  "mode": "feature_test",
  "overall_status": "plan_ready",
  "issue_key": "BCIN-1234",
  "plan_path": "projects/test-plans/BCIN-1234/test-plan.md",
  "planner_invoked": false,
  "planner_spawned_at": null,
  "site_context_path": "projects/test-cases/BCIN-1234/site_context.md",
  "result": null,
  "evidence_path": null,
  "test_completed_at": null,
  "created_at": "2026-03-04T10:00:00Z",
  "updated_at": "2026-03-04T10:05:00Z"
}
```

**Example (after planner invoked):**

```json
{
  "run_key": "BCIN-1234",
  "mode": "feature_test",
  "overall_status": "plan_ready",
  "issue_key": "BCIN-1234",
  "plan_path": "projects/test-plans/BCIN-1234/test-plan.md",
  "planner_invoked": true,
  "planner_spawned_at": "2026-03-04T10:02:00Z",
  "site_context_path": "projects/test-cases/BCIN-1234/site_context.md",
  "result": null,
  "evidence_path": null,
  "test_completed_at": null,
  "created_at": "2026-03-04T10:00:00Z",
  "updated_at": "2026-03-04T10:03:00Z"
}
```

**Example (completed):**

```json
{
  "run_key": "BCIN-1234",
  "mode": "feature_test",
  "overall_status": "completed",
  "issue_key": "BCIN-1234",
  "plan_path": "projects/test-plans/BCIN-1234/test-plan.md",
  "planner_invoked": false,
  "planner_spawned_at": null,
  "site_context_path": "projects/test-cases/BCIN-1234/site_context.md",
  "result": "PASS",
  "evidence_path": "projects/test-cases/BCIN-1234/reports/",
  "test_completed_at": "2026-03-04T11:30:00Z",
  "created_at": "2026-03-04T10:00:00Z",
  "updated_at": "2026-03-04T11:31:00Z"
}
```

| Field | Type | When Set | Purpose |
|-------|------|----------|---------|
| `run_key` | string | Phase 0 | Same as `issue_key` for feature-test |
| `mode` | string | Phase 0 | `"feature_test"` |
| `overall_status` | string | Phase 0–6 | `plan_check` \| `plan_ready` \| `testing` \| `test_complete` \| `completed` — drives resume |
| `issue_key` | string | Phase 0 | Jira issue key |
| `plan_path` | string | Phase 0–1 | Resolved QA plan path |
| `planner_invoked` | boolean | Phase 0 | True if planner was spawned due to missing plan |
| `planner_spawned_at` | string \| null | Phase 0 | ISO8601 when planner invoked |
| `site_context_path` | string | Phase 2 | Path to site_context.md |
| `result` | string \| null | Phase 4–6 | `PASS` \| `FAIL` \| null |
| `evidence_path` | string \| null | Phase 4–6 | Path to reports/ |
| `test_completed_at` | string \| null | Phase 4–6 | ISO8601 |
| `created_at` | string | Phase 0 | ISO8601 |
| `updated_at` | string | Every write | ISO8601 — must update on any change |

---

### 2.6 test-report Skill (to create)

**Path:** `workspace-tester/skills/test-report/SKILL.md`

**Purpose:** Format test execution results into a standardized report. When failures occur, document bugs via **bug-report-formatter** and optionally log to Jira after user confirmation.

**Inputs:**
- `key` — string (e.g., `BCIN-1234`)
- `result` — object with per-test-case outcomes (PASS/FAIL), screenshots paths, expected vs actual
- `evidence_path` — string (path to `reports/` and `screenshots/`)

**Output:**
- `projects/test-cases/<key>/reports/execution-summary.md` — structured execution report

**Output format (enhanced):**

```markdown
# Test Execution Report: [Issue Key]

**Date:** YYYY-MM-DD
**Tester:** Atlas Tester (automated)
**Test Plan:** [plan_path]
**Environment:** Staging/Production

## Summary
- **Total Test Cases:** N
- **Passed:** N
- **Failed:** N
- **Blocked:** N
- **Overall Result:** PASS | FAIL

## Test Results

### TC-01: [Test Case Name] ✅ PASS
**Actual Result:** [brief]
**Screenshot:** [path]
**Notes:** [optional]

### TC-02: [Test Case Name] ❌ FAIL
**Expected:** [expected]
**Actual:** [actual]
**Screenshot:** [path]
**Console Log:** [path if captured]
**Notes:** [optional]
```

**Bug handling flow:**

| Step | Action |
|------|--------|
| 1 | If any test case **FAIL**, invoke **bug-report-formatter** skill to produce a standardized bug document per failure |
| 2 | **Confirm with user:** "Bug(s) detected. Log to Jira? (Y/N)" — do NOT auto-log without confirmation |
| 3 | If user confirms (Y): use **jira-cli** skill to create Jira issue(s) from the bug report(s) |
| 4 | If user declines (N): leave bug documented in execution-summary.md only; do not create Jira tickets |

**Skill references (add to SKILL.md):**
- **bug-report-formatter** — Use when documenting FAIL cases. Read `workspace/skills/bug-report-formatter/SKILL.md`
- **jira-cli** — Use only after user confirms logging. Read `workspace/skills/jira-cli/SKILL.md`

**AGENTS.md integration:** Add to Skills Reference:

```markdown
### test-report
- Read skill doc: `workspace-tester/skills/test-report/SKILL.md`
- Use for formatting execution reports after test runs
- On FAIL: use bug-report-formatter to document; confirm with user before logging to Jira; if confirmed, use jira-cli
- See design: [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md) §2.6
```

---

## 3. Single Defect Test Workflow

### 3.1 Overview

**Path:** `workspace-tester/.agents/workflows/defect-test.md`

**Trigger:** Single Jira issue key/URL (e.g., `BCIN-7890`) **without** pre-existing QA plan.

**Invocation:** User command or master agent handoff with issue key.

**Output:**
- `projects/test-cases/<ISSUE_KEY>/reports/execution-summary.md`
- `projects/test-cases/<ISSUE_KEY>/screenshots/<step>.png`
- send report (PASS/FAIL + evidence)

**Source:** `[extract to issue-test workflow]` in AGENTS.md — Single-Issue FC Flow.

**Integration:** Delegates to Reporter's `single-defect-analysis.md` (Phases 1–6). Reporter produces testing plan; Tester executes; Tester calls back for Phase 7 (Test Outcome Handling).

---

### 3.2 Workflow Phases

| Phase | Action | Artifacts |
|-------|--------|-----------|
| **0. Spawn Reporter** | Check idempotency: `workspace-planner/projects/test-cases/<ISSUE_KEY>/task.json`. If `testing_plan` exists → skip to Phase 1.5. Else: `sessions_spawn` Reporter with `single-defect-analysis` workflow (see [Clawdbot Sub-Agents](https://docs.clawd.bot/tools/subagents)). Save `overall_status: waiting_for_reporter`. Wait for `tester_handoff.json` + `_TESTING_PLAN.md`. | `task.json` |
| **1.5. Read Testing Plan** | Read `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>-testing-plan.md` and `tester_handoff.json`. | — |
| **1.5b. Site Knowledge Search** | **MANDATORY.** Invoke **site-knowledge-search** skill. Keywords from issue summary + `affected_domains` in handoff. Save to `projects/test-cases/<ISSUE_KEY>/site_context.md`. Update `task.json` with `site_context_path`. | `site_context.md`, `task.json` |
| **2.5. Execute FC Steps** | **Read `site_context_path` from task.json before execution.** For each FC step: execute in browser (Playwright MCP / playwright-cli / browser), reference `site_context.md`, screenshot, record PASS/FAIL. If `exploratory_required`: follow Exploratory Charter. | `screenshots/`, execution log |
| **3.5. Report Outcome** | Invoke **test-report skill** for execution summary. Update `task.json` with `result`, `evidence_path`. `sessions_spawn` Reporter with PASS/FAIL + evidence paths. | `execution-summary.md`, Reporter callback |
| **5. Notify User** | Send summary via Feishu (chat-id from TOOLS.md). Set `overall_status: completed`. | Feishu message |

---

### 3.3 Skills

| Skill | Phase | Purpose |
|-------|-------|---------|
| **site-knowledge-search** | 1.5b | Search WDIO page objects; save site_context.md |
| **test-report** | 3.5 | Format execution report |
| **playwright MCP** (mcporter) | 2.5 | Browser automation |

---

### 3.4 Use Example

```
User: "FC BCIN-7890"

Agent:
  0. Check task.json → fresh. sessions_spawn Reporter with single-defect-analysis.
     Reporter produces tester_handoff.json + BCIN-7890_TESTING_PLAN.md
  1.5. Read testing plan, handoff (affected_domains: ["filter"])
  1.5b. site-knowledge-search keywords="<from issue summary> filter" domains=["filter"] output_path="projects/test-cases/BCIN-7890/site_context.md"
  2.5. Execute FC-01, FC-02, FC-03 via Playwright MCP, reference site_context.md
  3.5. test-report → execution-summary.md. sessions_spawn Reporter: "PASS, evidence at ..."
  Reporter Phase 7: Confirm with user → close Jira + add comment
```

---

## 4. AGENTS.md and MEMORY.md Updates

### 4.1 AGENTS.md — Site Knowledge Search section

**Location:** [workspace-tester/AGENTS.md](../AGENTS.md), before "Tools" section.

**Content (applied):**

```markdown
## Site Knowledge Search

Site knowledge (workflow, locators, UI components) lives in `memory/site-knowledge/`.

**Search methods:**
- **qmd (BM25):** `qmd search "keyword" -c site-knowledge --json -n 10`
- **OpenClaw:** Use `memory_search` tool when running in OpenClaw. Need to look up `memory/site-knowledge/SITEMAP.md` to find the index. then run `memory_search` with the index.

**Skill:** Use `site-knowledge-search` skill — see `skills/site-knowledge-search/SKILL.md`.

```

**Skills Reference:**

```markdown
### site-knowledge-search
- Read skill doc: `workspace-tester/skills/site-knowledge-search/SKILL.md`
- MANDATORY: Run on every test execution (feature-test and defect-test workflows)
- See design: [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md) §1.4

### test-report
- Read skill doc: `workspace-tester/skills/test-report/SKILL.md`
- Use for formatting execution reports after test runs
- On FAIL: use bug-report-formatter to document; confirm with user before logging to Jira; if confirmed, use jira-cli
- See design: [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md) §2.6
```


---

## 5. Files to Create or Update

| File | Action | Purpose |
|------|--------|---------|
| `workspace-tester/skills/site-knowledge-search/SKILL.md` | Create | Site knowledge search skill (detailed spec in §1.4) |
| `workspace-tester/AGENTS.md` | Update | Add site-knowledge-search to Skills Reference; note skill in Site Knowledge Search section |
| `workspace-tester/MEMORY.md` | No change | Do NOT add Site Knowledge Search Activity — would bloat MEMORY.md |
| `workspace-tester/.agents/workflows/feature-test.md` | Create | Feature test workflow |
| `workspace-tester/.agents/workflows/defect-test.md` | Create | Single defect test workflow |
| `workspace-tester/skills/test-report/SKILL.md` | Create | Test execution report skill; on FAIL use bug-report-formatter; confirm with user before Jira log; if confirmed use jira-cli (§2.6) |
| `workspace-tester/scripts/check_resume.sh` | Create | Feature-test resume check; emits TASK_STATE (see §5.1) |
| `workspace-tester/projects/test-cases/.gitkeep` | Create | Ensure directory exists for task.json artifacts |
| OpenClaw config | Update | Add memorySearch.extraPaths |

### 5.1 check_resume.sh (Feature-Test)

**Path:** `workspace-tester/scripts/check_resume.sh`

**Usage:** `./scripts/check_resume.sh <issue-key>`

**Purpose:** Phase 0 idempotency check for feature-test workflow. Reads `projects/test-cases/<key>/task.json` and emits:

| Output | Meaning |
|--------|---------|
| `TASK_STATE=FRESH` | No task.json; proceed with Phase 0 |
| `TASK_STATE=PLAN_READY` | `overall_status: plan_ready`; skip to Phase 1 |
| `TASK_STATE=TESTING` | `overall_status: testing`; resume from Phase 3 |
| `TASK_STATE=TEST_COMPLETE` | `overall_status: test_complete`; present report, offer re-run |
| `TASK_STATE=COMPLETED` | `overall_status: completed`; present report |

**Exit codes:** 0 = success; 1 = error reading task file.

**Reference:** Similar to `workspace-reporter/scripts/check_resume.sh` but scoped to feature-test `task.json` schema (§2.5).

---

## 6. Implementation Roadmap

| Step | Task | Priority | Status |
|------|------|----------|--------|
| 1 | Create site-knowledge-search skill (SKILL.md) | **P1** | Pending |
| 2 | Update AGENTS.md with site-knowledge-search skill reference | **P1** | Pending |
| 3 | Add Site Knowledge Search section to AGENTS.md (with skill ref) | **P1** | Done |
| 4 | Do NOT add MEMORY.md update (avoids bloat) | **P1** | Done |
| 5 | Wire Phase 0.5 to use site-knowledge-search skill | **P2** | Pending |
| 6 | Create feature-test workflow | **P2** | Pending |
| 7 | Create defect-test workflow | **P2** | Pending |
| 8 | Create test-report skill | **P2** | Pending |
| 9 | Create scripts/check_resume.sh for feature-test | **P2** | Pending |
| 10 | Shorten AGENTS.md to scenario → workflow routing | **P3** | Pending |

---

## 7. Appendix: Playground and README

### 7.1 Playground

**Purpose:** Validate `generate-sitemap.mjs` output and smoke-test `qmd search` before integrating with the Tester Agent.

**Location:** `workspace-tester/tools/sitemap-generator/playground/`

**Usage:**

```bash
node tools/sitemap-generator/playground/run.mjs
node tools/sitemap-generator/playground/run.mjs --repo /path/to/wdio-repo --domains filter,autoAnswers,aibot
qmd search "CalendarFilter" -c site-knowledge --json -n 5
```

### 7.2 User-facing README

**Location:** `workspace-tester/tools/sitemap-generator/README.md`

**Required sections:** Overview, Quick Start, CLI Reference, Output Format, qmd Setup, Adding a New Domain, Running Tests, Playground, Troubleshooting.

See original [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md) §9 for full README template.

---

## 8. References

- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) — Generation pipeline (TDD stubs + tests)
- [single-defect-analysis.md](../../workspace-reporter/.agents/workflows/single-defect-analysis.md) — Workflow format reference
- [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md) — Original design (Issue-only FC Flow, sessions_spawn protocol)
- [Clawdbot Sub-Agents](https://docs.clawd.bot/tools/subagents) — sessions_spawn tool, announce, ACP harness
- [qmd GitHub](https://github.com/tobi/qmd) — BM25 search CLI
- [OpenClaw memory docs](https://openclaw.im/docs/concepts/memory) — memorySearch config
- [agent-idempotency skill](../../workspace-planner/skills/agent-idempotency/SKILL.md) — Idempotency patterns
