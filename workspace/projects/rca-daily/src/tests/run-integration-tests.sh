#!/bin/bash
# Run all RCA integration tests

set -e

TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTEGRATION_DIR="${TESTS_DIR}/integration"
PASS=0
FAIL=0

echo "========================================="
echo "RCA Integration Tests"
echo "========================================="
echo ""

for test_script in "${INTEGRATION_DIR}"/*-integration.test.sh; do
  if [ -f "$test_script" ]; then
    name=$(basename "$test_script" .sh)
    echo "--- $name ---"
    if bash "$test_script"; then
      ((PASS++)) || true
    else
      ((FAIL++)) || true
    fi
    echo ""
  fi
done

echo "========================================="
echo "Integration Results: $PASS passed, $FAIL failed"
echo "========================================="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
