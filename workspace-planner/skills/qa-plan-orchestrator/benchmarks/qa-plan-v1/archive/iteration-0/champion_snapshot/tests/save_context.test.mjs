/**
 * save_context.sh — behavior tests
 * Ref: FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md §4.2
 *
 * Behavior/Test Matrix:
 * | Behavior | Type | Test |
 * |----------|------|------|
 * | Saves inline content to context/<artifact>.md | unit | save_inline_content |
 * | Copies file content when 3rd arg is file path | unit | copy_file_content |
 * | Archives existing file before overwrite (idempotency) | unit | archive_before_overwrite |
 * | Supports sub-paths (figma/figma_metadata_...) | unit | support_subpaths |
 * | Normalizes .md suffix on artifact name | unit | normalize_md_suffix |
 * | Exits non-zero when missing required args | unit | fail_missing_args |
 * | Emits SAVED: context/<name>.md on success | unit | emit_saved_message |
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const SCRIPT_SRC = join(__dirname, '..', 'scripts', 'lib', 'save_context.sh');

/** Skill-root layout: tmp/scripts/lib/save_context.sh → SKILL_ROOT=tmp, output under tmp/runs/<feature-id>/context */
function skillRootLayout(tmp) {
  return join(tmp, 'scripts', 'lib');
}

async function runSaveContext(scriptsLibDir, args, env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [join(scriptsLibDir, 'save_context.sh'), ...args], {
      cwd: join(scriptsLibDir, '..', '..'),
      env: { ...process.env, ...env },
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

test('save_inline_content: saves inline content to context/<artifact>.md', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const { code, stdout } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'jira_issue_BCIN-6709',
    'Summary: Add pause mode\nDescription: User can pause the report.',
  ]);

  assert.equal(code, 0);
  const outPath = join(tmp, 'runs', 'BCIN-6709', 'context', 'jira_issue_BCIN-6709.md');
  const content = await readFile(outPath, 'utf8');
  assert.ok(content.includes('Summary: Add pause mode'));
  assert.ok(content.includes('Description: User can pause the report.'));
  assert.match(stdout, /SAVED: context\/jira_issue_BCIN-6709\.md/);

  await rm(tmp, { recursive: true, force: true });
});

test('copy_file_content: copies file when 3rd arg is file path', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const srcFile = join(tmp, 'diff.md');
  await writeFile(srcFile, 'diff --git a/foo b/foo\n+new line');

  const { code } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'github_diff_biweb',
    srcFile,
  ]);

  assert.equal(code, 0);
  const outPath = join(tmp, 'runs', 'BCIN-6709', 'context', 'github_diff_biweb.md');
  const content = await readFile(outPath, 'utf8');
  assert.ok(content.includes('diff --git'));
  assert.ok(content.includes('+new line'));

  await rm(tmp, { recursive: true, force: true });
});

test('archive_before_overwrite: archives existing file before overwrite', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const ctxDir = join(tmp, 'runs', 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  const firstPath = join(ctxDir, 'qa_plan_atlassian_BCIN-6709.md');
  await writeFile(firstPath, 'original content');

  const { code } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'qa_plan_atlassian_BCIN-6709',
    'updated content',
  ]);

  assert.equal(code, 0);
  const content = await readFile(firstPath, 'utf8');
  assert.equal(content, 'updated content\n');

  const files = await readdir(ctxDir);
  const archived = files.filter((f) => f.includes('_archived_'));
  assert.equal(archived.length, 1);
  assert.match(archived[0], /qa_plan_atlassian_BCIN-6709_archived_\d{8}T\d{6}Z\.md/);

  await rm(tmp, { recursive: true, force: true });
});

test('support_subpaths: creates figma/ subdir for figma/figma_metadata_...', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const { code } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'figma/figma_metadata_BCIN-6709',
    'Figma metadata JSON here',
  ]);

  assert.equal(code, 0);
  const outPath = join(tmp, 'runs', 'BCIN-6709', 'context', 'figma', 'figma_metadata_BCIN-6709.md');
  const content = await readFile(outPath, 'utf8');
  assert.ok(content.includes('Figma metadata JSON here'));

  await rm(tmp, { recursive: true, force: true });
});

test('normalize_md_suffix: strips .md from artifact name when provided', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const { code } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'jira_issue_BCIN-6709.md',
    'content',
  ]);

  assert.equal(code, 0);
  const outPath = join(tmp, 'runs', 'BCIN-6709', 'context', 'jira_issue_BCIN-6709.md');
  const content = await readFile(outPath, 'utf8');
  assert.ok(content.includes('content'));

  await rm(tmp, { recursive: true, force: true });
});

test('fail_missing_args: exits non-zero when required args missing', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const { code: code1 } = await runSaveContext(scriptsLibDir, []);
  const { code: code2 } = await runSaveContext(scriptsLibDir, ['BCIN-6709']);
  const { code: code3 } = await runSaveContext(scriptsLibDir, ['BCIN-6709', 'artifact']);

  assert.notEqual(code1, 0);
  assert.notEqual(code2, 0);
  assert.notEqual(code3, 0);

  await rm(tmp, { recursive: true, force: true });
});

test('emit_saved_message: prints SAVED: context/<name>.md on success', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'save_ctx_'));
  const scriptsLibDir = skillRootLayout(tmp);
  await mkdir(scriptsLibDir, { recursive: true });
  await cp(SCRIPT_SRC, join(scriptsLibDir, 'save_context.sh'));

  const { code, stdout } = await runSaveContext(scriptsLibDir, [
    'BCIN-6709',
    'research_bg_tavily_reCreateReportInstance_BCIN-6709',
    'search result',
  ]);

  assert.equal(code, 0);
  assert.match(stdout, /^SAVED: context\/research_bg_tavily_reCreateReportInstance_BCIN-6709\.md/);

  await rm(tmp, { recursive: true, force: true });
});
