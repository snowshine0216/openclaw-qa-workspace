#!/bin/bash
# Watch GitHub PRs created by xuyin_mstr in mstr-kiai/tanzu-whitelist

REPO="mstr-kiai/tanzu-whitelist"
AUTHOR="xuyin_mstr"

# Get PRs by the user
PRS=$(gh pr list --repo "$REPO" --author "$AUTHOR" --json number,title,state,mergeStateStatus,reviewDecision,url --jq '.' 2>/dev/null)

if [ -z "$PRS" ] || [ "$PRS" == "[]" ]; then
    echo "No PRs found for $AUTHOR"
    exit 0
fi

# Count PRs
PR_COUNT=$(echo "$PRS" | jq length)

# Build message
MESSAGE="**GitHub PR Status Update**

**Repository:** $REPO  
**Author:** $AUTHOR  
**Total PRs:** $PR_COUNT

"

for i in $(seq 0 $((PR_COUNT - 1))); do
    PR=$(echo "$PRS" | jq -r ".[$i]")
    NUMBER=$(echo "$PR" | jq -r '.number')
    TITLE=$(echo "$PR" | jq -r '.title')
    STATE=$(echo "$PR" | jq -r '.state')
    MERGE_STATUS=$(echo "$PR" | jq -r '.mergeStateStatus')
    REVIEW_DECISION=$(echo "$PR" | jq -r '.reviewDecision')
    URL=$(echo "$PR" | jq -r '.url')
    
    MESSAGE="$MESSAGE**PR #$NUMBER:** $TITLE
- State: $STATE ($MERGE_STATUS)
- Review: ${REVIEW_DECISION:-Pending}
- Link: $URL

"
done

# Output for debugging
echo "$MESSAGE"
