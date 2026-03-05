#!/usr/bin/env bash
set -euo pipefail

design_file=""
scripts_dir=""
run_json_path="memory/tester-flow/runs/<work_item_key>/run.json"

while [[ $# -gt 0 ]]; do
  case $1 in
    --scripts-dir)
      scripts_dir="$2"
      shift 2
      ;;
    --run-json-path)
      run_json_path="$2"
      shift 2
      ;;
    *)
      if [[ -z "$design_file" ]]; then
        design_file="$1"
        shift
      else
        echo "Unknown argument: $1" >&2
        exit 2
      fi
      ;;
  esac
done

if [[ -z "$design_file" ]]; then
  echo "Usage: $0 <design-markdown-file> [--scripts-dir <dir>] [--run-json-path <path>]" >&2
  exit 2
fi

if [[ ! -f "$design_file" ]]; then
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

if [[ "$design_has_scripts_or_workflows" == "true" ]]; then
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

# Dynamically construct the validation pattern to handle flexible paths
escaped_run_json_path=$(echo "$run_json_path" | sed 's/\./\\./g' | sed 's/\//\\\//g')
check_required_pattern "jq -r '\\.notification_pending // empty' $escaped_run_json_path" \
  "notification fallback verification command is present"

check_required_pattern "docs|documentation|AGENTS\\.md" \
  "documentation impact is explicitly described"
check_required_pattern "README\\.md|README" \
  "README impact is explicitly mentioned"
check_required_pattern "user-facing.*README|README.*user-facing" \
  "user-facing README mention is explicit"

if [[ -n "$scripts_dir" && -d "$scripts_dir" ]]; then
  echo "INFO: Running SHELL script checks in $scripts_dir"
  if rg -q "sessions_spawn" "$scripts_dir"; then
    echo "FAIL (SHELL-001): sessions_spawn found in scripts directory"
    failures=$((failures + 1))
  fi
  # Function size check
  long_funcs=$(find "$scripts_dir" -type f -name "*.sh" -exec awk '
    /^[a-zA-Z_0-9]+ *\(\) *\{/ { in_func=1; count=0; name=$1; next }
    in_func && /^\}/ { if (count > 20) print name " (" count " lines)"; in_func=0; next }
    in_func { count++ }
  ' {} +)
  if [[ -n "$long_funcs" ]]; then
    echo "FAIL (SHELL-002): Functions exceeding 20 lines found:"
    echo "$long_funcs"
    failures=$((failures + 1))
  fi
  # Test stubs check
  if [[ ! -d "$scripts_dir/test" ]] || [[ -z $(find "$scripts_dir/test" -type f -name "*.test.sh" -o -name "*.test.js") ]]; then
    echo "FAIL (SHELL-005): Missing test stubs in $scripts_dir/test"
    failures=$((failures + 1))
  fi
fi

echo "Failures: $failures"
if [[ "$failures" -gt 0 ]]; then
  exit 1
fi
