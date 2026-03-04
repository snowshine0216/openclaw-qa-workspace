import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCompactSitemap, renderDomainSummaryBlock } from '../src/buildCompactSitemap.mjs';

const STUB_MODEL = {
  domain: 'filter',
  displayName: 'Filter',
  navigationHint: 'Library Home -> Filter Panel',
  componentCount: 2,
  workflows: [{ name: 'Apply filter', frequency: 2 }],
  commonElements: [{ label: 'Apply Button', frequency: 3 }],
  detailFile: 'filter.md',
};

test('renderDomainSummaryBlock -- includes alias-aware heading and counters', () => {
  const out = renderDomainSummaryBlock(STUB_MODEL);
  assert.match(out, /## Filter/);
  assert.match(out, /\*\*Common workflows:\*\* 1/);
  assert.match(out, /\*\*Common elements:\*\* 1/);
});

test('buildCompactSitemap -- starts with canonical heading', () => {
  const out = buildCompactSitemap([STUB_MODEL], '/tmp/wdio', { generatedAt: '2026-03-04T10:00:00.000Z' });
  assert.match(out, /^# Site Knowledge -- Compact Sitemap/);
});

test('buildCompactSitemap -- includes all domain display names in input order', () => {
  const out = buildCompactSitemap(
    [
      STUB_MODEL,
      {
        ...STUB_MODEL,
        domain: 'autoAnswers',
        displayName: 'AutoAnswers (AI Assistant)',
        detailFile: 'autoAnswers.md',
      },
    ],
    '/tmp/wdio',
    { generatedAt: '2026-03-04T10:00:00.000Z' }
  );

  assert.ok(out.indexOf('## Filter') < out.indexOf('## AutoAnswers (AI Assistant)'));
  assert.match(out, /query sitemap:autoAnswers/);
});

test('buildCompactSitemap -- includes generation timestamp from injected clock', () => {
  const out = buildCompactSitemap([STUB_MODEL], '/tmp/wdio', { generatedAt: '2026-03-04T10:00:00.000Z' });
  assert.match(out, /> Generated: 2026-03-04T10:00:00.000Z/);
});

test('buildCompactSitemap -- empty models still render canonical header block', () => {
  const out = buildCompactSitemap([], '/tmp/wdio', { generatedAt: '2026-03-04T10:00:00.000Z' });
  assert.match(out, /# Site Knowledge -- Compact Sitemap/);
  assert.match(out, /> Source: `\/tmp\/wdio`/);
});
