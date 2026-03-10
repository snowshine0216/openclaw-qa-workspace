#!/usr/bin/env bash

init_task_json() {
  local task_file
  task_file="$(run_dir "$1")/task.json"
  [[ -f "${task_file}" ]] && return 0
  jq -n \
    --arg run_key "$1" \
    --arg ts "$(timestamp_utc)" \
    '{
      run_key: $run_key,
      overall_status: "in_progress",
      current_phase: "phase_0_prepare_run",
      created_at: $ts,
      updated_at: $ts,
      phases: {},
      items: {}
    }' > "${task_file}"
}

init_run_json() {
  local run_file
  run_file="$(run_dir "$1")/run.json"
  [[ -f "${run_file}" ]] && return 0
  jq -n \
    --arg ts "$(timestamp_utc)" \
    '{
      data_fetched_at: null,
      output_generated_at: null,
      jira_published_at: null,
      notification_pending: null,
      updated_at: $ts,
      subtask_timestamps: {},
      spawn_sessions: {},
      jira_publish: {},
      last_error: null
    }' > "${run_file}"
}

reset_task_json() {
  rm -f "$(run_dir "$1")/task.json"
  init_task_json "$1"
}

reset_run_json() {
  rm -f "$(run_dir "$1")/run.json"
  init_run_json "$1"
}

set_task_phase() {
  local task_file tmp ts
  task_file="$(run_dir "$1")/task.json"
  tmp="$(mktemp)"
  ts="$(timestamp_utc)"
  jq \
    --arg phase "$2" \
    --arg status "$3" \
    --arg current "$2" \
    --arg ts "${ts}" \
    '.current_phase = $current |
     .phases[$phase].status = $status |
     .updated_at = $ts' \
    "${task_file}" > "${tmp}" && mv "${tmp}" "${task_file}"
}

set_task_item() {
  local task_file tmp ts
  task_file="$(run_dir "$1")/task.json"
  tmp="$(mktemp)"
  ts="$(timestamp_utc)"
  jq \
    --arg key "$2" \
    --arg status "$3" \
    --arg ts "${ts}" \
    '.items[$key].status = $status | .updated_at = $ts' \
    "${task_file}" > "${tmp}" && mv "${tmp}" "${task_file}"
}

set_task_overall_status() {
  local task_file tmp ts
  task_file="$(run_dir "$1")/task.json"
  tmp="$(mktemp)"
  ts="$(timestamp_utc)"
  jq \
    --arg status "$2" \
    --arg ts "${ts}" \
    '.overall_status = $status | .updated_at = $ts' \
    "${task_file}" > "${tmp}" && mv "${tmp}" "${task_file}"
}

set_run_field() {
  local run_file tmp ts
  run_file="$(run_dir "$1")/run.json"
  tmp="$(mktemp)"
  ts="$(timestamp_utc)"
  jq "$2 | .updated_at = \"${ts}\"" "${run_file}" > "${tmp}" && mv "${tmp}" "${run_file}"
}

set_jira_publish_result() {
  local run_file tmp ts
  run_file="$(run_dir "$1")/run.json"
  tmp="$(mktemp)"
  ts="$(timestamp_utc)"
  jq \
    --arg key "$2" \
    --argjson desc "$3" \
    --argjson comment "$4" \
    --arg status "$5" \
    --arg ts "${ts}" \
    '.jira_publish[$key] = {description_updated: $desc, comment_added: $comment, status: $status} |
     .updated_at = $ts' \
    "${run_file}" > "${tmp}" && mv "${tmp}" "${run_file}"
}

mark_phase_failed() {
  local run_date="$1" phase="$2" exit_code="$3" failed_command="$4"
  local task_file run_file tmp ts
  task_file="$(run_dir "${run_date}")/task.json"
  run_file="$(run_dir "${run_date}")/run.json"
  ts="$(timestamp_utc)"

  tmp="$(mktemp)"
  jq \
    --arg phase "${phase}" \
    --arg ts "${ts}" \
    '.current_phase = $phase |
     .phases[$phase].status = "failed" |
     .overall_status = "failed" |
     .updated_at = $ts' \
    "${task_file}" > "${tmp}" && mv "${tmp}" "${task_file}"

  tmp="$(mktemp)"
  jq \
    --arg phase "${phase}" \
    --arg cmd "${failed_command}" \
    --arg ts "${ts}" \
    --argjson exit_code "${exit_code}" \
    '.last_error = {phase: $phase, exit_code: $exit_code, failed_command: $cmd, at: $ts} |
     .updated_at = $ts' \
    "${run_file}" > "${tmp}" && mv "${tmp}" "${run_file}"
}

fail_phase_and_exit() {
  log_error "$4"
  mark_phase_failed "$1" "$2" "$3" "$4"
  exit "$3"
}
