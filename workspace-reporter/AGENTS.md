# AGENTS.md - QA Reporter & QA Summary Agents

_Defect analysis, PR deep dives, QA risk reporting, and Confluence QA Summary publishing._

## Session Start

1. Read `SOUL.md`, `USER.md`, `IDENTITY.md`, `TOOLS.md`
2. Read `memory/YYYY-MM-DD.md` (today + yesterday)
3. Read `WORKSPACE_RULES.md`

---

## Core Workflow: Defect Analysis

Full workflow: `.agents/workflows/defect-analysis.md`  
Full design: `projects/docs/REPORTER_AGENT_DESIGN.md`

### Phases (summary)

| Phase | Action |
|-------|--------|
| **0. Prep** | Parse input (Feature ID / JQL / release version). Confirm with user. Run `scripts/check_resume.sh` → read `REPORT_STATE`. If `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`: **STOP and present options** (Use Existing / Smart Refresh / Full Regenerate / Resume / Generate from Cache). Run `scripts/archive_report.sh` before any overwrite. Init `task.json` with freshness fields. |
| **0a. Release Discovery** | Fetch feature keys via JQL → run `check_resume.sh` per feature → **STOP, present per-feature state matrix, wait for user approval** before fetching defects. |
| **1. Jira Extraction** | Fetch defects via `scripts/retry.sh 3 2 jira issue list --jql '...' --paginate 50`. Save to `projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json`. |
| **2. Issue Triage** | Parse issues → extract Status, Priority, Assignee, Fixed Date, PR links. Save per-issue JSON to `context/jira_issues/`. |
| **3. PR Analysis** | Spawn parallel sub-agents (max 5). Fetch diffs via `github` skill. Save Fix Risk Analysis to `context/prs/<PR_ID>_impact.md`. Heartbeat every 60s. |
| **4. Report Generation** | Invoke `defect-analysis-reporter` skill. Save draft to `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`. |
| **5. Approval** | **STOP. Ask user to review draft. Wait for APPROVE or REJECT.** |
| **6. Publish** | APPROVE → convert MD→HTML → publish via `confluence` skill. REJECT → broadcast via `message` (Feishu). Final report already exists (promoted in Phase 4a). |

### ⚠️ Mandatory Rules

- **Never proceed to the next phase without user confirmation** when it involves external API calls or publishing.
- **Never publish to Confluence without explicit user approval.**
- Raise clarifying questions for ambiguous input — never assume.

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

## Skills

| Skill | Phase | Purpose |
|-------|-------|---------|
| `jira-cli` | 1–2 | Paginated JQL, issue details |
| `github` | 3 | PR diffs → Fix Risk Analysis |
| `defect-analysis-reporter` | 4 | Standardized Markdown report |
| `report-quality-reviewer` | 4a | Quality gate review on Defect Analysis report |
| `qa-summary` | 2 (QA Sum) | Draft generation guide: section template, data source mapping, formatting rules |
| `qa-summary-review` | 3 (QA Sum) | Quality gate: Coverage + Formatting review of the drafted QA Summary |
| `confluence` | 6 | Publish approved report / Surgical section update |
| `feishu` | 6 | Notify team if Confluence skipped, or post-publish (QA Sum) |
| `wacli` | 6 | Notification fallback |

All skills in `skills/`. Scripts in `scripts/` (see `scripts/README.md`).

| Script | Purpose |
|--------|---------|
| `scripts/check_resume.sh` | Detect `REPORT_STATE` (FINAL/DRAFT/CONTEXT_ONLY/FRESH) + resume check. Run first in Phase 0. |
| `scripts/archive_report.sh` | Move FINAL or DRAFT to `archive/` before overwriting. Exit 2 = nothing to archive (non-fatal). |
| `scripts/retry.sh` | Wrap API calls with retry + delay. |

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
