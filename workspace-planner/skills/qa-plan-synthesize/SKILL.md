---
name: qa-plan-synthesize
description: Synthesizes domain sub-testcase artifacts into one canonical XMind-compatible draft. Use when feature-qa-planning-orchestrator reaches Phase 5 and needs a merged draft that passes structure and executability validation.
---

# QA Plan Synthesize

Produce exactly one output: `drafts/test_key_points_xmind_v<N+1>.md`.

## Prerequisites

The orchestrator must pass resolved paths and must call:

```bash
validate_context.sh <feature-id> --resolve-sub-testcases atlassian github figma
validate_context.sh <feature-id> "qa_plan_github_traceability_<id>"
```

The synthesizer uses only the paths it receives. It does not re-infer paths.

## Required references

Always use:
- `references/canonical-testcase-contract.md`
- `templates/test-case-template.md`
- `docs/priority-assignment-rules.md`

## Input contract

```json
{
  "feature_id": "BCIN-6709",
  "sub_testcase_files": [
    "context/sub_test_cases_atlassian_BCIN-6709_v2.md",
    "context/sub_test_cases_github_BCIN-6709.md",
    "context/sub_test_cases_figma_BCIN-6709.md"
  ],
  "context_files": [
    "context/qa_plan_github_traceability_BCIN-6709.md",
    "context/qa_plan_atlassian_BCIN-6709.md"
  ],
  "output": "drafts/test_key_points_xmind_v<N+1>.md"
}
```

## Workflow

### Step 1: Collect without filtering

- Read every resolved sub-testcase file.
- Merge every item into a working list.
- Preserve source attribution for each item.
- Do not deduplicate yet.

### Step 2: Heading normalization pass

- Normalize every top-level heading to the canonical structure.
- Only map aliases for `EndToEnd` and `Functional`.
- Any illegal custom top-level heading must be remapped into the correct canonical bucket or rejected.
- Recreate missing fixed headings even if a source omitted them.
- If a fixed heading has no evidence-backed content, keep it with `N/A — <reason>`.

### Step 3: Executability rewrite pass

For every manual testcase candidate:
- make the surface explicit
- make the exact trigger explicit
- make the exact user action explicit
- make the visible expected result explicit

If the item still depends on internal code state:
- move it to `## AUTO: Automation-Only Tests`

If a detail is missing:
- search cached context first
- then use saved Confluence or background research
- save newly used background artifacts with `save_context.sh`
- if still unresolved, keep `<!-- TODO -->`

### Step 4: Subcategory design pass

Before final merge, rebuild the draft into a clear XMind-style tree.

- Under `Functional`, organize by **workflow area first**, not by mixed behavior summaries.
- Preferred workflow-area buckets include things like:
  - `Pause mode`
  - `Consumption mode`
  - `Switch between pause mode and consumption mode`
  - `Prompt`
  - `Reprompt`
  - `Prompt-in-prompt`
  - `Undo / Redo`
  - `Details popup`
  - `Continued editing after recovery`
- Under `Error handling / Special cases`, organize by **error family** or **recovery branch**, not by one mixed catch-all group.
- Under `xFunction`, organize by **cross-surface comparison theme** or **policy comparison theme**.
- Do not create a subcategory title that joins 3 or more unrelated concepts with commas or `and`.
- If a subcategory title mixes multiple workflows, split it into smaller subcategories.
- Prefer 3–5 concise scenario leaves under a subcategory when evidence supports them.
- Leaf wording should be short and parallel for XMind readability; avoid paragraph-style bullets when a shorter scenario leaf will preserve meaning.

### Step 5: Structural merge rules

- **One surface per testcase bullet.** Do not combine surfaces (e.g. "In Workstation or Library Web, do X"). Use separate bullets: "In Workstation, do X" and "In Library Web, do X".
- **Merge only with explicit evidence.** Combine into one bullet only when Jira, Confluence, or PR explicitly states identical behavior (e.g. "same flow on both surfaces", "parity verified"). Do not infer from similar wording; when in doubt, keep separate.
- **Do not deduplicate for convenience.** If two leaves are not clearly true duplicates, preserve both.
- Separate different recovery branches into separate leaves.
- Keep `Error handling / Special cases` concrete and branch-specific.
- Keep `📎 Artifacts Used` at the end and list every context or research artifact actually used.

### Step 6: XMind compression pass

Before save, compress verbose testcase wording into concise XMind-style leaves without dropping coverage.

- Keep the hierarchy readable at a glance.
- Remove repeated setup text from sibling leaves when the subcategory already establishes the context.
- Prefer concise scenario names plus visible outcome wording over long prose.
- If a leaf becomes hard to scan in XMind, split it.
- Do not shorten by deleting coverage; shorten by restructuring.

### Step 7: Priority assignment

- Apply `docs/priority-assignment-rules.md` after normalization and executability rewrite.
- Preserve the heading order from the canonical contract.
- Do not use priority tagging to justify dropping any fixed section.

### Step 6: Pre-save validation

Run both checks before saving:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "drafts/test_key_points_xmind_v<N+1>.md"
validate_context.sh <feature-id> --validate-testcase-executability "drafts/test_key_points_xmind_v<N+1>.md"
```

If either check fails:
- rewrite once
- re-run both checks
- if still failing, return an explicit error to the orchestrator and do not save a weak draft as final Phase 5 output

## Error handling

- Missing resolved sub-testcase file: fail immediately
- Missing traceability file: fail immediately
- Unresolved manual detail after the resolution chain: keep `<!-- TODO -->` and surface it in the output instead of inventing vague text

## Integration

Input from:
- `qa-plan-write`
- `qa-plan-review` / Phase 4 `_v2` outputs

Output consumed by:
- `qa-plan-review` in Phase 6
- `qa-plan-refactor` in Phase 7
