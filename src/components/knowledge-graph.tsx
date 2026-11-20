export function KnowledgeGraph() {
  return (
    <figure className="knowledge-graph">
      <svg viewBox="0 0 370 215" role="img" aria-label="Graph schema. Two notes mention the same entity, which depends on another entity.">
        <defs>
          <marker id="knowledge-edge" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8" fill="#aab7a4" /></marker>
        </defs>
        <g fill="none" stroke="#aab7a4" markerEnd="url(#knowledge-edge)">
          <path d="M78 51C126 51 107 107 151 107" /><path d="M78 165C126 165 107 114 151 114" /><path d="M210 111H302" />
        </g>
        <g fill="#29382d" stroke="#7e947e">
          <rect x="20" y="35" width="58" height="32" rx="3" /><rect x="20" y="149" width="58" height="32" rx="3" />
          <circle cx="181" cy="111" r="29" /><circle cx="330" cy="111" r="28" />
        </g>
        <g textAnchor="middle" fill="#f3efe5" fontSize="13"><text x="49" y="56">Note A</text><text x="49" y="170">Note B</text><text x="181" y="116">Entity</text><text x="330" y="116">Entity</text></g>
        <g fill="#c0a170" fontSize="12" fontFamily="var(--font-mono)"><text x="106" y="54">MENTIONS</text><text x="106" y="174">MENTIONS</text><text x="216" y="99">DEPENDS_ON</text></g>
      </svg>
      <figcaption className="mono-label">Conceptual schema · notes and entities</figcaption>
    </figure>
  );
}
