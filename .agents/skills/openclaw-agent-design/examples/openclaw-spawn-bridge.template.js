/**
 * openclaw-spawn-bridge.template.js
 *
 * Domain-specific spawn bridge template. Copy into your skill's scripts/lib/,
 * customize task extraction for your manifest format.
 *
 * Contract: export spawnBatch(requests, context) => Promise<result[]>
 * Each result: { label, status, started_at, finished_at, output_file?, session_error? }
 *
 * Uses openclaw agent (--agent reporter) for synchronous single-turn runs.
 * Reference: workspace-daily/skills/rca-orchestrator/scripts/lib/openclaw-spawn-bridge.js
 *
 * IMPORTANT: Invoke only from TUI (orchestrator workflow), not from CLI directly.
 */

'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw';

function isoNow() {
  return new Date().toISOString();
}

/**
 * Extract task, label, and output file from a request. CUSTOMIZE for your manifest format.
 * @param {object} request - One entry from manifest.requests[]
 * @returns {{ task: string, label: string, outputFile?: string, issueKey?: string }}
 */
function extractTaskAndLabel(request) {
  // Example: qa-plan format
  // const args = request?.openclaw?.args;
  // return { task: args?.task || '', label: args?.label || 'spawn', outputFile: args?.output_file };

  // Example: rca-orchestrator format
  // const label = request?.request?.label;
  // const outputFile = request?.handoff?.result_contract?.expected_outputs?.[0];
  // const task = buildRcaTask(request);
  // return { task, label, outputFile, issueKey: request?.source?.issue_key };

  const args = request?.openclaw?.args || request?.request;
  return {
    task: args?.task || '',
    label: args?.label || request?.request?.label || 'spawn',
    outputFile: request?.handoff?.result_contract?.expected_outputs?.[0],
    issueKey: request?.source?.issue_key,
  };
}

/**
 * Spawn one request using openclaw agent (synchronous single-turn).
 * Use --agent reporter so it never contends with the daily main session file.
 */
function spawnOne(request, cwd) {
  const { task, label, outputFile, issueKey } = extractTaskAndLabel(request);
  const startedAt = isoNow();

  const sessionId = `${(issueKey || label).toString().toLowerCase()}-${Date.now()}`;
  const args = [
    'agent',
    '--agent', 'reporter',
    '--session-id', sessionId,
    '--message', task,
    '--timeout', '360',
    '--json',
  ];

  const result = spawnSync(OPENCLAW_BIN, args, {
    encoding: 'utf8',
    cwd: cwd || process.cwd(),
    timeout: 360_000,
    env: process.env,
  });

  const finishedAt = isoNow();
  const sessionError =
    result.error || result.status !== 0
      ? (result.stderr || result.error?.message || 'non-zero exit').slice(0, 500)
      : null;
  const fileExists = outputFile ? fs.existsSync(outputFile) : true;

  return {
    label,
    status: result.status === 0 && fileExists ? 'completed' : 'failed',
    started_at: startedAt,
    finished_at: finishedAt,
    output_file: outputFile || null,
    session_error: sessionError || (outputFile && !fileExists ? `Output not found: ${outputFile}` : null),
  };
}

/**
 * spawnBatch — required export.
 * Runs requests sequentially. context can carry batchIndex, totalBatches, cwd, etc.
 */
async function spawnBatch(requests, context = {}) {
  const cwd = context.cwd || process.cwd();
  const results = [];
  for (const req of requests) {
    results.push(spawnOne(req, cwd));
  }
  return results;
}

module.exports = { spawnBatch };
