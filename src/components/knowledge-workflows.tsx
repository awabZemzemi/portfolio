import { Network, Search } from "lucide-react";
import { ArchitecturePlayer } from "./architecture/architecture-player";
import { ingestionDiagram, retrievalDiagram } from "./architecture/knowledge-data";

export function KnowledgeWorkflows() {
  return <section className="knowledge-architecture" aria-labelledby="knowledge-map-title">
    <h2 id="knowledge-map-title">System architecture</h2>
    <ArchitecturePlayer diagram={ingestionDiagram} />
    <ArchitecturePlayer diagram={retrievalDiagram} />
  </section>;
}

export function RetrievalComparison() {
  return <figure className="retrieval-comparison">
    <div><h3><Search />Semantic search</h3><p>ChromaDB compares the query embedding with note embeddings. Different wording can lead to a passage with a similar meaning.</p></div>
    <div><h3><Network />Graph retrieval</h3><p>Neo4j starts with title or text matches, follows MENTIONS edges, and collects entity names and outgoing relationship types.</p></div>
    <figcaption>Both paths feed the same context window. A passage supplies the wording of a note, while a graph result can identify the entities and relationships it describes.</figcaption>
  </figure>;
}
