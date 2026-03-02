import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { ResultNodeData } from '../../shared/graph/toGraphModel';

type ResultFlowNode = Node<ResultNodeData, 'resultNode'>;

const handleStyle = { width: 8, height: 8, border: 'none', background: 'transparent' };

export function ResultNode({ data, selected }: NodeProps<ResultFlowNode>) {
  return (
    <div className={`card-node result-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div className="node-header">
        <span className="node-badge">Expected Result</span>
      </div>
      <p className="node-title">{data.expectedResults}</p>
    </div>
  );
}
