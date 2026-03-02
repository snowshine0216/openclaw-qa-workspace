import { useState } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { CheckpointNodeData } from '../../shared/graph/toGraphModel';

type CheckpointFlowNode = Node<CheckpointNodeData, 'checkpointNode'>;

const handleStyle = { width: 8, height: 8, border: 'none', background: 'transparent' };

export function CheckpointNode({ data, selected }: NodeProps<CheckpointFlowNode>) {
  const [showRelated, setShowRelated] = useState(false);

  return (
    <div className={`card-node checkpoint-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <div className="node-header">
        <span className="priority-chip">{data.priority}</span>
        <span className="node-badge">Check Point {data.rowNumber}</span>
      </div>
      <p className="node-title">{data.checkPoint}</p>
      <button
        type="button"
        className="node-link"
        onClick={(event) => {
          event.stopPropagation();
          setShowRelated((value) => !value);
        }}
      >
        {showRelated ? 'Hide related code' : 'Show related code'}
      </button>
      {showRelated ? <p className="node-meta">{data.relatedCodeChange}</p> : null}
    </div>
  );
}
