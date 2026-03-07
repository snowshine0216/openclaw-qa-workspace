#!/usr/bin/env bash

jira_warn() {
  echo "Warning: $*" >&2
}

jira_has_project_scope() {
  local jql=$1
  grep -Eiq '(^|[^[:alnum:]_])project[[:space:]]*(=|!=|in[[:space:]]*\(|not[[:space:]]+in[[:space:]]*\(|is([[:space:]]+not)?)' <<<"$jql"
}

jira_extract_project_keys() {
  awk '
    NR > 1 {
      for (i = 1; i <= NF; i++) {
        if ($i ~ /^[A-Z][A-Z0-9_]+$/ && $i != "KEY" && $i != "NAME" && $i != "TYPE" && $i != "LEAD" && $i != "URL") {
          print $i
        }
      }
    }
  ' | awk '!seen[$0]++'
}

jira_join_keys() {
  awk 'BEGIN { ORS = "" } { if (NR > 1) printf ", "; printf $0 } END { print "" }'
}

jira_wrap_jql() {
  local jql=$1
  local keys=$2
  printf 'project in (%s) AND (%s)\n' "$keys" "$jql"
}
