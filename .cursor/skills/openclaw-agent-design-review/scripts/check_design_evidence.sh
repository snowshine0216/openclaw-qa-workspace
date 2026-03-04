#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <design-markdown-file>" >&2
  exit 2
fi

design_file="$1"

if [ ! -f "$design_file" ]; then
  echo "ERROR: design file not found: $design_file" >&2
  exit 2
fi

failures=0

check_required_pattern() {
  local pattern="$1"
  local message="$2"
  if rg -qi "$pattern" "$design_file"; then
    echo "OK: $message"
  else
    echo "FAIL: $message"
    failures=$((failures + 1))
  fi
}

design_has_scripts_or_workflows=false
if rg -qi "scripts/|\\.agents/workflows/|workflow" "$design_file"; then
  design_has_scripts_or_workflows=true
fi

if [ "$design_has_scripts_or_workflows" = true ]; then
  check_required_pattern "test|tests|spec|coverage|smoke|validation" \
    "test/smoke evidence is present for script/workflow changes"
else
  echo "INFO: no explicit script/workflow references detected; skipping test evidence gate"
fi

check_required_pattern "User Interaction:" \
  "user interaction section is present"
check_required_pattern "Done:[[:space:]]+" \
  "Done status is present in user interaction details"
check_required_pattern "Blocked:[[:space:]]+" \
  "Blocked status is present in user interaction details"
check_required_pattern "Questions:[[:space:]]+" \
  "Questions section is present in user interaction details"
check_required_pattern "never assume|if .*ambiguous.*ask|if .*unclear.*ask|raise questions" \
  "design explicitly avoids silent assumptions and asks user when uncertain"
check_required_pattern "Send Feishu notification|feishu" \
  "final Feishu notification step is present"
check_required_pattern "notification_pending" \
  "notification fallback persistence is present"
check_required_pattern "jq -r '.notification_pending // empty' memory/tester-flow/runs/<work_item_key>/run.json" \
  "notification fallback verification command is present"

check_required_pattern "docs|documentation|AGENTS\\.md" \
  "documentation impact is explicitly described"
check_required_pattern "README\\.md|README" \
  "README impact is explicitly mentioned"
check_required_pattern "user-facing.*README|README.*user-facing" \
  "user-facing README mention is explicit"

echo "Failures: $failures"
if [ "$failures" -gt 0 ]; then
  exit 1
fi
