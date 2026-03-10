import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SKILL_ROOT = join(__dirname, '..');

const REQUIRED_FILES = [
  'references/qa-plan-contract.md',
  'references/context-coverage-contract.md',
  'references/executable-step-rubric.md',
  'references/review-rubric.md',
  'references/context-index-schema.md',
  'references/e2e-coverage-rules.md',
  'docs/DOCS_GOVERNANCE.md',
];

const REMOVED_FILES = [
  'references/qa-plan-contract-simple.md',
  'docs/xmind-refactor-plan-merged.md',
  'docs/priority-assignment-rules.md',
];

async function expectExists(relativePath) {
  await access(join(SKILL_ROOT, relativePath), constants.F_OK);
}

async function expectMissing(relativePath) {
  try {
    await access(join(SKILL_ROOT, relativePath), constants.F_OK);
    assert.fail(`${relativePath} should not exist`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

test('required enhancement-plan docs exist and stale docs are removed', async () => {
  for (const relativePath of REQUIRED_FILES) {
    await expectExists(relativePath);
  }
  for (const relativePath of REMOVED_FILES) {
    await expectMissing(relativePath);
  }
});

test('skill entry docs point at hard-contract references rather than legacy simple contract', async () => {
  const skill = await readFile(join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  const reference = await readFile(join(SKILL_ROOT, 'reference.md'), 'utf8');
  const readme = await readFile(join(SKILL_ROOT, 'README.md'), 'utf8');

  assert.doesNotMatch(skill, /qa-plan-contract-simple\.md/);
  assert.doesNotMatch(reference, /qa-plan-contract-simple\.md/);
  assert.doesNotMatch(readme, /qa-plan-contract-simple\.md/);

  assert.match(skill, /qa-plan-contract\.md/);
  assert.match(reference, /qa-plan-contract\.md/);
});
