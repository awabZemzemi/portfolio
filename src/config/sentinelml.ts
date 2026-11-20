const runtime = "https://github.com/SentineMl/SentinelML";
const training = "https://github.com/SentineMl/MLOps";
const runtimeRevision = "76803222a737239db53e4b23a0bc4d9537807a7e";
const trainingRevision = "8013c870e2ee730de8c69f3b90d3e3f4f62f4032";
const notebookRevision = "bd74e7320340e049aad3ac5ca06dbc27bfc0ed49";
const runtimeFile = (path: string) => runtime + "/blob/" + runtimeRevision + "/" + path;
const trainingFile = (path: string) => training + "/blob/" + trainingRevision + "/" + path;

export const sentinelml = {
  id: "sentinelml",
  title: "SentinelML",
  subtitle: "Bank Transaction Anomaly Detection",
  url: "/projects/sentinelml",
  category: "MLOps · Streaming ML · Anomaly Detection",
  description: "A bank transaction anomaly detection project connecting offline Isolation Forest training and MLflow model management with Kafka-based streaming inference.",
  contribution: "I built components across Kafka-based transaction processing, Isolation Forest training and evaluation, MLflow tracking, and containerized inference.",
  technologies: ["Kafka", "Python", "MLflow", "Isolation Forest", "Docker", "Jenkins"],
  repository: runtime,
  repositories: [
    { label: "ML Training & MLOps", href: training },
    { label: "Streaming & Inference", href: runtime },
  ],
  evaluationSource: training + "/blob/" + notebookRevision + "/train.ipynb",
  modelSource: runtimeFile("services/inference_service/model.py"),
  containerSource: runtimeFile("services/inference_service/dockerfile"),
  results: [
    { label: "Test rows", value: "1,496,754", context: "Saved awab notebook classification report" },
    { label: "ROC-AUC", value: "0.875", context: "Saved test scores from a normal-only Isolation Forest" },
    { label: "Average precision", value: "0.678", context: "Reported as PR-AUC in the notebook" },
    { label: "Anomaly recall", value: "72%", context: "Class-1 recall at the notebook's model threshold" },
  ],
  decisions: [
    ["Two repositories, one model lifecycle", "MLOps contains feature engineering, training, MLflow tracking, and a separate registry-validation script. SentinelML contains transaction replay, Kafka workers, and inference. Both Compose stacks name the same MLflow network, but source alone does not verify a successful combined run."],
    ["Explicit model lookup", "The inference worker loads a fixed registry name and version once when it starts, then reads feature order and threshold from local JSON. The promotion script can set a champion alias, but serving does not resolve that alias or reload a model during its loop."],
    ["Kafka service boundaries", "The generator publishes raw_events, the processor publishes features, and inference publishes predictions. The three topics separate replay, transformation, and scoring without making FastAPI a hidden step in the event path."],
    ["Feature contract remains open", "Training fits scaling and categorical encoding on a batch before the split; the streaming processor transforms individual records differently. No fitted transform or feature-order artifact is published with the registered model in the inspected source."],
    ["Automation scope", "The public Jenkinsfile checks out source and installs worker dependencies. Training, validation, registry promotion, image deployment, and service restart are not Jenkins stages in the inspected repositories."],
  ] as const,
  stack: [
    ["Offline training", "Python · scikit-learn Isolation Forest · pandas"],
    ["Model management", "MLflow runs, metrics, model versions · PostgreSQL + object storage"],
    ["Streaming inference", "Kafka · Python workers · Pydantic events · PostgreSQL"],
    ["Packaging & automation", "Docker Compose · Jenkins checkout and dependency installation"],
  ],
  sources: [
    { label: "Saved historical evaluation", path: "MLOps · awab/train.ipynb", href: training + "/blob/" + notebookRevision + "/train.ipynb" },
    ...[
      ["Training and validation", "tracking/train_eval.py"],
      ["Offline feature engineering", "tracking/feature_eng.py"],
      ["MLflow model registration", "tracking/utils.py"],
      ["Registry validation and alias", "validation/validate_promote.py"],
      ["MLflow service and artifact store", "infra/mlflow/docker-compose/docker-compose.yml"],
    ].map(([label, path]) => ({ label, path: "MLOps · " + path, href: trainingFile(path) })),
    ...[
      ["Transaction replay", "services/event_generator_service/generator.py"],
      ["Feature processing", "services/data_process_service/main.py"],
      ["Streaming transformation", "services/data_process_service/data_processing.py"],
      ["Inference consumer and output", "services/inference_service/main.py"],
      ["Registry model lookup", "services/inference_service/model.py"],
      ["Serving configuration", "services/inference_service/config.py"],
      ["Jenkins stages", "Jenkinsfile"],
      ["Runtime topology", "infra/docker-compose.yaml"],
    ].map(([label, path]) => ({ label, path: "SentinelML · " + path, href: runtimeFile(path) })),
  ],
};
