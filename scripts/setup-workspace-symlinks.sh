#!/usr/bin/env bash
# Setup symlinks so .agents/skills and workspace/projects are single sources of truth.
# Run from repository root. Idempotent: safe to run multiple times or after clone.
#
# Usage:
#   ./scripts/setup-workspace-symlinks.sh [--dry-run]
#
# Prerequisites:
#   - .agents/skills must exist (run ./scripts/sync-skills.sh first)
#   - workspace/projects must exist (script creates if missing)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# shellcheck source=scripts/lib/symlink-helpers.sh
source "$SCRIPT_DIR/lib/symlink-helpers.sh"

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

WORKSPACES=(workspace-planner workspace-healer workspace-tester workspace-daily workspace-reporter)
# Link path : target (relative to link's containing dir)
ROOT_LINK_SPECS=(
  ".cursor/skills:../.agents/skills"
  ".claude/skills:../.agents/skills"
)

ensure_prerequisites() {
  if [[ ! -d ".agents/skills" ]]; then
    echo "Error: .agents/skills not found. Run ./scripts/sync-skills.sh first."
    exit 1
  fi
  if [[ ! -d "workspace/projects" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "Note: workspace/projects would be created (mkdir -p)"
    else
      mkdir -p workspace/projects
      echo "Created workspace/projects"
    fi
  fi
}

apply_link() {
  local link_path="$1"
  local target="$2"
  local status
  status="$(get_link_status "$link_path" "$target")"

  case "$status" in
    "$LINK_STATUS_OK")
      echo "ok: $link_path already points to $target"
      ;;
    "$LINK_STATUS_REPLACE")
      echo "replace: $link_path (directory or wrong symlink)"
      if [[ "$DRY_RUN" != true ]]; then
        rm -rf "$link_path"
        ln -sfn "$target" "$link_path"
      fi
      ;;
    "$LINK_STATUS_CREATE")
      echo "create: $link_path -> $target"
      if [[ "$DRY_RUN" != true ]]; then
        ln -sfn "$target" "$link_path"
      fi
      ;;
  esac
}

main() {
  ensure_prerequisites

  for spec in "${ROOT_LINK_SPECS[@]}"; do
    local link_path="${spec%%:*}"
    local target="${spec##*:}"
    apply_link "$link_path" "$target"
  done

  skills_target="$(compute_workspace_skills_target)"
  for ws in "${WORKSPACES[@]}"; do
    apply_link "$ws/skills" "$skills_target"
  done
  apply_link "workspace/skills" "$skills_target"

  projects_target="$(compute_projects_target)"
  for ws in "${WORKSPACES[@]}"; do
    apply_link "$ws/projects" "$projects_target"
  done

  echo ""
  echo "Done. Skills -> .agents/skills; projects -> workspace/projects."
  echo "Commit the symlinks so they persist across clones."
}

main
