#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/lib/logging.sh"
source "$script_dir/lib/feishu.sh"

update_jira_for_all() {
  local rca_dir="$1"
  local target_script_dir="$2"
  local dry_run="${3:-false}"
  
  for f in "$rca_dir"/*.md; do
    if [[ ! -f "$f" ]]; then continue; fi
    local issue_key
    issue_key=$(basename "$f" | grep -o '^BCIN-[0-9]*' || echo "")
    if [[ -n "$issue_key" ]]; then
      if [[ "$dry_run" == "true" ]]; then
        log_info "[Dry Run] Would update Jira for $issue_key using $f"
      elif [[ -x "$target_script_dir/update-jira-latest-status.sh" ]]; then
        "$target_script_dir/update-jira-latest-status.sh" "$issue_key" "$f" || true
      fi
    fi
  done
}

generate_summary() {
  local rca_dir="$1"
  local output_dir="$2"
  local timestamp="$3"
  local summary_file="$output_dir/feishu-summary-$timestamp.md"
  
  echo "# Workflow Summary" > "$summary_file"
  echo "| Key | File |" >> "$summary_file"
  echo "|---|---|" >> "$summary_file"
  
  for f in "$rca_dir"/*.md; do
    if [[ ! -f "$f" ]]; then continue; fi
    local base_f
    base_f=$(basename "$f")
    local issue_key
    issue_key=$(basename "$f" | grep -o '^BCIN-[0-9]*' || basename "$f" .md)
    echo "| $issue_key | $base_f |" >> "$summary_file"
  done
  
  echo "$summary_file"
}

notify_feishu_summary() {
  local summary_file="$1"
  local chat_id="$2"
  local run_json="$3"
  local dry_run="${4:-false}"
  
  if [[ "$dry_run" == "true" ]]; then
    log_info "[Dry Run] Would send Feishu summary $summary_file"
    return 0
  fi
  
  if ! feishu_send "$summary_file" "$chat_id"; then
    log_error "Feishu notification failed, persisting fallback"
    local payload
    payload=$(cat "$summary_file")
    feishu_persist_fallback "$run_json" "$payload"
  fi
}

main() {
  local dry_run="false"
  if [[ "${1:-}" == "--dry-run" ]]; then
    dry_run="true"
    shift
  fi
  
  local rca_dir="${1:-/tmp/rca}"
  local output_dir="${2:-/tmp/out}"
  local chat_id="${3:-default_chat_id}"
  local run_json="${4:-/tmp/run.json}"
  local target_script_dir="${5:-$script_dir}"
  local timestamp
  timestamp=$(date -u +%Y%m%d%H%M%S)
  
  mkdir -p "$output_dir"
  
  log_step "Post Workflow Actions"
  update_jira_for_all "$rca_dir" "$target_script_dir" "$dry_run"
  
  local summary_file
  summary_file=$(generate_summary "$rca_dir" "$output_dir" "$timestamp")
  
  notify_feishu_summary "$summary_file" "$chat_id" "$run_json" "$dry_run"
  log_info "Post workflow completed."
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
