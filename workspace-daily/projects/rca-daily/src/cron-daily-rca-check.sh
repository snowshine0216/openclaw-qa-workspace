#!/bin/bash

# Cron wrapper for daily RCA check
# Adds randomization to run time (8:00-8:30 AM Asia/Shanghai)

# Random sleep 0-30 minutes
RANDOM_MINUTES=$((RANDOM % 31))
echo "Sleeping ${RANDOM_MINUTES} minutes before running daily check..."
sleep $((RANDOM_MINUTES * 60))

# Run daily check
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "${SCRIPT_DIR}/daily-rca-check.sh"

# Capture the output
OUTPUT=$(bash "${SCRIPT_DIR}/daily-rca-check.sh" 2>&1)

# Check if Feishu notification is required
if echo "$OUTPUT" | grep -q "FEISHU_NOTIFICATION_REQUIRED"; then
    SUMMARY_FILE=$(echo "$OUTPUT" | grep "SUMMARY_FILE:" | cut -d: -f2-)
    
    if [ -f "$SUMMARY_FILE" ]; then
        # This would need to be called from OpenClaw context to use the message tool
        echo "Feishu notification required"
        echo "Summary file: ${SUMMARY_FILE}"
    fi
fi
