/**
 * Unit tests for generate-rcas-via-agent.js via CLI invocation
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCRIPT_PATH = path.join(__dirname, '../../utils/generate-rcas-via-agent.js');
const FIXTURE_DIR = path.join(__dirname, '../fixtures');
const MANIFEST_FILE = path.join(FIXTURE_DIR, 'rca-manifest-sample.json');

function runScript(args) {
  return spawnSync('node', [SCRIPT_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env }
  });
}

describe('generate-rcas-via-agent.js', () => {
  it('exits 1 when no manifest path provided', () => {
    const result = runScript([]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage:');
  });

  it('exits 1 when manifest file does not exist', () => {
    const result = runScript(['/nonexistent/rca-manifest-999999.json']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Manifest file not found');
  });

  it('parses valid manifest and exits 0', () => {
    const result = runScript([MANIFEST_FILE]);
    expect(result.status).toBe(0);
  });

  it('output contains total_issues from manifest', () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    const result = runScript([MANIFEST_FILE]);
    const output = result.stdout + result.stderr;
    expect(output).toContain(`Issues to process: ${manifest.total_issues}`);
  });

  it('output contains MANIFEST_JSON for agent consumption', () => {
    const result = runScript([MANIFEST_FILE]);
    const output = result.stdout + result.stderr;
    expect(output).toContain('MANIFEST_JSON:');
    expect(output).toContain('"total_issues":2');
  });

  it('exits 1 when manifest contains invalid JSON', () => {
    const invalidPath = path.join(FIXTURE_DIR, 'invalid-manifest.json');
    fs.writeFileSync(invalidPath, '{ invalid json }', 'utf8');
    try {
      const result = runScript([invalidPath]);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Error');
    } finally {
      if (fs.existsSync(invalidPath)) fs.unlinkSync(invalidPath);
    }
  });
});
