import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeEvidence } from "@/components/knowledge-evidence";
import { StudyDecisions, StudyOverview, StudySources } from "@/components/study-overview";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { KnowledgeWorkflows, RetrievalComparison } from "@/components/knowledge-workflows";
import { Navigation } from "@/components/navigation";
import { siteOrigin } from "@/config/site";
import { education, experience, profile } from "@/config/portfolio";
import { secondBrain as project } from "@/config/second-brain";
import "../study.css";
import "./knowledge.css";

const title = `${project.title} — ${profile.name}`;
export const metadata: Metadata = {
  title, description: project.description,
  alternates: siteOrigin ? { canonical: project.url } : undefined,
  openGraph: { title, description: project.description, type: "article", url: siteOrigin ? project.url : undefined },
  twitter: { card: "summary", title, description: project.description },
};

export default function SecondBrainStudy() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation hasProjects hasExperience={Boolean(experience.length || education.length)} projectPage />
    <main id="main" className="shell study knowledge-study" tabIndex={-1}>
      <StudyOverview
        title="Second Brain"
        category={project.category}
        objective={project.description}
        objectiveLabel="Project purpose"
        technologies={project.technologies}
        contribution={project.contribution}
        repository={project.repository}
      >
        <div className="knowledge-overview-evidence" aria-label="Engineering evidence">
          <div><p className="mono-label">Retrieval</p><p><strong>2 paths</strong> · ChromaDB semantics and Neo4j relationships</p></div>
          <div><p className="mono-label">Persistence</p><p><strong>3 stores</strong> · PostgreSQL, ChromaDB, Neo4j</p></div>
          <div><p className="mono-label">Evaluation scope</p><p><strong>31 cases</strong> · LangSmith LLM judge</p></div>
        </div>
      </StudyOverview>
      <section className="section-row">
        <h2>The engineering problem</h2>
        <p className="section-copy">A project decision might live in one note and its rationale in another. Keyword search can miss the rationale if the two notes use different terms. Vector similarity can recover related wording, but tells you little about whether one entity depends on another. Second Brain indexes both the text and its relationships so an answer can draw on several connected notes.</p>
      </section>
      <KnowledgeWorkflows />
      <KnowledgeEvidence />
      <section className="section-row">
        <div><h2>How the graph connects notes</h2><p className="section-copy">This schema example uses synthetic labels to show two notes mentioning a shared entity and a typed relationship between entities.</p></div>
        <KnowledgeGraph />
      </section>
      <section className="content-section">
        <p className="section-kicker mono-label">Agentic retrieval</p>
        <h2>Two ways to find context</h2>
        <RetrievalComparison />
        <p className="section-copy knowledge-mcp-note">In VersionE, LangGraph calls the Python vector and graph search functions directly. A separate <code>awab</code> branch contains MCP server prototypes and a client notebook; they are outside this runtime path.</p>
      </section>
      <StudyDecisions items={project.decisions} />
      <section className="section-row">
        <div><p className="section-kicker mono-label">Evaluation</p><h2>Reviewing answers with LangSmith</h2></div>
        <div className="eval-body"><p className="section-copy">The VersionE dataset seed defines 31 question–answer cases drawn from the notes: factual lookups, questions that combine notes, reasoning tasks, and questions the notes cannot answer.</p>
          <ol className="evaluation-flow">
            <li>The dataset supplies a question and reference answer.</li>
            <li>The LangGraph application generates an answer.</li>
            <li>The judge receives the question, generated answer, and reference.</li>
            <li>The judge returns scores and a reason; LangSmith records the feedback.</li>
          </ol>
          <dl className="study-stack">{project.evaluation.map(([label,body]) => <div key={label}><dt>{label}</dt><dd>{body}</dd></div>)}</dl>
          <p className="section-copy">The judge prompt does not receive retrieved passages or the dataset’s source-note IDs. Its reference-based scores need human interpretation; the repository contains the evaluation method, not a published aggregate result.</p>
        </div>
      </section>
      <section className="section-row"><h2>Technology stack</h2>
        <dl className="study-stack">{project.stack.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      <StudySources sources={[...project.sources, ...project.mcpSources]} />
      <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link></footer>
    </main>
  </>;
}
