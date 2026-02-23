# Multi-Agent Setup Guide

Complete setup instructions for the 6-agent QA workflow.

## ✅ What's Been Created

### Workspace Structure
```
workspace/
├── WORKSPACE_RULES.md          ✅ File organization rules
├── openclaw-config-draft.json5 ✅ OpenClaw configuration (draft)
├── projects/                   ✅ Created folders
│   ├── test-reports/
│   ├── test-plans/
│   ├── jira-exports/
│   ├── ci-reports/
│   └── screenshots/
├── scripts/                    ✅ Created
└── agents/                     ✅ Created all 6 agent folders
    ├── master/
    │   ├── SOUL.md             ✅ Personality
    │   ├── AGENTS.md           ✅ Operating instructions
    │   └── MEMORY.md           ✅ Long-term memory
    ├── openclaw-config/
    │   ├── SOUL.md             ✅
    │   ├── AGENTS.md           ✅
    │   └── MEMORY.md           ✅
    ├── qa-daily/
    │   ├── SOUL.md             ✅
    │   ├── AGENTS.md           ✅
    │   ├── HEARTBEAT.md        ✅ Proactive checks
    │   └── MEMORY.md           ✅
    ├── qa-plan/
    │   ├── SOUL.md             ✅
    │   ├── AGENTS.md           ✅
    │   └── MEMORY.md           ✅
    ├── qa-test/
    │   ├── SOUL.md             ✅
    │   ├── AGENTS.md           ✅
    │   └── MEMORY.md           ✅
    └── qa-report/
        ├── SOUL.md             ✅
        ├── AGENTS.md           ✅
        └── MEMORY.md           ✅
```

---

## 🚀 Next Steps

### Step 1: Review Configuration

1. **Open and review the draft config:**
   ```bash
   cat workspace/openclaw-config-draft.json5
   ```

2. **Verify paths and settings:**
   - Workspace path: `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace`
   - Agent models: Sonnet 4.5, Opus 4.5, Opus 4.6, GPT-5.1 Codex Max
   - Default agent: `master`

3. **Add your channel configuration** (Discord, Telegram, etc.)

### Step 2: Install Configuration

**⚠️ IMPORTANT: Backup your current config first!**

```bash
# Backup current config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)

# Copy draft config to OpenClaw config location
cp workspace/openclaw-config-draft.json5 ~/.openclaw/openclaw.json
```

### Step 3: Create Agent State Directories

```bash
# Create agent state directories
mkdir -p ~/.openclaw/agents/{master,openclaw-config,qa-daily,qa-plan,qa-test,qa-report}/agent
mkdir -p ~/.openclaw/agents/{master,openclaw-config,qa-daily,qa-plan,qa-test,qa-report}/sessions
```

### Step 4: Verify Setup

```bash
# Verify configuration syntax
openclaw config validate  # (if command exists)

# List agents
openclaw agents list --bindings

# Expected output:
# Agents:
#   ✓ master (default)
#   ✓ openclaw-config
#   ✓ qa-daily
#   ✓ qa-plan
#   ✓ qa-test
#   ✓ qa-report
```

### Step 5: Restart Gateway

```bash
# Restart OpenClaw gateway
openclaw gateway restart

# Check status
openclaw gateway status

# Check logs if issues
openclaw gateway logs
```

### Step 6: Test Agent Communication

**Test 1: Talk to Master Agent**
```
Send a message to your configured channel (Discord/Telegram/etc.)
"Hello, master agent. Can you see this message?"

Expected: Master agent responds
```

**Test 2: Spawn a Sub-Agent**
```
"Master, spawn the openclaw-config agent and ask it to list available documentation categories."

Expected: Master spawns openclaw-config, which uses clawddocs skill
```

**Test 3: Check Agent Routing**
```bash
# Verify which agent is active in a session
openclaw agents list --bindings

# Check session logs
openclaw gateway logs | grep "agent:"
```

---

## 📋 Configuration Summary

### Agents Overview

| Agent ID | Name | Model | Role | Files |
|----------|------|-------|------|-------|
| `master` | Atlas Master | Sonnet 4.5 | Task delegation | SOUL, AGENTS, MEMORY |
| `openclaw-config` | Atlas Config Expert | Opus 4.6 | OpenClaw config | SOUL, AGENTS, MEMORY |
| `qa-daily` | Atlas Daily | Sonnet 4.5 | Daily checks | SOUL, AGENTS, HEARTBEAT, MEMORY |
| `qa-plan` | Atlas Planner | Opus 4.5 | Test planning | SOUL, AGENTS, MEMORY |
| `qa-test` | Atlas Tester | GPT-5.1 Codex Max | Test execution | SOUL, AGENTS, MEMORY |
| `qa-report` | Atlas Reporter | Sonnet 4.5 | Reporting & Jira | SOUL, AGENTS, MEMORY |

### Shared Files (All Agents)
- `IDENTITY.md` - Shared identity (Atlas QA Lead)
- `USER.md` - Snow's info and preferences
- `TOOLS.md` - Shared tool notes
- `memory/YYYY-MM-DD.md` - Daily memory logs (shared)

