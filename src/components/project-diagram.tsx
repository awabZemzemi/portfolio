import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import type { ProjectPreview } from "@/config/portfolio";
import { KnowledgeGraphDiagram } from "./knowledge-graph";

const flowArrows = [ArrowRight, ArrowDown, ArrowLeft];

export function ProjectDiagram({ projectId, preview }: { projectId: string; preview: ProjectPreview }) {
  return (
    <figure className="project-preview">
      <figcaption className="mono-label">{preview.title}</figcaption>
      {preview.kind === "flow" ? (
        <ol className="project-flow" role="list">
          {preview.nodes.map(({ title, detail }, index) => {
            const Arrow = flowArrows[index];
            return (
              <li key={title} className="project-flow-node">
                <strong>{title}</strong>
                <span>{detail}</span>
                {Arrow && <Arrow className="project-flow-arrow" size={16} strokeWidth={1.5} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      ) : (
        <KnowledgeGraphDiagram markerId={`project-graph-${projectId}`} />
      )}
    </figure>
  );
}
