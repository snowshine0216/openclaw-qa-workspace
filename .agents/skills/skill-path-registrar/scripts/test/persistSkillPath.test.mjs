import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert';
import { persistSkillPath } from '../../lib/resolveSharedSkill.mjs';

test('persistSkillPath writes to config', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'persistSkillPath-'));
  const configPath = join(tmp, 'skill_paths.json');
  const scriptPath = join(tmp, 'jira-run.sh');
  try {
    writeFileSync(scriptPath, '#!/bin/bash');
    persistSkillPath('jira-cli', 'scripts/jira-run.sh', scriptPath, configPath);
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    assert.strictEqual(config['jira-cli/scripts/jira-run.sh'], scriptPath);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('persistSkillPath throws when path does not exist', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'persistSkillPath-'));
  const configPath = join(tmp, 'skill_paths.json');
  const nonexistent = join(tmp, 'nonexistent.sh');
  try {
    assert.throws(
      () => persistSkillPath('jira-cli', 'scripts/jira-run.sh', nonexistent, configPath),
      /Path does not exist/
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
