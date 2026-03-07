#!/usr/bin/env bash
# Test suite for jira-description-merge.sh
# Unit tests - no external Jira API calls

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SKILL_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
LIB_DIR="$SKILL_DIR/scripts/lib"

# Load merge functions (inline to avoid jira-rest dependency)
merge_adf_documents() {
  local existing_json="$1"
  local new_json="$2"
  
  local existing_content new_content
  existing_content=$(echo "$existing_json" | jq -c '.content // []')
  new_content=$(echo "$new_json" | jq -c '.content // []')
  
  local merged_content
  merged_content=$(jq -n \
    --argjson existing "$existing_content" \
    --argjson new "$new_content" \
    '$existing + $new')
  
  local version type
  version=$(echo "$new_json" | jq -r '.version // 1')
  type=$(echo "$new_json" | jq -r '.type // "doc"')
  
  jq -n \
    --argjson content "$merged_content" \
    --argjson version "$version" \
    --arg type "$type" \
    '{version: $version, type: $type, content: $content}'
}

validate_adf_structure() {
  local adf_json="$1"
  
  echo "$adf_json" | jq empty 2>/dev/null || return 1
  
  local version type content
  version=$(echo "$adf_json" | jq -r '.version // empty')
  type=$(echo "$adf_json" | jq -r '.type // empty')
  content=$(echo "$adf_json" | jq -r '.content // empty')
  
  [[ -n "$version" ]] || return 1
  [[ -n "$type" ]] || return 1
  [[ -n "$content" ]] || return 1
  
  return 0
}

TEST_PASSED=0
TEST_FAILED=0

# Test fixtures
EXISTING_ADF_SIMPLE='{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Existing paragraph 1"}]},{"type":"paragraph","content":[{"type":"text","text":"Existing paragraph 2"}]}]}'

NEW_ADF_SIMPLE='{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"New paragraph 1"}]},{"type":"paragraph","content":[{"type":"text","text":"New paragraph 2"}]}]}'

EXISTING_ADF_WITH_MEDIA='{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Text before image"}]},{"type":"mediaGroup","content":[{"type":"media","attrs":{"id":"abc123","type":"file","collection":"contentId-123"}}]},{"type":"paragraph","content":[{"type":"text","text":"Text after image"}]}]}'

NEW_ADF_WITH_MEDIA='{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"New text"}]},{"type":"mediaGroup","content":[{"type":"media","attrs":{"id":"xyz789","type":"file","collection":"contentId-789"}}]}]}'

EMPTY_ADF='{"version":1,"type":"doc","content":[]}'

# Test helper functions
assert_equals() {
  local expected="$1"
  local actual="$2"
  local test_name="$3"
  
  if [[ "$expected" == "$actual" ]]; then
    echo "✓ PASS: $test_name"
    ((TEST_PASSED++)) || true
  else
    echo "✗ FAIL: $test_name"
    echo "  Expected: $expected"
    echo "  Actual:   $actual"
    ((TEST_FAILED++)) || true
  fi
}

assert_contains() {
  local haystack="$1"
  local needle="$2"
  local test_name="$3"
  
  if echo "$haystack" | grep -q "$needle"; then
    echo "✓ PASS: $test_name"
    ((TEST_PASSED++)) || true
  else
    echo "✗ FAIL: $test_name"
    echo "  Expected to contain: $needle"
    ((TEST_FAILED++)) || true
  fi
}

assert_json_valid() {
  local json="$1"
  local test_name="$2"
  
  if echo "$json" | jq empty 2>/dev/null; then
    echo "✓ PASS: $test_name"
    ((TEST_PASSED++)) || true
  else
    echo "✗ FAIL: $test_name"
    ((TEST_FAILED++)) || true
  fi
}

# Unit Tests

