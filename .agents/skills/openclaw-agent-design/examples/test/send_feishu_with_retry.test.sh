#!/usr/bin/env bash
# Stub tests for send_feishu_with_retry.template.sh
# Scenarios: success; feishu-failure-sets-pending
set -euo pipefail

test_success() {
  # TODO: mock FEISHU_NOTIFY_SCRIPT to succeed; run send_feishu; assert notification_pending cleared
  echo "stub: test_success"
}

test_feishu_failure_sets_pending() {
  # TODO: mock FEISHU_NOTIFY_SCRIPT to fail; run send_feishu; assert notification_pending set in run.json
  echo "stub: test_feishu_failure_sets_pending"
}

# Run stubs when executed directly
case "${1:-}" in
  success) test_success ;;
  feishu-failure-sets-pending) test_feishu_failure_sets_pending ;;
  *) echo "Usage: $0 success|feishu-failure-sets-pending" ;;
esac
