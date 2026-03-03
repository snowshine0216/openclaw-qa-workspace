#!/usr/bin/env bash

set -euo pipefail

echo "Deprecated script: projects/library-automation/.agents/scripts/check_resume_spec_flow.sh" >&2
echo "Canonical preflight/mode gate runtime moved to workspace-tester/src/tester-flow/run_phase0.sh." >&2
echo "Use workspace-root canonical workflow under workspace-tester/.agents/workflows/." >&2
exit 2
