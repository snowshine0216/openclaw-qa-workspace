# OpenClaw QA Reporter Agent Design
**Version:** 3.0  
**Last Updated:** 2026-02-26  
**Scope:** Defect Analysis Workflow (used as a sub-workflow by the Feature Summary Workflow)

> **Enhancement Design:** See `REPORTER_ENHANCEMENT_DESIGN.md` for self-evolution items (archive strategy, AI self-review phase).

---

## 1. Overview

The **QA Reporter Agent** acts as an intelligent tracking and reporting orchestrator within the OpenClaw environment. Its primary responsibility is to trace the status, severity, and development progress of features or defects based on a given Jira issue link, JQL query, or **release version**. It dives deep into both issue metadata and associated code changes (PRs) to generate a comprehensive impact and progress report.

**Input Modes:**
- **Single Feature**: One feature key (e.g., `BCIN-5809`) or defect JQL.
- **Release-Scoped**: A release version (e.g., `26.03`) → fetches all features assigned to the user in that release, then analyzes defects per feature.

**Core Objectives:**
- Retrieve and map issue hierarchies (features and linked defects) at scale.
- Analyze issue status, severity, and related pull requests (PRs) from descriptions and comments.
- Deep dive into code diffs of PRs to assess technical impact and testability.
- Provide continuous progress updates via a Heartbeat mechanism.
- Generate a comprehensive Markdown Report in a **standardized format** (see Section 6), saving intermediate artifacts along the way.
- After user approval, publish the report to Confluence or broadcast to Feishu chat.

**This is a Defect Analysis Workflow.** It is designed to operate standalone *and* to be invoked as a sub-workflow step by the **Feature Summary Workflow** (see Section 9) when it needs a defect health snapshot for a feature.

### 1.1 User Confirmation Principle (Mandatory)

**Before any future action, always confirm with the user.** Never make self-decisions without explicit user approval.

| Situation | Agent Behavior |
|-----------|----------------|
| User provides a release (e.g., 26.03) | 1. Fetch feature keys via JQL. 2. **Stop and present the list to the user.** 3. Ask: *"I found N features in 26.03: [BCIN-5809, BCIN-5810, ...]. Do you want me to proceed with defect analysis for all of these, or select a subset?"* 4. **Do not proceed** until user confirms. |
| Multi-step flow | After each significant step (e.g., feature list fetched, defects fetched per feature), summarize what was done and **ask for confirmation** before the next phase. |
| Large result set | If the result would trigger many API calls (e.g., 20+ features), **confirm scope** with the user before proceeding. |
| Ambiguous input | Raise clarifying questions. Do not assume. |

**Rule:** No automatic transition to the next phase without user sign-off when the next phase involves external API calls or substantial computation.

**Example — Release 26.03:**
1. User: *"Give me defects summary for features in 26.03"*
2. Agent runs: `"QA Owner[User Picker (single user)]" = currentUser() AND "Release[Version Picker (single version)]" = 26.03 AND type = Feature` → gets feature keys.
3. Agent: *"I found 12 features: BCIN-5809, BCIN-5810, ... Do you want me to analyze defects for all 12, or a subset?"*
4. User confirms.
5. Agent fetches defects per feature (parallel, max 5 at a time), then generates one report per feature.

---

## 2. Agent Persona & Role

- **Type**: Reporter / Orchestrator Agent
- **Primary Responsibility**: Status Tracking, PR Diff Analysis, Impact Synthesis, and Reporting.
- **Workflow**: Context Gathering → Parallel Sub-agent Analysis → Synthesis → Approval → Publishing/Notification.

---

## 3. Folder Architecture

All project artifacts for a given defect analysis session are organized under the session's working directory.

**Single-feature mode:** One folder per feature.  
**Release-scoped mode:** One batch folder plus one subfolder per feature.

