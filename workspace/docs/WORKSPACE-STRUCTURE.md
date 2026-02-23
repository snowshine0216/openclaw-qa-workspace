# Workspace Structure Reference

**Complete directory structure for all agents.**

---

## 📁 Top-Level Structure

```
workspace/
├── IDENTITY.md                  # Shared identity (Atlas QA Lead)
├── USER.md                      # Snow's info and preferences  
├── TOOLS.md                     # Shared tool notes (Jira, credentials)
├── WORKSPACE_RULES.md           # File organization rules (MANDATORY)
├── AGENTS.md                    # Legacy (not used by multi-agent)
├── SOUL.md                      # Legacy (not used by multi-agent)
├── HEARTBEAT.md                 # Legacy (not used by multi-agent)
│
├── docs/                        # ALL DOCUMENTATION
├── projects/                    # ALL PROJECT ARTIFACTS
├── memory/                      # DAILY LOGS (shared)
├── agents/                      # PER-AGENT DEFINITIONS
├── scripts/                     # HELPER SCRIPTS
└── skills/                      # WORKSPACE SKILLS
```

---

## 📚 docs/ - Documentation

**Purpose:** All documentation, guides, references, and setup instructions

```
docs/
├── multi-agents/                # Multi-agent setup documentation
│   ├── README.md                # Overview and quick start
│   ├── SETUP-COMPLETE.md        # Installation summary
│   ├── SETUP-GUIDE.md           # Detailed installation guide
│   ├── QUICK-REFERENCE.md       # Fast lookup reference
│   └── TROUBLESHOOTING.md       # Common issues and fixes
├── workflows/                   # Workflow documentation (future)
├── troubleshooting/             # Troubleshooting guides (future)
├── api/                         # API documentation (future)
└── references/                  # Reference materials (future)
```

**What goes here:**
- Setup and installation guides
- User manuals and tutorials
- API and interface documentation
- Architecture and design docs
- Troubleshooting guides
- Reference materials

**What does NOT go here:**
- Test plans (→ `projects/test-plans/`)
- Test reports (→ `projects/test-reports/`)
- Screenshots (→ `projects/screenshots/`)
- Daily logs (→ `memory/`)

---

## 📦 projects/ - Project Artifacts

**Purpose:** All test-related deliverables and work products

```
projects/
├── test-reports/                # Test execution & summary reports
│   ├── BCIN-1234/               # By issue key
│   │   ├── execution-report.md
│   │   ├── summary-report.md
│   │   └── bugs/
│   │       ├── bug-TC-02.md
│   │       └── bug-TC-07.md
│   └── daily/                   # Daily QA check summaries
│       ├── 2026-02-23.md
│       └── 2026-02-24.md
│
├── test-plans/                  # Test plan documents
│   ├── BCIN-1234/               # By issue key
│   │   ├── test-plan.md
│   │   └── requirements.md
│   └── feature-login/           # By feature
│       └── test-plan.md
│
├── jira-exports/                # Jira issue exports
│   ├── 2026-02-23.json          # Daily exports
│   ├── BCIN-1234.json           # Individual issue exports
│   └── ready-for-testing.json
│
├── ci-reports/                  # Jenkins/CI reports
│   ├── 2026-02-23/
│   │   ├── failures.json
│   │   └── flaky-tests.json
│   └── 2026-02-24/
│
└── screenshots/                 # Test screenshots and logs
    └── BCIN-1234/
        ├── TC-01-login-success.png
        ├── TC-02-invalid-creds-fail.png
        ├── TC-02-console.txt
        └── TC-07-freeze.png
```

**Organization patterns:**
- **By issue key:** `BCIN-1234/` (most common for test work)
- **By feature:** `feature-login/` (for broader test planning)
- **By date:** `2026-02-23/` (for daily reports and CI logs)

**What goes here:**
- Test plans and test cases
- Test execution reports
- Bug reports (before filing to Jira)
- Screenshots and console logs
- Jira exports and CI reports
- Any QA deliverable or artifact

**What does NOT go here:**
- Setup documentation (→ `docs/`)
- Daily activity logs (→ `memory/`)
- Agent operating instructions (→ `agents/`)

---

## 💭 memory/ - Daily Logs (Shared)

**Purpose:** Shared daily activity logs for all agents

```
memory/
├── 2026-02-23.md
├── 2026-02-24.md
└── 2026-02-25.md
```

**Format:** One file per day (`YYYY-MM-DD.md`)

**What goes here:**
- Daily activities from all agents
- Tasks received and completed
- Decisions made
- Issues encountered
- Context for future reference

**Who writes here:**
- All agents (shared memory)
- Primarily: master, qa-daily, qa-plan, qa-test, qa-report

**What does NOT go here:**
- Long-term agent learnings (→ `agents/<id>/MEMORY.md`)
- Test reports (→ `projects/test-reports/`)
- Documentation (→ `docs/`)

---

## 🤖 agents/ - Per-Agent Definitions

**Purpose:** Agent-specific personalities, workflows, and memories

