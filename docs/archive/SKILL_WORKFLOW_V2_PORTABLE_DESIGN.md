# Skill Workflow v2 — Portable, Modular, Skill-First Design

> **Design ID:** `skill-workflow-v2`
> **Date:** 2026-03-06  
> **Status:** Draft (clean-slate proposal)  
> **Scope:** Generalize the v1 shell workflow design so that:
> - All workflows are expressed as Skills (portable, reusable), not ad‑hoc workflows.  
> - Cross-cutting logic is moved into shared skills under `.agents/skills`.  
> - Agent-specific logic stays under that agent’s workspace.  
> - Entrypoints are skills that orchestrate other skills.
>
> **Non-goal:** Migration plan for existing workflows. This is a clean-state design.

---

## 0. Problem Statement (v1 → v2)

### 0.1 v1 Summary

`skill-shell-workflow-v1` (see `docs/SKILL_SHELL_WORKFLOW_ENHANCEMENT_DESIGN.md`) solved one narrow problem:

- Replace NLG-only workflow descriptions in `openclaw-agent-design` / `openclaw-agent-design-review` with concrete shell scripts:
  - `run-agent-workflow.sh`
  - `create-manifest.sh`
  - `spawn-agents.js` (stdout handoff, no `sessions_spawn`)
  - `post-workflow.sh`
  - `lib/*.sh` helpers and tests

This made those two skills deterministic and testable, but it still treated the workflow as a **one-off bundle** tied to a single skill. Cross-cutting behaviors (Confluence publish, Jira search, Feishu notify, etc.) remained embedded inside that bundle.

### 0.2 Pain Points

1. **Non-portable workflows**
   - Each agent’s workflow embeds its own copy of “publish Confluence page”, “send Feishu notification”, “search Jira by JQL”, etc.
   - Reuse requires copy–paste or ad‑hoc re-implementation.

2. **Lack of modular skills**
   - There is no canonical “Jira search” skill or “Confluence publish + notify” skill.
   - Orchestrators cannot treat these as plug‑and‑play building blocks.

3. **Entry points are not clearly modeled as skills**
   - Some workflows live in `.agents/workflows/*.md` documents plus scripts, not as first-class skills with SKILL.md.
   - Agents must remember which script to call instead of calling a single entrypoint skill.

4. **Skill placement is ad‑hoc**
   - Some skills live under agent workspaces, some under `.agents`, some under `.cursor`.
   - There is no explicit rule for “shared vs agent-local” skills.

### 0.3 v2 Target State

1. **Everything is a Skill**
   - Workflows (entrypoints), building blocks (Jira/Confluence/notification), and glue (composition) are all modeled as skills with SKILL.md + scripts.

2. **Modular building blocks**
   - Cross-cutting capabilities (e.g. Jira search, Confluence publish+notify) become shared skills under `.agents/skills/`.
   - Agent workflows call these skills instead of inlining their logic.

3. **Skill entrypoints**
   - Each major workflow exposes a single entrypoint skill that orchestrates other skills.
   - The entrypoint skill is what a human or higher-level agent invokes.

4. **Clear placement rules**
   - Shared, composable skills live under `.agents/skills/`.
   - Agent-specific skills live under the agent’s workspace (e.g. `workspace-planner/skills/`).

5. **Portable, testable, shell-first**
   - Shell + Node orchestrators remain the implementation pattern from v1.
   - Only now they are organized into reusable skills rather than per-agent bundles.

---

## 1. Directory & Naming Conventions

### 1.1 Skill Placement Rules

1. **Shared / Integratable Skills**  
   - Location: `.agents/skills/<skill-name>/`  
   - Examples:
     - `.agents/skills/jira-smart-search/`
     - `.agents/skills/confluence-publish-and-notify/`
     - `.agents/skills/workflow-entrypoint-shell/` (generic entrypoint pattern, if needed)
   - Rule: If a skill’s behavior is useful for multiple agents or workflows, it belongs here.

