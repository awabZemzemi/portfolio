import { ArrowRight } from "lucide-react";

const stages = ["Design", "Build", "Deploy", "Observe"];

export function Workflow() {
  return (
    <section className="workflow" aria-labelledby="workflow-title">
      <h2 id="workflow-title" className="mono-label">Engineering workflow</h2>
      <ol className="stages" role="list">
        {stages.map((name, index) => (
          <li key={name}>
            <span>{name}</span>
            {index < stages.length - 1 && <ArrowRight className="stage-connector" size={14} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
