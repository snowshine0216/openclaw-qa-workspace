# Migration Scripts

## migrate_to_artifact_root.mjs

Migrates legacy runs and benchmark runtime state to the artifact root convention.

### What it migrates

**Skill runs:**
- `qa-plan-evolution`: `.agents/skills/qa-plan-evolution/runs/*` → `workspace-artifacts/skills/shared/qa-plan-evolution/runs/*`
- `qa-plan-orchestrator`: `workspace-planner/skills/qa-plan-orchestrator/runs/*` → `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/runs/*`
- `defects-analysis`: `workspace-reporter/skills/defects-analysis/runs/*` → `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/*`

**Benchmark iterations:**
- `qa-plan-v1`: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v1/iteration-*` → `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v1/iteration-*`
- `qa-plan-v2`: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-*` → `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-*`

### Features

- **Atomic migration**: Per-run/per-benchmark locking prevents concurrent access
- **Smart filesystem handling**: Uses `rename` for same-filesystem moves, copy+delete for cross-filesystem
- **Idempotent**: Safe to run multiple times, skips already-migrated artifacts
- **Fail-fast**: Errors on conflicts or active runs (lock file present or recent mtime < 5 minutes)
- **Staging protection**: Incomplete copies are cleaned up on failure

### Usage

```bash
# Run from repository root
node scripts/migrate_to_artifact_root.mjs
```

### Safety checks

The script will fail if:
- Destination already exists (prevents overwriting)
- Run has a `.lock` file (indicates active use)
- Run was modified within the last 5 minutes (indicates recent activity)
- Lock acquisition fails (prevents concurrent migration)

### Exit codes

- `0`: Success (all migrations completed or already done)
- `1`: Failure (one or more migrations failed)

### Example output

```
🚀 Starting migration to artifact root...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Processing: qa-plan-evolution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Migrating 4 run(s) for qa-plan-evolution...
  🔄 phase0-pack-general: moving (same filesystem)
  ✅ phase0-pack-general: moved successfully
  🔄 phase0-regenerate: moving (same filesystem)
  ✅ phase0-regenerate: moved successfully
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Migration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Moved: 12
⏭️  Skipped: 0
❌ Failed: 0

✨ Migration completed successfully!
```
