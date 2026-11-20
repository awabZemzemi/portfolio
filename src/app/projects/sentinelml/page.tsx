import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { StudyOverview, StudyDecisions, StudySources } from "@/components/study-overview";
import { StudyReveal } from "@/components/study-reveal";
import { ArchitecturePlayer } from "@/components/architecture/architecture-player";
import { sentinelSystem } from "@/components/architecture/sentinel-data";
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
      <StudyOverview title={project.title} category={project.category} objective={project.description} objectiveLabel="Project purpose" technologies={project.technologies} contribution={project.contribution} repository={project.repository} repositories={project.repositories}>
        <p className="sentinel-subtitle">{project.subtitle}</p>
        <div className="sentinel-pipelines" aria-label="Two connected pipelines">
          <div><span className="mono-label">01 / Offline</span><p>Prepare transaction features, train and evaluate an Isolation Forest, then record a versioned model in MLflow.</p></div>
          <div><span className="mono-label">02 / Online</span><p>Replay transactions through Kafka, transform each event, load a configured registry version, and publish prediction events.</p></div>
        </div>
      </StudyOverview>
      <section className="section-row">
        <h2>The engineering problem</h2>
        <div className="section-copy space-y-4">
          <p>Model development and transaction scoring run on different data paths. The offline path needs repeatable experiments and a model version; the streaming path needs a compatible feature vector, decision threshold, and reliable event handoff.</p>
          <p>SentinelML separates these responsibilities across two repositories. The architecture below follows the checked source. Its model handoff is configured, but the published defaults and metadata do not yet establish a verified end-to-end run.</p>
        </div>
      </section>
      <ArchitecturePlayer diagram={sentinelSystem} />
      <section className="section-row">
        <h2>Offline Training &amp; Model Lifecycle</h2>
        <div className="section-copy space-y-4">
          <p>The <a href={project.repositories[0].href}>MLOps repository</a> samples a transaction CSV, derives time and transaction features, and fits an Isolation Forest on normal training rows. Its training script uses a stratified 80/20 train and validation split after feature preparation, then selects a decision threshold against the mixed validation set.</p>
          <p>The script logs model parameters and validation metrics to an MLflow run, saves a local joblib file, and registers a scikit-learn model version. A separate validation script can tag a candidate and set a <code>champion</code> alias. That script is not invoked by the checked Jenkins pipeline, and its comparison of an existing champion reads <code>f1</code> while training logs <code>f1_score</code>.</p>
          <p>The feature transform fits a scaler and category encoding before the split. No fitted scaler, encoder, or feature-order manifest is logged with the registered model. The validation metrics therefore need a leakage-safe rerun before they can be treated as held-out generalization results.</p>
        </div>
      </section>
      <section className="section-row">
        <h2>Online Transaction Inference</h2>
        <div className="section-copy space-y-4">
          <p>The <a href={project.repositories[1].href}>SentinelML repository</a> implements a CSV event generator that publishes to Kafka <code>raw_events</code>. A Python processing worker consumes those events, transforms fields, and publishes feature events to <code>features</code>. A separate inference worker consumes <code>features</code>, scores them, and publishes prediction events to <code>predictions</code>. It also writes a score to PostgreSQL when a transaction ID is present.</p>
          <p>In the inspected runtime, these are Kafka consumers and producers. The worker does not call a FastAPI endpoint, and no FastAPI service was found in the checked source. The CV documents a FastAPI-based pipeline, but this public revision does not substantiate that detail.</p>
        </div>
      </section>
      <section className="section-row">
        <h2>Model handoff &amp; feature contract</h2>
        <div className="section-copy space-y-4">
          <p>At worker startup, <code>IsolationForestModel.__init__</code> loads <code>models:/&lt;name&gt;/&lt;version&gt;</code> from MLflow and reads a local JSON file for feature order and threshold. It keeps that model in memory for the consumer loop; the configured alias is unused, and the worker has no model reload path.</p>
          <p>The training script registers <code>FraudDetectionModel_Champion</code>, while serving defaults to <code>fraud-isolation-forest</code> version <code>1</code>. Both Compose stacks configure a shared MLflow network, but the names differ and the required metadata file is absent from the checked runtime repository. Model selection and deployment still require configuration and integration validation.</p>
          <p>The streaming processor also builds features differently from the batch transform. Serving zero-fills missing named features using local metadata; it does not reuse the offline fitted scaler or category mapping. This prevents a claim that training and serving have a guaranteed matching feature contract.</p>
        </div>
      </section>
      <section className="content-section" aria-labelledby="evaluation-title">
        <p className="section-kicker mono-label">Saved notebook output · historical</p>
        <h2 id="evaluation-title">Evaluation evidence, with its limits</h2>
        <p className="section-copy demo-intro">The <code>awab</code> branch notebook stores results from an Isolation Forest experiment. These are the CV figures, but the dataset was unavailable for an independent rerun and the saved notebook does not support a clean generalization claim.</p>
        <div className="sentinel-results-scroll"><table className="sentinel-results"><caption className="sr-only">Historical notebook results and evaluation context</caption><thead><tr><th scope="col">Measure</th><th scope="col">Saved value</th><th scope="col">Context</th></tr></thead><tbody>{project.results.map(result => <tr key={result.label}><th scope="row">{result.label}</th><td>{result.value}</td><td>{result.context}</td></tr>)}</tbody></table></div>
        <div className="section-copy space-y-4">
          <p>The same saved classification report shows anomaly-class precision of 54% and F1 of 0.62. Its displayed feature selection includes <code>is_fraud</code> in the input matrix, and scaling happens before the train/test split. The 1,496,754 rows are the notebook’s reported test set, not a verified deployment result. The current training script uses a different train/validation procedure, so these values should not be attributed to its registered model.</p>
          <a className="editorial-link" href={project.evaluationSource}>Inspect the saved evaluation notebook</a>
        </div>
      </section>
      <StudyDecisions items={project.decisions} />
      <section className="content-section" aria-labelledby="evidence-title">
        <p className="section-kicker mono-label">Implementation evidence</p>
        <h2 id="evidence-title">From a feature vector to a prediction event</h2>
        <p className="section-copy demo-intro">These source excerpts show the scoring operation and the worker entry point. They describe implementation, not a captured end-to-end execution.</p>
        <StudyReveal className="evidence-grid">
          <div><h3>Score and threshold</h3><pre><code>{`raw_score = self.model.decision_function(x)[0]
anomaly_score = float(-raw_score)
is_anomaly = anomaly_score >= self.threshold`}</code></pre><p className="section-copy">The model orders inputs with local metadata before scoring. The prediction schema requires a nonnegative anomaly score, although the negated decision function can be negative; this path needs runtime validation.</p><a className="editorial-link" href={project.modelSource}>Read the scoring implementation</a></div>
          <div><h3>Worker entry point</h3><pre><code>{`CMD ["python","main.py"]`}</code></pre><p className="section-copy">The container starts a Kafka consumer. Its loop publishes prediction events and conditionally persists scores associated with transaction IDs.</p><a className="editorial-link" href={project.containerSource}>Read the Dockerfile</a></div>
        </StudyReveal>
      </section>
      <section className="section-row">
        <h2>Automation &amp; validation boundary</h2>
        <div className="section-copy space-y-4">
          <p>The public Jenkinsfile performs checkout and installs the three worker services’ Python dependencies. It does not train, evaluate, register, promote, deploy, or restart a model. The CV documents retraining automation, but those steps cannot be verified from the inspected Jenkinsfiles and scripts.</p>
          <p>The repositories establish training, model registration, registry lookup, and Kafka scoring components. A successful combined execution, a matching deployed feature schema, and an automatically promoted or reloaded model remain unverified.</p>
        </div>
      </section>
      <section className="section-row"><h2>Technology stack</h2><dl className="study-stack">{project.stack.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      <StudySources sources={project.sources} />
      <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link></footer>
    </main>
  </>;
}
