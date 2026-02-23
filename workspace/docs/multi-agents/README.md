# Multi-Agent QA Workflow - OpenClaw Configuration

**Version:** 1.0  
**Date:** 2026-02-23  
**Workspace:** `/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace`

---

## 📋 Overview

This workspace implements a **6-agent multi-agent QA workflow** for OpenClaw, designed for comprehensive test planning, execution, and reporting with intelligent task delegation.

### Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| **master** | Sonnet 4.5 | Task delegation & orchestration (default) |
| **openclaw-config** | Opus 4.6 | OpenClaw configuration expert |
| **qa-daily** | Sonnet 4.5 | Daily Jira & CI monitoring |
| **qa-plan** | Opus 4.5 | Test planning & strategy |
| **qa-test** | GPT-5.1 Codex Max | Test execution & browser automation |
| **qa-report** | Sonnet 4.5 | Test reporting & Jira updates |

---

## 🚀 Quick Start

### 1. Pre-Installation Check
```bash
cd workspace
bash scripts/validate-setup.sh
```

### 2. Install Configuration
```bash
bash scripts/install.sh
# Or manually:
# cp openclaw-config-draft.json5 ~/.openclaw/openclaw.json
# mkdir -p ~/.openclaw/agents/{master,openclaw-config,qa-daily,qa-plan,qa-test,qa-report}/{agent,sessions}
# openclaw gateway restart
```

### 3. Test Installation
```bash
bash scripts/test-installation.sh
```

### 4. Test Agent Communication
Send a message to your configured channel:
```
"Master, introduce yourself and list the agents you can delegate to"
```

---

## 📚 Documentation

### Essential Reading (In Order)
1. **README.md** ← You are here
2. **SETUP-COMPLETE.md** - Overview and summary
3. **SETUP-GUIDE.md** - Detailed installation guide
4. **QUICK-REFERENCE.md** - Fast lookup reference
5. **TROUBLESHOOTING.md** - Common issues and fixes

### Configuration
- **openclaw-config-draft.json5** - OpenClaw configuration (ready to install)
- **WORKSPACE_RULES.md** - File organization rules (mandatory)

### Per-Agent Documentation
- **agents/\<agent-id\>/SOUL.md** - Agent personality
- **agents/\<agent-id\>/AGENTS.md** - Operating instructions
- **agents/\<agent-id\>/MEMORY.md** - Long-term memory and patterns

---

## 📁 Directory Structure

```
workspace/
├── README.md                        # This file
├── SETUP-COMPLETE.md                # Installation summary
├── SETUP-GUIDE.md                   # Detailed installation guide
├── QUICK-REFERENCE.md               # Fast lookup reference
├── TROUBLESHOOTING.md               # Common issues and fixes
├── WORKSPACE_RULES.md               # File organization rules
├── openclaw-config-draft.json5      # OpenClaw configuration (ready to install)
│
├── IDENTITY.md                      # Shared identity (Atlas QA Lead)
├── USER.md                          # Snow's info and preferences
├── TOOLS.md                         # Shared tool notes
├── SOUL.md                          # (Existing workspace SOUL - not used by agents)
├── AGENTS.md                        # (Existing workspace AGENTS - not used by agents)
├── HEARTBEAT.md                     # (Existing workspace HEARTBEAT)
│
├── agents/                          # Per-agent definitions
│   ├── master/
│   │   ├── SOUL.md                  # Task delegation personality
│   │   ├── AGENTS.md                # Orchestration instructions
│   │   └── MEMORY.md                # Delegation patterns
│   ├── openclaw-config/
│   │   ├── SOUL.md                  # Config expert personality
│   │   ├── AGENTS.md                # Config management instructions
│   │   └── MEMORY.md                # Config knowledge
│   ├── qa-daily/
│   │   ├── SOUL.md                  # Daily monitor personality
│   │   ├── AGENTS.md                # Monitoring instructions
│   │   ├── HEARTBEAT.md             # Proactive check protocol
│   │   └── MEMORY.md                # Monitoring patterns
│   ├── qa-plan/
│   │   ├── SOUL.md                  # Test planner personality
│   │   ├── AGENTS.md                # Planning instructions
│   │   └── MEMORY.md                # Test patterns
│   ├── qa-test/
│   │   ├── SOUL.md                  # Test executor personality
│   │   ├── AGENTS.md                # Execution instructions
│   │   └── MEMORY.md                # Automation tips
│   └── qa-report/
│       ├── SOUL.md                  # Reporter personality
│       ├── AGENTS.md                # Reporting instructions
│       └── MEMORY.md                # Reporting patterns
│
├── projects/                        # Project artifacts (organized)
│   ├── test-reports/                # Test execution & summary reports
│   ├── test-plans/                  # Test plans by issue key
│   ├── jira-exports/                # Jira issue exports
│   ├── ci-reports/                  # Jenkins/CI reports
│   └── screenshots/                 # Test screenshots by issue key
│
├── scripts/                         # Helper scripts
│   ├── validate-setup.sh            # Pre-installation validation
│   ├── install.sh                   # Automated installation
│   └── test-installation.sh         # Post-installation testing
│
├── memory/                          # Shared daily memory logs
│   └── YYYY-MM-DD.md
│
└── skills/                          # Workspace-level skills
    └── (various skills)
```

---

## 🎯 Key Features

### 1. **Master Orchestrator Pattern**
- All requests go through master agent (default)
- Master delegates to specialized agents via `sessions_spawn`
- Master tracks progress and coordinates handoffs

### 2. **Specialized Agent Roles**
- Each agent has a clear, focused role
- Distinct personalities defined in SOUL.md
- Detailed operating instructions in AGENTS.md
- Long-term learning via MEMORY.md

