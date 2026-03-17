#!/usr/bin/env bash
set -euo pipefail

# Fallback Feishu notification for qa-summary skill.
# Usage: notify_feishu.sh <chat_id> <final_path> [page_url] [run_dir]
# When run_dir is provided and send fails, persist notification_pending to run.json.

persist_notification_pending() {
  local feature_key run_file payload_file
  feature_key="$(basename "$run_dir")"
  mkdir -p "$run_dir/context"
  payload_file="$run_dir/context/notification_payload.json"
  cat > "$payload_file" <<EOF
{
  "chat_id": "$chat_id",
  "final_path": "$final_path",
  "page_url": "$page_url",
  "feature_key": "$feature_key"
}
EOF
  run_file="$run_dir/run.json"
  pending_file="$run_dir/context/notification_pending.json"
  CHAT_ID="$chat_id" FEATURE_KEY="$feature_key" FINAL_PATH="$final_path" PAGE_URL="$page_url" \
  PAYLOAD_FILE="$payload_file" LAST_ERROR="${last_error:-send failed}" \
  RUN_FILE="$run_file" PENDING_FILE="$pending_file" node -e "
    const fs = require('fs');
    const payload = {
      channel: 'feishu',
      chat_id: process.env.CHAT_ID,
      feature_key: process.env.FEATURE_KEY,
      final_path: process.env.FINAL_PATH,
      page_url: process.env.PAGE_URL,
      payload_file: process.env.PAYLOAD_FILE,
      last_error: process.env.LAST_ERROR,
      recorded_at: new Date().toISOString()
    };
    const runPath = process.env.RUN_FILE;
    const pendingPath = process.env.PENDING_FILE;
    if (runPath && fs.existsSync(runPath)) {
      const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
      run.notification_pending = payload;
      run.updated_at = new Date().toISOString();
      fs.writeFileSync(runPath, JSON.stringify(run, null, 2) + '\n');
    } else if (pendingPath) {
      fs.writeFileSync(pendingPath, JSON.stringify(payload, null, 2) + '\n');
    }
  "
}

find_repo_root() {
  local start_dir="${1:-$(pwd)}"
  local current
  current="$(cd "$start_dir" 2>/dev/null && pwd)" || return 1
  while [[ -n "$current" && "$current" != "/" ]]; do
    if [[ -d "$current/.agents" || -f "$current/AGENTS.md" ]]; then
      echo "$current"
      return 0
    fi
    current="$(dirname "$current")"
  done
  echo ""
  return 1
}

resolve_registrar_script() {
  local repo_root candidate
  repo_root="${REPO_ROOT:-$(find_repo_root "$SKILL_ROOT")}"
  for candidate in \
    "${SKILL_PATH_REGISTRAR_SCRIPT:-}" \
    "${repo_root:+$repo_root/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh}" \
    "${CODEX_HOME:+$CODEX_HOME/skills/skill-path-registrar/scripts/skill_path_registrar.sh}" \
    "${HOME:+$HOME/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh}" \
    "${HOME:+$HOME/.openclaw/skills/skill-path-registrar/scripts/skill_path_registrar.sh}"
  do
    if [[ -n "$candidate" && -f "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

chat_id="${1:-}"
final_path="${2:-}"
page_url="${3:-none}"
run_dir="${4:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -n "$chat_id" && -n "$final_path" ]] || {
  echo "Usage: notify_feishu.sh <chat_id> <final_path> [page_url] [run_dir]" >&2
  exit 1
}

REPO_ROOT="${REPO_ROOT:-$(find_repo_root "$SKILL_ROOT" || true)}"
REGISTRAR_SH="$(resolve_registrar_script || true)"
FEISHU_SCRIPT="${FEISHU_NOTIFY_SCRIPT:-}"
if [[ -z "$FEISHU_SCRIPT" && -f "$REGISTRAR_SH" ]]; then
  # shellcheck source=/dev/null
  source "$REGISTRAR_SH"
  resolve_shared_skill_script feishu-notify scripts/send-feishu-notification.js && FEISHU_SCRIPT="$RESOLVED_SKILL_SCRIPT"
fi

if [[ ! -f "$FEISHU_SCRIPT" ]]; then
  last_error="script not found"
  echo "FEISHU_NOTIFY_PENDING: script not found at $FEISHU_SCRIPT" >&2
  if [[ -n "$run_dir" ]]; then
    persist_notification_pending
  fi
  exit 1
fi

node "$FEISHU_SCRIPT" --chat-id "$chat_id" --file "$final_path" --page-url "$page_url" || {
  err=$?
  last_error="send failed"
  echo "FEISHU_NOTIFY_PENDING: $last_error" >&2
  if [[ -n "$run_dir" ]]; then
    persist_notification_pending
  fi
  exit "$err"
}
