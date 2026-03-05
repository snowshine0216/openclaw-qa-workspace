---
description: Deprecated legacy entrypoint. Use workspace-root canonical workflow.
---

# Deprecated: Project-local planner-spec-generation-healing

This project-local workflow is removed from active execution as of March 3, 2026.

Use canonical workflow instead:

1. `workspace-tester/.agents/workflows/planner-spec-generation-healing.md`
2. Runtime scripts: `workspace-tester/src/tester-flow/run_*.sh`

If you reached this file through an old command path, migrate the caller to workspace-root `.agents` discovery.
