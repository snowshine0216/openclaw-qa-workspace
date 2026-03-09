---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use for artifact-first QA plan generation across runtime preparation, evidence gathering, unified plan writing, review, deterministic refactor, and final publication.
---

# Feature QA Planning Orchestrator

This skill owns the full QA-plan workflow.

## Required references

Always use:
- `reference.md`
- `references/qa-plan-contract-simple.md`
- `templates/qa-plan-template.md`

## Core invariants

- Final output is a unified QA plan in valid XMindMark.
- **MUST use skill: markxmind** — writer, review, and refactor all follow this.
- Top priority (P1/P2/P3) must be obeyed; do not remove or ignore priority markers.
- The final plan should read like `docs/BCIN-6709_qa_plan.md`: structured, concise, and easy to understand.
- Manual steps must be concrete enough to execute without guessing.
- No phase may silently publish a draft that fails XMindMark structure validation (markxmind skill only).
- No fetched or background-research artifact may influence the draft before it is saved to `context/`.

## Required inputs

- `feature_id`
- Jira key and/or equivalent source-of-truth issue reference
- optional Confluence URL
- optional GitHub PR or compare URLs
- optional Figma URL or approved snapshots

## Phase overview

1. Phase 0 — existing-state check and runtime preparation
2. Phase 1 — context gathering (spawn subagents per source)
3. Phase 2 — unified QA-plan writing (orchestrator, no spawn)
4. Phase 3 — unified QA-plan review (orchestrator, no spawn)
5. Phase 4 — deterministic QA-plan refactor (orchestrator, no spawn)
6. Phase 5 — finalize and notify

## Stage artifact contract

Every phase must leave a deterministic on-disk artifact before the next phase begins:

| Phase | Required artifact(s) |
| --- | --- |
| Phase 0 | current `task.json`, current `run.json`, and deployed runtime scripts under `projects/feature-plan/scripts/` |
| Phase 1 | saved context artifacts under `context/` such as `qa_plan_atlassian_<id>.md`, `qa_plan_github_<id>.md`, `qa_plan_github_traceability_<id>.md`, and `qa_plan_figma_<id>.md` |
| Phase 2 | `drafts/qa_plan_v<N>.md` |
| Phase 3 | `context/review_qa_plan_<id>.md` |
| Phase 4 | `drafts/qa_plan_v<N+1>.md` |
| Phase 5 | `qa_plan_final.md` plus the archived prior final when overwrite occurs |

Do not advance phases on in-memory output alone. Each handoff must reference the saved stage artifact path.

## Phase 0 — Preparation

- Load state from `task.json` and `run.json`.
- Preserve the existing `REPORT_STATE` behavior from `reference.md`.
- Ensure `projects/feature-plan/scripts/` exists.
- Ensure `node` is available in the runtime environment (markxmind validator requires it).
- Deploy these scripts from `scripts/lib/` into the runtime scripts directory before any other phase uses them:
  - `save_context.sh`
- Use `scripts/lib/deploy_runtime_context_tools.sh` for the runtime copy step.
- Stop immediately if the runtime directory is missing the deployed scripts after the copy step.
- Do not auto-select destructive resume options.

## Phase 1 — Context gathering

- **Spawn subagents** per source family (e.g., qa-plan-atlassian, qa-plan-github, qa-plan-figma or equivalent) to fetch Jira, Confluence, GitHub, Figma evidence.
- Do NOT spawn qa-plan-write, qa-plan-review, or qa-plan-refactor.
- Require raw evidence to be saved immediately after fetch via `save_context.sh`.
- Require background searches to be saved immediately before their results are reused.
- Save per-source summaries and update the evidence manifest.
- Stop on missing primary system-of-record access.

## Phase 2 — Unified QA-plan writing (orchestrator, no spawn)

The orchestrator performs write internally. Two steps:

**Step 1 — Write scenarios and test cases:** List all test scenarios and test cases in scenario → Step 1 → (optional Step 2) → expected result structure. LLM decides organization. Use markxmind for XMindMark output. Optional intermediate: `drafts/qa_plan_v1_raw.md`.

**Step 2 — Group and mark priority:** Group scenarios into top categories (do not remove top categories). Apply P1/P2/P3. Highlight risky parts. Output: `drafts/qa_plan_v1.md`.

- Pass only saved artifacts and runtime script paths.
- Use sources one by one: Confluence for main behavior and flow, Jira for repro fixtures and missing coverage, GitHub for edge cases and boundaries, Figma/UX evidence for wording and visible-state expectations.
- Require the draft to follow `references/qa-plan-contract-simple.md` and `templates/qa-plan-template.md`.
- Before accepting the draft, validate XMindMark structure only: `node .agents/skills/markxmind/scripts/validate_xmindmark.mjs "drafts/qa_plan_v<N>.md"`
- If validation fails, rewrite once before the orchestrator accepts the draft.

## Phase 3 — Unified QA-plan review (orchestrator, no spawn)

- The orchestrator performs review internally.
- Review the unified draft against `references/qa-plan-contract-simple.md`.
- Require the reviewer to save the completed review to `context/review_qa_plan_<feature-id>.md` before Phase 4 starts.
- Review for: coverage, simplicity, structure, wording, priority markers, risky areas.
- Fail the phase if: a required priority marker is missing, a section becomes too vague to execute, or saved evidence is missing for a claim used in the draft.

## Phase 4 — Deterministic QA-plan refactor (orchestrator, no spawn)

- The orchestrator applies review findings internally.
- Pass the saved review artifact path `context/review_qa_plan_<feature-id>.md` directly.
- Apply only the requested review fixes.
- Re-run markxmind validator on the rewritten draft.
- **Review rounds:** Orchestrator decides how many review→refactor rounds. May loop (Phase 3 → Phase 4 → Phase 3 again) until satisfied or max retries.
- Allow at most one retry after the initial refactor pass within a single round.
- If the draft still fails validation, stop and report the remaining blockers.

## Phase 5 — Finalize + notify

- Ask the user for final approval before promoting the draft to `qa_plan_final.md`.
- Archive the prior final artifact before overwrite.
- Notify via `feishu-notify` after finalization.

## Completion gate

Do not finalize the workflow unless all of the following are true:
- top priority (P1/P2/P3) markers are present and obeyed
- no required behavior family was silently dropped during section reshaping
- manual cases are concrete enough to execute
- the draft passed XMindMark structure validation (markxmind)
- all reused evidence was saved to `context/`
- every phase saved its required stage artifact before handoff
