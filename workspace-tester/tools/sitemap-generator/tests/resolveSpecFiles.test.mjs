import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSpecFiles } from '../src/resolveSpecFiles.mjs';

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/wdio-stub');

test('resolveSpecFiles -- returns SpecFileEntry list for a single domain', async () => {
  const entries = await resolveSpecFiles(FIXTURES_DIR, ['filter']);
  assert.ok(entries.length >= 1);
  assert.ok(entries.every((entry) => entry.domain === 'filter'));
  assert.ok(entries.every((entry) => /\.(spec\.)?(ts|js)$/i.test(entry.fileName)));
});

test('resolveSpecFiles -- handles multiple domains', async () => {
  const entries = await resolveSpecFiles(FIXTURES_DIR, ['filter', 'autoAnswers']);
  const domains = new Set(entries.map((entry) => entry.domain));
  assert.equal(domains.has('filter'), true);
  assert.equal(domains.has('autoAnswers'), true);
});

test('resolveSpecFiles -- resolves entries via GitHub API when URL is provided', async () => {
  const fakeList = async (apiPath) => {
    const map = {
      'repos/acme/wdio/contents/tests/wdio/specs/regression/filter': [
        {
          name: 'CalendarFilter.spec.ts',
          path: 'specs/regression/filter/CalendarFilter.spec.ts',
          type: 'file',
          url: 'https://api.github.com/repos/acme/wdio/contents/specs/regression/filter/CalendarFilter.spec.ts',
        },
      ],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/filterSearch': [],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/reportEditor/reportScopeFilter': [],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/reportFilter': [],
      'repos/acme/wdio/contents/tests/wdio/specs/regression/scopefilter': [],
    };
    if (!(apiPath in map)) {
      throw new Error('404');
    }
    return map[apiPath];
  };

  const entries = await resolveSpecFiles('https://github.com/acme/wdio', ['filter'], {
    listRemoteDirectory: fakeList,
  });

  assert.ok(entries.length >= 1);
  assert.ok(entries.every((entry) => entry.isRemote));
  assert.ok(entries.every((entry) => entry.domain === 'filter'));
});

test('resolveSpecFiles -- remote listing errors are propagated', async () => {
  await assert.rejects(
    () =>
      resolveSpecFiles('https://github.com/acme/wdio', ['filter'], {
        listRemoteDirectory: async () => {
          throw new Error('403 Forbidden');
        },
      }),
    /Remote listing failed.*specs\/regression\/filter.*403 Forbidden/
  );
});

