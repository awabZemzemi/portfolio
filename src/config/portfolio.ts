import { secondBrain } from "./second-brain";
import { aiops } from "./aiops";
import { sentinelml } from "./sentinelml";

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  technologies: string[];
  piece: "rook" | "knight" | "pawn";
  preview: ProjectPreview;
}

type FlowNode = { title: string; detail: string };
export type ProjectPreview =
  | { kind: "flow"; title: string; nodes: [FlowNode, FlowNode, FlowNode, FlowNode] }
  | { kind: "knowledge-graph"; title: string };

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  highlights?: string[];
  technologies?: string[];
}

interface PersonalLinks {
  email?: string;
  github?: string;
  linkedin?: string;
  /** File path relative to public/, beginning with a slash. */
  cv?: `/${string}.pdf`;
}

export const profile = {
  name: "Awab Zemzemi",
  eyebrow: "AI engineering · Software systems",
  introduction: "I’m a final-year engineering student at INSAT. I build AI agents, retrieval systems, and the Python services and infrastructure that run them.",
  about: [
    "I study Computer Networks and Telecommunications at INSAT and build AI agents and LLM applications. My work connects retrieval and model inference with the backend services that make them usable.",
    "I’ve worked on document processing, GPU-hosted inference, and Kubernetes infrastructure. I’m interested in making those systems reliable and maintainable, from validating model output to tracing failures after deployment.",
  ],
};

export const links: PersonalLinks = {
  email: "awab.zemzemi@insat.ucar.tn",
  github: "https://github.com/awabZemzemi",
  linkedin: "https://www.linkedin.com/in/zemzemi-awab-626370234/",
  cv: "/cv.pdf",
};

export const projects: Project[] = [
  {
    id: aiops.id,
    url: aiops.url,
    title: aiops.title,
    category: "Infrastructure diagnostics",
    description: "Investigates Kubernetes failures with a LangGraph tool loop, read-only evidence collection, and namespace-scoped access.",
    technologies: ["Kubernetes", "LangGraph", "FastAPI", "RBAC"],
    piece: "rook",
    preview: {
      kind: "flow",
      title: "Investigation flow",
      nodes: [
        { title: "FastAPI", detail: "Authorize namespace" },
        { title: "LangGraph", detail: "Select a tool" },
        { title: "Diagnostic tools", detail: "Collect evidence" },
        { title: "Kubernetes", detail: "Enforce read-only RBAC" },
      ],
    },
  },
  {
    id: secondBrain.id,
    url: secondBrain.url,
    title: "Second Brain",
    category: "Knowledge retrieval",
    description: "Retrieves related note passages and explicit relationships. LangGraph combines both sources into context for the answer.",
    technologies: ["GraphRAG", "LangGraph", "Neo4j", "ChromaDB"],
    piece: "knight",
    preview: { kind: "knowledge-graph", title: "Knowledge graph schema" },
  },
  {
    id: sentinelml.id,
    url: sentinelml.url,
    title: sentinelml.title,
    category: "Machine learning · Streaming",
    description: "Streams transactions through Kafka, scores anomalies with Isolation Forest, and tracks model experiments in MLflow.",
    technologies: ["Kafka", "Isolation Forest", "MLflow", "Jenkins"],
    piece: "pawn",
    preview: {
      kind: "flow",
      title: "Transaction scoring pipeline",
      nodes: [
        { title: "Transactions", detail: "Dataset replay" },
        { title: "Kafka", detail: "Raw event stream" },
        { title: "Features", detail: "Process and publish" },
        { title: "Inference", detail: "Score → predictions" },
      ],
    },
  },
];

export const experience: Experience[] = [
  {
    id: "bit-and-books",
    organization: "Bit&Books Inc.",
    role: "AI Intern",
    period: "July–August 2026",
    location: "Remote — Ottawa, Canada",
    highlights: [
      "Built a PaddleOCR-VL and LLM pipeline that converts invoices and receipts into bookkeeping transactions, recovers missing fields and line items, and checks arithmetic and totals.",
      "Used BGE-M3 and Qdrant to retrieve Chart of Accounts candidates, then used an LLM to select the account and flag uncertain classifications.",
      "Deployed vLLM inference on RunPod GPUs and wired it into a Python backend with a task queue and parallel workers. Processed 1,880 document-processing items during the internship.",
    ],
    technologies: ["Python", "FastAPI", "PaddleOCR-VL", "BGE-M3", "Qdrant", "vLLM", "RunPod"],
  },
  {
    id: "kian",
    organization: "KIAN Technology",
    role: "DevOps Intern",
    period: "July–August 2025",
    location: "Tunis, Tunisia",
    highlights: [
      "Deployed Wazuh on DigitalOcean Kubernetes for security monitoring and integrated Falco DaemonSets for webhook-based runtime alerts.",
      "Automated infrastructure provisioning with Terraform.",
    ],
    technologies: ["Kubernetes", "Wazuh", "Falco", "Terraform", "DigitalOcean"],
  },
  {
    id: "actia",
    organization: "ACTIA",
    role: "Mobile & Web Development Intern",
    period: "July–August 2024",
    location: "Tunis, Tunisia",
    highlights: [
      "Developed an e-bike battery monitoring app and battery-health dashboard using Flutter, Flask, and Firebase.",
      "Automated builds with Docker and Jenkins CI/CD.",
    ],
    technologies: ["Flutter", "Python", "Flask", "Firebase", "Docker", "Jenkins"],
  },
];

export const education: Experience[] = [
  {
    id: "insat",
    organization: "National Institute of Applied Sciences and Technology (INSAT)",
    role: "Engineering Degree in Computer Networks and Telecommunications",
    period: "Expected graduation 2027",
    location: "Tunis, Tunisia",
    technologies: ["Machine Learning and Deep Learning", "Software Architecture", "Microservices", "Cloud Computing"],
  },
];
