# 🎯 Complete RCA Automation Workflow - Final Summary

**Setup Date:** 2026-03-05  
**Status:** ✅ Fully Operational & Automated

---

## 📋 Workflow Overview

### Single-Command Execution

```bash
cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src
bash run-complete-rca-workflow.sh
```

**That's it!** The script:
1. Collects data (Jira + GitHub)
2. Creates RCA manifest
3. **Notifies agent via Feishu**
4. Agent spawns sub-agents to generate RCAs
5. Agent runs post-workflow (Jira updates + final notification)

---

## 🔄 Automated Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER: bash run-complete-rca-workflow.sh                 │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. BASH: Data Collection                                   │
│     • Fetch Jira issues (category = requires_rca)          │
│     • Download GitHub PR diffs                              │
│     • Create rca-input-*.json files                         │
│     • Generate rca-manifest-<timestamp>.json               │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. BASH → FEISHU: Trigger Notification                     │
│     Message: "RCA Workflow Ready: N issues"                 │
│     Target: Agent's Feishu chat                             │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. AGENT: Receives Notification                            │
│     • Detects manifest file                                 │
│     • Reads N issue keys                                    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. AGENT: Spawns Sub-Agents (Batched)                      │
│     • Batch 1: Spawn 5 sub-agents                           │
│     • Wait for batch completion                             │
│     • Batch 2: Spawn next 5                                 │
│     • ... repeat until all N issues processed               │
│     Each sub-agent:                                         │
│       - Reads rca-input-<issue>.json                       │
│       - Generates 9-section RCA                             │
│       - Saves to rca/<issue>-rca.md                        │
│       - Auto-announces completion                           │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. AGENT: Runs Post-Workflow                               │
│     bash post-rca-workflow.sh <timestamp>                   │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  7. BASH: Post-Processing                                   │
│     • Update Jira Latest Status (N issues)                  │
│     • Convert markdown to ADF format                        │
│     • Generate final summary                                │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  8. BASH → FEISHU: Completion Notification                  │
│     Summary table with all N issues:                        │
│     • Issue key + link                                      │
│     • Generation status                                     │
│     • Jira update status                                    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
                         ✅ DONE!
```

---

## 📊 Components & Scripts

### 1. Data Collection

#### `run-complete-rca-workflow.sh` ⭐ (Master Script)
**What it does:**
- Runs `process-rca.sh` for data collection
- Creates manifest file
- **Sends Feishu notification to agent**
- Exits (agent continues automatically)

**Usage:**
```bash
bash run-complete-rca-workflow.sh
```

#### `process-rca.sh`
**What it does:**
- Fetches Jira issues via `fetch-rca.sh`
- Downloads Jira details (description, comments, metadata)
- Extracts GitHub PR URLs from comments
- Fetches PR diffs using `gh` CLI
- Checks automation status
- Creates `rca-input-<issue>-<timestamp>.json` for each issue

**Output:**
```json
{
  "issue_key": "BCIN-7552",
  "jira_json_path": "output/jira-BCIN-7552-<timestamp>.json",
  "pr_data_path": "output/pr-data-BCIN-7552-<timestamp>.txt",
  "automation_status": "unknown",
  "pr_list": ["PR #8874", "PR #8881"],
  "rca_output_path": "output/rca/BCIN-7552-rca.md"
}
```

---

### 2. Agent RCA Generation

#### Agent Workflow
**Triggered by:** Feishu notification from `run-complete-rca-workflow.sh`

**Process:**
1. Reads manifest file: `rca-manifest-<timestamp>.json`
2. Extracts issue keys and input paths
3. Spawns sub-agents in batches of 5:
   ```javascript
   sessions_spawn({
     agentId: "reporter",
     label: "rca-BCIN-7552",
     mode: "run",
     runtime: "subagent",
     task: "Generate RCA for BCIN-7552. Input: ... Output: ..."
   })
   ```
4. Each sub-agent:
   - Reads `rca-input-<issue>.json`
   - Fetches full Jira data
   - Fetches GitHub PR diffs
   - Generates 9-section comprehensive RCA
   - Saves to `output/rca/<issue>-rca.md`
   - Auto-announces completion

**Sub-Agent Task Template:**
```
Generate RCA document for Jira issue <ISSUE_KEY>.

Input data file: <INPUT_JSON_PATH>
Output RCA file: <OUTPUT_MD_PATH>

Read the input JSON which contains:
- jira_json_path: full Jira issue details + comments
- pr_data_path: GitHub PR diffs and metadata
- automation_status: whether automated tests exist
- pr_list: list of related PRs

Generate a comprehensive RCA document following this structure:

## 1. Incident Summary
Brief overview of the defect

## 2. References
- Jira: <ISSUE_KEY>
- GitHub PRs: (list from input)
- Customer: (extract from Jira)

## 3. Timeline (UTC)
Key events chronologically