### Per-Agent Files
- `agents/<id>/SOUL.md` - Personality and vibe
- `agents/<id>/AGENTS.md` - Operating instructions
- `agents/<id>/MEMORY.md` - Long-term memory (per-agent)
- `agents/qa-daily/HEARTBEAT.md` - Proactive checks (qa-daily only)

### Routing Strategy
- **All messages → master agent** (default)
- **Master delegates** via `sessions_spawn` to specialized agents
- **Agent-to-agent** communication enabled

---

## 🔧 Optional Configuration

### 1. Setup Daily Cron Job (qa-daily agent)

**To be configured later** - daily checks at 09:00 Asia/Shanghai

```bash
# Example cron entry (placeholder)
# 0 9 * * * /path/to/openclaw message --agent qa-daily --task "Run daily checks"
```

### 2. Configure Channel Routing

If you want to access agents directly via different channels:

```json5
bindings: [
  // Direct access to specific agents (optional)
  { agentId: "qa-daily", match: { channel: "telegram", accountId: "daily-bot" } },
  { agentId: "openclaw-config", match: { channel: "discord", peer: { kind: "direct", id: "YOUR_USER_ID" } } },
  
  // Default: master handles everything else
  { agentId: "master", match: { channel: "*" } },
]
```

### 3. Add Tool Restrictions (Enhanced Security)

Already configured per-agent in the draft config. Review and adjust as needed.

---

## 🧪 Testing Workflow

### Test Scenario: Full QA Workflow

**Request to Master:**
```
"Master, I need to test issue BCIN-1234 (login improvements). 
Please coordinate with qa-plan to create a test plan, 
then qa-test to execute it, 
and qa-report to file any bugs to Jira."
```

**Expected Flow:**
1. Master acknowledges and repeats requirements
2. Master spawns `qa-plan` with issue BCIN-1234
3. qa-plan fetches Jira issue details
4. qa-plan creates test plan → `projects/test-plans/BCIN-1234/test-plan.md`
5. qa-plan reports completion to master
6. Master spawns `qa-test` with test plan reference
7. qa-test executes test cases
8. qa-test captures screenshots → `projects/screenshots/BCIN-1234/`
9. qa-test creates execution report → `projects/test-reports/BCIN-1234/execution-report.md`
10. qa-test reports completion to master
11. Master spawns `qa-report` with execution results
12. qa-report creates bug reports for failures
13. qa-report files bugs to Jira (e.g., BCIN-1235, BCIN-1236)
14. qa-report creates summary report → `projects/test-reports/BCIN-1234/summary-report.md`
15. qa-report updates Jira issue BCIN-1234 status
16. qa-report reports completion to master
17. Master reports final summary to Snow

---

## 🐛 Troubleshooting

### Agent Not Loading Correct SOUL.md

**Issue:** Agent responds with wrong personality

**Fix:**
```bash
# Verify systemPromptOverride paths in config
cat ~/.openclaw/openclaw.json | grep -A 3 "systemPromptOverride"

# Verify files exist
ls -la workspace/agents/master/SOUL.md
ls -la workspace/agents/openclaw-config/SOUL.md
# etc.
```

### Agent Can't Find Files in projects/

**Issue:** "File not found" errors

**Fix:**
```bash
# Verify workspace path in config
cat ~/.openclaw/openclaw.json | grep "workspace"

# Verify folders exist
ls -la workspace/projects/
```

### Bindings Not Working

**Issue:** Wrong agent responding

**Fix:**
```bash
# Check binding order (most specific first)
openclaw agents list --bindings

# Verify routing in logs
openclaw gateway logs | grep "routing"
```

### Sessions_Spawn Fails

**Issue:** "Agent not found" or permission denied

**Fix:**
```bash
# Verify agent-to-agent communication enabled
cat ~/.openclaw/openclaw.json | grep -A 3 "agentToAgent"

# Verify agent IDs match
openclaw agents list
```

---

## 📚 Documentation References

- **Multi-Agent Setup:** `/concepts/multi-agent.md`
- **Agent Workspace:** `/concepts/agent-workspace.md`
- **Configuration:** `/gateway/configuration`
- **Bindings:** `/channels/channel-routing`
- **Skills:** `/tools/skills`

Access via `clawddocs` skill (use openclaw-config agent for best results).

---

## 🎯 Summary

**What You Have:**
- ✅ 6 specialized agents with distinct personalities and roles
- ✅ Shared workspace with organized `projects/` structure
- ✅ Per-agent SOUL.md, AGENTS.md, MEMORY.md files
- ✅ Complete OpenClaw configuration (draft)
- ✅ Master orchestrator pattern (master delegates to others)
- ✅ Hybrid memory (shared daily logs, per-agent long-term)
- ✅ Standardized file organization rules

**What's Next:**
1. Review and install configuration
2. Restart gateway
3. Test agent communication
4. Configure daily cron job (optional, later)
5. Configure Jenkins integration (optional, later)
6. Start using the QA workflow!

**Questions?** Ask the `openclaw-config` agent for help with OpenClaw configuration, or ask `master` to coordinate any QA workflow tasks!

---

**Setup Complete! 🎉**
