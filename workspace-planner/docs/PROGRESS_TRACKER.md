# QA Planning Workflow — Progress Tracker

> **Last Updated:** 2026-03-07
> **Feature in Progress:** BCIN-6709-test
> **Project Path:** `workspace-planner/projects/feature-plan/BCIN-6709-test/`

---

## Current Task Status

| Item | Status | Notes |
|---|---|---|
| Feature QA Planning Orchestrator skill | ✅ Updated | Phase structure clarified, Phase 2 tracking added to task.json |
| QA Plan Synthesize skill | ✅ Updated | 3-step protocol, output_mode split, sub_testcase_files as primary input |
| BCIN-6709-test synthesis (v8) | ✅ Done | `drafts/test_key_points_xmind_v8.md` |
| task.json — phase tracking | ✅ Updated | All phases through synthesis recorded |
| Phase 4 domain review | 🔲 Not started | Awaiting user go-ahead |
| Phase 5 refactor | 🔲 Not started | Depends on Phase 4 |
| Phase 6 publication | 🔲 Not started | Requires explicit user approval |

---

## What Changed Today (2026-03-07)

### Problem Fixed
Synthesis was **discarding vague/non-actionable items** (e.g. "normal report manipulations", "modeling-service-based change") instead of researching them. This caused coverage gaps in the XMind test case output.

### Skills Updated

#### 1. `feature-qa-planning-orchestrator` (`skills/feature-qa-planning-orchestrator/SKILL.md`)

**What changed:**
- Phase structure rewritten to match Snow's canonical intent:
  - Phase 1: Context gathering via sub-agents (atlassian, github, figma)
  - Phase 2: Domain sub test cases + QA plan draft via sub-agents (jira_testcase, confluence_testcase, github_testcase, qa_plan_draft)
  - Phase 3: Synthesize sub test cases → unified XMind test case draft
  - Phase 4: Domain review (per-source review sub-agents)
  - Phase 5: Refactor loop
  - Phase 6: Publication + notification
- `task.json` schema now includes `sub_testcase_generation` and `qa_plan_draft_generation` as tracked phases with `spawned_agents[]` and `artifacts[]` per phase
- Phase keys are consistent throughout (was mismatched before — e.g. Phase 3 in prose but `phase_2_synthesis` in task.json)

#### 2. `qa-plan-synthesize` (`skills/qa-plan-synthesize/SKILL.md`)

**What changed:**
- Added `output_mode` split: `qa_plan_only` (Phase 2) / `xmind_only` (Phase 3) / `dual` (legacy)
- Added `sub_testcase_files` as **primary input** for `xmind_only` mode
- `context_files` and `research_files` are now secondary — only used in the Research step
- **Core Synthesis Protocol (3-step)** is now mandatory and clearly sequenced:

  | Step | What it does | Rule |
  |---|---|---|
  | **A — Merge** | Read all sub test case files, copy ALL items into one combined list with source annotation | Nothing discarded. Duplicates kept. |
  | **B — Research** | For each non-actionable item, search context + research files to resolve into concrete user actions | If resolved → rewrite. If not → keep with `<!-- TODO: ... -->` note. Never delete. |
  | **C — Deduplicate** | Only after A+B complete, merge semantic duplicates into most specific/concrete version | Preserve source attribution. |

---

## Synthesis Run: BCIN-6709-test v8

### What the 3-step protocol resolved

| Non-actionable item (from sub test cases) | Source | Research result |
|---|---|---|
| "normal report manipulations" (Confluence pause-mode P1) | `sub_test_cases_confluence` | Resolved via `confluence_design_doc` §2.2: `POST /api/documents/{instanceId}/manipulations` = view-template changes. Concrete actions: apply view filter, sort rows, change display settings, resize column. |
| "modeling-service-based change" (Confluence running-mode P1) | `sub_test_cases_confluence` | Resolved via `research_modeling_service.md` + `confluence_design_doc`: `PUT /api/model/reports/{reportId}`. Three confirmed concrete options: (A) Advanced Properties row limit, (B) Join type → Cross Join, (C) Add/remove template attribute. |

### Output
- `drafts/test_key_points_xmind_v8.md` — all items actionable; none discarded; no `<!-- TODO -->` items remaining (all resolved by research)

---

## What Still Needs To Be Done

### BCIN-6709-test

| Phase | Action | Owner |
|---|---|---|
| Phase 4 — Domain Review | Spawn review sub-agents (jira_review, confluence_review, github_review) to validate v8 against each source domain | Agent (awaiting go-ahead) |
| Phase 5 — Refactor | Apply consolidated review findings to produce final XMind test case + QA plan | Agent |
| Phase 6 — Publication | User approval required → publish to Confluence, send Feishu notification | User approval first |

### Ongoing skill maintenance

| Item | Action needed |
|---|---|
| `qa-plan-synthesize` `When to Use` description | Reflects new output_mode split ✅ |
| `feature-qa-planning-orchestrator` reference.md | May need update to match new phase numbering |
| `docs/FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md` | Superseded by today's orchestrator rewrite — consider archiving or appending a "Phase 2 tracking addendum" section |

---

## Skill: qa-plan-synthesize — 3-Step Protocol Quick Reference

```
Step A: MERGE ALL FIRST
  → Read every sub_testcase_file (jira → confluence → github → figma)
  → Dump ALL items into one raw combined list
  → Annotate source per item [src: confluence] etc.
  → Do NOT filter anything here

Step B: RESEARCH NON-ACTIONABLE ITEMS
  → Non-actionable = vague trigger, code jargon, no concrete user steps
  → Search order: research_*.md → confluence design doc → github summaries → traceability
  → If resolved → rewrite as concrete user action + observable result
  → If NOT resolved → keep item + add <!-- TODO: Cannot specify concrete action — clarify what user steps trigger this behavior -->
  → NEVER delete or skip

Step C: DEDUPLICATE
  → Only runs after A + B complete
  → Merge semantic duplicates → keep most specific/concrete version
  → Keep source attribution
```

---

## File Map

```
workspace-planner/
  skills/
    feature-qa-planning-orchestrator/SKILL.md   ← Updated 2026-03-07
    qa-plan-synthesize/SKILL.md                 ← Updated 2026-03-07
  docs/
    PROGRESS_TRACKER.md                         ← This file
    FEATURE_QA_PLANNING_REDESIGN_2026-03-06.md  ← Prior design (partially superseded)
  projects/feature-plan/BCIN-6709-test/
    task.json                                   ← Updated 2026-03-07, phase_3_synthesis complete
    drafts/test_key_points_xmind_v8.md          ← Current synthesis output
    context/
      sub_test_cases_jira_BCIN-6709.md          ← Phase 2 artifact
      sub_test_cases_confluence_BCIN-6709.md    ← Phase 2 artifact
      sub_test_cases_github_BCIN-6709.md        ← Phase 2 artifact
```
