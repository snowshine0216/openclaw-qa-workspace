#!/bin/bash

# Fetch all customer defects requiring RCA (no owner filter)
# Usage: ./fetch-rca.sh

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly OUTPUT_DIR="${PROJECT_ROOT}/output"
readonly API_URL="http://10.23.38.9:8070/api/jira/customer-defects/details/?status=completed&limit=500"
readonly TIMESTAMP=$(date +%Y%m%d-%H%M%S)
readonly OUTPUT_FILE="${OUTPUT_DIR}/rca-all-${TIMESTAMP}.json"

setup_directories() {
    # Create output directory if it doesn't exist
    mkdir -p "${OUTPUT_DIR}"
}

fetch_defects() {
    echo "Fetching customer defects from API..."

    # Fetch data and filter for requires_rca category (no owner filter)
    curl -s "${API_URL}" | jq '{
      defects: [
        .defects[] | select(
          .category == "requires_rca"
        )
      ]
    }' > "${OUTPUT_FILE}"

    local defect_count
    defect_count=$(jq '.defects | length' "${OUTPUT_FILE}")

    echo "✅ Filtered defects saved to: ${OUTPUT_FILE}"
    echo "📊 Found ${defect_count} defects requiring RCA"
}

main() {
    setup_directories
    fetch_defects
}

main "$@"
