import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCompactSitemap } from '../src/buildCompactSitemap.mjs';

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/golden');
const GOLDEN_PATH = path.join(FIXTURES_DIR, 'SITEMAP.md');

const MODELS = [
  {
    domain: 'filter',
    displayName: 'Filter',
    navigationHint: 'Auto-generated from pageObjects/filter',
    componentCount: 2,
    workflows: Array.from({ length: 1 }),
    commonElements: Array.from({ length: 9 }),
    detailFile: 'filter.md',
  },
  {
    domain: 'autoAnswers',
    displayName: 'AutoAnswers (AI Assistant)',
    navigationHint: 'Auto-generated from pageObjects/autoAnswers',
    componentCount: 1,
    workflows: Array.from({ length: 1 }),
    commonElements: Array.from({ length: 2 }),
    detailFile: 'autoAnswers.md',
  },
];

test('buildCompactSitemap.golden -- matches canonical Layer 1 golden output', async () => {
  const out = buildCompactSitemap(MODELS, 'tests/fixtures/wdio-stub', {
    generatedAt: '2026-03-04T10:00:00.000Z',
  });

  const expected = await fs.readFile(GOLDEN_PATH, 'utf8');
  assert.equal(out, expected);
});
