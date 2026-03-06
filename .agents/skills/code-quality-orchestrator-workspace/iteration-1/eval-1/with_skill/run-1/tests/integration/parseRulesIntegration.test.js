const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const os = require('node:os');

const { parseRulesText } = require('../../src/rulesTextParser');
const { parseRulesFile } = require('../../src/rulesFileParser');

test('parseRulesText parses non-comment lines and ignores blanks/comments', () => {
  const input = `
# team alert thresholds
latency_ms >= 250 => warn

error_rate > 1.5 => page
`;

  const parsed = parseRulesText(input, 'inline-rules');

  assert.deepEqual(parsed, [
    {
      metric: 'latency_ms',
      operator: '>=',
      threshold: 250,
      action: 'warn',
      lineNumber: 3,
    },
    {
      metric: 'error_rate',
      operator: '>',
      threshold: 1.5,
      action: 'page',
      lineNumber: 5,
    },
  ]);
});

test('parseRulesFile reads file and parses rules without mocks', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rule-parser-'));
  const filePath = path.join(tempDir, 'rules.txt');
  await fs.writeFile(
    filePath,
    '# one comment\nlatency_ms <= 80 => healthy\n',
    'utf8'
  );

  const parsed = await parseRulesFile(filePath);

  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].metric, 'latency_ms');
  assert.equal(parsed[0].operator, '<=');
  assert.equal(parsed[0].threshold, 80);
  assert.equal(parsed[0].action, 'healthy');
});

test('parseRulesText includes source and single line context in parsing error', () => {
  const input = 'latency_ms >= 200 => warn\nthis-is-not-valid';

  assert.throws(() => parseRulesText(input, 'rules.conf'), {
    message: 'rules.conf:line 2: Invalid rule format',
  });
});
