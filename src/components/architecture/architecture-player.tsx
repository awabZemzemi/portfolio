import { ArchitectureMap } from "./architecture-map";
import { ArchitectureMotion } from "./architecture-motion";
import { flows, type Diagram } from "./model";
import "./architecture.css";

export function ArchitecturePlayer({ diagram }: { diagram: Diagram }) {
  const Heading = diagram.heading;
  const legend = Array.from(new Set(diagram.edges.map(edge => edge.flow)));
  return (
    <figure className="architecture-player" aria-labelledby={`${diagram.id}-title`}>
      <figcaption>
        <p className="architecture-caption mono-label">Conceptual flow</p>
        <Heading id={`${diagram.id}-title`}>{diagram.title}</Heading>
        <p className="architecture-description">{diagram.description}</p>
      </figcaption>
      <ul className="architecture-legend" aria-label="Connection types" role="list">
        {legend.map(key => <li key={key}><i aria-hidden="true" style={{ borderColor: flows[key].color, borderTopStyle: "dashed" in flows[key] ? "dashed" : "solid" }} />{flows[key].label}</li>)}
      </ul>
      <ArchitectureMotion steps={diagram.steps}><ArchitectureMap diagram={diagram} /></ArchitectureMotion>
      <div className="sr-only">
        <p>Conceptual execution sequence</p>
        <ol>{diagram.steps.map(step => <li key={step.label}>{step.label}</li>)}</ol>
      </div>
    </figure>
  );
}
