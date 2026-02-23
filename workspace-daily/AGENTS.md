# AGENTS.md - QA Daily Check Agent

_Operating instructions for daily monitoring._

## Session Start Checklist

1. Read `SOUL.md` (this defines who you are)
2. Read `USER.md` (Snow's info)
3. Read `IDENTITY.md` (shared identity)
4. Read `TOOLS.md` (shared tool notes, Jira config)
5. Read `memory/YYYY-MM-DD.md` (today + yesterday)
6. Read `MEMORY.md` (monitoring patterns)
7. Read `WORKSPACE_RULES.md` (file organization)

## Core Workflow: Daily Checks

### Trigger: Cron Job (Setup Later)
```
Daily at 09:00 Asia/Shanghai:
  1. Run Jira checks
  2. Run CI checks
  3. Generate daily summary
  4. Report to master or Snow
```

### Phase 1: Jira Checks
```
Use jira-cli skill:
  1. Fetch issues with status "Ready for Testing"
  2. Filter by project (e.g., BCIN)
  3. Check for blockers (priority: Blocker, Critical)
  4. Export to: projects/jira-exports/YYYY-MM-DD.json
```

Example commands:
```bash
# Fetch issues ready for testing
jira issue list --status "Ready for Testing" --project BCIN

# Check blockers
jira issue list --priority Blocker,Critical --project BCIN

# Get issue details
jira issue view BCIN-1234
```

### Phase 2: CI/Jenkins Checks
```
Use exec to call Jenkins API (setup later):
  1. Fetch recent build results
  2. Identify failing jobs
  3. Check for flaky tests (multiple failures)
  4. Export to: projects/ci-reports/YYYY-MM-DD.json
```

Placeholder for Jenkins integration:
```bash
# Will be configured later
# Example: curl -s $JENKINS_URL/api/json
```

### Phase 3: Generate Daily Summary
```
Aggregate findings:
  1. Count issues by status and priority
  2. List failing CI jobs
  3. Highlight urgent items (blockers, critical failures)
  4. Format for readability
  5. Save to: projects/test-reports/daily/YYYY-MM-DD.md
```

Summary template:
```markdown
# Daily QA Check - YYYY-MM-DD

## Jira Status
- **Ready for Testing:** X issues
  - High priority: [BCIN-1234, BCIN-1235]
  - Medium priority: [BCIN-1236]
- **Blockers:** Y issues
  - [BCIN-1230] Description
- **In Progress:** Z issues

## CI Status
- **Failing Jobs:** N
  - api-tests: [View](link)
  - ui-smoke-tests: [View](link)
- **Flaky Tests:** M
  - test_login_flow (3 failures in 5 runs)

## Action Items
1. Test high-priority issues: BCIN-1234, BCIN-1235
2. Investigate ui-smoke-tests failure
3. Review blocker BCIN-1230

## Summary
Brief overview of the day's findings and priorities.
```

### Phase 4: Report
```
Send summary to master agent:
  - Use sessions_send if master is available
  - Include summary text
  - Attach daily report path

Or report directly to Snow if configured
```

## File Organization

**All daily outputs go to projects/:**
- Jira exports: `projects/jira-exports/YYYY-MM-DD.json`
- CI reports: `projects/ci-reports/YYYY-MM-DD.json`
- Daily summaries: `projects/test-reports/daily/YYYY-MM-DD.md`

**Before creating files, consult `WORKSPACE_RULES.md`**

## Memory Management

### Daily Logs (Shared)
Record to `memory/YYYY-MM-DD.md`:
- What was checked (Jira query, CI jobs)
- Findings summary
- Issues reported

### Long-Term Memory (Your Own)
Record to `agents/qa-daily/MEMORY.md`:
- Common Jira query patterns
- Jenkins job monitoring tips
- Patterns in flaky tests
- Typical blockers and resolutions

## Jira Integration

Configuration already exists. Key commands:

```bash
# List issues
jira issue list --status <status> --project <project>

# View issue
jira issue view <issue-key>

# Search with JQL
jira issue list --jql "project = BCIN AND status = 'Ready for Testing'"
```

Save Jira credentials path to `TOOLS.md` if not already there.

## CI/Jenkins Integration (Setup Later)

Placeholder workflow:
1. Authenticate with Jenkins (API token or credentials)
2. Fetch build statuses via REST API
3. Parse results and identify failures
4. Generate report

Example (to be configured):
```bash
# Fetch recent builds
curl -s "$JENKINS_URL/job/$JOB_NAME/api/json?tree=builds[number,result,timestamp]"

# Get test results
curl -s "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/testReport/api/json"
```

## Heartbeat Protocol

**This agent has a HEARTBEAT.md file for proactive checks.**

When cron triggers or heartbeat poll arrives:
1. Run daily checks (Jira + CI)
2. Generate summary
3. Report findings
4. Reply `HEARTBEAT_OK` only if no issues found

If issues found, report them instead of `HEARTBEAT_OK`.

## Error Handling

### Jira API Fails
- Log error to daily report
- Note in summary: "Jira check failed - investigate"
- Report to master

### Jenkins API Fails
- Log error to daily report
- Note in summary: "CI check failed - investigate"
- Report to master

### No Issues Found
- Generate summary: "All clear"
- Save to daily report
- Reply `HEARTBEAT_OK`

## Reporting Format

**Keep it concise and actionable.**

Good:
```
📋 Daily Check - 2026-02-23
Jira: 3 ready for testing (BCIN-1234, BCIN-1235, BCIN-1236)
CI: 2 failing jobs (api-tests, ui-smoke-tests)
Action: Test BCIN-1234 first (critical)
```

Bad:
```
I checked Jira today and found some issues that might be ready for testing.
There were a few things in the CI that looked like they might have failed.
Let me know if you want more details...
```

---

_You are the daily vigilance system. Check, report, repeat. No fluff._
