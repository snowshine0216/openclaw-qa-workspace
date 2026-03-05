# 🎯 Complete RCA Automation Workflow - Final Summary

**Setup Date:** 2026-03-05  
**Status:** ✅ Fully Operational

---

## 📋 Components Created

### 1. Data Collection Scripts

#### `fetch-xuyin-rca.sh`
- **Purpose:** Fetch defects requiring RCA for Xue, Yin specifically
- **Filter:** `category = "requires_rca"` AND `proposed_owner = "Xue, Yin"`
- **Output:** `output/rca-xuyin-<timestamp>.json`
- **Current Count:** 2 defects

#### `fetch-rca.sh`
- **Purpose:** Fetch ALL defects requiring RCA (no owner filter)
- **Filter:** `category = "requires_rca"` (no proposed_owner filter)
- **Output:** `output/rca-all-<timestamp>.json`
- **Current Count:** 25 defects

#### `process-rca.sh`
- **Purpose:** Full data collection for RCA generation
- **Steps:**
  1. Run fetch script
  2. Fetch Jira details (description, comments, metadata)
  3. Extract GitHub PR URLs from comments
  4. Fetch PR diffs using `gh` CLI
  5. Check automation status
  6. Prepare input for AI agent RCA generation

---

### 2. RCA Generation

#### AI Agent (Me!)
- **Input:** Jira description + PR diffs + metadata
- **Output:** Comprehensive RCA with 9 sections:
  1. Incident Summary
  2. References
  3. Timeline (UTC)
  4. What Happened
  5. Five Whys
  6. Why It Was Not Discovered Earlier
  7. Corrective Actions
  8. Preventive Actions
  9. Automation Status

#### Generated RCAs
- **BCIN-5286:** Discussion thread disabled (9.2KB)
- **BCIN-6936:** Data auto-retrieval from templates (12.2KB)
- **BCIN-6936-short:** Condensed version (3KB) - for Jira content limits

---

### 3. Markdown to ADF Conversion

#### `markdown-to-adf.js`
- **Purpose:** Convert RCA markdown to Atlassian Document Format
- **Features:**
  - ✅ Headings (H1-H6)
  - ✅ Bold/italic/code formatting
  - ✅ Bullet and numbered lists
  - ✅ Tables with headers
  - ✅ Code blocks with syntax
  - ✅ Horizontal rules
  - ✅ Links with href
- **Result:** Beautiful formatting in Jira Latest Status field!

---

### 4. Jira Integration

#### `update-jira-latest-status.sh`
- **Purpose:** Update Jira customfield_10050 (Latest Status) with RCA
- **Authentication:** Basic auth (username:token)
- **Process:**
  1. Convert markdown to ADF
  2. Add timestamp header
  3. Fetch current Latest Status
  4. Append new ADF content
  5. Update via REST API
- **Status:** ✅ Both issues updated successfully

#### Results
- **BCIN-5286:** 119 ADF content blocks (full RCA)
- **BCIN-6936:** 343 ADF content blocks (condensed RCA + existing content)

---

### 5. Daily Monitoring

#### `daily-rca-check.sh`
- **Purpose:** Daily check of all defects requiring RCA
- **Steps:**
  1. Fetch all RCA defects (no filter)
  2. Group by proposed_owner
  3. Generate summary with top 10 issues
  4. Create Feishu notification file
  5. Log results

#### `cron-daily-rca-check.sh`
- **Purpose:** Cron wrapper with randomization
- **Randomization:** 0-30 minutes delay
- **Ensures:** Avoids exact 8 AM peak load

#### Cron Job
```bash
0 8 * * * cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src && ./cron-daily-rca-check.sh >> ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/logs/cron-$(date +\%Y\%m\%d).log 2>&1
```
**Schedule:** Daily at 8:00 AM Asia/Shanghai (±30 min)  
**Status:** ✅ Installed and verified

---

### 6. Feishu Integration

#### Notification Flow
1. Cron job runs daily check
2. Summary saved to: `output/feishu-daily-summary-YYYYMMDD.md`
3. Heartbeat detects pending notification (files < 2 hours old)
4. AI agent reads summary and sends to Feishu
5. File moved to: `output/sent/` folder

#### Current Notifications
- **Sent:** 3 messages to `oc_f15b73b877ad243886efaa1e99018807`
- **Content:** Daily summaries with owner breakdown + top 10 issues

---

## 📊 Current Status (2026-03-05)

### Defects Requiring RCA
**Total:** 25

**By Owner:**
- Shuai, Xiong: 10
- Peipei, Chen: 5
- Lingping, Zhu: 4
- Xue, Yin: 2
- Xuejie, Zhang: 2
- Yaoli, Li: 2

### RCAs Generated
- ✅ BCIN-5286 (Collaboration - Discussion thread)
- ✅ BCIN-6936 (Report Editor - Template data retrieval)

---

## 🔄 Workflows

