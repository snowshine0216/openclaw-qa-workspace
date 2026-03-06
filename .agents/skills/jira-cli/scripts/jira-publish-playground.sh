#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=./lib/jira-rest.sh
source "$SCRIPT_DIR/lib/jira-rest.sh"

issue_key=''
description_file=''
comment_file=''
update_description=0
add_comment=0
post=0

usage() {
  cat >&2 <<'USAGE'
Usage: jira-publish-playground.sh --issue KEY [options]
  --description-file FILE   ADF document JSON for the issue description
  --comment-file FILE       Comment payload JSON with body.doc content
  --update-description      PUT description payload to Jira
  --add-comment             POST comment payload to Jira
  --post                    Execute live Jira writes; otherwise preview only
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
  [[ $update_description -eq 1 ]] && jq '{fields: {description: .}}' "$description_file"
  [[ $add_comment -eq 1 ]] && jq '.' "$comment_file"
  exit 0
fi

jira_require_runtime

if [[ $update_description -eq 1 ]]; then
  description_payload=$(mktemp)
  jq '{fields: {description: .}}' "$description_file" > "$description_payload"
  jira_curl_json PUT "$(jira_api_base)/issue/${issue_key}" "$description_payload" >/dev/null
  rm -f "$description_payload"
fi

if [[ $add_comment -eq 1 ]]; then
  jira_curl_json POST "$(jira_api_base)/issue/${issue_key}/comment" "$comment_file" >/dev/null
fi

echo "Published Jira playground actions for ${issue_key}."
