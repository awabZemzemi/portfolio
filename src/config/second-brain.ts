export const secondBrain = {
  id: "second-brain",
  title: "Second Brain — AI Knowledge Assistant",
  category: "Agentic AI · GraphRAG",
  description: "A personal knowledge assistant that combines semantic search with relationships extracted from notes. LangGraph plans the search and brings both kinds of evidence together to answer a question.",
  technologies: ["LangGraph", "ChromaDB", "Neo4j", "LangSmith"],
  url: "/projects/second-brain",
  repository: "https://github.com/PPPRT4/pfa/tree/VersionE",
  decisions: [
    ["LangGraph orchestration", "The planner breaks a question into search queries. A routing node chooses between retrieval and direct generation, so questions that need stored knowledge can take the search path."],
    ["Hybrid GraphRAG", "Each search query runs against both indexes. The agent concatenates their results in its document state and passes the combined context to the answer prompt."],
    ["Retrieval tool interfaces", "The project documentation describes MCP integration. In VersionE, the running graph calls the vector and graph search functions directly."],
    ["Multi-store indexing", "The backend commits the PostgreSQL record first, then writes the vector and graph representations using its note ID. That shared ID ties the records together. A secondary write can still fail after the original note is saved."],
  ],
  evaluation: [
    ["Correctness", "Does the answer agree with the reference on the facts?"],
    ["Relevance", "Does it address what the question asks?"],
    ["Hallucinations", "Does it introduce claims unsupported by the reference?"],
    ["Conciseness", "Does it convey the necessary information without repetition?"],
  ],
  stack: [
    ["Frontend", "React"], ["Backend", "Python, FastAPI"], ["Orchestration", "LangGraph"],
    ["Semantic index", "ChromaDB"], ["Knowledge graph", "Neo4j"], ["Note storage", "PostgreSQL"],
    ["Tool integration", "Python retrieval functions · MCP documented in the repository"],
    ["Evaluation & tracing", "LangSmith"],
  ],
};
