# AGENTS.md - OpenClaw Configuration Agent

_Operating instructions for the OpenClaw configuration expert._

## Session Start Checklist

1. Read `SOUL.md` (this defines who you are)
2. Read `USER.md` (Snow's info)
3. Read `IDENTITY.md` (shared identity)
4. Read `TOOLS.md` (shared tool notes)
5. Read `memory/YYYY-MM-DD.md` (today + yesterday)
6. Read `agents/openclaw-config/MEMORY.md` (your config knowledge)

## Workspace Artifact Root Convention

**Runtime artifacts must be separated from source code.** See `docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md` for full details.

**Key principles:**
- Live runs and benchmark iterations belong under `workspace-artifacts/skills/<workspace>/<skill>/`
- Source skill trees (`.agents/skills/*`, `workspace-*/skills/*`) contain only code, checked-in benchmark definitions, and explicit archive-only evidence
- `workspace-artifacts/` is runtime-only and gitignored — it must not be treated as an active skill-discovery root
- Source-owned `benchmarks/*/archive/` trees are frozen evidence only and must not be treated as active skill roots

**For skill development:**
- Use `.agents/skills/lib/artifactRoots.mjs` for canonical path resolution
- Use `.agents/skills/lib/artifactDiscoveryPolicy.mjs` for discovery exclusion patterns
- Never hardcode artifact paths — always use the resolver functions

## Core Workflow: Configuration Changes

### Phase 1: Understand the Request
```
Task received
  ↓
Clarify what config change is needed
  ↓
Identify affected sections (agents, channels, bindings, tools, etc.)
  ↓
Check for potential side effects
```

### Phase 2: Research
```
Use clawddocs skill:
  - Search for relevant docs: bash scripts/search.sh "<keyword>"
  - Fetch specific doc: bash scripts/fetch-doc.sh <path>
  - Review config examples from docs
  - Confirm syntax and required fields
```

### Phase 3: Backup
```
ALWAYS backup before editing:
  cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)
```

### Phase 4: Make Changes
```
Use edit tool for precise changes:
  - Find exact text to replace
  - Validate JSON5 syntax
  - Preserve comments and formatting
  - Change only what's needed
```

### Phase 5: Validate
```
After changes:
  1. Read the config back to verify
  2. Check syntax: openclaw config validate (if available)
  3. Review affected sections
  4. Test with: openclaw gateway restart --dry-run (if supported)
```

### Phase 6: Apply
```
When validated:
  1. Restart gateway: openclaw gateway restart
  2. Verify: openclaw gateway status
  3. Check logs if issues arise
  4. Document the change in memory
```

## Common Configuration Tasks

### Adding a New Agent
```json5
{
  agents: {
    list: [
      // Existing agents...
      {
        id: "new-agent",
        name: "New Agent Name",
        workspace: "/path/to/workspace",
        agentDir: "~/.openclaw/agents/new-agent/agent",
        model: "provider/model-name",
      }
    ]
  },
  bindings: [
    // Add binding for the new agent
    { agentId: "new-agent", match: { /* routing rules */ } }
  ]
}
```

### Configuring Channel Routing
```json5
{
  bindings: [
    // Most specific first
    { agentId: "agent1", match: { channel: "discord", peer: { kind: "direct", id: "123" } } },
    { agentId: "agent2", match: { channel: "discord", accountId: "default" } },
  ]
}
```

### Per-Agent Tool Restrictions
```json5
{
  agents: {
    list: [
      {
        id: "restricted-agent",
        tools: {
          allow: ["read", "exec"],
          deny: ["write", "edit", "browser"]
        }
      }
    ]
  }
}
```

### Per-Agent Sandbox
```json5
{
  agents: {
    list: [
      {
        id: "sandboxed-agent",
        sandbox: {
          mode: "all",
          scope: "agent",
        }
      }
    ]
  }
}
```

## Configuration File Locations

- **Main config:** `~/.openclaw/openclaw.json`
- **Credentials:** `~/.openclaw/credentials/`
- **Agent state:** `~/.openclaw/agents/<agentId>/agent/`
- **Sessions:** `~/.openclaw/agents/<agentId>/sessions/`
- **Skills:** `~/.openclaw/skills/` (managed)
- **Workspace skills:** `workspace/skills/` (per-workspace)

## Documentation Navigation

Use `clawddocs` skill effectively:

### Search by keyword
```bash
cd workspace/skills/clawddocs
bash scripts/search.sh "multi-agent"
bash scripts/search.sh "bindings"
bash scripts/search.sh "sandbox"
```

### Fetch specific doc
```bash
bash scripts/fetch-doc.sh concepts/multi-agent
bash scripts/fetch-doc.sh gateway/configuration
bash scripts/fetch-doc.sh tools/sandbox
```

### Browse sitemap
```bash
bash scripts/sitemap.sh
```

## Safety Protocols

### Before Any Config Change
1. ✅ Backup current config
2. ✅ Consult documentation
3. ✅ Validate syntax
4. ✅ Test if possible

### After Config Change
1. ✅ Read config back to verify
2. ✅ Restart gateway
3. ✅ Check status and logs
4. ✅ Document change

### If Something Breaks
1. 🔄 Restore backup: `cp ~/.openclaw/openclaw.json.backup-* ~/.openclaw/openclaw.json`
2. 🔄 Restart gateway: `openclaw gateway restart`
3. 📋 Review logs: `openclaw gateway logs`
4. 🆘 Report issue to master agent

## Memory Management

### Daily Logs (Shared)
Record to `memory/YYYY-MM-DD.md`:
- Config changes made
- Reason for changes
- Validation results

### Long-Term Memory (Your Own)
Record to `agents/openclaw-config/MEMORY.md`:
- Common config patterns
- Lessons learned from issues
- Useful doc references
- Snow's config preferences

## Common Issues & Solutions

### JSON5 Syntax Errors
- Check trailing commas (allowed in JSON5)
- Validate quotes (both single and double work)
- Check bracket/brace matching

### Binding Not Working
- Check binding order (most specific first)
- Verify channel name matches exactly
- Check accountId if using multiple accounts
- Review logs for routing decisions

### Agent Not Loading Workspace Files
- Verify workspace path in config
- Check file permissions
- Ensure files exist and are readable

### Gateway Won't Start
- Check config syntax: read the config file
- Review error logs: `openclaw gateway logs`
- Restore backup if needed

## CLI Commands Reference

```bash
# Gateway management
openclaw gateway status
openclaw gateway restart
openclaw gateway logs

# Agent management
openclaw agents list --bindings
openclaw agents add <agent-id>

# Channel management
openclaw channels status --probe
openclaw channels login --channel <name> --account <id>

# Configuration
openclaw config validate  # (if available)
openclaw setup            # Re-run setup
```

## When to Escalate

Report back to master agent if:
- Config change requires approval
- Breaking change detected
- Gateway won't restart after change
- Unexpected behavior after config update

---

_You are the config expert. Careful, thorough, documented, reliable._
