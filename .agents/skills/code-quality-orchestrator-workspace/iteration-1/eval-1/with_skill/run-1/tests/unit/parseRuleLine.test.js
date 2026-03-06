const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRuleLine } = require('../../src/ruleParser');

test('parseRuleLine parses a valid rule', () => {
  const parsed = parseRuleLine('latency_ms >= 250 => warn', 3);
  assert.deepEqual(parsed, {
    metric: 'latency_ms',
    operator: '>=',
    threshold: 250,
    action: 'warn',
    lineNumber: 3,
  });
});

test('parseRuleLine trims surrounding whitespace', () => {
  const parsed = parseRuleLine('  error_rate  >  1.5   =>   page  ', 7);
  assert.equal(parsed.metric, 'error_rate');
  assert.equal(parsed.operator, '>');
  assert.equal(parsed.threshold, 1.5);
  assert.equal(parsed.action, 'page');
  assert.equal(parsed.lineNumber, 7);
});

test('parseRuleLine rejects unsupported operator', () => {
  assert.throws(
    () => parseRuleLine('error_rate <> 1.5 => page', 2),
    /Unsupported operator|Invalid rule format|line 2/
  );
});

test('parseRuleLine rejects invalid metric token', () => {
  assert.throws(
    () => parseRuleLine('9metric >= 10 => warn', 9),
    /Invalid metric|Invalid rule format|line 9/
  );
});

test('parseRuleLine rejects missing action', () => {
  assert.throws(
    () => parseRuleLine('latency_ms >= 250 =>', 4),
    /Invalid action|Invalid rule format|line 4/
  );
});
