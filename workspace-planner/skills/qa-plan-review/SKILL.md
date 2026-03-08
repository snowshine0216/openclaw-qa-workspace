---
name: qa-plan-review
description: Reviews and refactors QA sub-testcase artifacts against the canonical testcase contract. Use in Phase 3 for domain review, Phase 4 for domain refactor, and Phase 6 for consolidated XMind review.
---

# QA Plan Review

Use this skill in three modes:
- `mode=review`
- `mode=refactor`
- `mode=consolidated`

## Invocation Contract

Input arrives through `context.json`.

```json
{
  "domain": "github",
  "mode": "review",
  "feature_id": "BCIN-6709"
}
```

## Shared Review Contract

Always review against:
- `references/canonical-testcase-contract.md`
- `templates/test-case-template.md`
- relevant cached `context/` artifacts for the current domain

Always run:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "<file>"
validate_context.sh <feature-id> --validate-testcase-executability "<file>"
```

## Finding taxonomy

### Structural findings

- `ST-1` missing required top-level heading
- `ST-2` illegal rename of a fixed heading
- `ST-3` missing `N/A — <reason>` under a fixed heading with no applicable coverage
- `ST-4` illegal custom top-level heading

### Executability findings

- `EX-1` vague trigger
- `EX-2` vague user action
- `EX-3` vague expected result
- `EX-4` code or implementation wording appears in a manual testcase
- `EX-5` multiple surfaces collapsed into one bullet (e.g. "In Workstation or Library Web") without explicit evidence of identical behavior — split into separate bullets per surface
- `EX-6` manual testcase actually belongs in `AUTO`

## `mode=review` handlers

### `jira`

- Compare Atlassian-derived sub testcases against Jira issue details and related issues.
- Confirm the manual cases are consistent with requirements and concrete enough to execute.

### `confluence`

- Compare sub testcases against design-document wording and visual flows.
- Tighten missing trigger, state, or expected-result detail.

### `github`

- Compare sub testcases against traceability and code-change summaries.
- Ensure code-only checks are not left in manual sections.

### `figma`

- Compare sub testcases against UI evidence and visible interaction detail.
- Tighten surface names, copy, and visible-state expectations.

## `mode=refactor` handlers

### `atlassian`, `github`, `figma`

- Read the Phase 3 review artifacts relevant to the domain.
- Apply only the requested structural and executability fixes.
- Save `_v2` outputs only when content actually changes.
- Re-run structure and executability validation before finishing.

## `mode=consolidated`

- Review `drafts/test_key_points_xmind_v<N>.md` as the single synthesized draft.
- Fail the review if any fixed heading is missing, illegally renamed, or left vague.
- Fail the review if any manual testcase still contains generic recovery language.

## Required review output format

Every review artifact must use this structure:

```md
## Status
Pass | Pass with Findings | Fail

## Structural Findings
- ST-1 ...

## Executability Findings
- EX-1 ...

## Evidence Gaps
- Missing or unresolved evidence

## Required Refactors
- Deterministic rewrite actions

## Pass/Fail Summary
- Short disposition
```

## Approval rule

Do not approve a review artifact if:
- any fixed heading is missing
- any fixed heading was renamed
- any mandatory fixed section was dropped instead of marked `N/A — <reason>`
- any manual testcase still requires the tester to guess the trigger, action, or visible result
