#!/bin/bash
# deploy_runtime_context_tools.sh — Copy workflow helper scripts into the project runtime directory
set -euo pipefail

RUNTIME_DIR="${1:?Usage: deploy_runtime_context_tools.sh <runtime-script-dir>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$RUNTIME_DIR"

for tool in save_context.sh validate_context.sh validate_testcase_structure.sh validate_testcase_structure.mjs testCaseRules.mjs validate_testcase_executability.sh; do
  cp "$SCRIPT_DIR/$tool" "$RUNTIME_DIR/$tool"
  case "$tool" in
    *.sh) chmod +x "$RUNTIME_DIR/$tool" ;;
  esac
  echo "DEPLOYED: $tool -> $RUNTIME_DIR/$tool"
done
