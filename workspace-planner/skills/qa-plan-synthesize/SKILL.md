---
name: qa-plan-synthesize
description: Synthesizes QA domain summaries from Figma, GitHub, and Atlassian sources into TWO outputs — (1) comprehensive QA plan without test key points, and (2) XMind-compatible test cases with smart P1/P2/P3 priority assignment based on code traceability.
---

# QA Plan Synthesize

Consolidate QA domain summaries from Figma design analysis, GitHub PR analysis, and Atlassian requirements analysis into draft outputs that are then reviewed/refactored into final outputs:
1. **QA plan draft** aligned to `qa-plan-template.md` (all sections EXCEPT test key points)
2. **XMind-compatible test-case draft** (hierarchical bullet format with priorities, user-observable wording only)

## When to Use

- User has run multiple QA domain analysis skills (figma, github, atlassian)
- User asks to "consolidate QA plans" or "merge QA analysis"
- User wants a "comprehensive QA plan" combining all sources
- Orchestrator calls this skill in Phase 2 (Synthesis)

## Prerequisites

At least ONE of the following domain summaries should exist:
- `projects/feature-plan/<feature-id>/context/qa_plan_figma_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_github_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_<feature_id>.md` (Required for P1 assignment)
- `projects/feature-plan/<feature-id>/context/qa_plan_atlassian_<feature_id>.md`
- `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature_id>.md` (Optional)
- `projects/feature-plan/<feature-id>/context/qa_plan_defect_analysis_<feature_id>.md` (Optional)

## Input Parameters

```javascript
{
  feature_id: "BCIN-6709",
  context_files: [
    "context/qa_plan_atlassian_BCIN-6709.md",
    "context/qa_plan_github_BCIN-6709.md",
    "context/qa_plan_github_traceability_BCIN-6709.md",
    "context/qa_plan_figma_BCIN-6709.md"
  ],
  output_mode: "dual", // "single" (legacy) or "dual" (new)
  outputs: {
    main_plan: "drafts/qa_plan_v<N+1>.md",
    xmind_tests: "test_key_points_xmind.md"
  },
  priority_rules: "docs/priority-assignment-rules.md" // path to priority logic
}
```

## Workflow

### Step 1: Gather Input Summaries

**Locate existing domain summaries**:
```bash
ls projects/feature-plan/<feature-id>/context/qa_plan_*
```

Read each available domain summary file:
1. **Figma summary**: UI components, visual tests, E2E workflows
2. **GitHub summary**: User-facing code-change scenarios, risk areas
   - **GitHub traceability**: Code refs for P1 priority mapping (REQUIRED)
3. **Atlassian summary**: Requirements, acceptance criteria, business context
4. **Background summary** (Optional): Additional domain knowledge
5. **Defect Analysis summary** (Optional): Risk areas, regression focus

**Extract key data from each**:
- Summary metadata (URLs, dates, priorities)
- Test scenarios and key points
- Risk assessments
- Reference data
- Test Scope from GitHub (`COMP` / `XFUNC`)
- E2E Scenarios to Add rows

### Step 2: Consolidate Information for Main QA Plan

**Merge strategy for main plan**:

| Section | Consolidation Approach |
|---------|------------------------|
| **Summary** | Combine all sources into one table |
| **Background** | Use Atlassian as primary; number subsections |
| **QA Goals** | Merge all goals, deduplicate; numbered sub-categories (1. E2E, 2. FUN, … 10. AUTO) |
| **Test Key Points** | ❌ **EXCLUDED** — moved to XMind file |
| **Risk & Mitigation** | Merge risk tables; numbered sub-sections (1. Technical, 2. Data, 3. UX) |
| **Consolidated Reference Data** | Aggregate sources, stakeholders, test data, dependencies |
| **Sign-off Checklist** | Checklists per team; numbered subsections |
| **QA Summary** | Code Changes table (PR, Files Changed, PR Summary) |

### Step 3: Generate Test Key Points for XMind (NEW)

**Priority Assignment Algorithm**:

