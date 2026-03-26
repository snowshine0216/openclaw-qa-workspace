import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'lib', 'validate_plan_artifact.mjs');

function runCli(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [SCRIPT, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('validate_request_fulfillment_manifest accepts structured request requirements', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const taskPath = join(root, 'task.json');
  await writeFile(taskPath, JSON.stringify({
    request_requirements: [
      {
        requirement_id: 'req-1',
        kind: 'read_material',
        required_phase: 'phase1',
        required_artifacts: ['context/supporting_issue_summary_BCIN-1.md'],
        blocking_on_missing: true,
      },
    ],
  }, null, 2));

  const result = await runCli(['validate_request_fulfillment_manifest', taskPath]);
  assert.equal(result.code, 0, result.stderr);
  await rm(root, { recursive: true, force: true });
});

test('validate_request_fulfillment_manifest accepts ordinary jira-only tasks with no extra requirements', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const taskPath = join(root, 'task.json');
  await writeFile(taskPath, JSON.stringify({
    feature_id: 'BCIN-1',
    request_requirements: [],
  }, null, 2));

  const result = await runCli(['validate_request_fulfillment_manifest', taskPath]);
  assert.equal(result.code, 0, result.stderr);
  await rm(root, { recursive: true, force: true });
});

test('validate_request_fulfillment_status rejects unsatisfied blocking requirements', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const fulfillmentPath = join(root, 'request_fulfillment.json');
  await writeFile(fulfillmentPath, JSON.stringify({
    requirements: [
      {
        requirement_id: 'req-1',
        blocking_on_missing: true,
        status: 'pending',
      },
    ],
  }, null, 2));

  const result = await runCli(['validate_request_fulfillment_status', fulfillmentPath]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /req-1/);
  await rm(root, { recursive: true, force: true });
});

test('validate_request_fulfillment_status accepts blocked and waived blocking requirements', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const fulfillmentPath = join(root, 'request_fulfillment.json');
  await writeFile(fulfillmentPath, JSON.stringify({
    requirements: [
      {
        requirement_id: 'req-1',
        blocking_on_missing: true,
        status: 'blocked_with_reason',
      },
      {
        requirement_id: 'req-2',
        blocking_on_missing: true,
        status: 'explicitly_waived_by_user',
      },
    ],
  }, null, 2));

  const result = await runCli(['validate_request_fulfillment_status', fulfillmentPath]);
  assert.equal(result.code, 0, result.stderr);
  await rm(root, { recursive: true, force: true });
});

test('validate_research_order rejects confluence-before-tavily execution', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const runPath = join(root, 'run.json');
  await writeFile(runPath, JSON.stringify({
    request_execution_log: [
      {
        phase: 'phase3',
        topic_slug: 'report_editor_workstation_functionality',
        tool: 'confluence',
        status: 'satisfied',
      },
    ],
  }, null, 2));

  const result = await runCli(['validate_research_order', runPath]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Tavily/i);
  await rm(root, { recursive: true, force: true });
});

test('validate_research_order rejects confluence-before-tavily in deep_research_execution steps format', async () => {
  const root = await mkdtemp(join(tmpdir(), 'validate-artifact-'));
  const execPath = join(root, 'deep_research_execution_BCIN-50.json');
  await writeFile(execPath, JSON.stringify({
    steps: [
      { step: 1, topic_slug: 'report_editor_workstation_functionality', tool: 'confluence', status: 'satisfied' },
      { step: 2, topic_slug: 'report_editor_workstation_functionality', tool: 'tavily-search', status: 'satisfied' },
    ],
  }, null, 2));

  const result = await runCli(['validate_research_order', execPath]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Tavily/i);
  await rm(root, { recursive: true, force: true });
});
