---
name: qa-plan-synthesize
description: Synthesizes domain sub-testcase artifacts into one canonical XMind-compatible draft. Use when feature-qa-planning-orchestrator reaches Phase 5 and needs a merged draft that passes XMindMark structure validation (markxmind).
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
- `references/qa-plan-contract-simple.md`
- `templates/qa-plan-template.md`
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

### Step 2: Coverage-ownership normalization pass

- Normalize only obviously equivalent aliases such as `End to End`/`E2E`, `Cross-Functional`/`xFunctional`, or close section-name variants.
- Preserve feature-fit top-level headings when they are semantically clear and already own the right coverage domain.
- Use `<!-- Coverage domains: ... -->` comments when section ownership would otherwise be ambiguous.
- Reject or rewrite vague custom headings such as `Misc`, `Other`, or headings that hide coverage ownership.
- Do not recreate omitted fixed headings just to mirror a scaffold.
- Do not add empty `N/A` sections solely to satisfy legacy structure.

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

### Step 4: Structural merge rules

- **One surface per testcase bullet.** Do not combine surfaces (e.g. "In Workstation or Library Web, do X"). Use separate bullets: "In Workstation, do X" and "In Library Web, do X".
- **Merge only with explicit evidence.** Combine into one bullet only when Jira, Confluence, or PR explicitly states identical behavior (e.g. "same flow on both surfaces", "parity verified"). Do not infer from similar wording; when in doubt, keep separate.
- Separate different recovery branches into separate leaves.
- Keep `Error handling / Special cases` concrete and branch-specific.
- Keep `📎 Artifacts Used` at the end and list every context or research artifact actually used.

### Step 5: Priority assignment

- Apply `docs/priority-assignment-rules.md` after normalization and executability rewrite.
- Preserve a clear, feature-fit reading order instead of forcing canonical heading order.
- Do not use priority tagging to justify dropping required coverage ownership.

### Step 6: Pre-save validation

Run markxmind validation before saving:

```bash
node .agents/skills/markxmind/scripts/validate_xmindmark.mjs "drafts/test_key_points_xmind_v<N+1>.md"
```

If validation fails:
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
