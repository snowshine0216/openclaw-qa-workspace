import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SKILL_ROOT = join(__dirname, '..');

const REQUIRED_FILES = [
  'references/phase4a-contract.md',
  'references/phase4b-contract.md',
  'references/context-coverage-contract.md',
  'references/review-rubric-phase5a.md',
  'references/review-rubric-phase5b.md',
  'references/review-rubric-phase6.md',
  'references/context-index-schema.md',
  'references/e2e-coverage-rules.md',
  'references/docs-governance.md',
  'references/feature-qa-planning-orchestrator-remediation-spec.md',
  'references/feature-qa-planning-orchestrator-remediation-implementation-summary.md',
  'references/script-driven-phase0-phase1-design.md',
  'references/validator-safe-authoring-and-dedup-guide.md',
  'references/subagent-quick-checklist.md',
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
  assert.match(skill, /phase5a/i);
  assert.match(skill, /phase5b/i);
  assert.match(skill, /The orchestrator does not perform phase logic inline/i);
  assert.match(reference, /artifact_lookup_<feature-id>/);
  assert.match(reference, /phase5a_spawn_manifest\.json/);
  assert.match(reference, /phase5b_spawn_manifest\.json/);
  assert.match(reference, /successful rounds rewrite `context\/artifact_lookup_<feature-id>\.md`/);
  assert.match(reference, /return phase5a/);
  assert.match(reference, /return phase5b/);
  assert.match(reference, /validate_final_layering/);
  assert.match(readme, /phase spawn manifests/i);
  assert.match(readme, /qa_plan_phase5a_r<round>/i);
  assert.match(readme, /qa_plan_phase5b_r<round>/i);

  assert.doesNotMatch(readme, /deploy_runtime_context_tools/i);
  assert.doesNotMatch(reference, /scenario_units_<feature-id>/);
  assert.doesNotMatch(reference, /phase5_spawn_manifest\.json/);
});

test('active docs advertise script-driven artifacts and source routing', async () => {
  const reference = await readFile(join(SKILL_ROOT, 'reference.md'), 'utf8');
  const coverageContract = await readFile(join(SKILL_ROOT, 'references', 'context-coverage-contract.md'), 'utf8');
  const phase4bContract = await readFile(join(SKILL_ROOT, 'references', 'phase4b-contract.md'), 'utf8');
  const phase5aRubric = await readFile(join(SKILL_ROOT, 'references', 'review-rubric-phase5a.md'), 'utf8');
  const phase5bRubric = await readFile(join(SKILL_ROOT, 'references', 'review-rubric-phase5b.md'), 'utf8');
  const phase6Rubric = await readFile(join(SKILL_ROOT, 'references', 'review-rubric-phase6.md'), 'utf8');
  const contextIndexSchema = await readFile(join(SKILL_ROOT, 'references', 'context-index-schema.md'), 'utf8');
  const evals = await readFile(join(SKILL_ROOT, 'evals', 'evals.json'), 'utf8');

  assert.match(reference, /runtime_setup_<feature-id>/);
  assert.match(reference, /phase4a-contract\.md/);
  assert.match(reference, /review-rubric-phase5a\.md/);
  assert.match(reference, /review-rubric-phase5b\.md/);
  assert.match(reference, /review-rubric-phase6\.md/);
  assert.match(reference, /Coverage Preservation Audit/i);
  assert.match(reference, /Phase 5a Acceptance Gate/i);
  assert.match(reference, /round progression/i);
  assert.match(reference, /priority behavior is deferred and unchanged/i);
  assert.match(reference, /Phase 4a input draft/i);
  assert.match(reference, /Phase 5a input draft/i);
  assert.match(reference, /jira-cli/);
  assert.match(reference, /confluence/);
  assert.match(reference, /github/);
  assert.match(reference, /context_only_no_defect_analysis/);
  assert.match(reference, /tavily-search.*before.*confluence/i);
  assert.match(coverageContract, /artifact_lookup_<feature-id>/i);
  assert.match(coverageContract, /context-only evidence/i);
  assert.match(coverageContract, /Tavily-first provenance/i);
  assert.match(phase4bContract, /Phase 6 owns the final few-shot rewrite pass/i);
  assert.match(phase4bContract, /may not silently shrink coverage/i);
  assert.match(phase4bContract, /Workstation-only and Library-gap scenarios/i);
  assert.match(phase4bContract, /Bounded Research Rule/i);
  assert.match(phase5aRubric, /Pass \/ Return Criteria/i);
  assert.match(phase5aRubric, /Coverage Preservation Audit/i);
  assert.match(phase5aRubric, /Supporting Artifact Coverage Audit/i);
  assert.match(phase5aRubric, /Deep Research Coverage Audit/i);
  assert.match(phase5aRubric, /Do not remove, defer, or move a concern to Out of Scope/i);
  assert.match(phase5aRubric, /return phase5a/i);
  assert.match(phase5bRubric, /Bounded Research Rule/i);
  assert.match(phase5bRubric, /Do not remove, defer, or move a concern to Out of Scope/i);
  assert.match(phase5bRubric, /supporting_context_and_gap_readiness/i);
  assert.match(phase5bRubric, /return phase5a/i);
  assert.match(phase5bRubric, /return phase5b/i);
  assert.match(phase6Rubric, /preserve reviewed coverage scope/i);
  assert.match(phase6Rubric, /support-derived scenarios/i);
  assert.match(contextIndexSchema, /priority behavior is unchanged in this pass/i);
  assert.match(evals, /"round_progression"/);
  assert.match(evals, /"coverage_preservation"/);
  assert.match(evals, /"phase5a_acceptance_gate"/);
  assert.match(evals, /"support_context_integrity"/);
  assert.match(evals, /"deep_research_ordering"/);
  assert.match(evals, /"request_fulfillment"/);
});

test('validator-safe guide and subagent checklist advertise the correct operational rules', async () => {
  const guide = await readFile(join(SKILL_ROOT, 'references', 'validator-safe-authoring-and-dedup-guide.md'), 'utf8');
  const checklist = await readFile(join(SKILL_ROOT, 'references', 'subagent-quick-checklist.md'), 'utf8');

  assert.match(guide, /validator-safe beats prose-pretty/i);
  assert.match(guide, /never put priority tags on grouping bullets/i);
  assert.match(guide, /never use `all sections` in context audits/i);
  assert.match(guide, /Checkpoint 1.*Checkpoint 15/is);
  assert.match(guide, /deduplicate by unique trigger.*risk.*outcome/i);
  assert.match(checklist, /Do only executable scenario bullets carry.*P1.*P2/i);
  assert.match(checklist, /Does.*Checkpoint Summary.*use exact labels/i);
  assert.match(checklist, /validator-safe-authoring-and-dedup-guide/i);
});
