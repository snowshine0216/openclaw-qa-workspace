#!/usr/bin/env bash
# NOTE: requires bash >= 4. On macOS install via: brew install bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/lib/logging.sh"
source "$script_dir/lib/manifest.sh"

find_input_files() {
  local output_dir="$1"
  find "$output_dir" -name '*-input-*.json' 2>/dev/null || true
}

collect_file_list() {
  local output_dir="$1"
  local files=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && files+=("$line")
  done < <(find_input_files "$output_dir")
  echo "${#files[@]}" "${files[@]+${files[@]}}"
}

build_entries_json() {
  local output_dir="$1"
  local entries_json="[]"
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    local issue_key output_path entry_obj
    issue_key=$(jq -r '.issue_key' "$f")
    output_path=$(jq -r '.rca_output_path' "$f")
    entry_obj=$(jq -n --arg k "$issue_key" --arg i "$f" --arg o "$output_path" \
      '{issue_key:$k,input_file:$i,output_file:$o}')
    entries_json=$(echo "$entries_json" | jq --argjson e "$entry_obj" '. += [$e]')
  done < <(find_input_files "$output_dir")
  echo "$entries_json"
}

build_manifest() {
  local output_dir="$1"
  local timestamp="$2"
  local total
  total=$(find_input_files "$output_dir" | wc -l | tr -d ' ')
  local manifest_json
  manifest_json=$(manifest_create "$timestamp" "$total")
  local entries_json
  entries_json=$(build_entries_json "$output_dir")
  echo "$manifest_json" | jq --argjson entries "$entries_json" '.rca_inputs = $entries'
}

write_manifest() {
  local json_content="$1"
  local manifest_path="$2"
  echo "$json_content" > "${manifest_path}.tmp"
  mv "${manifest_path}.tmp" "$manifest_path"
}

main() {
  local output_dir="${1:-}"
  local timestamp="${2:-$(date -u +%Y%m%d-%H%M%S)}"
  
  if [[ -z "$output_dir" ]]; then
    log_error "Usage: $0 <output_dir> [timestamp]"
    exit 1
  fi
  
  log_step "Creating Manifest"
  local final_json
  final_json=$(build_manifest "$output_dir" "$timestamp")
  
  local manifest_path="$output_dir/manifest-$timestamp.json"
  write_manifest "$final_json" "$manifest_path"
  manifest_validate "$manifest_path"
  log_info "Manifest written to $manifest_path"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