```
1. Load GitHub traceability file:
   context/qa_plan_github_traceability_<feature-id>.md

2. Extract code change mapping:
   {
     "Scenario ID": ["file1.ts", "file2.java"],
     ...
   }

3. For each test scenario from domain summaries:
   
   a) Check if scenario maps to code change:
      IF match found in traceability file:
        → priority = P1
      
   b) ELSE check if XFUNC or integration:
      IF test_scope == "XFUNC" OR scenario tests multiple components:
        → priority = P2
      
   c) ELSE check if edge case or optional:
      IF scenario NOT in Jira ACs OR marked "nice-to-have":
        → priority = P3
      
   d) ELSE (conservative default):
        → priority = P2

4. Organize scenarios by functional category:
   - Group by user-facing behavior (NOT by repo or source)
   - Rewrite technical, vague, or implementation-led labels into user-observable actions
   - Prefer action titles such as "Continue editing after error", "Return to prompt with previous answers", or "Resume data retrieval after fixing issue"
   - Do NOT keep repo-led or implementation-led headings such as "Cross-Repo Error Propagation", "Request Queue Cleanup", or flag/state names in final manual test cases

5. Determine priority placement level:
   IF all scenarios in category have same priority:
     → Place at category level (## Functional - P1)
   ELSE IF sub-category scenarios have same priority:
     → Place at sub-category level (### Error Recovery - P1)
   ELSE:
     → Place at individual step level (- Test max rows error - P1)
```

**XMind Hierarchical Format**:

The final test-case artifact MUST preserve the template's category skeleton. Every top-level template category must appear, even if not applicable to the feature.
If a category is not applicable, keep the category and add a one-sentence explanation leaf node.

Use `templates/test-case-template.md` as the authoring scaffold, but strip all instructional annotations from the final exported markdown:

```markdown
# BCIN-6709_Improve_Report_Error_Handling

## Functional - P1 ([MAIN CATEGORY WITH PRIORITY])

### Error Recovery Flow - P1 ([SUB-CATEGORY WITH PRIORITY])

- Trigger max rows error [(STEP)]
  - Click "OK" in error dialog
    - Dialog closes
      - Report returns to pause mode [(EXPECTED RESULT)]
      - Undo button is disabled [(EXPECTED RESULT)]
      - User can continue editing [(EXPECTED RESULT)]

### Prompt Error Handling - P2

- Cancel prompt during error [(STEP)] - P2 ([PRIORITY AT STEP LEVEL IF MIXED])
  - Error dialog appears
    - Click "Cancel"
      - Prompt dismissed [(EXPECTED RESULT)]
      - Report remains in pause mode [(EXPECTED RESULT)]

## Integration - P2

### Cross-Repo Error Propagation - P2

- Error in biweb API
  - Propagates to mojo
    - Reaches react-report-editor
      - Error dialog shown [(EXPECTED RESULT)]
      - User stays in report view [(EXPECTED RESULT)]

## Edge Cases - P3

### Concurrent Error Handling - P3

- Trigger two errors simultaneously
  - Second error queued
    - First dialog shown
      - After dismiss, second dialog appears [(EXPECTED RESULT)]

## AUTO: Automation-Only Tests

### Unit Tests - P1

- `recreate-error-catcher.tsx` error recovery logic
  - Verify `recoverReportFromError` returns correct payload
  - Verify `isReCreateReportInstance` flag lifecycle
```

**Key Transformation Rules**:

1. **Category headers**: Final output uses clean headers such as `## Functional - P1`
2. **Sub-category headers**: Final output uses clean user-observable headers such as `### Continue editing after a report error - P1`
3. **Steps**: Bullet hierarchy with increasing indentation
4. **Expected results**: Write as clean plain-bullet leaf nodes without template annotations in the final exported markdown
5. **Priority markers**: MANDATORY at category, sub-category, OR step level
6. **User-facing language**: NO internal function/class/flag names in steps, headings, or expected results
7. **AUTO section**: For COMP tests that are not user-observable
8. **Annotation removal**: Strip placeholders such as `[(STEP)]`, `[(EXPECTED RESULT)]`, `([MAIN CATEGORY WITH PRIORITY])`, and similar template notes before saving final markdown

