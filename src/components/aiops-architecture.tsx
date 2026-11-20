import { Boxes, Braces, Workflow, Wrench, ScanSearch, UserRound } from "lucide-react";

const components = [
  { name: "Operator", detail: "Diagnostic request", icon: UserRound },
  { name: "FastAPI", detail: "Authenticate bearer token", extra: "Authorize namespace", icon: Braces },
  { name: "AgentNode", detail: "Reason over messages", icon: Workflow },
  { name: "ToolNode", detail: "Dispatch selected tool", icon: Wrench },
  { name: "Diagnostic tools", detail: "Read-only collectors", extra: "Use ServiceAccount identity", icon: ScanSearch },
  { name: "Kubernetes API", detail: "Enforce namespaced RBAC", icon: Boxes },
];

const flows = {
  control: { color: "#bac5b6", label: "Request / response" },
  tool: { color: "#cfb681", label: "Tool calls" },
  evidence: { color: "#9cbea7", label: "Evidence" },
};
type Flow = keyof typeof flows;
type Point = [number, number];

function Blueprint({ compact }: { compact: boolean }) {
  const id = compact ? "portrait" : "landscape";
  const width = compact ? 208 : 228;
  const height = 86;
  const points: Point[] = compact
    ? components.map((_, i) => [51, 25 + i * 144])
    : [[30, 57], [365, 57], [700, 57], [700, 257], [365, 257], [30, 257]];

  function wire(d: string, kind: Flow, key: string) {
    return <path key={key} d={d} fill="none" stroke={flows[kind].color} strokeWidth="1.6" strokeDasharray={kind === "evidence" ? "5 4" : undefined} markerEnd={`url(#${id}-${kind})`} />;
  }

  function boundary(index: number, label: string, double = false) {
    const [x, y] = points[index];
    const boxHeight = double ? points[index + 1][1] - y + height : height;
    return <g className="map-boundary"><rect x={x - 12} y={y - 25} width={width + 24} height={boxHeight + 36} rx="8" /><text x={x} y={y - 8}>{label}</text></g>;
  }

  return <svg className={`blueprint blueprint-${id}`} viewBox={compact ? "21 0 268 845" : "0 0 958 372"} aria-hidden="true">
    <defs>{(Object.keys(flows) as Flow[]).map(key => <marker key={key} id={`${id}-${key}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill={flows[key].color} /></marker>)}</defs>
    {boundary(1, "Application access")}
    {boundary(2, "LangGraph", true)}
    {boundary(5, "Cluster access")}
    {points.slice(0,-1).map(([x,y], i) => {
      const [nextX,nextY] = points[i+1];
      const kind = i < 2 ? "control" : "tool";
      const returning = i < 2 ? "control" : "evidence";
      if (x === nextX) {
        const center = x + width * (compact ? 0.78 : 0.5);
        return <g key={i}>
          {wire(`M${center-8} ${y+height}V${nextY-1}`, kind, "out")}
          {wire(`M${center+8} ${nextY}V${y+height+1}`, returning, "back")}
        </g>;
      }
      const forward = nextX > x;
      const start = forward ? x + width : x;
      const end = forward ? nextX : nextX + width;
      return <g key={i}>
        {wire(`M${start} ${y+32}H${end}`, kind, "out")}
        {wire(`M${end} ${y+54}H${start}`, returning, "back")}
      </g>;
    })}
    {!compact && <g className="map-annotations"><text x="286" y="130">response</text><text x="625" y="130">answer</text><text x="840" y="202">tool result</text></g>}
    {components.map(({ name, detail, extra, icon: Icon }, i) => {
      const [x,y] = points[i];
      return <g key={name} transform={`translate(${x} ${y})`}>
        <rect className={i === 2 || i === 3 ? "map-node agent-node" : "map-node"} width={width} height={height} rx="5" />
        <Icon x={14} y={14} width="20" height="20" color="#c0a170" strokeWidth="1.55" />
        <text x="43" y="31" className="node-name">{name}</text>
        <text x="15" y="56" className="node-detail">{detail}</text>
        {extra && <text x="15" y="74" className="node-detail">{extra}</text>}
      </g>;
    })}
  </svg>;
}

export function AiopsArchitecture() {
  return <figure className="system-map" aria-labelledby="architecture-heading">
    <figcaption><h2 id="architecture-heading">System architecture</h2><ul className="map-legend">{Object.entries(flows).map(([key,flow]) => <li key={key}><i style={{ borderColor: flow.color, borderTopStyle: key === "evidence" ? "dashed" : "solid" }} />{flow.label}</li>)}</ul></figcaption>
    <div className="blueprint-field"><Blueprint compact={false} /><Blueprint compact /></div>
    <p className="sr-only">FastAPI authenticates the operator and authorizes the namespace. LangGraph’s AgentNode selects a tool and ToolNode calls a read-only collector. The collector uses a ServiceAccount to query the Kubernetes API, which enforces RBAC. Evidence returns through the collector and ToolNode to AgentNode. AgentNode may call another tool or send its diagnosis through FastAPI to the operator.</p>
  </figure>;
}
