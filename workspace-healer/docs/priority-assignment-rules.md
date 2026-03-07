# Priority Assignment Rules for QA Test Cases

**Date**: 2026-03-07  
**Purpose**: Canonical reference for P1/P2/P3 assignment in XMind test cases

---

## Priority Definitions

### P1: Direct Code Change
**Rule**: If code changed in PR, test is P1

**Evidence**:
- Function modified in GitHub PR diff
- API endpoint changed
- Component refactored
- File added/deleted in PR

**Sources**:
- `context/qa_plan_github_traceability_<feature>.md`
- GitHub PR compare links
- Design doc "Implementation" section

**Example (BCIN-6709)**:
```markdown
## Functional - P1

### Error Recovery Flow - P1

- Trigger max rows error
  - Click "OK" in dialog
    - Report returns to pause mode [(EXPECTED RESULT)]
```
*Traced to*: `recreate-error-catcher.tsx` modified in react-report-editor PR

---

### P2: Affected Area or Cross-Functional
**Rule**: No direct code change, but feature touches this area OR XFUNC test needed

**Evidence**:
- Jira acceptance criteria requires testing this flow
- Integration point between components
- Downstream impact from feature
- Cross-repo functionality test
- Related feature area

**Sources**:
- Jira acceptance criteria
- Design doc "Scope" section
- Integration diagrams
- Test Scope = XFUNC in GitHub summary

**Example (BCIN-6709)**:
```markdown
## Integration - P2

### Cross-Repo Error Propagation - P2

- Error in biweb API
  - Propagates to mojo
    - Reaches react-report-editor
      - Error dialog shown [(EXPECTED RESULT)]
```
*Reason*: Tests integration across 3 repos, no single component changed

---

### P3: Nice to Have
**Rule**: Edge case, enhancement, or can skip if timeline limited

**Evidence**:
- Not in Jira acceptance criteria
- Design doc "Future Work" section
- Edge case discovery
- Enhancement request
- Low business impact

**Sources**:
- Design doc "Out of Scope" or "Future" sections
- QA team edge case analysis
- Optional requirements

**Example (BCIN-6709)**:
```markdown
## Edge Cases - P3

### Rapid Sequential Errors - P3

- Trigger max rows error
  - Immediately trigger SQL error
    - Second error queued
      - First dialog shown, then second [(EXPECTED RESULT)]
```
*Reason*: Edge case, not in ACs, can defer if needed

---

## Assignment Algorithm

### Step 1: Load Traceability
```
Read: context/qa_plan_github_traceability_<feature>.md

Extract mapping:
  Scenario ID → [File paths, Functions, Components changed]
```

### Step 2: Match Test Scenarios
```
FOR each test scenario in synthesis:
  
  1. Check GitHub traceability:
     - Does scenario test code in traceability file?
     → YES: Assign P1
     → NO: Continue to step 2
  
  2. Check test scope and integration:
     - Is Test Scope = XFUNC?
     - Does scenario test multiple repos/components?
     - Is scenario in Jira acceptance criteria?
     → YES to any: Assign P2
     → NO: Continue to step 3
  
  3. Check if edge case or optional:
     - Is scenario NOT in Jira ACs?
     - Is scenario marked "future" or "nice-to-have"?
     - Can scenario be skipped if timeline limited?
     → YES: Assign P3
     → NO: Default to P2 (conservative)
```

### Step 3: Determine Placement Level
```
After assigning priorities to all scenarios:

IF all scenarios in category have same priority:
  → Place priority at CATEGORY level
  → Example: ## Functional - P1

ELSE IF all scenarios in sub-category have same priority:
  → Place priority at SUB-CATEGORY level
  → Example: ### Error Recovery - P1

ELSE:
  → Place priority at STEP level
  → Example: - Test max rows error - P1
```

---

## Priority Distribution Guidelines

**Typical distribution** for a feature:
- **P1**: 40-60% (all code changes must be tested)
- **P2**: 30-40% (integration and acceptance criteria)
- **P3**: 10-20% (edge cases and enhancements)

**Red flags**:
- ⚠️ All tests are P1 → Probably missing integration tests (P2)
- ⚠️ All tests are P2/P3 → Probably missing code change traceability (P1)
- ⚠️ No P1 tests but PRs exist → Traceability mapping failed

---

## Validation Checklist

Before finalizing XMind output:
- [ ] Every test scenario has a priority (P1/P2/P3)
- [ ] All P1 scenarios trace to GitHub code changes
- [ ] P2 scenarios have justification (XFUNC or AC-driven)
- [ ] P3 scenarios are truly optional (not blocking)
- [ ] Priority distribution looks reasonable (see guidelines)
- [ ] Priority placement level is optimal (category/sub-category/step)

---

## Examples by Feature Type

### New Feature (Full Implementation)
- **P1**: Core functionality tests (all new code)
- **P2**: Integration with existing features
- **P3**: Advanced edge cases

### Bug Fix
- **P1**: Regression test for the specific bug
- **P2**: Related area smoke tests
- **P3**: Edge case variations

### Refactor (No Behavior Change)
- **P1**: Changed modules (verify no regression)
- **P2**: Integration points (verify no breakage)
- **P3**: Performance improvements (if applicable)

### Enhancement (Incremental)
- **P1**: New functionality added
- **P2**: Impact on existing features
- **P3**: Future extension hooks

---

## BCIN-6709 Example Distribution

| Category | Scenario Count | Priority | Reasoning |
|----------|----------------|----------|-----------|
| Error Recovery | 4 scenarios | P1 | `recreate-error-catcher.tsx` changed |
| Undo/Redo Reset | 2 scenarios | P1 | `undo-redo-util.ts` changed |
| Cross-Repo Flow | 3 scenarios | P2 | Integration test (biweb → mojo → react) |
| Error Dialog UI | 2 scenarios | P2 | AC-driven (design doc) |
| Edge Cases | 3 scenarios | P3 | Not in ACs, nice-to-have |
| **Total** | **14 scenarios** | **P1: 6, P2: 5, P3: 3** | **~43% P1, 36% P2, 21% P3** ✅ |

---

**Last Updated**: 2026-03-07  
**Status**: Active — Use for all QA plan synthesis
