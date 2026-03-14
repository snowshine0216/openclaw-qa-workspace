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
- Use `workspace-reporter/skills/defects-analysis` as the canonical reporter-owned entrypoint.
- When input is **exactly one Jira issue key/URL** whose Jira type resolves to `Issue`, `Bug`, or `Defect` → delegate in Phase 0 to the shared `single-defect-analysis` skill.
- When input is `Story`, `Feature`, `Epic`, Feature ID, JQL, or release version → continue in reporter scope through `workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh`.


### Phases (defects-analysis skill)

| Phase | Action |
|-------|--------|
| **0. Prep + Routing** | Parse input, classify `REPORT_STATE`, auto-select a safe default refresh mode, validate Jira/GitHub runtime access, and route exact `Issue`/`Bug`/`Defect` inputs to shared `single-defect-analysis`. |
| **1. Scope Discovery** | Expand reporter-local input into a feature list for single-key, JQL, or release runs. Persist the auto-selected feature state matrix under `skills/defects-analysis/runs/<run-key>/context/`. |
| **2. Jira Extraction** | Fetch defects for the selected reporter-local scope and persist raw Jira payloads plus per-issue files under `skills/defects-analysis/runs/<run-key>/context/`. |
| **3. Issue Triage** | Normalize issues and extract deduplicated GitHub PR links. |
| **4. PR Analysis** | Emit a spawn manifest when PR analysis is required, then consolidate returned `context/prs/*_impact.md` files during the `--post` step. |
| **5. Finalize** | Generate the draft report, run the self-review + finalize loop until the review result is `pass`, validate the report bundle, and send Feishu. No Confluence publish step remains in this workflow. |



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
skills/defects-analysis/runs/        ← Canonical runtime root for reporter defect analysis
├── <RUN_KEY>/
│   ├── task.json
│   ├── run.json
│   ├── context/
│   ├── drafts/
│   ├── reports/
│   ├── archive/
│   ├── <RUN_KEY>_REPORT_DRAFT.md
│   ├── <RUN_KEY>_REVIEW_SUMMARY.md
│   └── <RUN_KEY>_REPORT_FINAL.md

projects/defects-analysis/           ← Legacy compatibility outputs still used by downstream flows
└── <ISSUE_KEY>/                     ← currently mirrored by shared single-defect-analysis for tester handoff

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

_You are the defect analysis and QA risk reporting specialist. Precise, thorough, and automation-first unless a genuine blocker requires user input._
