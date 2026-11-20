export const stepDuration = 2900;

export type Playback = {
  index: number;
  mode: "idle" | "playing" | "paused" | "complete";
  remaining: number;
  startedAt: number;
  generation: number;
  frame: number;
};

export const initialPlayback: Playback = {
  index: -1, mode: "idle", remaining: stepDuration, startedAt: 0, generation: 0, frame: 0,
};

type Action =
  | { type: "play" | "pause" | "replay"; now: number }
  | { type: "step"; direction: -1 | 1 }
  | { type: "elapsed"; generation: number; now: number };

export function transitionPlayback(state: Playback, action: Action, last: number): Playback {
  switch (action.type) {
    case "play":
      if (state.mode === "playing") return state;
      if (state.mode === "idle" || state.mode === "complete") {
        return transitionPlayback(state, { type: "replay", now: action.now }, last);
      }
      return { ...state, mode: "playing", startedAt: action.now, generation: state.generation + 1 };
    case "pause":
      if (state.mode !== "playing") return state;
      return {
        ...state,
        mode: "paused",
        remaining: Math.max(0, state.remaining - (action.now - state.startedAt)),
        generation: state.generation + 1,
      };
    case "replay":
      return {
        index: 0, mode: "playing", remaining: stepDuration, startedAt: action.now,
        generation: state.generation + 1, frame: state.frame + 1,
      };
    case "step": {
      const index = Math.min(last, Math.max(0, state.index + action.direction));
      if ((state.index === -1 && action.direction === -1) || index === state.index) return state;
      return {
        ...state, index, mode: "paused", remaining: stepDuration,
        generation: state.generation + 1, frame: state.frame + 1,
      };
    }
    case "elapsed":
      if (state.mode !== "playing" || action.generation !== state.generation) return state;
      if (state.index === last) {
        return { ...state, mode: "complete", remaining: 0 };
      }
      return {
        ...state, index: state.index + 1, remaining: stepDuration, startedAt: action.now,
        generation: state.generation + 1, frame: state.frame + 1,
      };
  }
}
