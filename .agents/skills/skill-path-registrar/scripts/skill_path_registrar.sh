#!/usr/bin/env bash
# Source this file to get resolve_shared_skill_script function.
# Usage: resolve_shared_skill_script <skill-name> <script-relative-path>
# Sets RESOLVED_SKILL_SCRIPT to the path, or empty if not found.
# Requires: REPO_ROOT (optional; discovered via find_repo_root if unset)

find_repo_root() {
  local d="${1:-$(pwd)}"
  d="$(cd "$d" 2>/dev/null && pwd)" || return 1
  while [[ -n "$d" && "$d" != "/" ]]; do
    if [[ -d "$d/.agents" || -f "$d/AGENTS.md" ]]; then
      echo "$d"
      return 0
    fi
    d="$(dirname "$d")"
  done
  echo ""
  return 1
}

resolve_shared_skill_script() {
  local skill_name="$1"
  local script_rel="$2"
  [[ -z "$skill_name" || -z "$script_rel" ]] && return 1

  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local registrar_lib="${script_dir}/../lib"
  local cli="${script_dir}/cli_resolve.mjs"

  if [[ -z "$REPO_ROOT" ]]; then
    REPO_ROOT="$(find_repo_root)"
  fi

  if [[ -x "$cli" || -f "$cli" ]]; then
    RESOLVED_SKILL_SCRIPT="$(REPO_ROOT="${REPO_ROOT}" node "$cli" "$skill_name" "$script_rel" 2>/dev/null)" || true
  else
    RESOLVED_SKILL_SCRIPT=""
  fi

  [[ -n "$RESOLVED_SKILL_SCRIPT" ]]
}
