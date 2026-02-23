# Multi-Agent QA Workflow v2 - Separate Workspaces + Feishu

**Version:** 2.0  
**Date:** 2026-02-23  
**Architecture:** Isolated workspaces per agent + Feishu integration

---

## 🎯 Key Changes from v1

| Feature | v1 (Old) | v2 (New) |
|---------|----------|----------|
| **Workspace** | Shared workspace | **Separate workspace per agent** |
| **Location** | `workspace/agents/<id>/` | `workspace/docs/multi-agents/v2/agents/<id>/` |
| **Channel** | Unspecified | **Feishu (configured)** |
| **Documentation** | Manual skill usage | **clawddocs skill mandatory** |
| **Isolation** | Shared memory/state | **Fully isolated per agent** |

---

## 📁 Architecture Overview

```
workspace/docs/multi-agents/v2/
│
├── README.md                    # This file
├── SETUP-GUIDE.md               # Installation instructions
├── feishu-config.json5          # Feishu + agent configuration
│
├── agents/                      # Per-agent workspaces (isolated)
│   ├── master/                  # Master orchestrator workspace
│   │   ├── SOUL.md              # Personality
│   │   ├── AGENTS.md            # Operating instructions
│   │   ├── USER.md              # User context (Snow)
│   │   ├── IDENTITY.md          # Identity (Atlas Master)
│   │   ├── TOOLS.md             # Tool notes
│   │   ├── MEMORY.md            # Long-term memory
│   │   ├── memory/              # Daily logs
│   │   └── projects/            # Master's artifacts
│   │
│   ├── openclaw-config/         # Config expert workspace
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   ├── USER.md
│   │   ├── IDENTITY.md
│   │   ├── TOOLS.md
│   │   ├── MEMORY.md
│   │   ├── memory/
│   │   └── projects/
│   │
│   ├── qa-daily/                # Daily monitor workspace
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   ├── USER.md
│   │   ├── IDENTITY.md
│   │   ├── TOOLS.md
│   │   ├── HEARTBEAT.md         # Proactive checks
│   │   ├── MEMORY.md
│   │   ├── memory/
│   │   └── projects/
│   │
│   ├── qa-plan/                 # Test planner workspace
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   ├── USER.md
│   │   ├── IDENTITY.md
│   │   ├── TOOLS.md
│   │   ├── MEMORY.md
│   │   ├── memory/
│   │   └── projects/
│   │
│   ├── qa-test/                 # Test executor workspace
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   ├── USER.md
│   │   ├── IDENTITY.md
│   │   ├── TOOLS.md
│   │   ├── MEMORY.md
│   │   ├── memory/
│   │   └── projects/
│   │       ├── test-reports/
│   │       └── screenshots/
│   │
│   └── qa-report/               # Reporter workspace
│       ├── SOUL.md
│       ├── AGENTS.md
│       ├── USER.md
│       ├── IDENTITY.md
│       ├── TOOLS.md
│       ├── MEMORY.md
│       ├── memory/
│       └── projects/
│           └── jira-exports/
│
├── scripts/                     # Helper scripts
│   ├── validate-setup.sh
│   ├── install.sh
│   ├── create-workspaces.sh
│   └── test-installation.sh
│
└── docs/                        # Setup documentation
    ├── feishu-setup.md
    ├── agent-roles.md
    └── workflow-examples.md
```

---

## 🤖 Agents

| Agent ID | Name | Model | Role | Workspace | Skills |
|----------|------|-------|------|-----------|--------|
| **master** | Atlas Master | Sonnet 4.5 | Task delegation & orchestration | `agents/master/` | clawddocs, sessions_spawn |
| **openclaw-config** | Atlas Config Expert | Opus 4.6 | OpenClaw configuration | `agents/openclaw-config/` | **clawddocs (primary)** |
| **qa-daily** | Atlas Daily | Sonnet 4.5 | Daily Jira & CI monitoring | `agents/qa-daily/` | clawddocs, jira-cli |
| **qa-plan** | Atlas Planner | Opus 4.5 | Test planning & strategy | `agents/qa-plan/` | clawddocs, test-case-generator |
| **qa-test** | Atlas Tester | GPT-5.1 Codex Max | Test execution & automation | `agents/qa-test/` | clawddocs, microstrategy-ui-test, browser |
| **qa-report** | Atlas Reporter | Sonnet 4.5 | Test reporting & Jira updates | `agents/qa-report/` | clawddocs, jira-cli, bug-report-formatter |

---

## 📡 Feishu Integration

**All agents communicate via Feishu:**

- **Channel:** Feishu (飞书)
- **Bot:** Atlas QA Bot
- **Webhook:** Configured in `feishu-config.json5`
- **Group:** Snow's QA team group
- **Access:** Master receives all messages, delegates to specialists

**Feishu Configuration Details:**
- See: `docs/feishu-setup.md`
- App ID: *(to be configured)*
- App Secret: *(to be configured)*
- Webhook URL: *(to be configured)*

---

## 🧠 Key Architecture Principles

