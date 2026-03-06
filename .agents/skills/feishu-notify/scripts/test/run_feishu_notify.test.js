const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../../../..');
const scriptPath = path.join(
  repoRoot,
  '.agents/skills/feishu-notify/scripts/run-feishu-notify.sh',
);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'feishu-notify-int-'));
}

function writeExecutable(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  fs.chmodSync(filePath, 0o755);
}

function makeWorkspace(rootDir, workspaceName, chatId) {
  const workspaceDir = path.join(rootDir, workspaceName);
  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.writeFileSync(
    path.join(workspaceDir, 'TOOLS.md'),
    `# TOOLS.md\n\n## Feishu\n- chat_id: ${chatId}\n`,
    'utf8',
  );
  return workspaceDir;
}

function makeMessageFile(rootDir, content = 'Daily summary\nAll clear\n') {
  const messagePath = path.join(rootDir, 'summary.md');
  fs.writeFileSync(messagePath, content, 'utf8');
  return messagePath;
}

function makeOpenclawStub(rootDir, mode = 'success') {
  const binDir = path.join(rootDir, 'bin');
  const logPath = path.join(rootDir, 'openclaw.log');
  const stubPath = path.join(binDir, 'openclaw');
  fs.mkdirSync(binDir, { recursive: true });
  writeExecutable(
    stubPath,
    `#!/bin/sh
set -eu
printf '%s\n' "$*" >> "${logPath}"
if [ "${mode}" = "fail" ]; then
  echo 'simulated send failure' >&2
  exit 1
fi
`,
  );
  return { binDir, logPath };
}

function runSkill(args, options = {}) {
  return spawnSync('/bin/bash', [scriptPath, ...args], {
    cwd: options.cwd || repoRoot,
    encoding: 'utf8',
    env: options.env || process.env,
  });
}

test('uses chat_id from the Feishu section when other sections also define chat_id', () => {
  const tempDir = makeTempDir();
  const workspaceDir = path.join(tempDir, 'workspace');
  const { binDir, logPath } = makeOpenclawStub(tempDir);
  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.writeFileSync(
    path.join(workspaceDir, 'TOOLS.md'),
    '# TOOLS.md\n\n## Other Tool\n- chat_id: oc_wrong_chat\n\n## Feishu\n- chat_id: oc_right_chat\n',
    'utf8',
  );

  const result = runSkill(
    ['--workspace', workspaceDir, '--message', 'Hello'],
    { env: { ...process.env, PATH: `${binDir}:${process.env.PATH}` } },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(fs.readFileSync(logPath, 'utf8'), /--target oc_right_chat/);
  assert.doesNotMatch(fs.readFileSync(logPath, 'utf8'), /--target oc_wrong_chat/);
});

test('sends file content using chat_id from explicit workspace', () => {
  const tempDir = makeTempDir();
  const workspaceDir = makeWorkspace(tempDir, 'workspace-daily', 'oc_daily_chat');
  const messageFile = makeMessageFile(tempDir, 'Ship status\nGreen\n');
  const { binDir, logPath } = makeOpenclawStub(tempDir);

  const result = runSkill(
    ['--workspace', workspaceDir, '--file', messageFile],
    { env: { ...process.env, PATH: `${binDir}:${process.env.PATH}` } },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Feishu notification sent successfully/i);
  assert.equal(
    fs.readFileSync(logPath, 'utf8').trim(),
    'message send --channel feishu --target oc_daily_chat --message Ship status\nGreen',
  );
});

test('auto-resolves workspace from current directory and sends inline message', () => {
  const tempDir = makeTempDir();
  const workspaceDir = makeWorkspace(tempDir, 'workspace-reporter', 'oc_reporter_chat');
  const nestedDir = path.join(workspaceDir, 'projects', 'docs');
  const { binDir, logPath } = makeOpenclawStub(tempDir);
  fs.mkdirSync(nestedDir, { recursive: true });

  const result = runSkill(
    ['--message', 'Publish complete'],
    {
      cwd: nestedDir,
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH}` },
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    fs.readFileSync(logPath, 'utf8').trim(),
    'message send --channel feishu --target oc_reporter_chat --message Publish complete',
  );
});

test('fails when chat_id is missing from TOOLS.md', () => {
  const tempDir = makeTempDir();
  const workspaceDir = path.join(tempDir, 'workspace');
  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.writeFileSync(path.join(workspaceDir, 'TOOLS.md'), '# TOOLS.md\n\n## Feishu\n', 'utf8');

  const result = runSkill(['--workspace', workspaceDir, '--message', 'Hello']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /chat_id not found/i);
});

test('fails when both file and message are provided', () => {
  const tempDir = makeTempDir();
  const workspaceDir = makeWorkspace(tempDir, 'workspace-healer', 'oc_healer_chat');
  const messageFile = makeMessageFile(tempDir);

  const result = runSkill([
    '--workspace',
    workspaceDir,
    '--file',
    messageFile,
    '--message',
    'conflict',
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /choose exactly one of --file or --message/i);
});

test('fails cleanly when an option value is missing', () => {
  const workspaceResult = runSkill(['--workspace']);
  const fileResult = runSkill(['--file']);
  const messageResult = runSkill(['--message']);

  assert.notEqual(workspaceResult.status, 0);
  assert.match(workspaceResult.stderr, /missing value for --workspace/i);
  assert.notEqual(fileResult.status, 0);
  assert.match(fileResult.stderr, /missing value for --file/i);
  assert.notEqual(messageResult.status, 0);
  assert.match(messageResult.stderr, /missing value for --message/i);
});

test('prints manual fallback command when send fails', () => {
  const tempDir = makeTempDir();
  const workspaceDir = makeWorkspace(tempDir, 'workspace-planner', 'oc_planner_chat');
  const messageFile = makeMessageFile(tempDir, "Plan update\nIt's blocked\n");
  const { binDir } = makeOpenclawStub(tempDir, 'fail');

  const result = runSkill(
    ['--workspace', workspaceDir, '--file', messageFile],
    { env: { ...process.env, PATH: `${binDir}:${process.env.PATH}` } },
  );

  const output = `${result.stdout}\n${result.stderr}`;
  assert.notEqual(result.status, 0);
  assert.match(output, /manual send command/i);
  assert.match(output, /oc_planner_chat/);
});
