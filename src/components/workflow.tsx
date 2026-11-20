import { Activity, ArrowRight, Code2, DraftingCompass, Layers3, Upload } from "lucide-react";

const stages = [
  { name: "Design", icon: DraftingCompass },
  { name: "Build", icon: Code2 },
  { name: "Deploy", icon: Upload },
  { name: "Observe", icon: Activity },
];

export function Workflow() {
  return (
    <section className="workflow" aria-labelledby="workflow-title">
      <h2 id="workflow-title" className="mono-label flex items-center gap-2"><Layers3 size={15} aria-hidden="true" /> Engineering workflow</h2>
      <ol className="stages">
        {stages.map(({ name, icon: Icon }, index) => (
          <li key={name}>
            <span className="stage-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span>
            <span>{name}</span>
            {index < stages.length - 1 && <span className="connector" aria-hidden="true"><ArrowRight size={13} /></span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
