# Feature Planner Agent — Design Enhancements

> **Status**: Proposal  
> **Created**: 2026-02-25  
> **Parent Design**: [`FEATURE_PLANNER_AGENT_DESIGN.md`](./FEATURE_PLANNER_AGENT_DESIGN.md)  
> **Author**: Atlas Planner Agent  

---

## Table of Contents

1. [Tool Landscape Clarification](#1-tool-landscape-clarification)
2. [Parallel Context Gathering](#2-parallel-context-gathering)
3. [Progress Monitoring — `task.json` & Heartbeat](#3-progress-monitoring--taskjson--heartbeat)
4. [Intermediate Documentation Artifacts](#4-intermediate-documentation-artifacts)
5. [Resilience & Fault Tolerance](#5-resilience--fault-tolerance)
6. [Summary & Priority Matrix](#6-summary--priority-matrix)

---

## 1. Tool Landscape Clarification

The original design referenced MCP tools (e.g. `mcp-atlassian`, `github` MCP). In the OpenClaw workspace, **we rely exclusively on CLI-based skills**, not MCP servers. This section maps each data source to its correct skill.

### 1.1 Available Skills Inventory

| Data Source | Skill Name | CLI Tool | Location |
|-------------|-----------|----------|----------|
| **Jira** | `jira-cli` | `jira` | `workspace-planner/skills/jira-cli/` |
| **Confluence** | `confluence` | `confluence` (confluence-cli) | `workspace-planner/skills/confluence/` |
| **GitHub** | `github` | `gh` (GitHub CLI) | `workspace-planner/skills/github/` |
| **Figma** | `qa-plan-figma` + `agent-browser` | `agent-browser` | `workspace-planner/skills/qa-plan-figma/` + `workspace-planner/skills/agent-browser/` |
| **Web Search** | `tavily-search` / `brave-search` | varies | `workspace-planner/skills/` |

### 1.2 Skill Usage Patterns

#### Jira — `jira-cli`

```bash
# Fetch issue details (description, ACs, comments)
jira issue view BCIN-1234

# Fetch as JSON for programmatic parsing
jira issue view BCIN-1234 --raw

# List linked issues
jira issue list -pBCIN --plain

# Export for reference (save to context/)
jira issue view BCIN-1234 --raw > context/jira_context.json
```

**Key capability**: Extracts summaries, acceptance criteria, comments, and linked issues. The agent parses comments to discover linked PR URLs and Confluence page IDs.

#### Confluence — `confluence` skill (confluence-cli)

```bash
# Search for design docs
confluence search "feature login design"

# Read a specific page by ID
confluence read 123456

# Get page metadata
confluence info 123456

# Find page by title
confluence find "Login Feature PRD"

# List child pages (for hierarchical docs)
confluence children 123456

# Export page with attachments
confluence export 123456 --output ./context/confluence_export/

# Publish final QA plan
confluence create "QA Plan: Login Feature" SPACEKEY --file qa_plan_final.md --format markdown

# Update existing page
confluence update 123456 --file qa_plan_final.md --format markdown
```

> ⚠️ **Important**: We do NOT use `mcp-atlassian` Confluence tools. All Confluence operations go through the `confluence-cli` binary. Config lives at `~/.confluence-cli/config.json`. Requires `CONFLUENCE_TOKEN` env var.

#### GitHub — `gh` CLI

```bash
# View PR details
gh pr view 456 --repo owner/repo

# Get PR diff
gh pr diff 456 --repo owner/repo

# Check CI status
gh pr checks 456 --repo owner/repo

# List changed files
gh pr view 456 --repo owner/repo --json files --jq '.files[].path'

# Get PR metadata as JSON
gh api repos/owner/repo/pulls/456 --jq '{title, state, user: .user.login, changed_files, additions, deletions}'

# View commit history
gh api repos/owner/repo/pulls/456/commits --jq '.[].commit.message'

# Get specific file diff (selective fetch for context budget)
gh api repos/owner/repo/pulls/456/files --jq '.[] | select(.filename | test("src/")) | {filename, status, additions, deletions, patch}'
```

> ⚠️ **Important**: We do NOT use the `github` MCP server. All GitHub operations go through the `gh` CLI. Requires `gh auth login` to be configured.

### 1.3 Browser Subagent for Figma — How It Works

The original design mentions "spawning a `browser_subagent`" for Figma. Here's exactly how this works in the OpenClaw ecosystem:

#### Option A: `agent-browser` CLI Skill (Recommended)

The `agent-browser` skill (`workspace/skills/agent-browser/`) provides a **headless Rust-based CLI** for browser automation. It does NOT require spawning a separate agent — the Planner Agent calls it directly.

```bash
# 1. Navigate to Figma
agent-browser open "https://figma.com/design/abc123/LoginFlow?node-id=1-2"

# 2. Wait for page load
agent-browser wait --load networkidle

# 3. Screenshot the design
agent-browser screenshot --full figma_screenshot.png

# 4. Get interactive element snapshot
agent-browser snapshot -i

# 5. Navigate through frames (click on different pages/frames)
agent-browser click @e5  # Click a frame reference

# 6. Take per-frame screenshots
agent-browser screenshot frame_login.png

# 7. Close browser
agent-browser close
```

**Parallel sessions** (for multiple Figma pages):
```bash
# Session 1: Login page
agent-browser --session figma1 open "https://figma.com/design/abc123/LoginFlow?node-id=1-2"
agent-browser --session figma1 screenshot --full login_page.png

# Session 2: Dashboard page (runs in parallel)
agent-browser --session figma2 open "https://figma.com/design/abc123/LoginFlow?node-id=3-4"
agent-browser --session figma2 screenshot --full dashboard_page.png
```

#### Option B: `browser-use` Cloud API (For Complex Figma Extraction)

The `browser-use` skill (`workspace/skills/browser-use/`) provides **cloud-hosted browsers** with an autonomous subagent mode. This is useful when Figma extraction is complex (e.g., navigating prototypes, extracting annotations).

```bash
# Spawn autonomous browser task
curl -X POST "https://api.browser-use.com/api/v2/tasks" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Navigate to Figma URL, screenshot all frames in the Login Flow, extract component names and states, list all interactive elements. Save screenshots.",
    "llm": "browser-use-llm",
    "startUrl": "https://figma.com/design/abc123/LoginFlow",
    "maxSteps": 50,
    "vision": true
  }'

# Poll for completion
curl "https://api.browser-use.com/api/v2/tasks/<task-id>" \
  -H "X-Browser-Use-API-Key: $API_KEY"
```

**Status values**: `pending` → `running` → `finished` / `failed` / `stopped`


#### Decision Matrix — Which Browser Approach to Use

| Scenario | Recommended Tool | Why |
|----------|-----------------|-----|
| Simple screenshot capture | `agent-browser` CLI | Fast, no cloud dependency |
| Complex prototype navigation | `browser-use` cloud | Autonomous AI handles navigation |
| Figma API data (components, tokens) | Figma MCP (if available) | Structured data, no rendering |
| Multiple pages in parallel | `agent-browser --session` | Local parallel sessions |
| Figma requires auth/login | `agent-browser` + `state save/load` | Persist Figma login state |

---

## 2. Parallel Context Gathering

### 2.1 The Problem

Phase 1 (Information Gathering) currently describes 4 sequential steps: Jira → Confluence → Figma → GitHub. These are **independent data sources with no interdependency** at the initial fetch level.

### 2.2 Tiered Parallelism Model

**Tier 1 — Fully Independent (execute simultaneously):**

| Task ID | Skill | Command | Output File |
|---------|-------|---------|-------------|
| `jira_extract` | `jira-cli` | `jira issue view BCIN-1234 --raw` | `context/jira_context.json` |
| `confluence_extract` | `confluence` | `confluence read <page-id>` | `context/confluence_context.md` |
| `github_pr_extract` | `github` | `gh pr view 456 --repo org/app --json ...` | `context/github_context.json` |
| `figma_browse` | `agent-browser` | `agent-browser open <url> && screenshot` | `context/figma_screenshots/` |

**Tier 2 — Dependent on Tier 1 results:**

| Task ID | Depends On | Skill | Purpose |
|---------|-----------|-------|---------|
| `jira_linked_prs` | `jira_extract` | `github` | Discover PRs from Jira comments |
| `jira_linked_confluence` | `jira_extract` | `confluence` | Discover Confluence pages from Jira links |
| `tavily_supplement` | All Tier 1 | `tavily-search` | Fill knowledge gaps discovered from context |

### 2.3 Execution Timeline

```
Time ─────────────────────────────────────────────────>

Tier 1 (parallel):
  [jira_extract ████         ]  ~5s
  [confluence_extract ████████ ]  ~8s
  [github_pr_extract ██████    ]  ~10s
  [figma_browse ██████████████████████████████]  ~30s
                                                  ↓
Tier 2 (after Tier 1 completes):                  ↓
  [jira_linked_prs ██████ ]  ~10s                 ↓
  [jira_linked_confluence ████ ]  ~5s             ↓
                                                  ↓
Total wall-clock: ~45s (vs ~68s sequential)       ↓
```

### 2.4 Practical Implementation in the Agent Workflow

Since the Planner Agent is a single agent (not a multi-process system), "parallel" execution uses **background commands**:

```bash
# Step 1: Launch all Tier 1 tasks as background processes
jira issue view BCIN-1234 --raw > context/jira_context.json &
PID_JIRA=$!

confluence read 123456 > context/confluence_context.md &
PID_CONFLUENCE=$!

gh pr diff 456 --repo org/app > context/github_pr_diff.patch &
PID_GITHUB=$!

agent-browser open "https://figma.com/design/..." &
PID_FIGMA=$!

# Step 2: Wait for all to complete
wait $PID_JIRA $PID_CONFLUENCE $PID_GITHUB $PID_FIGMA

# Step 3: Verify all outputs exist
for f in context/jira_context.json context/confluence_context.md context/github_pr_diff.patch; do
  [ -f "$f" ] || echo "WARNING: $f not found — applying degradation policy"
done

# Step 4: Tier 2 — Parse Jira for linked PRs/pages
# (extract from jira_context.json, then fetch additional data)
```

### 2.5 Context Manifest File

Create `context/manifest.json` at the start of every run to declare all gathering tasks:

```json
{
  "run_id": "feat-login-2026-02-25",
  "feature_id": "BCIN-1234",
  "created_at": "2026-02-25T17:06:18+08:00",
  "tier1_tasks": [
    {
      "id": "jira_extract",
      "skill": "jira-cli",
      "command": "jira issue view BCIN-1234 --raw",
      "output": "context/jira_context.json",
      "status": "pending",
      "required": true
    },
    {
      "id": "confluence_extract",
      "skill": "confluence",
      "command": "confluence read 123456",
      "output": "context/confluence_context.md",
      "status": "pending",
      "required": false
    },
    {
      "id": "github_pr_extract",
      "skill": "github",
      "command": "gh pr diff 456 --repo org/app",
      "output": "context/github_pr_diff.patch",
      "status": "pending",
      "required": false
    },
    {
      "id": "figma_browse",
      "skill": "agent-browser",
      "command": "agent-browser open https://figma.com/...",
      "output": "context/figma_screenshots/",
      "status": "pending",
      "required": false
    }
  ],
  "tier2_tasks": []
}
```

---

## 3. Progress Monitoring — `task.json` & Heartbeat

### 3.1 The Problem

The existing `HEARTBEAT.md` is a text-based checklist with no structured state. There's no way to:
- Know which phase the agent is in
- Know which subtasks completed or failed
- Resume after an agent session crash
- Report progress to external systems (Feishu, Jira)

### 3.2 `task.json` — The Single Source of Truth

Create at: `projects/feature-plan/<feature-id>/task.json`

This file is **read and updated at every phase transition** and serves as the checkpoint for recovery.

```json
{
  "task_id": "feat-login-2026-02-25",
  "feature_id": "BCIN-1234",
  "feature_name": "User Login Flow",
  "created_at": "2026-02-25T17:06:18+08:00",
  "updated_at": "2026-02-25T17:08:42+08:00",
  "overall_status": "in_progress",
  "data_fetched_at": "2026-02-25T17:06:30+08:00",
  "output_generated_at": null,
  "latest_draft_version": 1,
  "subtask_timestamps": {
    "jira": "2026-02-25T17:06:23+08:00",
    "confluence": "2026-02-25T17:06:26+08:00",
    "github": "2026-02-25T17:06:28+08:00",
    "figma": "2026-02-25T17:06:30+08:00",
    "qa-plan-atlassian": "2026-02-25T17:10:00+08:00",
    "qa-plan-github": "2026-02-25T17:10:05+08:00",
    "qa-plan-figma": "2026-02-25T17:10:08+08:00"
  },
  "current_phase": "context_gathering",
  "resume_from": null,
  "phases": {
    "context_gathering": {
      "status": "in_progress",
      "started_at": "2026-02-25T17:06:18+08:00",
      "completed_at": null,
      "subtasks": {
        "jira_extract": {
          "status": "completed",
          "started_at": "2026-02-25T17:06:18+08:00",
          "completed_at": "2026-02-25T17:06:23+08:00",
          "duration_s": 5,
          "output": "context/jira_context.json",
          "error": null
        },
        "confluence_extract": {
          "status": "completed",
          "started_at": "2026-02-25T17:06:18+08:00",
          "completed_at": "2026-02-25T17:06:26+08:00",
          "duration_s": 8,
          "output": "context/confluence_context.md",
          "error": null
        },
        "github_pr_extract": {
          "status": "in_progress",
          "started_at": "2026-02-25T17:06:18+08:00",
          "completed_at": null,
          "duration_s": null,
          "output": null,
          "error": null
        },
        "figma_browse": {
          "status": "in_progress",
          "started_at": "2026-02-25T17:06:18+08:00",
          "completed_at": null,
          "duration_s": null,
          "output": null,
          "error": null
        }
      }
    },
    "plan_generation": {
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "subtasks": {
        "cross_reference": { "status": "pending" },
        "draft_plan": { "status": "pending" },
        "tavily_supplement": { "status": "pending" }
      }
    },
    "review_refactor": {
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "iteration": 0,
      "max_iterations": 2,
      "subtasks": {
        "self_review": { "status": "pending", "score": null },
        "refactor": { "status": "pending" }
      }
    },
    "publication": {
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "subtasks": {
        "generate_markdown": { "status": "pending", "output": null },
        "publish_confluence": { "status": "pending", "confluence_page_id": null }
      }
    }
  },
  "degradation": {
    "skipped_sources": [],
    "warnings": []
  },
  "errors": [],
  "heartbeat_interval_s": 240,
  "last_heartbeat_at": null
}
```

### 3.3 Who Updates `task.json` and When

| Actor | Trigger | What's Updated |
|-------|---------|----------------|
| Orchestrator workflow | Phase transition | `current_phase`, phase `status`, `started_at` |
| Each extraction step | Step completion | Subtask `status`, `completed_at`, `output`, `duration_s` |
| Phase 1 (Context fetch) | After fetch complete | `data_fetched_at`, `subtask_timestamps.jira|confluence|github|figma` |
| Phase 2a (Domain analysis) | Each analysis complete | `subtask_timestamps.qa-plan-atlassian|qa-plan-github|qa-plan-figma` |
| Phase 2b (Synthesize) | Draft written | `latest_draft_version` |
| Phase 4 (Publication) | `qa_plan_final.md` written | `output_generated_at` |
| Error handler | Any failure | `errors[]` array, subtask `error` field |
| Heartbeat poll | Every 4 minutes | `updated_at`, `last_heartbeat_at` |
| Recovery logic | Agent restart | Reads `task.json`, sets `resume_from` |

### 3.4 Enhanced `HEARTBEAT.md` Protocol

The existing heartbeat should be updated to reference `task.json`:

```markdown
# HEARTBEAT.md — Enhanced Task Progress Protocol

When you receive a heartbeat poll:

1. **Read `task.json`** — Check `current_phase` and `overall_status`
2. **Calculate progress** — Count completed vs total subtasks in current phase
3. **Check for stale tasks** — Flag any subtask `in_progress` for > 5 minutes
4. **Check errors** — If `errors[]` is non-empty, report the latest error
5. **Update timestamps** — Set `updated_at` and `last_heartbeat_at`
6. **Report format**:
   - Active: `HEARTBEAT_PROGRESS | Phase: context_gathering | Progress: 2/4 | ETA: ~30s`
   - Stale: `HEARTBEAT_STALE | Phase: context_gathering | Stale: figma_browse (7min)`
   - Error: `HEARTBEAT_ERROR | Phase: context_gathering | Error: gh CLI auth failed`
   - Idle: `HEARTBEAT_OK`

### Feishu Integration

refer to feishu_uploader.sh in workspace-daily/projects/jenkins-analysis/scripts
workspace-daily/projects/jenkins-analysis/scripts/feishu_uploader.sh

forward heartbeat summaries:
- On phase transition → Feishu notification
- On error → Feishu alert with error details
- On completion → Feishu final report
```

### 3.5 Monitoring Dashboard (Future Enhancement)

`task.json` enables building a simple monitoring view:

```
┌─ Feature Plan: BCIN-1234 (User Login Flow) ──────────────────┐
│                                                               │
│  Phase 1: Context Gathering   ████████████████░░░░  75% (3/4) │
│    ✅ Jira Extract         5s                                  │
│    ✅ Confluence Extract   8s                                  │
│    ✅ GitHub PR Extract    10s                                 │
│    🔄 Figma Browse         running... (25s)                   │
│                                                               │
│  Phase 2: Plan Generation    ░░░░░░░░░░░░░░░░░░░░  pending    │
│  Phase 3: Review & Refactor  ░░░░░░░░░░░░░░░░░░░░  pending    │
│  Phase 4: Publication        ░░░░░░░░░░░░░░░░░░░░  pending    │
│                                                               │
│  Last heartbeat: 2026-02-25T17:08:42+08:00  (32s ago)        │
│  Errors: 0                                                    │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Intermediate Documentation Artifacts

### 4.1 The Problem

The current design only produces the **final QA Plan**. If an agent session dies mid-process, all context is lost. There's no audit trail showing how the plan was derived from source materials.

### 4.2 Proposed Artifact Directory Structure

```
projects/feature-plan/<feature-id>/
├── task.json                                  ← Progress tracker
├── context/                                   ← Phase 1: Raw extractions
│   ├── manifest.json                         ← Gathering task declarations
│   ├── jira_context.json                     ← Raw Jira issue data
│   ├── confluence_context.md                 ← Confluence page content
│   ├── github_context.json                   ← PR metadata, file list
│   ├── github_pr_diff.patch                  ← Full PR diff
│   ├── github_file_risk.md                   ← File-level risk classification
│   ├── figma_screenshots/                    ← Figma frame screenshots
│   │   ├── frame_login.png
│   │   ├── frame_dashboard.png
│   │   └── frame_settings.png
│   └── figma_context.md                      ← Figma component analysis
├── drafts/                                    ← Phase 2: Plan iterations
│   ├── qa_plan_draft_v1.md                   ← First generated draft
│   └── qa_plan_draft_v2.md                   ← After refactor (if any)
├── reviews/                                   ← Phase 3: Review artifacts
│   ├── review_v1.md                          ← First review findings
│   ├── review_v1_score.json                  ← Structured review score
│   └── review_v2.md                          ← Second review (if any)
├── changelog.md                               ← Cross-source change trail
└── qa_plan_final.md                           ← Phase 4: Final artifact
```

### 4.3 `changelog.md` — The Cross-Source Change Trail

This is the most valuable intermediate document. It captures what the agent **observed** across all sources and how they relate.

```markdown
# Feature Plan Changelog: BCIN-1234

## Meta
- **Generated**: 2026-02-25T17:30:00+08:00
- **Feature**: User Login Flow
- **Sources Analyzed**: Jira, Confluence, GitHub, Figma

---

## GitHub Changes Detected

### PR #456: "Implement user authentication"
- **Author**: @dev1
- **Reviewers**: @dev2, @dev3
- **CI Status**: ✅ All checks passed
- **Merge target**: `main`

### Changed Files Summary

| File | Change Type | +Lines | -Lines | Risk |
|------|------------|--------|--------|------|
| `src/api/auth/login.ts` | New File | +120 | 0 | 🔴 High |
| `src/components/LoginForm.tsx` | New File | +78 | 0 | 🟡 Medium |
| `db/migrations/001_add_users.sql` | New File | +45 | 0 | 🔴 High |
| `src/middleware/session.ts` | Modified | +23 | -12 | 🟡 Medium |
| `src/utils/validation.ts` | New File | +34 | 0 | 🟢 Low |
| `tests/auth.test.ts` | New File | +89 | 0 | 🟢 Low (test) |

### Key Code Observations
- New JWT-based auth flow (not OAuth2 as Confluence design doc suggests)
- Database migration adds `users` table with bcrypt password hashing
- Session middleware modified — existing session flows may be affected

---

## Jira Requirements Alignment

### Acceptance Criteria Coverage

| # | Acceptance Criteria | Found in PR? | Found in Figma? | Gap? |
|---|---------------------|-------------|-----------------|------|
| AC1 | Valid login redirects to dashboard | ✅ `login.ts:88` | ✅ Login frame | — |
| AC2 | Invalid login shows error message | ✅ `login.ts:95` | ✅ Error state frame | — |
| AC3 | Password reset via email | ⚠️ Partial (`email.ts`) | ❌ No reset frame | **GAP** |
| AC4 | Remember me checkbox | ❌ Not in PR | ✅ In Figma design | **GAP** |

### Linked Issues
- BCIN-1235: "Password reset flow" (separate PR, not yet merged)
- BCIN-1230: "Session management refactor" (completed, merged)

---

## Confluence Design Deviations

| Design Doc Says | PR Implements | Impact |
|-----------------|---------------|--------|
| OAuth2 authentication | JWT tokens | Test both flows? Or confirm JWT is final |
| 3rd-party login (Google, GitHub) | Not implemented | Out of scope for this release |
| Mobile responsive design | No responsive CSS in PR | Risk: mobile UX not tested |

---

## Figma → Code Gaps

| Figma Element | In Code? | Notes |
|---------------|----------|-------|
| "Remember Me" checkbox | ❌ Missing | AC4 not implemented |
| Error state (red border #D93025) | ✅ Matches | `validation.ts:12` |
| Loading spinner on submit | ❌ Missing | No loading state in `LoginForm.tsx` |
| Social login buttons | ❌ Missing | Deferred per Jira comments |

---

## QA Impact Assessment

### Must Test (derived from gaps above)
1. JWT auth flow (since OAuth2 was deferred)
2. Session middleware changes (regression risk)
3. Database migration rollback
4. Missing "Remember Me" — document as known limitation

### Known Limitations for This Release
- No social login
- No password reset (separate PR)
- No mobile responsive testing (CSS not in PR)
```

### 4.4 `github_file_risk.md` — Selective PR Analysis

To manage context window budget, classify files before deep-fetching diffs:

```markdown
# GitHub File Risk Classification: PR #456

## Classification Rules
- 🔴 **High Risk**: New API endpoints, DB migrations, auth/session changes
- 🟡 **Medium Risk**: UI components, middleware modifications
- 🟢 **Low Risk**: Tests, configs, docs, type definitions
- ⚪ **Skip**: Lock files, generated files, assets

## Results

### 🔴 High Risk — Full Diff Required
- `src/api/auth/login.ts` (+120 lines, new endpoint)
- `db/migrations/001_add_users.sql` (+45 lines, schema change)

### 🟡 Medium Risk — Summary Diff Sufficient
- `src/components/LoginForm.tsx` (+78 lines, new component)
- `src/middleware/session.ts` (+23/-12 lines, modified)

### 🟢 Low Risk — File List Only
- `src/utils/validation.ts` (+34 lines, utility)
- `src/types/auth.ts` (+15 lines, type definitions)

### ⚪ Skipped
- `tests/auth.test.ts` (test file)
- `package-lock.json` (generated)

## Context Budget
- Total files in PR: 8
- Full diffs fetched: 2 (~165 lines)
- Summary diffs fetched: 2 (~100 lines summarized)
- Estimated context tokens: ~2,000 (within 4,000 budget)
```

### 4.5 `review_v1_score.json` — Structured Review Output

```json
{
  "review_version": 1,
  "reviewed_at": "2026-02-25T17:45:00+08:00",
  "overall_score": 0.72,
  "categories": {
    "acceptance_criteria_coverage": { "score": 0.75, "note": "AC3 and AC4 not fully covered" },
    "edge_case_coverage": { "score": 0.60, "note": "Missing network failure scenarios" },
    "risk_assessment": { "score": 0.85, "note": "Good coverage of DB migration risks" },
    "test_data_specified": { "score": 0.70, "note": "Missing locked account test data" },
    "performance_coverage": { "score": 0.65, "note": "No load test scenarios for login API" },
    "security_coverage": { "score": 0.80, "note": "SQL injection and XSS covered" }
  },
  "action_items": [
    "Add AC3 (password reset) as known limitation",
    "Add AC4 (remember me) as known limitation",
    "Add network failure edge cases for login flow",
    "Add load test scenario for POST /api/auth/login",
    "Specify locked account test data"
  ],
  "recommendation": "refactor_needed"
}
```

---

## 5. Resilience & Fault Tolerance

### 5.1 Risk Map

| # | Failure Mode | Impact | Likelihood | Current Mitigation |
|---|-------------|--------|-----------|-------------------|
| R1 | `agent-browser` Figma session crashes | Pipeline stalls, no Figma context | 🟡 Medium | None |
| R2 | `jira-cli` auth token expired | Cannot fetch requirements | 🟡 Medium | None |
| R3 | `confluence` CLI timeout | Missing design doc context | 🟡 Medium | None |
| R4 | `gh` CLI rate limited | Cannot fetch PR diffs | 🟢 Low | None |
| R5 | Agent session killed mid-plan | All progress lost | 🔴 High | None |
| R6 | Context window overflow (large PR) | Agent truncates/hallucinates | 🔴 High | None |
| R7 | Confluence publish fails | Plan exists locally only | 🟡 Medium | None |
| R8 | Review loop doesn't converge | Never reaches publication | 🟢 Low | "1-2 times" text |

### 5.2 Strategy 1: Checkpoint-Based Recovery

Every phase writes its output to disk **before** updating `task.json`. If the agent dies, a new session reads `task.json` and resumes from the last completed phase.

```
Phase completed → Write output files to disk → Update task.json status → Proceed to next phase
                                                        ↑
Agent crashes ────────────────────────────────────────────┘
                                                        ↓
Agent restarts → Read task.json → Skip completed phases → Resume from current_phase
```

**Implementation — Recovery Check Script:**

```bash
#!/bin/bash
# scripts/check_resume.sh — Check if a feature plan can be resumed

FEATURE_DIR="projects/feature-plan/$1"
TASK_FILE="$FEATURE_DIR/task.json"

if [ ! -f "$TASK_FILE" ]; then
  echo "NO_TASK — Start fresh"
  exit 0
fi

CURRENT_PHASE=$(cat "$TASK_FILE" | jq -r '.current_phase')
STATUS=$(cat "$TASK_FILE" | jq -r '.overall_status')

if [ "$STATUS" = "completed" ]; then
  echo "COMPLETED — Nothing to resume"
  exit 0
fi

echo "RESUMABLE — Phase: $CURRENT_PHASE"

# List completed context files
echo "Available context files:"
ls -la "$FEATURE_DIR/context/" 2>/dev/null

# Show incomplete subtasks
echo "Incomplete subtasks:"
cat "$TASK_FILE" | jq -r ".phases.$CURRENT_PHASE.subtasks | to_entries[] | select(.value.status != \"completed\") | .key"
```

### 5.3 Strategy 2: Graceful Degradation

Not all sources are equally critical. The plan should degrade gracefully when optional sources fail.

```json
{
  "degradation_policy": {
    "jira_extract": {
      "required": true,
      "fallback": "abort",
      "reason": "Without Jira requirements, no plan can be generated"
    },
    "confluence_extract": {
      "required": false,
      "fallback": "skip_with_warning",
      "reason": "Plan will lack design doc context but can proceed from Jira ACs"
    },
    "github_pr_extract": {
      "required": false,
      "fallback": "skip_with_warning",
      "reason": "Plan will lack code-level risk analysis but can proceed from requirements"
    },
    "figma_browse": {
      "required": false,
      "fallback": "skip_with_warning",
      "reason": "Plan will lack UI/UX test scenarios but can cover functional testing"
    }
  }
}
```

**Impact on final QA plan**:
- Skipped sources are documented as `⚠️ NOT ANALYZED — [reason]`
- The plan includes a "Confidence Level" based on sources analyzed:
  - 4/4 sources: 🟢 High Confidence
  - 3/4 sources: 🟡 Medium Confidence  
  - 2/4 sources: 🟠 Low Confidence
  - 1/4 sources: 🔴 Minimum Viable (Jira only)

### 5.4 Strategy 3: Context Window Management

PR diffs can be massive. Use a **budget-based selective fetch** strategy.

**Step 1**: Fetch file list only (lightweight)
```bash
gh pr view 456 --repo org/app --json files --jq '.files[] | {path: .filename, status: .status, additions: .additions, deletions: .deletions}'
```

**Step 2**: Classify files by risk (see `github_file_risk.md` template above)

**Step 3**: Selective deep fetch — only high-risk files
```bash
# Only fetch diffs for high-risk files
gh api repos/org/app/pulls/456/files \
  --jq '.[] | select(.filename | test("src/api|db/migrations|middleware")) | {filename, patch}'
```

**Step 4**: Summarize per-file — each diff → 5-10 line summary

**Budget**: Cap total GitHub context at ~4,000 tokens.

### 5.5 Strategy 4: Retry with Backoff

For CLI tool failures, wrap calls in a retry function:

```bash
# scripts/retry.sh — Retry a command with exponential backoff
retry_command() {
  local max_attempts=3
  local delay=2
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    if "$@"; then
      return 0
    fi
    echo "Attempt $attempt failed. Retrying in ${delay}s..."
    sleep $delay
    delay=$((delay * 2))
    attempt=$((attempt + 1))
  done

  echo "All $max_attempts attempts failed for: $*"
  return 1
}

# Usage:
retry_command jira issue view BCIN-1234 --raw > context/jira_context.json
retry_command confluence read 123456 > context/confluence_context.md
retry_command gh pr diff 456 --repo org/app > context/github_pr_diff.patch
```

### 5.6 Strategy 5: Review Loop Circuit Breaker

Prevent infinite review/refactor loops:

```json
{
  "review_circuit_breaker": {
    "max_iterations": 2,
    "quality_threshold": 0.80,
    "rules": {
      "stop_if_score_above_threshold": true,
      "stop_if_score_unchanged_between_iterations": true,
      "minimum_improvement_to_continue": 0.05,
      "absolute_hard_maximum": 3
    }
  }
}
```

**Logic**:
1. After review v1: if `score >= 0.80` → skip refactor, proceed to publish
2. After refactor + review v2: if `score_v2 - score_v1 < 0.05` → stop (diminishing returns)
3. Never exceed 3 iterations regardless of score

### 5.7 Strategy 6: Idempotent Publication

Ensure Confluence publishing is safe to retry:

```bash
# Step 1: Check if page already exists
EXISTING_PAGE=$(confluence find "QA Plan: BCIN-1234 Login Flow" 2>/dev/null)

if [ -n "$EXISTING_PAGE" ]; then
  # Update existing page
  PAGE_ID=$(echo "$EXISTING_PAGE" | head -1 | awk '{print $1}')
  confluence update "$PAGE_ID" --file qa_plan_final.md --format markdown
  echo "Updated existing page: $PAGE_ID"
else
  # Create new page
  confluence create "QA Plan: BCIN-1234 Login Flow" SPACEKEY --file qa_plan_final.md --format markdown
  echo "Created new page"
fi

# Step 2: Save page ID to task.json for future reference
# (update publication subtask with confluence_page_id)
```

### 5.8 Strategy Summary — Defense in Depth

```
Layer 1: PREVENTION
  ├── Context budget management (avoid overflow)
  ├── Circuit breaker on review loops
  └── Retry with backoff (handle transient failures)

Layer 2: DETECTION
  ├── task.json tracks all subtask statuses
  ├── Heartbeat polls detect stale tasks
  └── Error array captures failure context

Layer 3: RECOVERY
  ├── Checkpoint-based resume from last phase
  ├── Graceful degradation for optional sources
  └── Idempotent publication (safe to retry)

Layer 4: OBSERVABILITY
  ├── changelog.md provides audit trail
  ├── Intermediate artifacts survive session death
  └── Feishu notifications for human awareness
```

---

## 6. Summary & Priority Matrix

| # | Enhancement | Area | Priority | Effort | Impact |
|---|------------|------|----------|--------|--------|
| 1 | Correct tool references (skills only, no MCP) | Foundation | 🔴 P0 | Low | Prevents confusion |
| 2 | Document browser subagent options (`agent-browser`, `browser-use`) | Foundation | 🔴 P0 | Low | Enables Figma extraction |
| 3 | `task.json` progress tracker | Monitoring | 🔴 P0 | Medium | Enables all monitoring |
| 4 | Checkpoint-based recovery | Resilience | 🔴 P0 | Medium | Prevents total progress loss |
| 5 | Parallel Tier 1 context gathering | Performance | 🟡 P1 | Medium | ~25% faster execution |
| 6 | `changelog.md` cross-source change trail | Documentation | 🟡 P1 | Medium | Audit trail + future reference |
| 7 | Context directory structure (`context/`, `drafts/`, `reviews/`) | Documentation | 🟡 P1 | Low | Organized artifacts |
| 8 | Graceful degradation policy | Resilience | 🟡 P1 | Low | Handles partial failures |
| 9 | Enhanced `HEARTBEAT.md` referencing `task.json` | Monitoring | 🟡 P1 | Low | Structured progress reports |
| 10 | Context window budget (selective PR fetch) | Resilience | 🟡 P1 | Medium | Prevents hallucination |
| 11 | Retry with exponential backoff | Resilience | 🟢 P2 | Low | Handles transient failures |
| 12 | Review loop circuit breaker | Resilience | 🟢 P2 | Low | Prevents infinite loops |
| 13 | Idempotent Confluence publication | Resilience | 🟢 P2 | Low | Safe republishing |
| 14 | `review_score.json` structured scoring | Documentation | 🟢 P2 | Low | Quantitative review |
| 15 | Feishu heartbeat integration | Monitoring | 🟢 P3 | Medium | External visibility |

---

## Appendix A: File Reference

| File | Purpose | Created By | Read By |
|------|---------|-----------|---------|
| `task.json` | Progress + checkpoint state | Orchestrator | Heartbeat, Recovery, Monitor |
| `context/manifest.json` | Gathering task declarations | Orchestrator | Context gathering phase |
| `context/jira_context.json` | Raw Jira data | `jira-cli` | Plan generation |
| `context/confluence_context.md` | Raw Confluence data | `confluence` CLI | Plan generation |
| `context/github_context.json` | PR metadata | `gh` CLI | Plan generation |
| `context/github_pr_diff.patch` | Full/selective PR diff | `gh` CLI | Plan generation |
| `context/github_file_risk.md` | File risk classification | Orchestrator | Selective fetch |
| `context/figma_context.md` | Figma component analysis | `agent-browser` | Plan generation |
| `context/figma_screenshots/` | Figma frame images | `agent-browser` | Plan generation, Review |
| `drafts/qa_plan_draft_v*.md` | Plan iterations | Plan generation | Review phase |
| `reviews/review_v*.md` | Review findings | Review phase | Refactor phase |
| `reviews/review_v*_score.json` | Quantitative scores | Review phase | Circuit breaker |
| `changelog.md` | Cross-source change trail | Plan generation | Audit, Future reference |
| `qa_plan_final.md` | Final QA plan | Publication phase | Confluence, Stakeholders |

## Appendix B: Skill Dependencies

```
qa-plan-architect-orchestrator
  ├── reads from: jira-cli, confluence, gh, agent-browser
  ├── writes to: context/, drafts/, reviews/, changelog.md
  ├── delegates to: qa-plan-review, qa-plan-refactor
  └── publishes via: confluence CLI

jira-cli ──────────────┐
confluence CLI ────────┤
gh CLI ────────────────┼──→ context/ ──→ qa-plan-architect ──→ drafts/ ──→ qa-plan-review
agent-browser ─────────┘                                                        │
                                                                                ↓
                                                                          reviews/
                                                                                │
                                                                                ↓
                                                                   qa-plan-refactor ──→ qa_plan_final.md
                                                                                              │
                                                                                              ↓
                                                                                    confluence create/update
```
