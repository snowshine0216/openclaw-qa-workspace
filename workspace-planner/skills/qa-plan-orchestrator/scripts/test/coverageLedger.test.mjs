import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildCoverageLedgerArtifacts,
  collectRequiredAnalogRowIds,
  collectUnresolvedBlockingAnalogRowIds,
  collectUnresolvedPackRows,
} from '../lib/coverageLedger.mjs';

test('buildCoverageLedgerArtifacts renders schema-compliant json and markdown', () => {
  const artifacts = buildCoverageLedgerArtifacts({
    featureId: 'BCIN-7289',
    knowledgePackKey: 'report-editor',
    knowledgePackVersion: '2026-03-23',
    candidates: [{
      knowledge_pack_row_id: 'outcome:outcome-window-title',
      row_type: 'required_outcome',
      title: 'window title correctness',
      status: 'unmapped',
      match_method: 'bm25',
      query_source: 'jira_summary',
      score: 14.2,
    }],
  });

  assert.equal(artifacts.json.feature_id, 'BCIN-7289');
  assert.equal(artifacts.json.knowledge_pack_key, 'report-editor');
  assert.equal(artifacts.json.candidates[0].knowledge_pack_row_id, 'outcome:outcome-window-title');
  assert.equal(artifacts.json.candidates[0].required_gate, false);
  assert.match(artifacts.markdown, /## Scenario Mapping Table/);
  assert.match(artifacts.markdown, /outcome:outcome-window-title \| required_outcome \| window title correctness \| bm25 \| unmapped/);
});

test('buildCoverageLedgerArtifacts writes an explicit none marker when no pack-backed candidates exist', () => {
  const artifacts = buildCoverageLedgerArtifacts({
    featureId: 'BCIN-9000',
    knowledgePackKey: null,
    knowledgePackVersion: null,
    candidates: [],
  });

  assert.deepEqual(artifacts.json.candidates, []);
  assert.match(artifacts.markdown, /## Scenario Mapping Table\n- none/);
});

test('collectUnresolvedPackRows blocks Phase 5a on required outcomes and sdk-visible contracts', () => {
  const unresolved = collectUnresolvedPackRows([
    {
      knowledge_pack_row_id: 'outcome:window-title',
      row_type: 'required_outcome',
      title: 'window title correctness',
      status: 'unmapped',
    },
    {
      knowledge_pack_row_id: 'sdk:setwindowtitle',
      row_type: 'sdk_visible_contract',
      title: 'setWindowTitle',
      status: 'unmapped',
    },
    {
      knowledge_pack_row_id: 'analog:BCIN-7730',
      row_type: 'analog_gate',
      title: 'prompt pause mode',
      status: 'unmapped',
    },
    {
      knowledge_pack_row_id: 'cap:save-report',
      row_type: 'required_capability',
      title: 'save report',
      status: 'covered',
    },
  ]);

  assert.deepEqual(
    unresolved.map((candidate) => candidate.knowledge_pack_row_id),
    ['outcome:window-title', 'sdk:setwindowtitle'],
  );
});

test('analog gate collectors only return required blocking rows', () => {
  const candidates = [
    {
      knowledge_pack_row_id: 'analog:BCIN-7730',
      row_type: 'analog_gate',
      title: 'blocking analog gate',
      required_gate: true,
      status: 'unmapped',
    },
    {
      knowledge_pack_row_id: 'analog:BCIN-9999',
      row_type: 'analog_gate',
      title: 'advisory analog gate',
      required_gate: false,
      status: 'unmapped',
    },
  ];

  assert.deepEqual(collectRequiredAnalogRowIds(candidates), ['analog:BCIN-7730']);
  assert.deepEqual(collectUnresolvedBlockingAnalogRowIds(candidates), ['analog:BCIN-7730']);
});
