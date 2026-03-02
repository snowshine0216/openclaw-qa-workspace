# Close Test Sets Skill - Summary

## What It Does

A skill for bulk closing test sets assigned to the current user for a specific release version.

## Key Features

- **Release-based filtering**: Searches test sets by release version
- **User confirmation required**: Lists all test sets before closing and requires explicit approval
- **Exclusion support**: Can exclude specific issues from being closed
- **Error handling**: Reports success/failure for each issue and provides summary

## Usage

The skill is triggered when users say things like:
- "Close test sets for release 26.03"
- "Mark test sets done for version 26.04"
- "Finish test sets for release 26.05"

### Workflow

1. **Get release version** (asks if not provided)
2. **Search for test sets** using JQL query
3. **Display list to user** for confirmation
4. **Handle exclusions** if any specified
5. **Close test sets** to "Done" status after approval

### Example JQL Query

```
type = "Test Set" AND "Release[Version Picker (single version)]" = 26.03 AND assignee = currentUser()
```

## Script

Location: `scripts/close_test_sets.sh`

Usage:
```bash
close_test_sets.sh <release-version> [--exclude ISSUE-KEY]
```

Examples:
```bash
# Close all test sets for release 26.03
./close_test_sets.sh 26.03

# Close all except BCIN-7415
./close_test_sets.sh 26.03 --exclude BCIN-7415
```

## Installation

1. Place the `close-test-sets.skill` file in your workspace
2. OpenClaw will automatically load it
3. Use it by asking to close test sets for a specific release

## Requirements

- Jira CLI configured and authenticated
- Bash environment with `~/.bash_profile` containing Jira token
- Proper Jira permissions to transition issues

## Safety Features

- **No automatic execution**: Always asks for user confirmation
- **Clear output**: Shows exactly which test sets will be closed
- **Exclusion support**: Can skip specific issues
- **Error reporting**: Reports failures clearly
- **Idempotent**: Safe to run multiple times

---

Created: 2026-03-02
Author: Atlas Daily