### Manual RCA Generation (On-Demand)
```bash
cd projects/rca-daily/src

# 1. Fetch specific owner's defects
./fetch-xuyin-rca.sh

# 2. Collect data
./process-rca.sh

# 3. [AI Agent generates RCAs]

# 4. Update Jira
./update-jira-latest-status.sh <ISSUE_KEY> ../output/rca/<ISSUE_KEY>-rca.md

# 5. Send Feishu summary
# (via message tool or heartbeat detection)
```

### Automated Daily Check
```
8:00 AM Asia/Shanghai (every day)
  ↓
Cron triggers with 0-30 min randomization
  ↓
Fetch all RCA defects (no filter)
  ↓
Generate summary by owner
  ↓
Save summary to output/
  ↓
Heartbeat detects pending notification
  ↓
AI agent sends to Feishu
  ↓
File archived to sent/
```

---

## 📁 File Structure

```
projects/rca-daily/
├── src/
│   ├── fetch-xuyin-rca.sh          # Fetch Xue Yin's RCA defects
│   ├── fetch-rca.sh                # Fetch all RCA defects (NEW)
│   ├── process-rca.sh              # Collect Jira + GitHub data
│   ├── update-jira-latest-status.sh # Update Jira Latest Status
│   ├── markdown-to-adf.js          # MD→ADF converter (NEW)
│   ├── daily-rca-check.sh          # Daily monitoring script (NEW)
│   ├── cron-daily-rca-check.sh     # Cron wrapper (NEW)
│   └── send-feishu-notification.js # Feishu sender helper
├── output/
│   ├── rca/
│   │   ├── BCIN-5286-rca.md        # Full RCA
│   │   ├── BCIN-6936-rca.md        # Full RCA
│   │   └── BCIN-6936-rca-short.md  # Condensed RCA
│   ├── sent/                        # Archived Feishu notifications
│   ├── logs/                        # Execution logs
│   ├── rca-xuyin-*.json             # Xue Yin's defects
│   ├── rca-all-*.json               # All RCA defects (NEW)
│   ├── jira-*.json                  # Jira details
│   ├── pr-data-*.txt                # GitHub PR diffs
│   └── feishu-daily-summary-*.md   # Daily summaries (NEW)
├── RCA-PROJECT-SUMMARY.md           # Initial project summary
└── DAILY-CHECK-SETUP.md             # Daily check documentation (NEW)
```

---

## 🧪 Testing Results

### ✅ Completed Tests

1. **Fetch Scripts**
   - fetch-xuyin-rca.sh: 2 defects ✅
   - fetch-rca.sh: 25 defects ✅

2. **Data Collection**
   - Jira API integration: ✅
   - GitHub PR extraction: ✅
   - PR diff fetching: ✅

3. **RCA Generation**
   - BCIN-5286: 9 sections, proper analysis ✅
   - BCIN-6936: 9 sections, proper analysis ✅

4. **MD→ADF Conversion**
   - Headings, lists, tables, code blocks: ✅
   - Proper formatting in Jira: ✅

5. **Jira Updates**
   - BCIN-5286: 119 content blocks ✅
   - BCIN-6936: 343 content blocks ✅
   - Beautiful rendering: ✅

6. **Daily Check**
   - Script execution: ✅
   - Summary generation: ✅
   - Owner grouping: ✅

7. **Cron Job**
   - Installation: ✅
   - Manual trigger: ✅
   - Log output: ✅

8. **Feishu Notifications**
   - Summary sent: ✅ (3 times)
   - Proper formatting: ✅
   - Heartbeat integration: ✅

---

## 🚀 Next Steps

### Immediate (Optional)
1. Monitor tomorrow's 8 AM cron execution
2. Verify Feishu notification via heartbeat
3. Check log files for any errors

### Future Enhancements
1. **RCA Templates:** Create templates for different defect categories
2. **Automation Detection:** Improve PR keyword detection
3. **Batch Processing:** Support multiple issues at once
4. **Email Notifications:** Add email option alongside Feishu
5. **Dashboard:** Create web UI for RCA tracking
6. **AI Improvements:** Fine-tune RCA generation prompts

---

## 📞 Support

### Manual Commands

**Check cron job:**
```bash
crontab -l
```

**View latest log:**
```bash
tail -100 projects/rca-daily/output/logs/daily-rca-check-$(date +%Y%m%d).log
```

**Test daily check:**
```bash
cd projects/rca-daily/src && ./daily-rca-check.sh
```

**Update Jira manually:**
```bash
cd projects/rca-daily/src
./update-jira-latest-status.sh <ISSUE_KEY> ../output/rca/<FILE>.md
```

### Troubleshooting

**Cron not running?**
```bash
# Check cron service
launchctl list | grep cron

# Check cron logs
tail -50 /var/mail/$USER
```

**Jira update fails?**
```bash
# Verify authentication
source ~/.bash_profile
jira issue view BCIN-5286 --raw | jq '.key'
```

**No Feishu notification?**
```bash
# Check pending notifications
find projects/rca-daily/output -name "feishu-daily-summary-*.md" -mmin -120
```

---

**Setup Complete:** 2026-03-05 17:10 UTC  
**Status:** ✅ Fully Operational  
**Next Automatic Run:** 2026-03-06 ~08:00 Asia/Shanghai
