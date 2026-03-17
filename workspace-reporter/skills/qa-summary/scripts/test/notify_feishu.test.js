import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';

const SCRIPT_DIR = join(import.meta.dirname, '..');
const REPO_ROOT = join(SCRIPT_DIR, '..', '..', '..', '..');

test('exits with usage when chat_id or final_path missing', () => {
  try {
    execSync(`bash "${SCRIPT_DIR}/notify_feishu.sh"`, {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    assert.fail('Expected non-zero exit');
  } catch (e) {
    assert.ok(e.status > 0);
    assert.match(e.stderr || e.stdout || '', /Usage/i);
  }
});

test('exits non-zero when feishu script not found (invalid path)', () => {
  const runDir = join(tmpdir(), 'qa-summary-notify-');
  const finalPath = join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md');
  try {
    execSync(`bash "${SCRIPT_DIR}/notify_feishu.sh" oc-xxx "${finalPath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, REPO_ROOT: '/nonexistent', CODEX_HOME: '' },
    });
    assert.fail('Expected non-zero exit');
  } catch (e) {
    assert.ok(e.status > 0);
    assert.match(e.stderr || e.stdout || '', /FEISHU_NOTIFY_PENDING|not found|script/i);
  }
});

test('persists notification_pending to run.json when run_dir provided and send fails', async () => {
  const { mkdtemp, writeFile, mkdir, readFile } = await import('node:fs/promises');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-notify-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ updated_at: new Date().toISOString() }));
  const finalPath = join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md');
  await writeFile(finalPath, '# draft');
  try {
    execSync(`bash "${SCRIPT_DIR}/notify_feishu.sh" oc-xxx "${finalPath}" none "${runDir}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, REPO_ROOT: '/nonexistent', CODEX_HOME: '' },
    });
    assert.fail('Expected non-zero exit');
  } catch (e) {
    assert.ok(e.status > 0);
  }
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.ok(run.notification_pending);
  assert.equal(run.notification_pending.channel, 'feishu');
  assert.equal(run.notification_pending.chat_id, 'oc-xxx');
  assert.ok(run.notification_pending.payload_file);
  const { existsSync } = await import('node:fs');
  assert.ok(existsSync(run.notification_pending.payload_file));
});

test('falls back to CODEX_HOME skill-path-registrar and feishu-notify skill', async () => {
  const codexHome = await mkdtemp(join(tmpdir(), 'qa-summary-codex-home-'));
  const registrarRoot = join(codexHome, 'skills', 'skill-path-registrar');
  const registrarFiles = [
    'scripts/skill_path_registrar.sh',
    'scripts/cli_resolve.mjs',
    'lib/findRepoRoot.mjs',
    'lib/resolveSharedSkill.mjs',
  ];

  for (const relativePath of registrarFiles) {
    const destination = join(registrarRoot, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(
      join(REPO_ROOT, '.agents', 'skills', 'skill-path-registrar', relativePath),
      destination
    );
  }

  const feishuScript = join(
    codexHome,
    'skills',
    'feishu-notify',
    'scripts',
    'send-feishu-notification.js'
  );
  await mkdir(dirname(feishuScript), { recursive: true });
  await writeFile(feishuScript, 'process.exit(0);\n');

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-notify-success-'));
  const finalPath = join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md');
  await writeFile(finalPath, '# final');

  execSync(`bash "${SCRIPT_DIR}/notify_feishu.sh" oc-xxx "${finalPath}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
    env: { ...process.env, REPO_ROOT: '/nonexistent', CODEX_HOME: codexHome },
  });
});
