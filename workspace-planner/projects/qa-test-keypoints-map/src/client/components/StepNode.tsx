import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { StepNodeData } from '../../shared/graph/toGraphModel';

type StepFlowNode = Node<StepNodeData, 'stepNode'>;

const handleStyle = { width: 8, height: 8, border: 'none', background: 'transparent' };

export function StepNode({ data, selected }: NodeProps<StepFlowNode>) {
  return (
    <div className={`card-node step-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <div className="node-header">
        <span className="node-badge">Verified Steps</span>
      </div>
      <ul className="steps-list">
        {data.steps.map((step, index) => (
          <li key={`${index + 1}-${step}`}>
            <strong>{index + 1}.</strong> {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