## 4. What Happened
Detailed description based on Jira description + PR analysis

## 5. Five Whys
Root cause analysis using PR diffs

## 6. Why It Was Not Discovered Earlier
Analysis of testing/monitoring gaps

## 7. Corrective Actions
Immediate fixes from PRs

## 8. Preventive Actions
Long-term improvements

## 9. Automation Status
- Automated: (from input)
- Related PRs: (from input)

Save output to the specified path.
```

---

### 3. Post-Workflow Processing

#### `post-rca-workflow.sh`
**Triggered by:** Agent after all sub-agents complete

**Usage:**
```bash
bash post-rca-workflow.sh <timestamp>
```

**What it does:**
1. **Updates Jira Latest Status:**
   - Reads all `rca/<issue>-rca.md` files
   - Calls `update-jira-latest-status.sh` for each
   - Converts markdown → ADF format
   - Updates Jira customfield_10050

2. **Generates Final Summary:**
   - Creates `feishu-summary-final-<timestamp>.md`
   - Table with all issues:
     - Issue key (linked)
     - Summary
     - Automation status
     - Generation status
     - Jira update status

3. **Sends Feishu Notification:**
   - Sends summary to configured chat
   - Marks workflow complete

---

### 4. Jira Integration

#### `update-jira-latest-status.sh`
**What it does:**
- Converts RCA markdown to ADF
- Fetches current Latest Status
- Appends new content
- Updates via Jira REST API

**Usage:**
```bash
./update-jira-latest-status.sh <ISSUE_KEY> <RCA_FILE>
```

**Example:**
```bash
./update-jira-latest-status.sh BCIN-7552 ../output/rca/BCIN-7552-rca.md
```

#### `markdown-to-adf.js`
**What it does:**
Converts markdown to Atlassian Document Format (ADF)

**Supported:**
- Headings (H1-H6)
- Bold, italic, code inline
- Bullet and numbered lists
- Tables with headers
- Code blocks with language
- Horizontal rules
- Links

---

## 📁 File Structure

```
projects/rca-daily/
├── src/
│   ├── run-complete-rca-workflow.sh    # ⭐ Master orchestration (AUTO)
│   ├── process-rca.sh                  # Data collection
│   ├── post-rca-workflow.sh            # Post-processing
│   ├── fetch-rca.sh                    # Fetch all RCA defects
│   ├── fetch-xuyin-rca.sh              # Fetch filtered defects
│   ├── update-jira-latest-status.sh    # Update Jira Latest Status
│   ├── markdown-to-adf.js              # MD → ADF converter
│   ├── generate-rcas-via-agent.js      # Helper for agent manifest reading
│   └── send-feishu-notification.js     # Feishu sender helper
└── output/
    ├── rca/                             # Generated RCA documents
    │   ├── BCIN-7552-rca.md
    │   ├── BCDA-8620-rca.md
    │   └── ... (25 total)
    ├── rca-manifest-<timestamp>.json    # RCA generation manifest
    ├── rca-input-<issue>-<timestamp>.json  # Input data per issue
    ├── jira-<issue>-<timestamp>.json    # Jira details per issue
    ├── pr-data-<issue>-<timestamp>.txt  # GitHub PR diffs per issue
    ├── feishu-summary-final-<timestamp>.md  # Final completion summary
    ├── logs/                            # Execution logs
    └── sent/                            # Archived notifications
