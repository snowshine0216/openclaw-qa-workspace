# Site Knowledge System — Agent-Side Design

> **Note:** A reorganized version with site-knowledge-search skill design is in [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](./SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md).

> **Design ID:** `site-knowledge-agent-v1`
> **Date:** 2026-03-04
> **Status:** Draft — TDD Phase
> **Parent Design:** [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md)
> **Scope:** How the Tester Agent searches site knowledge and propagates context at test-run time.
>
> **⚠️ Constraint:** This document is in TDD design phase.
> Implementation code MUST NOT be written until the design is approved.

---

## 1. Overview

This document describes the **agent-side** of the Site Knowledge System — how the Tester Agent
**searches** the pre-generated `memory/site-knowledge/` files at runtime and propagates context to
sub-agents (Planner, Generator, Healer).

The generation side (how the files are produced) is covered in the parent design:
[SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md).

### 1.1 Search Strategy: qmd BM25 + OpenClaw memorySearch

The agent uses **two search backends** (use one or both):

1. **qmd search** — BM25 keyword search only (`qmd search`). Fast, no embeddings required.
2. **OpenClaw memorySearch** — Semantic search (vector + keyword hybrid) when running inside OpenClaw.

**qmd uses only `qmd search`** — no `qmd vsearch`, no `qmd query`, no `qmd embed`. BM25 works without model downloads.

---

## 2. Pre-fetch Flow

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
       projects/test-case/<key>/site-context.md
  5. Sub-agents (planner / generator / healer) use Playwright MCP with mcporter skills
       to do testing based on QA plan + site message (no direct read of site-context.md)
  6. Update AGENTS.md / MEMORY.md with search activity (see Section 4)

Integration with Single-Issue FC Flow (see §5.6):
  - Reporter runs single-defect-analysis workflow → produces tester_handoff.json
  - Search runs in Phase 1.5 (after reading tester_handoff.json)
  - Keywords derived from: issue summary + affected_domains field
  - Site message (from projects/test-case/<key>/site-context.md) provided to Phase 2.5;
    sub-agents use Playwright MCP + mcporter for testing (QA plan + site message)
```

---

## 3. Environment Setup and Configuration

### 3.1 qmd Setup (BM25 Only)

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

### 3.2 OpenClaw memorySearch Setup

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

**With OpenRouter embeddings:**

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "extraPaths": ["memory/site-knowledge"],
        "provider": "openai",
        "model": "openai/text-embedding-3-small",
        "remote": {
          "baseUrl": "https://openrouter.ai/api/v1/",
          "apiKey": "${OPENROUTER_API_KEY}"
        },
        "sync": { "watch": true },
        "query": { "maxResults": 8, "hybrid": { "enabled": true } },
        "cache": { "enabled": true, "maxEntries": 50000 }
      }
    }
  }
}
```

---

## 4. AGENTS.md and MEMORY.md Updates (Applied)

When the agent performs site knowledge search, it **must update** MEMORY.md with useful patterns found. AGENTS.md already contains the Site Knowledge Search section; MEMORY.md already defines the entry format.

### 4.1 AGENTS.md — Site Knowledge Search section (applied)

**Location:** [workspace-tester/AGENTS.md](../AGENTS.md), before "Tools" section.

**Content:**

```markdown
## Site Knowledge Search

Site knowledge (WDIO page objects, locators, UI components) lives in `memory/site-knowledge/`.

**Search methods:**
- **qmd (BM25):** `qmd search "keyword" -c site-knowledge --json -n 10`
- **OpenClaw:** Use `memory_search` tool when running in OpenClaw

**After search:** Update MEMORY.md with useful patterns (locators, component names) found.

See [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN.md).
```

### 4.2 MEMORY.md — Site Knowledge Search Activity section (applied)

**Location:** [workspace-tester/MEMORY.md](../MEMORY.md), before "Lessons Learned".

**Content:**

```markdown
## Site Knowledge Search Activity

When site knowledge search yields useful results, append entries:

- [YYYY-MM-DD] Site search: "<query>" → <file>: <key findings>
```

