import {
  BaseEdge,
  getStraightPath,
  type EdgeProps,
  MarkerType,
} from '@xyflow/react';

/** Offset to extend path so edge visually touches node boundaries (XMind-style) */
const BOUNDARY_OFFSET = 14;

/**
 * XMind-style straight edge: extends the path so the line and arrowhead
 * touch the node boundaries (no visible gap).
 */
export function TouchingStraightEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
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

  const [path] = getStraightPath({
    sourceX: adjSourceX,
    sourceY: adjSourceY,
    targetX: adjTargetX,
    targetY: adjTargetY,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd ?? { type: MarkerType.ArrowClosed, color: '#ef4e19', width: 30, height: 30 }}
      style={style ?? { stroke: '#ef4e19', strokeWidth: 3.8 }}
      {...rest}
    />
  );
}
