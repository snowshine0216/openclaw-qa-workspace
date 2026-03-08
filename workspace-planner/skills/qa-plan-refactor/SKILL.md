---
name: qa-plan-refactor
description: Refactors XMind test case drafts based on consolidated review feedback. Phase 7 of feature QA planning. Use when the orchestrator has Phase 6 review_consolidated_<id>.md and needs to apply findings to the XMind draft. Output: drafts/test_key_points_xmind_v<N+1>.md only — no QA plan narrative.
---

# QA Plan Refactor (Phase 7 — XMind Only)

Apply consolidated review findings to the XMind test case draft. **Single responsibility**: update XMind bullet hierarchy only. No QA plan narrative.

## When to Use

- Orchestrator calls this skill in **Phase 7** after Phase 6 consolidated review completes
- User asks to "apply review feedback to XMind" or "refactor test cases based on review"

## Prerequisites

**Required**:
- `drafts/test_key_points_xmind_v<N>.md` — XMind draft to refactor
- `context/review_consolidated_<id>.md` — Phase 6 review findings

**Optional** (for verification — read from cached `context/` only, no live re-fetch unless missing):
- `context/qa_plan_github_traceability_<id>.md`
- `context/jira_issue_<key>.md`
- Other context files listed in `## 📎 Artifacts Used`

## Input Parameters

```javascript
{
  feature_id: "BCIN-6709",
  draft_path: "drafts/test_key_points_xmind_v<N>.md",
  review_path: "context/review_consolidated_BCIN-6709.md",
  output: "drafts/test_key_points_xmind_v<N+1>.md"
}
```

## Workflow

### Step 1: Read XMind Draft and Review Findings

Read the draft and `review_consolidated_<id>.md`. Extract action items from the review (X1–X5 findings, Action Items section).

### Step 2: Apply Refactor to XMind Bullet Hierarchy

Refactor applies to **XMind bullet hierarchy only**:
- Fix category headers (`##` — add missing P1/P2/P3 markers)
- Fix sub-category headers (`###` — add priority or ensure inheritance)
- Rewrite steps with code vocabulary → user-observable language
- Add expected results as leaf nodes where missing
- Add `## AUTO: Automation-Only Tests` if missing
- Add or fix `## 📎 Artifacts Used` section

**Do NOT**:
- Generate or update QA plan narrative
- Use table-based update strategy
- Remove content unless review flagged it

### Step 3: UE Fix Mapping (Unchanged)

Map blocking UE findings as follows:

| UE | Fix |
|----|-----|
| UE-1 | Replace internal code wording with user-facing language |
| UE-2 | Rewrite expected results to observable outcomes |
| UE-3 | Add numbered steps or Given/When/Then structure |
| UE-4 | Split multi-path rows |
| UE-5 | Add `FAILS if:` |
| UE-6 | Move scenario to `## AUTO: Automation-Only Tests` |

### Step 4: Background Search (If Needed)

If a fix requires clarification:
- Search `context/` files first
- Confluence search via `confluence` skill → `save_context.sh` before use
- Tavily search via `tavily-search` skill → `save_context.sh` before use
- If unresolved: keep `<!-- TODO -->` — **NEVER remove**

### Step 5: Write Output

**Output**: `drafts/test_key_points_xmind_v<N+1>.md` only.

**Versioning**:
- Determine N from `task.json.latest_xmind_version` or scan `drafts/test_key_points_xmind_v*.md`
- Write to `test_key_points_xmind_v<N+1>.md`
- Update `task.json.latest_xmind_version = N+1`

**Preserve**:
- XMind hierarchical structure (template scaffold)
- `## 📎 Artifacts Used` section (update if new artifacts used during refactor)
- All existing content unless review flagged it

---

## Refactor Principles

### Direct Mapping

Every edit must map to a review action item. Don't add content not requested. Don't remove content unless review flagged it.

### Cached Artifacts First

Read from `context/` only. Only do live re-fetch if a specific artifact is missing AND user permits.

### XMind Format

Output MUST match `workspace-planner/skills/feature-qa-planning-orchestrator/templates/test-case-template.md` scaffold. Category headers, sub-categories, bullet steps, leaf expected results.

---

## Error Handling

**If draft not found**: Return error, list available drafts.

**If review not found**: Return error, cannot refactor without findings.

**If action item ambiguous**: Check context files. If still unclear, flag for user.

---

## Integration

**Input from**: `qa-plan-review` (Phase 6 consolidated review)

**Output consumed by**: Phase 8 finalize (promotion to `test_key_points_xmind_final.md`)

---

**Last Updated**: 2026-03-08
**Status**: XMind-only (Phase 7); no QA plan narrative; UE-fix mapping preserved; dynamic draft versioning
