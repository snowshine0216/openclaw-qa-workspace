#!/bin/bash
# Surgical fix for analyzer.sh: Parse console log to get triggered build numbers
# instead of using lastBuild (which may be still running)

set -e

ANALYZER="/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts/analyzer.sh"
BACKUP="${ANALYZER}.backup-before-surgical-fix"

cp "$ANALYZER" "$BACKUP"
echo "✓ Backup created: $BACKUP"

# Fix Step 4: Change from downstreamProjects to console log parsing
sed -i.tmp '
/^DOWNSTREAM_JOBS=$(curl.*downstreamProjects/,/^fi$/ {
    /^DOWNSTREAM_JOBS=$(curl.*downstreamProjects/ {
        c\
# Get console log to extract triggered builds with BOTH name and number\
CONSOLE_TEXT=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \\\
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/consoleText")\
\
# Extract "Starting building: JobName #BuildNum" and save as JSON\
TRIGGERED_BUILDS=$(echo "$CONSOLE_TEXT" | grep "Starting building:" | \\\
    sed -E '\''s/^Starting building: (.+) #([0-9]+)$/\1|\2/'\'' | sort -u)\
\
# Convert to job list for compatibility with existing logic\
DOWNSTREAM_JOBS=$(echo "$TRIGGERED_BUILDS" | cut -d"|" -f1)
    }
    /^    log "⚠ No downstream jobs found - checking triggered builds..."$/,/^fi$/ d
}
' "$ANALYZER"

# Fix Step 5: Use specific build number from console log instead of lastBuild
sed -i.tmp2 '
/^while IFS= read -r job_name; do$/,/^done <<< "$DOWNSTREAM_JOBS"$/ {
    /JOB_INFO=$(curl.*lastBuild/ {
        c\
    # Get build number from TRIGGERED_BUILDS\
    JOB_NUMBER=$(echo "$TRIGGERED_BUILDS" | grep "^${job_name}|" | cut -d"|" -f2 | head -1)\
    \
    if [ -z "$JOB_NUMBER" ]; then\
        # Fallback to lastBuild if not found in console log\
        JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \\\
            "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number,result,timestamp,duration" || echo "{}")\
        JOB_NUMBER=$(echo "$JOB_INFO" | jq -r '\''.number // "N/A"'\'')\
    else\
        # Use specific build number from console log\
        JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \\\
            "$JENKINS_URL/job/$job_name/$JOB_NUMBER/api/json?tree=number,result,timestamp,duration" || echo "{}")\
    fi
    }
    /JOB_NUMBER=$(echo "$JOB_INFO" | jq -r/ d
}
' "$ANALYZER"

rm -f "$ANALYZER.tmp" "$ANALYZER.tmp2"
chmod +x "$ANALYZER"

echo "✓ Surgical fix applied"
echo "  Changes:"
echo "    1. Step 4: Parse console log for 'Starting building: JobName #BuildNum'"
echo "    2. Step 5: Use specific build number from console log, not lastBuild"
echo "  Backup: $BACKUP"
