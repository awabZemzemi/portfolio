import type { Box, Diagram } from "./model";

function stacked(ids: string[], start = 18): Record<string, Box> {
  return Object.fromEntries(ids.map((id, index) => [id, [24, start + index * 110, 272, 74]]));
}

export const ingestionDiagram: Diagram = {
  id: "knowledge-ingestion",
  title: "Knowledge ingestion",
  heading: "h3",
  description: "React sends the note to FastAPI for LLM processing. The backend stores the original and structured fields in PostgreSQL, indexes the atomic note in ChromaDB, then writes entities and relationships to Neo4j using the same note ID. The gold arrows show the backend’s write order.",
  nodes: [
    { id: "react", title: "React", details: ["Submit note"], kind: "client" },
    { id: "api", title: "FastAPI", details: ["POST /add-note"], kind: "service" },
    { id: "llm", title: "LLM processing", details: ["Title and atomic note"], kind: "agent" },
    { id: "extract", title: "Extract & classify", details: ["Topic, entities", "and relationships"], kind: "tool" },
    { id: "postgres", title: "PostgreSQL", details: ["Original note", "and structured fields"], kind: "store" },
    { id: "chroma", title: "ChromaDB", details: ["Note embeddings"], kind: "store" },
    { id: "neo", title: "Neo4j", details: ["Entities and", "relationships"], kind: "store" },
  ],
  edges: [
    { id: "submit", from: "react", to: "api", flow: "ingestion" },
    { id: "process", from: "api", to: "llm", flow: "ingestion" },
    { id: "shape", from: "llm", to: "extract", flow: "ingestion" },
    { id: "commit", from: "extract", to: "postgres", flow: "indexing" },
    { id: "embed", from: "postgres", to: "chroma", flow: "indexing", label: "Note ID" },
    { id: "connect", from: "chroma", to: "neo", flow: "indexing", label: "Same note ID" },
  ],
  layouts: {
    wide: {
      size: [1120, 357],
      boxes: {
        react: [20, 137, 150, 76], api: [207, 137, 160, 76], llm: [404, 137, 172, 76], extract: [613, 137, 174, 76],
        postgres: [880, 18, 207, 82], chroma: [880, 137, 207, 76], neo: [880, 252, 207, 82],
      },
      axes: { commit: "horizontal" },
    },
    medium: {
      size: [656, 316],
      boxes: {
        react: [12, 22, 118, 87], api: [154, 22, 125, 87], llm: [303, 22, 153, 87], extract: [480, 22, 162, 87],
        postgres: [490, 198, 152, 90], chroma: [255, 198, 143, 90], neo: [12, 198, 151, 90],
      },
    },
    narrow: {
      size: [320, 774],
      boxes: {
        ...stacked(["react", "api", "llm", "extract", "postgres", "chroma", "neo"]),
        extract: [24, 348, 272, 82], postgres: [24, 458, 272, 82], neo: [24, 678, 272, 82],
      },
    },
  },
  steps: [
    { label: "React sends the note to FastAPI at /add-note.", nodes: ["react", "api"], edges: ["submit"] },
    { label: "The LLM produces an atomic note and extracts the title, topic, entities, and relationships.", nodes: ["llm", "extract"], edges: ["process", "shape"] },
    { label: "PostgreSQL commits the original note and its structured fields. The backend reads the new note ID.", nodes: ["extract", "postgres"], edges: ["commit"] },
    { label: "The backend embeds the atomic note and indexes it in ChromaDB under the note ID.", nodes: ["postgres", "chroma"], edges: ["embed"] },
    { label: "The backend writes the note, entities, and relationships to Neo4j using that same ID.", nodes: ["postgres", "chroma", "neo"], edges: ["connect"] },
  ],
};

export const retrievalDiagram: Diagram = {
  id: "graphrag-question-answering",
  title: "GraphRAG question answering",
  heading: "h3",
  description: "This walkthrough follows the retrieval route. LangGraph fans out to ChromaDB for semantic passages and Neo4j for relationships. The graph calls Python search functions directly. Both results feed the answer prompt, and FastAPI returns the response to React.",
  nodes: [
    { id: "react", title: "React", details: ["Ask a question"], kind: "client" },
    { id: "api", title: "FastAPI", details: ["POST /chat"], kind: "service" },
    { id: "plan", title: "LangGraph", details: ["Planner / router"], kind: "agent" },
    { id: "chroma", title: "ChromaDB", details: ["Similar passages"], kind: "store" },
    { id: "neo", title: "Neo4j", details: ["Connected entities", "and relationships"], kind: "store" },
    { id: "context", title: "Context", details: ["Assemble evidence"], kind: "tool" },
    { id: "answer", title: "Generate answer", details: ["Use retrieved notes"], kind: "agent" },
    { id: "result", title: "React", details: ["Show answer"], kind: "client" },
  ],
  edges: [
    { id: "question", from: "react", to: "api", flow: "request" },
    { id: "plan", from: "api", to: "plan", flow: "request" },
    { id: "vector-query", from: "plan", to: "chroma", flow: "semantic", offset: -17 },
    { id: "graph-query", from: "plan", to: "neo", flow: "graph", offset: 17 },
    { id: "passages", from: "chroma", to: "context", flow: "semantic", offset: -17 },
    { id: "relations", from: "neo", to: "context", flow: "graph", offset: 17 },
    { id: "ground", from: "context", to: "answer", flow: "request" },
    { id: "return", from: "answer", to: "result", flow: "response", label: "via FastAPI" },
  ],
  layouts: {
    wide: {
      size: [1190, 303],
      boxes: {
        react: [12, 116, 112, 74], api: [148, 116, 112, 74], plan: [284, 116, 134, 74],
        chroma: [463, 51, 158, 76], neo: [463, 176, 158, 83], context: [666, 116, 140, 74],
        answer: [834, 116, 157, 74], result: [1076, 116, 102, 74],
      },
    },
    medium: {
      size: [656, 440],
      boxes: {
        react: [24, 22, 172, 74], api: [242, 22, 172, 74], plan: [460, 22, 172, 74],
        chroma: [203, 173, 190, 77], neo: [440, 173, 192, 84],
        context: [456, 339, 176, 74], answer: [226, 339, 162, 74], result: [24, 339, 126, 74],
      },
      axes: { "vector-query": "vertical", "graph-query": "vertical", passages: "vertical", relations: "vertical" },
    },
    narrow: {
      size: [320, 813],
      boxes: {
        react: [24, 18, 272, 65], api: [24, 112, 272, 65], plan: [24, 206, 272, 65],
        chroma: [8, 331, 145, 91], neo: [167, 331, 145, 91],
        context: [24, 485, 272, 65], answer: [24, 579, 272, 65], result: [24, 710, 272, 65],
      },
    },
  },
  steps: [
    { label: "The question travels from React to the FastAPI chat endpoint.", nodes: ["react", "api"], edges: ["question"] },
    { label: "LangGraph plans search queries and selects the retrieval route.", nodes: ["api", "plan"], edges: ["plan"] },
    { label: "The search functions query ChromaDB for similar passages and Neo4j for connected entities.", nodes: ["plan", "chroma", "neo"], edges: ["vector-query", "graph-query"] },
    { label: "The agent combines the two sets of retrieval results into context for the answer.", nodes: ["chroma", "neo", "context"], edges: ["passages", "relations"] },
    { label: "The model generates an answer using that retrieved context.", nodes: ["context", "answer"], edges: ["ground"] },
    { label: "FastAPI returns the answer to React.", nodes: ["answer", "result"], edges: ["return"] },
  ],
};
