#!/usr/bin/env bash
set -euo pipefail

# Integration tests for setup-workspace-symlinks.sh
# Creates a temp repo layout, runs the script, asserts symlinks.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../.." && pwd)"

echo "Running setup-symlinks integration tests..."

mkdir -p "$repo_root/tmp"
tmp=$(mktemp -d "$repo_root/tmp/setup-symlinks-test-XXXXXX")
trap 'rm -rf "$tmp"' EXIT
cd "$tmp" || exit 1

# Create minimal repo layout matching scripts/ structure (script at scripts/setup-workspace-symlinks.sh)
mkdir -p scripts/lib
mkdir -p .agents/skills
mkdir -p workspace/projects
mkdir -p workspace-planner workspace-healer workspace-tester workspace-daily workspace-reporter
mkdir -p .cursor .claude

cp -r "$repo_root/scripts/lib/"* "$tmp/scripts/lib/"
cp "$repo_root/scripts/setup-workspace-symlinks.sh" "$tmp/scripts/"

# Run setup from tmp (script will use tmp as ROOT_DIR via dirname)
bash "$tmp/scripts/setup-workspace-symlinks.sh" || { echo "FAIL: setup script failed"; exit 1; }

# Assert workspace-planner/skills is symlink to .agents/skills
if [[ ! -L "workspace-planner/skills" ]]; then
  echo "FAIL: workspace-planner/skills should be a symlink"
  exit 1
fi
target=$(readlink "workspace-planner/skills")
if [[ "$target" != "../.agents/skills" ]]; then
  echo "FAIL: workspace-planner/skills -> $target, expected ../.agents/skills"
  exit 1
fi

# Assert workspace-planner/projects is symlink to workspace/projects
if [[ ! -L "workspace-planner/projects" ]]; then
  echo "FAIL: workspace-planner/projects should be a symlink"
  exit 1
fi
target=$(readlink "workspace-planner/projects")
if [[ "$target" != "../workspace/projects" ]]; then
  echo "FAIL: workspace-planner/projects -> $target, expected ../workspace/projects"
  exit 1
fi

# Assert idempotency: run again, should succeed
bash "$tmp/scripts/setup-workspace-symlinks.sh" || { echo "FAIL: idempotent run failed"; exit 1; }
target=$(readlink "workspace-planner/skills")
if [[ "$target" != "../.agents/skills" ]]; then
  echo "FAIL: after idempotent run, workspace-planner/skills -> $target"
  exit 1
fi

# Assert --dry-run: create fresh layout, run dry-run, no symlinks created
rm -rf workspace-planner/skills workspace-planner/projects
mkdir -p workspace-planner/skills
bash "$tmp/scripts/setup-workspace-symlinks.sh" --dry-run || { echo "FAIL: dry-run failed"; exit 1; }
if [[ -L "workspace-planner/skills" ]]; then
  echo "FAIL: dry-run should not create symlinks (skills still symlink)"
  exit 1
fi
if [[ -d "workspace-planner/skills" ]]; then
  echo "ok: dry-run left directory as-is"
fi

echo "PASS"
