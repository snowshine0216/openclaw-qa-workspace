#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../../lib/feishu.sh"

echo "Running feishu tests..."

tmp_run="/tmp/run_json_test_$$.json"
echo '{}' > "$tmp_run"

feishu_persist_fallback "$tmp_run" "test payload"
pending_b64=$(jq -r '.notification_pending' "$tmp_run")
pending=$(echo "$pending_b64" | base64 --decode)

if [[ "$pending" != "test payload" ]]; then
  echo "FAIL: feishu_persist_fallback did not persist correct payload. Got: $pending"
  rm -f "$tmp_run"
  exit 1
fi

rm -f "$tmp_run"
echo "PASS"