**Example:** `- [2026-03-04] Site search: "CalendarFilter" → filter.md: calendarFilterPanel, dateRangePicker`

### 4.3 Update rules

| When | Update |
|------|--------|
| Search returns useful locators/patterns | Append to MEMORY.md (one-line summary) |
| New domain or component discovered | Add to MEMORY.md for future reference |

---

## 5. Issue-only FC Flow — Reporter-Delegated Design

### 5.1 Overview

When the user provides only a **Jira issue key** (e.g., `BCIN-7890`) and no pre-existing QA plan exists, the Tester Agent **always delegates to the Reporter Agent** running the **single-defect-analysis** workflow for defect analysis.

> **Design change from v1:** The Tester no longer self-assesses FC risk or routes independently. All single-issue inputs go through the Reporter running `single-defect-analysis.md`, which produces a structured testing plan with FC steps and exploratory test charters. The Tester executes from this plan.

```
User: "FC BCIN-7890" (issue key, no QA plan)
       ↓
[Phase 0] Tester: Check idempotency (task.json)
       ↓ state = fresh or waiting_for_reporter
[Phase 0] Tester: session_spawn → Reporter Agent
          context = "single-issue testing plan for BCIN-7890"
       ↓
Reporter Agent (workspace-reporter) runs single-defect-analysis.md:
  Phase 1 Detect single-issue mode
  Phase 2 Fetch Jira issue + details
  Phase 3 Fetch fix PR diff (if linked)
  Phase 4 FC Risk Assessment (score-based)
  Phase 5 Generate TESTING_PLAN.md
            (FC steps + optional exploratory charter)
  Phase 6 Notify Tester → tester_handoff.json
       ↓
[Phase 1.5] Tester: Read testing plan from reporter workspace
            Run site knowledge search (qmd + memory_search)
            Save results → site_context.md
       ↓
[Phase 2.5] Tester: Execute FC steps + exploratory tests
            Use site_context.md for UI navigation
            Save screenshots + execution-summary.md
       ↓
[Phase 3.5] Tester: session_spawn → Reporter Agent (outcome callback)
            context = "Result: PASS/FAIL + evidence paths"
       ↓
Reporter Agent:
  Phase 7: Test Outcome Handling
         PASS → confirm with user → close Jira issue + add comment
         FAIL → confirm with user → add comment OR file new defect
```

### 5.2 Key Responsibilities by Agent

| Step | Agent | Action |
|------|-------|--------|
| Issue input detected | **Tester** | Check idempotency → spawn Reporter |
| Single-issue analysis | **Reporter** | Runs `single-defect-analysis.md` workflow |
| Jira issue fetch | **Reporter** | `jira issue view` via jira-cli skill |
| PR diff fetch | **Reporter** | `gh pr view/diff` via github skill |
| FC risk scoring | **Reporter** | Rule-based scoring table (Phase -1.4) |
| Testing plan generation | **Reporter** | FC steps + exploratory charter |
| Tester notification | **Reporter** | `tester_handoff.json` written |
| Site knowledge search | **Tester** | `qmd search` + `memory_search` |
| Test execution | **Tester** | Playwright MCP / playwright-cli / browser tool |
| Evidence saving | **Tester** | Screenshots + execution-summary.md |
| Outcome notification | **Tester** | `session_spawn` back to Reporter |
| Jira close/comment | **Reporter** | With user approval |
| New defect filing | **Reporter** | With user approval + bug-report-formatter skill |

### 5.3 session_spawn Protocol

**Tester → Reporter (initial spawn):**
```bash
session spawn --agent reporter \
  --workspace workspace-reporter \
  --skill defect-analysis \
  --context "Single-issue testing plan requested for <ISSUE_KEY>.
            Invoke single-defect-analysis workflow.
            After producing the plan, write:
              workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/tester_handoff.json
            and notify Tester to proceed."
```

