import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCompactSitemap, renderDomainSummaryBlock } from '../src/buildCompactSitemap.mjs';

const STUB_SHEET = { domain: 'filter', content: '# filter\n...', componentCount: 12 };

test('renderDomainSummaryBlock -- includes domain name', () => {
  const out = renderDomainSummaryBlock(STUB_SHEET);
  assert.match(out, /## filter/);
});

test('renderDomainSummaryBlock -- includes component count', () => {
  const out = renderDomainSummaryBlock(STUB_SHEET);
  assert.match(out, /\*\*Components:\*\* 12/);
});

test('buildCompactSitemap -- starts with # h1 heading', () => {
  const out = buildCompactSitemap([STUB_SHEET], '/tmp/wdio');
  assert.match(out, /^# /);
});

test('buildCompactSitemap -- includes all domain names', () => {
  const out = buildCompactSitemap(
    [
      STUB_SHEET,
      { domain: 'autoAnswers', content: '# autoAnswers', componentCount: 4 },
      { domain: 'aibot', content: '# aibot', componentCount: 27 },
    ],
    '/tmp/wdio'
  );
  assert.match(out, /## filter/);
  assert.match(out, /## autoAnswers/);
  assert.match(out, /## aibot/);
});

test('buildCompactSitemap -- includes generation timestamp', () => {
  const out = buildCompactSitemap([STUB_SHEET], '/tmp/wdio');
  assert.match(out, /> Generated: /);
});

test('buildCompactSitemap -- empty sheets -> minimal header-only string', () => {
  const out = buildCompactSitemap([], '/tmp/wdio');
  assert.match(out, /# Site Knowledge -- Compact Sitemap/);
  assert.ok(out.trim().length > 0);
});
