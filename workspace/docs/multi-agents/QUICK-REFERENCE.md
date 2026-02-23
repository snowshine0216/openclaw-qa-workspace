# Multi-Agent Quick Reference

**Fast lookup guide for your 6-agent QA workflow.**

---

## 🎯 Agent Quick Reference

### Master Agent (Atlas Master)
- **Model:** Sonnet 4.5
- **Role:** Task delegation & orchestration
- **When to use:** Always start here (default agent)
- **Example:** "Master, test BCIN-1234 and report results"

### OpenClaw Config (Atlas Config Expert)
- **Model:** Opus 4.6
- **Role:** OpenClaw configuration & troubleshooting
- **When to use:** Config changes, agent setup, routing issues
- **Example:** "Master, spawn openclaw-config to add a new agent"

### QA Daily (Atlas Daily)
- **Model:** Sonnet 4.5
- **Role:** Daily Jira & CI monitoring
- **When to use:** Morning checks, CI failures, Jira updates
- **Example:** "Master, spawn qa-daily to check today's Jira issues"
- **Cron:** 09:00 daily (setup later)

### QA Plan (Atlas Planner)
- **Model:** Opus 4.5
- **Role:** Test planning & strategy
- **When to use:** Creating test plans, test case design
- **Example:** "Master, spawn qa-plan to create test plan for BCIN-1234"

### QA Test (Atlas Tester)
- **Model:** GPT-5.1 Codex Max
- **Role:** Test execution & validation
- **When to use:** Executing tests, browser automation
- **Example:** "Master, spawn qa-test to execute test plan for BCIN-1234"

### QA Report (Atlas Reporter)
- **Model:** Sonnet 4.5
- **Role:** Test reporting & Jira updates
- **When to use:** Creating reports, filing bugs, updating Jira
- **Example:** "Master, spawn qa-report to file bugs from test results"

---

## 📂 File Locations

### Shared Files (All Agents)
```
workspace/
├── IDENTITY.md           # Shared identity (Atlas QA Lead)
├── USER.md               # Snow's info
├── TOOLS.md              # Tool notes (Jira, credentials)
├── WORKSPACE_RULES.md    # File organization rules
└── memory/
    └── YYYY-MM-DD.md     # Daily logs (shared)
```

### Per-Agent Files
```
workspace/agents/<agent-id>/
├── SOUL.md               # Personality
├── AGENTS.md             # Operating instructions
├── MEMORY.md             # Long-term memory
└── HEARTBEAT.md          # (qa-daily only)
```

### Project Artifacts
```
workspace/projects/
├── test-reports/         # Test execution & summary reports
├── test-plans/           # Test plans by issue key
├── jira-exports/         # Jira issue exports
├── ci-reports/           # Jenkins/CI reports
└── screenshots/          # Test screenshots by issue key
```

---

## 🔄 Typical Workflows

### Daily Monitoring Workflow
```
1. qa-daily runs (09:00 cron or manual)
2. Checks Jira for issues ready for testing
3. Checks Jenkins for CI failures
4. Generates daily summary
5. Reports to master or Snow
```

### Full Test Workflow
```
1. Snow → Master: "Test BCIN-1234"
2. Master → qa-plan: "Create test plan for BCIN-1234"
3. qa-plan → Creates test plan → Reports to master
4. Master → qa-test: "Execute test plan for BCIN-1234"
5. qa-test → Executes tests → Captures screenshots → Reports to master
6. Master → qa-report: "File bugs and update Jira for BCIN-1234"
7. qa-report → Files bugs → Updates Jira → Reports to master
8. Master → Snow: "Test complete, 2 bugs filed (BCIN-1235, BCIN-1236)"
```

### Configuration Change Workflow
```
1. Snow → Master: "Add a new agent for performance testing"
2. Master → openclaw-config: "Configure new agent 'qa-perf'"
3. openclaw-config → Backs up config → Adds agent → Validates → Restarts gateway
4. openclaw-config → Reports to master
5. Master → Snow: "New agent 'qa-perf' configured and ready"
```

---

## 🛠️ Common Commands

### OpenClaw CLI
```bash
# Agent management
openclaw agents list --bindings
openclaw agents add <agent-id>

# Gateway management
openclaw gateway status
openclaw gateway restart
openclaw gateway logs

# Channel management
openclaw channels status --probe

# Session management
openclaw sessions list
```