**Tester → Reporter (outcome callback):**
```bash
session spawn --agent reporter \
  --workspace workspace-reporter \
  --skill defect-analysis \
  --context "Test outcome for <ISSUE_KEY>: <PASS|FAIL>.
            Execution evidence:
              workspace-tester/memory/tester-flow/runs/<ISSUE_KEY>/reports/execution-summary.md
            Screenshots:
              workspace-tester/memory/tester-flow/runs/<ISSUE_KEY>/screenshots/
            Proceed with Phase 7 (Test Outcome Handling) of single-defect-analysis workflow."
```

### 5.4 Idempotency Guard

Before spawning, always check `memory/tester-flow/runs/<ISSUE_KEY>/task.json`.

| `task.json.overall_status` | Action |
|---|---|
| File absent or `fresh` | Proceed to spawn |
| `waiting_for_reporter` | Re-check if handoff file exists; if so, skip to Phase 1.5 |
| `testing` | Resume from current step |
| `test_complete` | Notify reporter if result not yet sent |
| `completed` | **STOP.** Report already closed. Present to user. |

> Leverage `agent-idempotency` skill patterns (see `workspace-planner/skills/agent-idempotency/SKILL.md`) for state classification and user options.

### 5.5 Tester Handoff Contract (produced by Reporter)

```typescript
// Contents of tester_handoff.json (written by Reporter in Phase -1.6)
interface TesterHandoff {
  issue_key: string;              // e.g. "BCIN-7890"
  testing_plan_path: string;      // path to _TESTING_PLAN.md in reporter workspace
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  fc_steps_count: number;
  exploratory_required: boolean;
  affected_domains: string[];     // e.g. ["filter", "aibot"]
  generated_at: string;           // ISO8601
}
```

### 5.6 Site Knowledge Search (Phase 1.5 Detail)

After reading the testing plan, **MANDATORY** search:

```bash
# Keywords from issue summary + affected_domains from tester_handoff.json
qmd search "<keyword1> <keyword2>" -c site-knowledge --json -n 10

# If running in OpenClaw: use memory_search tool with same keywords
```

Build `site_context.md` from results:
- Relevant component sections from domain `.md` files
- CSS locator hints for affected components
- Action vocabulary for test step descriptions

Store: `memory/tester-flow/runs/<ISSUE_KEY>/site_context.md`
Update `MEMORY.md`: one-line site search activity entry.

---

## 6. Files to Create or Update

| File | Action | Purpose |
|------|--------|---------|
| `workspace-tester/AGENTS.md` | Done | Site Knowledge Search section added |
| `workspace-tester/MEMORY.md` | Done | Site Knowledge Search Activity section added |
| `workspace-tester/README_TESTER_FLOW.md` | Update | Add qmd setup (BM25 only) |
| `workspace-tester/.env.example` | Create or update | Document `NODE_LLAMA_CPP_CMAKE_OPTION_GGML_CUDA` |
| OpenClaw config | Update | Add memorySearch.extraPaths |

---

## 7. Implementation Roadmap

| Step | Task | Priority | Status |
|------|------|----------|--------|
| 1 | Add Site Knowledge Search section to AGENTS.md | **P1** | Done |
| 2 | Add MEMORY.md update rule (Site Knowledge Search Activity) | **P1** | Done |
| 3 | Wire Phase 0.5 to use qmd search / memory_search | **P2** | Pending |
| 4 | Add qmd index step to generation pipeline (post-save) | **P3** | Pending |
| 5 | Create feature-test workflow (§10.1) | **P2** | Pending |
| 6 | Create defect-test workflow (§10.2) | **P2** | Pending |
| 7 | Create test-report skill (§10.3) | **P2** | Pending |
| 8 | Shorten AGENTS.md to scenario → workflow routing (§10.5) | **P3** | Pending |

---

## 8. Playground

The playground provides a quick sandbox to **manually exercise** the sitemap generator against a real
or synthetic WDIO repo without running the full test suite.

> **Note:** This section was originally in `SITE_KNOWLEDGE_SYSTEM_DESIGN.md §7.1`. It belongs here
> because it concerns agent-side validation of the knowledge files the agent will read.

### 8.1 Purpose

