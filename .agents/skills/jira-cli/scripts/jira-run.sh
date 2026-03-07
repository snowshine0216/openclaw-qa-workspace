#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=./lib/jira-env.sh
source "$SCRIPT_DIR/lib/jira-env.sh"

load_jira_env
exec jira "$@"
