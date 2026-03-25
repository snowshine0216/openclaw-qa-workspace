import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { retrieveKnowledgePackCoverage } from '../lib/knowledgePackRetrieval.mjs';

function createQmdFactory(searchResults) {
  return async function createStore() {
    return {
      async update() {},
      async searchLex(queryText) {
        const result = searchResults[queryText] || [];
        return result.map((item) => ({ ...item }));
      },
      async close() {},
    };
  };
}

test('retrieveKnowledgePackCoverage produces stable BM25 candidates and projection artifacts', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'pack-retrieval-'));

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    const rows = [
      {
        row_id: 'analog:BCIN-7730',
        row_type: 'analog_gate',
        pack_key: 'report-editor',
        pack_version: '2026-03-23',
        title: 'template with prompt pause mode running after creation',
        keywords: ['BCIN-7730', 'prompt pause mode'],
        search_text: 'BCIN-7730 template with prompt pause mode running after creation',
        source_issue_refs: ['BCIN-7730'],
        declared_in: ['analog_gates'],
        required_gate: true,
        status: 'unmapped',
      },
      {
        row_id: 'sdk:setwindowtitle',
        row_type: 'sdk_visible_contract',
        pack_key: 'report-editor',
        pack_version: '2026-03-23',
        title: 'setWindowTitle',
        keywords: ['setWindowTitle'],
        search_text: 'setWindowTitle window title correctness',
        source_issue_refs: [],
        declared_in: ['sdk_visible_contracts'],
        required_gate: false,
        status: 'unmapped',
      },
    ];

    const result = await retrieveKnowledgePackCoverage({
      featureId: 'BCIN-7289',
      runDir,
      pack: {
        pack_key: 'report-editor',
        version: '2026-03-23',
      },
      normalizedRows: rows,
      queryInputs: [
        { query_source: 'jira_summary', text: 'BCIN-7730 prompt pause mode regression' },
        { query_source: 'confluence_design', text: 'setWindowTitle must reflect report context' },
      ],
      semanticMode: 'disabled',
      createStore: createQmdFactory({
        'BCIN-7730 prompt pause mode regression': [
          { id: 'analog:BCIN-7730', score: 22.4 },
        ],
        'setWindowTitle must reflect report context': [
          { id: 'sdk:setwindowtitle', score: 16.1 },
        ],
      }),
    });

    assert.equal(result.retrievalMode, 'bm25_only');
    assert.equal(result.semanticMode, 'disabled');
    assert.equal(result.candidates.length, 2);
    assert.deepEqual(
      result.candidates.map((candidate) => candidate.knowledge_pack_row_id),
      ['analog:BCIN-7730', 'sdk:setwindowtitle'],
    );
    assert.equal(result.candidates[0].required_gate, true);
    assert.equal(result.candidates[0].match_method, 'bm25');
    assert.match(await readFile(join(runDir, 'context', 'knowledge_pack_projection', 'analog--BCIN-7730.md'), 'utf8'), /BCIN-7730/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('retrieveKnowledgePackCoverage records semantic fallback warnings without dropping BM25 output', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'pack-retrieval-'));

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    const result = await retrieveKnowledgePackCoverage({
      featureId: 'BCIN-7289',
      runDir,
      pack: {
        pack_key: 'report-editor',
        version: '2026-03-23',
      },
      normalizedRows: [{
        row_id: 'sdk:setwindowtitle',
        row_type: 'sdk_visible_contract',
        pack_key: 'report-editor',
        pack_version: '2026-03-23',
        title: 'setWindowTitle',
        keywords: ['setWindowTitle'],
        search_text: 'setWindowTitle',
        source_issue_refs: [],
        declared_in: ['sdk_visible_contracts'],
        required_gate: false,
        status: 'unmapped',
      }],
      queryInputs: [{ query_source: 'jira_summary', text: 'setWindowTitle' }],
      semanticMode: 'openclaw_memory',
      createStore: createQmdFactory({
        setWindowTitle: [{ id: 'sdk:setwindowtitle', score: 9.5 }],
      }),
    });

    assert.equal(result.candidates.length, 1);
    assert.match(result.semanticWarning || '', /OPENCLAW_SESSION=1/);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('retrieveKnowledgePackCoverage keeps required pack rows visible when no BM25 hit exists', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'pack-retrieval-'));

  try {
    await mkdir(join(runDir, 'context'), { recursive: true });
    const rows = [
      {
        row_id: 'cap:save-report',
        row_type: 'required_capability',
        pack_key: 'report-editor',
        pack_version: '2026-03-23',
        title: 'save report',
        keywords: ['save'],
        search_text: 'save report flow',
        source_issue_refs: [],
        declared_in: ['required_capabilities'],
        required_gate: true,
        status: 'unmapped',
      },
      {
        row_id: 'outcome:window-title',
        row_type: 'required_outcome',
        pack_key: 'report-editor',
        pack_version: '2026-03-23',
        title: 'window title correctness',
        keywords: ['window title'],
        search_text: 'window title reflects report context',
        source_issue_refs: [],
        declared_in: ['required_outcomes'],
        required_gate: true,
        status: 'unmapped',
      },
    ];

    const result = await retrieveKnowledgePackCoverage({
      featureId: 'BCIN-7289',
      runDir,
      pack: {
        pack_key: 'report-editor',
        version: '2026-03-23',
      },
      normalizedRows: rows,
      queryInputs: [
        { query_source: 'jira_summary', text: 'save report flow' },
      ],
      semanticMode: 'disabled',
      createStore: createQmdFactory({
        'save report flow': [{ id: 'cap:save-report', score: 11.2 }],
      }),
    });

    assert.equal(result.candidates.length, 2);
    assert.deepEqual(result.candidates.map((candidate) => candidate.knowledge_pack_row_id), [
      'cap:save-report',
      'outcome:window-title',
    ]);

    const unmatchedRow = result.candidates[1];
    assert.equal(unmatchedRow.row_type, 'required_outcome');
    assert.equal(unmatchedRow.status, 'unmapped');
    assert.equal(unmatchedRow.match_method, 'none');
    assert.equal(unmatchedRow.query_source, '');
    assert.equal(unmatchedRow.score, 0);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
