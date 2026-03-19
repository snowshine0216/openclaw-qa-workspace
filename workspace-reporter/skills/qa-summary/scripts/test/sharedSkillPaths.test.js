import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { resolveSharedSkillScript } from '../lib/sharedSkillPaths.mjs';

const SKILL_ROOT = join(import.meta.dirname, '..', '..');

test('resolves shared repo scripts from qa-summary skillRoot without needing repoRoot', async () => {
  const expected = join(
    SKILL_ROOT,
    '..',
    '..',
    '..',
    '.agents',
    'skills',
    'confluence',
    'scripts',
    'run-confluence-publish.sh'
  );
  const resolved = await resolveSharedSkillScript({
    skillRoot: SKILL_ROOT,
    skillName: 'confluence',
    scriptRelativePath: 'scripts/run-confluence-publish.sh',
    fileExists: (path) => path === expected,
  });

  assert.equal(resolved, expected);
});

test('falls back to CODEX_HOME-installed shared skills when repo-local copy is unavailable', async () => {
  const codexHome = '/tmp/codex-home';
  const expected = join(
    codexHome,
    'skills',
    'feishu-notify',
    'scripts',
    'send-feishu-notification.js'
  );
  const previousCodexHome = process.env.CODEX_HOME;
  process.env.CODEX_HOME = codexHome;
  try {
    const resolved = await resolveSharedSkillScript({
      skillRoot: '/tmp/external/qa-summary',
      skillName: 'feishu-notify',
      scriptRelativePath: 'scripts/send-feishu-notification.js',
      fileExists: (path) => path === expected,
    });

    assert.equal(resolved, expected);
  } finally {
    if (previousCodexHome === undefined) {
      delete process.env.CODEX_HOME;
    } else {
      process.env.CODEX_HOME = previousCodexHome;
    }
  }
});