- Validate that `generate-sitemap.mjs` produces correct Markdown output for a given repo.
- Smoke-test the generated `memory/site-knowledge/` files before integrating with the Tester Agent.
- Let developers iterate quickly on `buildDomainSheet` / `buildCompactSitemap` output format.
- Verify that `qmd search` returns meaningful results for the generated files.

### 8.2 Location

```
workspace-tester/
└── tools/
    └── sitemap-generator/
        └── playground/
            ├── run.mjs               ← One-shot playground runner
            ├── sample-repo/          ← Minimal synthetic WDIO repo for local runs
            │   └── pageObjects/
            │       └── filter/
            │           └── CalendarFilter.js
            └── output/               ← Generated files land here (gitignored)
```

### 8.3 Usage

```bash
# Run against the synthetic sample repo
node tools/sitemap-generator/playground/run.mjs

# Run against a real local WDIO checkout
node tools/sitemap-generator/playground/run.mjs \
  --repo /path/to/wdio-repo \
  --domains filter,autoAnswers,aibot

# After generation, verify qmd search works:
qmd search "CalendarFilter" -c site-knowledge --json -n 5
```

### 8.4 `playground/run.mjs` Stub

```javascript
// playground/run.mjs
// Quick smoke-test runner — not part of the production build.
import { main } from '../generate-sitemap.mjs';

const SAMPLE_REPO = new URL('./sample-repo', import.meta.url).pathname;
const args = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['--repo', SAMPLE_REPO, '--domains', 'all', '--output-dir', './playground/output'];

await main(args);
console.log('📂 Check playground/output/ for generated files.');
```

---

## 9. User-facing README

A user-facing `README.md` targets **engineers who want to run or extend** the sitemap generator.
It lives at the tool root and is the first document a new contributor reads.

> **Note:** This section was originally in `SITE_KNOWLEDGE_SYSTEM_DESIGN.md §7.2`. It is documented
> here because it governs how agent operators set up the site knowledge infrastructure.

### 9.1 Location

```
workspace-tester/
└── tools/
    └── sitemap-generator/
        └── README.md    ← this file
```

### 9.2 Required Sections

| Section | Content |
|---------|--------|
| **Overview** | One-paragraph description of what the tool does and why |
| **Quick Start** | Three commands to clone, install (if any), and run |
| **CLI Reference** | Table of all `--flags`, types, defaults, and examples |
| **Output Format** | Description of `SITEMAP.md`, domain `.md` files, `metadata.json` |
| **qmd Setup** | How to configure qmd BM25 index for site-knowledge collection |
| **Adding a New Domain** | Step-by-step: edit `domains.json`, verify with playground, run tests |
| **Running Tests** | `node --test tests/*.test.mjs` — what to expect on pass/fail |
| **Playground** | Pointer to `playground/` and how to inspect output |
| **Troubleshooting** | Common errors (`ENOENT`, empty output, `EACCES`) and fixes |

### 9.3 README Template (Stub)

```markdown
# Site Knowledge Generator

> Crawls WDIO page-objects and writes structured Markdown knowledge files
> to `memory/site-knowledge/` for use by the Tester Agent.

## Quick Start

\`\`\`bash
cd workspace-tester/tools/sitemap-generator
node generate-sitemap.mjs --repo-url https://github.com/mstr-kiai/web-dossier --domains all
# Or if you have it locally:
# node generate-sitemap.mjs --repo /path/to/wdio --domains all
\`\`\`

## Requirements

If you are using the `--repo-url` flag to process remote repositories, you must have the **GitHub CLI (`gh`)** installed and authenticated:
1. `brew install gh` (macOS)
2. `gh auth login` (follow prompts inside terminal)

## qmd Setup (BM25 Search for Tester Agent)

```bash
npm install -g @tobilu/qmd
qmd collection add memory/site-knowledge --name site-knowledge --mask "**/*.md"
# BM25 index is built automatically; no qmd embed needed
```

## CLI Reference

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--repo` | string | _(see desc)_ | Local path of the WDIO repo |
| `--repo-url` | string | _(see desc)_ | GitHub repo URL to load via `gh api` |
| `--domains` | CSV or `all` | _(required)_ | Domains to process |
| `--output-dir` | string | `memory/site-knowledge` | Output directory |