### 1. **Complete Isolation**
Each agent has its own:
- Workspace directory (`agents/<id>/`)
- SOUL.md (personality)
- AGENTS.md (instructions)
- MEMORY.md (long-term memory)
- `memory/` folder (daily logs)
- `projects/` folder (artifacts)

**Why?** Prevents cross-contamination, clearer debugging, true multi-agent separation.

### 2. **Mandatory clawddocs**
Every agent MUST have clawddocs skill configured.

**Why?** Self-service documentation, reduces dependency on master, enables autonomous learning.

### 3. **Feishu-First Communication**
All agent communication flows through Feishu.

**Why?** Unified notification platform, easier monitoring, better audit trail.

### 4. **Master Orchestrator Pattern**
Master agent receives all inbound messages, delegates to specialists via `sessions_spawn`.

**Why?** Single point of coordination, clear routing logic, easier to manage.

---

## 🚀 Quick Start

### Prerequisites
- OpenClaw installed (`openclaw --version`)
- Feishu bot credentials (App ID, Secret)
- clawddocs skill installed (`~/Documents/Repository/openclaw-qa-workspace/workspace/skills/clawddocs/`)

### Installation Steps

1. **Create agent workspaces:**
   ```bash
   bash scripts/create-workspaces.sh
   ```

2. **Configure Feishu:**
   - Follow: `docs/feishu-setup.md`
   - Update: `feishu-config.json5` with your credentials

3. **Install configuration:**
   ```bash
   bash scripts/install.sh
   ```

4. **Restart gateway:**
   ```bash
   openclaw gateway restart
   ```

5. **Test agents:**
   ```bash
   bash scripts/test-installation.sh
   ```

---

## 📚 Documentation

- **SETUP-GUIDE.md** - Detailed installation & configuration
- **docs/feishu-setup.md** - Feishu bot setup guide
- **docs/agent-roles.md** - Detailed agent responsibilities
- **docs/workflow-examples.md** - Common usage patterns

---

## 🔄 Workflows

### Example: Full QA Workflow

```
1. Snow → Feishu: "Master, test BCIN-1234"
   ↓
2. Master (in agents/master/) receives message
   ↓
3. Master spawns qa-plan (isolated workspace: agents/qa-plan/)
   ↓
4. qa-plan creates test plan → agents/qa-plan/projects/test-plans/BCIN-1234.md
   ↓
5. qa-plan reports to master via Feishu
   ↓
6. Master spawns qa-test (isolated workspace: agents/qa-test/)
   ↓
7. qa-test executes tests → agents/qa-test/projects/test-reports/BCIN-1234/
   ↓
8. qa-test reports to master via Feishu
   ↓
9. Master spawns qa-report (isolated workspace: agents/qa-report/)
   ↓
10. qa-report files bugs to Jira → agents/qa-report/projects/jira-exports/
   ↓
11. qa-report reports to master via Feishu
   ↓
12. Master → Snow: "Testing complete, 2 bugs filed (BCIN-1235, BCIN-1236)"
```

**Key Point:** Each agent works in its own workspace, no file conflicts!

---

## 🛠️ Configuration Highlights

### Agent-Specific Workspaces
```json5
{
  agents: {
    master: {
      workspace: "./workspace/docs/multi-agents/v2/agents/master",
      model: "github-copilot/claude-sonnet-4.5"
    },
    "openclaw-config": {
      workspace: "./workspace/docs/multi-agents/v2/agents/openclaw-config",
      model: "github-copilot/claude-opus-4.6"
    },
    // ... etc
  }
}
```

### Feishu Routing
```json5
{
  bindings: [
    {
      agentId: "master",
      match: { channel: "feishu", accountId: "atlas-qa-bot" }
    }
  ]
}
```

### clawddocs Skill (All Agents)
```json5
{
  agents: {
    master: {
      skillsAllowlist: ["clawddocs", "sessions_spawn"]
    },
    "openclaw-config": {
      skillsAllowlist: ["clawddocs"]  // Primary user
    }
    // ... etc
  }
}
```

---

## 🎉 What's Different?

| Aspect | Old (v1) | New (v2) |
|--------|----------|----------|
| **Workspace** | Shared | **Isolated per agent** |
| **MEMORY.md** | Shared | **Per-agent** |
| **projects/** | Shared | **Per-agent** |
| **Documentation** | Manual | **clawddocs skill** |
| **Communication** | Generic | **Feishu** |
| **File Conflicts** | Possible | **Impossible** |
| **Debugging** | Complex | **Simple (per-agent logs)** |

---

## 📞 Next Steps

1. Read **SETUP-GUIDE.md** for detailed installation
2. Set up **Feishu bot** (see `docs/feishu-setup.md`)
3. Run **scripts/create-workspaces.sh** to generate all agent workspaces
4. Install configuration with **scripts/install.sh**
5. Test with **scripts/test-installation.sh**

---

**Questions? Ask master agent via Feishu: "Master, explain the new multi-agent architecture"**

🚀 **Let's build the future of QA automation!**
