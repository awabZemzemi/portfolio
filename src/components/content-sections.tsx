import Link from "next/link";
import { ChessKnight, ChessPawn, ChessRook, ChevronRight, Download, ExternalLink, Mail } from "lucide-react";
import { type Experience, type Project, links, profile } from "@/config/portfolio";

const chessPieces = { rook: ChessRook, knight: ChessKnight, pawn: ChessPawn };

function ChessAccent({ piece }: { piece: keyof typeof chessPieces }) {
  const Icon = chessPieces[piece];
  return <Icon className="chess-accent" size={18} strokeWidth={1.5} aria-hidden="true" focusable="false" />;
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="section-heading">
      <ChessAccent piece="rook" />
      <span>{children}</span>
    </h2>
  );
}

export function About() {
  return (
    <section id="about" data-nav-section aria-labelledby="about-title" className="section-row">
      <div><p className="section-kicker mono-label">About</p><SectionHeading id="about-title">Engineering interests</SectionHeading></div>
      <div className="section-copy space-y-4">{profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>
  );
}

export function ProjectBoard({ items }: { items: Project[] }) {
  if (!items.length) return null;
  return (
    <section id="projects" data-nav-section aria-labelledby="projects-title" className="content-section">
      <p className="section-kicker mono-label">Case studies</p>
      <SectionHeading id="projects-title">Selected projects</SectionHeading>
      <ul className="project-board">{items.map(item => (
        <li key={item.id}>
          {item.category && <div className="project-category mono-label">{item.id === "aiops-agent" && <ChessAccent piece="rook" />}
            {item.id === "second-brain" && <ChessAccent piece="knight" />}
            {item.category}</div>}
          <h3>
            {item.url?.startsWith("/") && !item.url.startsWith("//") ? (
              <Link href={item.url}>{item.title}<ChevronRight size={16} aria-hidden="true" /></Link>
            ) : item.url ? (
              <a href={item.url}>{item.title}<ExternalLink size={16} aria-hidden="true" /></a>
            ) : item.title}
          </h3>
          <p>{item.description}</p>
          {item.technologies && <p className="project-tech">{item.technologies.join(" · ")}</p>}
        </li>
      ))}</ul>
    </section>
  );
}

function TimelineGroup({ title, items, professional = false }: { title: string; items: Experience[]; professional?: boolean }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="timeline-group-title mono-label">{title}</h3>
      <ol className={professional ? "timeline professional-timeline" : "timeline"}>{items.map(item => (
        <li key={item.id}>
          {professional && <ChessAccent piece="pawn" />}
          <div className="timeline-header">
            <div>
              <h4>{item.organization}</h4>
              <p className="timeline-role">{item.role}</p>
            </div>
            <p className="timeline-meta"><span>{item.period}</span><span>{item.location}</span></p>
          </div>
          {item.highlights?.length ? (
            <ul className="timeline-highlights">{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
          ) : null}
          {item.technologies?.length ? <p className="timeline-technologies">{item.technologies.join(" · ")}</p> : null}
        </li>
      ))}</ol>
    </div>
  );
}

export function ExperienceTimeline({ jobs, studies }: { jobs: Experience[]; studies: Experience[] }) {
  if (!jobs.length && !studies.length) return null;
  return (
    <section id="experience" data-nav-section aria-labelledby="experience-title" className="section-row">
      <div><p className="section-kicker mono-label">Background</p><SectionHeading id="experience-title">{jobs.length ? "Experience" : "Education"}</SectionHeading></div>
      <div className="space-y-8">
        <TimelineGroup title="Professional experience" items={jobs} professional />
        <TimelineGroup title="Education" items={studies} />
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
      <div><p className="section-kicker mono-label">Contact</p><SectionHeading id="contact-title">Let’s talk systems.</SectionHeading></div>
      <div className="space-y-5"><p className="section-copy">Working on an agent that needs a reliable backend? I’d love to hear about the engineering decisions behind it.</p>
      {contacts.length > 0 && <ul className="flex flex-wrap gap-3">{contacts.map(({ label, href, icon: Icon, download }) => <li key={label}><a className="button secondary" href={href} download={download}><Icon size={16} aria-hidden="true" />{label}</a></li>)}</ul>}</div>
    </section>
  );
}
