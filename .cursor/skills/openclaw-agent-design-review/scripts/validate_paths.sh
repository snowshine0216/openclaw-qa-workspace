#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $0 <path-list-file> [repo-root]" >&2
  exit 2
fi

path_list_file="$1"
repo_root="${2:-$(pwd)}"

if [ ! -f "$path_list_file" ]; then
  echo "ERROR: path list file not found: $path_list_file" >&2
  exit 2
fi

if [ ! -d "$repo_root" ]; then
  echo "ERROR: repo root not found: $repo_root" >&2
  exit 2
fi

failures=0
checked=0

trim() {
  printf '%s' "$1" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//'
}

while IFS= read -r line || [ -n "$line" ]; do
  raw_line="$line"
  line="${line%%#*}"
  line="$(trim "$line")"
  [ -z "$line" ] && continue

  # Markdown link form: [label](path)
  if printf '%s' "$line" | rg -q '^\[[^]]+\]\([^)]+\)$'; then
    line="$(printf '%s' "$line" | sed -E 's/^\[[^]]+\]\(([^)]+)\)$/\1/')"
  fi

  # Strip surrounding backticks if present.
  line="${line#\`}"
  line="${line%\`}"
  line="$(trim "$line")"

  checked=$((checked + 1))

  if [[ "$line" =~ ^https?:// ]]; then
    echo "INFO: skipped URL reference: $line"
    continue
  fi

  if [[ "$line" == *"<"* || "$line" == *">"* ]]; then
    echo "FAIL: unresolved placeholder path: $raw_line"
    failures=$((failures + 1))
    continue
  fi

  if [[ "$line" == /Users/* ]]; then
    echo "FAIL: hardcoded user-home path is not portable: $line"
    failures=$((failures + 1))
    continue
  fi

  candidate="$line"
  if [[ "$candidate" != /* ]]; then
    candidate="$repo_root/$candidate"
  fi

  if [ -e "$candidate" ]; then
    echo "OK: $line"
  else
    echo "FAIL: missing path: $line"
    failures=$((failures + 1))
  fi
done < "$path_list_file"

echo "Checked path references: $checked"
echo "Failures: $failures"

if [ "$failures" -gt 0 ]; then
  exit 1
fi
