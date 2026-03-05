#!/bin/bash

# Cron wrapper for daily RCA check
# Adds randomization to run time (8:00-8:30 AM Asia/Shanghai)

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CHECK_SCRIPT="${SCRIPT_DIR}/daily-rca-check.sh"

wait_random_minutes() {
    # Random sleep 0-30 minutes
    local random_minutes=$((RANDOM % 31))
    echo "Sleeping ${random_minutes} minutes before running daily check..."
    sleep $((random_minutes * 60))
}

run_daily_check() {
    local output
    # Capture the output
    output=$(bash "${CHECK_SCRIPT}" 2>&1)
    
    # Check if Feishu notification is required
    if echo "${output}" | grep -q "FEISHU_NOTIFICATION_REQUIRED"; then
        local summary_file
        summary_file=$(echo "${output}" | grep "SUMMARY_FILE:" | cut -d: -f2-)
        
        if [ -f "${summary_file}" ]; then
            # This would need to be called from OpenClaw context to use the message tool
            echo "Feishu notification required"
            echo "Summary file: ${summary_file}"
        fi
    fi
}

main() {
    wait_random_minutes
    run_daily_check
}

main "$@"
