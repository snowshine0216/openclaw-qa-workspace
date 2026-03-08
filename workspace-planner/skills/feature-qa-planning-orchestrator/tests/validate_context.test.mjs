/**
 * validate_context.sh — behavior tests
 * Ref: xmind-refactor-plan-merged.md §4.2
 *
 * Behavior/Test Matrix:
 * | Behavior | Type | Test |
 * |----------|------|------|
 * | Default mode: CONTEXT_OK when all artifacts exist | unit | default_mode_all_present |
 * | Default mode: CONTEXT_MISSING when any artifact missing | unit | default_mode_missing |
 * | Default mode: normalizes .md suffix on artifact names | unit | default_mode_normalize_md |
 * | --resolve-sub-testcases: prints v2 path when v2 exists | unit | resolve_prefers_v2 |
 * | --resolve-sub-testcases: prints base path when only base exists | unit | resolve_falls_back_to_base |
 * | --resolve-sub-testcases: exits non-zero when domain file missing | unit | resolve_fails_when_missing |
 * | --resolve-sub-testcases: prints RESOLVED_OK when all found | unit | resolve_prints_resolved_ok |
 * | Exits non-zero when feature-id missing | unit | fail_missing_feature_id |
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT_SRC = join(__dirname, '..', 'scripts', 'lib', 'validate_context.sh');

async function runValidateContext(scriptsDir, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [join(scriptsDir, 'validate_context.sh'), ...args], {
      cwd: join(scriptsDir, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
    proc.on('error', reject);
  });
}

test('default_mode_all_present: CONTEXT_OK when all artifacts exist', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'jira_issue_BCIN-6709.md'), 'content');
  await writeFile(join(ctxDir, 'qa_plan_atlassian_BCIN-6709.md'), 'content');

  const { code, stdout } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    'jira_issue_BCIN-6709',
    'qa_plan_atlassian_BCIN-6709',
  ]);

  assert.equal(code, 0);
  assert.match(stdout, /CONTEXT_OK — all 2 required artifacts present/);

  await rm(tmp, { recursive: true, force: true });
});

test('default_mode_missing: CONTEXT_MISSING when any artifact missing', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'jira_issue_BCIN-6709.md'), 'content');
  // qa_plan_atlassian_BCIN-6709.md is missing

  const { code, stdout } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    'jira_issue_BCIN-6709',
    'qa_plan_atlassian_BCIN-6709',
  ]);

  assert.notEqual(code, 0);
  assert.match(stdout, /CONTEXT_MISSING:/);
  assert.match(stdout, /✗ qa_plan_atlassian_BCIN-6709/);

  await rm(tmp, { recursive: true, force: true });
});

test('default_mode_normalize_md: normalizes .md suffix on artifact names', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'jira_issue_BCIN-6709.md'), 'content');

  const { code } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    'jira_issue_BCIN-6709.md', // with .md suffix
  ]);

  assert.equal(code, 0);

  await rm(tmp, { recursive: true, force: true });
});

test('resolve_prefers_v2: prints v2 path when v2 exists', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'sub_test_cases_atlassian_BCIN-6709.md'), 'base');
  await writeFile(join(ctxDir, 'sub_test_cases_atlassian_BCIN-6709_v2.md'), 'v2');

  const { code, stdout } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    '--resolve-sub-testcases',
    'atlassian',
  ]);

  assert.equal(code, 0);
  const lines = stdout.trim().split('\n');
  assert.ok(lines[0].endsWith('sub_test_cases_atlassian_BCIN-6709_v2.md'));
  assert.ok(lines.some((l) => l === 'RESOLVED_OK'));

  await rm(tmp, { recursive: true, force: true });
});

test('resolve_falls_back_to_base: prints base path when only base exists', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'sub_test_cases_github_BCIN-6709.md'), 'base only');

  const { code, stdout } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    '--resolve-sub-testcases',
    'github',
  ]);

  assert.equal(code, 0);
  assert.ok(stdout.includes('sub_test_cases_github_BCIN-6709.md'));
  assert.ok(!stdout.includes('_v2.md'));
  assert.ok(stdout.includes('RESOLVED_OK'));

  await rm(tmp, { recursive: true, force: true });
});

test('resolve_fails_when_missing: exits non-zero when domain file missing', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  // No sub_test_cases_figma_BCIN-6709.md

  const { code, stdout, stderr } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    '--resolve-sub-testcases',
    'figma',
  ]);

  assert.notEqual(code, 0);
  assert.match(stderr, /MISSING:sub_test_cases_figma_BCIN-6709/);
  assert.match(stdout, /CONTEXT_MISSING: one or more sub_test_cases not found/);

  await rm(tmp, { recursive: true, force: true });
});

test('resolve_prints_resolved_ok: prints RESOLVED_OK when all domains found', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));
  await writeFile(join(ctxDir, 'sub_test_cases_atlassian_BCIN-6709.md'), 'a');
  await writeFile(join(ctxDir, 'sub_test_cases_github_BCIN-6709.md'), 'b');
  await writeFile(join(ctxDir, 'sub_test_cases_figma_BCIN-6709.md'), 'c');

  const { code, stdout } = await runValidateContext(scriptsDir, [
    'BCIN-6709',
    '--resolve-sub-testcases',
    'atlassian',
    'github',
    'figma',
  ]);

  assert.equal(code, 0);
  assert.ok(stdout.includes('RESOLVED_OK'));
  const lines = stdout.trim().split('\n').filter((l) => l && !l.startsWith('MISSING'));
  assert.equal(lines.filter((l) => l.endsWith('.md')).length, 3);

  await rm(tmp, { recursive: true, force: true });
});

test('fail_missing_feature_id: exits non-zero when feature-id missing', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  await mkdir(scriptsDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsDir, 'validate_context.sh'));

  const { code } = await runValidateContext(scriptsDir, []);

  assert.notEqual(code, 0);

  await rm(tmp, { recursive: true, force: true });
});
