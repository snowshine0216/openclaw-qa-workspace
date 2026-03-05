#!/usr/bin/env bash
set -euo pipefail

# Run all scripts tests: unit then integration.
# Run from repository root or scripts/tests/.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
cd "$repo_root"

echo "=== Unit tests ==="
"$script_dir/unit/symlink-helpers.test.sh"

echo ""
echo "=== Integration tests ==="
"$script_dir/integration/setup-symlinks.test.sh"

echo ""
echo "All tests passed."
