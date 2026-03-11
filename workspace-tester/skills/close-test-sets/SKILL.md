---
name: close-test-sets
description: Close test sets for a specific release version. Use when user wants to bulk close test sets assigned to them for a particular release, or mark test sets as done/pass. Typical triggers include "close test sets for release X", "mark test sets done for version Y", "finish test sets for release Z".
---

# Close Test Sets Skill

Bulk close test sets assigned to the current user for a specific release version.

## Workflow

### Step 1: Get Release Version

If the user provides a release version (e.g., "26.03", "26.04"), proceed to Step 2.

If no release version is specified, ask:
```
What release version should I close test sets for?
```

### Step 2: Search Test Sets

Run the search to find matching test sets (dry-run mode: lists without closing):

```bash
source ~/.agents/skills/jira-cli/.env && scripts/close_test_sets.sh <release-version> --dry-run
```

This displays all test sets without closing them.

**Important:** The script shows the test sets in a table format. Present this list to the user.

### Step 3: Confirm with User

Show the user the list of test sets found and ask:
```
Found [N] test sets for release [version]:
[Display the table output from the script]

Should I proceed to close all these test sets to "Done" status?
```

**Do not proceed without explicit user approval.**

### Step 4: Handle Exclusions

If the user wants to exclude specific test sets, they can specify issue keys (e.g., "exclude BCIN-7415").

Pass exclusions using the `--exclude` flag:
```bash
scripts/close_test_sets.sh <release-version> --exclude <issue-key>
```

Note: Only one exclusion is supported per run. For multiple exclusions, run the script multiple times or manually edit the list.

### Step 5: Close Test Sets

After user approval, close the test sets:

```bash
source ~/.agents/skills/jira-cli/.env && scripts/close_test_sets.sh <release-version> [--exclude <issue-key>]
```

The script will:
1. Fetch all test sets matching the criteria
2. Filter out excluded issues
3. Close each test set to "Done" status
4. Report success/failure summary

## Script Reference

### close_test_sets.sh

**Usage:**
```bash
close_test_sets.sh <release-version> [--exclude ISSUE-KEY]
```

**Parameters:**
- `release-version`: Required. The release version to filter test sets (e.g., "26.03")
- `--exclude ISSUE-KEY`: Optional. Exclude a specific issue key from being closed

**JQL Query:**
```
type = "Test Set" AND fixVersion = "<version>" AND assignee = currentUser()
```

**Status Transition:**
- Target status: "Done"
- Only transitions test sets currently in "To Do" status

**Output:**
- Displays found test sets in table format
- Reports success/failure for each issue
- Provides summary count

## Error Handling

### No Test Sets Found
If no test sets match the criteria, inform the user:
```
No test sets found for release version <version> assigned to you.
```

### Jira API Errors
If Jira API fails (token issues, permissions, etc.), report the error and suggest:
```
Jira API error: [error message]

Try running: source ~/.bash_profile
If that doesn't help, check your Jira token configuration.
```

### Partial Failures
If some test sets fail to close, report which ones failed and the count:
```
Closed X test sets successfully.
Failed to close Y test sets: [list failed keys]
```

## Examples

### Example 1: Close all test sets for release 26.03
```
User: Close test sets for release 26.03

Agent:
1. Searches for test sets
2. Shows list to user
3. Asks for confirmation
4. Closes all after approval
```

### Example 2: Close with exclusion
```
User: Close test sets for 26.04 except BCIN-7500

Agent:
1. Searches for test sets
2. Shows list (including BCIN-7500)
3. Confirms exclusion with user
4. Closes all except BCIN-7500
```

### Example 3: No release version provided
```
User: Close my test sets

Agent: What release version should I close test sets for?
User: 26.03
Agent: [proceeds with workflow]
```

## Notes

- Always activate Jira token first: `source ~/.bash_profile`
- Script assumes "Done" is the valid transition state for test sets
- User confirmation is mandatory before closing any test sets
- Script is idempotent - safe to run multiple times
