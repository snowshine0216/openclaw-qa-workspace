"use strict";

const EXECUTION_CONTRACT_VERSION = "v2";
const DEFAULT_REASONING_HOST = "portable_cli";
const REASONING_MODES = new Set(["scripted_local", "manual_artifact", "interactive_host"]);

function normalizeReasoningHost(value) {
  return String(value || process.env.PPT_AGENT_REASONING_HOST || DEFAULT_REASONING_HOST)
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase() || DEFAULT_REASONING_HOST;
}

function normalizeReasoningMode(value) {
  const normalized = String(value || "scripted_local").trim().toLowerCase();
  return REASONING_MODES.has(normalized) ? normalized : "scripted_local";
}

function buildRuntimeContract({ reasoningHost, reasoningMode } = {}) {
  return {
    reasoning_host: normalizeReasoningHost(reasoningHost),
    reasoning_mode: normalizeReasoningMode(reasoningMode),
    execution_contract_version: EXECUTION_CONTRACT_VERSION
  };
}

module.exports = {
  EXECUTION_CONTRACT_VERSION,
  DEFAULT_REASONING_HOST,
  buildRuntimeContract
};
