import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { RootNodeData } from '../../shared/graph/toGraphModel';

type RootFlowNode = Node<RootNodeData, 'rootNode'>;

const handleStyle = { width: 8, height: 8, border: 'none', background: 'transparent' };

export function RootNode({ data }: NodeProps<RootFlowNode>) {
  return (
    <div className="card-node root-node">
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <div className="node-header">
        <span className="node-badge">Feature</span>
        <span className="section-count">{data.featureId}</span>
      </div>
      <p className="node-title">{data.planTitle}</p>
    </div>
  );
}
