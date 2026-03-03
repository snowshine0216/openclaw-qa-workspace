#!/usr/bin/env bash

set -euo pipefail

echo "Deprecated script: projects/library-automation/.agents/scripts/write_run_state.sh" >&2
echo "Canonical state runtime moved to workspace-tester/src/tester-flow/runner.mjs (phase commands)." >&2
echo "Use workspace-root canonical workflow under workspace-tester/.agents/workflows/." >&2
exit 2
