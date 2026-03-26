import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSpawnInput } from '../scripts/lib/normalizeSpawnInput.mjs';

test('openclaw.args does not contain streamTo when runtime is subagent', () => {
  const input = {
    agent_id: 'qa-plan-orchestrator',
    mode: 'run',
    runtime: 'subagent',
    task: 'Test task',
    label: 'test-label',
  };
  const result = normalizeSpawnInput(input);
  const args = result.requests[0].openclaw.args;

  assert.equal(args.runtime, 'subagent');
  assert.ok(!('streamTo' in args), 'openclaw.args must not contain streamTo when runtime is subagent');
  assert.deepEqual(Object.keys(args).sort(), ['agentId', 'attachments', 'label', 'mode', 'runtime', 'task', 'thread']);
});

test('openclaw.args does not include streamTo even when passed in input', () => {
  const input = {
    agent_id: 'qa-plan-orchestrator',
    mode: 'run',
    runtime: 'subagent',
    task: 'Test task',
    streamTo: 'parent', // invalid; must be stripped
  };
  const result = normalizeSpawnInput(input);
  const args = result.requests[0].openclaw.args;

  assert.ok(!('streamTo' in args), 'streamTo must not appear in openclaw.args when runtime is subagent');
});

test('preserves the renamed orchestrator agent id', () => {
  const input = {
    agent_id: 'qa-plan-orchestrator',
    mode: 'run',
    runtime: 'subagent',
    task: 'Test task',
  };
  const result = normalizeSpawnInput(input);

  assert.equal(result.requests[0].openclaw.args.agentId, 'qa-plan-orchestrator');
});
