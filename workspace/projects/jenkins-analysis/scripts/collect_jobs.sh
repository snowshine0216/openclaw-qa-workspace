#!/bin/bash
# Jenkins Job Analysis Script
# Analyzes all jobs from specified views and generates comprehensive report

set -e

JENKINS_URL="http://tec-l-1081462.labs.microstrategy.com:8080/"
JENKINS_USER="admin"
JENKINS_API_TOKEN="11596241e9625bf6e48aca51bf0af0a036"
OUTPUT_DIR="~/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to get jobs from a view
get_view_jobs() {
    local view_name=$1
    echo "Fetching jobs from view: $view_name" >&2
    curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/view/$view_name/api/json?tree=jobs[name,url,color,lastBuild[number,result,timestamp,duration]]" \
        | jq -r '.jobs[] | @json'
}

# Function to get single job info
get_job_info() {
    local job_name=$1
    echo "Fetching job info: $job_name" >&2
    curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/api/json?tree=name,url,color,lastBuild[number,result,timestamp,duration]" \
        | jq -r '@json'
}

# Collect all jobs
echo "=== Collecting jobs from ReportEditor ===" >&2
get_view_jobs "ReportEditor" > "$OUTPUT_DIR/report_editor_jobs.jsonl"

echo "=== Collecting jobs from SubscriptionWebTest ===" >&2
get_view_jobs "SubscriptionWebTest" > "$OUTPUT_DIR/subscription_jobs.jsonl"

echo "=== Collecting jobs from CustomAppWebTest ===" >&2
get_view_jobs "CustomAppWebTest" > "$OUTPUT_DIR/customapp_jobs.jsonl"

echo "=== Collecting Dashboard_TemplateCreator job ===" >&2
get_job_info "Dashboard_TemplateCreator" > "$OUTPUT_DIR/dashboard_template_job.json"

echo "All job data collected successfully!" >&2
echo "$OUTPUT_DIR"
