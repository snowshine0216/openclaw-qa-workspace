import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  buildDomainsConfig,
  collectRemoteTree,
  main,
  matchSpecPaths,
  normalize,
} from '../scripts/generate-domains-config.mjs';

test('normalize -- lowercases and strips punctuation', () => {
  assert.equal(normalize('AG-Grid'), 'aggrid');
  assert.equal(normalize('reportEditor/reportScopeFilter'), 'reporteditorreportscopefilter');
});

test('matchSpecPaths -- ranks exact and fuzzy matches', () => {
  const dirs = [
    'filter',
    'filterSearch',
    'reportEditor/reportScopeFilter',
    'autoDashboard',
    'scopefilter',
  ];

  const out = matchSpecPaths('filter', dirs);
  assert.deepEqual(out, [
    'filter',
    'filterSearch',
    'reportEditor/reportScopeFilter',
    'scopefilter',
  ]);
});

test('buildDomainsConfig -- creates one config entry per domain', () => {
  const out = buildDomainsConfig(['filter', 'aibot'], ['filter', 'aibotChatPanel']);
  assert.deepEqual(Object.keys(out.domains), ['aibot', 'filter']);
  assert.deepEqual(out.domains.aibot.pomPaths, ['pageObjects/aibot']);
  assert.ok(out.domains.aibot.specPaths.includes('specs/regression/aibotChatPanel'));
  assert.equal(out.domains.autoAnswers, undefined);
  assert.equal(out.domains.aibot.displayName, 'Bot (AI Bot)');
  assert.ok(Array.isArray(out.domains.aibot.keyEntryPoints));
});

test('collectRemoteTree -- discovers domains and regression subfolders from gh api tree', async () => {
  const fakeListRemote = async (apiPath) => {
    const map = {
      'repos/acme/wdio/contents/tests/wdio/pageObjects': [
        { name: 'filter', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/pageObjects/filter' },
        { name: 'aibot', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/pageObjects/aibot' },
        { name: 'pageBuilder.js', type: 'file' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression': [
        { name: 'filter', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/specs/regression/filter' },
        { name: 'reportEditor', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/specs/regression/reportEditor' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/filter': [
        { name: 'advanced', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/specs/regression/filter/advanced' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/filter/advanced': [],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/reportEditor': [
        { name: 'reportScopeFilter', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/specs/regression/reportEditor/reportScopeFilter' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/reportEditor/reportScopeFilter': [],
    };
    if (!(apiPath in map)) {
      throw new Error(`unexpected path: ${apiPath}`);
    }
    return map[apiPath];
  };

  const tree = await collectRemoteTree('git@github.com:acme/wdio.git', {
    listRemoteDirectory: fakeListRemote,
  });

  assert.deepEqual(tree.domainDirs, ['aibot', 'filter']);
  assert.deepEqual(tree.regressionDirs, ['filter', 'filter/advanced', 'reportEditor', 'reportEditor/reportScopeFilter']);
});

test('collectRemoteTree -- propagates remote listing failures', async () => {
  await assert.rejects(
    () =>
      collectRemoteTree('https://github.com/acme/wdio', {
        listRemoteDirectory: async () => {
          throw new Error('401 Unauthorized');
        },
      }),
    /Remote listing failed.*pageObjects.*401 Unauthorized/
  );
});

test('main -- supports --repo-url with auth/list/write dependency injection', async () => {
  let authChecked = false;
  let outputContent = '';
  let outputFile = '';

  const fakeListRemote = async (apiPath) => {
    const map = {
      'repos/acme/wdio/contents/tests/wdio/pageObjects': [
        { name: 'filter', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/pageObjects/filter' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression': [
        { name: 'filter', type: 'dir', url: 'repos/acme/wdio/contents/tests/wdio/specs/regression/filter' },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/filter': [],
    };
    if (!(apiPath in map)) {
      throw new Error(`unexpected path: ${apiPath}`);
    }
    return map[apiPath];
  };

  await main(
    ['--repo-url', 'https://github.com/acme/wdio', '--output', '/tmp/domains.json'],
    {
      checkAuth: () => {
        authChecked = true;
      },
      listRemoteDirectory: fakeListRemote,
      writer: async (filePath, content) => {
        outputFile = filePath;
        outputContent = content;
      },
    }
  );

  assert.equal(authChecked, true);
  assert.equal(outputFile, '/tmp/domains.json');
  const parsed = JSON.parse(outputContent);
  assert.deepEqual(Object.keys(parsed.domains), ['filter']);
  assert.equal(parsed.domains.filter.displayName, 'Filter');
  assert.ok(Array.isArray(parsed.domains.filter.keyEntryPoints));
});

test('main -- fails on remote crawl errors before writing output', async () => {
  let writeCalled = false;

  await assert.rejects(
    () =>
      main(
        ['--repo-url', 'https://github.com/acme/wdio', '--output', '/tmp/domains.json'],
        {
          checkAuth: () => {},
          listRemoteDirectory: async () => {
            throw new Error('503 Service Unavailable');
          },
          writer: async () => {
            writeCalled = true;
          },
        }
      ),
    /Remote listing failed.*503 Service Unavailable/
  );

  assert.equal(writeCalled, false);
});

test('main -- generates config from local repo tree', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'domains-config-local-'));
  const repo = path.join(tmp, 'wdio');
  await fs.mkdir(path.join(repo, 'pageObjects', 'filter'), { recursive: true });
  await fs.mkdir(path.join(repo, 'pageObjects', 'autoAnswers'), { recursive: true });
  await fs.mkdir(path.join(repo, 'specs', 'regression', 'filterSearch'), { recursive: true });
  await fs.mkdir(path.join(repo, 'specs', 'regression', 'AutoAnswers'), { recursive: true });

  const output = path.join(tmp, 'domains.json');
  await main(['--repo', repo, '--output', output]);

  const parsed = JSON.parse(await fs.readFile(output, 'utf8'));
  assert.ok(parsed.domains.filter);
  assert.ok(parsed.domains.autoAnswers);
  assert.ok(parsed.domains.filter.specPaths.some((v) => v.includes('filterSearch')));
  assert.equal(parsed.domains.autoAnswers.displayName, 'AutoAnswers (AI Assistant)');
  assert.ok(Array.isArray(parsed.domains.filter.keyEntryPoints));
});
