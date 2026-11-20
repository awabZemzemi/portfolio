import { Database, FileText, Layers3, MessagesSquare, Network, Search } from "lucide-react";

const lanes = [
  {
    title: "Knowledge ingestion", icon: FileText,
    steps: [
      ["React → FastAPI", "Submit the note to /add-note."],
      ["LLM note processing", "Generate a title and atomic note, classify the topic, and extract entities and relationships."],
      ["Persist and index", "Use the stored note ID to connect its three representations."],
    ],
  },
  {
    title: "Question answering", icon: MessagesSquare,
    steps: [
      ["React → FastAPI", "Send the question to /chat."],
      ["LangGraph planner", "Plan subqueries and route questions that need notes to retrieval."],
      ["Vector and graph tools", "Search ChromaDB and traverse Neo4j for each subquery."],
      ["Context → answer", "Combine the returned passages and graph context. Generate an answer grounded in those notes."],
    ],
  },
];

export function KnowledgeWorkflows() {
  return <section className="knowledge-map" aria-labelledby="knowledge-map-title">
    <h2 id="knowledge-map-title">System architecture</h2>
    <div className="knowledge-lanes">{lanes.map(({title,icon:Icon,steps},i) => (
      <div key={title} className="knowledge-lane">
        <h3><Icon aria-hidden="true" size={20} />{title}</h3>
        <ol>{steps.map(([label,body]) => <li key={label}><strong>{label}</strong><p>{body}</p></li>)}</ol>
        {i === 0 && <ul className="knowledge-stores">
          <li><Database />PostgreSQL <span>Note record</span></li>
          <li><Layers3 />ChromaDB <span>Vector index</span></li>
          <li><Network />Neo4j <span>Entity graph</span></li>
        </ul>}
      </div>
    ))}</div>
  </section>;
}

export function RetrievalComparison() {
  return <figure className="retrieval-comparison">
    <div><h3><Search />Semantic search</h3><p>ChromaDB compares the query embedding with note embeddings. Different wording can lead to a passage with a similar meaning.</p></div>
    <div><h3><Network />Graph retrieval</h3><p>Neo4j starts with title or text matches, follows MENTIONS edges, and collects entity names and outgoing relationship types.</p></div>
    <figcaption>Both paths feed the same context window. A passage supplies the wording of a note, while a graph result can identify the entities and relationships it describes.</figcaption>
  </figure>;
}
