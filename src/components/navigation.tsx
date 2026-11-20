"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./brand";

export function Navigation({ hasProjects, hasExperience, projectPage = false }: { hasProjects: boolean; hasExperience: boolean; projectPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-section]"));
    function update() {
      if (projectPage) return;
      const last = sections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * 0.35).at(-1);
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
      setActive(atBottom ? "contact" : last?.id ?? "home");
    }
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeMenu = () => setOpen(false);
    update();
    desktop.addEventListener("change", closeMenu);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      desktop.removeEventListener("change", closeMenu);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [projectPage]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function dismiss(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);

  const items = ["Home", "Projects", ...(hasExperience ? ["Experience"] : []), "About", "Contact"];
  return (
    <header ref={header} className="site-header" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <div className="shell header-inner flex items-center justify-between">
        <div onClick={() => setOpen(false)}><Brand href={projectPage ? "/#home" : "#home"} /></div>
        <button type="button" ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          {items.map(item => {
            const id = item.toLowerCase();
            if (id === "projects" && !hasProjects) return <span key={id} aria-disabled="true" className="nav-disabled">{item}</span>;
            return <a key={id} href={`${projectPage ? "/" : ""}#${id}`} aria-current={(projectPage ? "projects" : active) === id ? "location" : undefined} onClick={() => setOpen(false)}>{item}</a>;
          })}
        </nav>
      </div>
    </header>
  );
}
