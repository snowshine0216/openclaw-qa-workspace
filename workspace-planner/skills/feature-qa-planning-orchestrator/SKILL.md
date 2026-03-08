---
name: feature-qa-planning-orchestrator
description: Canonical workspace-planner entrypoint for end-to-end QA plan generation. Orchestrates 8 phases: Phase 0 idempotency, Phase 1 context gathering (qa-plan-write), Phase 2 sub test cases (qa-plan-write), Phase 3 domain review (qa-plan-review), Phase 4 domain refactor (qa-plan-review mode=refactor), Phase 5 synthesis, Phase 6 XMind review, Phase 7 final refactor, Phase 8 publication.
---

# Feature QA Planning Orchestrator

This skill is the canonical replacement for the removed legacy `feature-qa-planning` workflow file.

## When to Use

Use this skill when the user provides a feature key and one or more artifacts such as:
- Jira issue key
- Confluence design URL
- GitHub PR URL(s)
- Figma URL
- Background research notes

## Required Inputs

- `feature_id`: issue key such as `BCIN-6709`
- `jira_key`: usually same as `feature_id`
- `confluence_url`: optional but strongly recommended
- `github_pr_urls`: optional array of PR URLs
- `figma_url`: optional
- `background_context_path`: optional path under `context/`

Working directory:
- `workspace-planner/projects/feature-plan/<feature-id>/`

## Core Rules

- Always start with Phase 0 by running `../scripts/check_resume.sh <feature-id>` from the feature directory.
- Respect `REPORT_STATE` exactly: `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`.
- Never silently choose a destructive path.
- Archive before overwrite.
- Spawn sub-agents for parallel context gathering (Phase 1) using `spawn-agent-session` skill.
- Spawn sub-agents for domain sub test case generation (Phase 2) using `spawn-agent-session` skill.
- Generate XMind-compatible final test cases as the ONLY output.
- The test cases MUST follow `templates/test-case-template.md` as the final structure.
- Evaluation is mandatory for test cases: draft → `qa-plan-review` → `qa-plan-refactor` → final.
- Implement conditional Confluence search based on Jira linked/child issues, and also require Confluence clarification when generated test areas are vague, technical, or non-actionable so they can be rewritten into user-observable actions.
- Reuse shared skills directly from `~/.openclaw/skills`: `jira-cli`, `github`, `confluence`, `feishu-notify`, `spawn-agent-session`.
- Treat `~/.openclaw/skills` as canonical for shared skills. Workspace-root copies are synced mirrors and must stay aligned with the shared source.
- Primary evidence must come only from canonical source skills: Jira via `jira-cli`, GitHub via `github`, Confluence via `confluence`, and Figma via browser/local snapshots.
- Never use `web_fetch`, generic browser scraping, or ad hoc HTTP retrieval for Jira, GitHub, or Confluence evidence collection during feature QA planning.
- Reuse planner-local skills directly: `qa-plan-write` (atlassian, github, figma handlers), `qa-plan-synthesize`, `qa-plan-review`, `qa-plan-refactor`.
- Keep code/internal details out of manual QA rows; user-facing outcomes belong in the final test cases.
- Send Feishu notification ONLY at the end. DO NOT publish to Confluence.

## Phase Overview

```
Phase 0 → Idempotency check + preparation
Phase 1 → Context gathering (spawn qa-plan-write mode=context: atlassian, github, figma)
Phase 2 → Domain sub test cases (spawn qa-plan-write mode=testcase: atlassian, github, figma)
Phase 3 → Domain review (spawn qa-plan-review: jira, confluence, github, figma) — review sub_test_cases_*
Phase 4 → Domain refactor (spawn qa-plan-review mode=refactor: atlassian, github, figma) — apply findings → _v2.md
Phase 5 → Synthesize (resolve v2/base per domain → unified XMind draft)
Phase 6 → XMind review (single agent, reuses Phase 3 artifacts)
Phase 7 → Final refactor
Phase 8 → Finalize + Feishu notify
```

## task.json Schema

```json
{
  "run_key": "BCIN-6709",
  "overall_status": "in_progress",
  "current_phase": "phase_0_preparation",
  "latest_xmind_version": null,
  "search_required": false,
  "spawned_agents": {},
  "phases": {
    "context_gathering": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_generation": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_review": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_refactor": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "synthesis": {
      "status": "pending",
      "artifacts": [],
      "completed_at": null
    },
    "xmind_review": {
      "status": "pending",
      "artifacts": [],
      "completed_at": null
    },
    "final_refactor": {
      "status": "pending",
      "iterations": 0,
      "artifacts": [],
      "completed_at": null
    },
    "publication": {
      "status": "pending",
      "notification_sent": false,
      "completed_at": null
    }
  },
  "errors": [],
  "updated_at": null
}
```

