# RCA Automation Workflow

**Automated Root Cause Analysis generation for customer defects.**

---

## 🚀 Quick Start

```bash
cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src
bash run-complete-rca-workflow.sh
```

**That's it!** The workflow will:
1. Fetch Jira issues requiring RCA
2. Collect GitHub PR data
3. Notify agent via Feishu
4. Agent spawns sub-agents to generate 25 RCAs
5. Update Jira Latest Status
6. Send completion notification

**Expected time:** 15-20 minutes for 25 issues

---

## 📋 What It Does

### Input
- Jira filter: `category = "requires_rca"`
- Fetches issue details, comments, PRs
- Downloads GitHub PR diffs

### Output
- 25 comprehensive RCA documents
- Jira Latest Status updated with RCA summaries
- Feishu notifications at key stages

### RCA Structure (9 sections)
1. Incident Summary
2. References (Jira, GitHub, ServiceNow, customers)
3. Timeline (UTC)
4. What Happened
5. Five Whys
6. Why It Was Not Discovered Earlier
7. Corrective Actions
8. Preventive Actions
9. Automation Status

---

## 📁 File Locations

**Scripts:**
```
src/run-complete-rca-workflow.sh  ← Master script (run this)
src/post-rca-workflow.sh          ← Post-processing (auto-triggered)
src/update-jira-latest-status.sh  ← Jira updates
```

**Outputs:**
```
output/rca/*.md                    ← Generated RCA documents
output/rca-manifest-*.json         ← RCA generation manifests
output/feishu-summary-*.md         ← Feishu notifications
```

---

## 📚 Documentation

- **[RCA-PROJECT-SUMMARY.md](./RCA-PROJECT-SUMMARY.md)** - Project overview & results
- **[COMPLETE-WORKFLOW-SUMMARY.md](./COMPLETE-WORKFLOW-SUMMARY.md)** - Detailed workflow documentation
- **[DAILY-CHECK-SETUP.md](./DAILY-CHECK-SETUP.md)** - Daily monitoring setup

---

## 🔧 Configuration

### Feishu Chat ID
Update in scripts:
```bash
FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"
```

### Jira Authentication
In `~/.bash_profile`:
```bash
export JIRA_USER="your.email@company.com"
export JIRA_TOKEN="your_atlassian_api_token"
```

### GitHub Authentication
```bash
gh auth login
```

---

## 🛠️ Troubleshooting

### No RCAs Generated?
- Check agent is running and monitoring Feishu
- Verify Feishu chat ID matches
- Check `output/rca-manifest-*.json` was created

### Jira Update Failed?
```bash
# Manual update
cd src
./update-jira-latest-status.sh <ISSUE_KEY> ../output/rca/<FILE>.md
```

### Test Individual Components
```bash
# Test data collection only
cd src
bash process-rca.sh

# Test Jira update only
./update-jira-latest-status.sh BCIN-7552 ../output/rca/BCIN-7552-rca.md

# Test Feishu send
node send-feishu-notification.js ../output/feishu-summary-final-*.md oc_f15b73b877ad243886efaa1e99018807
```

---

## 📊 Latest Run (2026-03-05)

| Metric | Result |
|--------|--------|
| Issues Processed | 25 |
| RCAs Generated | 25/25 ✅ |
| Jira Updates | 24/25 ✅ |
| Runtime | ~15 minutes |

**Issues:**
- BCIN (8), BCDA (7), BCED (2), BCEN (5), BCFR (3)

**One failure:**
- BCIN-6936: Content too large for Jira field

---

## 🎯 Workflow Architecture

```
User runs script
       ↓
Data Collection (bash)
       ↓
Feishu Notification → Agent
       ↓
Agent spawns 25 sub-agents (5 batches)
       ↓
Sub-agents generate RCAs
       ↓
Agent runs post-workflow
       ↓
Jira updates + Final notification
       ↓
Done! ✅
```

---

**Status:** ✅ Fully Operational  
**Last Updated:** 2026-03-05 18:36 UTC
