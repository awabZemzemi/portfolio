"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function StudyReveal({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.revealed = "true";
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px" });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={className} data-study-reveal="">{children}</div>;
}
