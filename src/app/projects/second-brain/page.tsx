import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { KnowledgeWorkflows, RetrievalComparison } from "@/components/knowledge-workflows";
import { Navigation } from "@/components/navigation";
import { education, experience, profile } from "@/config/portfolio";
import { secondBrain as project } from "@/config/second-brain";
import "../aiops-agent/study.css";
import "./knowledge.css";

const title = `${project.title} — ${profile.name}`;
export const metadata: Metadata = {
  title, description: project.description,
  openGraph: { title, description: project.description, type: "article" },
  twitter: { card: "summary", title, description: project.description },
};

export default function SecondBrainStudy() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation hasProjects hasExperience={Boolean(experience.length || education.length)} projectPage />
    <main id="main" className="shell study knowledge-study">
      <header className="study-intro knowledge-intro">
        <div>
          <p className="hero-eyebrow mono-label"><span aria-hidden="true" />{project.category}</p>
          <h1>Second Brain</h1>
          <p className="study-subtitle">Agentic Knowledge Assistant with GraphRAG</p>
          <p className="section-copy">{project.description}</p>
        </div>
        <KnowledgeGraph />
      </header>
      <section className="section-row">
        <h2>The engineering problem</h2>
        <p className="section-copy">A project decision might live in one note and its rationale in another. Keyword search can miss the rationale if the two notes use different terms. Vector similarity can recover related wording, but tells you little about whether one entity depends on another. Second Brain indexes both the text and its relationships so an answer can draw on several connected notes.</p>
      </section>
      <KnowledgeWorkflows />
      <section className="section-row">
        <h2>Knowledge ingestion</h2>
        <div className="section-copy space-y-4">
          <p>When a note arrives, the model extracts a title, topic, compact atomic note, entities, and typed relationships. PostgreSQL keeps the original text with its title and topic. ChromaDB indexes the atomic note using a sentence embedding.</p>
          <p>In Neo4j, <code>MERGE</code> matches the note by ID and entities by name. Two notes that mention the same extracted name can link to the same entity. The writer also merges relationships such as <code>PART_OF</code> and <code>DEPENDS_ON</code>. Names with different spellings can still become separate nodes.</p>
        </div>
      </section>
      <section className="content-section">
        <p className="section-kicker mono-label">Agentic retrieval</p>
        <h2>Two ways to find context</h2>
        <RetrievalComparison />
      </section>
      <section className="section-row"><h2>Engineering decisions</h2>
        <div className="study-decisions">{project.decisions.map(([label,body]) => <div key={label}><h3>{label}</h3><p>{body}</p></div>)}</div>
      </section>
      <section className="section-row">
        <div><p className="section-kicker mono-label">Evaluation</p><h2>Reviewing answers with LangSmith</h2></div>
        <div className="eval-body"><p className="section-copy">The evaluation uses 31 question–answer cases derived from the notes. They include factual lookups, questions that combine notes, reasoning tasks, and questions the notes cannot answer.</p>
          <dl className="study-stack">{project.evaluation.map(([label,body]) => <div key={label}><dt>{label}</dt><dd>{body}</dd></div>)}</dl>
          <p className="section-copy">An LLM judge compares each generated answer with its reference and records its reasoning. Reviewing that judgment alongside the retrieved notes helps distinguish a missing passage from an unsupported addition during generation. The judgment is a review signal and can itself be mistaken.</p>
        </div>
      </section>
      <section className="section-row"><h2>Technology stack</h2>
        <dl className="study-stack">{project.stack.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link>
        <a href={project.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">GitHub repository · VersionE<ExternalLink aria-hidden="true" size={16} /><span className="sr-only"> (opens in a new tab)</span></a>
      </footer>
    </main>
  </>;
}
