const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  convertMarkdownToConfluence,
} = require('../lib/markdown_to_confluence.js');

const fixtureDir = path.join(__dirname, 'fixtures');

test('converts representative markdown fixture to storage html', () => {
  const markdown = fs.readFileSync(path.join(fixtureDir, 'sample.md'), 'utf8');
  const expected = fs
    .readFileSync(path.join(fixtureDir, 'sample.expected.html'), 'utf8')
    .trim();

  const actual = convertMarkdownToConfluence(markdown).trim();

  assert.equal(actual, expected);
});

test('does not leave raw markdown markers for supported syntax', () => {
  const markdown = fs.readFileSync(path.join(fixtureDir, 'sample.md'), 'utf8');
  const actual = convertMarkdownToConfluence(markdown);

  assert.ok(!actual.includes('**plan**'));
  assert.ok(!actual.includes('[link](https://example.com)'));
  assert.ok(!actual.includes('| Name | Status |'));
  assert.ok(!actual.includes('```bash'));
});

test('escapes inline entities exactly once for code and links', () => {
  const markdown = '`a&b` and [query](https://example.com/path?a=1&b=2)';
  const actual = convertMarkdownToConfluence(markdown);

  assert.match(actual, /<code>a&amp;b<\/code>/);
  assert.match(actual, /href="https:\/\/example\.com\/path\?a=1&amp;b=2"/);
  assert.ok(!actual.includes('&amp;amp;'));
});
