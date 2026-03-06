# Robust Agent Design Examples

This document lists practical patterns and examples for implementing the `robust-agent-design` skill in your agents.

## 1. Heartbeat Example

**Scenario**: Processing an extracted list of 40 GitHub PR diffs.

**Implementation**: 
Monitor time elapsed in the processing loop.
```bash
start_time=$(date +%s)
for pr in \${pr_list[@]}; do
  process_pr "$pr"
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  if [ "$elapsed" -ge 60 ]; then
    echo "Heartbeat: Currently analyzing progress... Processed $_count/40 PR diffs."
    start_time=$current_time # Reset timer
  fi
done
```

## 2. Artifact Checkpointing Example

**Scenario**: A network failure interrupted the Jira JQL fetch midway.

**Implementation**: 
Always check for a local artifact before invoking `jira-cli`.
```javascript
const RAW_FILE = 'projects/<domain_name>/context/jira_issues.json';
if (fs.existsSync(RAW_FILE)) {
  console.log("Loading previously fetched Jira issues from checkpoint...");
  return JSON.parse(fs.readFileSync(RAW_FILE));
} else {
  const data = await jiraCli.fetchJql(query);
  fs.writeFileSync(RAW_FILE, JSON.stringify(data));
  return data;
}
```

## 3. Human-in-the-Loop Gateway Example

**Scenario**: An orchestrator is about to publish a `REPORT_DRAFT.md` to Confluence.

**Implementation**:
```markdown
# Phase 3: Review and Publish

The report draft has been generated and saved to `projects/<domain_name>/REPORT_DRAFT.md`.
Please review the contents.

If the draft is acceptable, you may provide explicit approval:
"approve: Proceed with Confluence publish"

Otherwise, let me know what changes are needed before publishing, or if you prefer to send it via Feishu.
```

## 4. Sub-Agent Spawning Example

**Scenario**: You have 15 linked Jira defects.

**Implementation**:
Orchestrate a controlled map-limit or pooled concurrency to fetch diffs.
```python
import concurrent.futures

# Max 5 parallel agent executions
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(spawn_pr_analyzer_agent, issue) for issue in jira_issues]
    for future in concurrent.futures.as_completed(futures):
        result = future.result()
        save_intermediate_pr_impact(result)
```
