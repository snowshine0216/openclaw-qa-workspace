---
name: qa-daily-workflow
description: Daily QA workflow for test engineers. Covers morning routine, test execution, bug reporting with Jira, and daily summary. Use when starting daily QA work, logging bugs to Jira, or ending the day with test summaries.
homepage: https://github.com/naodeng/awesome-qa-prompt
metadata: {"clawdbot":{"emoji":"📋","requires":{"bins":["jira-cli","playwright-cli"],"env":[]}}}
---

# QA Daily Workflow Skill

Daily workflow for QA engineers covering morning planning through end-of-day summary.

## Morning Routine

### 1. Check Jira for Assigned Issues
```bash
jira issue list -a$(jira me) -s"To Do,In Progress"
```

### 2. Review Yesterday's Progress
```bash
jira issue list --created day -r$(jira me) --plain
```

### 3. Prioritize Today's Tasks
- Feature tests due this week
- Regression coverage needed
- Bug fixes to verify

## Test Execution Workflow

### For UI Testing (Playwright CLI)
```bash
# Open browser to feature
playwright-cli open https://target-app --headed

# Run test steps
playwright-cli snapshot  # Get element refs
playwright-cli click <ref>
playwright-cli type "input"
playwright-cli screenshot --filename=test-result.png
```

### For MicroStrategy Testing
Use `microstrategy-testing` skill for structured test execution with:
- Test spec file input
- Jira integration for requirements
- Checkpoint-based validation
- Screenshot snapshots

## Bug Reporting to Jira

### 1. Capture Bug Info
```bash
# Take screenshot
playwright-cli screenshot --filename=bug-$(date +%Y%m%d-%H%M%S).png

# Get console errors
jira issue view ISSUE-XXX --plain
```

### 2. File Bug
```bash
jira issue create --summary "Bug: [Feature] Description" \
  --type Bug \
  --priority High \
  --description "**Steps to Reproduce:**\n1. Navigate to X\n2. Click Y\n3. Observe Z\n\n**Expected:** X\n**Actual:** Y\n\n![screenshot](bug.png)"
```

### 3. Link to Feature
```bash
jira issue transition ISSUE-XXX --to="Open" --resolution="Unresolved"
```

## End of Day Summary

### 1. Compile Results
```bash
# Today's completed
jira issue list -sDone --created day -r$(jira me) --plain

# Open issues
jira issue list -s"To Do,In Progress" -a$(jira me)
```

### 2. Document Learnings
- New edge cases discovered
- Gaps in test coverage
- Automation opportunities

## Common Patterns

### Feature Testing Flow
1. Read requirements → `qa-daily-workflow`
2. Design test cases → `test-case-generator` (future)
3. Execute tests → Playwright CLI / MicroStrategy skill
4. Log bugs → Jira CLI
5. Report results → End of day summary

### Bug Verification Flow
1. Get bug details from Jira
2. Reproduce with Playwright CLI
3. Verify fix works
4. Update Jira status

## Integration Points

- **jira-cli skill**: Issue creation, viewing, transitions
- **playwright-cli**: UI testing and screenshots
- **microstrategy-testing**: Structured MicroStrategy tests
