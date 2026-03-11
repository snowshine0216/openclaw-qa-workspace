# RCA Orchestrator

Date-scoped RCA automation for `workspace-daily`.

## Usage

```bash
bash workspace-daily/skills/rca-orchestrator/scripts/run.sh [YYYY-MM-DD] [refresh_mode]
```

### Arguments

- `YYYY-MM-DD`: optional run date; defaults to the current date in `Asia/Shanghai`
- `refresh_mode`: optional; one of `smart_refresh`, `full_regenerate`, or `fresh`

### Examples

```bash
# Resume today if incomplete, or stop if already finalized
bash workspace-daily/skills/rca-orchestrator/scripts/run.sh

# Rebuild a specific day while archiving the previous outputs
bash workspace-daily/skills/rca-orchestrator/scripts/run.sh 2026-03-10 full_regenerate

# Rebuild a specific day without archiving
bash workspace-daily/skills/rca-orchestrator/scripts/run.sh 2026-03-10 fresh
```

## Runtime Requirements

- `curl`
- `jq`
- `node`
- `gh`
- Jira CLI credentials available through the shared `jira-cli` skill env loader
- Feishu chat ID present in `workspace-daily/TOOLS.md`
- A spawn bridge module configured through `RCA_ORCHESTRATOR_SPAWN_BRIDGE` or passed to `generate-rcas-via-agent.js`

## Manager Mapping

Every Jira comment posted in Phase 4 tags the manager(s) so they are notified. The mapping is defined in `config/owner-manager-mapping.json`.

**Path:** `workspace-daily/skills/rca-orchestrator/config/owner-manager-mapping.json`

**Structure:**

```json
{
  "managers": ["Lingping, Zhu"]
}
```

**How to change:**

1. Edit the JSON file.
2. Add or remove entries in the `managers` array.
3. Use Jira display names in "Last, First" format (e.g. `"Lingping, Zhu"`) or email addresses (e.g. `"lingping.zhu@microstrategy.com"`).
4. To tag multiple managers: `["Lingping, Zhu", "Other, Manager"]`.

Names are resolved via `resolve-jira-user.sh` from the jira-cli skill. Use email for reliability if display names do not match Jira.

**Override at runtime:** Set `RCA_ORCHESTRATOR_OWNER_MANAGER_MAPPING` to a different JSON file path.

## Spawn Bridge Usage

Phase 3 uses `scripts/lib/generate-rcas-via-agent.js`, which is manifest-driven and runtime-injected.
The helper is intentionally isolated from undocumented OpenClaw spawn APIs.

Example direct invocation:

```bash
RCA_ORCHESTRATOR_SPAWN_BRIDGE=/abs/path/to/bridge.js \
node workspace-daily/skills/rca-orchestrator/scripts/lib/generate-rcas-via-agent.js \
  --manifest workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-10/manifest-gen.json \
  --output workspace-daily/skills/rca-orchestrator/scripts/runs/2026-03-10/spawn-results.json
```

The bridge module must export `spawnBatch(requests, context)` and return one result per request.

## Outputs

- RCAs: `scripts/runs/<date>/output/rca/*.md`
- Jira ADF payloads: `scripts/runs/<date>/output/adf/*.json`
- Jira comment payloads: `scripts/runs/<date>/output/comments/*.json`
- Daily summary: `scripts/runs/<date>/output/summary/daily-summary.md`

## Tests

Tests live under `workspace-daily/skills/rca-orchestrator/scripts/test/`.
