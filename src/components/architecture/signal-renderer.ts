import type { Cue } from "./playback";

export function createSignalRenderer(viewport: HTMLElement, canvases: SVGSVGElement[]) {
  let canvas: SVGSVGElement | undefined;
  let previousCue: Cue | undefined;
  let nodes = new Map<string, SVGGElement>();
  let edges = new Map<string, { group: SVGGElement; path: SVGPathElement; length?: number }>();
  const active = new Set<SVGElement>();
  let signals: SVGGElement[] = [];

  function clear() {
    for (const element of active) delete element.dataset.active;
    active.clear();
    previousCue = undefined;
    delete viewport.dataset.inspect;
  }

  function selectCanvas() {
    const next = canvases.find(svg => svg.getClientRects().length > 0);
    if (canvas === next) return;
    clear();
    canvas = next;
    nodes = new Map(Array.from(canvas?.querySelectorAll<SVGGElement>("[data-diagram-node]") ?? [],
      group => [group.dataset.diagramNode!, group]));
    edges = new Map();
    signals = Array.from(canvas?.querySelectorAll<SVGGElement>("[data-route-signal]") ?? []);
    for (const group of canvas?.querySelectorAll<SVGGElement>("[data-diagram-edge]") ?? []) {
      const id = group.dataset.diagramEdge!;
      const path = group.querySelector<SVGPathElement>("[data-edge-path]");
      if (path) edges.set(id, { group, path });
    }
  }

  function highlight(element?: SVGElement) {
    if (!element || active.has(element)) return;
    element.dataset.active = "true";
    active.add(element);
  }

  return {
    selectCanvas,
    clear,
    canStart(cue: Cue) {
      const bottom = window.innerHeight - 40;
      // Wait for segments below the fold, especially on the tall mobile diagrams.
      // Earlier segments are allowed to finish if the reader scrolls past them.
      return cue.edges.length
        ? cue.edges.some(id => (edges.get(id)?.path.getBoundingClientRect().top ?? Infinity) < bottom)
        : cue.nodes.some(id => (nodes.get(id)?.getBoundingClientRect().top ?? Infinity) < bottom);
    },
    paint(cue: Cue, progress: number) {
      if (cue !== previousCue) {
        clear();
        previousCue = cue;
        viewport.dataset.cue = cue.label;
      }
      const travel = Math.min(1, progress / .86);
      // Keep motion legible at corners, with only a slight ease into the destination.
      const eased = travel + .15 * travel * (1 - travel);
      for (const [index, id] of cue.edges.entries()) {
        const edge = edges.get(id);
        const signal = signals[index];
        if (!edge || !signal) continue;
        highlight(edge.group);
        highlight(nodes.get(edge.group.dataset.from ?? ""));
        if (travel > .78) highlight(nodes.get(edge.group.dataset.to ?? ""));
        edge.length ??= edge.path.getTotalLength();
        const { x, y } = edge.path.getPointAtLength(edge.length * eased);
        highlight(signal);
        signal.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        signal.setAttribute("fill", edge.group.dataset.signalColor ?? "currentColor");
        signal.dataset.shape = edge.group.dataset.signalShapeOverride || cue.signal;
        signal.style.opacity = String(Math.min(1, progress * 13, (1 - progress) * 12));
      }
      if (cue.edges.length === 0 || travel > .78) {
        if (cue.inspect) viewport.dataset.inspect = cue.inspect;
        for (const id of cue.nodes) highlight(nodes.get(id));
      }
    },
  };
}
