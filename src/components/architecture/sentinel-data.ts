import type { Diagram } from "./model";

export const sentinelOnline: Diagram = {
  id: "sentinel-online", title: "Online transaction inference", heading: "h2",
  description: "The generator replays dataset transactions into Kafka. A worker transforms raw events into features, and a Python inference consumer loads an MLflow model to score them. Prediction events return to Kafka. The consumer also saves a score when a transaction ID is present.",
  nodes: [
    { id: "source", title: "Transaction replay", details: ["Dataset → events"], kind: "client" },
    { id: "raw", title: "Kafka", details: ["raw_events topic"], kind: "store" },
    { id: "process", title: "Process transaction", details: ["Normalize and flatten"], kind: "tool" },
    { id: "features", title: "Kafka", details: ["features topic"], kind: "store" },
    { id: "score", title: "Isolation Forest", details: ["Python consumer", "Score + threshold"], kind: "service" },
    { id: "output", title: "Kafka", details: ["predictions topic"], kind: "store" },
  ],
  edges: [
    { id: "publish", from: "source", to: "raw", flow: "event" },
    { id: "consume", from: "raw", to: "process", flow: "event" },
    { id: "features", from: "process", to: "features", flow: "features" },
    { id: "infer", from: "features", to: "score", flow: "features" },
    { id: "result", from: "score", to: "output", flow: "prediction" },
  ],
  layouts: {
    wide: { size: [1120, 330], boxes: { source: [20,35,280,80], raw: [420,35,280,80], process: [820,35,280,80], features: [820,210,280,80], score: [420,210,280,90], output: [20,210,280,80] } },
    medium: { size: [656,440], boxes: { source: [20,25,270,80], raw: [366,25,270,80], process: [366,175,270,80], features: [20,175,270,80], score: [20,325,270,90], output: [366,325,270,80] } },
    narrow: { size: [320,700], boxes: { source: [20,20,280,80], raw: [20,135,280,80], process: [20,250,280,80], features: [20,365,280,80], score: [20,480,280,90], output: [20,605,280,80] } },
  },
  steps: [
    { label: "A transaction from the dataset enters raw_events.", nodes: ["source","raw"], edges: ["publish"], duration: 650, signal: "note" },
    { label: "The processing worker consumes the transaction.", nodes: ["process"], edges: ["consume"], duration: 650, signal: "note" },
    { label: "Normalized features are published to the features topic.", nodes: ["features"], edges: ["features"], duration: 650, signal: "vector" },
    { label: "The inference consumer applies the registered Isolation Forest model and threshold.", nodes: ["score"], edges: ["infer"], duration: 850, signal: "vector" },
    { label: "The prediction producer emits the score, anomaly flag, and model identity.", nodes: ["output"], edges: ["result"], duration: 750, signal: "note" },
  ],
};

export const sentinelLifecycle: Diagram = {
  id: "sentinel-lifecycle", title: "Training, tracking, and packaging", heading: "h2",
  description: "The training script reads CSV data, engineers features, fits Isolation Forest, and logs evaluation and artifacts to MLflow. A separate delivery track shows Jenkins preparing dependencies and Docker packaging workers. These are independently implemented responsibilities.",
  zones: [{ label: "Model experiment", nodes: ["data","train","track"] }, { label: "Service preparation", nodes: ["checkout","install","docker"] }],
  nodes: [
    { id: "data", title: "Training data", details: ["CSV + preprocessing"], kind: "store" },
    { id: "train", title: "Train & evaluate", details: ["Isolation Forest", "Validation threshold"], kind: "tool" },
    { id: "track", title: "MLflow", details: ["Parameters + metrics", "Registered artifact"], kind: "store" },
    { id: "checkout", title: "Jenkins checkout", details: ["checkout scm"], kind: "service" },
    { id: "install", title: "Dependencies", details: ["venv + pip install"], kind: "tool" },
    { id: "docker", title: "Docker workers", details: ["Dockerfiles + Compose", "Separate build operation"], kind: "service" },
  ],
  edges: [
    { id: "prepare", from: "data", to: "train", flow: "experiment" },
    { id: "log", from: "train", to: "track", flow: "experiment" },
    { id: "setup", from: "checkout", to: "install", flow: "automation" },
  ],
  layouts: {
    wide: { size: [1120,350], boxes: { data: [20,45,300,85], train: [410,45,300,85], track: [800,45,300,85], checkout: [20,235,300,85], install: [410,235,300,85], docker: [800,235,300,85] } },
    medium: { size: [656,560], boxes: { data: [20,45,270,85], train: [20,230,270,85], track: [20,415,270,95], checkout: [366,45,270,85], install: [366,230,270,85], docker: [366,415,270,95] } },
    narrow: { size: [320,795], boxes: { data: [20,45,280,85], train: [20,170,280,85], track: [20,295,280,95], checkout: [20,460,280,85], install: [20,575,280,85], docker: [20,690,280,85] } },
  },
  steps: [
    { label: "Preprocessed CSV features feed training and validation.", nodes: ["train"], edges: ["prepare"], duration: 1000, signal: "vector" },
    { label: "MLflow receives experiment metrics and a registered model artifact.", nodes: ["track"], edges: ["log"], duration: 1000, signal: "note" },
    { label: "Separately, Jenkins checks out the source and installs service dependencies.", nodes: ["install"], edges: ["setup"], duration: 1000 },
    { label: "Dockerfiles and Compose define packaging and service wiring independently of the Jenkins stages.", nodes: ["docker"], duration: 700 },
  ],
};