### Jira CLI (via agents)
```bash
# List issues
jira issue list --status "Ready for Testing" --project BCIN

# View issue
jira issue view BCIN-1234

# Create bug
jira issue create --project BCIN --type Bug --summary "..." --description "..."

# Update status
jira issue move BCIN-1234 "Testing Complete"

# Add comment
jira issue comment BCIN-1234 "Testing complete. 2 bugs found."
```

---

## 📋 File Naming Conventions

### Test Plans
```
projects/test-plans/<issue-key>/test-plan.md
projects/test-plans/BCIN-1234/test-plan.md
```

### Test Reports
```
projects/test-reports/<issue-key>/execution-report.md
projects/test-reports/<issue-key>/summary-report.md
projects/test-reports/BCIN-1234/execution-report.md
```

### Screenshots
```
projects/screenshots/<issue-key>/TC-<number>-<description>-<status>.png
projects/screenshots/BCIN-1234/TC-01-login-success.png
projects/screenshots/BCIN-1234/TC-02-invalid-creds-fail.png
```

### Bug Reports
```
projects/test-reports/<issue-key>/bugs/bug-TC-<number>.md
projects/test-reports/BCIN-1234/bugs/bug-TC-02.md
```

---

## 🔑 Key Configuration Paths

```bash
# OpenClaw config
~/.openclaw/openclaw.json

# Agent state directories
~/.openclaw/agents/<agent-id>/agent/
~/.openclaw/agents/<agent-id>/sessions/

# Workspace
/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace

# Per-agent files
workspace/agents/<agent-id>/SOUL.md
workspace/agents/<agent-id>/AGENTS.md
workspace/agents/<agent-id>/MEMORY.md
```

---

## 🚨 Emergency Commands

### Restore Config Backup
```bash
# List backups
ls -lt ~/.openclaw/openclaw.json.backup-*

# Restore latest backup
cp ~/.openclaw/openclaw.json.backup-YYYYMMDD-HHMMSS ~/.openclaw/openclaw.json

# Restart gateway
openclaw gateway restart
```

### Check Agent Status
```bash
# List all agents
openclaw agents list --bindings

# Check gateway status
openclaw gateway status

# Check logs for errors
openclaw gateway logs | grep -i error
```

### Kill Stuck Agent
```bash
# List running sessions
openclaw sessions list

# Kill session (if needed)
# (Use subagents tool from master agent)
```

---

## 💡 Pro Tips

### 1. Always Start with Master
All requests should go through the master agent. It orchestrates everything.

### 2. Use Issue Keys Consistently
Always reference Jira issue keys (BCIN-1234) in tasks and file paths.

### 3. Follow File Organization Rules
Check `WORKSPACE_RULES.md` before creating files. Everything goes to `projects/`.

### 4. Capture Evidence
Screenshots, logs, and network traces are crucial for bug reports.

### 5. Review Memory Files
Each agent's `MEMORY.md` contains learned patterns and best practices.

### 6. Monitor Daily Checks
qa-daily agent should run daily. Review its reports for blockers.

### 7. Backup Before Config Changes
Always backup `~/.openclaw/openclaw.json` before editing.

### 8. Use Per-Agent Skills
Each agent has specific tools enabled. Don't expect all agents to do everything.

---

## 📞 Getting Help

### Ask Master for Workflow Help
```
"Master, explain the test workflow"
"Master, how do I test a new feature?"
```

### Ask openclaw-config for Config Help
```
"Master, spawn openclaw-config to explain agent bindings"
"Master, spawn openclaw-config to troubleshoot routing issues"
```

### Check Documentation
Use the `clawddocs` skill (via openclaw-config agent) to search official docs.

---

## 🎯 Summary

- **6 specialized agents** - Each has a clear role
- **Master orchestrates** - Always start here
- **Shared workspace** - Files organized in `projects/`
- **Per-agent files** - SOUL, AGENTS, MEMORY under `agents/<id>/`
- **Full QA workflow** - Plan → Test → Report
- **Daily monitoring** - Automated via qa-daily

**Everything is ready. Start testing!** 🚀
