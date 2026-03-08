---
name: qa-plan-parity-checker
description: Phase 2.5 pre-flight. Cross-cuts all sub test cases to enforce surface completeness (Workstation vs Library vs BI Web) and check basic embedding and performance placeholders before domain review agents are spawned.
---

# QA Plan Parity Checker

**Purpose**: Phase 2.5 pre-flight check. Executes after Phase 2 (`qa-plan-write` test case generation) and before Phase 3 (`qa-plan-review` domain reviews). Enforces surface parity across all outputs to catch gaps that isolated domain agents miss.

## Invocation Contract

**Input** (from orchestrator via attachment `context.json`):
```json
{
  "mode": "parity",
  "feature_id": "BCIN-6709"
}
```

## Protocol

**Gate**: Call `validate_context.sh` before starting to confirm required context exists.

**Reads**:
- `context/sub_test_cases_atlassian_<id>.md`
- `context/sub_test_cases_github_<id>.md`
- `context/sub_test_cases_figma_<id>.md` (if available)
- `context/jira_issue_<key>.md` → to determine the feature's surface scope (Workstation, Library Web, BI Web, Library Mobile, Embedding).

## Parity Checks (PC-1 to PC-5)

1. **PC-1 (Workstation Parity)**: For each non-embedding functional scenario, the generic Workstation path is explicitly present or explicitly noted as N/A.
2. **PC-2 (Library Web Parity)**: For each non-embedding functional scenario, the Library Web path is explicitly present or explicitly noted as N/A.
3. **PC-3 (Mobile Parity)**: If "mobile" OR "iOS" OR "Android" is mentioned in ACs/Design, the Library Mobile path must be mentioned.
4. **PC-4 (Embedding Completeness)**: If the feature touches embedding code, the `## Embedding` section must be fully populated with both iFrame and Native SDK sub-cases.
5. **PC-5 (Performance Floor)**: The `## Performance` section must have at least 2 sub-cases (e.g., Baseline Load and Large Data) unless the PR is identified as UI-only.

## Output

**Location**: `context/review_parity_<id>.md`
Save using `save_context.sh`.

**Format**:
```markdown
# Review: Parity — [Feature ID]

## Status
Approved | Requires Updates

## Parity Findings
- [PC-1] [Scenario name] missing Workstation path coverage.
- [PC-2] [Scenario name] missing Library Web path coverage.

## Action Items
- [ ] [Issue to pass to Phase 4 handlers]
```

## Integration
- **Consumed by**: Orchestrator explicitly reads `Status`. If `Requires Updates`, findings are passed to Phase 4 refactor handlers.
