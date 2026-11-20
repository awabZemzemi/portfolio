import { StudyReveal } from "./study-reveal";
import capture from "../../docs/aiops-demo/evidence.json";

export function AiopsEvidence() {
  const request = capture.stages.find(stage => stage.id === "request");
  const tools = capture.stages.find(stage => stage.id === "tools");
  const snapshot = capture.stages.find(stage => stage.id === "evidence");
  const interpretation = capture.stages.find(stage => stage.id === "interpretation");
  const result = capture.stages.find(stage => stage.id === "result");
  const container = snapshot?.containers?.[0];
  const { pod, namespace } = capture.scenario.target;
  if (!request?.body || !tools?.collectors || !snapshot?.pod || !container || !interpretation || !result) {
    throw new Error("The AIOps demonstration is missing a required evidence stage.");
  }

  return (
    <section className="content-section" id="demonstration" aria-labelledby="demo-title">
      <p className="section-kicker mono-label">Captured Kind lab evidence</p>
      <h2 id="demo-title">{capture.title}</h2>
      <p className="section-copy demo-intro">
        The diagnostic CLI collected this snapshot from <code>{namespace}/{pod}</code>, a deliberately failing Pod.
        The request below is an example. The interpretation comes from reviewing the manifest and collector output.
      </p>
      <StudyReveal className="evidence-grid">
        <div className="evidence-facts">
          <p className="mono-label section-kicker">Observed Pod state</p>
          <p className="evidence-reason"><code>{container.state.reason}</code></p>
          <dl>
            <div><dt>Pod phase</dt><dd>{snapshot.pod.phase}</dd></div>
            <div><dt>Container ready</dt><dd>{container.ready ? "Yes" : "No"}</dd></div>
            <div><dt>Previous exit code</dt><dd>{container.previous_termination.exit_code}</dd></div>
            <div><dt>Restart count at capture</dt><dd>{container.restart_count.toLocaleString("en-US")}</dd></div>
          </dl>
        </div>
        <div className="evidence-records">
          <h3>Previous container logs</h3>
          <pre tabIndex={0} aria-label="Captured previous container log excerpt"><code>{container.logs.previous?.lines.join("\n")}</code></pre>
          <h3>Kubernetes Events</h3>
          <ul role="list" className="evidence-events">
            {snapshot.events?.map(event => <li key={event.reason}><code>{event.type}</code><span>{event.reason}</span><span>{event.count} reported</span></li>)}
          </ul>
          <p className="evidence-note">{result.summary}</p>
        </div>
      </StudyReveal>
      <div className="evidence-interpretation">
        <h3>Human interpretation</h3>
        <p>{interpretation.summary}</p>
      </div>
      <div className="evidence-details">
        <details>
          <summary>Example investigation request</summary>
          <p className="evidence-note">Requires an authenticated account with access to the requested namespace.</p>
          <pre tabIndex={0}><code>{request.method} {request.path}{"\n\n"}{JSON.stringify(request.body, null, 2)}</code></pre>
        </details>
        <details>
          <summary>Collectors executed during the capture</summary>
          <p className="evidence-note">{tools.execution} The agent adapters are listed for reference.</p>
          <dl className="evidence-collectors">
            {tools.collectors.map(collector => <div key={collector.function}><dt><code>{collector.function}</code></dt><dd><code>{collector.agentTool}</code></dd></div>)}
          </dl>
        </details>
      </div>
    </section>
  );
}

export function AiopsValidation() {
  const { offlineSuite, liveIntegration } = capture.verification;
  return (
    <section className="section-row" aria-labelledby="validation-title">
      <h2 id="validation-title">Validation</h2>
      <div className="study-decisions">
        <div><h3>Kind integration</h3><p>The opt-in <code>test_crash_demo</code> test {liveIntegration.status} against the existing lab. It verifies that the restricted collector returns a serializable report for the target Pod and includes its container logs.</p></div>
        <div><h3>Permission checks</h3><p>The lab ServiceAccount could read Pod logs in <code>aiops</code>. Kubernetes denied Pod deletion in that namespace and Pod listing in <code>default</code>.</p></div>
        <div><h3>Offline suite and CI</h3><p>{offlineSuite.passed} offline tests passed in the audited run, with the live test executed separately. Coverage includes graph routing, authorization, error responses, log redaction, and Helm RBAC templates. GitHub Actions runs the offline checks.</p></div>
      </div>
    </section>
  );
}
