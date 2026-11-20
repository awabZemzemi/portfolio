import type { Diagram } from "./model";

export const sentinelSystem: Diagram = {
  id: "sentinel-system",
  title: "One project, two connected pipelines",
  heading: "h2",
  description: "Offline code trains Isolation Forest and registers a model in MLflow. Online Python workers replay transactions through Kafka, process feature events, and publish predictions. The dashed model lookup is configured in source but unverified end to end: the default model names differ and serving also requires local metadata.",
  zones: [
    { label: "Offline · MLOps repository", nodes: ["dataset", "prep", "train", "registry"] },
    { label: "Online · SentinelML repository", nodes: ["replay", "raw", "process", "features", "infer", "predictions"] },
  ],
  nodes: [
    { id: "dataset", title: "Training CSV", details: ["Transaction sample"], kind: "store" },
    { id: "prep", title: "Feature engineering", details: ["Batch transform"], kind: "tool" },
    { id: "train", title: "Train & evaluate", details: ["Isolation Forest", "Validation threshold"], kind: "tool" },
    { id: "registry", title: "MLflow registry", details: ["Runs + model versions"], kind: "store" },
    { id: "replay", title: "Transaction replay", details: ["CSV rows"], kind: "client" },
    { id: "raw", title: "Kafka", details: ["raw_events"], kind: "store" },
    { id: "process", title: "Feature worker", details: ["Flatten + normalize"], kind: "service" },
    { id: "features", title: "Kafka", details: ["features"], kind: "store" },
    { id: "infer", title: "Inference worker", details: ["Fixed registry version", "Local metadata"], kind: "service" },
    { id: "predictions", title: "Kafka", details: ["predictions"], kind: "store" },
  ],
  edges: [
    { id: "prepare", from: "dataset", to: "prep", flow: "experiment" },
    { id: "fit", from: "prep", to: "train", flow: "experiment" },
    { id: "register", from: "train", to: "registry", flow: "experiment" },
    { id: "lookup", from: "registry", to: "infer", flow: "model", label: "versioned lookup" },
    { id: "publish", from: "replay", to: "raw", flow: "event" },
    { id: "consume", from: "raw", to: "process", flow: "event" },
    { id: "transform", from: "process", to: "features", flow: "features" },
    { id: "score", from: "features", to: "infer", flow: "features" },
    { id: "result", from: "infer", to: "predictions", flow: "prediction" },
  ],
  layouts: {
    wide: {
      size: [1120, 430],
      boxes: {
        dataset: [20, 60, 200, 88], prep: [280, 60, 200, 88],
        train: [540, 60, 200, 88], registry: [860, 60, 240, 88],
        replay: [20, 300, 150, 90], raw: [205, 300, 150, 90],
        process: [390, 300, 150, 90], features: [575, 300, 150, 90],
        infer: [760, 300, 175, 90], predictions: [950, 300, 150, 90],
      },
    },
    medium: {
      size: [656, 760],
      hiddenLabels: ["lookup"],
      boxes: {
        dataset: [20, 60, 270, 85], prep: [20, 175, 270, 85],
        train: [20, 290, 270, 85], registry: [20, 405, 270, 85],
        replay: [366, 60, 270, 85], raw: [366, 175, 270, 85],
        process: [366, 290, 270, 85], features: [366, 405, 270, 85],
        infer: [366, 520, 270, 90], predictions: [366, 635, 270, 85],
      },
    },
    narrow: {
      size: [320, 1235],
      boxes: {
        dataset: [24, 60, 272, 80], prep: [24, 170, 272, 80],
        train: [24, 280, 272, 80], registry: [24, 390, 272, 80],
        replay: [24, 570, 272, 80], raw: [24, 680, 272, 80],
        process: [24, 790, 272, 80], features: [24, 900, 272, 80],
        infer: [24, 1010, 272, 90], predictions: [24, 1120, 272, 80],
      },
      hiddenLabels: ["lookup"],
      routes: {
        lookup: { path: "M24 430 H8 V1055 H24", x: 8, y: 750, anchor: "start" },
      },
    },
  },
  steps: [
    { label: "The offline pipeline prepares transaction features from CSV data.", nodes: ["dataset", "prep"], edges: ["prepare"], duration: 650 },
    { label: "Isolation Forest fits on normal rows and is evaluated on a mixed validation split.", nodes: ["train"], edges: ["fit"], duration: 750 },
    { label: "MLflow records the run and registers a model version.", nodes: ["registry"], edges: ["register"], duration: 650 },
    { label: "At startup, inference requests a configured model version and reads local feature metadata. The checked defaults do not yet align.", nodes: ["registry", "infer"], edges: ["lookup"], duration: 700 },
    { label: "A dataset row is replayed to Kafka raw_events.", nodes: ["replay", "raw"], edges: ["publish"], duration: 600 },
    { label: "The processing worker publishes a transformed event to Kafka features.", nodes: ["process", "features"], edges: ["consume", "transform"], duration: 750 },
    { label: "The inference worker scores the feature event and publishes to Kafka predictions.", nodes: ["infer", "predictions"], edges: ["score", "result"], duration: 750 },
  ],
};
