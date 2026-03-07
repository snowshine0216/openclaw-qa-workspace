#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# Save SCRIPT_DIR before sourcing (jira-rest.sh will overwrite it)
_PLAYGROUND_SCRIPT_DIR="$SCRIPT_DIR"

# shellcheck source=./lib/jira-rest.sh
source "$_PLAYGROUND_SCRIPT_DIR/lib/jira-rest.sh"
# shellcheck source=./lib/jira-description-merge.sh
source "$_PLAYGROUND_SCRIPT_DIR/lib/jira-description-merge.sh"

issue_key=''
description_file=''
comment_file=''
update_description=0
add_comment=0
overwrite=0
post=0

usage() {
  cat >&2 <<'USAGE'
Usage: jira-publish-playground.sh --issue KEY [options]
  --description-file FILE   ADF document JSON for the issue description
  --comment-file FILE       Comment payload JSON with body.doc content
  --update-description      Update issue description (default: merge with existing)
  --overwrite               Replace description entirely (skip merge)
  --add-comment             POST comment payload to Jira
  --post                    Execute live Jira writes; otherwise preview only

By default, --update-description will MERGE new content with existing description.
Use --overwrite to replace the description entirely (destructive).
USAGE
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue)
      issue_key=${2:-}
      shift 2
      ;;
    --description-file)
      description_file=${2:-}
      shift 2
      ;;
    --comment-file)
      comment_file=${2:-}
      shift 2
      ;;
    --update-description)
      update_description=1
      shift
      ;;
    --overwrite)
      overwrite=1
      shift
      ;;
    --add-comment)
      add_comment=1
      shift
      ;;
    --post)
      post=1
      shift
      ;;
    *)
      usage
      ;;
  esac
done

[[ -n "$issue_key" ]] || usage
[[ $update_description -eq 1 || $add_comment -eq 1 ]] || usage

if [[ $update_description -eq 1 ]]; then
  [[ -f "$description_file" ]] || {
    echo 'description file is required for --update-description' >&2
    exit 1
  }
fi

if [[ $add_comment -eq 1 ]]; then
  [[ -f "$comment_file" ]] || {
    echo 'comment file is required for --add-comment' >&2
    exit 1
  }
fi

if [[ $post -ne 1 ]]; then
  echo "Preview only for ${issue_key}. Add --post to write to Jira."
  if [[ $update_description -eq 1 ]]; then
    if [[ $overwrite -eq 1 ]]; then
      echo "[Mode: OVERWRITE - will replace existing description]"
      jq '{fields: {description: .}}' "$description_file"
    else
      echo "[Mode: MERGE - will append to existing description]"
      echo "Fetching existing description..."
      existing_desc=$(fetch_existing_description "$issue_key" 2>/dev/null || echo '{"version":1,"type":"doc","content":[]}')
      new_desc=$(cat "$description_file")
      merged_desc=$(merge_adf_documents "$existing_desc" "$new_desc")
      jq '{fields: {description: .}}' <<< "$merged_desc"
    fi
  fi
  [[ $add_comment -eq 1 ]] && jq '.' "$comment_file"
  exit 0
fi

jira_require_runtime

if [[ $update_description -eq 1 ]]; then
  if [[ $overwrite -eq 1 ]]; then
    # Overwrite mode: replace description entirely
    echo "Overwriting description for ${issue_key}..."
    description_payload=$(mktemp)
    jq '{fields: {description: .}}' "$description_file" > "$description_payload"
    jira_curl_json PUT "$(jira_api_base)/issue/${issue_key}" "$description_payload" >/dev/null
    rm -f "$description_payload"
  else
    # Merge mode (default): fetch existing + merge + post
    echo "Merging description for ${issue_key}..."
    existing_desc=$(fetch_existing_description "$issue_key")
    new_desc=$(cat "$description_file")
    
    # Validate both documents
    validate_adf_structure "$existing_desc" || {
      echo "Warning: Existing description has invalid ADF structure, falling back to overwrite" >&2
      overwrite=1
    }
    validate_adf_structure "$new_desc" || {
      echo "Error: New description file has invalid ADF structure" >&2
      exit 1
    }
    
    if [[ $overwrite -eq 0 ]]; then
      merged_desc=$(merge_adf_documents "$existing_desc" "$new_desc")
      description_payload=$(mktemp)
      jq '{fields: {description: .}}' <<< "$merged_desc" > "$description_payload"
      jira_curl_json PUT "$(jira_api_base)/issue/${issue_key}" "$description_payload" >/dev/null
      rm -f "$description_payload"
    else
      # Fallback to overwrite if validation failed
      description_payload=$(mktemp)
      jq '{fields: {description: .}}' "$description_file" > "$description_payload"
      jira_curl_json PUT "$(jira_api_base)/issue/${issue_key}" "$description_payload" >/dev/null
      rm -f "$description_payload"
    fi
  fi
fi

if [[ $add_comment -eq 1 ]]; then
  jira_curl_json POST "$(jira_api_base)/issue/${issue_key}/comment" "$comment_file" >/dev/null
fi

echo "Published Jira playground actions for ${issue_key}."