## Adding a New Domain

1. Add an entry to `config/domains.json`.
2. Run `node playground/run.mjs --domains <new-domain>` to inspect output.
3. Run `node --test tests/*.test.mjs` to verify no regressions.
4. Verify `qmd search "<component>" -c site-knowledge` returns results.

## Running Tests

\`\`\`bash
node --test tests/*.test.mjs
\`\`\`

## Playground

See `playground/` for a quick-run sandbox. Outputs land in `playground/output/`.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Repo not found: …` | `--repo` path does not exist | Check the path |
| Empty `.md` files | POM folder has no `.js` files | Verify `domains.json` `pomPaths` |
| `EACCES` | Output dir not writable | Check permissions on `--output-dir` |
| `qmd search` returns nothing | Index not built | Run `qmd collection add ...` first |
```

---

## 10. Workflows and Skills to Create

This section specifies workflows and skills to be extracted from `AGENTS.md` (marked `[TO EXTRACT]` / `[extract to ...]`). The goal is to shorten AGENTS.md so it only shows **which workflow applies to which scenario**; detailed procedures live in workflow files.

**Reference format:** See `workspace-reporter/.agents/workflows/single-defect-analysis.md` for workflow structure (frontmatter, phases, idempotency, handoff contracts).

---

### 10.1 feature-test Workflow

**Path:** `workspace-tester/.agents/workflows/feature-test.md`

**Trigger:** QA plan + specs already exist (from planner workspace or `projects/test-plans/<issue-key>/`).

**Invocation:** User command or master agent handoff with QA plan path.

**Output:**
- `memory/tester-flow/runs/<key>/reports/execution-summary.md`
- `memory/tester-flow/runs/<key>/screenshots/<step>.png`
- Handoff to qa-report (issue summaries, evidence paths)

**Source:** `[extract to feature-test workflow]` in AGENTS.md — Core Workflow: Test Execution.

**Phases (detailed):**

| Phase | Action | Artifacts |
|-------|--------|-----------|
| **1. Load QA Plan** | Read test plan from `projects/test-plans/<issue-key>/test-plan.md` or planner workspace. Extract issue key, test cases, prerequisites, test data. Verify environment availability. | `task.json` with `plan_path`, `issue_key` |
| **2. Site Knowledge Search** | **MANDATORY.** Derive keywords from QA plan, domain labels, component names. Run `qmd search` + OpenClaw `memory_search`. Save to `memory/tester-flow/runs/<key>/site_context.md`. Update MEMORY.md with useful patterns. | `site_context.md`, MEMORY.md entry |
| **3. Execute Tests** | Use Playwright MCP via mcporter skills. For each test case: follow steps, reference `site_context.md` for locators, take screenshots, record PASS/FAIL. If unclear, re-run site knowledge search; if still insufficient, use tavily/confluence search. | `screenshots/<step>.png`, run state |
| **4. Document Results** | Invoke **test-report skill** to produce execution report. Organize screenshots by test case. | `reports/execution-summary.md` |
| **5. Report Issues** | For each failed test: extract reproduction steps, capture evidence, document expected vs actual, note severity. Handoff to qa-report with issue summaries, evidence paths, test case IDs. | Handoff payload |
| **6. Notify User** | Send summary via Feishu (chat-id from TOOLS.md). | Feishu message |

**Idempotency:** Check `memory/tester-flow/runs/<key>/task.json`. If `test_complete`, present existing report; ask user to re-run or use existing.

**Dependencies:** test-report skill, playwright MCP, qmd/memory_search, Feishu message skill.

**Creation details for review:**
- Create `workspace-tester/.agents/workflows/feature-test.md`
- Frontmatter: `description` (trigger, output, dependencies)
- Follow `single-defect-analysis.md` structure: phases, idempotency, artifact paths
- Reference: `skills/test-report/SKILL.md`, Site Knowledge Search (§2, §5.6)

---

### 10.2 defect-test Workflow

**Path:** `workspace-tester/.agents/workflows/defect-test.md`

**Trigger:** Single Jira issue key/URL (e.g., `BCIN-7890`) **without** pre-existing QA plan.

**Invocation:** User command or master agent handoff with issue key.

**Output:**
- `memory/tester-flow/runs/<ISSUE_KEY>/reports/execution-summary.md`
- `memory/tester-flow/runs/<ISSUE_KEY>/screenshots/<step>.png`
- Callback to Reporter Agent (PASS/FAIL + evidence)

**Source:** `[extract to issue-test workflow]` in AGENTS.md — Single-Issue FC Flow.

**Phases (detailed):**

| Phase | Action | Artifacts |
|-------|--------|-----------|
| **0. Spawn Reporter** | Check idempotency: `memory/tester-flow/runs/<ISSUE_KEY>/task.json`. If `testing_plan` exists → skip to Phase 1.5. Else: `session_spawn` Reporter with `single-defect-analysis` workflow. Save `overall_status: waiting_for_reporter`. Wait for `tester_handoff.json` + `_TESTING_PLAN.md`. | `task.json` |
| **1.5. Read Testing Plan** | Read `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md` and `tester_handoff.json`. | — |
| **1.5b. Site Knowledge Search** | **MANDATORY.** Keywords from issue summary + `affected_domains` in handoff. `qmd search` + `memory_search`. Save to `memory/tester-flow/runs/<ISSUE_KEY>/site_context.md`. Update MEMORY.md. | `site_context.md` |
| **2.5. Execute FC Steps** | For each FC step: execute in browser (Playwright MCP / playwright-cli / browser), reference `site_context.md`, screenshot, record PASS/FAIL. If `exploratory_required`: follow Exploratory Charter. | `screenshots/`, execution log |
| **3.5. Report Outcome** | Invoke **test-report skill** for execution summary. Update `task.json` with `result`, `evidence_path`. `session_spawn` Reporter with PASS/FAIL + evidence paths. Proceed to Phase 7 (Reporter handles Jira close/comment). | `execution-summary.md`, Reporter callback |

**Integration:** Delegates to Reporter's `single-defect-analysis.md` (Phases 1–6). Reporter produces testing plan; Tester executes; Tester calls back for Phase 7 (Test Outcome Handling).

**Dependencies:** Reporter Agent, single-defect-analysis workflow, test-report skill, session_spawn, qmd/memory_search.

**Creation details for review:**
- Create `workspace-tester/.agents/workflows/defect-test.md`
- Frontmatter: `description` (trigger: single issue, output, callback to Reporter)
- Phases 0, 1.5, 1.5b, 2.5, 3.5 match AGENTS.md Single-Issue FC Flow
- Integration: document `session_spawn` protocol to Reporter, handoff contract (`tester_handoff.json`)

---

### 10.3 test-report Skill

**Path:** `workspace-tester/skills/test-report/SKILL.md` (or `.cursor/skills/test-report/SKILL.md` if workspace-scoped)

**Purpose:** Standardize execution report format and handoff payload for qa-report. Used by both **feature-test** and **defect-test** workflows.

**Source:** `[extract to test-report skills]` in AGENTS.md — Test Execution Template, Coordination with qa-report.

**Inputs:**
- Test results (per-step PASS/FAIL, screenshots paths, console logs)
- Issue key
- Test plan path
- Environment (Staging/Production)

**Output:** Markdown execution report at `memory/tester-flow/runs/<key>/reports/execution-summary.md`.

**Report Template (required structure):**

```markdown
# Test Execution Report: [Issue Key]

