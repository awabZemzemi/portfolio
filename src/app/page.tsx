import { statSync } from "node:fs";
import path from "node:path";
import { ArrowRight, Download, Mail } from "lucide-react";
import { Brand } from "@/components/brand";
import ChessGame from "@/components/chess/chess-game";
import { About, Contact, ExperienceTimeline, ProjectBoard } from "@/components/content-sections";
import { Navigation } from "@/components/navigation";
import { education, experience, links, profile, projects } from "@/config/portfolio";

export default function Home() {
  const cv = links.cv && statSync(path.join(process.cwd(), "public", links.cv), { throwIfNoEntry: false })?.isFile() ? links.cv : undefined;
  const hasBackground = experience.length + education.length > 0;
  const workTarget = projects.length ? "#projects" : hasBackground ? "#experience" : "#about";
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation hasProjects={projects.length > 0} hasExperience={hasBackground} />
      <main id="main" className="shell" tabIndex={-1}>
        <section id="home" data-nav-section aria-labelledby="hero-title" className="hero">
          <div className="hero-content">
            <p className="hero-eyebrow mono-label"><span aria-hidden="true" />{profile.eyebrow}</p>
            <h1 id="hero-title">{profile.name}</h1>
            <p className="intro">{profile.introduction}</p>
            <div className="hero-actions flex flex-wrap gap-x-6 gap-y-1">
              <a className="editorial-link" href={workTarget}>Selected work<ArrowRight size={17} aria-hidden="true" /></a>
              {cv && <a className="editorial-link" href={cv} download>Download CV<Download size={16} aria-hidden="true" /></a>}
              {links.email && <a className="editorial-link" href={`mailto:${links.email}`}>Email me<Mail size={16} aria-hidden="true" /></a>}
            </div>
          </div>
          <ChessGame />
        </section>
        <ProjectBoard items={projects} />
        <ExperienceTimeline jobs={experience} studies={education} />
        <About />
        <Contact cv={cv} />
      </main>
      <footer className="footer"><div className="shell flex flex-wrap items-center justify-between gap-5"><Brand /><a href="#home">Back to top</a></div></footer>
    </>
  );
}
