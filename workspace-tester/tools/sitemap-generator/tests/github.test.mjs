import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  __resetExecRunnerForTests,
  __setExecRunnerForTests,
  checkGhAuth,
  fetchGitHubFileContent,
  listGitHubDirectory,
} from '../src/github.mjs';

afterEach(() => {
  __resetExecRunnerForTests();
});

test('checkGhAuth -- passes if authenticated', () => {
  __setExecRunnerForTests(() => 'ok');
  assert.doesNotThrow(() => checkGhAuth());
});

test('checkGhAuth -- throws error if disabled', () => {
  __setExecRunnerForTests(() => {
    throw new Error('not logged in');
  });
  assert.throws(() => checkGhAuth(), /gh\) is not authenticated/i);
});

test('fetchGitHubFileContent -- executes gh api with raw header', async () => {
  let captured = '';
  __setExecRunnerForTests((cmd) => {
    captured = cmd;
    return 'raw-file-content';
  });

  const out = await fetchGitHubFileContent('repos/acme/repo/contents/path/File.js');
  assert.equal(out, 'raw-file-content');
  assert.match(captured, /gh api -H "Accept: application\/vnd\.github\.raw"/);
  assert.match(captured, /repos\/acme\/repo\/contents\/path\/File\.js/);
});

test('listGitHubDirectory -- executes gh api and parses JSON', async () => {
  let captured = '';
  __setExecRunnerForTests((cmd) => {
    captured = cmd;
    return '[{"name":"CalendarFilter.js","path":"pageObjects/filter/CalendarFilter.js","type":"file"}]';
  });

  const list = await listGitHubDirectory('repos/acme/repo/contents/pageObjects/filter');
  assert.equal(list.length, 1);
  assert.equal(list[0].name, 'CalendarFilter.js');
  assert.match(captured, /gh api repos\/acme\/repo\/contents\/pageObjects\/filter/);
});