2. **Agent-Local Skills**  
   - Location: `<agent-workspace>/skills/<skill-name>/`  
   - Examples:
     - `workspace-daily/skills/qa-daily-workflow/`
     - `workspace-reporter/skills/defect-analysis-orchestrator/`
   - Rule: If a skill is tightly coupled to a single agent’s domain, keep it local.

3. **Core OpenClaw Skills (conceptual, not moving in this design)**  
   - Location: `.cursor/skills/`  
   - Examples: `openclaw-agent-design`, `agent-idempotency`, etc.  
   - v2 design *uses* these but does not relocate them.

### 1.2 Skill Naming Guidelines

- Use kebab-case for directory names and `name:` frontmatter.
- Prefer names that describe behavior, not implementation:
  - `jira-smart-search` (not `jira-jql-helper`)
  - `confluence-publish-and-notify` (not `post-confluence-page`)
  - `qa-workflow-entrypoint` (per workflow family, e.g. `qa-summary-entrypoint`)

> **Rule:** If you can explain the skill in one short phrase (“search Jira issues”, “publish Confluence page and notify”), that phrase should be the `name:` and directory name.

---

## 2. Skill Types in v2

We distinguish three “classes” of skills:

1. **Entrypoint Skills**  
   - Orchestrate other skills to accomplish a multi-step workflow.  
   - Have minimal logic of their own; they are primarily composition.

2. **Building-Block Skills**  
   - Encapsulate one capability, e.g. “search Jira issues”, “publish Confluence page and send notification”.
   - Fully testable in isolation.

3. **Helper Skills (optional)**  
   - Wrap tools/CLIs in a consistent way (e.g. `jira-cli`, `confluence-cli` wrappers).
   - Usually not directly invoked by humans, but by other skills.

In practice, entrypoint and building-block skills use the same SKILL.md structure; the difference is how they are used.

---

## 3. Example v2 Skills

This section defines three concrete skills you asked for:

1. `jira-smart-search` (shared building block)  
2. `confluence-publish-and-notify` (shared building block)  
3. `qa-workflow-entrypoint` (entrypoint/orchestrator)

### 3.1 `jira-smart-search` (Shared)

**Goal:** Provide a single, reusable skill that runs Jira searches with smart handling of JQL and projects:

- If the JQL already contains a `project =` or `project in (...)` clause → run as-is.
- If JQL does not specify a project:
  - First fetch accessible projects (via `jira-cli projects` or equivalent).
  - Apply a default project selection strategy (e.g. “user favorites” or “all projects”) that is documented and overrideable.

**Placement:**  
`/.agents/skills/jira-smart-search/`

**Rough SKILL.md Template:**

```markdown
---
name: jira-smart-search
description: Run Jira searches with project-aware JQL rewriting. Use when Codex needs to search Jira issues, especially when user JQL omits project filters or project context is ambiguous.
---

# Jira Smart Search Skill

## Purpose

Provide a reusable Jira search capability that:
- Accepts user-supplied JQL or high-level filters.
- Ensures a project context is applied when missing.
- Wraps `jira-cli` in a consistent, testable way.

## Behavior

1. Input
   - `jql` (string, optional) — raw JQL from the user or calling skill.
   - `project` (string, optional) — explicit project key to force.
   - `limit` (int, optional, default 50) — max issues to return.

2. Project resolution
   - If `project` is provided → use it in JQL (insert or override).
   - Else, inspect `jql`:
     - If it already contains a `project` clause → use as-is.
     - Otherwise:
       - Call `jira-cli` to fetch projects (e.g. `jira project list`).
       - Select default project(s) using a documented strategy:
         - Default: first N favorite or recently used projects.
       - Inject `project in (KEY1, KEY2, ...)` into the JQL.

3. Execution
   - Call `jira-cli` with the final JQL, respecting `limit`.
   - Output machine-readable JSON (issues array) and a short human summary.

4. Output
   - `issues` (JSON array) — raw Jira issues.
   - `summary` (string) — human-readable summary of the search.

## Implementation Notes

- Implementation lives in `scripts/`:
  - `scripts/run-jira-smart-search.sh` — main entrypoint, shell + `jq`.
  - `scripts/lib/jira_jql.sh` — helper functions to inspect/modify JQL.
  - `scripts/lib/jira_cli.sh` — thin wrapper over `jira-cli`.

- Follow v1 shell design rules:
  - `set -euo pipefail` in all shell scripts.
  - Small functions (≤ 20 lines), pure helpers in `lib/`.
  - Test stubs in `scripts/test/`.

## Usage Examples

- From an entrypoint skill:
  - “Search open bugs for this feature in Jira; if JQL has no project, infer from my default projects.”
- From a human:
  - “Find all `In Progress` issues assigned to me, any project.”
```

