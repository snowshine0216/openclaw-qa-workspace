#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"

HELP_OUTPUT=$(bash "${ROOT}/run.sh" --help 2>&1)
printf '%s\n' "${HELP_OUTPUT}" | grep -q '^Usage:' || { echo "FAIL: help should print usage" >&2; exit 1; }
[[ ! -d "${TMP_DIR}/runs/--help" ]] || { echo "FAIL: help created a run dir" >&2; exit 1; }

set +e
INVALID_OUTPUT=$(bash "${ROOT}/run.sh" --bogus 2>&1)
STATUS=$?
set -e
[[ "${STATUS}" -eq 1 ]] || { echo "FAIL: invalid option should exit 1" >&2; exit 1; }
printf '%s\n' "${INVALID_OUTPUT}" | grep -q 'Unknown option:' || { echo "FAIL: invalid option should print error" >&2; exit 1; }
[[ ! -d "${TMP_DIR}/runs/--bogus" ]] || { echo "FAIL: invalid option created a run dir" >&2; exit 1; }

printf 'PASS: run entrypoint help and option handling\n'
