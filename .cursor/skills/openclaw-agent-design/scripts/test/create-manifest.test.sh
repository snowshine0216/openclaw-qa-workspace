#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running create-manifest tests..."

test_out="/tmp/test-out-$$"
mkdir -p "$test_out"

# Setup: real fixture files (no mocks)
echo '{"issue_key":"BCIN-001","rca_output_path":"/tmp/out/001.md"}' > "$test_out/test-input-BCIN-001.json"

bash "$script_dir/../create-manifest.sh" "$test_out" "20260305-000000"

manifest_file=$(ls "$test_out"/manifest-*.json)
total=$(jq '.total_issues' "$manifest_file")
if [[ "$total" != "1" ]]; then
  echo "FAIL: create-manifest failed to compute total_issues = 1. Got: $total"
  rm -rf "$test_out"
  exit 1
fi

rm -rf "$test_out"
echo "PASS"