### 3.2 `confluence-publish-and-notify` (Shared)

**Goal:** Single shared skill that:

1. Publishes or updates a Confluence page from a local markdown file.  
2. Sends a notification (Feishu, Slack, etc.) about the updated page.  

This matches your request to keep “post Confluence page and post notification” as **one skill**, while the internals are modular (separate scripts).

**Placement:**  
`/.agents/skills/confluence-publish-and-notify/`

**Rough SKILL.md Template:**

```markdown
---
name: confluence-publish-and-notify
description: Publish or update a Confluence page from a local markdown file and notify subscribers in chat (e.g. Feishu, Slack). Use when Codex needs to publish automation outputs or QA reports to Confluence and alert stakeholders.
---

# Confluence Publish and Notify Skill

## Purpose

Given a local markdown file, publish or update a Confluence page, then send a notification with:
- Page title
- URL
- Key summary details (e.g. status, owner, date)

## Behavior

1. Input
   - `markdown_path` (string, required) — local `.md` file to publish.
   - `space_key` (string, required) — Confluence space.
   - `parent_page_id` (string, optional) — parent to nest under.
   - `page_title` (string, optional) — defaults to title from markdown.
   - `notify_channels` (array of strings, optional) — e.g. `["feishu", "slack"]`.

2. Steps
   - Publish/Upsert:
     - Use Confluence CLI or API wrapper to:
       - Create page if missing.
       - Update existing page if title/path matches.
   - Build notification payload:
     - Title, URL, space, last updated time, and any important metadata.
   - Notify:
     - Send notifications to each channel in `notify_channels`.
     - Use a Feishu helper to write `notification_pending` into `run.json` on failure.

3. Output
   - `page_url` (string) — final Confluence URL.
   - `page_id` (string) — Confluence page ID.
   - `notification_status` (object) — per-channel success/failure.

## Implementation Notes

- Implementation lives in `scripts/`:
  - `scripts/run-confluence-publish-and-notify.sh` — main entrypoint.
  - `scripts/lib/confluence_cli.sh` — wrapper over Confluence CLI/API.
  - `scripts/lib/notify.sh` — multi-channel notification helper.
  - `scripts/lib/feishu.sh` — Feishu-specific logic with `notification_pending` fallback.

- Reuse shell workflow patterns:
  - Shell-first orchestration.
  - Pure helper scripts in `lib/`.
  - Tests in `scripts/test/` with minimal mocks (real fs, stub external APIs).

## Usage Examples

- From a QA summary workflow:
  - “Publish the QA summary markdown to Confluence and notify the QA Feishu group.”
- From a defect analysis workflow:
  - “Update the defect dashboard page and send a notification to the incident channel.”
```

### 3.3 `qa-workflow-entrypoint` (Entrypoint)

**Goal:** A canonical pattern for an entrypoint skill that orchestrates other skills instead of hardcoding everything in a single script. This is a template, to be specialized per workflow (e.g. `qa-summary-entrypoint`, `defect-analysis-entrypoint`).

