import type { Box, Diagram } from "./model";

const narrowPositions: [string, number, number][] = [
  ["operator", 46, 65], ["api", 172, 81], ["agent", 299, 65], ["tool", 405, 65],
  ["collector", 511, 81], ["kube", 638, 81], ["records", 761, 81],
];
const narrow = Object.fromEntries(narrowPositions.map(([id, y, height]): [string, Box] => [id, [25, y, 270, height]]));

export const aiopsDiagram: Diagram = {
  id: "investigation-architecture",
  title: "System architecture",
  heading: "h2",
  description: "FastAPI authenticates the operator and authorizes namespace access before LangGraph runs. Diagnostic tools use ServiceAccount credentials for read-only Kubernetes requests, where RBAC is enforced independently. Evidence returns through ToolNode to AgentNode. A diagnosis returns to the operator through FastAPI.",
  zones: [
    { label: "Client", nodes: ["operator"] },
    { label: "Application layer", nodes: ["api"] },
    { label: "Agent execution · LangGraph", nodes: ["agent", "tool", "collector"] },
    { label: "Infrastructure", nodes: ["kube", "records"] },
  ],
  nodes: [
    { id: "operator", title: "Operator", details: ["API client"], kind: "client" },
    { id: "api", title: "FastAPI", details: ["Bearer authentication", "Namespace authorization"], kind: "service", boundary: "application" },
    { id: "agent", title: "AgentNode", details: ["Select a tool or answer"], kind: "agent" },
    { id: "tool", title: "ToolNode", details: ["Dispatch the selected tool"], kind: "agent" },
    { id: "collector", title: "Diagnostic tools", details: ["Read-only collectors", "ServiceAccount credentials"], kind: "tool" },
    { id: "kube", title: "Kubernetes API", details: ["Enforce Kubernetes RBAC", "Namespace-scoped reads"], kind: "service", boundary: "kubernetes" },
    { id: "records", title: "Cluster evidence", details: ["Pod status · Logs · Events", "Metrics when available"], kind: "store" },
  ],
  edges: [
    { id: "request", from: "operator", to: "api", flow: "request", signalColor: "#c0a170", offset: -9, label: "POST" },
    { id: "invoke", from: "api", to: "agent", flow: "request", offset: -9, label: "invoke" },
    { id: "select", from: "agent", to: "tool", flow: "tools", offset: -9, label: "tool call" },
    { id: "dispatch", from: "tool", to: "collector", flow: "tools", offset: -9 },
    { id: "query", from: "collector", to: "kube", flow: "tools", offset: -9, label: "read" },
    { id: "read", from: "records", to: "kube", flow: "evidence", label: "Resource data" },
    { id: "evidence", from: "kube", to: "collector", flow: "evidence", offset: 9 },
    { id: "result", from: "collector", to: "tool", flow: "evidence", offset: 9 },
    { id: "resume", from: "tool", to: "agent", flow: "evidence", offset: 9 },
    { id: "diagnosis", from: "agent", to: "api", flow: "response", offset: 9 },
    { id: "response", from: "api", to: "operator", flow: "response", offset: 9 },
  ],
  layouts: {
    wide: {
      size: [1120, 375],
      boxes: {
        operator: [20, 52, 168, 80], api: [238, 52, 208, 80],
        agent: [506, 52, 250, 80], tool: [506, 165, 250, 68], collector: [506, 267, 250, 78],
        kube: [817, 267, 283, 78], records: [817, 143, 283, 78],
      },
    },
    medium: {
      size: [656, 546], hiddenLabels: ["read", "invoke"],
      boxes: {
        operator: [22, 48, 254, 80], api: [368, 48, 266, 80],
        agent: [22, 203, 254, 73], tool: [22, 321, 254, 73], collector: [22, 438, 254, 80],
        kube: [368, 438, 266, 80], records: [368, 307, 266, 80],
      },
      verticalTrack: .85,
      axes: { invoke: "vertical", diagnosis: "vertical" },
    },
    narrow: {
      size: [320, 867], boxes: narrow, verticalTrack: .85, hiddenLabels: ["read", "request", "invoke", "select", "query"],
    },
  },
  steps: [
    { label: "Investigation request", nodes: ["api"], edges: ["request"], duration: 480 },
    { label: "Bearer authentication and namespace authorization", nodes: ["api"], duration: 410, inspect: "application" },
    { label: "LangGraph selects and dispatches a diagnostic tool", nodes: ["agent", "tool", "collector"], edges: ["invoke", "select", "dispatch"], duration: 940 },
    { label: "The Kubernetes API authenticates the ServiceAccount and enforces RBAC", nodes: ["collector", "kube"], edges: ["query"], duration: 520, inspect: "kubernetes" },
    { label: "Pod status, logs, Events and available metrics return to the collector", nodes: ["records", "kube", "collector"], edges: ["read", "evidence"], duration: 740 },
    { label: "Evidence returns to AgentNode, which can request another tool call", nodes: ["agent"], edges: ["result", "resume"], duration: 800 },
    { label: "FastAPI returns the diagnosis to the operator", nodes: ["operator"], edges: ["diagnosis", "response"], duration: 760 },
  ],
};
