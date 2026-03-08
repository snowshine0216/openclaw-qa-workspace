---
name: qa-plan-performance-dimension
description: Generates XMind-compatible performance sub-cases based on Jira ACs and PR diffs. Wraps performance-test-designer when a full performance plan is needed.
---

# QA Plan Performance Dimension

**Purpose**: Generates performance test scenarios in XMind format for the `## Performance` branch during Phase 2 (or on demand).

## Invocation Contract

**Input** (from orchestrator or `qa-plan-write`):
```json
{
  "mode": "performance",
  "feature_id": "BCIN-6709"
}
```

## Protocol

**Reads**:
- `context/jira_issue_<key>.md`
- `context/qa_plan_atlassian_<id>.md` (Confluence design docs)
- `context/github_diff_<repo>.md`

## Generation Rules

1. **Basic Coverage**:
   - Unless the PR is explicitly identified as UI-only (CSS/style changes with no data query impact), always generate two basic sub-cases:
     - `Baseline Load Time`: Verifies feature loads within expected SLA.
     - `Large Data`: Verifies feature doesn't freeze or crash with large datasets.

2. **SLA Extraction**:
   - Read Jira ACs and Design Docs for explicit performance SLAs.
   - If no explicit SLA is found, apply MicroStrategy defaults:
     - Dashboard Load: `< 5s`
     - Filter Application: `< 2s`
     - Report Export: `< 15s`
     - API Endpoint: `< 500ms`

3. **Delegation**:
   - If a dedicated "Performance" AC exists, or the PR significantly alters query execution pipelines, delegate to the `performance-test-designer` skill.
   - Run `performance-test-designer` to generate a full test plan, save it as `context/performance_plan_<id>.md`.
   - Add a reference to this plan in the XMind output under `## Performance`.

## Output

**Location**: `context/sub_test_cases_performance_<id>.md`
Save using `save_context.sh`.

**Format**:
```markdown
## Performance - P2
### Baseline Load Time
- Open [feature] with default dataset
  - Feature loads within [SLA]
### Large Data
- Load feature with large dataset (>1M rows)
  - No browser freeze or timeout beyond [SLA]
```

## Integration
- **Consumed by**: `qa-plan-synthesize` (Phase 5) merges this output alongside other domain sub test cases into the final XMind draft.
