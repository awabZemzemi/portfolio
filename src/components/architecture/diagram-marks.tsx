import type { StoreMark } from "./model";

export function StoreNotation({ mark, x }: { mark: StoreMark; x: number }) {
  return (
    <g className="architecture-store-mark" transform={`translate(${x} 22)`} aria-hidden="true">
      {mark === "rows" && <path d="M0 1h18v15H0z M0 6h18 M0 11h18 M5 1v15" />}
      {mark === "vector" && <path d="M1 14v-4 M6 14V4 M11 14V1 M16 14V7" />}
      {mark === "relations" && <><path d="M3 3l7 5 6-5 M10 8l6 6" /><circle cx="3" cy="3" r="2" /><circle cx="10" cy="8" r="2" /><circle cx="16" cy="3" r="2" /><circle cx="16" cy="14" r="2" /></>}
    </g>
  );
}

export function RouteSignal() {
  return (
    <g data-route-signal="" className="architecture-signal" aria-hidden="true">
      <circle data-signal-shape="packet" r="4.3" />
      <g data-signal-shape="note">
        <rect x="-6" y="-7" width="12" height="14" rx="1" />
        <path d="M-3 -2h6M-3 1h6M-3 4h4" />
      </g>
      <g data-signal-shape="vector">
        <rect x="-7" y="-6" width="14" height="12" rx="1" />
        <path d="M-4 3v-3 M0 3v-6 M4 3v-4" />
      </g>
      <g data-signal-shape="relations">
        <rect x="-7" y="-7" width="14" height="14" rx="1" />
        <path d="M-4 4l4-7 4 7z" />
        <circle cx="-4" cy="4" r="1" /><circle cx="0" cy="-3" r="1" /><circle cx="4" cy="4" r="1" />
      </g>
      <g data-signal-shape="passages">
        <rect x="-7" y="-5" width="14" height="10" rx="1" />
        <path d="M-4 -1h8M-4 2h6" />
      </g>
    </g>
  );
}
