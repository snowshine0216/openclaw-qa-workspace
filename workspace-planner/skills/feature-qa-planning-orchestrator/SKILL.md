---
name: feature-qa-planning-orchestrator
description: Canonical workspace-planner entrypoint for end-to-end QA plan generation. Orchestrates Phase 0 idempotency, sub-agent spawning for parallel context gathering, sub-agent spawning for domain sub test case + QA plan draft generation, synthesis, domain review, refactor, and publication.
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
- Spawn sub-agents for domain sub test case + QA plan draft generation (Phase 2) using `spawn-agent-session` skill.
- Generate dual outputs: final QA plan + XMind-compatible final test cases.
- The QA plan MUST follow `templates/qa-plan-template.md` as the final structure.
- Evaluation is mandatory for both QA plan and test cases: draft → `qa-plan-review` → `qa-plan-refactor` → final.
- Implement conditional Confluence search based on Jira linked/child issues, and also require Confluence clarification when generated test areas are vague, technical, or non-actionable so they can be rewritten into user-observable actions.
- Reuse shared skills directly from `~/.openclaw/skills`: `jira-cli`, `github`, `confluence`, `feishu-notify`, `spawn-agent-session`.
- Treat `~/.openclaw/skills` as canonical for shared skills. Workspace-root copies are synced mirrors and must stay aligned with the shared source.
- Primary evidence must come only from canonical source skills: Jira via `jira-cli`, GitHub via `github`, Confluence via `confluence`, and Figma via browser/local snapshots.
- Never use `web_fetch`, generic browser scraping, or ad hoc HTTP retrieval for Jira, GitHub, or Confluence evidence collection during feature QA planning.
- `web_fetch` is allowed only for optional background research that is not a system-of-record artifact for the feature.
- Reuse planner-local skills directly: `qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma`, `qa-plan-synthesize`, `qa-plan-review`, `qa-plan-refactor`, `qa-plan-confluence-review`.
- Keep code/internal details out of manual QA rows; user-facing outcomes belong in the final QA plan and final test cases.
- NEVER publish to Confluence without explicit user approval and a confirmed target page.

## Phase Overview

```
Phase 0 → Idempotency check + preparation
Phase 1 → Context gathering (spawn sub-agents: atlassian, github, figma)
Phase 2 → Domain sub test cases + QA plan draft (spawn sub-agents: jira_testcase, confluence_testcase, github_testcase, figma_testcase, qa_plan_draft)
Phase 3 → Synthesize all sub test cases → unified XMind test case draft
Phase 4 → Domain review (spawn review sub-agents per source)
Phase 5 → Refactor + finalize both outputs
Phase 6 → Publication + notification
```

## task.json Schema

```json
{
  "run_key": "BCIN-6709",
  "overall_status": "in_progress",
  "current_phase": "phase_0_preparation",
  "defect_analysis": "not_applicable",
  "latest_draft_version": null,
  "search_required": false,
  "spawned_agents": {},
  "subtask_timestamps": {},
  "phases": {
    "context_gathering": {
      "status": "pending",
      "artifacts": [],
      "completed_at": null
    },
    "sub_testcase_generation": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "qa_plan_draft_generation": {
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
    "domain_review": {
      "status": "pending",
      "spawned_agents": {},
      "artifacts": [],
      "completed_at": null
    },
    "review_refactor": {
      "status": "pending",
      "iterations": 0,
      "artifacts": [],
      "completed_at": null
    },
    "publication": {
      "status": "pending",
      "approved": false,
      "target_page_confirmed": false,
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

Set `task.json.current_phase` to `phase_0_preparation` on entry; advance to `phase_1_context_acquisition` when complete.

---

### Phase 1 — Sub-Agent Context Gathering

**Overview**: Spawn functional-area sub-agents in parallel to acquire raw domain context.

**Entry**: Set `task.json.current_phase` to `phase_1_context_acquisition`; set `task.json.phases.context_gathering.status` to `in_progress`; update `task.json.updated_at`.

**Sub-agents to spawn**:

```javascript
const agents_to_spawn = [];

if (jira_key || confluence_url) {
  agents_to_spawn.push({
    functional_area: "requirements_analysis",
    skill: "qa-plan-atlassian",
    context: { feature_id, jira_key, confluence_url, search_enabled: search_required }
  });
}

if (github_pr_urls && github_pr_urls.length > 0) {
  agents_to_spawn.push({
    functional_area: "code_analysis",
    skill: "qa-plan-github",
    context: { feature_id, github_pr_urls }
  });
}

