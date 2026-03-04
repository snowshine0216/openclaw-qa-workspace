import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGitHubApiPath, resolvePomFiles } from '../src/resolvePomFiles.mjs';

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/wdio-stub');

test('resolvePomFiles -- returns PomFileEntry list for a single domain', async () => {
  const entries = await resolvePomFiles(FIXTURES_DIR, ['filter']);
  assert.ok(entries.length >= 1);
  assert.ok(entries.every((entry) => entry.domain === 'filter'));
  assert.ok(entries.every((entry) => entry.fileName.endsWith('.js')));
});

test('resolvePomFiles -- handles multiple domains', async () => {
  const entries = await resolvePomFiles(FIXTURES_DIR, ['filter', 'autoAnswers']);
  const domains = new Set(entries.map((entry) => entry.domain));
  assert.equal(domains.has('filter'), true);
  assert.equal(domains.has('autoAnswers'), true);
});

test('resolvePomFiles -- resolves entries via GitHub API when URL is provided', async () => {
  const fakeList = async (apiPath) => {
    const map = {
      'repos/acme/wdio/contents/tests/wdio/pageObjects/filter': [
        {
          name: 'CalendarFilter.js',
          path: 'pageObjects/filter/CalendarFilter.js',
          type: 'file',
          url: 'https://api.github.com/repos/acme/wdio/contents/pageObjects/filter/CalendarFilter.js',
        },
      ],
    };
    if (!(apiPath in map)) {
      throw new Error('404');
    }
    return map[apiPath];
  };

  const entries = await resolvePomFiles('https://github.com/acme/wdio', ['filter'], {
    listRemoteDirectory: fakeList,
  });

  assert.ok(entries.length >= 1);
  assert.ok(entries.every((entry) => entry.isRemote));
  assert.ok(entries.every((entry) => entry.domain === 'filter'));
});

test('resolvePomFiles -- remote listing errors are propagated', async () => {
  await assert.rejects(
    () =>
      resolvePomFiles('https://github.com/acme/wdio', ['filter'], {
        listRemoteDirectory: async () => {
          throw new Error('403 Forbidden');
        },
      }),
    /Remote listing failed.*pageObjects\/filter.*403 Forbidden/
  );
});

test('resolvePomFiles -- resolves entries for SSH GitHub URL (git@github.com:owner/repo.git)', async () => {
  const calledPaths = [];
  const fakeList = async (apiPath) => {
    calledPaths.push(apiPath);
    if (apiPath === 'repos/mstr-kiai/web-dossier/contents/tests/wdio/pageObjects/filter') {
      return [];
    }
    throw new Error('404');
  };

  await resolvePomFiles('git@github.com:mstr-kiai/web-dossier.git', ['filter'], {
    listRemoteDirectory: fakeList,
  });

  assert.ok(calledPaths.some((value) => value.startsWith('repos/mstr-kiai/web-dossier/contents/tests/wdio/')));
});

test('getGitHubApiPath -- supports https, ssh scp-style, and ssh URL forms', () => {
  assert.equal(
    getGitHubApiPath('https://github.com/mstr-kiai/web-dossier'),
    'repos/mstr-kiai/web-dossier/contents/tests/wdio'
  );
  assert.equal(
    getGitHubApiPath('git@github.com:mstr-kiai/web-dossier.git'),
    'repos/mstr-kiai/web-dossier/contents/tests/wdio'
  );
  assert.equal(
    getGitHubApiPath('ssh://git@github.com/mstr-kiai/web-dossier'),
    'repos/mstr-kiai/web-dossier/contents/tests/wdio'
  );
});

test('resolvePomFiles -- "all" shorthand returns all configured domains', async () => {
  const entries = await resolvePomFiles(FIXTURES_DIR, ['all']);
  const domains = new Set(entries.map((entry) => entry.domain));
  assert.equal(domains.has('filter'), true);
  assert.equal(domains.has('autoAnswers'), true);
  assert.equal(domains.has('aibot'), true);
});

test('resolvePomFiles -- unknown domain returns empty array', async () => {
  const entries = await resolvePomFiles(FIXTURES_DIR, ['unknownDomain']);
  assert.deepEqual(entries, []);
});

test('resolvePomFiles -- empty domains array returns empty array', async () => {
  const entries = await resolvePomFiles(FIXTURES_DIR, []);
  assert.deepEqual(entries, []);
});

test('resolvePomFiles -- non-existent repoPath throws descriptive error', async () => {
  await assert.rejects(
    () => resolvePomFiles('/path/does/not/exist', ['filter']),
    /repo.*not found|ENOENT/i
  );
});

test('resolvePomFiles -- domain folder exists but has no .js files', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sitemap-generator-empty-domain-'));
  await fs.mkdir(path.join(tmp, 'pageObjects/filter'), { recursive: true });
  const entries = await resolvePomFiles(tmp, ['filter']);
  assert.deepEqual(entries, []);
});
