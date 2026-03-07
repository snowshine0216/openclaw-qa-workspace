# Manual Test Report: Jira Description Append Fix

**Date:** 2026-03-07  
**Test Engineer:** Atlas  
**Test Issue:** BCIN-5379  
**Status:** Ready for Testing

---

## Phase 1: Unit Tests ✅ PASSED

All 18 unit tests passed successfully:

```bash
$ bash ~/.agents/skills/jira-cli/tests/test-jira-description-merge.sh

=== Running Unit Tests for jira-description-merge.sh ===

✓ PASS: merge_adf: contains existing paragraph 1
✓ PASS: merge_adf: contains existing paragraph 2
✓ PASS: merge_adf: contains new paragraph 1
✓ PASS: merge_adf: contains new paragraph 2
✓ PASS: merge_adf: output is valid JSON
✓ PASS: merge_adf: has 4 content items
✓ PASS: merge_adf: preserves existing media id
✓ PASS: merge_adf: preserves mediaGroup type
✓ PASS: merge_adf: appends new paragraph
✓ PASS: merge_adf: keeps existing media
✓ PASS: merge_adf: appends new media
✓ PASS: merge_adf: handles empty existing
✓ PASS: merge_adf: empty existing = new content only
✓ PASS: merge_adf: handles empty new
✓ PASS: merge_adf: empty new = existing only
✓ PASS: validate_adf: accepts valid structure
✓ PASS: validate_adf: rejects invalid JSON
✓ PASS: validate_adf: rejects missing version

=== Test Summary ===
Passed: 18
Failed: 0

✅ All tests PASSED
```

---

## Phase 2: Manual Test Plan for BCIN-5379

### Test Scenario 1: Merge Mode (Default Behavior)

**Objective:** Verify that new content is APPENDED to existing description

**Pre-conditions:**
- BCIN-5379 has existing description content
- QA plan content converted to ADF: `/tmp/qa-plan.json`

**Steps:**
```bash
# 1. Convert QA plan to ADF
bash ~/.agents/skills/jira-cli/scripts/build-adf.sh \
  /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/projects/feature-plan/BCIN-6709-test/qa_plan_final.md \
  /tmp/qa-plan.json

# 2. Preview merge (no --post)
bash ~/.agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5379 \
  --description-file /tmp/qa-plan.json \
  --update-description

# 3. Verify preview shows:
#    - "[Mode: MERGE - will append to existing description]"
#    - Existing content preserved
#    - New content appended

# 4. Post merged description
bash ~/.agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5379 \
  --description-file /tmp/qa-plan.json \
  --update-description \
  --post
```

**Expected Result:**
- ✅ Existing description content is preserved
- ✅ QA plan content is appended after existing content
- ✅ Both text paragraphs and media nodes are preserved
- ✅ No data loss

---

### Test Scenario 2: Overwrite Mode (Explicit Flag)

**Objective:** Verify that --overwrite flag replaces description entirely

**Steps:**
```bash
# 1. Create simple test content
cat > /tmp/overwrite-test.json << 'EOF'
{
  "version": 1,
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "THIS IS OVERWRITE TEST - all previous content should be gone"
        }
      ]
    }
  ]
}
EOF

# 2. Preview overwrite (no --post)
bash ~/.agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5379 \
  --description-file /tmp/overwrite-test.json \
  --update-description \
  --overwrite

# 3. Verify preview shows:
#    - "[Mode: OVERWRITE - will replace existing description]"
#    - Only new content, no merge

# 4. Post overwrite (DESTRUCTIVE - use sandbox issue!)
bash ~/.agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5379 \
  --description-file /tmp/overwrite-test.json \
  --update-description \
  --overwrite \
  --post
```

**Expected Result:**
- ✅ Previous description is completely replaced
- ✅ Only new content remains
- ✅ "--overwrite" flag is explicitly required for this behavior

---

### Test Scenario 3: Empty Existing Description

**Objective:** Verify graceful handling when issue has no description

**Steps:**
```bash
# Use an issue with no description or create a test issue
bash ~/.agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue <EMPTY-ISSUE> \
  --description-file /tmp/qa-plan.json \
  --update-description \
  --post
```

**Expected Result:**
- ✅ No error when fetching empty description
- ✅ New content is posted successfully
- ✅ Behaves like initial create (no merge needed)

---

### Test Scenario 4: Invalid ADF Fallback

**Objective:** Verify fallback to overwrite when existing description is corrupt

**Steps:**
```bash
# Script should detect invalid ADF and log warning
# Then fall back to overwrite mode automatically
```

**Expected Result:**
- ✅ Warning message: "Existing description has invalid ADF structure, falling back to overwrite"
- ✅ New content posted successfully
- ✅ No script crash

---

## Test Execution Checklist

- [ ] Run unit tests (confirm 18/18 pass)
- [ ] Test Scenario 1: Merge mode with BCIN-5379
- [ ] Test Scenario 2: Overwrite mode (use sandbox issue!)
- [ ] Test Scenario 3: Empty description handling
- [ ] Test Scenario 4: Invalid ADF fallback
- [ ] Verify SKILL.md and examples.md updated correctly
- [ ] Verify backward compatibility (existing workflows still work)

---

## Files Modified

1. ✅ `scripts/lib/jira-description-merge.sh` (NEW)
   - `fetch_existing_description()`
   - `merge_adf_documents()`
   - `validate_adf_structure()`

2. ✅ `scripts/jira-publish-playground.sh` (MODIFIED)
   - Added `--overwrite` flag
   - Default behavior: merge
   - Explicit overwrite mode

3. ✅ `tests/test-jira-description-merge.sh` (NEW)
   - 18 unit tests covering all merge scenarios

4. ✅ `SKILL.md` (UPDATED)
   - Documented merge-by-default behavior
   - Documented --overwrite flag
   - Updated workflow section

5. ✅ `examples.md` (UPDATED)
   - Added merge mode examples
   - Added overwrite mode examples
   - Clarified destructive vs safe operations

---

## Quality Gates Status

- [x] TDD order followed (red → green → refactor)
- [x] Unit coverage for changed behaviors (18/18 tests pass)
- [x] Integration coverage ready (manual test plan created)
- [x] Bare-minimum mocks used (inline functions in tests)
- [x] DRY ownership satisfied (merge logic in dedicated lib)
- [x] Directory structure: scripts → lib, tests separate ✅
- [x] Function length policy satisfied (all functions < 20 lines)
- [ ] Manual tests executed against BCIN-5379
- [ ] Final regression validation

---

## Next Steps

1. **Execute manual tests against BCIN-5379**
2. **Verify merge preserves existing QA plan content**
3. **Test overwrite mode on sandbox issue**
4. **Report results to Snow**
5. **Proceed to Phase 2 (Review Gate) if tests pass**

---

**Test Status:** ✅ Unit Tests Complete | ⏳ Manual Testing Pending
