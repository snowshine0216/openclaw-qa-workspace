#!/bin/bash
# Pre-Installation Validation Script
# Run this before installing the multi-agent configuration

set -e

WORKSPACE="/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace"
CONFIG_DRAFT="$WORKSPACE/openclaw-config-draft.json5"
OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"

echo "=================================================="
echo "Multi-Agent Configuration - Pre-Installation Check"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check workspace exists
echo "1. Checking workspace..."
if [ -d "$WORKSPACE" ]; then
    check_pass "Workspace exists: $WORKSPACE"
else
    check_fail "Workspace not found: $WORKSPACE"
    exit 1
fi
echo ""

# 2. Check agent directories
echo "2. Checking agent directories..."
AGENTS=("master" "openclaw-config" "qa-daily" "qa-plan" "qa-test" "qa-report")
for agent in "${AGENTS[@]}"; do
    if [ -d "$WORKSPACE/agents/$agent" ]; then
        check_pass "Agent directory exists: agents/$agent"
    else
        check_fail "Agent directory missing: agents/$agent"
        exit 1
    fi
done
echo ""

# 3. Check per-agent files
echo "3. Checking per-agent files..."
for agent in "${AGENTS[@]}"; do
    echo "   Agent: $agent"
    
    if [ -f "$WORKSPACE/agents/$agent/SOUL.md" ]; then
        check_pass "  SOUL.md exists"
    else
        check_fail "  SOUL.md missing"
    fi
    
    if [ -f "$WORKSPACE/agents/$agent/AGENTS.md" ]; then
        check_pass "  AGENTS.md exists"
    else
        check_fail "  AGENTS.md missing"
    fi
    
    if [ -f "$WORKSPACE/agents/$agent/MEMORY.md" ]; then
        check_pass "  MEMORY.md exists"
    else
        check_fail "  MEMORY.md missing"
    fi
    
    # Check HEARTBEAT.md for qa-daily
    if [ "$agent" = "qa-daily" ]; then
        if [ -f "$WORKSPACE/agents/$agent/HEARTBEAT.md" ]; then
            check_pass "  HEARTBEAT.md exists"
        else
            check_fail "  HEARTBEAT.md missing"
        fi
    fi
done
echo ""

# 4. Check shared files
echo "4. Checking shared workspace files..."
SHARED_FILES=("IDENTITY.md" "USER.md" "TOOLS.md" "WORKSPACE_RULES.md")
for file in "${SHARED_FILES[@]}"; do
    if [ -f "$WORKSPACE/$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file missing"
    fi
done
echo ""

# 5. Check project directories
echo "5. Checking project directories..."
PROJECT_DIRS=("test-reports" "test-plans" "jira-exports" "ci-reports" "screenshots")
for dir in "${PROJECT_DIRS[@]}"; do
    if [ -d "$WORKSPACE/projects/$dir" ]; then
        check_pass "projects/$dir exists"
    else
        check_warn "projects/$dir missing (will be created on first use)"
    fi
done
echo ""

# 6. Check config draft
echo "6. Checking configuration draft..."
if [ -f "$CONFIG_DRAFT" ]; then
    check_pass "Config draft exists: openclaw-config-draft.json5"
    
    # Check if it contains all agent IDs
    for agent in "${AGENTS[@]}"; do
        if grep -q "\"id\": \"$agent\"" "$CONFIG_DRAFT" || grep -q "id: \"$agent\"" "$CONFIG_DRAFT"; then
            check_pass "  Agent '$agent' configured"
        else
            check_fail "  Agent '$agent' not found in config"
        fi
    done
else
    check_fail "Config draft not found: $CONFIG_DRAFT"
    exit 1
fi
echo ""

# 7. Check current OpenClaw config
echo "7. Checking current OpenClaw installation..."
if command -v openclaw &> /dev/null; then
    check_pass "OpenClaw CLI installed"
    
    # Check if gateway is running
    if openclaw gateway status &> /dev/null; then
        check_pass "OpenClaw gateway is running"
        check_warn "  Gateway will need to be restarted after config update"
    else
        check_warn "OpenClaw gateway is not running"
    fi
else
    check_fail "OpenClaw CLI not found in PATH"
    echo "   Please install OpenClaw first: npm install -g openclaw"
    exit 1
fi
echo ""

# 8. Check if backup is needed
echo "8. Checking existing configuration..."
if [ -f "$OPENCLAW_CONFIG" ]; then
    check_warn "Existing OpenClaw config found: $OPENCLAW_CONFIG"
    echo "   ⚠️  IMPORTANT: Backup before proceeding!"
    echo "   Command: cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-\$(date +%Y%m%d-%H%M%S)"
else
    check_pass "No existing config (fresh install)"
fi
echo ""

# 9. Check OpenClaw state directory
echo "9. Checking OpenClaw state directories..."
if [ -d "$HOME/.openclaw" ]; then
    check_pass "OpenClaw state directory exists: ~/.openclaw"
    
    # Check if agent directories exist
    if [ -d "$HOME/.openclaw/agents" ]; then
        check_pass "Agents directory exists: ~/.openclaw/agents"
    else
        check_warn "Agents directory missing (will be created)"
    fi
else
    check_warn "OpenClaw state directory missing (will be created on first run)"
fi
echo ""

# 10. Documentation check
echo "10. Checking documentation files..."
DOC_FILES=("SETUP-GUIDE.md" "QUICK-REFERENCE.md" "SETUP-COMPLETE.md")
for file in "${DOC_FILES[@]}"; do
    if [ -f "$WORKSPACE/$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file missing"
    fi
done
echo ""

# Summary
echo "=================================================="
echo "Pre-Installation Check Complete"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Read SETUP-COMPLETE.md for overview"
echo "2. Read SETUP-GUIDE.md for detailed instructions"
echo "3. Backup your current config (if exists)"
echo "4. Run installation commands"
echo ""
echo "Installation commands:"
echo "  cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-\$(date +%Y%m%d-%H%M%S)"
echo "  cp $CONFIG_DRAFT ~/.openclaw/openclaw.json"
echo "  mkdir -p ~/.openclaw/agents/{master,openclaw-config,qa-daily,qa-plan,qa-test,qa-report}/{agent,sessions}"
echo "  openclaw gateway restart"
echo ""
