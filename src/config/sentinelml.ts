const runtime = "https://github.com/SentineMl/SentinelML";
const training = "https://github.com/SentineMl/MLOps";
const runtimeRevision = "76803222a737239db53e4b23a0bc4d9537807a7e";
const trainingRevision = "8013c870e2ee730de8c69f3b90d3e3f4f62f4032";

export const sentinelml = {
  id: "sentinelml",
  title: "SentinelML",
  subtitle: "Real-Time Bank Transaction Anomaly Detection",
  url: "/projects/sentinelml",
  category: "Machine learning · MLOps · Streaming systems",
  description: "A transaction-streaming system that turns Kafka events into Isolation Forest anomaly scores, with MLflow experiment tracking and Docker service packaging.",
  contribution: "My project connects transaction processing, anomaly detection, experiment tracking, and service packaging across an online pipeline and an offline model lifecycle.",
  technologies: ["Python", "Apache Kafka", "scikit-learn", "MLflow", "Jenkins", "Docker"],
  repository: runtime,
  evaluationSource: "https://github.com/SentineMl/MLOps/blob/bd74e7320340e049aad3ac5ca06dbc27bfc0ed49/train.ipynb",
  metrics: [
    { value: "0.875", label: "ROC-AUC", detail: "Measures how well anomaly scores rank positive examples above negative examples across thresholds." },
    { value: "0.678", label: "PR-AUC", detail: "Summarizes precision and recall. The training script calculates average precision, which it logs as pr_auc." },
    { value: "72%", label: "Anomaly recall", detail: "The reported share of labeled anomalies detected at the selected threshold." },
  ],
  decisions: [
    ["Separate raw events and features", "Kafka topics separate transaction replay, feature processing, and scoring. The processing worker publishes a timestamped features envelope. Its consumer commits offsets after attempting publication, while inference enables automatic commits. Delivery and failure handling need to be assessed at each stage."],
    ["Versioned model loading", "The inference worker loads an explicit MLflow registry model version and reads feature order and threshold from local metadata. This makes model selection explicit, while keeping metadata aligned with the selected model is an integration responsibility."],
    ["Normal-only model fitting", "The training script fits Isolation Forest on normal transactions and evaluates on a mixed validation split. It chooses a threshold by validation F1. The feature transform is fitted before the split, and threshold selection shares the evaluation data, so an independent test set would be needed for a stronger generalization estimate."],
    ["Tracking and packaging boundaries", "MLflow receives parameters, metrics, and the registered model artifact. Dockerfiles package the workers and Compose wires the services together. The checked Jenkinsfile contains checkout and dependency-installation stages. The separate validation script can set a champion alias, while serving loads a configured version."],
  ] as const,
  stack: [
    ["Streaming", "Apache Kafka · raw_events, features, predictions"],
    ["Inference", "Python consumer · Pydantic event validation"],
    ["Machine learning", "scikit-learn Isolation Forest · pandas · NumPy"],
    ["Experiment tracking", "MLflow runs, metrics, artifacts, and model registry"],
    ["Automation & packaging", "Jenkins checkout and dependency installation · Docker Compose"],
  ],
  sources: [
    { label: "Saved evaluation output", path: "awab/train.ipynb", href: "https://github.com/SentineMl/MLOps/blob/bd74e7320340e049aad3ac5ca06dbc27bfc0ed49/train.ipynb" },
    ...[
      ["Transaction replay", "services/event_generator_service/generator.py"],
      ["Feature processing loop", "services/data_process_service/main.py"],
      ["Inference and output handling", "services/inference_service/main.py"],
      ["Model loading and scoring", "services/inference_service/model.py"],
      ["Prediction schema", "services/inference_service/schema.py"],
      ["Worker packaging", "services/inference_service/dockerfile"],
      ["Service topology", "infra/docker-compose.yaml"],
      ["Jenkins stages", "Jenkinsfile"],
    ].map(([label, path]) => ({ label, path, href: `${runtime}/blob/${runtimeRevision}/${path}` })),
    ...[
      ["Training and evaluation method", "tracking/train_eval.py"],
      ["MLflow logging", "tracking/utils.py"],
      ["Registry validation script", "validation/validate_promote.py"],
    ].map(([label, path]) => ({ label, path, href: `${training}/blob/${trainingRevision}/${path}` })),
  ],
};
