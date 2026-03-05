#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$script_dir/lib/logging.sh"

init_state() {
  local run_json="$1"
  local task_json="$2"
  
  if [[ ! -f "$run_json" ]]; then
    echo '{"notification_pending": null, "updated_at": ""}' > "$run_json"
  fi
  
  if [[ ! -f "$task_json" ]]; then
    echo '{"overall_status": "in_progress", "current_phase": "phase_0_prepare", "updated_at": ""}' > "$task_json"
  fi
}

main() {
  local key="${1:-}"
  local dry_run="false"
  
  if [[ "$key" == "--dry-run" ]]; then
    dry_run="true"
    key="${2:-BCIN-TEST}"
  fi
  
  if [[ "${2:-}" == "--dry-run" ]]; then
    dry_run="true"
  fi
  
  if [[ -z "$key" ]]; then
    log_error "Usage: $0 [--dry-run] <key>"
    exit 1
  fi
  
  log_step "Initializing Workflow for $key"
  
  local project_dir="/tmp/projects/design/$key"
  mkdir -p "$project_dir"
  
  local run_json="$project_dir/run.json"
  local task_json="$project_dir/task.json"
  init_state "$run_json" "$task_json"
  
  if [[ "$dry_run" == "true" ]]; then
    log_info "[Dry Run] Skipping check_resume.sh"
  elif [[ -x "$script_dir/check_resume.sh" ]]; then
    "$script_dir/check_resume.sh" "$key"
  fi
  
  log_step "Creating Manifest"
  local out_dir="$project_dir/output"
  mkdir -p "$out_dir"
  local timestamp
  timestamp=$(date -u +%Y%m%d%H%M%S)
  
  if [[ "$dry_run" == "true" ]]; then
    log_info "[Dry Run] Skipping actual manifest creation"
    echo '{"timestamp": "'$timestamp'", "total_issues": 1, "rca_inputs": []}' > "$out_dir/manifest-$timestamp.json"
  else
    "$script_dir/create-manifest.sh" "$out_dir" "$timestamp"
  fi
  
  log_step "Spawning Agents"
  if [[ "$dry_run" == "true" ]]; then
    log_info "[Dry Run] Skipping node spawn-agents.js"
  else
    node "$script_dir/spawn-agents.js" "$out_dir/manifest-$timestamp.json"
  fi
  
  log_step "Workflow Orchestration Complete"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