```
workspace-reporter/
├── AGENTS.md
├── skills/                          ← All available skills (CLI-based, never MCPs)
│   ├── jira-cli/
│   ├── github/
│   ├── confluence/
│   ├── defect-analysis-reporter/
│   └── ...
├── projects/
│   └── defects-analysis/
│       ├── release_<VERSION>/       ← Release-scoped batch (e.g., release_26.03)
│       │   ├── batch_task.json      ← Batch state: feature_keys[], completed_features[], etc.
│       │   ├── context/
│       │   │   └── features_raw.json  ← Feature list from release JQL
│       │   └── <FEATURE_KEY>/       ← One folder per feature (same structure as below)
│       └── <FEATURE_KEY>/           ← Single-feature mode: one folder per session
│           ├── task.json            ← Heartbeat, phase state, and freshness timestamps
│           ├── context/             ← Raw data from APIs
│           │   ├── jira_raw.json
│           │   └── jira_issues/
│           │       └── <ISSUE_KEY>.json
│           │   └── prs/
│           │       └── <PR_ID>_impact.md
│           ├── archive/             ← Previous reports (never deleted, timestamped)
│           │   └── <FEATURE_KEY>_REPORT_FINAL_<YYYYMMDD>.md
│           ├── <FEATURE_KEY>_REPORT_DRAFT.md
│           └── <FEATURE_KEY>_REPORT_FINAL.md
└── .agents/
    └── workflows/
        └── defect-analysis.md
```

---

## 4. Workflow & Orchestration Design

When dealing with large-scale queries (e.g., releases with >30 defects and numerous PRs), the Reporter Agent must balance execution speed, context window limits, and API rate limits. It relies heavily on **parallel execution** and **sub-agents**.

### 4.1 Phase 0: Preparation & Resume Check

1. **Input Parsing**: Accept from the user one of:
   - A single Feature ID (e.g., `BCIN-5809`)
   - A defect JQL query
   - A **release version** (e.g., `26.03`) — triggers release-scoped mode
2. **Confirm Requirements**: Double-confirm with the user before proceeding. Raise any clarifying questions.
3. **Report Status Check** *(new — runs before any API call)*: Inspect the workspace for the target feature key(s) and classify the current state:

   | Detected State | Condition | Agent Prompt |
   |---|---|---|
   | **Final report exists** | `<KEY>_REPORT_FINAL.md` present | Show generation date and data age. Ask: **(A) Use Existing — (B) Smart Refresh — (C) Full Regenerate** |
   | **Draft only** | `<KEY>_REPORT_DRAFT.md` present, no final | Show draft date. Ask: **(A) Resume to Approval — (B) Smart Refresh — (C) Full Regenerate** |
   | **Context only** | `context/jira_raw.json` exists, no report | Show data age and PR cache count. Ask: **(A) Generate from Cache — (B) Re-fetch Jira + Regenerate** |
   | **Fresh** | No artifacts at all | Proceed normally, no prompt needed |

   **Option semantics:**

   | Option | Re-fetches Jira? | Re-fetches PRs? | Archives old report? |
   |---|---|---|---|
   | **Use Existing** | No | No | No |
   | **Smart Refresh** | Yes (always stale) | Only PRs > 7 days old | Yes → `archive/` |
   | **Full Regenerate** | Yes | Yes, all | Yes → `archive/` |
   | **Resume to Approval** | No | No | No (go to Phase 4 directly) |
   | **Generate from Cache** | No | No | Old draft → `archive/` |

   **Freshness display**: Before presenting options, state data ages explicitly:
   > *"BCIN-789 was last analyzed on 2026-01-28 (29 days ago). Jira data: 29 days old. PR impacts: 5/8 cached (oldest: 7 days ago)."*

   **Archive rule**: Never overwrite an existing `_REPORT_FINAL.md` without first moving it to `archive/<KEY>_REPORT_FINAL_<YYYYMMDD>.md`. If multiple reports are archived on the same day, append `_<HHmm>`.

   **Guard**: If the user picks Full Regenerate but data is < 1 hour old, warn: *"Data was fetched N minutes ago. Are you sure you want to re-fetch everything?"* and require explicit confirmation.

