import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { saveKnowledgeToFile } from '../src/saveKnowledgeToFile.mjs';

const STUB_SHEETS = [
  { domain: 'filter', content: '# filter\n', componentCount: 3 },
  { domain: 'autoAnswers', content: '# autoAnswers\n', componentCount: 2 },
];
const STUB_SITEMAP = '# SITEMAP content\n';
const STUB_METADATA = {
  generatedAt: '2026-03-04T10:00:00.000Z',
  sourceRepo: '/local/wdio',
  domains: {
    filter: { componentCount: 3, filePath: 'filter.md' },
    autoAnswers: { componentCount: 2, filePath: 'autoAnswers.md' },
  },
};

async function makeTmpDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'sitemap-generator-save-'));
}

test('saveKnowledgeToFile -- creates output directory if it does not exist', async () => {
  const root = await makeTmpDir();
  const outDir = path.join(root, 'nested', 'site-knowledge');
  await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  const stat = await fs.stat(outDir);
  assert.equal(stat.isDirectory(), true);
});

test('saveKnowledgeToFile -- writes SITEMAP.md with correct content', async () => {
  const outDir = await makeTmpDir();
  await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  const content = await fs.readFile(path.join(outDir, 'SITEMAP.md'), 'utf8');
  assert.equal(content, STUB_SITEMAP);
});

test('saveKnowledgeToFile -- writes one .md file per domain sheet', async () => {
  const outDir = await makeTmpDir();
  const result = await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  assert.ok(result.filesWritten.includes('filter.md'));
  assert.ok(result.filesWritten.includes('autoAnswers.md'));
});

test('saveKnowledgeToFile -- writes metadata.json', async () => {
  const outDir = await makeTmpDir();
  await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  const raw = await fs.readFile(path.join(outDir, 'metadata.json'), 'utf8');
  const parsed = JSON.parse(raw);
  assert.equal(parsed.generatedAt, STUB_METADATA.generatedAt);
});

test('saveKnowledgeToFile -- is idempotent (second call overwrites, no error)', async () => {
  const outDir = await makeTmpDir();
  await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  await assert.doesNotReject(() => saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA));
});

test('saveKnowledgeToFile -- returns SaveResult with correct filesWritten list', async () => {
  const outDir = await makeTmpDir();
  const result = await saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA);
  assert.ok(result.filesWritten.includes('SITEMAP.md'));
  assert.ok(result.filesWritten.includes('metadata.json'));
  assert.equal(result.outputDir, outDir);
});

test('saveKnowledgeToFile -- empty sheets writes only SITEMAP.md + metadata.json', async () => {
  const outDir = await makeTmpDir();
  const result = await saveKnowledgeToFile(outDir, [], STUB_SITEMAP, STUB_METADATA);
  assert.equal(result.filesWritten.length, 2);
  assert.deepEqual(new Set(result.filesWritten), new Set(['SITEMAP.md', 'metadata.json']));
});

test('saveKnowledgeToFile -- read-only outputDir throws descriptive error', async () => {
  const root = await makeTmpDir();
  const outDir = path.join(root, 'readonly');
  await fs.mkdir(outDir, { recursive: true });
  await fs.chmod(outDir, 0o555);

  try {
    await assert.rejects(
      () => saveKnowledgeToFile(outDir, STUB_SHEETS, STUB_SITEMAP, STUB_METADATA),
      /EACCES|EPERM/i
    );
  } finally {
    await fs.chmod(outDir, 0o755);
  }
});
