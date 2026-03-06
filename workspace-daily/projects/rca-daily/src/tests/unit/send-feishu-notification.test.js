/**
 * Unit tests for send-feishu-notification.js via CLI invocation
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCRIPT_PATH = path.join(__dirname, '../../utils/send-feishu-notification.js');
const FIXTURE_DIR = path.join(__dirname, '../fixtures');
const SUMMARY_FILE = path.join(FIXTURE_DIR, 'feishu-summary-sample.md');

function runScript(args) {
  return spawnSync('node', [SCRIPT_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env }
  });
}

describe('send-feishu-notification.js', () => {
  it('exits 1 when no args provided', () => {
    const result = runScript([]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage:');
  });

  it('exits 1 when only summary file provided (missing chat-id)', () => {
    const result = runScript([SUMMARY_FILE]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage:');
  });

  it('exits 1 when summary file does not exist', () => {
    const result = runScript(['/nonexistent/path/summary.md', 'chat_123']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Summary file not found');
  });

  it('reads file and runs with valid args (exit 0)', () => {
    const result = runScript([SUMMARY_FILE, 'oc_test_chat_id']);
    expect(result.status).toBe(0);
  });

  it('output contains summary content when execSync fails (fallback path)', () => {
    const result = runScript([SUMMARY_FILE, 'oc_test_chat_id']);
    const output = result.stdout + result.stderr;
    expect(output).toContain('Sending Feishu notification');
    expect(output).toContain('Message length:');
    expect(
      output.includes('✅ Feishu notification sent successfully') ||
        output.includes('--- Summary Content ---')
    ).toBe(true);
  });

  it('output contains expected log lines', () => {
    const result = runScript([SUMMARY_FILE, 'oc_test_chat_id']);
    const output = result.stdout + result.stderr;
    expect(output).toContain('Sending Feishu notification');
    expect(output).toContain('Message length:');
  });
});
