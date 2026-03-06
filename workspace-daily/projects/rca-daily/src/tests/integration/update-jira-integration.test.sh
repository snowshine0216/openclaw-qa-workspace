#!/bin/bash
# Integration test for update-jira-latest-status.sh with minimal mocks

set -e
shopt -s expand_aliases

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIXTURES_DIR="${TESTS_DIR}/../fixtures"
RCA_FILE="${FIXTURES_DIR}/sample-rca.md"
MOCK_BIN="${TESTS_DIR}/.mock_bin_update_jira"
PASS=0
FAIL=0

cleanup() {
  rm -rf "${MOCK_BIN}"
  unalias nvm 2>/dev/null || true
}
trap cleanup EXIT

# Create mock bin directory
mkdir -p "${MOCK_BIN}"

# Mock jira: echo JSON with null customfield_10050
cat > "${MOCK_BIN}/jira" << 'MOCKJIRA'
#!/bin/bash
echo '{"fields":{"customfield_10050":null}}'
exit 0
MOCKJIRA
chmod +x "${MOCK_BIN}/jira"

# Mock curl: succeed silently
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

alias nvm="echo 'mock nvm'"

cat > "${MOCK_BIN}/node" << 'MOCKNODE'
#!/bin/bash
echo '{"version": 1, "type": "doc", "content": []}'
exit 0
MOCKNODE
chmod +x "${MOCK_BIN}/node"

# Create mock Jira config for JIRA_USER
MOCK_HOME="${TESTS_DIR}/.mock_home"
mkdir -p "${MOCK_HOME}/.config/.jira"
echo "login: testuser" > "${MOCK_HOME}/.config/.jira/.config.yml"

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

echo "Running update-jira-integration tests..."

# Run with mocked jira and curl
export PATH="${MOCK_BIN}:${PATH}"
export HOME="${MOCK_HOME}"
export JIRA_API_TOKEN="test_token"

OUTPUT=$(cd "${SCRIPT_DIR}" && bash integrations/update-jira-latest-status.sh BCIN-1234 "${RCA_FILE}" 2>&1)
EXIT=$?

assert_exit "$EXIT" "0" "update-jira-latest-status exits 0"
assert_contains "$OUTPUT" "Updating Latest Status for BCIN-1234" "logs issue key"
assert_contains "$OUTPUT" "Converting markdown to ADF" "logs conversion step"
assert_contains "$OUTPUT" "Latest Status updated for BCIN-1234" "logs success"

# Cleanup mock home
rm -rf "${MOCK_HOME}"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
