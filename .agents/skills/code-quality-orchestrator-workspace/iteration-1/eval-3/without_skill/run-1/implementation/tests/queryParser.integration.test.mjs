import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFilterQuery } from '../src/queryParser.mjs';

test('integration: parses mixed operators, quoted values, coercion, and invalid token recovery', () => {
  const query = 'status:open priority>=2 owner:"Jane Doe" archived:false badtoken attempts<=3';
  const result = parseFilterQuery(query);

  assert.deepEqual(result.filters, {
    status: { op: ':', value: 'open' },
    priority: { op: '>=', value: 2 },
    owner: { op: ':', value: 'Jane Doe' },
    archived: { op: ':', value: false },
    attempts: { op: '<=', value: 3 }
  });

  assert.deepEqual(result.errors, [
    {
      token: 'badtoken',
      index: 4,
      reason: 'Unsupported token format'
    }
  ]);
});
