#!/usr/bin/env bash
# lib/symlink-helpers.sh — Pure functions for symlink setup. Source this file; do not execute directly.
# All functions are pure: no side effects, no I/O except return values.

# Status values for get_link_status
readonly LINK_STATUS_OK='ok'
readonly LINK_STATUS_REPLACE='replace'
readonly LINK_STATUS_CREATE='create'

# Compute relative path from link parent dir to target dir.
# Usage: resolve_link_target <from_dir> <to_dir>
# Example: resolve_link_target "workspace-planner" ".agents/skills" => "../.agents/skills"
resolve_link_target() {
  local from="$1"
  local to="$2"
  local depth=0
  if [[ -n "$from" ]]; then
    depth=1
    local rest="$from"
    while [[ "$rest" == */* ]]; do
      depth=$((depth + 1))
      rest="${rest#*/}"
    done
  fi
  local prefix=""
  for ((i = 0; i < depth; i++)); do
    prefix="${prefix}../"
  done
  echo "${prefix}${to}"
}

# Get status of a path: ok (symlink matches), replace (dir or wrong symlink), create (missing).
# Usage: get_link_status <path> <expected_target>
# Returns: LINK_STATUS_OK | LINK_STATUS_REPLACE | LINK_STATUS_CREATE
get_link_status() {
  local path="$1"
  local expected="$2"
  if [[ -L "$path" ]]; then
    local current
    current="$(readlink "$path")"
    if [[ "$current" == "$expected" ]]; then
      echo "$LINK_STATUS_OK"
    else
      echo "$LINK_STATUS_REPLACE"
    fi
  elif [[ -d "$path" ]]; then
    echo "$LINK_STATUS_REPLACE"
  else
    echo "$LINK_STATUS_CREATE"
  fi
}

# Relative path from workspace/skills to .agents/skills.
# All workspaces are one level from repo root: ../.agents/skills
compute_workspace_skills_target() {
  echo "../.agents/skills"
}

# Relative path from workspace-*/projects to workspace/projects.
# All workspace-* are one level from repo root: ../workspace/projects
compute_projects_target() {
  echo "../workspace/projects"
}

# Whether the path should be replaced (dir or wrong symlink).
# Usage: should_replace <path> <expected_target>
should_replace() {
  local status
  status="$(get_link_status "$1" "$2")"
  [[ "$status" == "$LINK_STATUS_REPLACE" ]]
}
