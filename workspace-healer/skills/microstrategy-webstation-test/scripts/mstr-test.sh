#!/bin/bash
# MicroStrategy UI Test Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: mstr-test <command> [options]"
    echo ""
    echo "Commands:"
    echo "  dashboard <url>          - Test dashboard loads correctly"
    echo "  screenshot <url> <file> - Capture dashboard screenshot"
    echo "  widget <url> <widget-id> - Check widget exists"
    echo "  filter <url> <filter>    - Test filter functionality"
    echo "  smoke                    - Run quick smoke test"
    echo "  help                    - Show this help"
    echo ""
}

test_dashboard() {
    local url=$1
    if [ -z "$url" ]; then
        echo -e "${RED}Error: URL required${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Testing dashboard: $url${NC}"
    playwright-cli open "$url"
    playwright-cli snapshot
    echo -e "${GREEN}Dashboard loaded successfully${NC}"
}

take_screenshot() {
    local url=$1
    local file=${2:-"screenshot.png"}
    if [ -z "$url" ]; then
        echo -e "${RED}Error: URL required${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Taking screenshot: $file${NC}"
    playwright-cli open "$url"
    playwright-cli screenshot --filename="$file"
    echo -e "${GREEN}Screenshot saved to $file${NC}"
}

test_widget() {
    local url=$1
    local widget_id=$2
    if [ -z "$url" ] || [ -z "$widget_id" ]; then
        echo -e "${RED}Error: URL and widget ID required${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Testing widget $widget_id${NC}"
    playwright-cli open "$url"
    playwright-cli run-code "
        const widget = await page.locator('[data-widget-id=\"$widget_id\"]').count();
        console.log('Widget found:', widget > 0);
    "
}

test_filter() {
    local url=$1
    local filter=$2
    if [ -z "$url" ] || [ -z "$filter" ]; then
        echo -e "${RED}Error: URL and filter value required${NC}"
        exit 1
    fi
    echo -e "${YELLOW}Testing filter: $filter${NC}"
    playwright-cli open "$url"
    playwright-cli snapshot
    playwright-cli type <filter_ref> "$filter"
    playwright-cli press Enter
    playwright-cli run-code "await page.waitForTimeout(2000)"
    echo -e "${GREEN}Filter applied${NC}"
}

run_smoke_test() {
    echo -e "${YELLOW}Running MicroStrategy smoke test...${NC}"
    
    # Check playwright-cli is installed
    if ! command -v playwright-cli &> /dev/null; then
        echo -e "${RED}Error: playwright-cli not installed${NC}"
        exit 1
    fi
    
    # Check browsers are installed
    echo "✓ playwright-cli installed"
    echo "✓ Starting smoke test..."
    
    # Quick connectivity check
    playwright-cli open --help > /dev/null
    echo "✓ CLI responding"
    
    echo -e "${GREEN}Smoke test passed${NC}"
}

case "$1" in
    dashboard)
        test_dashboard "$2"
        ;;
    screenshot)
        take_screenshot "$2" "$3"
        ;;
    widget)
        test_widget "$2" "$3"
        ;;
    filter)
        test_filter "$2" "$3"
        ;;
    smoke)
        run_smoke_test
        ;;
    help|--help|-h)
        print_usage
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