const effective_figma_url = figma_url || discovered_figma_url;
if (effective_figma_url) {
  agents_to_spawn.push({
    functional_area: "ui_ux_analysis",
    skill: "qa-plan-figma",
    context: { feature_id, figma_url: effective_figma_url }
  });
}
```

**Spawn** each agent via `spawn-agent-session`. Track each in `task.json.spawned_agents[functional_area]`:
```json
{
  "session_key": "...",
  "skill": "qa-plan-atlassian",
  "phase": "phase_1",
  "status": "spawned",
  "spawned_at": "<ISO timestamp>"
}
```

**Wait for completion**: poll via `subagents(action=list)`. On completion update `status` to `"completed"`.

**Validate outputs** — these files must exist:
- `context/qa_plan_atlassian_<feature-id>.md`
- `context/qa_plan_github_<feature-id>.md`
- `context/qa_plan_github_traceability_<feature-id>.md`
- `context/qa_plan_figma_<feature-id>.md` (if Figma agent spawned)

Missing fatal file (e.g., no GitHub output when PRs exist) → stop. Non-fatal (e.g., no Figma) → continue with warning.

**On completion**: set `task.json.phases.context_gathering.status` to `completed`, populate `artifacts[]` with output file paths, update `task.json.updated_at`, advance `current_phase` to `phase_2_sub_testcase_generation`. Update `run.json.data_fetched_at`.

---

### Phase 2 — Domain Sub Test Case + QA Plan Draft Generation

**Overview**: Spawn two groups of sub-agents in parallel:
- **Group A**: Domain-specific sub test case generators (one per evidence source)
- **Group B**: QA plan draft generator

Both groups run in parallel. Phase 2 is complete only when ALL agents in both groups finish.

**Entry**: Set `task.json.current_phase` to `phase_2_sub_testcase_generation`; set both `task.json.phases.sub_testcase_generation.status` and `task.json.phases.qa_plan_draft_generation.status` to `in_progress`; update `task.json.updated_at`.

#### Group A — Sub Test Case Generation Sub-Agents

Spawn one sub-agent per available evidence domain:

| Agent | Evidence Source | Output Artifact |
|---|---|---|
| `jira_testcase` | `context/qa_plan_atlassian_<feature-id>.md` + all `context/jira_issue_*.md` | `context/sub_test_cases_jira_<feature-id>.md` |
| `confluence_testcase` | `context/qa_plan_atlassian_<feature-id>.md` (Confluence sections) | `context/sub_test_cases_confluence_<feature-id>.md` |
| `github_testcase` | `context/qa_plan_github_<feature-id>.md` + `context/qa_plan_github_traceability_<feature-id>.md` | `context/sub_test_cases_github_<feature-id>.md` |
| `figma_testcase` | `context/qa_plan_figma_<feature-id>.md` (if exists) | `context/sub_test_cases_figma_<feature-id>.md` |

Each sub test case generator sub-agent **must**:
- Use `templates/test-case-template.md` as its scaffold
- Stay strictly within its own source evidence scope — do NOT cross-reference other domains
- Assign priorities using the mandatory priority rules from `docs/priority-assignment-rules.md`
- Use user-observable language only — no code vocabulary
- NOT perform cross-domain synthesis

Track each in `task.json.phases.sub_testcase_generation.spawned_agents[agent_name]`:
```json
{
  "session_key": "...",
  "phase": "phase_2",
  "status": "spawned",
  "output_artifact": "context/sub_test_cases_jira_<feature-id>.md",
  "spawned_at": "<ISO timestamp>"
}
```

#### Group B — QA Plan Draft Generation Sub-Agent

Spawn one sub-agent to generate the QA plan draft from all gathered context:

| Agent | Evidence Sources | Output Artifact |
|---|---|---|
| `qa_plan_draft` | All `context/qa_plan_*.md` files | `drafts/qa_plan_v<N+1>.md` |

The QA plan draft sub-agent **must**:
- Follow `templates/qa-plan-template.md` structure
- Use `qa-plan-synthesize` skill (main plan sections only — no test key points)
- Output: Summary, Background, QA Goals, Risk & Mitigation, Reference Data, Sign-off Checklist, QA Summary
- **Exclude** Test Key Points — those come from Phase 3 synthesis

Track in `task.json.phases.qa_plan_draft_generation.spawned_agents.qa_plan_draft`:
```json
{
  "session_key": "...",
  "phase": "phase_2",
  "status": "spawned",
  "output_artifact": "drafts/qa_plan_v<N+1>.md",
  "spawned_at": "<ISO timestamp>"
}
```

#### Phase 2 Completion

Wait for ALL Group A + Group B agents to finish.

**Validate outputs**:
- `context/sub_test_cases_jira_<feature-id>.md` ✓
- `context/sub_test_cases_confluence_<feature-id>.md` ✓
- `context/sub_test_cases_github_<feature-id>.md` ✓
- `context/sub_test_cases_figma_<feature-id>.md` (if Figma agent spawned) ✓
- `drafts/qa_plan_v<N+1>.md` ✓

Update `task.json`:
- `phases.sub_testcase_generation.status` → `completed`; populate `artifacts[]`
- `phases.qa_plan_draft_generation.status` → `completed`; populate `artifacts[]`
- `latest_draft_version` → `N+1`
- `updated_at` → now
- advance `current_phase` → `phase_3_synthesis`

---

### Phase 3 — Synthesis: Unified XMind Test Case Draft

**Overview**: The main agent (not a sub-agent) reads all domain sub test case files and synthesizes them into one unified XMind-compatible test case draft. Uses `qa-plan-synthesize` skill.

**Entry**: Set `task.json.current_phase` to `phase_3_synthesis`; set `task.json.phases.synthesis.status` to `in_progress`; update `task.json.updated_at`.

Invoke `qa-plan-synthesize` with these inputs:

```javascript
await qa_plan_synthesize({
  feature_id,
  sub_testcase_files: [
    "context/sub_test_cases_jira_<feature-id>.md",
    "context/sub_test_cases_confluence_<feature-id>.md",
    "context/sub_test_cases_github_<feature-id>.md",
    "context/sub_test_cases_figma_<feature-id>.md"  // if exists
  ],
  context_files: [
    "context/qa_plan_atlassian_<feature-id>.md",
    "context/qa_plan_github_<feature-id>.md",
    "context/qa_plan_github_traceability_<feature-id>.md",
    "context/qa_plan_figma_<feature-id>.md"
  ],
  research_files: [
    "research_*.md"  // any existing research files in the feature folder
  ],
  output_mode: "xmind_only",
  output: "drafts/test_key_points_xmind_v<N+1>.md",
  priority_rules: "docs/priority-assignment-rules.md"
});
```

**Synthesis Contract** (follow 3-step protocol from `qa-plan-synthesize` skill):
1. **Collect** — pull ALL items from all sub test case files; do NOT discard any item
2. **Research** — for non-actionable items, search context + research files to specify concrete user actions; if unresolvable add `<!-- TODO: ... -->` comment
3. **Deduplicate** — merge semantic duplicates into most specific/concrete version

**Output**: `drafts/test_key_points_xmind_v<N+1>.md` — XMind-compatible hierarchical bullet format with P0/P1/P2/P3 markers.

**On completion**: set `task.json.phases.synthesis.status` to `completed`, populate `artifacts[]`, update `task.json.updated_at`, advance `current_phase` to `phase_4_domain_review`.

---

### Phase 4 — Domain Review

**Overview**: Spawn review sub-agents — one per evidence domain — to review BOTH outputs (QA plan draft + XMind test case draft) against their own domain evidence. The main agent then synthesizes findings into one refactor action list.

**Entry**: Set `task.json.current_phase` to `phase_4_domain_review`; set `task.json.phases.domain_review.status` to `in_progress`; update `task.json.updated_at`.

Spawn review sub-agents:

| Agent | Reviews Against | Output Artifact |
|---|---|---|
| `jira_review` | `context/qa_plan_atlassian_<feature-id>.md` + all Jira issue files | `context/review_jira_<feature-id>.md` |
| `confluence_review` | `context/qa_plan_atlassian_<feature-id>.md` (Confluence sections) | `context/review_confluence_<feature-id>.md` |
| `github_review` | `context/qa_plan_github_<feature-id>.md` + traceability | `context/review_github_<feature-id>.md` |
| `figma_review` | `context/qa_plan_figma_<feature-id>.md` (if Figma materially shaped output) | `context/review_figma_<feature-id>.md` |

Each review sub-agent must:
- Review BOTH `drafts/qa_plan_v<N>.md` AND `drafts/test_key_points_xmind_v<N>.md`
- Return source-grounded findings only (no speculation beyond its own domain evidence)
- Flag: missing coverage, wrong priority, non-actionable steps, vague expected results

Track in `task.json.phases.domain_review.spawned_agents[agent_name]`.

After all review agents complete, the main agent reads all review artifacts and synthesizes them into `context/review_consolidated_<feature-id>.md` — one prioritized refactor action list.

**On completion**: set `task.json.phases.domain_review.status` to `completed`, populate `artifacts[]`, update `task.json.updated_at`, advance `current_phase` to `phase_5_review_refactor`.

---

### Phase 5 — Review and Refactor Loop

**Entry**: Set `task.json.current_phase` to `phase_5_review_refactor`; set `task.json.phases.review_refactor.status` to `in_progress`; update `task.json.updated_at`.

1. Run `qa-plan-review` skill on **both drafts**:
   - `drafts/qa_plan_v<N>.md`
   - `drafts/test_key_points_xmind_v<N>.md`
   - Using consolidated review findings from `context/review_consolidated_<feature-id>.md`

2. **XMind-specific validation**:
   - All test scenarios have priority markers (P0/P1/P2/P3)
   - P0/P1 scenarios trace to GitHub code changes or Jira ACs
   - Hierarchical bullet structure matches template
   - Expected results in leaf nodes
   - No code vocabulary in headings, steps, or expected results
   - No `<!-- TODO -->` items remaining without user acknowledgment

3. If `Requires Updates`, run `qa-plan-refactor` to produce updated drafts. Increment `task.json.phases.review_refactor.iterations`. Review again.

4. Maximum automatic refactor rounds: **2**.

5. If unresolved after 2 rounds: set `status` to `failed`, add findings to `task.json.errors`, return to user.

6. Never publish on `Rejected`.

**On completion**: set `task.json.phases.review_refactor.status` to `completed`, record `iterations`, populate `artifacts[]` with final draft paths, update `task.json.updated_at`, advance `current_phase` to `phase_6_publication`.

---

### Phase 6 — Publication and Notification

**Entry**: Set `task.json.current_phase` to `phase_6_publication`; set `task.json.phases.publication.status` to `in_progress`; update `task.json.updated_at`.

1. Ask the user whether they want publication. Pause until answered.
2. If yes, confirm exact target Confluence page. Pause until confirmed.
3. Archive existing final outputs before overwrite:
   - `qa_plan_final.md` → `archive/qa_plan_final_<timestamp>.md`
   - `test_key_points_xmind_final.md` → `archive/test_key_points_xmind_final_<timestamp>.md`
4. Copy approved drafts to finals:
   - `drafts/qa_plan_v<N>.md` → `qa_plan_final.md`
   - `drafts/test_key_points_xmind_v<N>.md` → `test_key_points_xmind_final.md`
5. Publish `qa_plan_final.md` to Confluence using `confluence` skill.
6. Update `run.json.output_generated_at`.
7. Run `qa-plan-confluence-review` → save `qa_plan_confluence_review_v<N>.md`.
8. Branch on live review verdict:
   - pass → continue to notification
   - fix required → loop back to Phase 3 or Phase 5
9. Send Feishu notification via `feishu-notify`:
   ```
   Feature ${feature_id} QA Plan Complete ✅
   - QA Plan: qa_plan_final.md
   - Test Cases: test_key_points_xmind_final.md
   - Confluence: [link]
   ```
10. Set `task.json.current_phase` to `completed`, `overall_status` to `completed`, record completion timestamp.

---

## Handoff Artifacts

```
projects/feature-plan/<feature-id>/task.json
projects/feature-plan/<feature-id>/run.json
projects/feature-plan/<feature-id>/context/qa_plan_atlassian_*.md        ← Phase 1
projects/feature-plan/<feature-id>/context/qa_plan_github_*.md           ← Phase 1
projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_*.md  ← Phase 1
projects/feature-plan/<feature-id>/context/sub_test_cases_jira_*.md      ← Phase 2
projects/feature-plan/<feature-id>/context/sub_test_cases_confluence_*.md ← Phase 2
projects/feature-plan/<feature-id>/context/sub_test_cases_github_*.md    ← Phase 2
projects/feature-plan/<feature-id>/context/review_consolidated_*.md      ← Phase 4
projects/feature-plan/<feature-id>/drafts/qa_plan_v<N>.md                ← Phase 2
projects/feature-plan/<feature-id>/drafts/test_key_points_xmind_v<N>.md  ← Phase 3
projects/feature-plan/<feature-id>/qa_plan_final.md                      ← Phase 6
projects/feature-plan/<feature-id>/test_key_points_xmind_final.md        ← Phase 6
projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md     ← Phase 6
```

---

## Validation

Before considering the run complete:
```bash
cd workspace-planner/projects/feature-plan/<feature-id>
../scripts/check_resume.sh <feature-id>
jq -r '.current_phase, .overall_status, .latest_draft_version' task.json
jq -r '.phases | keys[]' task.json
jq -r '.phases | to_entries[] | "\(.key): \(.value.status)"' task.json
ls context/sub_test_cases_*.md
ls context/review_*.md
ls drafts/qa_plan_v*.md
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
- `qa-plan-atlassian` — Phase 1 context gathering
- `qa-plan-github` — Phase 1 context gathering
- `qa-plan-figma` — Phase 1 context gathering
- `qa-plan-synthesize` — Phase 2 (QA plan draft sections) + Phase 3 (XMind synthesis)
- `qa-plan-review` — Phase 5
- `qa-plan-refactor` — Phase 5
- `qa-plan-confluence-review` — Phase 6

---

**Last Updated**: 2026-03-07
**Status**: Active — Phases clarified, Phase 2 sub test case + QA plan draft tracking added to task.json
