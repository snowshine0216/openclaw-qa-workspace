const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '../../../../..');
const modulePath = path.join(
  repoRoot,
  '.agents/skills/feishu-notify/scripts/send-feishu-notification.js',
);

function runCliScript(args) {
  return require('node:child_process').spawnSync('node', [modulePath, ...args], {
    encoding: 'utf8',
    env: { ...process.env },
  });
}

function loadModule() {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
}

function makeTempFile(content) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'feishu-notify-unit-'));
  const filePath = path.join(tempDir, 'message.md');
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

test('parseCliArgs accepts inline message input', () => {
  const { parseCliArgs } = loadModule();
  const options = parseCliArgs([
    '--message',
    'Build finished',
    '--chat-id',
    'oc_test_chat',
  ]);

  assert.deepEqual(options, {
    message: 'Build finished',
    file: '',
    chatId: 'oc_test_chat',
    openclawBin: 'openclaw',
  });
});

test('parseCliArgs rejects conflicting message inputs', () => {
  const { parseCliArgs } = loadModule();

  assert.throws(
    () => parseCliArgs(['--message', 'hello', '--file', 'summary.md', '--chat-id', 'oc_test']),
    /choose exactly one of --file or --message/i,
  );
});

test('readMessage loads file content verbatim', () => {
  const { readMessage } = loadModule();
  const filePath = makeTempFile('# Status\n\nIt\'s green.\n');

  assert.equal(readMessage({ file: filePath, message: '' }), '# Status\n\nIt\'s green.\n');
});

test('buildManualCommand escapes single quotes for shell display', () => {
  const { buildManualCommand } = loadModule();
  const command = buildManualCommand('oc_test_chat', "It's live");

  assert.equal(
    command,
    "openclaw message send --channel feishu --target 'oc_test_chat' --message 'It'\\''s live'",
  );
});

test('cli help exits cleanly without stack trace', () => {
  const result = runCliScript(['--help']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /usage:/i);
  assert.doesNotMatch(result.stderr, /at parseCliArgs|node:/i);
});

test('cli reports missing option values without stack trace', () => {
  const result = runCliScript(['--chat-id']);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /missing value for --chat-id/i);
  assert.doesNotMatch(output, /at parseCliArgs|node:internal/i);
});