4. **Resume Check**: Run `scripts/check_resume.sh <feature-id>` (single-feature) or `scripts/check_resume.sh release_<VERSION>` (release-scoped) to detect in-progress state.
5. **Initialize State**: Create working directory and `task.json`. For release-scoped mode, create `projects/defects-analysis/release_<VERSION>/batch_task.json`.

### 4.2 Phase 0a: Release Discovery (Release-Scoped Mode Only)

*Goal: Fetch feature keys for the given release. **Do not proceed to defect analysis without user confirmation.***

1. Run JQL with pagination:
   ```
   "QA Owner[User Picker (single user)]" = currentUser() AND "Release[Version Picker (single version)]" = <VERSION> AND type = Feature
   ```
2. Save result to `projects/defects-analysis/release_<VERSION>/context/features_raw.json`.
3. **Report Status Check for all features**: Apply the same per-feature state classification (from Phase 0, step 3) to every feature in the list. Present a consolidated state matrix:
   ```
   Feature State Summary for Release <VERSION>:

   | Feature    | State           | Last Report    | Default Action       |
   |------------|-----------------|----------------|----------------------|
   | BCIN-5809  | ✅ Final         | 2026-01-28     | Skip (use existing)  |
   | BCIN-5810  | 📝 Draft only    | 2026-02-10     | Resume to approval   |
   | BCIN-5811  | 🔄 Context only  | 2026-02-12     | Generate from cache  |
   | BCIN-5812  | 🆕 Fresh         | —              | Full analysis        |
   ...

   Plan: 1 skipped, 1 resumed, 1 from cache, N fresh. Estimated API calls: ~X Jira + ~Y GitHub.
   ```
4. **STOP and confirm with user:**
   > *"I found N features in <VERSION>. State summary above. Proceed with the default plan, regenerate all, or customize per-feature?"*
5. **Do not fetch defects** until the user explicitly approves.

### 4.2b Phase 0b: Project Discovery (Always Run)

*Goal: Fetch all accessible Jira projects and cache their keys for use in cross-project JQL.*

1. Check cache freshness (`projects/defects-analysis/.cache/project_keys.txt`). If stale (> 24h) or missing:
   ```bash
   mkdir -p projects/defects-analysis/.cache
   scripts/retry.sh 3 2 jira project list --format json > "$CACHE_JSON"
   jq -r '.[].key' "$CACHE_JSON" > "$CACHE_FILE"
   ```
2. Verify `project_keys.txt` is non-empty. If empty, check credentials and retry.
3. Load keys for use in Phase 1 JQL:
   ```bash
   PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | tr '\n' ',' | sed 's/,$//')
   ```

**Cache location:** `projects/defects-analysis/.cache/` — shared across all analyses, gitignored.  
**TTL:** 24 hours. **Force refresh:** `rm "$CACHE_FILE"`.

**Rationale:** `linkedIssues()` is unreliable across Jira projects. A project-scoped search using the full project list ensures complete coverage as the org grows.

### 4.3 Phase 1: Context Gathering & Jira Extraction (Scalable)

*Goal: Identify all relevant defect issues. For release-scoped mode, fetch defects **in parallel** for up to 3–5 features at a time.*

**Prerequisite:** Phase 0b must have run to populate `project_keys.txt`.

**Single-feature mode:**
1. Load project keys from cache, then run with retry:
   ```bash
   PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | tr '\n' ',' | sed 's/,$//')

   scripts/retry.sh 3 2 jira issue list \
     --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"<FEATURE_KEY>\" OR text ~ \"<FEATURE_KEY>\")" \
     --format json --paginate 50 \
     > projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json
   ```
2. Save to `projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json`.

**Release-scoped mode (parallel fetch):**
1. For each feature key (batch of max 3–5 features concurrently):
   - Run the same JQL with `<FEATURE_KEY>` substituted.
   - Save to `projects/defects-analysis/release_<VERSION>/<FEATURE_KEY>/context/jira_raw.json`.
2. **After each feature's defects are fetched**, optionally confirm progress with the user if the batch is large (e.g., >10 features).

