# Fix Plan: Jira Description Append (Not Overwrite)

**Date:** 2026-03-07  
**Owner:** Atlas  
**Test Issue:** https://strategyagile.atlassian.net/browse/BCIN-5379  
**Test Content:** `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/projects/feature-plan/BCIN-6709-test/qa_plan_final.md`

---

## Problem Statement

Currently, when updating a Jira issue description using `jira-publish-playground.sh`, the script **overwrites** the existing description completely. This results in data loss when users want to **append** new content (both text paragraphs and media) to an existing description.

### Current Behavior
```bash
# This overwrites the entire description
bash jira-publish-playground.sh --issue ABC-1 --description-file new-content.json --update-description --post
```

### Required Behavior
- **DEFAULT:** Pre-load existing description and merge with new content
- Merge existing ADF content with new ADF content
- Preserve both text and media nodes
- Support both paragraph append and media append scenarios
- **EXPLICIT FLAG:** Add `--overwrite` flag for destructive replace

---

## Behavior Matrix

| Behavior ID | Description | Test Type | Priority |
|-------------|-------------|-----------|----------|
| B1 | Fetch existing description from Jira issue | Integration | P0 |
| B2 | Parse existing ADF document structure | Unit | P0 |
| B3 | Merge new paragraphs after existing paragraphs | Unit | P0 |
| B4 | Preserve existing media nodes when appending | Unit | P0 |
| B5 | Append new media nodes after existing media | Unit | P1 |
| B6 | Handle empty existing description gracefully | Unit | P1 |
| B7 | Preserve ADF structure integrity after merge | Integration | P0 |
| B8 | Preview merged result before posting | Integration | P1 |
| B9 | Post merged description successfully | Integration | P0 |
| B10 | Maintain backward compatibility (overwrite mode) | Integration | P2 |

---

## Technical Design

### Architecture
```
User Command
    ↓
jira-publish-playground.sh (orchestrator)
    ↓
[New] scripts/lib/jira-description-merge.sh
    ├── fetch_existing_description()
    ├── merge_adf_documents()
    └── validate_adf_structure()
    ↓
jira-rest.sh (API wrapper)
    ↓
Jira REST API
```

### Implementation Components

#### 1. New Script: `scripts/lib/jira-description-merge.sh`
Functions:
- `fetch_existing_description(issue_key)` → returns existing ADF JSON
- `merge_adf_documents(existing_json, new_json)` → returns merged ADF
- `validate_adf_structure(adf_json)` → returns true/false

#### 2. Modified Script: `scripts/jira-publish-playground.sh`
Changes:
- **DEFAULT BEHAVIOR:** Always merge (fetch + merge + post)
- Add `--overwrite` flag to skip merge and replace entirely
- Keep `--update-description` as action flag (what to do)
- `--overwrite` modifies how `--update-description` behaves

#### 3. Test Coverage
- Unit tests for ADF merge logic
- Integration tests with mock Jira responses
- Real-world test against BCIN-5379

---

## Quality Gates (Code Quality Orchestrator)

- [ ] **TDD Order:** Red → Green → Refactor (failing tests first)
- [ ] **Unit Coverage:** All new functions have unit tests
- [ ] **Integration Coverage:** End-to-end append flow tested
- [ ] **Bare-Minimum Mocks:** Use real ADF fixtures, minimal mocking
- [ ] **DRY Compliance:** No duplicated ADF manipulation logic
- [ ] **Directory Structure:** `scripts/lib/` for reusable logic, `tests/` for tests
- [ ] **Function Length:** <= 20 lines (or logged exception)
- [ ] **Review Gate:** Requesting-code-review before refactor
- [ ] **Final Regression:** All tests pass after refactor

---

## Implementation Phases

### Phase 0: Scope & Test Planning ✅
- [x] Read code-quality-orchestrator skill
- [x] Identify current implementation
- [x] Create behavior matrix
- [x] Define test scenarios

### Phase 1: TDD Write Loop (Red → Green)
1. Write failing tests for `fetch_existing_description()`
2. Implement minimal code to fetch from Jira API
3. Write failing tests for `merge_adf_documents()`
4. Implement ADF merge logic
5. Write failing tests for end-to-end append flow
6. Wire up orchestrator script changes

### Phase 2: Review Gate
1. Run `requesting-code-review` skill
2. Document findings
3. Run `receiving-code-review` skill
4. Fix blocking issues

### Phase 3: Refactor Gate
1. Run `code-structure-quality` skill
2. Ensure DRY and functional boundaries
3. Verify function length policy
4. Re-run all tests
5. Final regression validation

### Phase 4: Manual Testing
1. Test against BCIN-5379 with qa_plan_final.md
2. Verify both paragraph and media append scenarios
3. Confirm backward compatibility (overwrite still works)

---

## Progress Tracker

| Phase | Status | Start Time | End Time | Notes |
|-------|--------|------------|----------|-------|
| Phase 0 | ✅ Done | 16:37 | 16:45 | Plan created |
| Phase 1 | 🔄 In Progress | 16:45 | - | TDD loop starting |
| Phase 2 | ⏳ Pending | - | - | Review gate |
| Phase 3 | ⏳ Pending | - | - | Refactor gate |
| Phase 4 | ⏳ Pending | - | - | Manual testing |

---

## Test Scenarios

### Scenario 1: Append Paragraphs Only
**Given:** BCIN-5379 has existing description with 3 paragraphs  
**When:** Append qa_plan_final.md content  
**Then:** Existing 3 paragraphs remain, new content appended after

### Scenario 2: Append Media Nodes
**Given:** BCIN-5379 has existing images in description  
**When:** Append new content with images  
**Then:** Existing images preserved, new images appended

### Scenario 3: Empty Description
**Given:** Issue has no description  
**When:** Append content  
**Then:** Acts like initial create (no error)

### Scenario 4: Explicit Overwrite
**Given:** Use `--update-description --overwrite` flags  
**When:** Run script  
**Then:** Replaces description completely (no merge)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| ADF structure corruption | Validate ADF schema before posting |
| Existing description fetch fails | Graceful fallback to overwrite mode |
| Merge logic drops media nodes | Unit tests with real media node fixtures |
| Breaking existing workflows | Keep `--update-description` unchanged, add new `--append-description` |

---

## Success Criteria

1. ✅ All unit tests pass (coverage >= 80%)
2. ✅ All integration tests pass
3. ✅ Manual test against BCIN-5379 succeeds
4. ✅ Existing overwrite mode still works
5. ✅ Code review findings addressed
6. ✅ Quality gates checklist complete

---

## Deliverables

1. `scripts/lib/jira-description-merge.sh` (new)
2. Updated `scripts/jira-publish-playground.sh`
3. Test files in `tests/`
4. Updated SKILL.md documentation
5. This PLAN.md with progress tracking

---

**Next Action:** Start Phase 1 - TDD Write Loop
