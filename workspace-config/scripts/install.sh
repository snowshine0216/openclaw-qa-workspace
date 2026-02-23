#!/bin/bash
# Multi-Agent Installation Script
# Automates the installation of the multi-agent configuration

set -e

WORKSPACE="/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace"
CONFIG_DRAFT="$WORKSPACE/openclaw-config-draft.json5"
OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "Multi-Agent Configuration - Installation Script"
echo "=================================================="
echo ""

# Confirmation prompt
echo -e "${YELLOW}⚠️  WARNING: This will replace your current OpenClaw configuration${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Installation cancelled."
    exit 0
fi
echo ""

# Step 1: Backup current config
echo -e "${BLUE}Step 1: Backing up current configuration...${NC}"
if [ -f "$OPENCLAW_CONFIG" ]; then
    BACKUP_FILE="$HOME/.openclaw/openclaw.json.backup-$(date +%Y%m%d-%H%M%S)"
    cp "$OPENCLAW_CONFIG" "$BACKUP_FILE"
    echo -e "${GREEN}✓${NC} Backup created: $BACKUP_FILE"
else
    echo -e "${YELLOW}⚠${NC} No existing config found (fresh install)"
fi
echo ""

# Step 2: Copy config
echo -e "${BLUE}Step 2: Installing new configuration...${NC}"
if [ -f "$CONFIG_DRAFT" ]; then
    cp "$CONFIG_DRAFT" "$OPENCLAW_CONFIG"
    echo -e "${GREEN}✓${NC} Configuration installed: $OPENCLAW_CONFIG"
else
    echo -e "${RED}✗${NC} Config draft not found: $CONFIG_DRAFT"
    exit 1
fi
echo ""

# Step 3: Create agent directories
echo -e "${BLUE}Step 3: Creating agent state directories...${NC}"
AGENTS=("master" "openclaw-config" "qa-daily" "qa-plan" "qa-test" "qa-report")
for agent in "${AGENTS[@]}"; do
    mkdir -p "$HOME/.openclaw/agents/$agent/agent"
    mkdir -p "$HOME/.openclaw/agents/$agent/sessions"
    echo -e "${GREEN}✓${NC} Created: ~/.openclaw/agents/$agent/"
done
echo ""

# Step 4: Restart gateway
echo -e "${BLUE}Step 4: Restarting OpenClaw gateway...${NC}"
if command -v openclaw &> /dev/null; then
    openclaw gateway restart
    sleep 3  # Wait for gateway to start
    echo -e "${GREEN}✓${NC} Gateway restarted"
else
    echo -e "${RED}✗${NC} OpenClaw CLI not found"
    exit 1
fi
echo ""

# Step 5: Verify installation
echo -e "${BLUE}Step 5: Verifying installation...${NC}"
if openclaw gateway status &> /dev/null; then
    echo -e "${GREEN}✓${NC} Gateway is running"
else
    echo -e "${RED}✗${NC} Gateway failed to start"
    echo "   Check logs: openclaw gateway logs"
    exit 1
fi
echo ""

# Step 6: List agents
echo -e "${BLUE}Step 6: Listing configured agents...${NC}"
openclaw agents list --bindings
echo ""

# Success message
echo "=================================================="
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo "=================================================="
echo ""
echo "What was installed:"
echo "  • 6 specialized agents (master, openclaw-config, qa-daily, qa-plan, qa-test, qa-report)"
echo "  • Agent state directories under ~/.openclaw/agents/"
echo "  • Configuration: ~/.openclaw/openclaw.json"
echo ""
echo "Next steps:"
echo "  1. Run: bash scripts/test-installation.sh"
echo "  2. Test master agent: Send a message to your channel"
echo "  3. Read: QUICK-REFERENCE.md for usage guide"
echo ""
echo "If you need to restore your previous config:"
echo "  cp $BACKUP_FILE ~/.openclaw/openclaw.json"
echo "  openclaw gateway restart"
echo ""
