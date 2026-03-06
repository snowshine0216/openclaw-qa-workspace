import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFilterQuery } from '../src/queryParser.mjs';

test('parses colon operator and string value', () => {
  const result = parseFilterQuery('status:open');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters.status, { op: ':', value: 'open' });
});

test('parses >= operator and coerces numeric values', () => {
  const result = parseFilterQuery('priority>=2');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters.priority, { op: '>=', value: 2 });
});

test('parses <= operator and coerces boolean values', () => {
  const result = parseFilterQuery('archived<=false');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters.archived, { op: '<=', value: false });
});

test('handles quoted values with spaces', () => {
  const result = parseFilterQuery('owner:"Jane Doe"');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters.owner, { op: ':', value: 'Jane Doe' });
});

test('duplicate keys keep the last valid token', () => {
  const result = parseFilterQuery('status:open status:closed');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters.status, { op: ':', value: 'closed' });
});

test('invalid tokens are reported with token index and parser continues', () => {
  const result = parseFilterQuery('status:open badtoken priority>=3');
  assert.equal(result.errors.length, 1);
  assert.deepEqual(result.errors[0], {
    token: 'badtoken',
    index: 1,
    reason: 'Unsupported token format'
  });
  assert.deepEqual(result.filters.status, { op: ':', value: 'open' });
  assert.deepEqual(result.filters.priority, { op: '>=', value: 3 });
});
