/**
 * openclaw-spawn-bridge.js
 *
 * Real spawn bridge for the RCA orchestrator that uses the OpenClaw
 * `sessions_spawn` tool via the `openclaw sessions spawn` CLI.
 *
 * Contract: export spawnBatch(requests, context) => Promise<result[]>
 * Each result must contain: issue_key, label, status, started_at, finished_at, output_file
 */

'use strict';

const { execSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function isoNow() {
  return new Date().toISOString();
}

/**
 * Wait for a file to appear on disk, polling every intervalMs up to timeoutMs.
 */
function waitForFile(filePath, timeoutMs = 300_000, intervalMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return true;
    // Synchronous sleep via a tight spin is bad; use a child process sleep instead
    spawnSync('sleep', [String(intervalMs / 1000)]);
  }
  return false;
}

/**
 * Run one RCA sub-agent synchronously using the OpenClaw CLI.
 * Returns a result object conforming to the bridge contract.
 */
function spawnOne(request) {
  const issueKey = request.source.issue_key;
  const label = request.request.label;
  const outputFile = request.handoff.result_contract.expected_outputs[0] || '';
  const inputFile = request.request.attachments?.[0]?.path || '';

  const task = [
    `Generate RCA for ${issueKey}.`,
    'Read skill instructions from: .agents/skills/rca/SKILL.md',
    `Input JSON: ${inputFile}`,
    `Output RCA to: ${outputFile}`,
    `Announce: "RCA complete: ${issueKey}" on success or "RCA failed: ${issueKey}" on failure.`,
  ].join('\n');

  const startedAt = isoNow();

  // Build CLI args for openclaw sessions spawn
  // Uses --print / --wait so it runs synchronously in the background process
  const args = [
    'sessions', 'spawn',
    '--runtime', 'subagent',
    '--mode', 'run',
    '--label', label,
    '--cwd', process.cwd(),
    '--wait',        // block until the sub-agent finishes
    '--task', task,
  ];

  console.error(`[spawn-bridge] Spawning ${issueKey} (label=${label})...`);

  const result = spawnSync('openclaw', args, {
    encoding: 'utf8',
    timeout: 360_000,  // 6 min per issue
    env: process.env,
  });

  const finishedAt = isoNow();

  if (result.error || result.status !== 0) {
    console.error(`[spawn-bridge] ${issueKey} failed: ${result.stderr || result.error?.message}`);
    return {
      issue_key: issueKey,
      label,
      status: 'failed',
      started_at: startedAt,
      finished_at: finishedAt,
      output_file: outputFile,
      session_error: (result.stderr || result.error?.message || 'non-zero exit').slice(0, 500),
    };
  }

  // Verify the output file was written
  const fileExists = outputFile ? fs.existsSync(outputFile) : false;

  return {
    issue_key: issueKey,
    label,
    status: fileExists ? 'completed' : 'failed',
    started_at: startedAt,
    finished_at: finishedAt,
    output_file: outputFile,
    session_error: fileExists ? null : `Output file not found after spawn: ${outputFile}`,
  };
}

/**
 * spawnBatch — required export.
 * Runs requests sequentially within each batch call (Phase 3 calls this per batch).
 */
async function spawnBatch(requests, context) {
  const batchIndex = context?.batchIndex ?? 0;
  console.error(`[spawn-bridge] Batch ${batchIndex + 1}/${context?.totalBatches ?? '?'}: ${requests.length} issue(s)`);

  const results = [];
  for (const request of requests) {
    results.push(spawnOne(request));
  }
  return results;
}

module.exports = { spawnBatch };