3. **Scalability Guard**: Use `--paginate` flag (page size 50). Wrap all Jira calls in `scripts/retry.sh 3 2 jira issue list ...`.
4. Update `task.json` → `current_phase: issue_triage`.

### 4.4 Phase 2: Parallel Deep Analysis (Sub-agents)

*Goal: Triage each defect's metadata and delegate PR analysis to parallel sub-agents.*

1. **Issue Triage**: Iterate through `jira_raw.json`. For each issue, extract `Status`, `Priority`, `Assignee`, `Description`, `Comments`, and `Fixed Date` (resolution date).
2. **PR Identification**: Run regex/pattern match against issue descriptions and comments to extract GitHub PR links.
3. **Spawn Sub-agents (Parallel, Concurrency-Capped at 5)**:
   - For each identified PR, spawn a **PR Analyzer Sub-agent**.
   - The sub-agent uses the `github` skill to fetch PR content and file diffs.
   - The sub-agent synthesizes the diff into a short **"Fix Risk Analysis"** structured as:
     - **Files Changed**: List of key files modified.
     - **Complexity**: High / Medium / Low.
     - **Regression Risk**: Brief statement of what areas could regress.
   - Save result to `context/prs/<PR_ID>_impact.md`.
4. Emit a **heartbeat** update if Phase 2 takes >60 seconds (see Section 5.1).
5. Update `task.json` → `current_phase: synthesis`.

### 4.5 Phase 3: Synthesis & Report Generation

*Goal: Combine Jira tracking and PR insights into a **standard Markdown report** (see Section 6).*

1. **Data Aggregation**: Collect all `context/prs/*.md` artifacts, merge with Jira issue list.
2. **Invoke `defect-analysis-reporter` Skill**: Pass aggregated data to the skill, which generates the report using the standardized output format.
3. Save draft to `<FEATURE_KEY>_REPORT_DRAFT.md`.
4. Update `task.json` → `current_phase: self_review`.

### 4.6 Phase 4a: AI Self-Review (Quality Gate)

*Goal: The agent reviews the draft report against quality criteria to catch gaps before human review.*

1. **Self-Review Checklist**:
   - **Section completeness**: All 12 sections present; no placeholders.
   - **Defect count**: Totals match `jira_raw.json` exactly.
   - **20/80 identification**: Identify the top 2-3 functional areas, or any area containing >30% of total defects, or any area containing unresolved High priority defects.
   - **Risk rating coherence**: Appropriate rating given the open defect priority levels.
2. **Output**: Generate a separate review summary file: `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REVIEW_SUMMARY.md`.
3. **Hybrid Auto-fix Protocol**:
   - **Objective errors**: If missing sections or mismatching defect counts, auto-fix the draft and regenerate (max 1-2 retries).
   - **Subjective warnings**: Do NOT auto-fix. Emit warnings to the `_REVIEW_SUMMARY.md`.
4. Update `task.json` → `current_phase: approval`.

### 4.7 Phase 5: User Approval & Publishing

*Goal: Secure user sign-off before making external updates. Never publish without explicit approval.*

1. **Approval Prompt**: Agent pauses and asks the user to review `<FEATURE_KEY>_REPORT_DRAFT.md` (or all drafts in release-scoped mode).
2. **Wait for user response.** Do not proceed to publish until the user confirms.
3. **If Approved**: Invoke the `confluence` skill to create or update the Confluence page.
4. **If Rejected / Alternative**: Use the `message` skill (Feishu) to broadcast the summary and a local link to the team channel.
5. Copy approved draft to `<FEATURE_KEY>_REPORT_FINAL.md`.
6. Update `task.json` → `overall_status: completed`.

**Release-scoped:** For multiple features, either confirm each report individually or ask: *"All N reports are ready. Approve all for Confluence, or specify which to publish?"*

---

## 5. Resilience & Scalability

### 5.1 Heartbeat Protocol

For long-running extraction and PR diff analysis tasks, the agent maintains continuous communication:

- **Trigger**: Any phase taking longer than 60 seconds.
- **Heartbeat Message Example**:
  > *"⏳ Currently analyzing... Processed 12/35 defects and 4/10 PR diffs. Phase: Parallel Analysis. ETA: ~2 minutes."*
