import { ChevronRight, Download, ExternalLink, Mail } from "lucide-react";
import { type Experience, type Project, links, profile } from "@/config/portfolio";

export function About() {
  return (
    <section id="about" data-nav-section aria-labelledby="about-title" className="section-row">
      <div><p className="section-kicker mono-label">About</p><h2 id="about-title">Engineering interests</h2></div>
      <div className="section-copy space-y-4">{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>
  );
}

export function ProjectBoard({ items }: { items: Project[] }) {
  if (!items.length) return null;
  return (
    <section id="projects" data-nav-section aria-labelledby="projects-title" className="content-section">
      <h2 id="projects-title">Selected projects</h2>
      <ul className="project-board">{items.map(item => (
        <li key={item.id}>
          {item.category && <div className="project-category mono-label"><span className="boardmark" aria-hidden="true"><i /><i /><i /><i /></span>{item.category}</div>}
          {item.id === "aiops-agent" && <svg className="card-circuit" viewBox="0 0 140 38" aria-hidden="true">
            <g stroke="currentColor" fill="none"><path d="M13 14h39m23 0h47M119 23v9H61V21" /><rect x="2" y="8" width="13" height="13" rx="2" /><rect x="52" y="5" width="22" height="19" rx="3" /><path d="m120 4 11 6v12l-11 6-11-6V10Z" /></g>
            <path d="M58 11h10v7H58z" fill="currentColor" />
          </svg>}
          <h3>{item.url ? <a href={item.url}>{item.title}{item.url.startsWith("/") ? <ChevronRight size={16} aria-hidden="true" /> : <ExternalLink size={16} aria-hidden="true" />}</a> : item.title}</h3>
          <p>{item.description}</p>
          {item.technologies && <p className="project-tech">{item.technologies.join(" · ")}</p>}
        </li>
      ))}</ul>
    </section>
  );
}

function TimelineGroup({ title, items }: { title: string; items: Experience[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mono-label mb-4 text-sage">{title}</h3>
      <ol className="timeline">{items.map(item => (
        <li key={item.id}>
          {item.period && <p className="mono-label">{item.period}</p>}
          <h4>{item.role} <span>at {item.organization}</span></h4>
          <p>{item.description}</p>
        </li>
      ))}</ol>
    </div>
  );
}

export function ExperienceTimeline({ jobs, studies }: { jobs: Experience[]; studies: Experience[] }) {
  if (!jobs.length && !studies.length) return null;
  return (
    <section id="experience" data-nav-section aria-labelledby="experience-title" className="section-row">
      <div><p className="section-kicker mono-label">Background</p><h2 id="experience-title">{jobs.length ? "Experience" : "Education"}</h2></div>
      <div className="space-y-8">
        <TimelineGroup title="Professional experience" items={jobs} />
        <TimelineGroup title="Academic background" items={studies} />
      </div>
    </section>
  );
}

export function Contact({ cv }: { cv?: string }) {
  const contacts = [
    { label: "Email", href: links.email && `mailto:${links.email}`, icon: Mail },
    { label: "GitHub", href: links.github, icon: ExternalLink },
    { label: "LinkedIn", href: links.linkedin, icon: ExternalLink },
    { label: "Download CV", href: cv, icon: Download, download: true },
  ].filter(item => item.href);
  return (
    <section id="contact" data-nav-section aria-labelledby="contact-title" className="section-row">
      <div><p className="section-kicker mono-label">Contact</p><h2 id="contact-title">Let’s talk systems.</h2></div>
      <div className="space-y-5"><p className="section-copy">Working on an agent that needs a reliable backend? I’d love to hear about the engineering decisions behind it.</p>
      {contacts.length > 0 && <ul className="flex flex-wrap gap-3">{contacts.map(({ label, href, icon: Icon, download }) => <li key={label}><a className="button secondary" href={href} download={download}><Icon size={16} aria-hidden="true" />{label}</a></li>)}</ul>}</div>
    </section>
  );
}
