import test from 'node:test';
import assert from 'node:assert/strict';
import { extractKnownLimitationsSeed } from '../lib/extractKnownLimitations.mjs';

test('returns empty lines when no heading and no outOfScopeLines', () => {
  const result = extractKnownLimitationsSeed('# QA Plan\n\n## Test Coverage\n- item');
  assert.deepEqual(result.lines, []);
  assert.equal(result.raw, '');
});

test('collects bullets under ## Known Limitations heading, stops at next heading', () => {
  const md = [
    '## Known Limitations',
    '- i18n not supported',
    '- offline mode deferred',
    '',
    '## Another Section',
    '- unrelated bullet',
  ].join('\n');
  const result = extractKnownLimitationsSeed(md);
  assert.deepEqual(result.lines, ['i18n not supported', 'offline mode deferred']);
});

test('collects bullets under ## Known Issues heading', () => {
  const md = [
    '## Known Issues',
    '- performance degrades with 1000+ items',
  ].join('\n');
  const result = extractKnownLimitationsSeed(md);
  assert.deepEqual(result.lines, ['performance degrades with 1000+ items']);
});

test('merges outOfScopeLines arg with heading-scanned lines, deduplicates', () => {
  const md = '## Known Limitations\n- mobile not in scope\n';
  const result = extractKnownLimitationsSeed(md, ['accessibility not in scope', 'mobile not in scope']);
  assert.ok(result.lines.includes('mobile not in scope'), 'mobile not in scope present');
  assert.ok(result.lines.includes('accessibility not in scope'), 'accessibility not in scope present');
  // deduplication: "mobile not in scope" appears only once
  assert.equal(result.lines.filter(l => l === 'mobile not in scope').length, 1);
});

test('strips <P1> / <P2> markers from bullet text', () => {
  const md = '## Known Limitations\n- <P1> performance not addressed\n- <P2>offline mode deferred\n';
  const result = extractKnownLimitationsSeed(md);
  assert.deepEqual(result.lines, ['performance not addressed', 'offline mode deferred']);
});

test('returns raw as empty string when lines is empty', () => {
  const result = extractKnownLimitationsSeed('# Just a header\n');
  assert.equal(result.raw, '');
  assert.deepEqual(result.lines, []);
});

test('returns raw as formatted markdown list when lines are present', () => {
  const md = '## Known Limitations\n- item one\n- item two\n';
  const result = extractKnownLimitationsSeed(md);
  assert.equal(result.raw, '- item one\n- item two\n');
});

test('ignores non-bullet prose under the heading', () => {
  const md = [
    '## Known Limitations',
    'This section lists limitations.',
    '- actual limitation',
    'More prose here.',
  ].join('\n');
  const result = extractKnownLimitationsSeed(md);
  assert.deepEqual(result.lines, ['actual limitation']);
});

test('deduplicates when same text appears in both heading scan and outOfScopeLines', () => {
  const md = '## Known Limitations\n- i18n deferred\n';
  const result = extractKnownLimitationsSeed(md, ['i18n deferred', 'another item']);
  assert.equal(result.lines.filter(l => l === 'i18n deferred').length, 1);
  assert.equal(result.lines.length, 2);
});

test('heading "## Known Limitations Overview" does NOT match', () => {
  const md = [
    '## Known Limitations Overview',
    '- should not be collected',
    '',
    '## Known Limitations',
    '- should be collected',
  ].join('\n');
  const result = extractKnownLimitationsSeed(md);
  assert.deepEqual(result.lines, ['should be collected']);
});