```
agents/
├── master/
│   ├── SOUL.md                  # Task delegation personality
│   ├── AGENTS.md                # Orchestration workflow
│   └── MEMORY.md                # Delegation patterns
├── openclaw-config/
│   ├── SOUL.md                  # Config expert personality
│   ├── AGENTS.md                # Config management workflow
│   └── MEMORY.md                # Config knowledge
├── qa-daily/
│   ├── SOUL.md                  # Daily monitor personality
│   ├── AGENTS.md                # Monitoring workflow
│   ├── HEARTBEAT.md             # Proactive check protocol
│   └── MEMORY.md                # Monitoring patterns
├── qa-plan/
│   ├── SOUL.md                  # Test planner personality
│   ├── AGENTS.md                # Planning workflow
│   └── MEMORY.md                # Test patterns
├── qa-test/
│   ├── SOUL.md                  # Test executor personality
│   ├── AGENTS.md                # Execution workflow
│   └── MEMORY.md                # Automation tips
└── qa-report/
    ├── SOUL.md                  # Reporter personality
    ├── AGENTS.md                # Reporting workflow
    └── MEMORY.md                # Reporting patterns
```

**File purposes:**
- **SOUL.md** - Agent personality, vibe, boundaries
- **AGENTS.md** - Operating instructions, workflows, checklists
- **MEMORY.md** - Long-term learnings, patterns, best practices
- **HEARTBEAT.md** - Proactive check protocol (qa-daily only)

**Who modifies these:**
- Agents update their own `MEMORY.md` as they learn
- openclaw-config agent (when Snow requests agent changes)
- Snow (manual edits for personality/workflow updates)

---

## 🛠️ scripts/ - Helper Scripts

**Purpose:** Automation and utility scripts

```
scripts/
├── validate-setup.sh            # Pre-installation validation
├── install.sh                   # Automated installation
├── test-installation.sh         # Post-installation testing
└── (custom scripts)
```

**What goes here:**
- Installation and setup scripts
- Validation and testing scripts
- Automation utilities
- Helper scripts for common tasks

---

## 🧩 skills/ - Workspace Skills

**Purpose:** Workspace-level skills (shared across agents)

```
skills/
├── agent-browser/
├── jira-cli/
├── microstrategy-ui-test/
├── clawddocs/
└── (other skills)
```

**Skills resolution order:**
1. Workspace skills (`workspace/skills/`)
2. Managed skills (`~/.openclaw/skills/`)

---

## 🗂️ File Naming Conventions

### Test Reports
```
projects/test-reports/<issue-key>/execution-report.md
projects/test-reports/<issue-key>/summary-report.md
projects/test-reports/daily/<YYYY-MM-DD>.md
```

### Test Plans
```
projects/test-plans/<issue-key>/test-plan.md
projects/test-plans/<feature>/test-plan.md
```

### Screenshots
```
projects/screenshots/<issue-key>/TC-<number>-<description>-<status>.png
projects/screenshots/<issue-key>/TC-<number>-console.txt

Examples:
projects/screenshots/BCIN-1234/TC-01-login-success.png
projects/screenshots/BCIN-1234/TC-02-invalid-creds-fail.png
```

### Bug Reports (Pre-Jira)
```
projects/test-reports/<issue-key>/bugs/bug-TC-<number>.md

Example:
projects/test-reports/BCIN-1234/bugs/bug-TC-02.md
```

### Jira Exports
```
projects/jira-exports/<YYYY-MM-DD>.json          # Daily exports
projects/jira-exports/<issue-key>.json           # Individual issues
```

### CI Reports
```
projects/ci-reports/<YYYY-MM-DD>/failures.json
projects/ci-reports/<YYYY-MM-DD>/flaky-tests.json
```

### Documentation
```
docs/<category>/<topic>.md

Examples:
docs/multi-agents/SETUP-GUIDE.md
docs/workflows/test-workflow.md
docs/troubleshooting/common-issues.md
```

---

## 🚦 Decision Tree: Where Does This File Go?

```
Is it documentation? (setup, guide, reference)
  ↓ YES → docs/<category>/

Is it a test artifact? (plan, report, screenshot)
  ↓ YES → projects/<type>/<issue-key or date>/

Is it a daily activity log?
  ↓ YES → memory/YYYY-MM-DD.md

Is it agent-specific learning?
  ↓ YES → agents/<agent-id>/MEMORY.md

Is it a script?
  ↓ YES → scripts/
```

---

## 📊 Quick Reference Table

| Type | Location | Example |
|------|----------|---------|
| **Setup doc** | `docs/multi-agents/` | SETUP-GUIDE.md |
| **Workflow doc** | `docs/workflows/` | test-workflow.md |
| **Troubleshooting** | `docs/troubleshooting/` | common-issues.md |
| **Test plan** | `projects/test-plans/<key>/` | test-plan.md |
| **Test report** | `projects/test-reports/<key>/` | execution-report.md |
| **Screenshot** | `projects/screenshots/<key>/` | TC-01-success.png |
| **Bug report** | `projects/test-reports/<key>/bugs/` | bug-TC-02.md |
| **Jira export** | `projects/jira-exports/` | YYYY-MM-DD.json |
| **CI report** | `projects/ci-reports/<date>/` | failures.json |
| **Daily log** | `memory/` | YYYY-MM-DD.md |
| **Agent memory** | `agents/<id>/` | MEMORY.md |
| **Script** | `scripts/` | validate.sh |

---

## ✅ Before Creating a File

**Always ask:**
1. **What type is this?** (doc, test artifact, log, script)
2. **Which folder?** (docs, projects, memory, agents, scripts)
3. **What subdirectory?** (issue key, date, category)
4. **What name?** (descriptive, follows convention)

**Then:**
1. Determine correct folder
2. Create subdirectory if needed
3. Use descriptive filename
4. Save to correct location

**Consult WORKSPACE_RULES.md for complete rules.**

---

**This structure is mandatory for all agents. No exceptions.**
