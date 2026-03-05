#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../../lib/manifest.sh"

echo "Running manifest tests..."

result=$(manifest_create "20260305-120000" "3")
total=$(echo "$result" | jq '.total_issues')
if [[ "$total" != "3" ]]; then
  echo "FAIL: manifest_create did not output correct total_issues. Got: $total"
  exit 1
fi

# Test manifest_validate
manifest_tmp="/tmp/manifest_test_$$.json"
echo '{"rca_inputs":[]}' > "$manifest_tmp"
if manifest_validate "$manifest_tmp"; then
  echo "FAIL: manifest_validate should have failed on missing required fields"
  rm -f "$manifest_tmp"
  exit 1
fi

echo "$result" > "$manifest_tmp"
if ! manifest_validate "$manifest_tmp"; then
  echo "FAIL: manifest_validate should have passed on valid JSON"
  rm -f "$manifest_tmp"
  exit 1
fi

rm -f "$manifest_tmp"
echo "PASS"