- **State File**: `task.json` is updated after every defect and every PR sub-agent completes, providing a recovery checkpoint.

### 5.2 Intermediate Checkpointing

All data is persisted locally to enable graceful recovery from crashes or API timeouts:

| Artifact | Path | Purpose |
|---|---|---|
| Raw Jira JSON | `context/jira_raw.json` | Avoid re-fetching Jira on failure |
| Individual Defect JSONs | `context/jira_issues/<KEY>.json` | Per-issue triage data |
| PR Impact Summaries | `context/prs/<PR_ID>_impact.md` | Sub-agent results (idempotent) |
| Task State | `task.json` | Current phase, progress counters, resume point, freshness timestamps |
| Review Summary | `<KEY>_REVIEW_SUMMARY.md` | Persistent quality gate log prior to user approval |
| Archived Reports | `archive/<KEY>_REPORT_*_<YYYYMMDD>.md` | Previous report versions (never deleted) |

If interrupted, the agent reads `task.json` and resumes from the saved `current_phase`, re-using already-computed intermediate artifacts instead of re-calling APIs.

**`task.json` freshness fields** (extended schema for idempotency support):

```json
{
  "feature_key": "BCIN-789",
  "overall_status": "completed",
  "current_phase": "done",
  "jira_fetched_at": "2026-01-28T10:30:00Z",
  "report_generated_at": "2026-01-28T11:45:00Z",
  "report_approved_at": "2026-01-28T12:00:00Z",
  "pr_analysis_timestamps": {
    "PR-123": "2026-01-28T11:00:00Z",
    "PR-456": "2026-01-28T11:05:00Z"
  },
  "failed_prs": [],
  "archive_log": [
    {
      "archived_at": "2026-02-26T14:00:00Z",
      "original_file": "BCIN-789_REPORT_FINAL.md",
      "archived_to": "archive/BCIN-789_REPORT_FINAL_20260128.md",
      "reason": "Smart Refresh requested by user"
    }
  ]
}
```

**PR cache reuse rule (Smart Refresh)**: Reuse `context/prs/<PR_ID>_impact.md` if the PR was analyzed within the last **7 days** (per `pr_analysis_timestamps`). Merged PRs do not change — their diffs are stable indefinitely. Spawn a new sub-agent only for PRs that are missing or exceed the threshold.

### 5.3 Retry Policy

All external API calls are wrapped in:
```bash
scripts/retry.sh <max_attempts> <delay_seconds> <command>
```
- **Jira CLI**: 3 retries, 2s delay
- **GitHub API**: 3 retries, 5s delay (respects rate limits)
- **Confluence publish**: 2 retries, 3s delay

### 5.4 Concurrency Control

- **Release-scoped mode**: Maximum **3–5 parallel feature defect fetches** (Jira API calls). Process features in batches.
- **Per-feature**: Maximum **5 parallel PR sub-agents** at any time to prevent GitHub API abuse.
- If a sub-agent fails after retries, log the failure in `task.json` under `failed_prs[]` and continue (graceful degradation).

### 5.5 Error Handling Scenarios

Specific failure modes that must be handled gracefully, in addition to the general retry policy (Section 5.3):

