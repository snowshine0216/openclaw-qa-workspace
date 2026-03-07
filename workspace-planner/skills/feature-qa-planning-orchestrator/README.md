# Feature QA Planning Orchestrator

> **Skill path:** `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
> **Last Updated:** 2026-03-07

---

## What it does

Give it a feature ID + Jira key + Confluence URL + GitHub PR URLs — it produces two final outputs:

| Output | What it is |
|---|---|
| `qa_plan_final.md` | QA plan narrative (goals, risks, background, sign-off checklist) |
| `test_key_points_xmind_final.md` | XMind-importable test cases with P0/P1/P2/P3 priority markers |

---

## Phase Overview

### Phase 0 — Check before doing anything
- Runs `check_resume.sh` to detect if work already exists
- Shows you the state (`FRESH` / `DRAFT_EXISTS` / `FINAL_EXISTS`) and asks what to do
- Initializes `task.json` + `run.json`
- **Never overwrites anything without your choice**

---

### Phase 1 — Gather context *(sub-agents, parallel)*
Spawns 2–3 sub-agents simultaneously:

| Sub-agent | Reads | Produces |
|---|---|---|
| Atlassian | Jira + Confluence | `context/qa_plan_atlassian_*.md` |
| GitHub | All PRs + diffs | `context/qa_plan_github_*.md` + traceability file |
| Figma *(if URL exists)* | Figma designs | `context/qa_plan_figma_*.md` |

---

### Phase 2 — Generate sub test cases + QA plan draft *(sub-agents, parallel)*

Two groups run simultaneously:

**Group A** — one sub-agent per evidence domain:

| Sub-agent | Evidence | Produces |
|---|---|---|
| jira_testcase | Jira issues | `context/sub_test_cases_jira_*.md` |
| confluence_testcase | Confluence design doc | `context/sub_test_cases_confluence_*.md` |
| github_testcase | PRs + traceability | `context/sub_test_cases_github_*.md` |

*Each agent stays strictly in its own domain — no cross-contamination.*

**Group B** — QA plan draft agent:
- Reads all context files → `drafts/qa_plan_v1.md` (narrative sections only, no test cases)

---

### Phase 3 — Synthesize *(main agent, 3-step protocol)*

Main agent reads all `sub_test_cases_*.md` and applies:

```
Step A — MERGE FIRST
  Read every sub test case file (jira → confluence → github → figma)
  Dump ALL items into one combined raw list with [src: ...] annotation
  Nothing discarded. Duplicates kept.

Step B — RESEARCH NON-ACTIONABLE ITEMS
  For each vague/jargon item:
    Search: research_*.md → confluence doc → github summaries → traceability
    If resolved → rewrite as concrete user action + observable result
    If NOT resolved → keep item + add <!-- TODO: ... --> comment
    NEVER delete or skip

Step C — DEDUPLICATE (only after A + B)
  Merge semantic duplicates → keep most specific/concrete version
  Preserve source attribution
```

Output: `drafts/test_key_points_xmind_v<N>.md`

---

### Phase 4 — Domain review *(sub-agents, parallel)*

Spawns 3 review sub-agents simultaneously:

| Sub-agent | Reviews against | Produces |
|---|---|---|
| jira_review | Jira sub test cases + all Jira issue files | `context/review_jira_*.md` |
| confluence_review | Confluence sub test cases + design doc | `context/review_confluence_*.md` |
| github_review | GitHub sub test cases + traceability map | `context/review_github_*.md` |

Main agent consolidates findings → `context/review_consolidated_*.md`

---

### Phase 5 — Refactor *(max 2 rounds)*
- Applies all blocking + non-blocking fixes from consolidated review
- Produces `drafts/test_key_points_xmind_v<N+1>.md`
- If still fails after 2 rounds → stops, reports unresolved issues to user

---

### Phase 6 — Publish *(waits for your approval)*
- Asks: publish to Confluence? Which page?
- Archives existing final files
- Copies approved draft → `qa_plan_final.md` + `test_key_points_xmind_final.md`
- Publishes to Confluence
- Sends Feishu notification

---

## Priority Definitions

| Priority | Meaning | Defined by |
|---|---|---|
| **P0** | Core user promise — if this fails, the feature doesn't work at all | User impact (not necessarily tied to a code change) |
| **P1** | Direct code change — a specific file/function was modified | Must trace to a GH trace ID (GH-xx) or Jira AC |
| **P2** | Affected area / cross-functional / compatibility | Feature touches this area but no direct code change |
| **P3** | Low priority — nice to have, can defer | Speculative, regression guard, template-retained |

---

## output_mode Quick Reference (`qa-plan-synthesize`)

```
Do you have sub_test_cases_*.md files already (Phase 2 done)?
  YES → "xmind_only"   ← DEFAULT, most common
  NO, only want QA plan narrative → "qa_plan_only"
  NO, want everything in one shot (no sub-agents) → "dual"
```

---

## task.json Phase Keys

```json
{
  "current_phase": "phase_0_preparation | phase_1_context_acquisition | phase_2_sub_testcase_generation | phase_3_synthesis | phase_4_domain_review | phase_5_review_refactor | phase_6_publication | completed",
  "phases": {
    "context_gathering": {},
    "sub_testcase_generation": {},
    "qa_plan_draft_generation": {},
    "synthesis": {},
    "domain_review": {},
    "review_refactor": {},
    "publication": {}
  }
}
```

---

## Related Skills

| Skill | Where | Used in |
|---|---|---|
| `qa-plan-atlassian` | workspace-planner/skills/ | Phase 1 |
| `qa-plan-github` | workspace-planner/skills/ | Phase 1 |
| `qa-plan-figma` | workspace-planner/skills/ | Phase 1 (optional) |
| `qa-plan-synthesize` | workspace-planner/skills/ | Phase 2 (qa_plan_only) + Phase 3 (xmind_only) |
| `qa-plan-review` | workspace-planner/skills/ | Phase 5 |
| `qa-plan-refactor` | workspace-planner/skills/ | Phase 5 |
| `qa-plan-confluence-review` | workspace-planner/skills/ | Phase 6 |
| `jira-cli` | ~/.openclaw/skills/ | Phase 0–1 |
| `confluence` | ~/.openclaw/skills/ | Phase 6 |
| `feishu-notify` | ~/.openclaw/skills/ | Phase 6 |
| `spawn-agent-session` | ~/.openclaw/skills/ | Phase 1, 2, 4 |
