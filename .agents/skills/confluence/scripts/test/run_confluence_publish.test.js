const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../../../..');
const scriptPath = path.join(
  repoRoot,
  '.agents/skills/confluence/scripts/run-confluence-publish.sh',
);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'confluence-skill-'));
}

function writeExecutable(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  fs.chmodSync(filePath, 0o755);
}

function makeMarkdownFile(tempDir) {
  const inputPath = path.join(tempDir, 'input.md');
  fs.writeFileSync(inputPath, '# Title\n\nBody\n', 'utf8');
  return inputPath;
}

function makeMockConfluence(tempDir, mode) {
  const logPath = path.join(tempDir, 'confluence.log');
  const mockPath = path.join(tempDir, 'mock-confluence.sh');
  const script = `#!/bin/sh
set -eu
printf '%s\n' "$*" >> "${logPath}"
cmd="\${1-}"
shift || true
case "$cmd" in
  find)
    case "${mode}" in
      update)
        printf '%s\n' '987654321 TEAM Release Notes https://example.atlassian.net/wiki/spaces/TEAM/pages/987654321/Release+Notes'
        ;;
      create)
        ;;
      ambiguous)
        printf '%s\n' '111111111 TEAM Release Notes https://example.atlassian.net/wiki/spaces/TEAM/pages/111111111/Release+Notes'
        printf '%s\n' '222222222 TEAM Release Notes https://example.atlassian.net/wiki/spaces/TEAM/pages/222222222/Release+Notes'
        ;;
    esac
    ;;
  update)
    printf '%s\n' 'updated'
    ;;
  create)
    printf '%s\n' 'created 222333444'
    ;;
  create-child)
    printf '%s\n' 'created-child 333444555'
    ;;
esac
`;

  writeExecutable(mockPath, script);
  return { logPath, mockPath };
}

function readLog(logPath) {
  return fs.readFileSync(logPath, 'utf8').trim().split('\n').filter(Boolean);
}

test('fails when no target mode is provided', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');

  const result = spawnSync('/bin/bash', [scriptPath, '--input', inputPath, '--output-html', outputPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /provide either --page-id or --space with --title/i);
});

test('fails dry-run without an explicit output html path', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);

  const result = spawnSync('/bin/bash', [scriptPath, '--input', inputPath, '--page-id', '123456789', '--dry-run'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--dry-run requires --output-html/i);
});

test('updates an existing page by page id using storage format', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');
  const { logPath, mockPath } = makeMockConfluence(tempDir, 'update');

  execFileSync(
    '/bin/bash',
    [scriptPath, '--input', inputPath, '--page-id', '123456789', '--output-html', outputPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CONFLUENCE_BIN: mockPath },
    },
  );

  const logLines = readLog(logPath);
  assert.deepEqual(logLines, [
    `update 123456789 --file ${outputPath} --format storage`,
  ]);
  assert.match(fs.readFileSync(outputPath, 'utf8'), /<h1>Title<\/h1>/);
});

test('finds and updates an existing page by title and space', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');
  const { logPath, mockPath } = makeMockConfluence(tempDir, 'update');

  execFileSync(
    '/bin/bash',
    [scriptPath, '--input', inputPath, '--space', 'TEAM', '--title', 'Release Notes', '--output-html', outputPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CONFLUENCE_BIN: mockPath },
    },
  );

  const logLines = readLog(logPath);
  assert.deepEqual(logLines, [
    'find Release Notes --space TEAM',
    `update 987654321 --file ${outputPath} --format storage`,
  ]);
});

test('creates a child page when no existing match is found', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');
  const { logPath, mockPath } = makeMockConfluence(tempDir, 'create');

  execFileSync(
    '/bin/bash',
    [
      scriptPath,
      '--input',
      inputPath,
      '--space',
      'TEAM',
      '--title',
      'Release Notes',
      '--parent-id',
      '999888777',
      '--output-html',
      outputPath,
    ],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CONFLUENCE_BIN: mockPath },
    },
  );

  const logLines = readLog(logPath);
  assert.deepEqual(logLines, [
    'find Release Notes --space TEAM',
    `create-child Release Notes 999888777 --file ${outputPath} --format storage`,
  ]);
});

test('creates a top-level page when no parent id is provided', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');
  const { logPath, mockPath } = makeMockConfluence(tempDir, 'create');

  execFileSync(
    '/bin/bash',
    [scriptPath, '--input', inputPath, '--space', 'TEAM', '--title', 'Release Notes', '--output-html', outputPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CONFLUENCE_BIN: mockPath },
    },
  );

  const logLines = readLog(logPath);
  assert.deepEqual(logLines, [
    'find Release Notes --space TEAM',
    `create Release Notes TEAM --file ${outputPath} --format storage`,
  ]);
});

test('fails closed on ambiguous find results', () => {
  const tempDir = makeTempDir();
  const inputPath = makeMarkdownFile(tempDir);
  const outputPath = path.join(tempDir, 'output.html');
  const { logPath, mockPath } = makeMockConfluence(tempDir, 'ambiguous');

  const result = spawnSync(
    '/bin/bash',
    [scriptPath, '--input', inputPath, '--space', 'TEAM', '--title', 'Release Notes', '--output-html', outputPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CONFLUENCE_BIN: mockPath },
    },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ambiguous confluence title match/i);
  assert.deepEqual(readLog(logPath), ['find Release Notes --space TEAM']);
});
