#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# shellcheck source=/dev/null
source "$SCRIPT_DIR/lib/confluence_cli.sh"

INPUT_FILE=""
OUTPUT_HTML=""
PAGE_ID=""
SPACE_KEY=""
PAGE_TITLE=""
PARENT_ID=""
DRY_RUN="false"
TEMP_OUTPUT=""

usage() {
  cat <<'EOF'
Usage:
  run-confluence-publish.sh --input <file.md> --page-id <id> [--output-html <file>] [--dry-run]
  run-confluence-publish.sh --input <file.md> --space <key> --title <title> [--parent-id <id>] [--output-html <file>] [--dry-run]
EOF
}

fail() {
  echo "Error: $1" >&2
  exit 1
}

parse_args() {
  while [ $# -gt 0 ]; do
    case "$1" in
      --input) INPUT_FILE="$2"; shift 2 ;;
      --output-html) OUTPUT_HTML="$2"; shift 2 ;;
      --page-id) PAGE_ID="$2"; shift 2 ;;
      --space) SPACE_KEY="$2"; shift 2 ;;
      --title) PAGE_TITLE="$2"; shift 2 ;;
      --parent-id) PARENT_ID="$2"; shift 2 ;;
      --dry-run) DRY_RUN="true"; shift ;;
      --help|-h) usage; exit 0 ;;
      *) fail "unknown argument: $1" ;;
    esac
  done
}

validate_args() {
  [ -n "$INPUT_FILE" ] || fail 'missing required --input'
  [ -f "$INPUT_FILE" ] || fail "input file not found: $INPUT_FILE"
  [ -n "$PAGE_ID" ] && [ -n "$SPACE_KEY" ] && fail 'choose either --page-id or --space with --title'
  [ -n "$PAGE_ID" ] && [ -n "$PAGE_TITLE" ] && fail 'do not combine --page-id with --title'
  [ -n "$PAGE_ID" ] && [ -n "$PARENT_ID" ] && fail 'do not combine --page-id with --parent-id'
  [ "$DRY_RUN" = 'false' ] || [ -n "$OUTPUT_HTML" ] || fail '--dry-run requires --output-html so the generated HTML remains available'
  [ -n "$PAGE_ID" ] && return 0
  [ -n "$SPACE_KEY" ] && [ -n "$PAGE_TITLE" ] && return 0
  fail 'provide either --page-id or --space with --title'
}

prepare_output_path() {
  if [ -n "$OUTPUT_HTML" ]; then
    return 0
  fi
  TEMP_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/confluence-publish.XXXXXX.html")"
  OUTPUT_HTML="$TEMP_OUTPUT"
}

cleanup() {
  if [ -n "$TEMP_OUTPUT" ] && [ -f "$TEMP_OUTPUT" ]; then
    rm -f "$TEMP_OUTPUT"
  fi
}

convert_markdown() {
  node "$SCRIPT_DIR/lib/markdown_to_confluence.js" "$INPUT_FILE" "$OUTPUT_HTML"
}

publish_to_page_id() {
  update_page_from_storage "$PAGE_ID" "$OUTPUT_HTML"
  printf 'page_id=%s\nhtml=%s\naction=update\n' "$PAGE_ID" "$OUTPUT_HTML"
}

publish_by_title() {
  local existing_id
  local find_status=0

  if existing_id="$(find_page_id_by_title "$PAGE_TITLE" "$SPACE_KEY")"; then
    update_page_from_storage "$existing_id" "$OUTPUT_HTML"
    printf 'page_id=%s\nhtml=%s\naction=update\n' "$existing_id" "$OUTPUT_HTML"
    return 0
  else
    find_status=$?
  fi

  [ "$find_status" -eq 1 ] || return "$find_status"
  if [ -n "$PARENT_ID" ]; then
    create_child_page_from_storage "$PAGE_TITLE" "$PARENT_ID" "$OUTPUT_HTML" >/dev/null
    printf 'page_id=\nhtml=%s\naction=create-child\n' "$OUTPUT_HTML"
    return 0
  fi

  create_page_from_storage "$PAGE_TITLE" "$SPACE_KEY" "$OUTPUT_HTML" >/dev/null
  printf 'page_id=\nhtml=%s\naction=create\n' "$OUTPUT_HTML"
}

main() {
  trap cleanup EXIT
  parse_args "$@"
  validate_args
  prepare_output_path
  convert_markdown
  [ "$DRY_RUN" = 'false' ] || {
    printf 'html=%s\naction=dry-run\n' "$OUTPUT_HTML"
    return 0
  }
  [ -n "$PAGE_ID" ] && publish_to_page_id && return 0
  publish_by_title
}

main "$@"
