#!/usr/bin/env bash
# Stub tests for emit_feishu_notify_marker.template.sh
# Scenarios: emits-marker-when-chat-id-set; no-emit-when-chat-id-unset
set -euo pipefail

test_emits_marker_when_chat_id_set() {
  # TODO: set FEISHU_CHAT_ID=oc_test123; run emit block; assert output contains FEISHU_NOTIFY: chat_id=oc_test123
  echo "stub: test_emits_marker_when_chat_id_set"
}

test_no_emit_when_chat_id_unset() {
  # TODO: unset FEISHU_CHAT_ID; run emit block; assert output does not contain FEISHU_NOTIFY
  echo "stub: test_no_emit_when_chat_id_unset"
}

# Run stubs when executed directly
case "${1:-}" in
  emits-marker-when-chat-id-set) test_emits_marker_when_chat_id_set ;;
  no-emit-when-chat-id-unset) test_no_emit_when_chat_id_unset ;;
  *) echo "Usage: $0 emits-marker-when-chat-id-set|no-emit-when-chat-id-unset" ;;
esac
