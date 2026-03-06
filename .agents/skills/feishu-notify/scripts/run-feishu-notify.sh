#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/resolve_workspace.sh"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/read_chat_id.sh"

WORKSPACE_PATH=""
MESSAGE_FILE=""
MESSAGE_TEXT=""

usage() {
  cat <<'EOF'
Usage:
  run-feishu-notify.sh [--workspace <path>] --file <message.md>
  run-feishu-notify.sh [--workspace <path>] --message <text>
EOF
}

fail() {
  echo "Error: $1" >&2
  exit 1
}

option_value() {
  local flag="$1"
  local value="${2-}"

  [ -n "$value" ] || fail "missing value for $flag"
  case "$value" in
    --*) fail "missing value for $flag" ;;
  esac

  printf '%s\n' "$value"
}

parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
      --workspace) WORKSPACE_PATH="$(option_value "$1" "${2-}")"; shift 2 ;;
      --file) MESSAGE_FILE="$(option_value "$1" "${2-}")"; shift 2 ;;
      --message) MESSAGE_TEXT="$(option_value "$1" "${2-}")"; shift 2 ;;
      --help|-h) usage; exit 0 ;;
      *) fail "unknown argument: $1" ;;
    esac
  done
}

validate_message_selection() {
  [ -n "$MESSAGE_FILE" ] && [ -n "$MESSAGE_TEXT" ] && fail 'choose exactly one of --file or --message'
  [ -n "$MESSAGE_FILE" ] || [ -n "$MESSAGE_TEXT" ] || fail 'choose exactly one of --file or --message'
}

run_sender() {
  local workspace_root="$1"
  local chat_id="$2"

  if [ -n "$MESSAGE_FILE" ]; then
    node "$SCRIPT_DIR/send-feishu-notification.js" --chat-id "$chat_id" --file "$MESSAGE_FILE"
    return 0
  fi

  node "$SCRIPT_DIR/send-feishu-notification.js" --chat-id "$chat_id" --message "$MESSAGE_TEXT"
}

main() {
  local workspace_root=""
  local chat_id=""

  parse_args "$@"
  validate_message_selection
  workspace_root="$(resolve_workspace "$WORKSPACE_PATH")" || fail 'unable to resolve workspace with TOOLS.md'
  chat_id="$(read_chat_id "$workspace_root")" || fail "chat_id not found in $(tools_file_path "$workspace_root")"
  run_sender "$workspace_root" "$chat_id"
}

main "$@"
