import assert from "node:assert/strict";
import { test } from "node:test";
import { aiopsDiagram } from "../src/components/architecture/aiops-data.ts";
import { ingestionDiagram, retrievalDiagram } from "../src/components/architecture/knowledge-data.ts";
import { buildCues, createTimeline } from "../src/components/architecture/playback.ts";

function fakeClock() {
  let nextId = 0;
  let now = 0;
  const pending = new Map();
  const all = new Map();
  return {
    request(callback) {
      const id = ++nextId;
      pending.set(id, callback);
      all.set(id, callback);
      return id;
    },
    cancel(id) { pending.delete(id); },
    count() { return pending.size; },
    last() { return nextId; },
    invoke(id) { all.get(id)(now); },
    frame(ms) {
      now += ms;
      const current = [...pending.values()];
      pending.clear();
      for (const callback of current) callback(now);
    },
  };
}

test("cues follow the actual AIOps and Second Brain stage order", () => {
  assert.deepEqual(buildCues(aiopsDiagram.steps).flatMap(cue => cue.edges),
    ["request", "invoke", "select", "dispatch", "query", "read", "evidence", "result", "resume", "diagnosis", "response"]);
  assert.deepEqual(buildCues(ingestionDiagram.steps).slice(-3).map(cue => [cue.edges[0], cue.signal]),
    [["commit", "note"], ["embed", "vector"], ["connect", "relations"]]);
  assert.deepEqual(buildCues(retrievalDiagram.steps).find(cue => cue.edges.length === 2)?.edges, ["passages", "relations"]);
});

const cues = buildCues([
  { label: "first", nodes: [], duration: 100 },
  { label: "second", nodes: [], duration: 100 },
]);

test("scrolling away freezes progress and repeated visibility events schedule one frame", () => {
  const clock = fakeClock();
  const frames = [];
  let completed = 0;
  const timeline = createTimeline(cues, clock, (cue, progress) => frames.push([cue.label, progress]), () => true, () => completed++);
  assert.equal(clock.count(), 0);
  timeline.setVisible(true);
  timeline.setVisible(true);
  assert.equal(clock.count(), 1);
  clock.frame(0);
  clock.frame(50);
  const stale = clock.last();
  timeline.setVisible(false);
  assert.equal(clock.count(), 0);
  clock.frame(700);
  timeline.setVisible(true);
  clock.invoke(stale);
  assert.equal(clock.count(), 1);
  clock.frame(0);
  assert.deepEqual(frames.at(-1), ["first", .5]);
  clock.frame(50);
  clock.frame(0);
  clock.frame(100);
  assert.deepEqual(frames.at(-1), ["second", 1]);
  assert.equal(completed, 1);
  timeline.setVisible(false);
  timeline.setVisible(true);
  assert.equal(clock.count(), 0);
});

test("a segment below the viewport waits without animation work until scrolling", () => {
  const clock = fakeClock();
  let canStart = false;
  let last;
  const timeline = createTimeline(cues, clock, (cue, value) => { last = [cue.label, value]; }, () => canStart, () => {});
  timeline.setVisible(true);
  clock.frame(0);
  assert.equal(last, undefined);
  assert.equal(clock.count(), 0);
  canStart = true;
  timeline.recheck();
  clock.frame(500);
  assert.deepEqual(last, ["first", 0]);
});

test("unmount cleanup cancels pending frames and ignores late notifications", () => {
  const clock = fakeClock();
  const timeline = createTimeline(cues, clock, () => assert.fail("Unexpected paint"), () => true, () => assert.fail("Unexpected completion"));
  timeline.setVisible(true);
  const stale = clock.last();
  timeline.dispose();
  timeline.setVisible(true);
  timeline.recheck();
  clock.invoke(stale);
  assert.equal(clock.count(), 0);
});
