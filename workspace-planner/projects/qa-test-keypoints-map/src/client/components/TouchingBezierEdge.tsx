import {
  BaseEdge,
  getBezierPath,
  Position,
  type EdgeProps,
} from '@xyflow/react';

/** Extend path so edge reaches node boundaries */
const BOUNDARY_OFFSET = 35;
/** Gentle curvature: keeps curves but reduces cross/overlap */
const CURVATURE = 0.2;

/**
 * Curved edge with enough spacing to avoid crossing or overlapping.
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
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = len > 0 ? dx / len : 0;
  const uy = len > 0 ? dy / len : 0;

  const adjSourceX = sourceX - ux * BOUNDARY_OFFSET;
  const adjSourceY = sourceY - uy * BOUNDARY_OFFSET;
  const adjTargetX = targetX + ux * BOUNDARY_OFFSET;
  const adjTargetY = targetY + uy * BOUNDARY_OFFSET;

  const [path] = getBezierPath({
    sourceX: adjSourceX,
    sourceY: adjSourceY,
    sourcePosition,
    targetX: adjTargetX,
    targetY: adjTargetY,
    targetPosition,
    curvature: CURVATURE,
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
