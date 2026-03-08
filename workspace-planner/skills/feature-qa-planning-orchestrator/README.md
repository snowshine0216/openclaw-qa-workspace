# Feature QA Planning Orchestrator

> **Skill path:** `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
> **Last Updated:** 2026-03-08

---

## What it does

Give it a feature ID + Jira + Confluence + GitHub PRs → produces ONE final output:

| Output | What it is |
|--------|------------|
| `test_key_points_xmind_final.md` | XMind-importable test cases with P1/P2/P3 priority markers |

---

## Phase Overview  (Phase 0 → Phase 8)

### Phase 0 — Idempotency check (check_resume.sh)  [unchanged]
### Phase 1 — Context gathering (sub-agents via `qa-plan-write`: atlassian, github, figma)
### Phase 2 — Sub test case generation (sub-agents via `qa-plan-write`, one per domain)
### Phase 3 — Sub test case review (4 domain sub-agents)
### Phase 4 — Sub test case refactor (per-domain, based on Phase 3 reviews)
### Phase 5 — Synthesize (single agent → unified XMind draft)
### Phase 6 — Synthesized XMind review (single agent, reuses Phase 3 artifacts)
### Phase 7 — Final refactor (single agent)
### Phase 8 — Finalize + Feishu notify (no Confluence publish)

---

## Scripts

| Script | Purpose |
|--------|---------|
| `check_resume.sh` | Idempotency state check |
| `save_context.sh` | Save any fetched artifact to context/ |
| `validate_context.sh` | Gate: verify required inputs exist before phase start |

---

## Priority Definitions

| Priority | Meaning |
|----------|---------| 
| **P1** | Direct code change — traced to GitHub PR diff |
| **P2** | Affected area / cross-functional / Jira AC / compatibility |
| **P3** | Edge case, template-retained, nice to have — can defer |

---

## task.json Phase Keys

current_phase enum:
  phase_0_preparation → phase_1_context_gathering → phase_2_sub_testcase_generation
  → phase_3_sub_testcase_review → phase_4_sub_testcase_refactor → phase_5_synthesis
  → phase_6_xmind_review → phase_7_final_refactor → phase_8_publication → completed

phases keys:
  context_gathering, sub_testcase_generation, sub_testcase_review,
  sub_testcase_refactor, synthesis, xmind_review, final_refactor, publication

---

## Related Skills

| Skill | Skill Path | Used in |
|-------|------------|---------|
| **qa-plan-write** (atlassian, github, figma handlers) | `workspace-planner/skills/qa-plan-write/` | Phase 1, 2 — spawned via `sessions_spawn()` |
| **qa-plan-review** (review + refactor + consolidated) | `workspace-planner/skills/qa-plan-review/` | Phase 3 (`mode: review`), Phase 4 (`mode: refactor`), Phase 6 (consolidated XMind review) — Phase 3/4 spawned via `sessions_spawn()` |
| qa-plan-synthesize   | `workspace-planner/skills/qa-plan-synthesize/` | Phase 5 (xmind_only) |
| qa-plan-refactor     | `workspace-planner/skills/qa-plan-refactor/` | Phase 7 |
| jira-cli             | `~/.openclaw/skills/jira-cli/` | Phase 0–1 |
| feishu-notify        | `~/.openclaw/skills/feishu-notify/` | Phase 8 |
| spawn-agent-session  | `~/.openclaw/skills/spawn-agent-session/` | Phase 1, 2, 3, 4 — orchestrator uses this to normalize all `sessions_spawn()` calls |
