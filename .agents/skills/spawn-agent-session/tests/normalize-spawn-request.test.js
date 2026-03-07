const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const cliPath = path.join(__dirname, '..', 'scripts', 'normalize-spawn-request.js');
const libPath = path.join(__dirname, '..', 'scripts', 'lib', 'normalize-spawn-request.js');

const writeJson = (dir, name, value) => {
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  return filePath;
};

const runCli = (args) => spawnSync('node', [cliPath, ...args], {
  encoding: 'utf8',
});

test('normalizes a canonical single request with OpenClaw sessions_spawn args', () => {
  const { normalizeSpawnInput } = require(libPath);
  const normalized = normalizeSpawnInput({
    agent_id: 'gpt-5.3-codex',
    mode: 'run',
    runtime: 'subagent',
    task: 'Generate RCA for BCIN-1234 using attached payload',
    attachments: [{ name: 'rca-input.json', path: '/tmp/rca-input-BCIN-1234.json' }],
    label: 'rca-BCIN-1234',
    thread: false,
  });

  assert.equal(normalized.count, 1);
  assert.equal(normalized.requests[0].request.agent_id, 'gpt-5.3-codex');
  assert.equal(normalized.requests[0].request.label, 'rca-BCIN-1234');
  assert.equal(normalized.requests[0].handoff.label, 'rca-BCIN-1234');
  assert.equal(normalized.requests[0].handoff.session_key_hint, 'spawn-agent-session:rca-BCIN-1234');
  assert.equal(normalized.requests[0].openclaw.tool, 'sessions_spawn');
  assert.deepEqual(normalized.requests[0].openclaw.args, {
    task: 'Generate RCA for BCIN-1234 using attached payload',
    agentId: 'gpt-5.3-codex',
    label: 'rca-BCIN-1234',
    mode: 'run',
    runtime: 'subagent',
    attachments: [{ name: 'rca-input.json', path: '/tmp/rca-input-BCIN-1234.json' }],
    thread: false,
  });
});

test('rejects canonical input missing required fields', () => {
  const { normalizeSpawnInput } = require(libPath);
  assert.throws(
    () => normalizeSpawnInput({ mode: 'run', runtime: 'subagent', task: 'Missing agent id' }),
    /agent_id/
  );
});

test('rejects attachments with non-string path or content values', () => {
  const { normalizeSpawnInput } = require(libPath);
  assert.throws(
    () => normalizeSpawnInput({
      agent_id: 'gpt-5.3-codex',
      mode: 'run',
      runtime: 'subagent',
      task: 'Generate RCA for BCIN-1234 using attached payload',
      attachments: [{ name: 'rca-input.json', path: { bad: true } }],
    }),
    /attachments\[0\]\.path/
  );
});

test('rejects legacy templates with unknown placeholders', () => {
  const { normalizeSpawnInput } = require(libPath);
  assert.throws(
    () => normalizeSpawnInput({
      rca_inputs: [{
        issue_key: 'BCIN-1234',
        input_file: '/tmp/output/rca-input-BCIN-1234.json',
        output_file: '/tmp/output/rca/BCIN-1234-rca.md',
      }],
    }, {
      agentId: 'gpt-5.3-codex',
      mode: 'run',
      runtime: 'subagent',
      taskTemplate: 'Generate RCA for {{unknown_field}}',
    }),
    /Unknown template placeholder/
  );
});

test('normalizes a legacy RCA manifest into OpenClaw-ready requests', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spawn-agent-session-'));
  const manifestPath = writeJson(tempDir, 'legacy-rca-manifest.json', {
    timestamp: '20260305-120000',
    total_issues: 2,
    rca_inputs: [
      {
        issue_key: 'BCIN-1234',
        input_file: '/tmp/output/rca-input-BCIN-1234.json',
        output_file: '/tmp/output/rca/BCIN-1234-rca.md',
      },
      {
        issue_key: 'BCIN-5678',
        input_file: '/tmp/output/rca-input-BCIN-5678.json',
        output_file: '/tmp/output/rca/BCIN-5678-rca.md',
      },
    ],
  });

  const result = runCli([
    manifestPath,
    '--agent-id',
    'reporter',
    '--mode',
    'run',
    '--runtime',
    'subagent',
    '--task-template',
    'Generate RCA for {{issue_key}}. Input: {{input_file}} Output: {{output_file}}',
    '--label-template',
    'rca-{{issue_key}}',
  ]);

  assert.equal(result.status, 0, result.stderr);
  const normalized = JSON.parse(result.stdout);
  assert.equal(normalized.count, 2);
  assert.equal(normalized.requests[0].request.task, 'Generate RCA for BCIN-1234. Input: /tmp/output/rca-input-BCIN-1234.json Output: /tmp/output/rca/BCIN-1234-rca.md');
  assert.equal(normalized.requests[1].request.label, 'rca-BCIN-5678');
  assert.equal(normalized.requests[0].request.attachments[0].path, '/tmp/output/rca-input-BCIN-1234.json');
  assert.equal(normalized.requests[0].handoff.result_contract.expected_outputs[0], '/tmp/output/rca/BCIN-1234-rca.md');
  assert.deepEqual(normalized.requests[0].openclaw.args, {
    task: 'Generate RCA for BCIN-1234. Input: /tmp/output/rca-input-BCIN-1234.json Output: /tmp/output/rca/BCIN-1234-rca.md',
    agentId: 'reporter',
    label: 'rca-BCIN-1234',
    mode: 'run',
    runtime: 'subagent',
    attachments: [{ name: 'input.json', path: '/tmp/output/rca-input-BCIN-1234.json' }],
    thread: false,
  });
});

test('cli exits non-zero for a missing input file', () => {
  const result = runCli(['/tmp/does-not-exist.json']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Input file not found/);
});

test('cli exits non-zero for an unsupported flag', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spawn-agent-session-'));
  const inputPath = writeJson(tempDir, 'canonical.json', {
    agent_id: 'gpt-5.3-codex',
    mode: 'run',
    runtime: 'subagent',
    task: 'Generate RCA for BCIN-1234 using attached payload',
  });

  const result = runCli([inputPath, '--bogus-flag', 'x']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unsupported flag/);
});

test('cli exits non-zero for invalid JSON', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spawn-agent-session-'));
  const invalidPath = path.join(tempDir, 'invalid.json');
  fs.writeFileSync(invalidPath, '{ invalid json }');

  const result = runCli([invalidPath]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid JSON/);
});
