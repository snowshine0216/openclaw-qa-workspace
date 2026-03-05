#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../../lib/symlink-helpers.sh
source "$script_dir/../../lib/symlink-helpers.sh"

echo "Running symlink-helpers unit tests..."

# Test resolve_link_target
result=$(resolve_link_target "workspace-planner" ".agents/skills")
if [[ "$result" != "../.agents/skills" ]]; then
  echo "FAIL: resolve_link_target(workspace-planner, .agents/skills) = $result, expected ../.agents/skills"
  exit 1
fi

result=$(resolve_link_target "a/b/c" "x/y")
if [[ "$result" != "../../../x/y" ]]; then
  echo "FAIL: resolve_link_target(a/b/c, x/y) = $result, expected ../../../x/y"
  exit 1
fi

# Test compute_workspace_skills_target
result=$(compute_workspace_skills_target "workspace-planner")
if [[ "$result" != "../.agents/skills" ]]; then
  echo "FAIL: compute_workspace_skills_target = $result, expected ../.agents/skills"
  exit 1
fi

# Test compute_projects_target
result=$(compute_projects_target)
if [[ "$result" != "../workspace/projects" ]]; then
  echo "FAIL: compute_projects_target = $result, expected ../workspace/projects"
  exit 1
fi

# Test get_link_status and should_replace in temp dir
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
cd "$tmp" || exit 1

mkdir -p dir1
status=$(get_link_status "dir1" "../target")
if [[ "$status" != "$LINK_STATUS_REPLACE" ]]; then
  echo "FAIL: get_link_status(dir) = $status, expected REPLACE"
  exit 1
fi

status=$(get_link_status "missing" "../target")
if [[ "$status" != "$LINK_STATUS_CREATE" ]]; then
  echo "FAIL: get_link_status(missing) = $status, expected CREATE"
  exit 1
fi

rm -rf dir1
ln -sfn "../target" dir1
status=$(get_link_status "dir1" "../target")
if [[ "$status" != "$LINK_STATUS_OK" ]]; then
  echo "FAIL: get_link_status(symlink ok) = $status, expected OK"
  exit 1
fi

rm -f dir1
ln -sfn "../wrong" dir1
status=$(get_link_status "dir1" "../target")
if [[ "$status" != "$LINK_STATUS_REPLACE" ]]; then
  echo "FAIL: get_link_status(symlink wrong) = $status, expected REPLACE"
  exit 1
fi

# Test should_replace
rm -f dir1
mkdir -p dir1
if ! should_replace "dir1" "../target"; then
  echo "FAIL: should_replace(dir) should be true"
  exit 1
fi

rm -rf dir1
ln -sfn "../target" dir1
if should_replace "dir1" "../target"; then
  echo "FAIL: should_replace(ok symlink) should be false"
  exit 1
fi

echo "PASS"
