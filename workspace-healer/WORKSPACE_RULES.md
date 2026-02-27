# WORKSPACE_RULES.md - File Organization

**Mandatory rules for all agents:**

1. **NO files scattered in workspace root**
2. **Documentation goes to `docs/`**
3. **Project artifacts go to `projects/`**

## 📁 Complete Folder Structure

```
workspace/
├── IDENTITY.md, TOOLS.md, USER.md     ← Shared workspace config
├── AGENTS.md, SOUL.md, HEARTBEAT.md   ← Legacy workspace files (not used by multi-agent)
├── WORKSPACE_RULES.md                  ← This file
│
├── docs/                               ← ALL DOCUMENTATION
│   ├── multi-agents/                   ← Multi-agent setup docs
│   │   ├── README.md
│   │   ├── SETUP-COMPLETE.md
│   │   ├── SETUP-GUIDE.md
│   │   ├── QUICK-REFERENCE.md
│   │   └── TROUBLESHOOTING.md
│   └── (other documentation)
│
├── projects/                           ← ALL PROJECT ARTIFACTS
│   ├── test-reports/                   ← Test execution & summary reports
│   ├── test-plans/                     ← Test plans by issue key
│   ├── jira-exports/                   ← Jira issue exports
│   ├── ci-reports/                     ← Jenkins/CI reports
│   └── screenshots/                    ← Test screenshots by issue key
│
├── memory/                             ← Daily memory logs (shared)
│   └── YYYY-MM-DD.md
│
├── agents/                             ← Per-agent definitions
│   ├── master/
│   │   ├── SOUL.md                     ← Personality
│   │   ├── AGENTS.md                   ← Operating instructions
│   │   └── MEMORY.md                   ← Long-term memory
│   ├── openclaw-config/
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   └── MEMORY.md
│   ├── qa-daily/
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   ├── HEARTBEAT.md                ← Proactive checks
│   │   └── MEMORY.md
│   ├── qa-plan/
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   └── MEMORY.md
│   ├── qa-test/
│   │   ├── SOUL.md
│   │   ├── AGENTS.md
│   │   └── MEMORY.md
│   └── qa-report/
│       ├── SOUL.md
│       ├── AGENTS.md
│       └── MEMORY.md
│
├── skills/                             ← Workspace-level skills
│   └── (various skills)
│
└── scripts/                            ← Helper scripts
    ├── validate-setup.sh
    ├── install.sh
    └── test-installation.sh
```


## 🚫 Rules

### ❌ Never Do This
```
workspace/report.md              ← Wrong! Goes to docs/ or projects/
workspace/test-plan-123.md       ← Wrong! Goes to projects/test-plans/
workspace/screenshot.png         ← Wrong! Goes to projects/screenshots/
workspace/setup-guide.md         ← Wrong! Goes to docs/
```

### ✅ Always Do This

**Documentation:**
```
docs/multi-agents/SETUP-GUIDE.md          ← Setup documentation
docs/troubleshooting/common-issues.md     ← Troubleshooting guides
docs/workflows/test-workflow.md           ← Workflow documentation
```

**Project artifacts:**
```
projects/test-reports/BCIN-1234/execution-report.md
projects/test-plans/BCIN-1234/test-plan.md
projects/screenshots/BCIN-1234/TC-01-success.png
projects/jira-exports/2026-02-23-issues.json
```

## 📂 Directory Rules

### docs/ - Documentation
**Purpose:** All documentation, guides, references, and setup instructions

**Structure:**
```
docs/
├── multi-agents/              ← Multi-agent setup docs (already created)
├── workflows/                 ← Workflow guides
├── troubleshooting/           ← Issue resolution
├── api/                       ← API documentation
└── references/                ← Reference materials
```

**What goes here:**
- Setup guides
- User manuals
- API documentation
- Architecture docs
- Troubleshooting guides
- Reference materials

**What does NOT go here:**
- Test plans (→ projects/test-plans/)
- Test reports (→ projects/test-reports/)
- Screenshots (→ projects/screenshots/)

### projects/ - Project Artifacts
**Purpose:** All test-related deliverables and work products

