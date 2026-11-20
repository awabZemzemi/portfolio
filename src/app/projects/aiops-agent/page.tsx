import Link from "next/link";
import type { Metadata } from "next";
import { AiopsArchitecture } from "@/components/aiops-architecture";
import { AiopsEvidence, AiopsValidation } from "@/components/aiops-evidence";
import { Navigation } from "@/components/navigation";
import { StudyDecisions, StudyOverview, StudySources } from "@/components/study-overview";
import { aiops } from "@/config/aiops";
import { siteOrigin } from "@/config/site";
import { education, experience, profile } from "@/config/portfolio";
import "../study.css";
import "./aiops.css";

const title = `${aiops.title} — ${profile.name}`;
export const metadata: Metadata = {
  title,
  description: aiops.description,
  alternates: siteOrigin ? { canonical: aiops.url } : undefined,
  openGraph: { title, description: aiops.description, type: "article", url: siteOrigin ? aiops.url : undefined },
  twitter: { card: "summary", title, description: aiops.description },
};

export default function AiopsStudy() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation hasProjects hasExperience={Boolean(experience.length || education.length)} projectPage />
      <main id="main" className="shell study aiops-study" tabIndex={-1}>
        <StudyOverview
          title={aiops.title}
          category={aiops.category}
          objective={aiops.purpose}
          objectiveLabel="Project purpose"
          status="Ongoing"
          technologies={aiops.technologies}
          contribution={aiops.contribution}
          repository={aiops.repository}
        >
          <div className="aiops-overview-evidence" aria-label="Engineering evidence">
            <div><p className="mono-label">Offline tests</p><p><strong>127 passed</strong> in the audited local run</p></div>
            <div><p className="mono-label">Access controls</p><p>API namespace authorization and Kubernetes RBAC</p></div>
            <div><p className="mono-label">Kind validation</p><p>Live collector test on a failing lab workload</p></div>
          </div>
        </StudyOverview>
        <section className="section-row"><h2>The engineering problem</h2><p className="section-copy">{aiops.problem}</p></section>
        <AiopsArchitecture />
        <AiopsEvidence />
        <StudyDecisions items={aiops.decisions} />
        <AiopsValidation />
        <section className="section-row"><h2>Technology stack</h2><dl className="study-stack">{aiops.stack.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
        <StudySources sources={aiops.sources} />
        <footer className="study-footer"><Link href="/#projects">Back to selected projects</Link></footer>
      </main>
    </>
  );
}
