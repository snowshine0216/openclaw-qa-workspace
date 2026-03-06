#!/bin/bash

tools_file_path() {
  printf '%s/TOOLS.md\n' "$1"
}

read_chat_id() {
  local workspace_path="$1"
  local tools_file=""
  local chat_id=""

  tools_file="$(tools_file_path "$workspace_path")"
  [ -f "$tools_file" ] || return 1

  chat_id="$(awk '
    /^##[[:space:]]+Feishu([[:space:]]|$)/ { in_feishu = 1; next }
    /^##[[:space:]]+/ && in_feishu { exit }
    in_feishu && /^[[:space:]]*-[[:space:]]*chat_id:[[:space:]]*/ {
      sub(/^[[:space:]]*-[[:space:]]*chat_id:[[:space:]]*/, "", $0)
      sub(/[[:space:]]*$/, "", $0)
      print
      exit
    }
  ' "$tools_file")"
  [ -n "$chat_id" ] || return 1

  printf '%s\n' "$chat_id"
}
