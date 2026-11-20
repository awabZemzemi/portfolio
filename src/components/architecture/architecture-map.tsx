import { flows, type Box, type Diagram, type Edge, type Layout, type Node } from "./model";

function connection(edge: Edge, layout: Layout): { path: string; x: number; y: number; anchor: "start" | "middle" | "end" } {
  const [ax, ay, aw, ah] = layout.boxes[edge.from];
  const [bx, by, bw, bh] = layout.boxes[edge.to];
  const offset = edge.offset ?? 0;
  const horizontal = layout.axes?.[edge.id]
    ? layout.axes[edge.id] === "horizontal"
    : ax + aw <= bx || bx + bw <= ax;
  if (horizontal) {
    const rightward = bx > ax;
    const x1 = rightward ? ax + aw : ax;
    const x2 = rightward ? bx : bx + bw;
    const y1 = ay + ah / 2 + offset;
    const y2 = by + bh / 2 + offset;
    const middle = (x1 + x2) / 2;
    return { path: `M${x1} ${y1} H${middle} V${y2} H${x2}`, x: middle, y: Math.min(y1, y2) - 6, anchor: "middle" };
  }
  const downward = by > ay;
  const y1 = downward ? ay + ah : ay;
  const y2 = downward ? by : by + bh;
  const track = layout.verticalTrack ?? .5;
  const x1 = ax + aw * track + offset;
  const x2 = bx + bw * track + offset;
  // Keep parallel return paths separate through the bend as well as at the ports.
  const middle = (y1 + y2) / 2 + offset;
  return {
    path: `M${x1} ${y1} V${middle} H${x2} V${y2}`,
    x: offset < 0 ? Math.min(x1, x2) - 9 : Math.max(x1, x2) + 9,
    y: (y1 + y2) / 2 + 4,
    anchor: offset < 0 ? "end" : "start",
  };
}

function ArchitectureNode({ node, box, active }: { node: Node; box: Box; active: boolean }) {
  const [x, y, width, height] = box;
  const textX = node.kind === "client" ? 12 : 14;
  return (
    <g transform={`translate(${x} ${y})`} className={`architecture-node node-${node.kind}`} data-active={active}>
      {node.kind === "store" ? (
        <>
          <path className="architecture-node-shape" d={`M0 8 Q0 0 ${width / 2} 0 T${width} 8 V${height - 8} Q${width} ${height} ${width / 2} ${height} T0 ${height - 8} Z`} />
          <path className="architecture-store-rim" d={`M0 8 Q0 15 ${width / 2} 15 T${width} 8`} />
        </>
      ) : node.kind === "agent" ? (
        <path className="architecture-node-shape" d={`M0 0 H${width - 10} L${width} 10 V${height} H0 Z`} />
      ) : (
        <rect className="architecture-node-shape" width={width} height={height} />
      )}
      {node.kind === "service" && <path className="architecture-service-rail" d={`M3 0 V${height}`} />}
      <text className="architecture-node-title" x={textX} y={node.kind === "store" ? 35 : 27}>{node.title}</text>
      {node.details.map((line, index) => (
        <text
          key={line}
          className={line.startsWith("POST ") ? "architecture-node-detail architecture-label" : "architecture-node-detail"}
          x={textX}
          y={(node.kind === "store" ? 54 : 47) + index * 17}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function ArchitectureMap({ diagram, active, mapId }: {
  diagram: Diagram;
  active: Diagram["steps"][number] | undefined;
  mapId: string;
}) {
  return <div className="architecture-viewport" id={mapId}>
    {Object.entries(diagram.layouts).map(([variant, layout]) => {
      const prefix = `${mapId}-${variant}`;
      return (
        <svg className={`architecture-canvas architecture-${variant}`} viewBox={`0 0 ${layout.size.join(" ")}`} aria-hidden="true" key={variant}>
          <defs>
            {Array.from(new Set(diagram.edges.map(edge => edge.flow))).map(flow => (
              <marker key={flow} id={`${prefix}-${flow}`} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 8 4 0 8Z" fill={flows[flow].color} />
              </marker>
            ))}
          </defs>
          {diagram.zones?.map(zone => {
            const boxes = zone.nodes.map(id => layout.boxes[id]);
            const left = Math.min(...boxes.map(box => box[0])) - 10;
            const top = Math.min(...boxes.map(box => box[1])) - 31;
            const right = Math.max(...boxes.map(([x, , width]) => x + width)) + 10;
            const bottom = Math.max(...boxes.map(([, y, , height]) => y + height)) + 11;
            return <g className="architecture-zone" key={zone.label}>
              <rect x={left} y={top} width={right - left} height={bottom - top} />
              <line x1={left} x2={right} y1={top} y2={top} />
              <text className="architecture-label" x={left + 10} y={top + 20}>{zone.label}</text>
            </g>;
          })}
          {diagram.edges.map(edge => {
            const { path, x, y, anchor } = connection(edge, layout);
            const flow = flows[edge.flow];
            const selected = active?.edges?.includes(edge.id);
            return <g key={edge.id} className="architecture-edge" data-active={Boolean(selected)}>
              <path d={path} stroke={flow.color} strokeDasharray={"dashed" in flow ? "4 4" : undefined} markerEnd={`url(#${prefix}-${edge.flow})`} />
              {selected && <path d={path} pathLength={100} className="architecture-signal" stroke={flow.color} />}
              {edge.label && !layout.hiddenLabels?.includes(edge.id) &&
                <text x={x} y={y} textAnchor={anchor} className="architecture-label">{edge.label}</text>}
            </g>;
          })}
          {diagram.nodes.map(node => <ArchitectureNode
            key={node.id}
            node={node}
            box={layout.boxes[node.id]}
            active={Boolean(active?.nodes.includes(node.id))}
          />)}
        </svg>
      );
    })}
  </div>;
}
