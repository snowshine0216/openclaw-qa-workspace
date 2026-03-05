#!/bin/bash

# Fetch customer defects requiring RCA for Xue, Yin
# Usage: ./fetch-xuyin-rca.sh

set -e

# Get script directory and set output directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../output"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

API_URL="http://10.23.38.9:8070/api/jira/customer-defects/details/?status=completed&limit=500"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/rca-xuyin-${TIMESTAMP}.json"

echo "Fetching customer defects from API..."

# Fetch data and filter for requires_rca category and Xue, Yin as proposed_owner
curl -s "${API_URL}" | jq '{
  defects: [
    .defects[] | select(
      .category == "requires_rca" and 
      .proposed_owner == "Xue, Yin"
    )
  ]
}' > "${OUTPUT_FILE}"

DEFECT_COUNT=$(jq '.defects | length' "${OUTPUT_FILE}")

echo "✅ Filtered defects saved to: ${OUTPUT_FILE}"
echo "📊 Found ${DEFECT_COUNT} defects requiring RCA for Xue, Yin"
