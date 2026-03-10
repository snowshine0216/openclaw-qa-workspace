const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const assert = require('node:assert/strict');

const scriptPath = path.join(__dirname, '../lib/generate-rcas-via-agent.js');
const fixturesDir = path.join(__dirname, 'fixtures');
const manifestPath = path.join(fixturesDir, 'manifest-gen-sample.json');
const bridgePath = path.join(fixturesDir, 'mock-spawn-bridge.js');

function run(args, env = {}) {
  return spawnSync('node', [scriptPath, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

test('fails without required args', () => {
  const result = run([]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing required arguments/);
});

test('fails when bridge is missing', () => {
  const out = path.join(os.tmpdir(), `spawn-results-${Date.now()}.json`);
  const result = run(['--manifest', manifestPath, '--output', out]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing spawn bridge/);
});

test('writes spawn-results with mocked bridge', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rca-bridge-'));
  const outputPath = path.join(tempDir, 'spawn-results.json');
  const result = run(['--manifest', manifestPath, '--output', outputPath, '--bridge-module', bridgePath]);

  assert.equal(result.status, 0);
  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  assert.equal(output.total_issues, 2);
  assert.equal(output.results[0].issue_key, 'BCIN-1001');
  assert.equal(output.results[1].label, 'rca-BCIN-1002');
});