## run.json Schema

```json
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "notification_pending": null,
  "updated_at": null
}
```

---

## Workflow

### Phase 0 — Existing-State Check and Preparation

1. Confirm user intent and summarize the provided artifacts.
2. Run `../scripts/check_resume.sh <feature-id>`.
3. Parse `REPORT_STATE` and stop for user choice when prior artifacts exist:
   - `FINAL_EXISTS` → `Use Existing | Smart Refresh | Full Regenerate`
   - `DRAFT_EXISTS` → `Resume | Smart Refresh | Full Regenerate`
   - `CONTEXT_ONLY` → `Generate from Cache | Re-fetch + Regenerate`
   - `FRESH` → proceed
4. If `DEFECT_ANALYSIS_RESUME` is emitted, follow the resume guidance before moving on.
5. Run access validation before any evidence gathering:
   - Jira access: validate with `jira me` or an equivalent `jira-cli` skill path
   - GitHub access: validate with `gh auth status` via the shared `github` skill path
   - Confluence access: validate before reading any Confluence evidence
   - Figma input: confirm local snapshot paths exist or confirm live access through the browser flow
   - if any required source is inaccessible, stop in Phase 0 and report the exact blocker instead of partially gathering evidence
6. Initialize or update `task.json` and `run.json` additively using the schemas above.
7. Determine conditional search requirement:
   - Read Jira issue via `jira-cli`
   - Check `issuelinks[]` only
   - Set `search_required = (issuelinks.length > 0)`
   - Store in `task.json.search_required`
8. Build required evidence lists before spawning:
   - required Jira issues = main issue + all related issues from Jira issuelinks + testing-relevant issue references in Jira comments
   - required GitHub PRs = all user-provided PR URLs + all PR/compare references from Jira comments that materially affect testing
   - required Figma input = any Figma URL from Jira or Confluence web links, or approved local snapshot folders
   - if any required evidence list cannot be resolved, stop and ask the user whether to continue
9. Enforce the primary evidence access policy while resolving evidence:
   - Jira descriptions, comments, ACs, linked issues → shared `jira-cli` skill only
   - GitHub PRs, compare views, commits, changed files, comments → shared `github` skill only
   - Confluence pages → shared `confluence` skill only
   - Figma → browser or local snapshots only
   - never substitute primary evidence with `web_fetch`

Set `task.json.current_phase` to `phase_0_preparation` on entry; advance to `phase_1_context_gathering` when complete.

---

### Phase 1 — Sub-Agent Context Gathering

**Overview**: Spawn `qa-plan-write` handlers in parallel (one per domain) with `mode=context` to fetch raw domain context. Each handler calls `save_context.sh` after every fetch.

**Entry**: Set `task.json.current_phase` to `phase_1_context_gathering`; set `task.json.phases.context_gathering.status` to `in_progress`; update `task.json.updated_at`.

**Deploy scripts** (before spawning): Ensure `projects/feature-plan/scripts/` exists. Copy from `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/` into it: `save_context.sh`, `validate_context.sh`.

**Sub-agents to spawn** (via `spawn-agent-session` with `context.json` attachment):

```javascript
const agents_to_spawn = [];

if (jira_key || confluence_url) {
  agents_to_spawn.push({
    functional_area: "atlassian",
    skill: "qa-plan-write",
    context: { domain: "atlassian", mode: "context", feature_id, jira_key, confluence_url, search_enabled: search_required }
  });
}

if (github_pr_urls && github_pr_urls.length > 0) {
  agents_to_spawn.push({
    functional_area: "github",
    skill: "qa-plan-write",
    context: { domain: "github", mode: "context", feature_id, github_pr_urls }
  });
}

const effective_figma_url = figma_url || discovered_figma_url;
if (effective_figma_url) {
  agents_to_spawn.push({
    functional_area: "figma",
    skill: "qa-plan-write",
    context: { domain: "figma", mode: "context", feature_id, figma_url: effective_figma_url }
  });
}
```

