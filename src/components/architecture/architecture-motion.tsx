"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Diagram } from "./model";
import { buildCues, createTimeline } from "./playback";
import { createSignalRenderer } from "./signal-renderer";

export function ArchitectureMotion({ steps, children }: { steps: Diagram["steps"]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = ref.current;
    if (!viewport) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const renderer = createSignalRenderer(viewport, Array.from(viewport.querySelectorAll<SVGSVGElement>(".architecture-canvas")));
    let intersecting = false;
    let ready = false;
    let disposed = false;
    let lastFrame: { cue: ReturnType<typeof buildCues>[number]; progress: number } | undefined;

    const timeline = createTimeline(
      buildCues(steps),
      { request: frame => window.requestAnimationFrame(frame), cancel: id => window.cancelAnimationFrame(id) },
      (cue, progress) => {
        lastFrame = { cue, progress };
        renderer.paint(cue, progress);
      },
      renderer.canStart,
      () => finish(),
    );

    function updateVisibility() {
      if (disposed) return;
      const visible = ready && intersecting && document.visibilityState === "visible";
      viewport!.dataset.motion = visible ? "visible" : "paused";
      timeline.setVisible(visible);
    }

    const intersection = new IntersectionObserver(([entry]) => {
      if (disposed) return;
      intersecting = entry.isIntersecting;
      if (intersecting) {
        // Give the reader enough of the diagram to follow the first signal.
        const usableHeight = entry.rootBounds?.height ?? window.innerHeight;
        const minimumHeight = Math.min(entry.boundingClientRect.height * .6, usableHeight / 3);
        ready ||= entry.intersectionRect.height >= minimumHeight - 1;
        if (ready) renderer.selectCanvas();
      }
      updateVisibility();
    }, { rootMargin: "-70px 0px -12% 0px", threshold: [0, .15, .3, .45, .6] });

    function resize() {
      if (!ready || !intersecting || document.visibilityState !== "visible") return;
      renderer.selectCanvas();
      if (lastFrame) renderer.paint(lastFrame.cue, lastFrame.progress);
      timeline.recheck();
    }

    function finish() {
      cleanup();
      viewport!.dataset.motion = "complete";
    }

    function reduceMotion(event: MediaQueryListEvent) {
      if (event.matches) finish();
    }

    function cleanup() {
      if (disposed) return;
      disposed = true;
      timeline.dispose();
      renderer.clear();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", timeline.recheck);
      preference.removeEventListener("change", reduceMotion);
      delete viewport!.dataset.cue;
    }

    intersection.observe(viewport);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", timeline.recheck, { passive: true });
    preference.addEventListener("change", reduceMotion);
    return cleanup;
  }, [steps]);

  return <div className="architecture-viewport" ref={ref}>{children}</div>;
}
