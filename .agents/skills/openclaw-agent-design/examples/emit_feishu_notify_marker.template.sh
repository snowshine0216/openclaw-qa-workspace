#!/usr/bin/env bash
# Template: Emit FEISHU_NOTIFY marker for agent to send via gateway message tool.
# Use when agent-orchestrated; the CLI path (openclaw message send) is unreliable for group chats.
#
# Agent must: (1) read chat_id from TOOLS.md, (2) set FEISHU_CHAT_ID before running phase scripts,
# (3) catch this marker and send via gateway message tool (NOT CLI)
#
# Reference: single-defect-analysis phase4.sh

set -euo pipefail

# --- ADAPT: Set these for your skill ---
# ISSUE_KEY="$1"
# RUN_DIR="$2"
# PLAN_FILE="${RUN_DIR}/${ISSUE_KEY}_TESTING_PLAN.md"
# CONTEXT_DIR="${RUN_DIR}/context"
# FC_RISK_FILE="${CONTEXT_DIR}/fc_risk.json"  # optional: for risk_level

if [[ -n "${FEISHU_CHAT_ID:-}" ]]; then
  # Emit structured marker for agent to send via gateway message tool (CLI path unreliable)
  # Adapt: set ISSUE_KEY, PLAN_FILE, RISK_DISPLAY (e.g. from jq -r '.risk_level' fc_risk.json)
  RISK_DISPLAY="${RISK_DISPLAY:-medium}"
  echo "FEISHU_NOTIFY: chat_id=${FEISHU_CHAT_ID} issue=${ISSUE_KEY} risk=${RISK_DISPLAY} plan=${PLAN_FILE}"
fi