**Date:** YYYY-MM-DD
**Tester:** Atlas Tester (automated)
**Test Plan:** <path>
**Environment:** Staging/Production

## Summary
- **Total Test Cases:** N
- **Passed:** N
- **Failed:** N
- **Blocked:** N

## Test Results

### TC-01 / FC-01: <description> ✅ PASS
**Actual Result:** <summary>
**Screenshot:** <path>
**Notes:** <optional>

### TC-02 / FC-02: <description> ❌ FAIL
**Expected:** <expected>
**Actual:** <actual>
**Screenshot:** <path>
**Console Log:** <path if any>
**Notes:** Bug detected — needs to be filed in Jira

...

## Issues Found
1. **TC-XX Failure:** <summary> (Severity)
2. ...

## Recommendations
- <fix / retest / etc.>

## Handoff to qa-report
- Execution report path
- Issue summaries with severity
- Evidence paths (screenshots, logs)
- Test case IDs for failed cases
```

**Handoff payload (for qa-report):**
- `execution_report_path`
- `issue_summaries[]` (summary, severity, test_case_id)
- `evidence_paths[]`
- `recommendations[]`

**Creation details for review:**
- Create `workspace-tester/skills/test-report/` (or symlink from `.agents/skills/`)
- SKILL.md: name, description, inputs, output path, template, handoff schema
- Optional: CLI or script to validate report structure (e.g., required sections present)

---

### 10.4 Other Skills Analysis

| Skill | Needed? | Purpose | Creation Details |
|-------|---------|---------|------------------|
| **test-report** | ✅ Yes | See §10.3. Format execution report, handoff to qa-report. | Create `skills/test-report/SKILL.md`. Template + handoff schema. |
| **site-knowledge-search** | ⚠️ Optional | Encapsulate qmd + memory_search + MEMORY.md update. Currently inline in workflows. | If created: `skills/site-knowledge-search/SKILL.md`. Inputs: keywords, domains. Output: `site_context.md` path + MEMORY.md update. Reduces duplication in feature-test and defect-test. |
| **test-execution-error-handling** | ⚠️ Optional | Standardize: test step fails, environment issue, browser automation fails. | If created: `skills/test-execution-error-handling/SKILL.md`. Protocol: screenshot → capture logs → document → continue. Could be a subsection of test-report skill instead. |
| **qa-report-handoff** | ⚠️ Optional | Formalize handoff format to qa-report (master agent). | Currently implied in test-report. Could be a separate skill if handoff logic grows (e.g., Jira comment format, Confluence update). |

**Recommendation:** Implement **test-report** first (required by both workflows). Defer **site-knowledge-search** and **test-execution-error-handling** until workflows are stable; they can remain inline initially.

---

### 10.5 AGENTS.md Future Structure (Reference Only)

After workflows and skills are created, AGENTS.md should be shortened to **scenario → workflow routing** only. Example:

```markdown
## Input Routing

