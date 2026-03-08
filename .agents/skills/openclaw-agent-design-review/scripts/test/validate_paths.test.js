const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../../../../..');
const scriptPath = path.join(
  repoRoot,
  '.agents/skills/openclaw-agent-design-review/scripts/validate_paths.sh',
);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-validate-paths-'));
}

function runValidatePaths(lines, options = {}) {
  const tempDir = makeTempDir();
  const repoDir = path.join(tempDir, 'repo');
  fs.mkdirSync(repoDir, { recursive: true });

  const existingFile = path.join(repoDir, 'docs', 'example.md');
  fs.mkdirSync(path.dirname(existingFile), { recursive: true });
  fs.writeFileSync(existingFile, '# Example\n', 'utf8');

  const listPath = path.join(tempDir, 'paths.txt');
  fs.writeFileSync(listPath, lines.join('\n'), 'utf8');

  return spawnSync('/bin/bash', [scriptPath, listPath, options.repoRoot || repoDir], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

test('accepts markdown links, backtick paths, and URLs', () => {
  const result = runValidatePaths([
    '[example](docs/example.md)',
    '`docs/example.md`',
    'https://example.com/reference',
  ]);

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /OK: docs\/example\.md/i);
  assert.match(result.stdout, /INFO: skipped URL reference: https:\/\/example\.com\/reference/i);
});

test('fails on unresolved placeholders, hardcoded home paths, and missing files', () => {
  const result = runValidatePaths([
    '<workspace>/skills/example/SKILL.md',
    '/Users/example/repo/file.md',
    'docs/missing.md',
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL: unresolved placeholder path/i);
  assert.match(result.stdout, /FAIL: hardcoded user-home path is not portable/i);
  assert.match(result.stdout, /FAIL: missing path: docs\/missing\.md/i);
});

test('reports usage errors cleanly', () => {
  const result = spawnSync('/bin/bash', [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Usage: .*validate_paths\.sh <path-list-file> \[repo-root\]/i);
});
