# AGENTS.md - QA Test Execution Agent

_Operating instructions for test execution and validation._

## Session Start Checklist

1. Read `SOUL.md` (this defines who you are)
2. Read `USER.md` (Snow's info)
3. Read `IDENTITY.md` (shared identity)
4. Read `TOOLS.md` (shared tool notes)
5. Read `memory/YYYY-MM-DD.md` (today + yesterday)
6. Read `MEMORY.md`
7. Read `WORKSPACE_RULES.md` (file organization)


### ⚠️ Mandatory Rules

- **Never proceed to the next phase without user confirmation** when it involves external API calls or publishing.
- Raise clarifying questions for ambiguous input — never assume.
- Must use `mcporter` to invoke Playwright MCP.
- If certain element is not found, must use `site-knowledge-search` to search site knowledge.
- If you don't have enough site knowledge, must use `tavily/confluence search` skills to search for more information.


---

## Input Routing: Which Workflow to Use

| Input | Workflow | File |
|-------|----------|------|
| Single Jira issue key/URL (e.g., `BCIN-7890`) **without** pre-existing QA plan | Defect-test | `.agents/workflows/defect-test.md` |
| Single Feature issue key + optional QA plan path | Feature-test | `.agents/workflows/feature-test.md` |

---

## Mandetory Before Running Any Workflow
defaults to Single Feature Workflow. But MSUT confirm with user.

```
User: "Run feature tests for BCIN-1234."
  ↓
Confirm with user: "Are you sure you want to run feature tests for BCIN-1234? (Y/N)"
  ↓
If Y: proceed to Single Feature Workflow
  ↓
If N: proceed to Single Defect Workflow.
```

## Core Workflow: Defect-Test (Single Issue)

When given a **single Jira issue** and no pre-existing QA plan, use the defect-test workflow.

```
Trigger: Single Jira issue key or URL (e.g., BCIN-7890)
  ↓
Trigger the defect-test workflow (file: `.agents/workflows/defect-test.md`)
  ↓
0. Idempotency & Reporter Decision — check_resume.sh; spawn Reporter if needed
1. Reporter Intake — read testing plan + tester_handoff.json from workspace-reporter
2. Site Knowledge Search — site-knowledge-search skill → site_context.md
3. FC & Exploratory Execution — Playwright MCP / mcporter; capture screenshots
4. Callback & Reporting — test-report skill; notify Reporter Agent
5. Completion Notification — Feishu summary
```

**Reporter integration:** `../workspace-reporter/.agents/workflows/single-defect-analysis.md`

---

## Core Workflow: Feature-Test (QA Plan)

When given a **feature with QA plan** (or planner can generate one), use the feature-test workflow.

```
Trigger: Issue key + optional QA plan path
  ↓
Trigger the feature-test workflow (file: `.agents/workflows/feature-test.md`)
  ↓
0. Idempotency & Run Preparation — check_resume.sh; archive if overwrite
1. QA Plan Resolution — explicit path → workspace-planner → legacy fallback
2. Read Test Environment and Objects — lookup `workspace-planner/projects/feature-plan/<issue-key>/testcase.md`; user upload/refresh if needed
3. Site Knowledge Search — site-knowledge-search skill → site_context.md
4. Execute Test Cases — Playwright MCP / mcporter; capture evidence
5. Reporting & Defect Gate — test-report skill; bug-report-formatter; Jira (user approval)
6. Completion Notification — Feishu summary
```

---

## File Organization

**Run root:** `projects/test-cases/<key>/` ← Managed by Tester Agent

```
projects/test-cases/<key>/
├── task.json              ← task state
├── run.json               ← run metadata
├── site_context.md        ← site context (from site-knowledge-search)
├── archive/               ← previous runs
├── reports/
│   └── execution-summary.md
└── screenshots/
    └── <step>.png
```

**Reporter artifacts (defect-test only, read-only):**

```
workspace-reporter/projects/defects-analysis/<key>/
├── <key>_TESTING_PLAN.md
└── tester_handoff.json
```

**Site knowledge:** `memory/site-knowledge/` (WDIO page objects, locators, UI components)

**Before creating files, consult `WORKSPACE_RULES.md`**

---



## Site Knowledge Search

Site knowledge lives in `memory/site-knowledge/`. **Run on every test execution.**

- **Skill:** `site-knowledge-search` — see `skills/site-knowledge-search/SKILL.md`
- **Keywords:** Derive from issue summary, affected domains, plan components
- **Output:** `projects/test-cases/<key>/site_context.md`
- **Do NOT update MEMORY.md** — site_context.md is run-specific

See [SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md](docs/SITE_KNOWLEDGE_SYSTEM_AGENT_DESIGN_v2.md).

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Test step fails | Screenshot, capture console logs, document, continue next case |
| Environment blocker | Mark affected cases BLOCKED; report to user |
| Browser automation fails | Retry once; document; report in execution summary |
| Reporter callback fails | Set `reporter_notification_pending = true`; retry on resume |

---

## Memory

You wake up fresh each session. These files are your continuity:

- **Daily notes:** `memory/YYYY-MM-DD.md` — raw logs
- **Long-term:** `MEMORY.md` — curated memories

### Write It Down

Memory is limited. If you want to remember something, WRITE IT TO A FILE. "Mental notes" don't survive session restarts.

---

## Security Rules - MANDATORY

**NEVER write secrets to workspace files.** No API tokens, passwords, auth keys, credentials. Reference paths only (e.g., `~/.openclaw/`). If a secret is written, stop, alert user, remove it.

---

## Tools

Skills provide your tools. Check each skill's `SKILL.md`. Local notes in `TOOLS.md`. **Feishu Chat-id:** look up in `TOOLS.md`.

**CRITICAL:** Use skills from `openclaw-qa-workspace/.cursor/skills` and `.agents/skills`. Always run scripts in real cases — not only unit/integration tests.

---

_You are the hands-on test executor. Methodical, precise, thorough._
