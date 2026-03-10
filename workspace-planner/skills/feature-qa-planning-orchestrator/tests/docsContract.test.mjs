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
  'docs/FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_SPEC.md',
  'docs/FEATURE_QA_PLANNING_ORCHESTRATOR_REMEDIATION_IMPLEMENTATION_SUMMARY.md',
  'docs/SCRIPT_DRIVEN_PHASE0_PHASE1_DESIGN.md',
  'docs/archive/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md',
  'docs/archive/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN_REVIEW.md',
  'docs/archive/FEATURE_QA_PLANNING_ORCHESTRATOR_IMPLEMENTATION_SUMMARY.md',
];

const REMOVED_FILES = [
  'references/qa-plan-contract-simple.md',
  'docs/xmind-refactor-plan-merged.md',
  'docs/priority-assignment-rules.md',
  'tests/deploy_runtime_context_tools.test.mjs',
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

test('required docs exist and deprecated deploy-helper tests are removed', async () => {
  for (const relativePath of REQUIRED_FILES) {
    await expectExists(relativePath);
  }
  for (const relativePath of REMOVED_FILES) {
    await expectMissing(relativePath);
  }
});

test('skill entry docs point at script-driven contracts', async () => {
  const skill = await readFile(join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  const reference = await readFile(join(SKILL_ROOT, 'reference.md'), 'utf8');
  const readme = await readFile(join(SKILL_ROOT, 'README.md'), 'utf8');

  assert.match(skill, /phase4a/i);
  assert.match(skill, /phase4b/i);
  assert.match(skill, /The orchestrator does not perform phase logic inline/i);
  assert.match(reference, /artifact_lookup_<feature-id>/);
  assert.match(reference, /phase6_spawn_manifest\.json/);
  assert.match(reference, /validate_xmindmark_hierarchy/);
  assert.match(readme, /phase spawn manifests/i);

  assert.doesNotMatch(readme, /deploy_runtime_context_tools/i);
  assert.doesNotMatch(reference, /scenario_units_<feature-id>/);
});

test('active docs advertise script-driven artifacts and source routing', async () => {
  const reference = await readFile(join(SKILL_ROOT, 'reference.md'), 'utf8');
  const coverageContract = await readFile(join(SKILL_ROOT, 'references', 'context-coverage-contract.md'), 'utf8');

  assert.match(reference, /runtime_setup_<feature-id>/);
  assert.match(reference, /jira-cli/);
  assert.match(reference, /confluence/);
  assert.match(reference, /github/);
  assert.match(coverageContract, /artifact_lookup_<feature-id>/i);
});
