---
name: jira-cli
description: Interact with Atlassian Jira from the command line. Read issues, stories, bugs, and epics.
homepage: https://github.com/ankitpokhrel/jira-cli
metadata: {"clawdbot":{"emoji":"🔍"}}
---

# JiraCLI Skill

Interact with Atlassian Jira from the command line. Useful for reading issues, stories, bugs, and epics.

## Activate jira token

```bash
# macOS
source ~/.bash_profile 
```

## Key Commands

### View Issue Details
```bash
# View issue with comments
jira issue view ISSUE-1

# View with specific number of comments
jira issue view ISSUE-1 --comments 5
```

### List Issues
```bash
# List recent issues
jira issue list

# List issues in specific status
jira issue list -s"To Do"

# List issues by priority
jira issue list -yHigh

# List issues assigned to me
jira issue list -a$(jira me)

# Raw JSON output
jira issue list --raw

# Plain text output
jira issue list --plain
```

### Navigate
- `ENTER` - Open issue in browser
- `v` - View issue details
- `m` - Transition issue
- `q/ESC` - Quit

## Output Formats

| Flag | Format | Use Case |
|------|--------|----------|
| (default) | Interactive TUI | Browsing issues |
| `--plain` | Simple table | Script parsing |
| `--raw` | JSON | Programmatic use |
| `--csv` | CSV | Spreadsheets |

## Examples

```bash
# Get story details for testing
jira issue view STORY-123

# List high-priority bugs
jira issue list -tBug -yHigh -sOpen

# List issues created this week
jira issue list --created week -r$(jira me)
```

## Common Options

| Option | Description |
|--------|-------------|
| `-tTYPE` | Issue type (Bug, Story, Task, Epic) |
| `-sSTATUS` | Status (To Do, In Progress, Done) |
| `-yPRIORITY` | Priority (High, Medium, Low) |
| `-aASSIGNEE` | Assignee |
| `-rREPORTER` | Reporter |
| `-lLABEL` | Label |
| `--created TIME` | Created time (day, week, month) |
| `-pPROJECT` | Project key |

## Create Issue

```bash
# Create a defect
jira issue create -p PROJECT_KEY -t Defect -y High -s "Summary" -b "Description"

# Create with custom fields (BCIN/CIAD projects require Regression and Build Number)
jira issue create -p BCIN -t Defect -y High -s "Bug title" -b "Description" \
  --custom "customfield_10040=No" --custom "customfield_10044=N/A"

# Create and open in browser
jira issue create -p PROJECT -t Defect -y High -s "Summary" -b "Description" --web
```

## URL Format

### REST API (no /jira path)
- Server: `https://strategyagile.atlassian.net`
- API: `https://strategyagile.atlassian.net/rest/api/3/`

### Web UI
- Browse project: `https://strategyagile.atlassian.net/browse/PROJECT_KEY`
- Create issue: `https://strategyagile.atlassian.net/secure/CreateIssue.jspa?pid=PROJECT_ID&issuetype=ISSUE_TYPE_ID`

## Permission Notes
- Account must have "Create Issues" permission in the project
- If API returns "No permission", request access from Jira admin
- Use `jira open -p PROJECT_KEY` for web UI access

## Use This Skill When

- Reading Jira issue details for test planning
- Listing test cases or stories
- Getting acceptance criteria from issues
- Checking issue status and history
- Fetching requirements for UI testing
