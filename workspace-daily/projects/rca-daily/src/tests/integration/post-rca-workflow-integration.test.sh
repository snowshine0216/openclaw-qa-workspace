#!/bin/bash
# Integration test for post-rca-workflow.sh with minimal mocks

set -e
shopt -s expand_aliases

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PROJECT_ROOT}/output"
RCA_DIR="${OUTPUT_DIR}/rca"
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIXTURES_DIR="${TESTS_DIR}/../fixtures"
MOCK_BIN="${TESTS_DIR}/.mock_bin_post_rca"
MOCK_HOME="${TESTS_DIR}/.mock_home"
PASS=0
FAIL=0

cleanup() {
  rm -rf "${MOCK_BIN}" "${MOCK_HOME}"
  unalias nvm 2>/dev/null || true
}
trap cleanup EXIT

# Create mock jira and curl
mkdir -p "${MOCK_BIN}"
cat > "${MOCK_BIN}/jira" << 'MOCKJIRA'
#!/bin/bash
echo '{"fields":{"customfield_10050":null}}'
exit 0
MOCKJIRA
chmod +x "${MOCK_BIN}/jira"

cat > "${MOCK_BIN}/curl" << 'MOCKCURL'
#!/bin/bash
exit 0
MOCKCURL
chmod +x "${MOCK_BIN}/curl"

cat > "${MOCK_BIN}/nvm" << 'MOCKNVM'
#!/bin/bash
exit 0
MOCKNVM
chmod +x "${MOCK_BIN}/nvm"

# the script expects nvm to be a function or alias, so we just alias it here
alias nvm="echo 'mock nvm'"

cat > "${MOCK_BIN}/node" << 'MOCKNODE'
#!/bin/bash
echo '{"version": 1, "type": "doc", "content": []}'
exit 0
MOCKNODE
chmod +x "${MOCK_BIN}/node"

mkdir -p "${MOCK_HOME}/.config/.jira"
echo "login: testuser" > "${MOCK_HOME}/.config/.jira/.config.yml"

# Populate output/rca with test fixtures
mkdir -p "${RCA_DIR}"
rm -f "${RCA_DIR}"/*.md 2>/dev/null || true
cp "${FIXTURES_DIR}/sample-rca.md" "${RCA_DIR}/BCIN-1234-rca.md"
cp "${FIXTURES_DIR}/sample-rca.md" "${RCA_DIR}/BCIN-5678-rca.md"

assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if echo "$haystack" | grep -q "$needle"; then
    echo "  PASS: $label"
    ((PASS++)) || true
  else
    echo "  FAIL: $label (output does not contain '$needle')"
    ((FAIL++)) || true
  fi
}

assert_exit() {
  local actual="$1" expected="$2" label="$3"
  if [ "$actual" = "$expected" ]; then
    echo "  PASS: $label"
    ((PASS++)) || true
  else
    echo "  FAIL: $label (exit $actual, expected $expected)"
    ((FAIL++)) || true
  fi
}

echo "Running post-rca-workflow-integration tests..."

export PATH="${MOCK_BIN}:${PATH}"
export HOME="${MOCK_HOME}"
export JIRA_API_TOKEN="test_token"

OUTPUT=$(cd "${SCRIPT_DIR}" && bash core/post-rca-workflow.sh 2>&1)
EXIT=$?

assert_exit "$EXIT" "0" "post-rca-workflow exits 0"
assert_contains "$OUTPUT" "Post-RCA Workflow" "logs workflow start"
assert_contains "$OUTPUT" "Step 1: Updating Jira" "logs Jira update step"
assert_contains "$OUTPUT" "Updated 2/2" "updates both issues"
assert_contains "$OUTPUT" "Post-RCA Workflow Complete" "logs completion"

# Check summary file was created
SUMMARY_COUNT=$(ls -1 "${OUTPUT_DIR}"/feishu-summary-final-*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$SUMMARY_COUNT" -ge 1 ]; then
  echo "  PASS: summary file created"
  ((PASS++)) || true
  LATEST_SUMMARY=$(ls -t "${OUTPUT_DIR}"/feishu-summary-final-*.md 2>/dev/null | head -1)
  assert_contains "$(cat "${LATEST_SUMMARY}")" "Issues Processed:" "summary has issues count"
  assert_contains "$(cat "${LATEST_SUMMARY}")" "BCIN-1234" "summary includes BCIN-1234"
else
  echo "  FAIL: summary file not created"
  ((FAIL++)) || true
fi

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