**Placement:**  
For a QA summary workflow inside `workspace-reporter`:

`/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-reporter/skills/qa-summary-entrypoint/`

**Rough SKILL.md Template:**

```markdown
---
name: qa-summary-entrypoint
description: End-to-end QA summary workflow orchestrator. Use when Codex should collect Jira issues, summarize QA status, publish to Confluence, and notify stakeholders via chat.
---

# QA Summary Entrypoint Skill

## Purpose

End-to-end QA summary workflow driven as a single skill:
- Discover relevant Jira issues.
- Run analysis (could be another skill).
- Publish a summary page to Confluence.
- Notify stakeholders.

## High-Level Flow

1. Determine scope (project(s), time range, labels).
2. Use `jira-smart-search` to fetch issues.
3. Optionally call domain-specific analysis skills.
4. Render markdown summary.
5. Call `confluence-publish-and-notify` to publish and notify.

## Inputs

Examples:
- `project` (string, optional) — Jira project key; if omitted, rely on `jira-smart-search` defaults.
- `time_window` (string, optional) — e.g. `last_7_days`.
- `labels` (array, optional) — Jira labels to filter.
- `notify_channels` (array, optional) — e.g. `["feishu"]`.

## Implementation Notes

- Orchestration is done via a shell script, e.g.:
  - `scripts/run-qa-summary-workflow.sh`
    - Step 1: resolve scope → build JQL.
    - Step 2: invoke `jira-smart-search` (sub-skill) to get issues.
    - Step 3: generate markdown summary.
    - Step 4: invoke `confluence-publish-and-notify`.

- This entrypoint skill:
  - SHOULD NOT reimplement Jira or Confluence logic.
  - SHOULD call shared skills wherever possible.

## Example Invocation

> “Run a QA summary for project `BCIN` for the last 7 days and notify the QA Feishu group.”
```

---

## 4. Entrypoint Skill Pattern (Shell + Skills)

### 4.1 Shell Orchestration Pattern

Entrypoint skills use the same shell patterns from v1, but their steps are rephrased in terms of **calling other skills** instead of local scripts only.

Example pseudo-flow for `run-qa-summary-workflow.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Resolve input params (project, time_window, labels, notify_channels)
# 2. Build JQL
# 3. Call jira-smart-search (skill) via its script/CLI wrapper
# 4. Generate markdown summary from Jira JSON
# 5. Call confluence-publish-and-notify (skill) with markdown path + notify channels
```

Key rules:

- Keep the entrypoint script small and declarative.  
- Delegate real work to building-block skills.  
- Use `lib/` helpers for reusable shell utilities, not per-workflow copy–paste.

### 4.2 How Entrypoint Calls Shared Skills

Shared skills should expose **CLI-friendly** commands so other scripts can call them:

- `jira-smart-search` might expose:

```bash
.agents/skills/jira-smart-search/scripts/run-jira-smart-search.sh \
  --jql "$JQL" \
  --limit 200 \
  > "$WORKDIR/jira-issues.json"
```

- `confluence-publish-and-notify` might expose:

```bash
.agents/skills/confluence-publish-and-notify/scripts/run-confluence-publish-and-notify.sh \
  --markdown "$SUMMARY_MD" \
  --space "$SPACE_KEY" \
  --parent "$PARENT_ID" \
  --notify "feishu"
```

Entrypoint scripts do not need to know internal details; they only know the input/output contract of each skill.

---

## 5. Skill Creator Alignment

The `skill-creator` guidance defines what a “good” skill looks like. This v2 design is intended to match those rules so skills are easy to trigger and validate.

1. **SKILL.md as source of truth**
   - Every skill has a single SKILL.md with:
     - YAML frontmatter containing only `name` and `description`.
     - Body containing usage instructions, behavior, and references to scripts/references/assets.
   - The `description` is the primary trigger; it must describe both:
     - What the skill does.
     - When Codex should use it (e.g. “Use when Codex needs to…”).
   - The updated templates above follow this pattern.

