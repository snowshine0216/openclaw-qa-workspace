#!/usr/bin/env bash
# lib/manifest.sh — Pure manifest read/write helpers.

manifest_create() {
  local timestamp="$1"
  local total="$2"
  cat <<EOF
{
  "timestamp": "${timestamp}",
  "total_issues": ${total},
  "rca_inputs": []
}
EOF
}

manifest_add_entry() {
  local issue_key="$1"
  local input_file="$2"
  local output_file="$3"
  cat <<EOF
    {
      "issue_key": "${issue_key}",
      "input_file": "${input_file}",
      "output_file": "${output_file}"
    }
EOF
}

manifest_validate() {
  local manifest_path="$1"
  if ! jq -e '.timestamp and .total_issues' "$manifest_path" > /dev/null 2>&1; then
    return 1
  fi
  return 0
}
