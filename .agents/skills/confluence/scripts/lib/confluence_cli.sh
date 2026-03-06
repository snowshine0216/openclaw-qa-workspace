#!/bin/bash

confluence_bin() {
  printf '%s\n' "${CONFLUENCE_BIN:-confluence}"
}

confluence_run() {
  "$(confluence_bin)" "$@"
}

find_pages_by_title() {
  if [ -n "$2" ]; then
    confluence_run find "$1" --space "$2"
    return
  fi

  confluence_run find "$1"
}

extract_page_ids() {
  printf '%s\n' "$1" | grep -Eo '[0-9]{5,}' | awk '!seen[$0]++' || true
}

find_page_id_by_title() {
  local title="$1"
  local space_key="$2"
  local raw_output
  local ids
  local count

  raw_output="$(find_pages_by_title "$title" "$space_key")"
  if [ -z "$raw_output" ]; then
    return 1
  fi

  ids="$(extract_page_ids "$raw_output")"
  count="$(printf '%s\n' "$ids" | sed '/^$/d' | wc -l | tr -d ' ')"

  case "$count" in
    0) echo "Unable to parse Confluence page id from find output for '$title'" >&2; return 2 ;;
    1) printf '%s\n' "$ids" ;;
    *) echo "Ambiguous Confluence title match for '$title' in space '$space_key'" >&2; return 2 ;;
  esac
}

update_page_from_storage() {
  confluence_run update "$1" --file "$2" --format storage
}

create_page_from_storage() {
  confluence_run create "$1" "$2" --file "$3" --format storage
}

create_child_page_from_storage() {
  confluence_run create-child "$1" "$2" --file "$3" --format storage
}
