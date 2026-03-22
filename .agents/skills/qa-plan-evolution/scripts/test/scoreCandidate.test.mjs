import test from 'node:test';
import assert from 'node:assert';
import { scoreChallengerVsChampion } from '../lib/scoreCandidate.mjs';

test('rejects when regression_count > 0', () => {
  const o = scoreChallengerVsChampion({
    profileId: 'generic-skill-regression',
    validationSummary: {
      regression_count: 1,
      smoke_ok: true,
      eval_ok: true,
      contract_compliance_score: 1,
    },
    championScoreboard: {},
  });
  assert.strictEqual(o.accept, false);
  assert.strictEqual(o.blocking_regression, true);
});

test('accepts clean generic run', () => {
  const o = scoreChallengerVsChampion({
    profileId: 'generic-skill-regression',
    validationSummary: {
      regression_count: 0,
      smoke_ok: true,
      eval_ok: true,
      contract_compliance_score: 1,
    },
    championScoreboard: { defect_recall_score: 0 },
  });
  assert.strictEqual(o.accept, true);
});

test('rejects qa-plan challenger when defect recall regresses', () => {
  const o = scoreChallengerVsChampion({
    profileId: 'qa-plan-defect-recall',
    validationSummary: {
      regression_count: 0,
      smoke_ok: true,
      eval_ok: true,
      contract_compliance_score: 1,
      defect_recall_score: 0.7,
      knowledge_pack_coverage_score: 0.9,
    },
    championScoreboard: {
      defect_recall_score: 0.8,
      contract_compliance_score: 1,
      knowledge_pack_coverage_score: 0.8,
    },
  });
  assert.strictEqual(o.accept, false);
});

test('accepts qa-plan challenger when primary metrics improve without regressions', () => {
  const o = scoreChallengerVsChampion({
    profileId: 'qa-plan-knowledge-pack-coverage',
    validationSummary: {
      regression_count: 0,
      smoke_ok: true,
      eval_ok: true,
      contract_compliance_score: 1,
      defect_recall_score: 0.8,
      knowledge_pack_coverage_score: 0.95,
    },
    championScoreboard: {
      defect_recall_score: 0.8,
      contract_compliance_score: 0.9,
      knowledge_pack_coverage_score: 0.8,
    },
  });
  assert.strictEqual(o.accept, true);
});

test('accepts qa-plan challenger when tied with champion (no meaningful improvement)', () => {
  const o = scoreChallengerVsChampion({
    profileId: 'qa-plan-knowledge-pack-coverage',
    validationSummary: {
      regression_count: 0,
      smoke_ok: true,
      eval_ok: true,
      contract_compliance_score: 1,
      defect_recall_score: 0.8,
      knowledge_pack_coverage_score: 0.8,
    },
    championScoreboard: {
      defect_recall_score: 0.8,
      contract_compliance_score: 1,
      knowledge_pack_coverage_score: 0.8,
    },
  });
  assert.strictEqual(o.accept, true);
  assert.strictEqual(o.meaningful_improvement, false);
});
