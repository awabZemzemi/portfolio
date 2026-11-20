import assert from "node:assert/strict";
import { test } from "node:test";
import { initialPlayback, stepDuration, transitionPlayback } from "../src/components/architecture/playback.ts";

const last = 2;
const go = (state, action) => transitionPlayback(state, action, last);

test("starts idle and makes repeated Play idempotent", () => {
  assert.equal(initialPlayback.index, -1);
  const playing = go(initialPlayback, { type: "play", now: 0 });
  assert.equal(playing.index, 0);
  assert.equal(playing.mode, "playing");
  assert.strictEqual(go(playing, { type: "play", now: 100 }), playing);
});

test("pauses with time remaining and ignores a stale timeout", () => {
  const playing = go(initialPlayback, { type: "play", now: 50 });
  const paused = go(playing, { type: "pause", now: 1050 });
  assert.equal(paused.remaining, stepDuration - 1000);
  const resumed = go(paused, { type: "play", now: 2000 });
  assert.equal(resumed.remaining, paused.remaining);
  assert.equal(resumed.frame, playing.frame);
  assert.strictEqual(go(resumed, { type: "elapsed", generation: playing.generation, now: 3000 }), resumed);
  const next = go(resumed, { type: "elapsed", generation: resumed.generation, now: 2000 + resumed.remaining });
  assert.equal(next.index, 1);
  assert.equal(next.remaining, stepDuration);
});

test("forward and backward select stable frames and clamp at the bounds", () => {
  assert.strictEqual(go(initialPlayback, { type: "step", direction: -1 }), initialPlayback);
  const first = go(initialPlayback, { type: "step", direction: 1 });
  const middle = go(first, { type: "step", direction: 1 });
  const final = go(middle, { type: "step", direction: 1 });
  assert.equal(middle.mode, "paused");
  assert.strictEqual(go(final, { type: "step", direction: 1 }), final);
  assert.equal(go(final, { type: "step", direction: -1 }).index, 1);
});

test("Replay always restarts and the final timeout completes without looping", () => {
  const playing = go(initialPlayback, { type: "play", now: 0 });
  const replayed = go(playing, { type: "replay", now: 35 });
  assert.equal(replayed.index, 0);
  assert.notEqual(replayed.frame, playing.frame);
  let state = replayed;
  for (let step = 1; step <= 3; step++) {
    state = go(state, { type: "elapsed", generation: state.generation, now: step * stepDuration });
  }
  assert.equal(state.index, last);
  assert.equal(state.mode, "complete");
  assert.strictEqual(go(state, { type: "elapsed", generation: state.generation, now: 10000 }), state);
  assert.equal(go(state, { type: "play", now: 10001 }).index, 0);
});