| Scenario | Required Behavior |
|---|---|
| **`task.json` missing or corrupted** with partial context on disk | Reconstruct minimal state from disk artifacts (count files in `context/prs/`, check for `jira_raw.json`, check for draft/final). Present: *"task.json was missing. Found: jira_raw.json (3 days old), 3/7 PRs analyzed, draft exists. Resume from inferred state or restart from scratch?"* |
| **External API unreachable** during Smart Refresh (Jira down, GitHub rate-limited) | After retries exhausted, offer: *"Jira API is unreachable. Use cached jira_raw.json from [date] and generate anyway? A staleness warning will be embedded in the report."* Never silently use stale data. |
| **Partial PR cache** (some PRs have impact files, some don't) | Only spawn sub-agents for the missing PRs. Never re-run already-completed PR analyses unless Full Regenerate is chosen. |
| **Phase 3 (report generation) fails**; raw context is intact | On the next invocation, the tiered check detects "context only" state. Offer *"Generate from Cache"* as the default — no API calls needed to recover. |
| **User requests Full Regenerate on data < 1 hour old** | Warn: *"Data was fetched N minutes ago. Are you sure you want to re-fetch everything?"* Require explicit confirmation before proceeding. |
| **Release-scoped: mixed states across features** | Display the per-feature state matrix (Phase 0a, step 3). Default plan skips features with existing finals. User must explicitly choose to regenerate those. |
| **Archive collision** (two reports generated on the same calendar day) | Append `_<HHmm>` to the archive filename: `<KEY>_REPORT_FINAL_20260226_1430.md`. |

**Staleness warning banner**: When generating a report using cached Jira data due to an API failure, embed this notice at the top of the report:

```markdown
> ⚠️ **Data Freshness Warning**: Jira data in this report is from <DATE> (<N> days old).
> The Jira API was unreachable at regeneration time. Re-run with Smart Refresh when
> Jira is available to get current defect statuses.
```

---

## 6. Standardized Report Output Format

The `defect-analysis-reporter` skill generates reports in the following **mandatory structure**. This format matches the reference example at `projects/defects-analysis/qa_risk_report_BCIN-6637_defects_20260128.md`.

### 6.1 Report Header

```markdown
# QA Risk & Defect Analysis Report
## <FEATURE_KEY>: <Feature Summary>

**Report Date:** <Date>
**Feature:** <Feature Title>
**Total Defects Analyzed:** <N>
```

### 6.2 Executive Summary
Must include a Defect Distribution Table (`Metric`, `Count`, `Percentage`) and an overall Risk Rating with rationale.

### 6.3 Defect Breakdown by Status
- **✅ Completed Defects**: `ID`, `Summary`, `Priority`, `Fixed Date` (optionally include `Fix Risk Analysis` if not covered by a global table).
- **🔄 In Progress Defects**: `ID`, `Summary`, `Priority`, `Assignee`.
- **📋 To Do Defects**: `ID`, `Summary`, `Priority`, `Assignee`.
- **📊 Additional Open Defects** (optional): For other unresolved statuses.

### 6.4 Risk Analysis by Functional Area
Group defects by area (e.g., NDE Support, Pin/Freeze/Hide), assigning a Risk Level (🔴 HIGH, 🟡 MEDIUM, 🟢 LOW). Summarize Issues, Impact, and Testing Focus.

### 6.5 Defect Analysis by Priority
Break down by **High Priority** vs **Medium/Low Priority**, identifying critical open items and completion rates.

### 6.6 Code Change Analysis
Summarize PR data (from `context/prs/`):
- **Fix Complexity Assessment** (High/Medium/Low) based on changes.
- *Note:* If PR links are missing, explicitly state: `"PR links were not found..."`

### 6.7 Residual Risk Assessment
Summarize the Overall Risk Level and specific Risk Factors (e.g., Complex Interaction, Edge Case Sensitivity).

### 6.8 Recommended QA Focus Areas
Prioritized checklists of specific testing scenarios (Critical, High, Medium, Low) and Exploratory Testing Recommendations.

### 6.9 Test Environment Recommendations
Required Test Instances, Feature Flags, and Test Data Requirements.

### 6.10 Verification Checklist for Release
Pre-release validation checklists and Known Limitations to Document.

### 6.11 Conclusion
Execution of Risk Mitigation Strategy (Immediate, Pre-Release, Post-Release) & Recommended Action (DO NOT RELEASE / READY FOR RELEASE).

### 6.12 Appendix: Defect Reference List
Markdown table mapping IDs to direct Jira URLs.

---

## 7. Skills

All skills reside in `workspace-reporter/skills/`. Only CLI/scripts from these directories will be used (no direct MCP calls in the agent workflow).

### 7.1 Skill: `defect-analysis-reporter`

**Location:** `workspace-reporter/skills/defect-analysis-reporter/SKILL.md`

**Purpose:** Given aggregated defect data (Jira issues JSON + PR impact summaries), generate a Markdown report conforming exactly to the format in Section 6.

**Key Responsibilities of this Skill:**
1. Parse input data (list of defects with status, priority, assignee, fixed date, PR analysis).
2. Compute defect distribution statistics (counts and percentages by status and priority).
3. Determine overall risk rating based on: open high-priority defects count, number of functional areas affected, and open vs. total defect ratio.
4. Render each section (Executive Summary, Defect Breakdown, Risk by Area, Recommended Focus) in the correct format.
5. Output a single Markdown file.

### 7.2 Existing Skills Used

| Skill | Purpose |
|---|---|
| **`jira-cli`** | Paginated JQL execution, issue detail fetching, status/priority/assignee extraction |
| **`github`** | PR diff fetching, commit history, file change analysis for Fix Risk Analysis column |
| **`confluence`** | Publish finalized reports to Confluence upon user approval |
| **`clawddocs`** | Agent self-navigation within workspace structure |
| **`message` (Feishu)** | Notify team channels if Confluence update is skipped |

---

## 8. Workflow Definition

The workflow file is at `workspace-reporter/.agents/workflows/defect-analysis.md`.

```markdown
---
description: Run defect analysis for a Jira feature, JQL query, or release. Generates standardized QA risk reports. Always confirms with user before proceeding to next phases.
---

## 0. Preparation
1. Accept Feature ID, JQL, or release version from user.
2. Confirm requirements with user. Do not proceed without approval.
3. Run scripts/check_resume.sh to detect in-progress state.
4. Initialize task.json (single-feature or release batch).

## 0a. Release Discovery (if release given)
1. Run JQL: "QA Owner..." = currentUser() AND "Release..." = <VERSION> AND type = Feature
2. Save to context/features_raw.json
3. **STOP. Present feature list to user. Ask: "Proceed with all, or select subset?"**
4. Do NOT fetch defects until user confirms.

## 1. Jira Extraction (per feature)
- Single: scripts/retry.sh 3 2 jira issue list --jql 'issuetype = Defect AND ...' > context/jira_raw.json
- Release: For each feature (max 3–5 parallel), same JQL with <FEATURE_KEY> substituted. Save to release_<VERSION>/<FEATURE_KEY>/context/jira_raw.json

## 2. Issue Triage & PR Extraction
Parse jira_raw.json per feature. Extract PR links.

## 3. Parallel PR Analysis (max 5 concurrent per feature)
For each PR: github skill → Fix Risk Analysis → context/prs/<PR_ID>_impact.md

## 4. Report Generation (per feature)
Invoke defect-analysis-reporter. Save <FEATURE_KEY>_REPORT_DRAFT.md per feature.

## 4a. AI Self-Review (per feature)
Review <FEATURE_KEY>_REPORT_DRAFT.md against checklist.
Auto-fix objective errors (1-2 retries). Save summary to <FEATURE_KEY>_REVIEW_SUMMARY.md.

## 5. User Approval
Pause and ask user to review draft(s) and any _REVIEW_SUMMARY.md files. Confirm before publish.

## 6. Publish
If approved: confluence/message skill. Copy to REPORT_FINAL.md. Update task.json.
```

---

## 9. Integration with Feature Summary Workflow

The **Defect Analysis Workflow** is designed to be invoked as a **sub-step** within the Feature Summary Workflow. When the Feature Summary Workflow needs to assess the defect health of a feature, it:

1. Calls this defect analysis workflow with the feature's JQL or issue key.
2. Receives the generated `<FEATURE_KEY>_REPORT_FINAL.md` as output.
3. Incorporates the **Executive Summary section** (defect distribution table + risk rating) and the **Risk Analysis by Functional Area** section into the overall feature summary report.

**Integration Contract:**
- **Input**: Feature ID or JQL query string.
- **Output**: Path to `<FEATURE_KEY>_REPORT_FINAL.md` (standardized format, Section 6).
- **Consumed Sections by Feature Summary Workflow**:
  - `Executive Summary` → for the feature's defect health snapshot.
  - `Risk Analysis by Functional Area` → for identifying areas needing focused QA attention.
  - `Recommended QA Focus Areas` → merged into the feature's overall test strategy.

This modular design ensures the Reporter Agent can run standalone for ad-hoc defect analysis, *or* be composed as a building block within larger orchestration pipelines.

---

## 10. Skill & Tool Utilization Matrix

| Skill / Tool | Phase Used | Purpose |
|---|---|---|
| `jira-cli` | Phase 0b, 1 | Project list fetch, paginated JQL execution, issue status/priority/assignee/resolution date |
| `github` | Phase 2 | PR diff analysis → Fix Risk Analysis column data |
| `defect-analysis-reporter` | Phase 3 | Standardized Markdown report generation (Section 6 format) |
| `report-quality-reviewer` | Phase 4a | Quality gate: section completeness, defect count, 20/80 focus, risk coherence, PR coverage |
| `confluence` | Phase 4 | Publish final report to Confluence space |
| `message` (Feishu) | Phase 4 | Team channel notification if Confluence publish skipped |
| `clawddocs` | Any | Agent self-navigation within workspace |

---

## 11. Quality Criteria

The generated report and the workflow execution are considered **complete and valid** when:

### User Confirmation (Mandatory)
- [ ] No transition to Phase 0a→1 (defect fetch) without user confirming the feature list when release-scoped.
- [ ] No publish (Confluence/Feishu) without explicit user approval.
- [ ] Agent raises clarifying questions for ambiguous input instead of assuming.

### Report Quality
- [ ] Executive Summary contains the defect distribution table with correct counts and percentages.
- [ ] Executive Summary contains the overall Risk Rating and a ≥2-sentence concise reason.
- [ ] Completed Defects table includes all 5 columns: ID, Summary, Priority, Fixed Date, Fix Risk Analysis.
- [ ] In Progress and To Do tables include all 4 columns: ID, Summary, Priority, Assignee.
- [ ] Risk Analysis by Functional Area covers all meaningful groupings with Risk Level and Testing Focus.
- [ ] Recommended QA Focus Areas are actionable and tied to open defects.

### AI Self-Review
- [ ] Separate `_REVIEW_SUMMARY.md` is correctly generated containing quality checklist results and focus areas.
- [ ] Modulo objective fixes, no agent subjective modifications are made to the draft automatically without user confirmation.

### Scalability
- [ ] Handles >50 defects via paginated Jira API calls without data loss.
- [ ] Release-scoped: parallel defect fetch for up to 3–5 features at a time.
- [ ] Parallel PR analysis capped at 5 concurrent sub-agents per feature.
- [ ] No single phase runs for >5 minutes without emitting a heartbeat.

### Resilience
- [ ] `task.json` accurately reflects the current phase at all times.
- [ ] All API calls wrapped in retry logic (Section 5.3).
- [ ] Failed PR analyses logged and report notes missing analysis instead of crashing.
- [ ] Intermediate artifacts allow full resume without re-calling external APIs.

### Idempotency & Report Lifecycle
- [ ] Phase 0 performs the Report Status Check before any API call for all input modes.
- [ ] Agent displays data freshness (timestamps and ages) before presenting re-run options.
- [ ] No `_REPORT_FINAL.md` is overwritten without first being moved to `archive/`.
- [ ] Smart Refresh reuses PR impact files < 7 days old; only re-analyzes missing/stale PRs.
- [ ] `task.json` includes `jira_fetched_at`, `pr_analysis_timestamps`, and `archive_log` fields.
- [ ] If `task.json` is missing/corrupted, agent reconstructs state from disk artifacts before asking the user.
- [ ] If Jira API fails during a refresh, agent offers to use cached data with a staleness warning in the report header.
- [ ] Release-scoped runs display a per-feature state matrix before requesting user approval to proceed.

### Clarity
- [ ] All folder paths follow the architecture in Section 3.
- [ ] Report is self-contained — a reader without Jira access can understand the status and risk.
- [ ] No placeholder text in the final report.