| Input | Workflow |
|-------|----------|
| Single Jira issue key/URL, no QA plan | `.agents/workflows/defect-test.md` |
| QA plan + specs exist | `.agents/workflows/feature-test.md` |
| Planner workspace has plan | Copy plan → `.agents/workflows/feature-test.md` |
```

Plus: Session Start Checklist, Workflow Discovery Policy, Site Knowledge Search (brief), Artifact Save Requirements, Tools, Security, Memory. All procedural detail moves to workflow files.

---

## 11. References

- [SITE_KNOWLEDGE_SYSTEM_DESIGN.md](./SITE_KNOWLEDGE_SYSTEM_DESIGN.md) — Generation pipeline (TDD stubs + tests)
- [single-defect-analysis.md](../../workspace-reporter/.agents/workflows/single-defect-analysis.md) — Workflow format reference for feature-test and defect-test
- [TESTER_AGENT_DESIGN_v2.md](./TESTER_AGENT_DESIGN_v2.md) — Site Knowledge overview + Phase 0.5 (§4); Issue-only FC Flow is in this doc (§5)
- [qmd GitHub](https://github.com/tobi/qmd) — BM25 search CLI
- [OpenClaw memory docs](https://openclaw.im/docs/concepts/memory) — memorySearch config
- [OpenRouter Embeddings](https://openrouter.ai/docs/api/reference/embeddings) — OpenAI-compatible embeddings
- [agent-idempotency skill](../../workspace-planner/skills/agent-idempotency/SKILL.md) — Idempotency patterns for the search + run flow