**Spawn** each via `sessions_spawn()` (via `spawn-agent-session` skill). Attachment shape:
```json
{
  "name": "context.json",
  "content": { "domain": "atlassian", "mode": "context", "feature_id": "BCIN-6709", "jira_key": "BCIN-6709", "confluence_url": "..." }
}
```

**Wait for completion**: poll via `subagents(action=list)`. On completion update `status` to `"completed"`.

**Validate outputs** — run `validate_context.sh` or check these files exist:
- `context/qa_plan_atlassian_<feature-id>.md`
- `context/qa_plan_github_<feature-id>.md`, `context/qa_plan_github_traceability_<feature-id>.md`
- `context/qa_plan_figma_<feature-id>.md` (if Figma agent spawned)

Missing fatal file → stop. Non-fatal (e.g., no Figma) → continue with warning.

**On completion**: set `task.json.phases.context_gathering.status` to `completed`, populate `artifacts[]`, update `task.json.updated_at`, advance `current_phase` to `phase_2_sub_testcase_generation`. Update `run.json.data_fetched_at`.

---

### Phase 2 — Domain Sub Test Case Generation

**Overview**: Gate with `validate_context.sh`, then spawn `qa-plan-write` handlers with `mode=testcase` (one per domain) to generate XMind sub test cases from cached context. No live re-fetch.

**Entry**: Set `task.json.current_phase` to `phase_2_sub_testcase_generation`; set `task.json.phases.sub_testcase_generation.status` to `in_progress`; update `task.json.updated_at`.

**Gate**: Run `validate_context.sh` before spawning:
```bash
../scripts/validate_context.sh <feature-id> "jira_issue_<main-key>" "qa_plan_atlassian_<feature-id>" "qa_plan_github_traceability_<feature-id>"
```
If `CONTEXT_MISSING`, stop and report. If `CONTEXT_OK`, proceed.

**Sub-agents to spawn** (via `spawn-agent-session` with `context.json` attachment):

| Agent | Domain | Output Artifact |
|---|---|---|
| atlassian_testcase | atlassian | `context/sub_test_cases_atlassian_<feature-id>.md` |
| github_testcase | github | `context/sub_test_cases_github_<feature-id>.md` |
| figma_testcase | figma | `context/sub_test_cases_figma_<feature-id>.md` (if Figma context exists) |

Attachment shape:
```json
{ "domain": "atlassian", "mode": "testcase", "feature_id": "BCIN-6709" }
```

Each handler reads only its domain's `context/` files and produces XMind-format sub test cases per `templates/test-case-template.md`. No live re-fetch.

**Phase 2 Completion**

Wait for all spawned agents to finish.

**Validate outputs**:
- `context/sub_test_cases_atlassian_<feature-id>.md` ✓
- `context/sub_test_cases_github_<feature-id>.md` ✓
- `context/sub_test_cases_figma_<feature-id>.md` (if Figma agent spawned) ✓

Update `task.json`:
- `phases.sub_testcase_generation.status` → `completed`; populate `artifacts[]`
- `updated_at` → now
- advance `current_phase` → `phase_3_sub_testcase_review`

---

### Phase 3 — Domain Review (Sub Test Cases)

**Overview**: Spawn `qa-plan-review` handlers (domain=jira, confluence, github, figma) to review `sub_test_cases_*` against domain source artifacts. Each handler is domain-isolated.

**Entry**: Set `task.json.current_phase` to `phase_3_sub_testcase_review`; set `task.json.phases.sub_testcase_review.status` to `in_progress`; update `task.json.updated_at`.

**Spawn** via `sessions_spawn()` (via `spawn-agent-session`). Attachment shape:
```json
{ "domain": "jira", "feature_id": "BCIN-6709" }
```

| Agent | Domain | Output Artifact |
|---|---|---|
| jira_review | jira | `context/review_jira_<feature-id>.md` |
| confluence_review | confluence | `context/review_confluence_<feature-id>.md` |
| github_review | github | `context/review_github_<feature-id>.md` |
| figma_review | figma | `context/review_figma_<feature-id>.md` (if Figma present) |

Each handler calls `validate_context.sh` before starting; re-fetches and saves if context missing. Output via `save_context.sh`.

**On completion**: set `task.json.phases.sub_testcase_review.status` to `completed`, populate `artifacts[]`, advance `current_phase` to `phase_4_sub_testcase_refactor`.

---

### Phase 4 — Domain Refactor (Apply Review Findings)

