# Troubleshooting Guide

Common issues and solutions for the multi-agent setup.

---

## 🚨 Gateway Won't Start

### Symptom
```bash
openclaw gateway status
# Error: Gateway is not running
```

### Solutions

**1. Check config syntax**
```bash
# Read the config
cat ~/.openclaw/openclaw.json

# Look for syntax errors (missing commas, brackets, quotes)
# JSON5 allows trailing commas and comments, but check for:
# - Unmatched brackets/braces
# - Missing colons
# - Incorrect quotes
```

**2. Check gateway logs**
```bash
openclaw gateway logs

# Look for error messages like:
# - "Invalid configuration"
# - "Agent not found"
# - "Module not found"
```

**3. Restore backup and retry**
```bash
# List backups
ls -lt ~/.openclaw/openclaw.json.backup-*

# Restore latest backup
cp ~/.openclaw/openclaw.json.backup-YYYYMMDD-HHMMSS ~/.openclaw/openclaw.json

# Restart
openclaw gateway restart
```

**4. Validate workspace paths**
```bash
# Check if workspace exists
ls -la /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace

# Check agent directories
ls -la workspace/agents/master/
ls -la workspace/agents/openclaw-config/
# etc.
```

---

## 🤔 Agent Not Loading Correct Personality

### Symptom
Agent responds but doesn't follow its SOUL.md personality.

### Solutions

**1. Verify systemPromptOverride paths**
```bash
# Check config has correct paths
cat ~/.openclaw/openclaw.json | grep -A 5 "systemPromptOverride"

# Should show:
#   soulFile: "agents/master/SOUL.md"
#   agentsFile: "agents/master/AGENTS.md"
```

**2. Check files exist and are readable**
```bash
# Verify files exist
ls -la workspace/agents/master/SOUL.md
ls -la workspace/agents/master/AGENTS.md

# Check permissions
chmod 644 workspace/agents/master/*.md
```

**3. Verify workspace path in config**
```bash
# Workspace should be absolute path
grep "workspace" ~/.openclaw/openclaw.json

# Should show:
#   workspace: "/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace"
```

**4. Restart gateway to reload files**
```bash
openclaw gateway restart
```

---

## 🔀 Wrong Agent Responding

### Symptom
Messages go to the wrong agent (not master by default).

### Solutions

**1. Check binding configuration**
```bash
openclaw agents list --bindings

# Should show:
# master (default)
# Bindings: channel=*
```

**2. Verify default agent**
```bash
cat ~/.openclaw/openclaw.json | grep -A 3 '"id": "master"'

# Should show:
#   default: true
```

**3. Check binding order**
Bindings are evaluated top-to-bottom. Most specific first.

```json5
bindings: [
  // This should be LAST (catches everything)
  { agentId: "master", match: { channel: "*" } },
]
```

**4. Review routing logs**
```bash
openclaw gateway logs | grep -i "routing"
```

---

## 📁 Files Not Found in projects/

### Symptom
Agent reports "File not found" when accessing `projects/` folder.

### Solutions

**1. Verify workspace path**
```bash
# Check config
cat ~/.openclaw/openclaw.json | grep "workspace"

# Verify directory exists
ls -la /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace/projects
```

**2. Create missing directories**
```bash
cd workspace
mkdir -p projects/{test-reports,test-plans,jira-exports,ci-reports,screenshots}
```

**3. Check permissions**
```bash
chmod 755 workspace/projects
chmod 755 workspace/projects/*
```

**4. Verify WORKSPACE_RULES.md is followed**
Agents should create files under `projects/`, not workspace root.

---

## 🔗 sessions_spawn Fails

### Symptom
Master agent can't spawn other agents.

### Solutions

**1. Verify agent-to-agent communication**
```bash
cat ~/.openclaw/openclaw.json | grep -A 5 "agentToAgent"

# Should show:
#   enabled: true
#   allow: ["master", "openclaw-config", "qa-daily", "qa-plan", "qa-test", "qa-report"]
```

**2. Check agent IDs match**
```bash
openclaw agents list

# Should show all 6 agents
```

**3. Verify agentDir paths exist**
```bash
ls -la ~/.openclaw/agents/master/agent
ls -la ~/.openclaw/agents/openclaw-config/agent
# etc.
```

**4. Check sessions directory**
```bash
ls -la ~/.openclaw/agents/master/sessions
```

---

## 🧠 Agent Not Loading Memory Files

### Symptom
Agent doesn't seem to remember things from MEMORY.md.

### Solutions

**1. Verify memory configuration**
```bash
cat ~/.openclaw/openclaw.json | grep -A 3 "memory"

# Should show:
#   memory: {
#     memoryFile: "agents/master/MEMORY.md"
#   }
```

**2. Check memory file exists**
```bash
ls -la workspace/agents/master/MEMORY.md
```

