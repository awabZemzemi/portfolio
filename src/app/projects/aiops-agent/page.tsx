import Link from "next/link";
import type { Metadata } from "next";
import { Activity, FileSearch, MessageSquareText } from "lucide-react";
import { AiopsArchitecture } from "@/components/aiops-architecture";
import { Navigation } from "@/components/navigation";
import { aiops } from "@/config/aiops";
import { education, experience, profile } from "@/config/portfolio";
import "./study.css";

const title = `${aiops.title} — ${profile.name}`;
export const metadata: Metadata = {
  title, description: aiops.description,
  openGraph: { title, description: aiops.description, type: "article" },
  twitter: { card: "summary", title, description: aiops.description },
};

const evidenceIcons = [Activity, FileSearch, MessageSquareText];

export default function AiopsStudy() {
  const repo = aiops.repository;
  const hasRepo = repo && /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/.test(repo);
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation hasProjects hasExperience={Boolean(experience.length || education.length)} projectPage />
      <main id="main" className="shell study">
        <header className="study-intro">
          <p className="hero-eyebrow mono-label"><span aria-hidden="true" />{aiops.category}</p>
          <h1>{aiops.title}</h1><p className="study-subtitle">{aiops.subtitle}</p>
          <p className="section-copy">{aiops.purpose}</p>
        </header>
        <section className="section-row"><h2>The engineering problem</h2><p className="section-copy">{aiops.problem}</p></section>
        <AiopsArchitecture />
        <section className="section-row"><h2>How it works</h2>
          <ol className="study-flow">{aiops.steps.map(([label, body], i) => (
            <li key={label}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><h3>{label}</h3><p>{body}</p></div></li>
          ))}</ol>
        </section>
        <section className="section-row"><h2>Key engineering decisions</h2>
          <div className="study-decisions">{aiops.decisions.map(([label, body]) => <div key={label}><h3>{label}</h3><p>{body}</p></div>)}</div>
        </section>
        <section className="study-demo content-section">
          <p className="section-kicker mono-label">Diagnostic walkthrough</p>
          <h2>Investigating CrashLoopBackOff</h2>
          <p className="section-copy">The Kind lab’s <code>crash-demo</code> Pod deliberately exits and restarts. Its manifest gives this investigation a known cause.</p>
          <ol>{aiops.demo.map(([label, body], i) => {
            const Icon = evidenceIcons[i];
            return <li key={label}><Icon size={21} aria-hidden="true" /><h3>{label}</h3><p>{body}</p></li>;
          })}</ol>
        </section>
        <section className="section-row"><h2>Technology stack</h2><dl className="study-stack">{aiops.stack.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
        <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link>{hasRepo && <a href={repo}>View repository on GitHub</a>}</footer>
      </main>
    </>
  );
}
