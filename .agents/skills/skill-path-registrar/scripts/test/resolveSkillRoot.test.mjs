import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert';
import {
  resolveSkillRoot,
  resolveSkillRootFromScriptPath,
  resolveSkillRootFromRunDir,
} from '../../lib/resolveSkillRoot.mjs';

test('resolveSkillRootFromScriptPath finds SKILL.md', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSkillRoot-'));
  try {
    const skillRoot = join(tmp, 'skills', 'my-skill');
    mkdirSync(join(skillRoot, 'scripts'), { recursive: true });
    writeFileSync(join(skillRoot, 'SKILL.md'), '');
    const scriptPath = join(skillRoot, 'scripts', 'foo.sh');
    writeFileSync(scriptPath, '');
    const result = await resolveSkillRootFromScriptPath(scriptPath);
    assert.ok(result);
    assert.strictEqual(result.skillRoot, skillRoot);
    assert.strictEqual(result.skillName, 'my-skill');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSkillRootFromScriptPath returns null when SKILL.md not found', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSkillRoot-'));
  try {
    mkdirSync(join(tmp, 'sub', 'deep'), { recursive: true });
    const scriptPath = join(tmp, 'sub', 'deep', 'foo.sh');
    writeFileSync(scriptPath, '');
    const result = await resolveSkillRootFromScriptPath(scriptPath);
    assert.strictEqual(result, null);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSkillRootFromRunDir extracts skill from path', () => {
  const runDir = '/repo/workspace-reporter/skills/qa-summary/runs/BCIN-123';
  const result = resolveSkillRootFromRunDir(runDir);
  assert.ok(result);
  assert.strictEqual(result.skillName, 'qa-summary');
  assert.ok(result.skillRoot.endsWith('skills/qa-summary'));
});

test('resolveSkillRootFromRunDir returns null for invalid path', () => {
  const result = resolveSkillRootFromRunDir('/some/random/path');
  assert.strictEqual(result, null);
});

test('resolveSkillRoot with fromScriptPath', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'resolveSkillRoot-'));
  try {
    const skillRoot = join(tmp, 'skills', 'test-skill');
    mkdirSync(join(skillRoot, 'scripts'), { recursive: true });
    writeFileSync(join(skillRoot, 'SKILL.md'), '');
    const scriptPath = join(skillRoot, 'scripts', 'bar.sh');
    writeFileSync(scriptPath, '');
    const result = await resolveSkillRoot({ fromScriptPath: scriptPath });
    assert.ok(result);
    assert.strictEqual(result.skillName, 'test-skill');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('resolveSkillRoot with fromRunDir', async () => {
  const result = await resolveSkillRoot({
    fromRunDir: '/repo/workspace-planner/skills/qa-plan-orchestrator/runs/KEY',
  });
  assert.ok(result);
  assert.strictEqual(result.skillName, 'qa-plan-orchestrator');
});
