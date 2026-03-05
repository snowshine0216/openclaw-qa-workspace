# RCA Automation Project Summary

## ✅ Completed Tasks

### 1. Data Collection Scripts
- ✅ `fetch-xuyin-rca.sh` - Fetches customer defects requiring RCA for Xue, Yin
- ✅ `fetch-rca.sh` - Fetches ALL customer defects requiring RCA (no owner filter)
- ✅ `process-rca.sh` - Collects Jira details and GitHub PR diffs

### 2. RCA Generation (AI Agent-Based)
- ✅ Agent spawning system with 5-concurrent limit batching
- ✅ Automatic sub-agent orchestration for parallel RCA generation
- ✅ Generated 25 comprehensive RCAs with 9-section structure

### 3. Complete Workflow Automation
- ✅ `run-complete-rca-workflow.sh` - Master orchestration script
  - Runs data collection
  - Creates RCA manifest
  - **Sends Feishu notification to trigger agent**
  - Agent automatically spawns sub-agents
  - Agent runs post-workflow (Jira update + final notification)

### 4. Jira Integration
- ✅ `update-jira-latest-status.sh` - Updates customfield_10050 (Latest Status)
- ✅ `markdown-to-adf.js` - Converts markdown RCAs to Atlassian Document Format
- ✅ Batch update support for multiple issues

### 5. Feishu Reporting
- ✅ Automatic notifications at workflow stages:
  - Data collection complete → triggers agent
  - RCA generation complete → final summary
- ✅ Rich markdown formatting with tables and links

### 6. Post-Workflow Script
- ✅ `post-rca-workflow.sh` - Runs after RCA generation
  - Updates Jira Latest Status for all issues
  - Generates final Feishu summary
  - Sends completion notification

---

## 📁 File Structure

```
projects/rca-daily/
├── src/
│   ├── fetch-xuyin-rca.sh              # Fetch filtered defects (Xue Yin)
│   ├── fetch-rca.sh                    # Fetch all RCA defects
│   ├── process-rca.sh                  # Collect Jira + GitHub data
│   ├── run-complete-rca-workflow.sh    # ⭐ Master orchestration script (AUTO)
│   ├── post-rca-workflow.sh            # Post-processing after RCA generation
│   ├── update-jira-latest-status.sh    # Update Jira Latest Status
│   ├── markdown-to-adf.js              # Markdown → ADF converter
│   ├── generate-rcas-via-agent.js      # Agent manifest reader helper
│   └── send-feishu-notification.js     # Feishu sender helper
└── output/
    ├── rca/                             # Generated RCA documents (25 files)
    ├── logs/                            # Execution logs
    ├── sent/                            # Archived Feishu notifications
    ├── rca-manifest-*.json              # RCA generation manifests
    ├── rca-input-*.json                 # Input data for RCA generation
    ├── jira-*.json                      # Jira issue details
    ├── pr-data-*.txt                    # GitHub PR diffs
    └── feishu-summary-*.md              # Feishu reports
```

---

## 🔄 Automated Workflow

### Complete End-to-End Flow

```
1. Run: bash run-complete-rca-workflow.sh
   ↓
2. Data Collection (bash)
   - Fetch Jira issues requiring RCA
   - Download GitHub PR diffs
   - Create RCA input JSON files
   - Generate manifest file
   ↓
3. Feishu Notification (bash → Feishu)
   - "RCA Workflow Ready: N issues"
   - Agent receives notification
   ↓
4. Agent Spawning (AI Agent)
   - Agent reads manifest
   - Spawns N sub-agents (5 concurrent batches)
   - Each sub-agent generates 1 RCA
   - Auto-announces completion
   ↓
5. Post-Workflow (Agent → bash)
   - Agent runs: bash post-rca-workflow.sh <timestamp>
   - Updates Jira Latest Status (N issues)
   - Generates final summary
   - Sends Feishu completion notification
   ↓
6. Done! ✅
```

