const repository = "https://github.com/PPPRT4/pfa";
const mcpRevision = "9d02ccab0732580d942ab9e35dd39b3d09b0e6d2";

export const secondBrain = {
  id: "second-brain",
  title: "Second Brain — AI Knowledge Assistant",
  category: "Agentic AI · GraphRAG",
  description: "An AI knowledge assistant that combines semantic retrieval and knowledge-graph relationships to answer questions using information extracted from personal notes.",
  technologies: ["LangGraph", "ChromaDB", "Neo4j", "FastAPI", "LangSmith"],
  url: "/projects/second-brain",
  repository: `${repository}/tree/VersionE`,
  contribution: "I built the note-ingestion workflow across three stores, combined semantic and graph retrieval in LangGraph, and evaluated generated answers with LangSmith.",
  sources: [
    ["Note ingestion and chat routes", "backend/routes/notes_routes.py"],
    ["LangGraph planner and retrieval", "Langgraph_agent/langgraph_agent.py"],
    ["Neo4j indexing and traversal", "ai/neo4j.py"],
    ["31-case evaluation dataset", "seed/seed_langsmith.py"],
    ["LangSmith evaluation runner", "Langgraph_agent/run_eval.py"],
  ].map(([label, path]) => ({ label, path, href: `${repository}/blob/VersionE/${path}` })),
  mcpSources: [
    ["Vector MCP server prototype", "mcp/vector_mcp/server.py"],
    ["Graph MCP server prototype", "MCP/neo4j-mcp/server.py"],
    ["MCP client notebook", "ai/agent.ipynb"],
  ].map(([label, path]) => ({ label, path: `awab branch · ${path}`, href: `${repository}/blob/${mcpRevision}/${path}` })),
  decisions: [
    ["LangGraph orchestration", "The planner breaks a question into search queries. A routing node chooses between retrieval and direct generation, so questions that need stored knowledge can take the search path."],
    ["Hybrid GraphRAG", "On the retrieval route, each planned query searches ChromaDB and Neo4j. Their results enter the same document state before answer generation. Direct generation is also a possible route."],
    ["Retrieval tool interfaces", "VersionE calls Python vector and graph search functions directly. The separate awab branch contains FastMCP vector and graph servers and a client notebook; they are not on the VersionE graph path."],
    ["Multi-store indexing", "The backend commits the PostgreSQL record first, then writes the vector and graph representations using its note ID. That shared ID ties the records together. A secondary write can still fail after the original note is saved."],
    ["Evaluation", "A 31-case LangSmith dataset pairs questions with reference answers. The runner sends each question, generated answer, and reference to an LLM judge; its feedback is a review signal, not a verified accuracy result."],
  ] as const,
  evaluation: [
    ["Correctness", "Does the answer agree with the reference on the facts?"],
    ["Relevance", "Does it address what the question asks?"],
    ["Hallucination assessment", "Does it introduce claims unsupported by the reference?"],
    ["Conciseness", "Does it convey the necessary information without repetition?"],
  ],
  stack: [
    ["Frontend", "React"], ["Backend", "Python, FastAPI"], ["Orchestration", "LangGraph"],
    ["Semantic index", "ChromaDB"], ["Knowledge graph", "Neo4j"], ["Note storage", "PostgreSQL"],
    ["Runtime retrieval", "Direct Python search functions"],
    ["MCP prototypes", "Vector and graph servers on the separate awab branch"],
    ["Evaluation & tracing", "LangSmith"],
  ],
};
