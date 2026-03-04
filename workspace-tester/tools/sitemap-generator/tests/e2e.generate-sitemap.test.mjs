import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import domainsConfig from '../config/domains.json' with { type: 'json' };
import { main } from '../generate-sitemap.mjs';

const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const GOLDEN_DIR = path.join(TEST_ROOT, 'fixtures/golden');
const FIXTURE_REPO = 'tests/fixtures/wdio-stub';

function normalizeSitemapTimestamp(content) {
  return content.replace(/^(> Generated: ).*$/m, '$1<TIMESTAMP>');
}

async function makeTmpDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'sitemap-generator-e2e-'));
}

test('e2e.generate-sitemap -- default output hides verbose-only sections', async () => {
  const outputDir = await makeTmpDir();
  await main(
    ['--repo', FIXTURE_REPO, '--domains', 'filter,autoAnswers', '--output-dir', outputDir],
    { now: () => new Date('2026-03-04T10:00:00.000Z') }
  );

  const [generatedSitemap, generatedFilter, generatedAutoAnswers] = await Promise.all([
    fs.readFile(path.join(outputDir, 'SITEMAP.md'), 'utf8'),
    fs.readFile(path.join(outputDir, 'filter.md'), 'utf8'),
    fs.readFile(path.join(outputDir, 'autoAnswers.md'), 'utf8'),
  ]);

  const [goldenSitemap, goldenFilter, goldenAutoAnswers] = await Promise.all([
    fs.readFile(path.join(GOLDEN_DIR, 'SITEMAP.md'), 'utf8'),
    fs.readFile(path.join(GOLDEN_DIR, 'filter.md'), 'utf8'),
    fs.readFile(path.join(GOLDEN_DIR, 'autoAnswers.md'), 'utf8'),
  ]);

  assert.equal(normalizeSitemapTimestamp(generatedSitemap), normalizeSitemapTimestamp(goldenSitemap));
  assert.equal(generatedFilter, goldenFilter);
  assert.equal(generatedAutoAnswers, goldenAutoAnswers);

  assert.doesNotMatch(generatedFilter, /## Common Workflows \(from spec\.ts\)\n\n1\. _none_/);
  assert.doesNotMatch(generatedAutoAnswers, /## Common Workflows \(from spec\.ts\)\n\n1\. _none_/);
  assert.doesNotMatch(generatedFilter, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.doesNotMatch(generatedFilter, /## Key Actions/);
  assert.doesNotMatch(generatedFilter, /\*\*Component actions:\*\*/);
  assert.doesNotMatch(generatedAutoAnswers, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.doesNotMatch(generatedAutoAnswers, /## Key Actions/);
  assert.doesNotMatch(generatedAutoAnswers, /\*\*Component actions:\*\*/);
});

test('e2e.generate-sitemap -- verbose output includes verbose-only sections', async () => {
  const outputDir = await makeTmpDir();
  await main(
    [
      '--repo',
      FIXTURE_REPO,
      '--domains',
      'filter,autoAnswers',
      '--output-dir',
      outputDir,
      '--verbose=true',
    ],
    { now: () => new Date('2026-03-04T10:00:00.000Z') }
  );

  const [generatedFilter, generatedAutoAnswers] = await Promise.all([
    fs.readFile(path.join(outputDir, 'filter.md'), 'utf8'),
    fs.readFile(path.join(outputDir, 'autoAnswers.md'), 'utf8'),
  ]);

  const [goldenFilterVerbose, goldenAutoAnswersVerbose] = await Promise.all([
    fs.readFile(path.join(GOLDEN_DIR, 'filter.verbose.md'), 'utf8'),
    fs.readFile(path.join(GOLDEN_DIR, 'autoAnswers.verbose.md'), 'utf8'),
  ]);

  assert.equal(generatedFilter, goldenFilterVerbose);
  assert.equal(generatedAutoAnswers, goldenAutoAnswersVerbose);

  assert.match(generatedFilter, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.match(generatedFilter, /## Key Actions/);
  assert.match(generatedFilter, /\*\*Component actions:\*\*/);
  assert.match(generatedAutoAnswers, /## Common Elements \(from POM \+ spec\.ts\)/);
  assert.match(generatedAutoAnswers, /## Key Actions/);
  assert.match(generatedAutoAnswers, /\*\*Component actions:\*\*/);
});

test('e2e.generate-sitemap -- --domains all includes every configured domain in order', async () => {
  const outputDir = await makeTmpDir();
  await main(
    ['--repo', FIXTURE_REPO, '--domains', 'all', '--output-dir', outputDir],
    { now: () => new Date('2026-03-04T10:00:00.000Z') }
  );

  const sitemap = await fs.readFile(path.join(outputDir, 'SITEMAP.md'), 'utf8');
  const keys = Object.keys(domainsConfig.domains);

  let lastPosition = -1;
  for (const key of keys) {
    const marker = `query sitemap:${key}`;
    const currentPosition = sitemap.indexOf(marker);
    assert.notEqual(currentPosition, -1, `Missing sitemap block for domain "${key}"`);
    assert.ok(currentPosition > lastPosition, `Domain "${key}" is out of config order`);
    lastPosition = currentPosition;
  }
});
