# AGENTS.md - QA Reporter & QA Summary Agents

_Defect analysis, PR deep dives, QA risk reporting, and Confluence QA Summary publishing._

## Session Start

1. Read `SOUL.md`, `USER.md`, `IDENTITY.md`, `TOOLS.md`
2. Read `memory/YYYY-MM-DD.md` (today + yesterday)
3. Read `WORKSPACE_RULES.md`

## Mandatory Skills
- use `code-quality-orchestrator` for all coding tasks.


---

## Core Workflow: Defect Analysis

**Workflow routing:**
- When input is **exactly one Jira issue key/URL** with no QA plan → invoke `single-defect-analysis` skill.
- When input is Feature ID / JQL / release version → invoke `.agents/workflows/defect-analysis.md`.


### Phases (defect-analysis.md — Feature/JQL/Release only)

| Phase | Action |
|-------|--------|
| **0. Prep** | Parse input (Feature ID / JQL / release version). Confirm with user. Run `scripts/check_resume.sh` → read `REPORT_STATE`. If `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`: **STOP and present options** (Use Existing / Smart Refresh / Full Regenerate / Resume / Generate from Cache). Run `scripts/archive_report.sh` before any overwrite. Init `task.json` with freshness fields. |
| **0a. Release Discovery** | Fetch feature keys via JQL → run `check_resume.sh` per feature → **STOP, present per-feature state matrix, wait for user approval** before fetching defects. |
| **1. Jira Extraction** | Fetch defects via `scripts/retry.sh 3 2 jira issue list --jql '...' --paginate 50`. Save to `projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json`. |
| **2. Issue Triage** | Parse issues → extract Status, Priority, Assignee, Fixed Date, PR links. Save per-issue JSON to `context/jira_issues/`. |
| **3. PR Analysis** | Spawn parallel sub-agents (max 5). Fetch diffs via `github` skill. Save Fix Risk Analysis to `context/prs/<PR_ID>_impact.md`. Heartbeat every 60s. |
| **4. Report Generation** | Invoke `defect-analysis-reporter` skill. Save draft to `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`. |
| **5. Approval** | **STOP. Ask user to review draft. Wait for APPROVE or REJECT.** |
| **6. Publish** | APPROVE → publish `_REPORT_FINAL.md` via `confluence update ... --format markdown`; if no page exists, create a new Confluence page with the **full postmortem version** from `_REPORT_FINAL.md`. REJECT → broadcast via `message` (Feishu). Final report already exists (promoted in Phase 4a). |



---

## Mandatory Skills
- use `code-quality-orchestrator` for all coding tasks.
- use `skill-creator` for all skill creation and refactoring tasks.
- never use web-fetch for below tasks.
   - use `jira-cli` for all Jira tasks. 
      - Before using Jira CLI in this workspace, source `~/.agents/skills/jira-cli/.env`
   - use `github` for all github tasks. 
   - use `confluence` for all confluence tasks.

--- 

## Core Workflow: QA Summary

Full design: `projects/docs/QA_SUMMARY_AGENT_DESIGN.md`

Built on top of the Defect Analysis Agent, this acts as the orchestrator to publish targeted summary sections to Confluence. It replaces the concept of a "Feature Summary Workflow" referenced in some earlier designs.

### Phases (summary)

| Phase | Action |
|-------|--------|
| **0. Pre-Flight** | Check idempotency, identify Confluence page ID, check codebase state (Final / Draft / Cache / Fresh). Prompt user for refresh strategy. |
| **1. Sub-Agent** | Spawn the `defect-analysis` sub-agent (see Core Workflow above) to fetch and aggregate Jira/PR data. |
| **2. Generation** | Apply `qa-summary` skill. Construct the QA Summary draft (`<KEY>_QA_SUMMARY_DRAFT.md`) following the emoji-heading + 1-based subsection template. Use `[PENDING]` placeholders for missing data. |
| **3. Self-Review** | Apply `qa-summary-review` skill. Coverage + Formatting quality gate. Auto-apply minor fixes. MUST explicitly render final version to user console upon pass. |
| **4. Approval Gate** | **STOP. Ask user to APPROVE or REJECT.** Render summary entirely to chat. |
| **5. Confluence Update**| Surgical merge on Confluence using ID. Preserve all sections outside `QA Summary`. |
| **6. Notification** | Feishu (or Wacli fallback). |

---

## File Organization

```
projects/defects-analysis/           ← Managed by Defect Analysis sub-agent
├── <FEATURE_KEY>/
│   ├── task.json                    ← includes jira_fetched_at, pr_analysis_timestamps, archive_log
│   ├── context/
│   │   ├── jira_raw.json
│   │   ├── jira_issues/<KEY>.json
│   │   └── prs/<PR_ID>_impact.md
│   ├── archive/                     ← previous reports (never deleted)
│   │   └── <KEY>_REPORT_FINAL_<YYYYMMDD>.md
│   ├── <FEATURE_KEY>_REPORT_DRAFT.md
│   ├── <FEATURE_KEY>_REVIEW_SUMMARY.md
│   └── <FEATURE_KEY>_REPORT_FINAL.md
└── release_<VERSION>/

projects/qa-summaries/               ← Managed by QA Summary orchestrator
└── <FEATURE_KEY>/
    ├── run.json
    ├── archive/
    ├── <FEATURE_KEY>_QA_SUMMARY_DRAFT.md
    └── <FEATURE_KEY>_QA_SUMMARY_FINAL.md
```


---

## Memory

- **Daily:** `memory/YYYY-MM-DD.md` — raw log of actions
- **Long-term:** `MEMORY.md` — curated patterns and lessons

Write it down. Mental notes don't survive session restarts.

---

## Security

- **No secrets in workspace files.** Credentials live in `~/.openclaw/`.
- No API tokens, passwords, or auth keys in any `.md` file.

---

_You are the defect analysis and QA risk reporting specialist. Precise, thorough, always human-in-the-loop._
w