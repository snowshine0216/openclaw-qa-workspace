import test from 'node:test';
import assert from 'node:assert/strict';

import { buildKnowledgePackSummaryArtifacts } from '../lib/knowledgePackSummarizer.mjs';

test('buildKnowledgePackSummaryArtifacts reports pack metadata, counts, and topics', () => {
  const artifacts = buildKnowledgePackSummaryArtifacts({
    featureId: 'BCIN-7289',
    pack: {
      pack_key: 'report-editor',
      version: '2026-03-23',
      deep_research_topics: ['report_editor_workstation_functionality'],
      required_capabilities: ['template-based creation'],
      required_outcomes: [{ id: 'outcome-window-title' }],
      state_transitions: [],
      analog_gates: [{ source_issue: 'BCIN-7730', required_gate: true }],
      sdk_visible_contracts: ['setWindowTitle'],
      interaction_pairs: [],
      interaction_matrices: [],
      anti_patterns: [],
      evidence_refs: [],
      retrieval_notes: ['Use exact issue ids when querying.'],
    },
    normalizedRows: [
      { row_id: 'capability:template-based-creation', row_type: 'required_capability' },
      { row_id: 'outcome:outcome-window-title', row_type: 'required_outcome' },
    ],
    warnings: ['optional content family interaction_pairs is absent'],
  });

  assert.equal(artifacts.json.feature_id, 'BCIN-7289');
  assert.equal(artifacts.json.knowledge_pack_key, 'report-editor');
  assert.equal(artifacts.json.knowledge_pack_row_count, 2);
  assert.deepEqual(artifacts.json.deep_research_topics, ['report_editor_workstation_functionality']);
  assert.match(artifacts.markdown, /knowledge pack key: report-editor/i);
  assert.match(artifacts.markdown, /normalized retrieval rows: 2/i);
  assert.match(artifacts.markdown, /Use exact issue ids when querying/i);
  assert.match(artifacts.markdown, /interaction_pairs is absent/i);
});
