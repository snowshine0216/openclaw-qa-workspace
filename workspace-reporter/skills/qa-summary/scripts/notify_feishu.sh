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
  # Fallback A: wacli (OpenClaw CLI / LLM gateway)
  WACLI_BIN="${WACLI_BIN:-wacli}"
  if command -v "$WACLI_BIN" >/dev/null 2>&1; then
    _feature_key="$(basename "${run_dir:-$(dirname "$final_path")}")"
    _msg="📊 QA Summary published: ${_feature_key}"
    [[ "$page_url" != "none" && -n "$page_url" ]] && _msg="${_msg}
Confluence: ${page_url}"
    if "$WACLI_BIN" feishu send --chat-id "$chat_id" --text "$_msg" 2>/dev/null; then
      if [[ -n "$run_dir" ]]; then
        RUN_DIR="$run_dir" node -e "
          const fs = require('fs');
          const rp = process.env.RUN_DIR + '/run.json';
          if (fs.existsSync(rp)) {
            const r = JSON.parse(fs.readFileSync(rp,'utf8'));
            r.notification_sent_at = new Date().toISOString();
            r.notification_pending = null;
            r.updated_at = new Date().toISOString();
            fs.writeFileSync(rp, JSON.stringify(r,null,2)+'\\n');
          }
        " 2>/dev/null || true
      fi
      exit 0
    fi
  fi

  # Fallback B: direct Feishu webhook URL
  _webhook="${FEISHU_WEBHOOK_URL:-}"
  if [[ -n "$_webhook" ]]; then
    _feature_key="$(basename "${run_dir:-$(dirname "$final_path")}")"
    _text="📊 QA Summary published: ${_feature_key}. Confluence: ${page_url}"
    _payload="{\"msg_type\":\"text\",\"content\":{\"text\":\"${_text}\"}}"
    if curl -sf -X POST -H "Content-Type: application/json" -d "$_payload" "$_webhook" >/dev/null 2>&1; then
      exit 0
    fi
  fi

  last_error="feishu-notify skill not found; wacli and webhook fallbacks also failed"
  echo "FEISHU_NOTIFY_FAILED: $last_error" >&2
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
