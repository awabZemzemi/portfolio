import { StudyReveal } from "./study-reveal";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Source = { label: string; path: string; href: string };

export function StudyOverview({ title, category, objective, technologies, contribution, repository, children }: {
  title: string;
  category: string;
  objective: string;
  technologies: string[];
  contribution: string;
  repository: string;
  children?: ReactNode;
}) {
  return (
    <header className="study-overview">
      <Link href="/#projects" className="study-back"><ArrowLeft size={14} aria-hidden="true" />Selected work</Link>
      <div className="study-overview-grid">
        <div>
          <p className="mono-label section-kicker">{category}</p>
          <h1>{title}</h1>
          <p className="study-objective">{objective}</p>
          <ul className="study-technologies" role="list" aria-label="Key technologies">
            {technologies.map(technology => <li key={technology}>{technology}</li>)}
          </ul>
        </div>
        <aside className="study-contribution" aria-label="My contribution">
          <p className="mono-label section-kicker">My contribution</p>
          <p>{contribution}</p>
          <a className="editorial-link" href={repository}>View repository<ArrowUpRight size={16} aria-hidden="true" /></a>
        </aside>
      </div>
      {children}
    </header>
  );
}

export function StudyDecisions({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <section className="section-row" aria-labelledby="decisions-title">
      <h2 id="decisions-title">Engineering decisions</h2>
      <StudyReveal className="study-decisions">
        {items.map(([label, body]) => <div key={label}><h3>{label}</h3><p>{body}</p></div>)}
      </StudyReveal>
    </section>
  );
}

export function StudySources({ sources }: { sources: readonly Source[] }) {
  return (
    <section className="section-row" aria-labelledby="source-title">
      <h2 id="source-title">Implementation references</h2>
      <ul className="study-source-list" role="list">
        {sources.map(source => (
          <li key={source.path}>
            <a href={source.href}>
              <span><strong>{source.label}</strong><code>{source.path}</code></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