**Overview**: Gate with `validate_context.sh` (all `review_*.md` present), then spawn `qa-plan-review` with `mode=refactor` (domain=atlassian, github, figma) to apply Phase 3 findings to sub test cases.

**Entry**: Set `task.json.current_phase` to `phase_4_sub_testcase_refactor`; set `task.json.phases.sub_testcase_refactor.status` to `in_progress`; update `task.json.updated_at`.

**Gate** (all Phase 3 review artifacts required for domains being refactored):
```bash
../scripts/validate_context.sh <feature-id> "review_jira_<id>" "review_confluence_<id>" "review_github_<id>"
# Add "review_figma_<id>" if Figma was spawned in Phase 3
```

**Spawn** via `sessions_spawn()`. Attachment shape:
```json
{ "domain": "atlassian", "mode": "refactor", "feature_id": "BCIN-6709" }
```

| Agent | Domain | Output Artifact |
|---|---|---|
| atlassian_refactor | atlassian | `context/sub_test_cases_atlassian_<id>_v2.md` (if changes) |
| github_refactor | github | `context/sub_test_cases_github_<id>_v2.md` (if changes) |
| figma_refactor | figma | `context/sub_test_cases_figma_<id>_v2.md` (if Figma + changes) |

No-op domains produce no `_v2.md`. Orchestrator treats missing `_v2` as "no changes".

**On completion**: set `task.json.phases.sub_testcase_refactor.status` to `completed`, advance `current_phase` to `phase_5_synthesis`.

---

### Phase 5 — Synthesis: Unified XMind Test Case Draft

**Overview**: Resolve latest sub test case file per domain (v2 if present, else base), then synthesize into one XMind draft.

**Entry**: Set `task.json.current_phase` to `phase_5_synthesis`; set `task.json.phases.synthesis.status` to `in_progress`; update `task.json.updated_at`.

**Gate**:
```bash
# Resolve latest per-domain file (v2 if present, else base). Capture output for sub_testcase_files.
RESOLVED=$(../scripts/validate_context.sh <feature-id> --resolve-sub-testcases atlassian github figma)
../scripts/validate_context.sh <feature-id> "qa_plan_github_traceability_<id>"
```

Parse `RESOLVED` for paths (one per domain, lines before `RESOLVED_OK`). Skip `figma` in `--resolve-sub-testcases` if no Figma context was spawned in Phase 2.

Invoke `qa-plan-synthesize` with:
- `sub_testcase_files`: resolved paths from gate output (v2 or base per domain)
- `context_files`: `qa_plan_github_traceability_<id>.md`, `qa_plan_atlassian_<id>.md`, `jira_issue_<key>.md`, `jira_related_issues_<id>.md` (and any `research_bg_*.md` if present)
- `output`: `drafts/test_key_points_xmind_v<N+1>.md`

**Synthesis Contract**: Collect → Research → Deduplicate (per `qa-plan-synthesize` skill). No `output_mode` — skill is xmind_only.

**Output**: `drafts/test_key_points_xmind_v<N+1>.md`

**On completion**: set `task.json.phases.synthesis.status` to `completed`, advance `current_phase` to `phase_6_xmind_review`.

---

### Phase 6 — XMind Review (Synthesized Draft)

**Overview**: Single agent reviews the synthesized XMind draft. Reuses Phase 3 review artifacts. Loads `docs/priority-assignment-rules.md`. No live re-fetch by default.

**Entry**: Set `task.json.current_phase` to `phase_6_xmind_review`; set `task.json.phases.xmind_review.status` to `in_progress`; update `task.json.updated_at`.

**Gate**: Run `validate_context.sh` before starting (confirm Phase 3 review artifacts exist).

**Invoke** `qa-plan-review` with `mode=consolidated`:
```json
{ "mode": "consolidated", "feature_id": "BCIN-6709" }
```

The skill reviews `drafts/test_key_points_xmind_v<N>.md`:
- X1: Every `##` category has P1/P2/P3 marker
- X2: Every `###` sub-category has priority or inherits from parent
- X3: Leaf nodes contain expected results (observable, no code vocabulary)
- X4: `## AUTO` section present for code-internal tests
- X5: `## 📎 Artifacts Used` section present

Output: `context/review_consolidated_<id>.md` via `save_context.sh`.

**On completion**: set `task.json.phases.xmind_review.status` to `completed`, advance `current_phase` to `phase_7_final_refactor`.

---

### Phase 7 — Final Refactor

