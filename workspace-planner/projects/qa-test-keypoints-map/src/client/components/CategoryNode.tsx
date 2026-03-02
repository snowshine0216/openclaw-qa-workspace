import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { CategoryNodeData } from '../../shared/graph/toGraphModel';

type CategoryFlowNode = Node<CategoryNodeData, 'categoryNode'>;

const handleStyle = { width: 8, height: 8, border: 'none', background: 'transparent' };

export function CategoryNode({ data, selected }: NodeProps<CategoryFlowNode>) {
  return (
    <div className={`card-node category-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <div className="node-header">
        <span className="node-badge">Category</span>
        <span className="section-count">{data.caseCount} checkpoints</span>
      </div>
      <p className="node-title">{data.title}</p>
    </div>
  );
}
