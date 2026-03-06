#!/bin/bash
# Integration test for run-complete-rca-workflow.sh manifest creation
# Mocks process-rca.sh to create fixture rca-input files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${PROJECT_ROOT}/output"
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIXTURES_DIR="${TESTS_DIR}/../fixtures"
PROCESS_RCA_ORIG="${SCRIPT_DIR}/core/process-rca.sh"
PROCESS_RCA_BACKUP="${SCRIPT_DIR}/core/process-rca.sh.bak"
PASS=0
FAIL=0

cleanup() {
  if [ -f "${PROCESS_RCA_BACKUP}" ]; then
    mv "${PROCESS_RCA_BACKUP}" "${PROCESS_RCA_ORIG}"
  fi
  rm -f "${OUTPUT_DIR}"/rca-input-*.json "${OUTPUT_DIR}"/rca-manifest-*.json "${OUTPUT_DIR}"/.rca-trigger-* 2>/dev/null || true
}
trap cleanup EXIT

# Stub process-rca.sh: create rca-input from fixture
cp "${PROCESS_RCA_ORIG}" "${PROCESS_RCA_BACKUP}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RCA_INPUT="${OUTPUT_DIR}/rca-input-BCIN-1234-${TIMESTAMP}.json"
RCA_OUTPUT="${OUTPUT_DIR}/rca/BCIN-1234-rca.md"
mkdir -p "${OUTPUT_DIR}/rca"

cat > "${SCRIPT_DIR}/core/process-rca.sh" << STUB
#!/bin/bash
# Test stub: create rca-input from fixture
jq --arg out "${RCA_OUTPUT}" '.rca_output_path = \$out' \
  "${FIXTURES_DIR}/rca-input-BCIN-1234.json" > "${RCA_INPUT}"
exit 0
STUB
chmod +x "${SCRIPT_DIR}/core/process-rca.sh"

# Mock openclaw to avoid real Feishu send
MOCK_BIN="${TESTS_DIR}/.mock_bin_run_complete"
mkdir -p "${MOCK_BIN}"
cat > "${MOCK_BIN}/openclaw" << 'MOCKOPENCLAW'
#!/bin/bash
exit 0
MOCKOPENCLAW
chmod +x "${MOCK_BIN}/openclaw"

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

echo "Running run-complete-workflow-integration tests..."

export PATH="${MOCK_BIN}:${PATH}"

OUTPUT=$(cd "${SCRIPT_DIR}" && bash bin/run-complete-rca-workflow.sh 2>&1)
EXIT=$?

assert_exit "$EXIT" "0" "run-complete-rca-workflow exits 0"
assert_contains "$OUTPUT" "Manifest created" "manifest created"
assert_contains "$OUTPUT" "Trigger file created" "trigger file created"

# Verify manifest exists and has correct structure
MANIFEST=$(ls -t "${OUTPUT_DIR}"/rca-manifest-*.json 2>/dev/null | head -1)
if [ -n "$MANIFEST" ] && [ -f "$MANIFEST" ]; then
  echo "  PASS: manifest file exists"
  ((PASS++)) || true
  TOTAL=$(jq -r '.total_issues' "$MANIFEST")
  if [ "$TOTAL" = "1" ]; then
    echo "  PASS: manifest has total_issues=1"
    ((PASS++)) || true
  else
    echo "  FAIL: manifest total_issues=$TOTAL, expected 1"
    ((FAIL++)) || true
  fi
  RCA_INPUTS_LEN=$(jq '.rca_inputs | length' "$MANIFEST")
  if [ "$RCA_INPUTS_LEN" = "1" ]; then
    echo "  PASS: manifest has 1 rca_inputs entry"
    ((PASS++)) || true
  else
    echo "  FAIL: manifest rca_inputs length=$RCA_INPUTS_LEN"
    ((FAIL++)) || true
  fi
else
  echo "  FAIL: manifest file not found"
  ((FAIL++)) || true
fi

rm -rf "${MOCK_BIN}"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
