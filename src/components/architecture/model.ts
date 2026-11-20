export const flows = {
  event: { label: "Transaction event", color: "#aab8a8" },
  features: { label: "Feature vector", color: "#c0a170" },
  prediction: { label: "Prediction event", color: "#9fbea6", dashed: true },
  experiment: { label: "Training data / artifact", color: "#c0a170" },
  model: { label: "Configured model lookup", color: "#c0a170", dashed: true },
  automation: { label: "Pipeline stage", color: "#aab8a8" },
  request: { label: "Request", color: "#aab8a8" },
  tools: { label: "Tool call", color: "#c0a170" },
  evidence: { label: "Returning evidence", color: "#9fbea6", dashed: true },
  response: { label: "Response", color: "#cbcbb7", dashed: true },
  ingestion: { label: "Note processing", color: "#aab8a8" },
  indexing: { label: "Writes and note ID", color: "#c0a170" },
  semantic: { label: "Semantic search", color: "#9fbea6" },
  graph: { label: "Graph traversal", color: "#c0a170", dashed: true },
} as const;

export type Flow = keyof typeof flows;
export type Signal = "packet" | "note" | "vector" | "relations" | "passages";
export type Boundary = "application" | "kubernetes";
export type StoreMark = "rows" | "vector" | "relations";
type NodeKind = "client" | "service" | "agent" | "tool" | "store";
export type Node = { id: string; title: string; details: string[]; kind: NodeKind; mark?: StoreMark; boundary?: Boundary };
type Axis = "horizontal" | "vertical";
export type Edge = {
  id: string;
  from: string;
  to: string;
  flow: Flow;
  signal?: Signal;
  signalColor?: string;
  offset?: number;
  label?: string;
};
export type Box = [x: number, y: number, width: number, height: number];
export type Layout = {
  size: [width: number, height: number];
  boxes: Record<string, Box>;
  verticalTrack?: number;
  axes?: Record<string, Axis>;
  routes?: Record<string, { path: string; x: number; y: number; anchor: "start" | "middle" | "end" }>;
  hiddenLabels?: string[];
};
export type Diagram = {
  id: string;
  title: string;
  heading: "h2" | "h3";
  description: string;
  nodes: Node[];
  edges: Edge[];
  zones?: { label: string; nodes: string[] }[];
  layouts: Record<"wide" | "medium" | "narrow", Layout>;
  steps: { label: string; nodes: string[]; edges?: string[]; duration: number; signal?: Signal; together?: boolean; inspect?: Boundary }[];
};
