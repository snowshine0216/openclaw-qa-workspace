#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running post-workflow tests..."

tmp_rca="/tmp/rca-$$"
tmp_out="/tmp/out-$$"
mkdir -p "$tmp_rca" "$tmp_out"

echo "## 1. Incident Summary" > "$tmp_rca/BCIN-001-rca.md"

bash "$script_dir/../post-workflow.sh" --dry-run "$tmp_rca" "$tmp_out" "chat123" "/tmp/run.json" "$script_dir/.."

summary_file=$(ls "$tmp_out"/feishu-summary-*.md)
if ! grep -q "BCIN-001" "$summary_file"; then
  echo "FAIL: post-workflow summary did not contain BCIN-001"
  rm -rf "$tmp_rca" "$tmp_out"
  exit 1
fi

rm -rf "$tmp_rca" "$tmp_out"
echo "PASS"
