#!/bin/bash
# Post-Installation Test Script
# Run this after installing the multi-agent configuration

set -e

echo "=================================================="
echo "Multi-Agent Configuration - Post-Installation Test"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check gateway status
echo "1. Checking OpenClaw gateway status..."
if openclaw gateway status &> /dev/null; then
    check_pass "Gateway is running"
else
    check_fail "Gateway is not running"
    echo "   Start with: openclaw gateway start"
    exit 1
fi
echo ""

# 2. List agents
echo "2. Listing configured agents..."
if openclaw agents list --bindings &> /dev/null; then
    check_pass "Agents list command succeeded"
    echo ""
    openclaw agents list --bindings
else
    check_fail "Failed to list agents"
    echo "   Check config syntax and logs: openclaw gateway logs"
    exit 1
fi
echo ""

# 3. Check agent state directories
echo "3. Checking agent state directories..."
AGENTS=("master" "openclaw-config" "qa-daily" "qa-plan" "qa-test" "qa-report")
for agent in "${AGENTS[@]}"; do
    if [ -d "$HOME/.openclaw/agents/$agent/agent" ]; then
        check_pass "Agent state dir exists: ~/.openclaw/agents/$agent/agent"
    else
        check_warn "Agent state dir missing: ~/.openclaw/agents/$agent/agent"
    fi
    
    if [ -d "$HOME/.openclaw/agents/$agent/sessions" ]; then
        check_pass "Agent sessions dir exists: ~/.openclaw/agents/$agent/sessions"
    else
        check_warn "Agent sessions dir missing: ~/.openclaw/agents/$agent/sessions"
    fi
done
echo ""

# 4. Check gateway logs for errors
echo "4. Checking gateway logs for errors..."
if openclaw gateway logs --lines 50 2>/dev/null | grep -i "error" > /dev/null; then
    check_warn "Errors found in gateway logs (review manually)"
    echo "   Check with: openclaw gateway logs"
else
    check_pass "No errors in recent gateway logs"
fi
echo ""

# 5. Verify default agent
echo "5. Verifying default agent..."
if openclaw agents list --bindings 2>/dev/null | grep -i "default" | grep -q "master"; then
    check_pass "Master agent is set as default"
else
    check_warn "Could not verify default agent (check manually)"
fi
echo ""

# 6. Check workspace files are accessible
echo "6. Checking workspace file accessibility..."
WORKSPACE="/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace"
if [ -r "$WORKSPACE/IDENTITY.md" ]; then
    check_pass "Workspace files are readable"
else
    check_warn "Cannot read workspace files (check permissions)"
fi
echo ""

# 7. Test agent file loading (simulate)
echo "7. Verifying agent-specific files..."
for agent in "${AGENTS[@]}"; do
    SOUL_FILE="$WORKSPACE/agents/$agent/SOUL.md"
    AGENTS_FILE="$WORKSPACE/agents/$agent/AGENTS.md"
    
    if [ -r "$SOUL_FILE" ] && [ -r "$AGENTS_FILE" ]; then
        check_pass "Agent $agent: files accessible"
    else
        check_warn "Agent $agent: files not readable"
    fi
done
echo ""

# Summary
echo "=================================================="
echo "Post-Installation Test Complete"
echo "=================================================="
echo ""
echo "✨ Configuration appears to be working!"
echo ""
echo "Next steps:"
echo "1. Test master agent by sending a message to your channel"
echo "2. Try: 'Master, introduce yourself and list available agents'"
echo "3. Test delegation: 'Master, spawn openclaw-config to list documentation categories'"
echo ""
echo "If you encounter issues:"
echo "  - Check logs: openclaw gateway logs"
echo "  - Verify bindings: openclaw agents list --bindings"
echo "  - Review config: cat ~/.openclaw/openclaw.json"
echo "  - Restore backup if needed"
echo ""
