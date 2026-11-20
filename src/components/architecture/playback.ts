import type { Boundary, Diagram, Signal } from "./model";

export type Cue = {
  label: string;
  nodes: string[];
  edges: string[];
  duration: number;
  signal: Signal;
  inspect?: Boundary;
};

export function buildCues(steps: Diagram["steps"]): Cue[] {
  return steps.flatMap(({ label, nodes, edges = [], duration, signal = "packet", together, inspect }) => {
    if (edges.length < 2 || together) return [{ label, nodes, edges, duration, signal, inspect }];
    return edges.map((edge, index) => ({
      label,
      nodes: index === edges.length - 1 ? nodes : [],
      edges: [edge],
      duration: duration / edges.length,
      signal,
      inspect: index === edges.length - 1 ? inspect : undefined,
    }));
  });
}

type Clock = {
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
};

/** Runs one finite sequence. Time only advances while the diagram is visible. */
export function createTimeline(
  cues: Cue[],
  clock: Clock,
  paint: (cue: Cue, progress: number) => void,
  canStart: (cue: Cue) => boolean,
  onComplete: () => void,
) {
  let visible = false;
  let waiting = false;
  let stopped = false;
  let frame: number | undefined;
  let generation = 0;
  let previous: number | undefined;
  let index = 0;
  let elapsed = 0;

  function schedule() {
    if (!visible || waiting || stopped || frame !== undefined) return;
    const token = ++generation;
    frame = clock.request(now => {
      if (token === generation) tick(now);
    });
  }

  function tick(now: number) {
    frame = undefined;
    if (stopped || !visible) return;
    const cue = cues[index];
    if (elapsed === 0 && !canStart(cue)) {
      waiting = true;
      previous = undefined;
      return;
    }
    if (previous !== undefined) elapsed += now - previous;
    previous = now;
    const progress = Math.min(1, elapsed / cue.duration);
    paint(cue, progress);
    if (progress === 1) {
      elapsed = 0;
      previous = undefined;
      index++;
      if (index === cues.length) {
        stopped = true;
        onComplete();
        return;
      }
    }
    schedule();
  }

  function cancelPending() {
    generation++;
    if (frame !== undefined) clock.cancel(frame);
    frame = undefined;
    previous = undefined;
  }

  return {
    setVisible(next: boolean) {
      if (visible === next || stopped) return;
      visible = next;
      waiting = false;
      if (next) schedule();
      else cancelPending();
    },
    recheck() {
      if (!waiting) return;
      waiting = false;
      schedule();
    },
    dispose() {
      stopped = true;
      cancelPending();
    },
  };
}
