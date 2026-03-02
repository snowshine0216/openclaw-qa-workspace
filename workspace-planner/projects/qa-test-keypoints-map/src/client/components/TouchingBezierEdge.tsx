import {
  BaseEdge,
  getSmoothStepPath,
  Position,
  type EdgeProps,
} from '@xyflow/react';

/** Smooth-step routes in channels, rounded corners = curved look, no sweep into nodes */
const BORDER_RADIUS = 16;
const STEP_OFFSET = 24;

/**
 * Rounded step edge: curved corners, no overlap with nodes or other lines.
 */
export function TouchingBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  ...rest
}: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: BORDER_RADIUS,
    offset: STEP_OFFSET,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      style={style ?? { stroke: '#ef4e19', strokeWidth: 3.8 }}
      {...rest}
    />
  );
}
