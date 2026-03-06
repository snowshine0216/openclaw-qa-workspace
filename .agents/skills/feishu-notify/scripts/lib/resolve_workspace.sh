#!/bin/bash

normalize_workspace_path() {
  local raw_path="$1"
  (cd "$raw_path" >/dev/null 2>&1 && pwd) || return 1
}

resolve_workspace_from_dir() {
  local current_path="$1"
  local parent_path=""

  while [ -n "$current_path" ]; do
    if [ -f "$current_path/TOOLS.md" ]; then
      printf '%s\n' "$current_path"
      return 0
    fi
    parent_path="$(dirname "$current_path")"
    [ "$parent_path" = "$current_path" ] && break
    current_path="$parent_path"
  done

  return 1
}

resolve_workspace() {
  local explicit_workspace="$1"
  local search_root=""

  if [ -n "$explicit_workspace" ]; then
    search_root="$(normalize_workspace_path "$explicit_workspace")" || return 1
    [ -f "$search_root/TOOLS.md" ] || return 1
    printf '%s\n' "$search_root"
    return 0
  fi

  search_root="$(pwd)"
  resolve_workspace_from_dir "$search_root"
}