### Step 4: Translation + Actionability Pass (Mandatory)

Before writing any test scenario, translate code vocabulary:

| Code Pattern | User-Facing Translation |
|--------------|-------------------------|
| `cmdMgr.reset()` called | Undo button is disabled |
| `isReCreateReportInstance = true` | Recovery completes without stuck state |
| `mstrApp.appState = DEFAULT` | Grid shows pause-mode layout |
| `PUT /model/reports` error | Error shown, grid remains usable |
| `stid=-1` + `noActionMode=true` | Report returns to pause mode |

Extend this guide as needed during synthesis.

For any vague or technical item, ask: "What exact user action triggers this behavior, and what visible result should QA verify?"
If the answer is not clear from Jira or existing context, search the linked Confluence/design materials and rewrite the item into a concrete user action plus observable outcome.

### Step 5: User Executability + Final-Markdown Readiness Check (Mandatory)

Before saving, run this checklist on manual test scenarios:

- [ ] Every required template category is present
- [ ] Non-applicable categories remain present with a one-sentence explanation leaf
- [ ] No internal code vocabulary in headings, steps, or expected results
- [ ] Technical or vague headings have been rewritten into user-observable actions
- [ ] Scenario triggers are concrete and executable, not phrases like "supported report error"
- [ ] Expected results are browser-observable (UI or Network tab)
- [ ] P0/P1 scenarios include executable user steps or equivalent action flow
- [ ] Workstation / i18n / xfunc coverage is included when feature context requires it
- [ ] Multi-path scenarios are separated cleanly
- [ ] Unit/API-only tests moved to AUTO section
- [ ] Final exported markdown contains no instructional template annotations

If violations found:
1. Auto-fix (translate, split rows, add "FAILS if:")
2. Re-run checklist (max 2 iterations)
3. If still failing, emit soft warning for review gate
4. Do not mark outputs final in this step; they remain drafts until `qa-plan-review` passes and `qa-plan-refactor` resolves findings

### Step 6: Generate Dual Outputs

**Output 1: QA Plan Draft** (`drafts/qa_plan_v<N+1>.md`)

```markdown
# Comprehensive QA Plan: [Feature Name]

## 📊 Summary
[Combined metadata table]

Use the section order and structure from `templates/qa-plan-template.md` for the draft, so review/refactor starts from the correct canonical layout.

## 📝 Background
[Problem, Solution, Business Context from Atlassian]

## 🎯 QA Goals
[Numbered categories: 1. E2E, 2. FUN, ..., 10. AUTO]

## ⚠️ Risk & Mitigation
[Numbered sections: 1. Technical, 2. Data, 3. UX]

## 📎 Consolidated Reference Data
[Sources, Stakeholders, Intermediate Artifacts Used, Test Data, Dependencies]

### Intermediate Artifacts Used
[List every material intermediate artifact as a workspace-relative file path so Snow can double-check the evidence directly. Include raw Jira issue files, raw GitHub diff/PR files, context summaries, traceability files, background research, and any review artifacts used during refactor.]

## 🎯 Sign-off Checklist
[Numbered per team]

## 📊 QA Summary
[Code Changes table]
```

**Output 2: Test-Case Draft** (`drafts/test_key_points_xmind_v<N+1>.md`)

```markdown
# BCIN-6709_Improve_Report_Error_Handling

## Functional - P1
[Hierarchical bullets with priorities and expected results]

## Integration - P2
[Hierarchical bullets]

## Edge Cases - P3
[Hierarchical bullets]

## AUTO: Automation-Only Tests
[Unit/API tests]
```

### Step 7: Priority Validation

Before finalizing, validate priority distribution:

**Expected distribution**:
- P1: 40-60% (code changes)
- P2: 30-40% (integration + ACs)
- P3: 10-20% (edge cases)

**Red flags**:
- ⚠️ All P1 → Missing integration tests
- ⚠️ All P2/P3 → Missing code traceability
- ⚠️ No P1 but PRs exist → Traceability mapping failed

If red flag detected, emit warning but continue (review gate will catch).

