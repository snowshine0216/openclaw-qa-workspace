import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert';
import { resolveSharedSkill } from '../../lib/resolveSharedSkill.mjs';

test('resolveSharedSkill returns repo-local path when exists', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  try {
    const scriptPath = join(tmp, '.agents', 'skills', 'jira-cli', 'scripts', 'jira-run.sh');
    mkdirSync(join(tmp, '.agents', 'skills', 'jira-cli', 'scripts'), { recursive: true });
    writeFileSync(scriptPath, '#!/bin/bash');
    const result = await resolveSharedSkill('jira-cli', 'scripts/jira-run.sh', {
      repoRoot: tmp,
    });
    assert.strictEqual(result, scriptPath);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSharedSkill returns null when not found and requireUserConfirm false', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  try {
    const result = await resolveSharedSkill('nonexistent-skill', 'scripts/foo.sh', {
      repoRoot: tmp,
    });
    assert.strictEqual(result, null);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSharedSkill returns needUserConfirm when not found and requireUserConfirm true', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  try {
    const result = await resolveSharedSkill('nonexistent-skill', 'scripts/foo.sh', {
      repoRoot: tmp,
      requireUserConfirm: true,
    });
    assert.ok(result);
    assert.strictEqual(result.found, false);
    assert.strictEqual(result.needUserConfirm, true);
    assert.strictEqual(result.skillName, 'nonexistent-skill');
    assert.ok(Array.isArray(result.triedPaths));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSharedSkill respects env override', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  const overridePath = join(tmp, 'custom', 'jira-run.sh');
  try {
    mkdirSync(join(tmp, 'custom'), { recursive: true });
    writeFileSync(overridePath, '#!/bin/bash');
    const result = await resolveSharedSkill('jira-cli', 'scripts/jira-run.sh', {
      repoRoot: tmp,
      envOverrides: { JIRA_CLI_SCRIPT: overridePath },
    });
    assert.strictEqual(result, overridePath);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSharedSkill ignores jira env override for unrelated skills', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  const overridePath = join(tmp, 'custom', 'jira-run.sh');
  const confluencePath = join(
    tmp,
    '.agents',
    'skills',
    'confluence',
    'scripts',
    'run-confluence-publish.sh',
  );
  try {
    mkdirSync(join(tmp, 'custom'), { recursive: true });
    mkdirSync(join(tmp, '.agents', 'skills', 'confluence', 'scripts'), {
      recursive: true,
    });
    writeFileSync(overridePath, '#!/bin/bash');
    writeFileSync(confluencePath, '#!/bin/bash');

    const result = await resolveSharedSkill(
      'confluence',
      'scripts/run-confluence-publish.sh',
      {
        repoRoot: tmp,
        envOverrides: { JIRA_CLI_SCRIPT: overridePath },
      },
    );

    assert.strictEqual(result, confluencePath);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSharedSkill ignores feishu env override for unrelated skills', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSharedSkill-'));
  const overridePath = join(tmp, 'custom', 'notify.sh');
  const validatorPath = join(
    tmp,
    '.agents',
    'skills',
    'markxmind',
    'scripts',
    'validate-markxmind.sh',
  );
  try {
    mkdirSync(join(tmp, 'custom'), { recursive: true });
    mkdirSync(join(tmp, '.agents', 'skills', 'markxmind', 'scripts'), {
      recursive: true,
    });
    writeFileSync(overridePath, '#!/bin/bash');
    writeFileSync(validatorPath, '#!/bin/bash');

    const result = await resolveSharedSkill(
      'markxmind',
      'scripts/validate-markxmind.sh',
      {
        repoRoot: tmp,
        envOverrides: { FEISHU_NOTIFY_SCRIPT: overridePath },
      },
    );

    assert.strictEqual(result, validatorPath);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
