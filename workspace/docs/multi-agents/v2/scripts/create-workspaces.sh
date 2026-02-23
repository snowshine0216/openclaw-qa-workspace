#!/bin/bash
# create-workspaces.sh - Create isolated workspaces for all agents
# Version: 2.0
# Date: 2026-02-23

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V2_DIR="$(dirname "$SCRIPT_DIR")"
AGENTS_DIR="$V2_DIR/agents"

echo "🚀 Creating isolated workspaces for all agents..."
echo "Base directory: $AGENTS_DIR"
echo ""

# Agent list
AGENTS=("master" "openclaw-config" "qa-daily" "qa-plan" "qa-test" "qa-report")

# Create workspaces
for agent in "${AGENTS[@]}"; do
    echo "📁 Creating workspace for: $agent"
    
    AGENT_DIR="$AGENTS_DIR/$agent"
    
    # Create directories
    mkdir -p "$AGENT_DIR"/{memory,projects}
    
    # Create memory folder with README
    cat > "$AGENT_DIR/memory/README.md" <<EOF
# Daily Memory Logs - $agent

Daily logs for the **$agent** agent.

## Format

- Filename: \`YYYY-MM-DD.md\`
- Content: Raw log of actions, observations, and decisions
- Retention: Keep last 30 days, archive older files

## Usage

This folder is automatically populated by the agent. Do not manually edit unless necessary.
EOF
    
    # Create projects folder with README
    cat > "$AGENT_DIR/projects/README.md" <<EOF
# Projects - $agent

Artifacts and deliverables for the **$agent** agent.

## Structure

Organize files by:
- **Issue key:** \`BCIN-1234/\`
- **Date:** \`YYYY-MM-DD/\`
- **Category:** \`test-reports/\`, \`test-plans/\`, etc.

## Isolation

This folder is specific to **$agent**. Other agents have their own \`projects/\` folders.
EOF
    
    echo "  ✅ Created: $AGENT_DIR"
    echo "     - memory/"
    echo "     - projects/"
    echo ""
done

echo "✅ All agent workspaces created!"
echo ""
echo "Next steps:"
echo "1. Populate SOUL.md, AGENTS.md, USER.md, IDENTITY.md, TOOLS.md, MEMORY.md for each agent"
echo "2. Run: bash scripts/install.sh"
echo "3. Configure Feishu (see docs/feishu-setup.md)"
echo "4. Restart gateway: openclaw gateway restart"
echo ""
