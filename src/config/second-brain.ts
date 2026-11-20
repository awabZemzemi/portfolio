const repository = "https://github.com/PPPRT4/pfa";

export const secondBrain = {
  id: "second-brain",
  title: "Second Brain — AI Knowledge Assistant",
  category: "Agentic AI · GraphRAG",
  description: "A personal knowledge assistant that combines semantic search with relationships extracted from notes. LangGraph plans the search and brings both kinds of evidence together to answer a question.",
  preview: ["LangGraph", "ChromaDB + Neo4j", "Answer"],
  technologies: ["LangGraph", "ChromaDB", "Neo4j", "LangSmith"],
  url: "/projects/second-brain",
  repository: `${repository}/tree/VersionE`,
  contribution: "I worked on the React and FastAPI knowledge workflow, combined semantic and graph retrieval in LangGraph, and evaluated generated answers with LangSmith.",
  sources: [
    ["Note ingestion and chat routes", "backend/routes/notes_routes.py"],
    ["LangGraph planner and retrieval", "Langgraph_agent/langgraph_agent.py"],
    ["Neo4j indexing and traversal", "ai/neo4j.py"],
    ["31-case evaluation dataset", "seed/seed_langsmith.py"],
    ["LangSmith evaluation runner", "Langgraph_agent/run_eval.py"],
  ].map(([label, path]) => ({ label, path, href: `${repository}/blob/VersionE/${path}` })),
  decisions: [
    ["LangGraph orchestration", "The planner breaks a question into search queries. A routing node chooses between retrieval and direct generation, so questions that need stored knowledge can take the search path."],
    ["Hybrid GraphRAG", "Each search query runs against both indexes. The agent concatenates their results in its document state and passes the combined context to the answer prompt."],
    ["Retrieval tool interfaces", "The project documentation describes MCP integration. In VersionE, the running graph calls the vector and graph search functions directly."],
    ["Multi-store indexing", "The backend commits the PostgreSQL record first, then writes the vector and graph representations using its note ID. That shared ID ties the records together. A secondary write can still fail after the original note is saved."],
  ] as const,
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