### 3. **Hybrid Memory System**
- **Shared daily logs:** `memory/YYYY-MM-DD.md` (all agents)
- **Per-agent memory:** `agents/<id>/MEMORY.md` (specialized knowledge)
- Continuous learning and pattern recognition

### 4. **Standardized File Organization**
- All project artifacts under `projects/`
- Clear naming conventions (issue-key-based)
- WORKSPACE_RULES.md enforces structure

### 5. **Comprehensive Workflows**
- **Test Planning** (qa-plan) → **Execution** (qa-test) → **Reporting** (qa-report)
- **Daily Monitoring** (qa-daily) for Jira & CI checks
- **Configuration Management** (openclaw-config) for OpenClaw settings

### 6. **Safety & Quality**
- Per-agent tool restrictions (allowlists/denylists)
- Configuration backup protocols
- Evidence capture requirements (screenshots, logs)
- Bug report templates and standards

---

## 🔧 Configuration Details

### Agent State Locations
```
~/.openclaw/agents/<agent-id>/agent/     # Auth profiles, config, state
~/.openclaw/agents/<agent-id>/sessions/  # Session history
```

### Shared Files (All Agents Load These)
```
workspace/IDENTITY.md    # Who we are (Atlas QA Lead)
workspace/USER.md        # Who we serve (Snow)
workspace/TOOLS.md       # Tool notes (Jira config, etc.)
```

### Per-Agent Files (Only Loaded by Specific Agent)
```
workspace/agents/<agent-id>/SOUL.md      # Personality
workspace/agents/<agent-id>/AGENTS.md    # Operating instructions
workspace/agents/<agent-id>/MEMORY.md    # Long-term memory
```

### Routing Strategy
- **Inbound messages** → master agent (default binding)
- **Master delegates** → specialized agents via `sessions_spawn`
- **Agent-to-agent** → enabled for coordination

---

## 🛠️ Common Workflows

### Daily Monitoring
```
qa-daily (triggered by cron or heartbeat)
  ↓
Checks Jira for issues ready for testing
  ↓
Checks Jenkins for CI failures
  ↓
Generates daily summary
  ↓
Reports to master or Snow
```

### Full Test Workflow
```
Snow → Master: "Test BCIN-1234"
  ↓
Master → qa-plan: "Create test plan for BCIN-1234"
  ↓
qa-plan creates test plan & reports to master
  ↓
Master → qa-test: "Execute test plan for BCIN-1234"
  ↓
qa-test executes tests, captures screenshots & reports to master
  ↓
Master → qa-report: "File bugs and update Jira for BCIN-1234"
  ↓
qa-report files bugs, updates Jira & reports to master
  ↓
Master → Snow: "Testing complete, 2 bugs filed (BCIN-1235, BCIN-1236)"
```

### Configuration Change
```
Snow → Master: "Add a new agent"
  ↓
Master → openclaw-config: "Configure new agent"
  ↓
openclaw-config searches docs, backs up config, makes changes
  ↓
openclaw-config restarts gateway & reports success
  ↓
Master → Snow: "New agent configured"
```

---

## 📝 Usage Examples

### Talk to Master Agent
```
"Master, introduce yourself"
"Master, list the agents you can delegate to"
"Master, explain the test workflow"
```

### Test a Jira Issue
```
"Master, test issue BCIN-1234 (login improvements)"
```

### Daily Monitoring
```
"Master, spawn qa-daily to run today's checks"
```

### Configuration Help
```
"Master, spawn openclaw-config to explain agent bindings"
```

---

## 🧪 Testing & Validation

### Pre-Installation
```bash
bash scripts/validate-setup.sh
```

### Post-Installation
```bash
bash scripts/test-installation.sh
```

### Manual Tests
```bash
# Check gateway status
openclaw gateway status

# List agents
openclaw agents list --bindings

# Check logs
openclaw gateway logs

# Test agent communication
# Send message to your channel: "Master, hello"
```

---

## 🐛 Troubleshooting

See **TROUBLESHOOTING.md** for detailed solutions to common issues:

- Gateway won't start
- Agent not loading correct personality
- Wrong agent responding
- Files not found in projects/
- sessions_spawn fails
- Jira integration issues
- Daily agent not running proactively

Quick fix: `openclaw gateway restart`

---

## 📞 Getting Help

### Documentation
1. **SETUP-GUIDE.md** - Detailed installation & troubleshooting
2. **QUICK-REFERENCE.md** - Fast lookup for agents, workflows, commands
3. **TROUBLESHOOTING.md** - Common issues and fixes

### Ask Agents for Help
- **Master agent:** "Master, explain the test workflow"
- **openclaw-config agent:** "Master, spawn openclaw-config to troubleshoot routing"
- **clawddocs skill:** Use via openclaw-config to search official OpenClaw docs

---

## 🔄 Maintenance

### Regular Tasks
- Review daily summaries from qa-daily agent
- Update agent MEMORY.md files with learnings
- Archive old reports quarterly
- Backup workspace to git (private repo recommended)

### Updates
When updating OpenClaw:
```bash
npm update -g openclaw
openclaw gateway restart
```

Configuration is in `~/.openclaw/openclaw.json` (persists across OpenClaw updates).

---

## 🎉 You're Ready!

Everything is configured and ready to use:

✅ 6 specialized agents  
✅ Shared workspace with standardized structure  
✅ Complete workflows (plan → test → report)  
✅ Documentation (setup, usage, troubleshooting)  
✅ Helper scripts (validate, install, test)  
✅ Memory system (shared + per-agent)  

**Start by reading SETUP-COMPLETE.md, then follow SETUP-GUIDE.md for installation.**

---

**Questions? Ask master agent to spawn openclaw-config for help!** 🚀
