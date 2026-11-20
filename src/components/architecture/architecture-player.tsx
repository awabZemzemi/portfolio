"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ArchitectureMap } from "./architecture-map";
import { flows, type Diagram } from "./model";
import "./architecture.css";

const stepDuration = 2200;

export function ArchitecturePlayer({ diagram }: { diagram: Diagram }) {
  const [playback, setPlayback] = useState({ index: -1, playing: false, finished: false, run: 0 });
  const remaining = useRef(stepDuration);
  const deadline = useRef(0);
  const mapId = useId();
  const step = diagram.steps[playback.index];
  const last = diagram.steps.length - 1;
  const Heading = diagram.heading;
  const legend = Array.from(new Set(diagram.edges.map(edge => edge.flow)));

  useEffect(() => {
    if (!playback.playing) return;
    deadline.current = performance.now() + remaining.current;
    const timer = window.setTimeout(() => {
      remaining.current = stepDuration;
      setPlayback(current => current.index === last
        ? { ...current, playing: false, finished: true }
        : { ...current, index: current.index + 1 });
    }, remaining.current);
    return () => window.clearTimeout(timer);
  }, [playback.index, playback.playing, playback.run, last]);

  function play(replay = false) {
    if (!replay && playback.playing) return;
    if (replay || !step || playback.finished) {
      remaining.current = stepDuration;
      setPlayback(current => ({ index: 0, playing: true, finished: false, run: current.run + 1 }));
    } else {
      setPlayback(current => ({ ...current, playing: true }));
    }
  }

  function pause() {
    if (!playback.playing) return;
    remaining.current = Math.max(0, deadline.current - performance.now());
    setPlayback(current => ({ ...current, playing: false }));
  }

  return (
    <figure
      className="architecture-player"
      aria-labelledby={`${diagram.id}-title`}
      data-playing={playback.playing}
      style={{ "--architecture-step-duration": `${stepDuration}ms` } as CSSProperties}
    >
      <figcaption>
        <Heading id={`${diagram.id}-title`}>{diagram.title}</Heading>
        <p className="architecture-description">{diagram.description}</p>
      </figcaption>
      <ul className="architecture-legend" aria-label="Connection types">
        {legend.map(key => <li key={key}><i aria-hidden="true" style={{ borderColor: flows[key].color, borderTopStyle: "dashed" in flows[key] ? "dashed" : "solid" }} />{flows[key].label}</li>)}
      </ul>
      <div className="architecture-playback">
        <div className="architecture-controls" role="group" aria-label={`${diagram.title} playback`}>
          <button type="button" onClick={() => play()} aria-disabled={playback.playing} aria-controls={mapId}><Play size={14} aria-hidden="true" />Play</button>
          <button type="button" onClick={pause} aria-disabled={!playback.playing} aria-controls={mapId}><Pause size={14} aria-hidden="true" />Pause</button>
          <button type="button" onClick={() => { if (step) play(true); }} aria-disabled={!step} aria-controls={mapId}><RotateCcw size={14} aria-hidden="true" />Replay</button>
        </div>
        <p className="architecture-status" role="status" aria-atomic="true">
          {step ? <><span>{playback.finished ? "Complete" : `Step ${playback.index + 1} of ${diagram.steps.length}`}</span> {step.label}</> : "Play the illustrated flow."}
        </p>
      </div>
      <ArchitectureMap key={`${playback.run}-${playback.index}`} diagram={diagram} active={step} mapId={mapId} />
    </figure>
  );
}