```

---

## 🚀 Usage Guide

### Quick Start (Recommended)

```bash
cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src
bash run-complete-rca-workflow.sh
```

**Then:** Wait for Feishu completion notification (usually 10-20 minutes for 25 issues)

---

### Manual Step-by-Step (Advanced)

#### Step 1: Data Collection
```bash
bash run-complete-rca-workflow.sh
```
**Output:**
- `rca-input-*.json` files
- `rca-manifest-<timestamp>.json`
- Feishu notification sent

#### Step 2: Agent RCA Generation
**Automatic** - Agent detects notification and:
- Reads manifest
- Spawns sub-agents (5 concurrent batches)
- Waits for all completions

**Manual (if needed):**
```javascript
// In agent context:
// 1. Read manifest
// 2. Spawn sub-agents for each issue
// 3. Wait for completions
```

#### Step 3: Post-Workflow
**Automatic** - Agent runs after RCA generation complete

**Manual (if needed):**
```bash
TIMESTAMP=20260305-174620  # from manifest filename
bash post-rca-workflow.sh $TIMESTAMP
```

---

## 📊 Latest Run Results (2026-03-05 18:24 UTC)

### Issues Processed: 25

| Product | Count | Issues |
|---------|-------|--------|
| BCIN | 8 | 7552, 7236, 5286, 6936, 6663, 5279, 5281, 6707 |
| BCDA | 7 | 8620, 8020, 8344, 8273, 8065, 7912, 6709 |
| BCED | 2 | 4471, 4728 |
| BCEN | 5 | 5173, 5204, 5116, 4825, 3780 |
| BCFR | 3 | 3595, 3343, 3241 |

### Results

| Metric | Value |
|--------|-------|
| **RCAs Generated** | 25/25 ✅ |
| **Jira Updates** | 24/25 ✅ |
| **Feishu Notifications** | 2 (trigger + complete) ✅ |
| **Total Runtime** | ~15 minutes |
| **Sub-agents Spawned** | 25 (in 5 batches) |
| **Concurrent Limit** | 5 agents max |

### Known Issues

- **BCIN-6936:** Jira update failed (content limit exceeded)
  - RCA too large for Jira Latest Status field
  - Created shorter version: `BCIN-6936-rca-short.md`
  - Needs manual Jira update or attachment

---

## 🔧 Configuration

### Feishu Chat ID

Update in `run-complete-rca-workflow.sh` and `post-rca-workflow.sh`:
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

## 🛠️ Troubleshooting

### Issue: Agent Doesn't Continue After Notification

**Symptoms:**
- Script completes successfully
- Feishu notification sent
- But no RCAs generated

**Diagnosis:**
1. Check agent is running and monitoring Feishu
2. Verify Feishu chat ID matches agent's chat
3. Check OpenClaw message tool is configured

**Solution:**
```bash
# Manual trigger: Agent reads manifest and spawns sub-agents
# (agent context required)
```

---

### Issue: Sub-Agent Failures

**Symptoms:**
- Some RCAs not generated
- Sub-agent completion errors

**Diagnosis:**
```bash
# Check output directory
ls -l ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca/

# Agent can list recent sub-agents to check status
```

**Solution:**
- Check input JSON files exist
- Verify Jira/GitHub data is complete
- Re-run failed issues manually

---

### Issue: Jira Update Fails

**Symptoms:**
- RCAs generated successfully
- But Jira Latest Status not updated

**Common Causes:**
- Content too large (> Jira field limit)
- Authentication expired
- Network issues

**Solutions:**

1. **Content too large:**
   ```bash
   # Create shorter RCA version
   # Or attach RCA as file instead of inline
   ```

2. **Authentication:**
   ```bash
   # Test Jira auth
   jira issue view <ISSUE_KEY> --raw | jq '.key'
   ```

3. **Manual update:**
   ```bash
   ./update-jira-latest-status.sh <ISSUE_KEY> ../output/rca/<FILE>.md
   ```

---

### Issue: Feishu Notification Fails

**Symptoms:**
- "Bot/User can NOT be out of the chat" error

**Cause:**
- OpenClaw bot not in target Feishu chat

**Solution:**
- Add bot to chat `oc_f15b73b877ad243886efaa1e99018807`
- Or update chat ID in scripts

---

## 📈 Performance Metrics

### Typical Run (25 issues)

| Stage | Time | Notes |
|-------|------|-------|
| Data Collection | 2-3 min | Depends on Jira/GitHub API |
| Agent Spawning | <1 min | Batches of 5 |
| RCA Generation | 10-12 min | 5 concurrent agents |
| Jira Updates | 2-3 min | Sequential |
| **Total** | **15-20 min** | End-to-end |

### Resource Usage

| Resource | Usage |
|----------|-------|
| CPU | Low (mostly waiting on API calls) |
| Memory | Moderate (5 concurrent agents) |
| Network | High (Jira + GitHub + Feishu) |
| Tokens | ~100k (for 25 RCAs) |

---

## 🎯 Next Steps

### Immediate Monitoring
1. ✅ Workflow is fully automated
2. Monitor Feishu for completion notifications
3. Verify Jira updates in Latest Status field
4. Check RCA quality in `output/rca/` directory

### Future Enhancements

1. **Daily Cron Job**
   - Auto-run workflow daily at scheduled time
   - Already have `daily-rca-check.sh` for monitoring

2. **Improved Error Handling**
   - Retry logic for failed sub-agents
   - Automatic fallback for large RCAs

3. **Dashboard**
   - Web UI for RCA tracking
   - Historical trends

4. **Templates**
   - Category-specific RCA templates
   - Customizable sections

---

## 📞 Support Commands

### Check Recent Runs
```bash
ls -lt ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca-manifest-*.json | head -5
```

### View Latest RCAs
```bash
ls -lt ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca/*.md | head -10
```

### Test Jira Update
```bash
cd ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src
./update-jira-latest-status.sh BCIN-7552 ../output/rca/BCIN-7552-rca.md
```

### Manual Feishu Send
```bash
node send-feishu-notification.js ../output/feishu-summary-final-<timestamp>.md oc_f15b73b877ad243886efaa1e99018807
```

---

**Setup Complete:** 2026-03-05 18:36 UTC  
**Status:** ✅ Fully Operational & Automated  
**Next Run:** On-demand or scheduled via cron