2. **No README duplication**
   - Do not add separate `README.md` inside skill directories.
   - If detailed background or long-form docs are needed:
     - Put them under `references/` and link from SKILL.md.
   - Keep SKILL.md reasonably small (under ~500 lines) per progressive disclosure.

3. **Packagable directory structure**
   - Use the standard layout so `init_skill.py`, `quick_validate.py`, and packaging tools work:
     - `skill-name/SKILL.md`
     - `skill-name/scripts/` (if scripts exist)
     - `skill-name/references/` (for heavy docs, optional)
     - `skill-name/assets/` (for templates/resources, optional)
     - `skill-name/agents/openai.yaml` (UI metadata, recommended)
   - Folder name should exactly match the `name` in frontmatter (e.g. `jira-smart-search/`).

4. **Initialization and validation**
   - When creating new shared skills (like `jira-smart-search` or `confluence-publish-and-notify`):
     - Use `scripts/init_skill.py <skill-name> --path <target-dir> --resources scripts,references` to scaffold.
     - Generate or update `agents/openai.yaml` with `scripts/generate_openai_yaml.py` if you want UI metadata.
     - Run `scripts/quick_validate.py <path/to/skill-folder>` to catch frontmatter/naming issues.

5. **Idempotent behavior**
   - Skills should be safe to re-run with the same inputs.
   - For workflows that produce persistent artifacts, reuse `agent-idempotency` Phase 0 patterns for resume / reuse behavior.

v2 design assumes all new skills (entrypoints and building blocks) follow this structure: SKILL.md frontmatter aligned with triggers, concise body, scripts under `scripts/`, optional `references/` for heavy docs, and no extra READMEs.

---

## 6. OpenClaw Best Practices Mapping

Mapping to `docs/bestpractice-openclaw.md`:

1. **Skill accumulation as moat**
   - v2 turns cross-cutting capabilities into shared skills (`jira-smart-search`, `confluence-publish-and-notify`), so we accumulate value in a central skill library rather than hidden per-workflow scripts.

2. **Error → rule → Skill**
   - When we discover recurring Jira/Confluence mistakes, we update these shared skills instead of touching each workflow.

3. **Multi-agent team**
   - Entrypoint skills behave like “team leads” that call specialized skills (e.g. Jira analyst, Confluence publisher, notifier).

4. **Self-evolution**
   - Capability evolver and self-improving-agent can focus on improving a small number of shared skills instead of many copies.

---

## 7. Quality Gates for v2 Skills

When adding or updating skills under this v2 design:

1. **Placement**
   - Shared behavior? → `.agents/skills/`.
   - Agent-local behavior? → `<agent-workspace>/skills/`.

2. **Documentation**
   - SKILL.md present with clear purpose, inputs, outputs, and examples.

3. **Shell Design**
   - `set -euo pipefail` in all shell scripts.
   - Functions ≤ 20 lines.
   - Pure helpers in `lib/` with no side effects.

4. **Tests**
   - `scripts/test/` exists with at least one test script.
   - Tests use minimal mocks (real fs, stub external APIs).

5. **Reusability**
   - Building-block skills must not hard-code a single workflow’s assumptions.
   - Entrypoint skills must delegate core logic to building-block skills where possible.

---

## 8. Next Steps (Out of Scope to Implement Here)

1. Implement `jira-smart-search` skill under `.agents/skills/jira-smart-search/` following the template above.  
2. Implement `confluence-publish-and-notify` under `.agents/skills/confluence-publish-and-notify/`.  
3. Update one concrete workflow (e.g. QA Summary) to use:
   - `qa-summary-entrypoint` skill as entrypoint.
   - `jira-smart-search` and `confluence-publish-and-notify` as shared building blocks.  
4. Add a short section in root `AGENTS.md` pointing to this v2 design and listing the canonical shared skills.