test_merge_two_paragraph_sets() {
  local result
  result=$(merge_adf_documents "$EXISTING_ADF_SIMPLE" "$NEW_ADF_SIMPLE")
  
  assert_contains "$result" "Existing paragraph 1" "merge_adf: contains existing paragraph 1"
  assert_contains "$result" "Existing paragraph 2" "merge_adf: contains existing paragraph 2"
  assert_contains "$result" "New paragraph 1" "merge_adf: contains new paragraph 1"
  assert_contains "$result" "New paragraph 2" "merge_adf: contains new paragraph 2"
  assert_json_valid "$result" "merge_adf: output is valid JSON"
  
  local content_length
  content_length=$(echo "$result" | jq '.content | length')
  assert_equals "4" "$content_length" "merge_adf: has 4 content items"
}

test_merge_preserves_existing_media() {
  local result
  result=$(merge_adf_documents "$EXISTING_ADF_WITH_MEDIA" "$NEW_ADF_SIMPLE")
  
  assert_contains "$result" "abc123" "merge_adf: preserves existing media id"
  assert_contains "$result" "mediaGroup" "merge_adf: preserves mediaGroup type"
  assert_contains "$result" "New paragraph 1" "merge_adf: appends new paragraph"
}

test_merge_appends_new_media() {
  local result
  result=$(merge_adf_documents "$EXISTING_ADF_WITH_MEDIA" "$NEW_ADF_WITH_MEDIA")
  
  assert_contains "$result" "abc123" "merge_adf: keeps existing media"
  assert_contains "$result" "xyz789" "merge_adf: appends new media"
}

test_merge_handles_empty_existing() {
  local result
  result=$(merge_adf_documents "$EMPTY_ADF" "$NEW_ADF_SIMPLE")
  
  assert_contains "$result" "New paragraph 1" "merge_adf: handles empty existing"
  
  local content_length
  content_length=$(echo "$result" | jq '.content | length')
  assert_equals "2" "$content_length" "merge_adf: empty existing = new content only"
}

test_merge_handles_empty_new() {
  local result
  result=$(merge_adf_documents "$EXISTING_ADF_SIMPLE" "$EMPTY_ADF")
  
  assert_contains "$result" "Existing paragraph 1" "merge_adf: handles empty new"
  
  local content_length
  content_length=$(echo "$result" | jq '.content | length')
  assert_equals "2" "$content_length" "merge_adf: empty new = existing only"
}

test_validate_adf_structure() {
  if validate_adf_structure "$EXISTING_ADF_SIMPLE"; then
    echo "✓ PASS: validate_adf: accepts valid structure"
    ((TEST_PASSED++)) || true
  else
    echo "✗ FAIL: validate_adf: rejected valid structure"
    ((TEST_FAILED++)) || true
  fi
  
  if validate_adf_structure "not json"; then
    echo "✗ FAIL: validate_adf: accepted invalid JSON"
    ((TEST_FAILED++)) || true
  else
    echo "✓ PASS: validate_adf: rejects invalid JSON"
    ((TEST_PASSED++)) || true
  fi
  
  local invalid_adf='{"type":"doc"}'
  if validate_adf_structure "$invalid_adf"; then
    echo "✗ FAIL: validate_adf: accepted missing version"
    ((TEST_FAILED++)) || true
  else
    echo "✓ PASS: validate_adf: rejects missing version"
    ((TEST_PASSED++)) || true
  fi
}

# Run all tests
echo "=== Running Unit Tests for jira-description-merge.sh ==="
echo ""

test_merge_two_paragraph_sets
test_merge_preserves_existing_media
test_merge_appends_new_media
test_merge_handles_empty_existing
test_merge_handles_empty_new
test_validate_adf_structure

echo ""
echo "=== Test Summary ==="
echo "Passed: $TEST_PASSED"
echo "Failed: $TEST_FAILED"

if [[ $TEST_FAILED -gt 0 ]]; then
  echo ""
  echo "❌ Tests FAILED"
  exit 1
fi

echo ""
echo "✅ All tests PASSED"
exit 0
