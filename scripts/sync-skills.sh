#!/usr/bin/env bash
set -euo pipefail

# Run from repository root.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

link_missing() {
  local src="$1"
  local dst="$2"
  local relative_prefix="$3"
  local added=0

  if [ ! -d "$src" ]; then
    echo "skip: source folder not found: $src"
    return 0
  fi

  if [ ! -d "$dst" ]; then
    echo "creating destination: $dst"
    mkdir -p "$dst"
  fi

  for d in "$src"/*; do
    local name
    name="$(basename "$d")"
    if [ ! -e "$dst/$name" ]; then
      ln -s "${relative_prefix}${src}/${name}" "$dst/$name"
      echo "linked: $dst/$name -> ${relative_prefix}${src}/${name}"
      added=$((added + 1))
    else
      echo "skip existing: $dst/$name"
    fi
  done

  echo "added ${added} link(s) into ${dst}"
}

echo "Step 1: sync missing project skills into workspace-planner/skills"
link_missing ".cursor/skills" "workspace-planner/skills" "../../"

echo
echo "Step 2: sync missing workspace-planner skills into .agents/skills"
link_missing "workspace-planner/skills" ".agents/skills" "../../"

echo
echo "Step 3: sync missing .claude/skills into .agents/skills"
link_missing ".claude/skills" ".agents/skills" "../../"
