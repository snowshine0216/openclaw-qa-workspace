import { describe, expect, it } from 'vitest';

import { moveCaseToSection, removeCase } from '../src/shared/graph/fromGraphEdits';
import { toGraphModel } from '../src/shared/graph/toGraphModel';
import type { TestKeyPointsDocument } from '../src/shared/model/testKeyPointTypes';

function buildDocument(): TestKeyPointsDocument {
  return {
    featureId: 'BCIN-TEST',
    planTitle: 'QA Plan',
    sections: [
      {
        id: 'section-a',
        title: 'Section A',
        tableColumns: [
          '#',
          'Priority',
          'Related Code Change',
          'Acceptance Criteria',
          'Test Key Points',
          'Expected Results',
        ],
        cases: [
          {
            id: 'case-a-1',
            rowNumber: '1.1',
            priority: 'P1',
            relatedCodeChange: 'PR #1',
            acceptanceCriteria: 'AC A',
            testKeyPoints: 'Open report',
            expectedResults: 'Report opens',
            extraColumns: {},
          },
        ],
      },
      {
        id: 'section-b',
        title: 'Section B',
        tableColumns: [
          '#',
          'Priority',
          'Related Code Change',
          'Acceptance Criteria',
          'Test Key Points',
          'Expected Results',
        ],
        cases: [
          {
            id: 'case-b-1',
            rowNumber: '2.1',
            priority: 'P2',
            relatedCodeChange: 'PR #2',
            acceptanceCriteria: 'AC B',
            testKeyPoints: 'Validate filter',
            expectedResults: 'Only matching rows are shown',
            extraColumns: {},
          },
        ],
      },
    ],
  };
}

describe('graph edit behavior', () => {
  it('removes a category when deleting its last case', () => {
    const document = buildDocument();
    const next = removeCase(document, 'case-a-1');

    expect(next.sections).toHaveLength(1);
    expect(next.sections[0]?.id).toBe('section-b');
    expect(next.sections[0]?.cases[0]?.rowNumber).toBe('1.1');
  });

  it('removes source category after moving its last case out', () => {
    const document = buildDocument();
    const next = moveCaseToSection(document, 'case-a-1', 'section-b');

    expect(next.sections).toHaveLength(1);
    expect(next.sections[0]?.id).toBe('section-b');
    expect(next.sections[0]?.cases).toHaveLength(2);
    expect(next.sections[0]?.cases[0]?.id).toBe('case-b-1');
    expect(next.sections[0]?.cases[1]?.id).toBe('case-a-1');
    expect(next.sections[0]?.cases[0]?.rowNumber).toBe('1.1');
    expect(next.sections[0]?.cases[1]?.rowNumber).toBe('1.2');
  });

  it('creates graph without verified-steps nodes', () => {
    const document = buildDocument();
    const graph = toGraphModel(document);
    const nodeTypes = graph.nodes.map((node) => String(node.type));

    expect(nodeTypes.includes('stepNode')).toBe(false);
    expect(graph.edges.some((edge) => edge.target.endsWith('::steps'))).toBe(false);
    expect(graph.edges.some((edge) => edge.target.endsWith('::result'))).toBe(true);
  });
});
