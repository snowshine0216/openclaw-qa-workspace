#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/../../lib/logging.sh"

echo "Running logging tests..."

# Test log_info output
output=$(log_info "test info" 2>&1)
if [[ "$output" != *"[INFO]"*"test info"* ]]; then
  echo "FAIL: log_info output mismatch. Got: $output"
  exit 1
fi

# Test log_error output
output=$(log_error "test error" 2>&1)
if [[ "$output" != *"[ERROR]"*"test error"* ]]; then
  echo "FAIL: log_error output mismatch. Got: $output"
  exit 1
fi

echo "PASS"
