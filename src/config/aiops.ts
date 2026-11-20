const repository = "https://github.com/awabZemzemi/AiOps";
const revision = "908de7bc865b110278272548dfad24280657fb1b";
const overview = "An AI-powered Kubernetes diagnostic system that uses LangGraph to investigate infrastructure failures through controlled, read-only tool calls.";

export const aiops = {
  id: "aiops-agent",
  url: "/projects/aiops-agent",
  title: "Autonomous AIOps Agent",
  subtitle: "Intelligent Kubernetes Diagnostics",
  category: "Agentic AI · Kubernetes",
  description: overview,
  technologies: ["LangGraph", "FastAPI", "Kubernetes", "Python", "RBAC"],
  repository,
  contribution: "I developed the LangGraph investigation workflow, diagnostic collectors, and FastAPI integration, including namespace authorization and restricted Kubernetes access.",
  purpose: overview,
  problem: "A Pod’s status can tell an operator that a container is restarting. The reason may be in the previous container’s logs, a Kubernetes Event, or a resource limit. Investigating by hand means moving between APIs and matching records to the same Pod and container. The engineering challenge is to bring those observations together while keeping a suspected cause distinct from a confirmed symptom.",
  decisions: [
    ["Two authorization boundaries", "FastAPI checks the operator’s permitted namespaces before collection. Kubernetes independently limits the ServiceAccount to specific read verbs through a RoleBinding. The two checks protect different identities and are configured separately."],
    ["Bounded evidence", "Current and previous logs use both a line limit and a per-stream byte limit. Events and Pod listing are bounded, and missing metrics remain an explicit collection error. The caller can use partial evidence without treating a missing observation as proof."],
    ["A tool loop with a step limit", "LangGraph routes model tool calls to ToolNode, appends their results to message state, and permits another tool call or a final answer. The graph step limit prevents repeated calls from running indefinitely. It can also cut short a difficult investigation."],
    ["Correlatable failures", "The response pairs an investigation ID with the answer and counts derived from structured tool messages. The ID joins private operations and message logs. An error late in the graph retains earlier evidence, and the HTTP response uses safe failure text."],
  ] as const,
  sources: [
    ["Investigation API and response handling", "backend/investigations/routes.py"],
    ["Application authorization", "backend/auth/dependencies.py"],
    ["LangGraph tool loop", "agent/graph.py"],
    ["Read-only Role and RoleBinding", "deploy/aiops/manifests/aiops-agent-rbac.yaml"],
    ["CrashLoopBackOff fixture", "deploy/test-lab/manifests/crash-pod.yaml"],
    ["Offline test workflow", ".github/workflows/ci.yml"],
  ].map(([label, path]) => ({ label, path, href: `${repository}/blob/${revision}/${path}` })),
  stack: [
    ["AI", "LangGraph, LangChain"], ["Backend", "Python, FastAPI"], ["Infrastructure", "Kubernetes, Kind, Helm"],
    ["Security", "API authorization, Kubernetes RBAC"], ["Engineering", "Python unittest, GitHub Actions"],
  ],
};
