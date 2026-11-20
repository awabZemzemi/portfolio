"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "motion/mini";

export function Entrance({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !ref.current) return;
    const animation = animate(ref.current, { transform: ["translateY(8px)", "translateY(0)"] }, { duration: 0.42, ease: "easeOut" });
    const finish = () => { if (preference.matches) animation.complete(); };
    preference.addEventListener("change", finish);
    return () => {
      animation.stop();
      preference.removeEventListener("change", finish);
    };
  }, []);
  return <div ref={ref}>{children}</div>;
}
