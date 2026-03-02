import { Position, type Edge, type Node } from '@xyflow/react';
import dagre from 'dagre';

import type { TestCaseRow, TestKeyPointSection, TestKeyPointsDocument } from '../model/testKeyPointTypes';

const ROOT_NODE_ID = 'root';

export type RootNodeData = {
  kind: 'root';
  featureId: string;
  planTitle: string;
};

export type CategoryNodeData = {
  kind: 'category';
  sectionId: string;
  title: string;
  caseCount: number;
};

export type CheckpointNodeData = {
  kind: 'checkpoint';
  caseId: string;
  sectionId: string;
  rowNumber: string;
  priority: string;
  checkPoint: string;
  relatedCodeChange: string;
};

export type StepNodeData = {
  kind: 'steps';
  caseId: string;
  steps: string[];
};

export type ResultNodeData = {
  kind: 'result';
  caseId: string;
  expectedResults: string;
};

export type GraphNodeData =
  | RootNodeData
  | CategoryNodeData
  | CheckpointNodeData
  | StepNodeData
  | ResultNodeData;

export type RootGraphNode = Node<RootNodeData, 'rootNode'>;
export type CategoryGraphNode = Node<CategoryNodeData, 'categoryNode'>;
export type CheckpointGraphNode = Node<CheckpointNodeData, 'checkpointNode'>;
export type StepGraphNode = Node<StepNodeData, 'stepNode'>;
export type ResultGraphNode = Node<ResultNodeData, 'resultNode'>;

export type GraphNode =
  | RootGraphNode
  | CategoryGraphNode
  | CheckpointGraphNode
  | StepGraphNode
  | ResultGraphNode;

function arrowEdge(source: string, target: string, id: string): Edge {
  return {
    id,
    source,
    target,
    type: 'straight',
    style: {
      stroke: '#ef4e19',
      strokeWidth: 3.8,
    },
    zIndex: 5,
  };
}

function connectDirect(
  edges: Edge[],
  sourceId: string,
  targetId: string,
  relationshipId: string,
): void {
  edges.push(arrowEdge(sourceId, targetId, `edge::${relationshipId}`));
}

function extractStepTexts(testKeyPoints: string): string[] {
  const lineItems = testKeyPoints
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lineItems.length > 1) {
    return lineItems;
  }

  const single = lineItems[0] ?? testKeyPoints.trim();
  if (!single) {
    return ['Define verification step'];
  }

  const arrowParts = single
    .split(/\s*(?:->|→)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (arrowParts.length > 1) {
    return arrowParts;
  }

  const numberedParts = single
    .split(/\s*(?=\d+\.\s)/)
    .map((part) => part.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
  if (numberedParts.length > 1) {
    return numberedParts;
  }

  return [single];
}

function addCategoryNode(nodes: GraphNode[], section: TestKeyPointSection): CategoryGraphNode {
  const node: CategoryGraphNode = {
    id: section.id,
    type: 'categoryNode',
    data: {
      kind: 'category',
      sectionId: section.id,
      title: section.title,
      caseCount: section.cases.length,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 0, y: 0 },
    width: 330,
    height: 112,
  };
  nodes.push(node);
  return node;
}

function addCaseHierarchy(
  nodes: GraphNode[],
  edges: Edge[],
  section: TestKeyPointSection,
  row: TestCaseRow,
): void {
  const checkpointId = `${row.id}::checkpoint`;
  const stepsId = `${row.id}::steps`;
  const resultId = `${row.id}::result`;

  const checkpointNode: CheckpointGraphNode = {
    id: checkpointId,
    type: 'checkpointNode',
    data: {
      kind: 'checkpoint',
      caseId: row.id,
      sectionId: section.id,
      rowNumber: row.rowNumber,
      priority: row.priority,
      checkPoint: row.testKeyPoints,
      relatedCodeChange: row.relatedCodeChange,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 0, y: 0 },
    width: 340,
    height: 136,
  };
  nodes.push(checkpointNode);
  connectDirect(edges, section.id, checkpointId, `${section.id}::${row.id}::checkpoint`);

  const stepTexts = extractStepTexts(row.testKeyPoints);
  const stepsNode: StepGraphNode = {
    id: stepsId,
    type: 'stepNode',
    data: {
      kind: 'steps',
      caseId: row.id,
      steps: stepTexts,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 0, y: 0 },
    width: 350,
    height: Math.min(260, Math.max(132, 80 + stepTexts.length * 22)),
  };

  nodes.push(stepsNode);
  connectDirect(edges, checkpointId, stepsId, `${row.id}::steps`);

  const resultNode: ResultGraphNode = {
    id: resultId,
    type: 'resultNode',
    data: {
      kind: 'result',
      caseId: row.id,
      expectedResults: row.expectedResults,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    position: { x: 0, y: 0 },
    width: 340,
    height: 136,
  };

  nodes.push(resultNode);
  connectDirect(edges, stepsId, resultId, `${row.id}::result`);
}

function layoutGraph(nodes: GraphNode[], edges: Edge[]): GraphNode[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  /* Layout: ample space so stepped/curved lines stay in channels */
  graph.setGraph({
    rankdir: 'LR',
    ranksep: 200,
    nodesep: 180,
    edgesep: 50,
    marginx: 70,
    marginy: 56,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: node.width ?? 260,
      height: node.height ?? 110,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);
    return {
      ...node,
      position: {
        x: position.x - (node.width ?? 260) / 2,
        y: position.y - (node.height ?? 110) / 2,
      },
    };
  });
}

export function toGraphModel(document: TestKeyPointsDocument): {
  nodes: GraphNode[];
  edges: Edge[];
} {
  const nodes: GraphNode[] = [
    {
      id: ROOT_NODE_ID,
      type: 'rootNode',
      data: {
        kind: 'root',
        featureId: document.featureId,
        planTitle: document.planTitle,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: { x: 0, y: 0 },
      width: 420,
      height: 112,
    },
  ];

  const edges: Edge[] = [];

  document.sections.forEach((section) => {
    addCategoryNode(nodes, section);
    connectDirect(edges, ROOT_NODE_ID, section.id, `${ROOT_NODE_ID}::${section.id}`);

    section.cases.forEach((row) => {
      addCaseHierarchy(nodes, edges, section, row);
    });
  });

  return {
    nodes: layoutGraph(nodes, edges),
    edges,
  };
}