**Structure:**
```
projects/
├── test-reports/              ← Test execution & summary reports
│   ├── BCIN-1234/
│   │   ├── execution-report.md
│   │   ├── summary-report.md
│   │   └── bugs/
│   │       └── bug-TC-02.md
│   └── daily/
│       └── YYYY-MM-DD.md
├── test-plans/                ← Test plan documents
│   ├── BCIN-1234/
│   │   ├── test-plan.md
│   │   └── requirements.md
│   └── feature-login/
│       └── test-plan.md
├── jira-exports/              ← Jira issue exports
│   ├── YYYY-MM-DD.json
│   └── BCIN-1234.json
├── ci-reports/                ← Jenkins/CI reports
│   ├── YYYY-MM-DD/
│   └── job-failures.json
└── screenshots/               ← Test screenshots
    └── BCIN-1234/
        ├── TC-01-login-success.png
        ├── TC-02-invalid-creds-fail.png
        └── TC-02-console.txt
```

**Subdirectory organization:**
- **By issue key:** `projects/test-reports/BCIN-1234/`
- **By feature:** `projects/test-plans/login-flow/`
- **By date:** `projects/ci-reports/2026-02-23/`

### memory/ - Daily Logs (Shared)
```
memory/
└── YYYY-MM-DD.md              ← One file per day
```

**What goes here:**
- Daily activity logs (all agents write here)
- Decisions made
- Important events
- Context for future reference

**What does NOT go here:**
- Long-term agent memory (→ agents/\<id\>/MEMORY.md)
- Test reports (→ projects/test-reports/)
- Documentation (→ docs/)

### agents/ - Per-Agent Definitions
```
agents/<agent-id>/
├── SOUL.md                    ← Personality (required)
├── AGENTS.md                  ← Operating instructions (required)
├── MEMORY.md                  ← Long-term memory (required)
└── HEARTBEAT.md               ← Proactive checks (qa-daily only)
```

**Do NOT modify these files unless:**
- Updating agent personality
- Improving workflow instructions
- Recording learnings in MEMORY.md

### scripts/ - Helper Scripts
```
scripts/
├── validate-setup.sh
├── install.sh
├── test-installation.sh
└── (custom scripts)
```

**What goes here:**
- Automation scripts
- Helper utilities
- Installation scripts
- Validation scripts

---

## 🔍 Finding Files

When asked to "create a report" or "save a screenshot", follow this decision tree:

### Is it documentation?
→ **docs/** (setup guides, API docs, troubleshooting)

### Is it a test artifact?
→ **projects/** (test plans, reports, screenshots)
  - Test plan? → `projects/test-plans/<issue-key>/`
  - Test report? → `projects/test-reports/<issue-key>/`
  - Screenshot? → `projects/screenshots/<issue-key>/`
  - Jira export? → `projects/jira-exports/`
  - CI report? → `projects/ci-reports/`

### Is it a daily log?
→ **memory/YYYY-MM-DD.md**

### Is it agent-specific learning?
→ **agents/\<agent-id\>/MEMORY.md**

### Is it a script?
→ **scripts/**

---

## 📋 Before Creating ANY File

**Ask yourself:**
1. What type of file is this? (doc, test artifact, log, script)
2. Which folder does it belong to? (docs, projects, memory, agents, scripts)
3. Should it be in a subdirectory? (issue key, date, feature)
4. What naming convention should I use? (descriptive, consistent)

**Then:**
1. Determine the correct folder (docs/ or projects/)
2. Create subdirectory if needed (BCIN-1234/, 2026-02-23/, etc.)
3. Use descriptive filename
4. Save to the correct location

---

## 🧹 Cleanup

Periodically review and archive old files:

```bash
# Archive old test reports (quarterly)
mkdir -p projects/archive/2026-Q1
mv projects/test-reports/2026-01-* projects/archive/2026-Q1/

# Archive old CI reports (monthly)
mkdir -p projects/ci-reports/archive/2026-01
mv projects/ci-reports/2026-01-* projects/ci-reports/archive/2026-01/
```

---

## ✅ Quick Reference

| Type | Location | Example |
|------|----------|---------|
| **Setup doc** | `docs/multi-agents/` | SETUP-GUIDE.md |
| **API doc** | `docs/api/` | rest-api.md |
| **Troubleshooting** | `docs/troubleshooting/` | common-issues.md |
| **Test plan** | `projects/test-plans/<key>/` | test-plan.md |
| **Test report** | `projects/test-reports/<key>/` | execution-report.md |
| **Screenshot** | `projects/screenshots/<key>/` | TC-01-success.png |
| **Jira export** | `projects/jira-exports/` | YYYY-MM-DD.json |
| **CI report** | `projects/ci-reports/` | YYYY-MM-DD/ |
| **Daily log** | `memory/` | YYYY-MM-DD.md |
| **Agent memory** | `agents/<id>/` | MEMORY.md |
| **Script** | `scripts/` | validate.sh |

**This structure is mandatory. Follow it always.**
