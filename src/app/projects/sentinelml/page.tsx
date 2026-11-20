import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { StudyOverview, StudyDecisions, StudySources } from "@/components/study-overview";
import { StudyReveal } from "@/components/study-reveal";
import { ArchitecturePlayer } from "@/components/architecture/architecture-player";
import { sentinelOnline, sentinelLifecycle } from "@/components/architecture/sentinel-data";
import { sentinelml as project } from "@/config/sentinelml";
import { profile, education, experience } from "@/config/portfolio";
import { siteOrigin } from "@/config/site";
import "../study.css";
import "./sentinel.css";

const title = `${project.title} — ${profile.name}`;
export const metadata: Metadata = {
  title, description: project.description,
  alternates: siteOrigin ? { canonical: project.url } : undefined,
  openGraph: { title, description: project.description, type: "article", url: siteOrigin ? project.url : undefined },
  twitter: { card: "summary", title, description: project.description },
};

export default function SentinelStudy() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation hasProjects hasExperience={Boolean(education.length || experience.length)} projectPage />
    <main id="main" className="shell study sentinel-study" tabIndex={-1}>
      <StudyOverview title={project.title} category={project.category} objective={project.description} technologies={project.technologies} contribution={project.contribution} repository={project.repository}>
        <p className="sentinel-subtitle">{project.subtitle}</p>
      </StudyOverview>
      <section className="section-row">
        <h2>The engineering problem</h2>
        <div className="section-copy space-y-4">
          <p>Transactions arrive individually, while training operates on a dataset. Kafka separates event ingestion from feature processing and scoring so each responsibility has its own consumer boundary. The model becomes a service dependency with a version, feature contract, and decision threshold.</p>
          <p>Evaluating rare anomalies requires examining missed anomalies and false positives together. Reproducibility also depends on retaining model parameters, evaluation metrics, and artifacts alongside the preprocessing used for training.</p>
        </div>
      </section>
      <ArchitecturePlayer diagram={sentinelOnline} />
      <ArchitecturePlayer diagram={sentinelLifecycle} />
      <section className="content-section" aria-labelledby="evaluation-title">
        <p className="section-kicker mono-label">Reported offline evaluation</p>
        <h2 id="evaluation-title">Detection quality across 1,496,754 samples</h2>
        <p className="section-copy demo-intro">These rounded values match the saved classification report and scoring output in the project’s awab branch notebook. They describe an offline Isolation Forest experiment. The dataset was unavailable for an independent rerun.</p>
        <dl className="sentinel-metrics">{project.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd><dd className="metric-description">{metric.detail}</dd></div>)}</dl>
        <div className="section-copy space-y-4">
          <p>For uncommon anomalies, precision reveals how many flagged transactions are truly positive. Recall reveals how many positives are recovered. The reported anomaly-class precision is 54%, with F1 of 0.62. These figures describe offline evaluation at a chosen threshold.</p>
          <p>The corresponding notebook cell fits Isolation Forest on normal training rows with 100 estimators, contamination of 0.15, and max_samples of 10,000. Its saved output reports ROC-AUC of 0.875180901405904 and average precision of 0.6775719032274893. The current training script uses a separate configuration and validation-threshold procedure.</p>
        <p>The saved notebook includes is_fraud in its displayed feature selection and scales features before splitting. Its stored output therefore needs a clean rerun with the label excluded from inputs and preprocessing fitted on training data before it can support a generalization claim.</p>
          <a className="editorial-link" href={project.evaluationSource}>Inspect the saved evaluation notebook</a>
        </div>
      </section>
      <StudyDecisions items={project.decisions} />
      <section className="content-section" aria-labelledby="evidence-title">
        <p className="section-kicker mono-label">Implementation evidence</p>
        <h2 id="evidence-title">From a feature vector to a prediction event</h2>
        <p className="section-copy demo-intro">Source excerpts show the scoring operation and the container entry point. The event contract carries timestamp, anomaly_score, is_anomaly, model_name, and model_version.</p>
        <StudyReveal className="evidence-grid">
          <div><h3>Score and threshold</h3><pre><code>{`raw_score = self.model.decision_function(x)[0]
anomaly_score = float(-raw_score)
is_anomaly = anomaly_score >= self.threshold`}</code></pre><p className="section-copy">Features are ordered using local metadata before the model runs. Higher negated decision scores indicate more anomalous transactions.</p><a className="editorial-link" href={project.sources[4].href}>Read the scoring implementation</a></div>
          <div><h3>Worker entry point</h3><pre><code>{`CMD ["python","main.py"]`}</code></pre><p className="section-copy">The container starts a Kafka consumer. Its loop publishes prediction events and conditionally persists scores with transaction identifiers.</p><a className="editorial-link" href={project.sources[6].href}>Read the Dockerfile</a></div>
        </StudyReveal>
      </section>
      <section className="section-row">
        <h2>Implementation boundaries</h2>
        <div className="section-copy space-y-4">
          <p>The project brief describes FastAPI integration and retraining automation. The inspected public runtime uses a Python Kafka worker, and its Jenkinsfile stops after dependency installation. The diagrams follow those source files. FastAPI serving and Jenkins-triggered retraining remain unverified.</p>
          <p>Training and streaming use different preprocessing paths. The serving code also requires local feature metadata, and the prediction schema constrains anomaly scores to nonnegative values although a negated decision function can be negative. These integration details require runtime validation before claiming successful end-to-end execution.</p>
        </div>
      </section>
      <section className="section-row"><h2>Technology stack</h2><dl className="study-stack">{project.stack.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      <StudySources sources={project.sources} />
      <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link></footer>
    </main>
  </>;
}