**Entry**: Set `task.json.current_phase` to `phase_7_final_refactor`; set `task.json.phases.final_refactor.status` to `in_progress`; update `task.json.updated_at`.

1. Run `qa-plan-refactor` on XMind draft using `context/review_consolidated_<id>.md`.
2. XMind validation (P1/P2/P3, traceability, UE checks).
3. If `Requires Updates`, refactor again. Max 2 rounds.
4. If unresolved: set `status` to `failed`, add to `task.json.errors`, return to user.

**On completion**: set `task.json.phases.final_refactor.status` to `completed`, advance `current_phase` to `phase_8_publication`.

---

### Phase 8 — Finalize + Feishu Notify

**Entry**: Set `task.json.current_phase` to `phase_8_publication`; set `task.json.phases.publication.status` to `in_progress`; update `task.json.updated_at`.

1. Ask the user for final approval to complete the workflow. Pause until answered.
2. Archive existing final outputs before overwrite:
   - `test_key_points_xmind_final.md` → `archive/test_key_points_xmind_final_<timestamp>.md`
3. Copy approved draft to final:
   - `drafts/test_key_points_xmind_v<N>.md` → `test_key_points_xmind_final.md`
4. Update `run.json.output_generated_at`.
5. Send Feishu notification via `feishu-notify`:
   ```
   Feature ${feature_id} QA Plan Complete ✅
   - Test Cases: test_key_points_xmind_final.md
   ```
6. Set `task.json.current_phase` to `completed`, `overall_status` to `completed`, record completion timestamp.

---

## Handoff Artifacts

```
projects/feature-plan/<feature-id>/task.json
projects/feature-plan/<feature-id>/run.json
projects/feature-plan/<feature-id>/context/qa_plan_atlassian_*.md        ← Phase 1
projects/feature-plan/<feature-id>/context/qa_plan_github_*.md            ← Phase 1
projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_*.md ← Phase 1
projects/feature-plan/<feature-id>/context/sub_test_cases_atlassian_*.md  ← Phase 2
projects/feature-plan/<feature-id>/context/sub_test_cases_github_*.md     ← Phase 2
projects/feature-plan/<feature-id>/context/sub_test_cases_figma_*.md      ← Phase 2 (if Figma)
projects/feature-plan/<feature-id>/context/review_jira_*.md               ← Phase 3
projects/feature-plan/<feature-id>/context/review_confluence_*.md         ← Phase 3
projects/feature-plan/<feature-id>/context/review_github_*.md             ← Phase 3
projects/feature-plan/<feature-id>/context/review_figma_*.md              ← Phase 3 (if Figma)
projects/feature-plan/<feature-id>/context/sub_test_cases_*_v2.md        ← Phase 4 (if changes)
projects/feature-plan/<feature-id>/context/review_consolidated_*.md       ← Phase 6
projects/feature-plan/<feature-id>/drafts/test_key_points_xmind_v<N>.md   ← Phase 5
projects/feature-plan/<feature-id>/test_key_points_xmind_final.md         ← Phase 8
```

---

## Validation

Before considering the run complete:
```bash
cd workspace-planner/projects/feature-plan/<feature-id>
../scripts/check_resume.sh <feature-id>
jq -r '.current_phase, .overall_status, .latest_xmind_version' task.json
jq -r '.phases | keys[]' task.json
jq -r '.phases | to_entries[] | "\(.key): \(.value.status)"' task.json
ls context/sub_test_cases_*.md
ls context/review_*.md
ls drafts/test_key_points_xmind_v*.md
```

---

## Related Skills

**Shared Skills** (`~/.openclaw/skills`):
- `spawn-agent-session`
- `jira-cli`
- `confluence`
- `feishu-notify`

**Planner-Local Skills** (`workspace-planner/skills/`):
- `qa-plan-write` — Phase 1 (mode=context) + Phase 2 (mode=testcase); atlassian, github, figma handlers
- `qa-plan-review` — Phase 3 (domain review: jira, confluence, github, figma) + Phase 4 (mode=refactor: atlassian, github, figma) + Phase 6 (mode=consolidated: XMind review)
- `qa-plan-synthesize` — Phase 5 (XMind synthesis)
- `qa-plan-refactor` — Phase 7 (final refactor)

---

**Last Updated**: 2026-03-08
**Status**: Active — Phase 5 aligned with qa-plan-synthesize (xmind_only); latest_xmind_version; resolved paths from validate_context.sh
