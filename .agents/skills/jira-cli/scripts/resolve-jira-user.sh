#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=./lib/jira-user-lookup.sh
source "$SCRIPT_DIR/lib/jira-user-lookup.sh"

query=${1:-}
if [[ -z "$query" ]]; then
  echo 'Usage: resolve-jira-user.sh <email-or-display-name-or-accountId>' >&2
  exit 1
fi

jira_resolve_user_query "$query"
