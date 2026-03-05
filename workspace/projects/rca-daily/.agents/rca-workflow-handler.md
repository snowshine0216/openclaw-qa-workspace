# RCA Workflow - Agent Handler Guide

**For AI Agent (Atlas Daily) - How to Handle RCA Workflow Notifications**

---

## 📨 Trigger Detection

### Feishu Message Pattern
When you receive a message containing:
```
🤖 **RCA Workflow Ready**

Data collection complete for **N issues**.

**Manifest:** `rca-manifest-YYYYMMDD-HHMMSS.json`
**Timestamp:** YYYYMMDD-HHMMSS
```

**Action:** Automatically process the RCA manifest

---

## 🔄 Automated Response Workflow

### Step 1: Read Manifest
```bash
manifest_path="~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca-manifest-<timestamp>.json"
```

Parse JSON to extract:
- `total_issues`: Number of RCAs to generate
- `rca_inputs[]`: Array of input files and output paths

### Step 2: Spawn Sub-Agents (Batched)

For each issue in manifest:

```javascript
sessions_spawn({
  agentId: "reporter",
  label: "rca-<ISSUE_KEY>",
  mode: "run",
  runTimeoutSeconds: 300,
  runtime: "subagent",
  task: `Generate RCA for <ISSUE_KEY>. 
Input: <input_file_from_manifest> 
Output: <output_file_from_manifest>`
})
```

**Important:**
- Max 5 concurrent sub-agents
- Wait for batch completion before spawning next batch
- Sub-agents auto-announce when done

### Step 3: Run Post-Workflow

After all sub-agents complete:

```bash
timestamp=<from_manifest_filename>  # e.g., 20260305-174620
bash ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src/post-rca-workflow.sh $timestamp
```

Post-workflow script will:
- Update Jira Latest Status for all issues
- Generate final Feishu summary
- Send completion notification

---

## 📋 Sub-Agent Task Template

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

## 🛠️ Error Handling

### If Manifest File Not Found
```
❌ Cannot find manifest file: rca-manifest-<timestamp>.json
Checked: ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/
```

**Action:** Ask user to verify script completed successfully

### If Sub-Agent Fails
- Log the failure
- Continue with remaining sub-agents
- Report failed issues in final summary

### If Post-Workflow Fails
```bash
# Retry manually
bash ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/src/post-rca-workflow.sh <timestamp>
```

---

## 📊 Status Monitoring

### Check Sub-Agent Progress
```javascript
subagents(action: "list")
```

Shows:
- Active sub-agents
- Completed sub-agents
- Runtime and token usage

### Expected Timeline (25 issues)
- Batch 1 (5 agents): ~2 minutes
- Batch 2 (5 agents): ~2 minutes
- Batch 3 (5 agents): ~2 minutes
- Batch 4 (5 agents): ~2 minutes
- Batch 5 (5 agents): ~2 minutes
- Post-workflow: ~3 minutes
- **Total: ~13-15 minutes**

---

## ✅ Completion Checklist

After workflow completes:

- [ ] All N sub-agents completed successfully
- [ ] All N RCA files exist in `output/rca/`
- [ ] Post-workflow script executed
- [ ] Jira Latest Status updated (check for errors)
- [ ] Final Feishu notification sent
- [ ] Log any failures or issues

---

## 🔍 Quick Commands

### List Recent Manifests
```bash
ls -lt ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca-manifest-*.json | head -5
```

### Count Generated RCAs
```bash
ls -1 ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca/*.md | wc -l
```

### Check Latest RCAs
```bash
ls -lt ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/rca/*.md | head -10
```

### View Post-Workflow Log
```bash
tail -100 ~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/rca-daily/output/logs/post-rca-*.log
```

---

## 📝 Example Response

When notification received:

```
✅ RCA Workflow Triggered

Detected manifest: rca-manifest-20260305-174620.json
Issues to process: 25

Spawning sub-agents in batches...
Batch 1 (5/25): BCIN-7552, BCDA-8620, BCDA-8020, BCED-4728, BCEN-5173
```

After completion:

```
✅ RCA Workflow Complete

Generated: 25/25 RCAs
Jira Updates: 24/25 (1 failed: BCIN-6936 - content too large)
Runtime: 15 minutes

Final summary sent to Feishu.
```

---

**Last Updated:** 2026-03-05 18:36 UTC
