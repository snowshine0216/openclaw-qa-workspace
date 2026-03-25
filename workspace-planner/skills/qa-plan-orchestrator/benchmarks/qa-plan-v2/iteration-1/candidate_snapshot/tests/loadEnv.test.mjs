import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { loadEnv } from '../benchmarks/qa-plan-v2/scripts/lib/loadEnv.mjs';

describe('loadEnv', () => {
  let tempDir;

  before(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'load-env-test-'));
  });

  after(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  test('loads variables into process.env', () => {
    // create .env
    const envContent = `
# This is a comment
KEY1=value1
KEY2="value2"
KEY3='value3'
KEY4="escaped \\" quote"
KEY5='escaped \\' quote'
KEY_WITH_SPACES =  some value  
EmptyKey=
`;
    writeFileSync(join(tempDir, '.env'), envContent);

    // Call loadEnv
    loadEnv(tempDir);

    assert.strictEqual(process.env.KEY1, 'value1');
    assert.strictEqual(process.env.KEY2, 'value2');
    assert.strictEqual(process.env.KEY3, 'value3');
    assert.strictEqual(process.env.KEY4, 'escaped " quote');
    assert.strictEqual(process.env.KEY5, "escaped ' quote");
    assert.strictEqual(process.env.KEY_WITH_SPACES, 'some value');
    assert.strictEqual(process.env.EmptyKey, '');

    // Clean up environment variables
    delete process.env.KEY1;
    delete process.env.KEY2;
    delete process.env.KEY3;
    delete process.env.KEY4;
    delete process.env.KEY5;
    delete process.env.KEY_WITH_SPACES;
    delete process.env.EmptyKey;
  });

  test('does nothing if .env does not exist', () => {
    const emptyTempDir = mkdtempSync(join(tmpdir(), 'load-env-test-empty-'));
    loadEnv(emptyTempDir); // Should not throw
    rmSync(emptyTempDir, { recursive: true, force: true });
  });

  test('does not override already-defined environment variables', () => {
    process.env.KEY1 = 'from-env';
    writeFileSync(join(tempDir, '.env'), 'KEY1=from-file\n', 'utf8');

    loadEnv(tempDir);

    assert.strictEqual(process.env.KEY1, 'from-env');
    delete process.env.KEY1;
  });

  test('handles malformed lines safely', () => {
    const malformedContent = `
NO_EQUALS_SIGN
=StartsWithEquals
    `;
    writeFileSync(join(tempDir, '.env'), malformedContent);

    loadEnv(tempDir); // Should skip without throwing
  });
});
