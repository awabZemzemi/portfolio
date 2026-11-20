export function KnowledgeEvidence() {
  return (
    <section className="content-section" id="demonstration" aria-labelledby="knowledge-demo-title">
      <p className="section-kicker mono-label">VersionE implementation</p>
      <h2 id="knowledge-demo-title">Follow the note ID</h2>
      <p className="section-copy demo-intro">One submission produces a PostgreSQL row, a searchable embedding, and a graph representation.
        These examples show the API contract and indexing pattern in source.</p>
      <div className="evidence-grid">
        <div className="evidence-records">
          <h3>Ingest a note</h3>
          <pre tabIndex={0} aria-label="Note ingestion request and result fields"><code>{`POST /add-note
{ "content": "<note text>" }

Result fields
id, title, content, topic,
atomic_note, entities, relations`}</code></pre>
          <p>The API commits the original text and generated title and topic in PostgreSQL. ChromaDB indexes the shorter atomic note under the resulting ID.</p>
        </div>
        <div className="evidence-records">
          <h3>Connect its entities</h3>
          <pre tabIndex={0} aria-label="Conceptual Cypher indexing excerpt"><code>{`MERGE (n:Note {id: $id})
MERGE (ent:Entity {name: $name})
MERGE (n)-[:MENTIONS]->(ent)`}</code></pre>
          <p>These are the graph’s key operations. Note IDs and entity names let Neo4j reuse nodes. Distinct spellings can still create separate entities, and typed links such as <code>DEPENDS_ON</code> connect them.</p>
        </div>
      </div>
    </section>
  );
}
