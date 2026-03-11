---
name: qa-plan-write
description: Unified QA-plan writing skill for evidence gathering and final QA-plan drafting. Use when feature-qa-planning-orchestrator needs source artifacts saved or needs one unified QA plan written from all saved evidence.
---

# QA Plan Write

Use this skill for two modes:
- `mode=context`
- `mode=write-plan`

## Invocation contract

Input arrives through `context.json`.

```json
{
  "mode": "write-plan",
  "feature_id": "BCIN-6709",
  "draft_output": "drafts/qa_plan_v1.md"
}
```

Phase outputs are deterministic:
- `mode=context` saves source artifacts under `context/`
- `mode=write-plan` writes exactly one reviewed draft to the provided `draft_output` path

Resolve scripts from `projects/feature-plan/scripts/` and use:

```bash
"$SCRIPTS/save_context.sh" "$FEATURE_ID" "<artifact_name>" "<content_or_file>"
"$SCRIPTS/validate_context.sh" "$FEATURE_ID" --validate-testcase-structure "<file>"
"$SCRIPTS/validate_context.sh" "$FEATURE_ID" --validate-testcase-executability "<file>"
```

If required context is missing in `mode=write-plan`, stop and report the missing artifact.

## Shared contract

Always follow these sources together:
- `workspace-planner/skills/feature-qa-planning-orchestrator/references/canonical-testcase-contract.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/references/coverage-domains.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/templates/qa-plan-template.md`

## `mode=context`

- Fetch Jira issue content and linked issue content with `jira-cli`.
- Fetch Confluence design material with `confluence` when a design URL is available.
- Fetch GitHub PR or compare evidence with `github`.
- Read approved Figma snapshots or UX metadata when provided.
- Save each raw artifact immediately with `save_context.sh`.
- Save any background search artifact immediately before its result is reused.
- Save per-source summaries such as:
  - `qa_plan_atlassian_<feature-id>.md`
  - `qa_plan_github_<feature-id>.md`
  - `qa_plan_github_traceability_<feature-id>.md`
  - `qa_plan_figma_<feature-id>.md`
- Do not hand off to `mode=write-plan` until every required Phase 1 artifact already exists on disk under `context/`.

## `mode=write-plan`

Work section by section. Do not draft from memory or summary-first compression.

### Step 1 — Decide section structure

- Choose section names that fit the feature.
- Decide whether E2E is meaningful or should be omitted/replaced.
- Decide how Functional should be split into feature-relevant areas.

### Step 2 — Build coverage ledger per section

For each planned section, capture:
- behaviors covered
- required coverage domains owned by that section
- supporting artifacts
- scenario families
- risk/checkpoint areas considered
- gaps or TODOs

### Step 3 — Run checkpoints before drafting each section

For each section, ask (see `references/coverage-domains.md` for full prompts):
- Is there a happy-path or primary behavior here?
- Are there alternate branches?
- Are there boundary conditions?
- Are there invalid or extreme inputs?
- Are there permission/privilege differences?
- Are there empty/stale/partial states?
- Are there cancel/retry/re-entry flows?
- Are there copy/message/status expectations?
- Are there compatibility or environment differences?
- Are there nonfunctional considerations worth preserving?

### Step 4 — Draft section only after artifacts checked

- Read only saved artifacts from `context/`.
- Do not draft a section until all relevant artifacts for that section have been checked.
- Use sources one by one:
  - Confluence for the main behavior and workflow
  - Jira for repro fixtures and missing coverage
  - GitHub for edge cases, boundaries, performance-sensitive risk, and internal-only reasoning that should not become manual wording
  - Figma for copy, visible state, and user-flow detail
- Shape the output to align with the quality bar established in `docs/BCIN-6709_qa_plan.md` (e.g. concise, easy to scan, grouped by behavior). **DO NOT rigidly copy the sections or structural footprint of BCIN-6709 if they do not fit the feature.**
  - structured
  - concise
  - easy to understand
  - grouped by user-facing behavior
- Use scenario names such as `mode | error type | detailed action`.
- Cover required coverage domains; organize in the clearest feature-fit section structure. Create dynamic, feature-applicable headers instead of relying on a rigid blueprint.
- Add `<!-- Coverage domains: ... -->` in each section when the heading alone does not make ownership obvious.
- Explicitly avoid creating empty sections just to write `N/A`. Only use `N/A` inside a section's comment block if a core checkpoint was deliberately evaluated and found not applicable.
- Keep comments for rationale, priority justification, or evidence notes only.
- Keep manual testcase text user-facing and executable.
- If a missing detail is required:
  1. search cached context
  2. use saved background research
  3. save any newly added background artifact before using it
  4. if still unresolved, leave `<!-- TODO: specify trigger/action/result -->`

## Validation before save

Before finalizing any `mode=write-plan` artifact:
1. run structure validation
2. run executability validation
3. if validation fails, rewrite once and validate again
4. if validation still fails, stop and report the violations instead of saving a weak draft
5. if validation passes, save the approved Phase 2 draft only to `draft_output`

## Integration

Outputs from this skill are consumed by:
- `qa-plan-review`
- `qa-plan-refactor`
