"use client";

import { useEffect, useId, useReducer, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { ArchitectureMap } from "./architecture-map";
import { flows, type Diagram } from "./model";
import { initialPlayback, stepDuration, transitionPlayback } from "./playback";
import "./architecture.css";

export function ArchitecturePlayer({ diagram }: { diagram: Diagram }) {
  const last = diagram.steps.length - 1;
  const [state, dispatch] = useReducer(
    (playback: typeof initialPlayback, action: Parameters<typeof transitionPlayback>[1]) => transitionPlayback(playback, action, last),
    initialPlayback,
  );
  const mapId = useId();
  const step = diagram.steps[state.index];
  const playing = state.mode === "playing";
  const Heading = diagram.heading;
  const legend = Array.from(new Set(diagram.edges.map(edge => edge.flow)));

  useEffect(() => {
    if (!playing) return;
    const remaining = Math.max(0, state.remaining - (performance.now() - state.startedAt));
    const timer = window.setTimeout(() => {
      dispatch({ type: "elapsed", generation: state.generation, now: performance.now() });
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [playing, state.generation, state.remaining, state.startedAt]);

  return (
    <figure
      className="architecture-player"
      aria-labelledby={`${diagram.id}-title`}
      data-playing={playing}
      data-mode={state.mode}
      style={{ "--architecture-step-duration": `${stepDuration}ms` } as CSSProperties}
    >
      <figcaption>
        <Heading id={`${diagram.id}-title`}>{diagram.title}</Heading>
        <p className="architecture-description">{diagram.description}</p>
      </figcaption>
      <ul className="architecture-legend" aria-label="Connection types" role="list">
        {legend.map(key => <li key={key}><i aria-hidden="true" style={{ borderColor: flows[key].color, borderTopStyle: "dashed" in flows[key] ? "dashed" : "solid" }} />{flows[key].label}</li>)}
      </ul>
      <div className="architecture-playback">
        <div className="architecture-controls" role="group" aria-label={`${diagram.title} playback`}>
          <div className="architecture-control-set">
            <button type="button" aria-disabled={playing} aria-controls={mapId} onClick={() => dispatch({ type: "play", now: performance.now() })}><Play size={14} aria-hidden="true" />Play</button>
            <button type="button" aria-disabled={!playing} aria-controls={mapId} onClick={() => dispatch({ type: "pause", now: performance.now() })}><Pause size={14} aria-hidden="true" />Pause</button>
            <button type="button" aria-controls={mapId} onClick={() => dispatch({ type: "replay", now: performance.now() })}><RotateCcw size={14} aria-hidden="true" />Replay</button>
          </div>
          <div className="architecture-control-set">
            <button type="button" aria-label="Back one step" aria-disabled={state.index <= 0} aria-controls={mapId} onClick={() => dispatch({ type: "step", direction: -1 })}><ChevronLeft size={16} aria-hidden="true" />Back</button>
            <button type="button" aria-label="Next step" aria-disabled={state.index >= last} aria-controls={mapId} onClick={() => dispatch({ type: "step", direction: 1 })}>Next<ChevronRight size={16} aria-hidden="true" /></button>
          </div>
        </div>
        <p className="architecture-status" role="status" aria-atomic="true">
          {step ? <><span>{state.mode === "complete" ? "Complete" : `Step ${state.index + 1} of ${diagram.steps.length}`}</span> {step.label}</> : "Illustrated execution flow. Choose Play or Next."}
        </p>
      </div>
      <ArchitectureMap key={state.frame} diagram={diagram} active={step} mapId={mapId} />
    </figure>
  );
}