**3. Verify main session context**
MEMORY.md is only loaded in main (direct) sessions, not in group chats or spawned sessions.

**4. Check daily memory logs**
```bash
ls -la workspace/memory/
# Should show YYYY-MM-DD.md files
```

---

## 🛠️ Tool Not Available

### Symptom
Agent reports "Tool not available" or tool call fails.

### Solutions

**1. Check per-agent tool restrictions**
```bash
cat ~/.openclaw/openclaw.json | grep -A 10 "tools"

# Look for allow/deny lists
```

**2. Verify skill exists**
```bash
ls -la workspace/skills/
ls -la ~/.openclaw/skills/
```

**3. Check tool is in allow list**
```json5
tools: {
  allow: ["read", "write", "exec", "browser"],
  deny: ["canvas", "nodes"],
}
```

**4. Review agent AGENTS.md for tool usage**
Each agent's AGENTS.md lists which tools it should use.

---

## 📊 Jira Integration Not Working

### Symptom
jira-cli commands fail or return errors.

### Solutions

**1. Verify jira-cli is configured**
```bash
jira issue list --project BCIN

# Should return issues or authentication prompt
```

**2. Check TOOLS.md has Jira details**
```bash
cat workspace/TOOLS.md | grep -i jira
```

**3. Configure Jira credentials**
Follow jira-cli skill setup instructions.

**4. Test from command line first**
```bash
# Test Jira connection
jira issue view BCIN-1234
```

---

## 🤖 Daily Agent Not Running Proactively

### Symptom
qa-daily agent doesn't run morning checks automatically.

### Solutions

**1. Cron job not set up yet**
Daily automation requires cron configuration (setup later).

**2. Test manually first**
```bash
# Spawn qa-daily manually
# Via master agent: "Master, spawn qa-daily to run checks"
```

**3. Verify HEARTBEAT.md exists**
```bash
ls -la workspace/agents/qa-daily/HEARTBEAT.md
```

**4. Set up cron job (when ready)**
```bash
# Example cron entry (not configured yet)
# 0 9 * * * /path/to/openclaw message --agent qa-daily --task "Run daily checks"
```

---

## 🔄 Gateway Logs Show Errors

### Common Errors and Fixes

**"Cannot find module"**
```bash
# Reinstall OpenClaw
npm install -g openclaw

# Or update
npm update -g openclaw
```

**"EACCES: permission denied"**
```bash
# Fix workspace permissions
chmod -R 755 workspace/
chmod 644 workspace/**/*.md
```

**"Agent not found"**
```bash
# Verify agent ID in config
cat ~/.openclaw/openclaw.json | grep '"id"'

# Should match agents list
openclaw agents list
```

**"Invalid JSON"**
```bash
# Validate JSON5 syntax
# Look for:
# - Unmatched brackets
# - Missing commas (allowed trailing in JSON5)
# - Incorrect quotes
```

---

## 🧪 Testing Checklist

After fixing issues, test:

```bash
# 1. Validate setup
bash scripts/validate-setup.sh

# 2. Test installation
bash scripts/test-installation.sh

# 3. Check gateway
openclaw gateway status

# 4. List agents
openclaw agents list --bindings

# 5. Check logs
openclaw gateway logs | tail -50

# 6. Test agent communication
# Send message: "Master, introduce yourself"
```

---

## 🆘 Still Having Issues?

### Collect Diagnostic Info

```bash
# 1. Gateway status
openclaw gateway status > diagnostic.txt

# 2. Agents list
openclaw agents list --bindings >> diagnostic.txt

# 3. Recent logs
openclaw gateway logs --lines 100 >> diagnostic.txt

# 4. Config excerpt
cat ~/.openclaw/openclaw.json | head -50 >> diagnostic.txt

# 5. Workspace structure
ls -laR workspace/agents/ >> diagnostic.txt
```

### Common Fixes

1. **Restart gateway:** `openclaw gateway restart`
2. **Restore backup:** `cp ~/.openclaw/openclaw.json.backup-* ~/.openclaw/openclaw.json`
3. **Check permissions:** `chmod -R 755 workspace/`
4. **Verify paths:** Ensure all paths in config are absolute or correct relative paths
5. **Review SETUP-GUIDE.md:** Detailed troubleshooting section included

### Ask openclaw-config Agent

Once master is working, you can spawn openclaw-config agent to help:

```
"Master, spawn openclaw-config to troubleshoot agent routing issues"
```

---

## 📚 Additional Resources

- **SETUP-GUIDE.md** - Complete installation guide with troubleshooting
- **QUICK-REFERENCE.md** - Fast lookup for common operations
- **Official docs** - Use clawddocs skill to search OpenClaw documentation

---

**Most issues are config-related. Double-check paths, syntax, and restart the gateway!** 🔧
