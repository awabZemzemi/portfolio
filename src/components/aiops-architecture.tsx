import { ArchitecturePlayer } from "./architecture/architecture-player";
import { aiopsDiagram } from "./architecture/aiops-data";

export function AiopsArchitecture() {
  return <ArchitecturePlayer diagram={aiopsDiagram} />;
}
