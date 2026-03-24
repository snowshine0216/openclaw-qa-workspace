import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeKnowledgePackRows, slugifyKnowledgePackToken } from '../lib/knowledgePackRowNormalizer.mjs';

test('slugifyKnowledgePackToken produces deterministic row suffixes', () => {
  assert.equal(slugifyKnowledgePackToken('template-based creation'), 'template-based-creation');
  assert.equal(slugifyKnowledgePackToken('setWindowTitle'), 'setwindowtitle');
  assert.equal(slugifyKnowledgePackToken('implicit sdk contract wording without observable verification leaves'), 'implicit-sdk-contract-wording-without-observable-verification-leaves');
});

test('normalizeKnowledgePackRows creates canonical row ids and dedupes interaction pairs', () => {
  const rows = normalizeKnowledgePackRows({
    pack_key: 'report-editor',
    version: '2026-03-23',
    required_capabilities: ['template-based creation'],
    required_outcomes: [{
      id: 'outcome-window-title',
      keywords: ['window title correctness', 'setWindowTitle'],
      observable_outcome: 'window title reflects current report context',
    }],
    state_transitions: [{
      id: 'transition-window-title',
      from: 'list view',
      to: 'editor open',
      trigger: 'double-click',
      observable_outcome: 'editor opens with correct title',
    }],
    analog_gates: [{
      source_issue: 'BCIN-7730',
      behavior: 'template with prompt pause mode running after creation',
      required_gate: true,
    }],
    sdk_visible_contracts: ['setWindowTitle'],
    interaction_pairs: [['template-save', 'save-as-overwrite']],
    interaction_matrices: [{
      id: 'matrix-risk',
      pairs: [['save-as-overwrite', 'template-save']],
    }],
    anti_patterns: ['silent drop of report-editor interaction coverage during review refactor'],
    evidence_refs: [{
      type: 'jira',
      id: 'BCIN-7730',
      topic: 'template with prompt pause mode running after creation',
    }],
  });

  assert.equal(rows.find((row) => row.row_id === 'capability:template-based-creation')?.row_type, 'required_capability');
  assert.equal(rows.find((row) => row.row_id === 'outcome:outcome-window-title')?.title, 'window title correctness');
  assert.equal(rows.find((row) => row.row_id === 'transition:transition-window-title')?.title, 'list view -> editor open');
  assert.equal(rows.find((row) => row.row_id === 'analog:BCIN-7730')?.required_gate, true);
  assert.equal(rows.find((row) => row.row_id === 'sdk:setwindowtitle')?.title, 'setWindowTitle');

  const interaction = rows.find((row) => row.row_id === 'interaction:save-as-overwrite__template-save');
  assert.ok(interaction);
  assert.deepEqual(interaction.declared_in.sort(), ['interaction_matrices', 'interaction_pairs']);

  const evidenceRef = rows.find((row) => row.row_id === 'evidence_ref:jira:BCIN-7730');
  assert.equal(evidenceRef.title, 'template with prompt pause mode running after creation');
  assert.deepEqual(evidenceRef.source_issue_refs, ['BCIN-7730']);
});

test('normalizeKnowledgePackRows supports string-form outcomes and transitions', () => {
  const rows = normalizeKnowledgePackRows({
    pack_key: 'report-editor',
    version: '2026-03-24',
    required_outcomes: ['save-as overwrite does not throw js error'],
    state_transitions: ['save-as -> overwrite-conflict -> confirmation'],
  });

  assert.deepEqual(
    rows.map((row) => row.row_id),
    [
      'outcome:save-as-overwrite-does-not-throw-js-error',
      'transition:save-as---overwrite-conflict---confirmation',
    ],
  );
  assert.equal(rows[0].title, 'save-as overwrite does not throw js error');
  assert.equal(rows[1].title, 'save-as -> overwrite-conflict -> confirmation');
});
