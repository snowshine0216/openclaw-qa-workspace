#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for test_file in \
  common.test.sh \
  state.test.sh \
  phase0-check-resume.test.sh \
  phase1-fetch-owners.test.sh \
  phase2-fetch-issues.test.sh \
  phase4-publish-to-jira.test.sh \
  phase5-finalize.test.sh \
  run.test.sh
do
  bash "${SCRIPT_DIR}/${test_file}"
done

node --test "${SCRIPT_DIR}/generate-rcas-via-agent.test.js"
