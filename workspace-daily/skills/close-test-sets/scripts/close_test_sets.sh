#!/bin/bash
# Close test sets for a specific release version
# Usage: ./close_test_sets.sh <release-version> [--exclude ISSUE-KEY]

set -e

# Check if release version is provided
if [ -z "$1" ]; then
    echo "Error: Release version is required"
    echo "Usage: $0 <release-version> [--exclude ISSUE-KEY]"
    exit 1
fi

RELEASE_VERSION="$1"
EXCLUDE_ISSUE=""

# Parse optional exclude parameter
if [ "$2" = "--exclude" ] && [ -n "$3" ]; then
    EXCLUDE_ISSUE="$3"
fi

# Activate Jira token
source ~/.bash_profile 2>/dev/null || true

# Build JQL query
JQL="type = \"Test Set\" AND \"Release[Version Picker (single version)]\" = ${RELEASE_VERSION} AND assignee = currentUser()"

echo "Searching for test sets with JQL:"
echo "$JQL"
echo ""

# Fetch test sets
TEST_SETS=$(jira issue list --jql "$JQL" --plain 2>&1)

if [ $? -ne 0 ]; then
    echo "Error fetching test sets from Jira:"
    echo "$TEST_SETS"
    exit 1
fi

# Check if any test sets found
if [ -z "$TEST_SETS" ] || ! echo "$TEST_SETS" | grep -q "Test Set"; then
    echo "No test sets found for release version: $RELEASE_VERSION"
    exit 0
fi

# Display found test sets
echo "Found test sets:"
echo "$TEST_SETS"
echo ""

# Extract issue keys (second column, using tab as delimiter)
ISSUE_KEYS=$(echo "$TEST_SETS" | tail -n +2 | awk -F'\t' '{print $2}')

if [ -z "$ISSUE_KEYS" ]; then
    echo "No test set keys could be extracted"
    exit 0
fi

# Filter out excluded issue if specified
if [ -n "$EXCLUDE_ISSUE" ]; then
    echo "Excluding: $EXCLUDE_ISSUE"
    ISSUE_KEYS=$(echo "$ISSUE_KEYS" | grep -v "^${EXCLUDE_ISSUE}$")
    echo ""
fi

# Count issues to close
ISSUE_COUNT=$(echo "$ISSUE_KEYS" | wc -l | xargs)

if [ "$ISSUE_COUNT" -eq 0 ]; then
    echo "No test sets to close after exclusion"
    exit 0
fi

echo "Ready to close $ISSUE_COUNT test set(s) to 'Done' status"
echo ""

# Close each test set
SUCCESS_COUNT=0
FAIL_COUNT=0

for KEY in $ISSUE_KEYS; do
    echo "Closing $KEY..."
    if jira issue move "$KEY" "Done" >/dev/null 2>&1; then
        echo "✓ $KEY closed successfully"
        ((SUCCESS_COUNT++))
    else
        echo "✗ Failed to close $KEY"
        ((FAIL_COUNT++))
    fi
done

echo ""
echo "Summary:"
echo "- Successfully closed: $SUCCESS_COUNT"
echo "- Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