### Key Features

✅ **Fully Automated** - Single command triggers everything  
✅ **Agent-Driven** - AI agent handles parallel RCA generation  
✅ **Batch Processing** - 5 concurrent sub-agents (handles rate limits)  
✅ **Automatic Notification** - Feishu updates at key stages  
✅ **Error Handling** - Graceful fallbacks for CLI failures  
✅ **Audit Trail** - Complete logging and manifest tracking

---

## 🚀 How to Run

### One Command (Recommended)
```bash
cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src
bash run-complete-rca-workflow.sh
```

**What happens:**
1. Data collection runs automatically
2. Manifest created with all issues
3. Feishu notification sent to agent
4. **Agent automatically continues:**
   - Reads manifest
   - Spawns sub-agents for RCA generation
   - Runs post-workflow script
   - Sends final notification

### Manual Control (Advanced)
```bash
# Step 1: Data collection only
bash run-complete-rca-workflow.sh
# (pauses, waiting for agent)

# Step 2: Agent processes manifest
# (agent detects notification and continues)

# Step 3: Post-workflow (run manually if needed)
bash post-rca-workflow.sh <timestamp>
```

---

## 📊 Latest Run Results (2026-03-05)

### Issues Processed: 25

**By Product:**
- BCIN (8): 7552, 7236, 5286, 6936, 6663, 5279, 5281, 6707
- BCDA (7): 8620, 8020, 8344, 8273, 8065, 7912, 6709
- BCED (2): 4471, 4728
- BCEN (5): 5173, 5204, 5116, 4825, 3780
- BCFR (3): 3595, 3343, 3241

### Results

| Metric | Value |
|--------|-------|
| RCAs Generated | 25/25 ✅ |
| Jira Updates | 24/25 ✅ |
| Feishu Notifications | 2 (trigger + complete) ✅ |
| Total Runtime | ~15 minutes |
| Sub-agents Spawned | 25 (5 batches) |

### Failures

- **BCIN-6936:** Jira update failed (content limit exceeded - RCA too large)
- **Resolution:** Created shorter version: `BCIN-6936-rca-short.md`

---

## 🎯 Sample RCA Structure

Each generated RCA includes:

1. **Incident Summary** - Brief overview
2. **References** - Jira, GitHub PRs, ServiceNow cases, customers
3. **Timeline (UTC)** - Key events chronologically
4. **What Happened** - Detailed description from Jira + PR analysis
5. **Five Whys** - Root cause analysis using PR diffs
6. **Why It Was Not Discovered Earlier** - Testing/monitoring gaps
7. **Corrective Actions** - Immediate fixes from PRs
8. **Preventive Actions** - Long-term improvements
9. **Automation Status** - Test coverage analysis

---

## ⚠️ Configuration

### Feishu Chat ID
Update in script:
```bash
FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"
```

### Jira Authentication
Set in `~/.bash_profile`:
```bash
export JIRA_USER="your.email@company.com"
export JIRA_TOKEN="your_atlassian_api_token"
```

### GitHub Authentication
```bash
gh auth login
```

---

## 🔧 Troubleshooting

### Agent Doesn't Continue After Notification

**Check:**
1. Agent is running and monitoring Feishu
2. Feishu chat ID is correct
3. OpenClaw message tool is configured

**Manual Trigger:**
```bash
# Agent manually processes manifest
# (read manifest file, spawn sub-agents, run post-workflow)
```

### Jira Update Fails

**Common causes:**
- Content too large (> Jira field limit)
- Authentication expired
- Network issues

**Solution:**
```bash
# Create shorter RCA version
# Update manually via Jira UI
```

### Sub-Agent Failures

**Check:**
```bash
# Agent can list recent sub-agents
# Check for error messages in completions
```

---

**Last Updated:** 2026-03-05 18:36 UTC  
**Status:** ✅ Fully Operational  
**Next Enhancement:** Automated daily monitoring with cron