## Output File Handling

**Locations**:
```
projects/feature-plan/<feature_id>/drafts/qa_plan_v<N+1>.md
projects/feature-plan/<feature_id>/test_key_points_xmind.md
```

**Versioning**:
- Determine N from `task.json.latest_draft_version` or scan `drafts/` folder
- Write to `qa_plan_v<N+1>.md`
- Update `task.json.latest_draft_version = N+1`
- XMind file is not versioned (overwrite on each synthesis)

## Integration with Other Skills

**Input from**:
- `qa-plan-figma`: UI/UX testing requirements
- `qa-plan-github`: Code changes + traceability
- `qa-plan-atlassian`: Requirements + acceptance criteria

**Output consumed by**:
- `qa-plan-review`: Reviews both outputs for completeness
- `qa-plan-refactor`: Updates based on review feedback
- `qa-plan-confluence-review`: Validates published plan

## Priority Assignment Rules (Embedded)

Full rules documented in `docs/priority-assignment-rules.md`, summarized here:

### P1: Direct Code Change
- **Evidence**: Function/API/component modified in PR diff
- **Source**: GitHub traceability file
- **Rule**: If code changed, test is P1

### P2: Affected Area or XFUNC
- **Evidence**: Jira ACs, integration test, no direct code change
- **Source**: Test Scope = XFUNC, design doc scope
- **Rule**: If XFUNC or affected area, test is P2

### P3: Nice to Have
- **Evidence**: Not in ACs, edge case, future work
- **Source**: Design doc "Out of Scope"
- **Rule**: Can skip if timeline limited → P3

## Error Handling

**If GitHub traceability file missing**:
- P1 assignment falls back to conservative P2
- Emit warning: "P1 assignment degraded — no traceability file"

**If no domain summaries found**:
- Cannot synthesize — return error

**If XMind format validation fails**:
- Log validation errors
- Attempt auto-fix (add missing priorities, adjust indentation)
- If still invalid after 2 fix rounds, emit error for manual intervention

## Best Practices

### User-Facing Language

**Always translate**:
```
❌ "Verify isReCreateReportInstance flag set to true"
✅ "Report recovery completes without stuck state"

❌ "Check cmdMgr.reset() called"
✅ "Undo button is disabled in Edit menu"
```

### Priority Placement Optimization

**Good**:
```markdown
## Functional - P1
  ### All sub-categories are P1
```

**Also Good (mixed priorities)**:
```markdown
## Functional
  ### Error Recovery - P1
  ### Prompt Handling - P2
  ### Edge Cases - P3
```

**Avoid (inconsistent)**:
```markdown
## Functional - P1
  ### Sub-Category - P2  ← Contradicts parent
```

## Example Usage

**Input**:
```javascript
{
  feature_id: "BCIN-6709",
  context_files: [
    "context/qa_plan_atlassian_BCIN-6709.md",
    "context/qa_plan_github_BCIN-6709.md",
    "context/qa_plan_github_traceability_BCIN-6709.md"
  ],
  output_mode: "dual",
  outputs: {
    main_plan: "drafts/qa_plan_v1.md",
    xmind_tests: "test_key_points_xmind.md"
  }
}
```

**Output**:
- `drafts/qa_plan_v1.md` — Full plan without test key points
- `test_key_points_xmind.md` — XMind-compatible with priorities

**Priority Distribution** (BCIN-6709 example):
- P1: 6 scenarios (error recovery, undo reset) → 43%
- P2: 5 scenarios (cross-repo integration, UI) → 36%
- P3: 3 scenarios (edge cases) → 21%
- ✅ Distribution looks healthy

## Notes

- XMind format MUST match `templates/test-case-template.md` for import compatibility
- Priority assignment is **mandatory** — synthesis fails if priorities cannot be determined
- Traceability file is **critical** for accurate P1 assignment
- User-facing language is **non-negotiable** — no code vocabulary in manual tests
- AUTO section is for tests that cannot be manually observed in browser

---

**Last Updated**: 2026-03-07  
**Status**: Active — Enhanced with dual-output and smart priority assignment
