import { statSync } from "node:fs";
import path from "node:path";
import { Download, Folders } from "lucide-react";
import { HeroGeometry } from "@/components/hero-geometry";
import { Brand } from "@/components/brand";
import { About, Contact, ExperienceTimeline, ProjectBoard } from "@/components/content-sections";
import { Entrance } from "@/components/entrance";
import { Navigation } from "@/components/navigation";
import { Workflow } from "@/components/workflow";
import { education, experience, links, profile, projects } from "@/config/portfolio";

export default function Home() {
  const cv = links.cv && statSync(path.join(process.cwd(), "public", links.cv), { throwIfNoEntry: false })?.isFile() ? links.cv : undefined;
  const hasBackground = experience.length + education.length > 0;
  const workTarget = projects.length ? "#projects" : hasBackground ? "#experience" : "#about";
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation hasProjects={projects.length > 0} hasExperience={hasBackground} />
      <main id="main" className="shell">
        <section id="home" data-nav-section aria-labelledby="hero-title" className="hero">
          <Entrance>
            <p className="hero-eyebrow mono-label"><span aria-hidden="true" />{profile.eyebrow}</p>
            <h1 id="hero-title">Building intelligent systems, <span>from development to deployment.</span></h1>
            <div className="hero-introduction">
              <p className="intro">{profile.introduction}</p>
              <div className="hero-actions flex flex-wrap gap-3">
                <a className="button primary" href={workTarget}><Folders size={17} aria-hidden="true" />Explore Work</a>
                {cv && <a className="button secondary" href={cv} download><Download size={17} aria-hidden="true" />Download CV</a>}
              </div>
              <HeroGeometry />
            </div>
          </Entrance>
          <Workflow />
        </section>
        <About />
        <ProjectBoard items={projects} />
        <ExperienceTimeline jobs={experience} studies={education} />
        <Contact cv={cv} />
      </main>
      <footer className="footer"><div className="shell flex flex-wrap items-center justify-between gap-5"><Brand /><a href="#home">Back to top</a></div></footer>
    </>
  );
}
