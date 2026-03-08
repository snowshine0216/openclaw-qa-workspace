---
name: qa-plan-write
description: Unified QA planning skill for Atlassian, GitHub, and Figma evidence gathering plus canonical sub-testcase generation. Use when feature-qa-planning-orchestrator needs Phase 1 context fetches or Phase 2 domain testcase drafts that must follow the canonical testcase contract.
---

# QA Plan Write

Use this skill for three domain handlers:
- `atlassian`
- `github`
- `figma`

Each handler supports:
- `mode=context` for evidence collection only
- `mode=testcase` for canonical sub-testcase generation from cached context only

## Invocation Contract

Input arrives through `context.json`.

```json
{
  "domain": "github",
  "mode": "testcase",
  "feature_id": "BCIN-6709",
  "github_pr_urls": ["https://github.com/org/repo/pull/123"]
}
```

Resolve scripts from `projects/feature-plan/scripts/` and use:

```bash
"$SCRIPTS/save_context.sh" "$FEATURE_ID" "<artifact_name>" "<content_or_file>"
"$SCRIPTS/validate_context.sh" "$FEATURE_ID" --validate-testcase-structure "<file>"
"$SCRIPTS/validate_context.sh" "$FEATURE_ID" --validate-testcase-executability "<file>"
```

If required context is missing in `mode=testcase`, stop and report the missing artifact. Do not re-fetch live data in `mode=testcase`.

## Shared Contract for `mode=testcase`

Always follow these two sources together:
- `workspace-planner/skills/feature-qa-planning-orchestrator/references/canonical-testcase-contract.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md`

### Structural rules

- Preserve the canonical top-level structure in the required order.
- Only `EndToEnd` and `Functional` may be renamed.
- `xFunction`, `Error handling / Special cases`, `Accessibility`, `i18n`, `performance`, `upgrade / compatability`, `Embedding`, `AUTO: Automation-Only Tests`, and `📎 Artifacts Used` are fixed headings.
- If a fixed heading is not applicable, keep it and add `N/A — <reason>`.
- Never invent a domain-specific top-level heading such as `UI Testing`, `Security Test`, or `Platform`.

### Manual executability contract

Every manual testcase must state:
1. surface / location
2. concrete trigger
3. concrete user action
4. observable expected result

If any of the four items is missing:
- search cached context first
- then use Confluence or background research and save the result with `save_context.sh`
- if still unresolved, leave `<!-- TODO: specify trigger/action/result -->`
- do not fill the gap with generic wording

### Vagueness blacklist

Do not write phrases like:
- `Recover from a supported report execution or manipulation error`
- `Perform another valid editing action`
- `Observe the recovered state`
- `Verify correct recovery`
- `Matches documented branch behavior`

Rewrite them into trigger/action/result language or move the case to `## AUTO: Automation-Only Tests` if it is not manually executable.

## Handler: Atlassian

### `mode=context`

- Fetch Jira issue content and linked issue content with `jira-cli`.
- Fetch Confluence design material with `confluence` when a design URL is available.
- Save each raw artifact immediately with `save_context.sh`.
- Save an evidence summary as `qa_plan_atlassian_<feature-id>.md`.
- Save any discovered Figma link as `figma_link_<feature-id>.md`.

### `mode=testcase`

- Read `jira_issue_<id>.md`, `jira_related_issues_<id>.md`, and `qa_plan_atlassian_<id>.md`.
- Generate canonical XMind-style sub testcases using only cached context.
- Keep all fixed headings present.
- Make `Error handling / Special cases` concrete by naming the exact error branch or special condition.
- Add `Accessibility`, `i18n`, `performance`, `upgrade / compatability`, and `Embedding` coverage only when supported by evidence; otherwise keep the heading with `N/A — <reason>`.
- Save output as `sub_test_cases_atlassian_<feature-id>.md`.

## Handler: GitHub

### `mode=context`

- Fetch PR diffs and compare views with `github`.
- Build a traceability artifact that maps code facts to user-facing scenario implications.
- Save raw diff artifacts and save the summary as `qa_plan_github_<feature-id>.md`.
- Save the traceability artifact as `qa_plan_github_traceability_<feature-id>.md`.

### `mode=testcase`

- Read `qa_plan_github_<id>.md`, `qa_plan_github_traceability_<id>.md`, and fetched diff artifacts.
- Organize scenarios by user-facing behavior, never by repo name.
- Keep code references out of manual testcase wording.
- Move internal-only checks to `## AUTO: Automation-Only Tests`.
- Save output as `sub_test_cases_github_<feature-id>.md`.

## Handler: Figma

### `mode=context`

- Resolve the Figma URL or approved snapshots.
- Save fetched metadata or snapshot-derived notes under `context/figma/`.
- Save a user-facing evidence summary as `qa_plan_figma_<feature-id>.md`.

### `mode=testcase`

- Read `qa_plan_figma_<id>.md` plus any `context/figma/` artifacts.
- Generate the same canonical heading structure used by Atlassian and GitHub.
- Do not generate `## UI Testing` or any Figma-only top-level structure.
- Use Figma only to tighten surface, interaction, copy, and visible-state detail.
- Save output as `sub_test_cases_figma_<feature-id>.md`.

## Evidence-driven applicability rules

### Surfaces

- **One surface per testcase bullet.** Do not write "In Workstation or Library Web, do X". Use separate bullets per surface.
- **Merge only with explicit evidence.** Combine surfaces only when Jira, Confluence, or PR explicitly states identical behavior (e.g. "same flow on both surfaces"). Do not infer; when in doubt, keep separate.
- If a surface is intentionally not covered, say so with `N/A — <reason>` under the relevant heading.

### Performance

- Do not auto-generate performance coverage just because a feature is user-facing.
- Add concrete performance cases only when requirements, design notes, or code evidence indicate performance-sensitive behavior.
- Otherwise write `N/A — no explicit performance-sensitive change in scope`.

### Embedding

- Add embedding cases only when Jira, Confluence, or PR evidence shows an embedding surface or host integration.
- Do not infer embedding from the word `Library` alone.
- Otherwise write `N/A — not an embedding feature`.

## Resolution Chain

For any missing manual detail:
1. search cached `context/` artifacts
2. search Confluence or approved background material
3. save any new evidence with `save_context.sh`
4. if still unresolved, leave `<!-- TODO -->`

## Validation Before Save

Before finalizing any `mode=testcase` artifact:
1. run testcase structure validation
2. run testcase executability validation
3. if validation fails, rewrite once and validate again
4. if validation still fails, stop and report the violations instead of saving a weak draft

## Integration

Outputs from this skill are consumed by:
- `qa-plan-review` in Phase 3
- `qa-plan-synthesize` in Phase 5
