const pins = [55, 63, 71, 79, 87, 95];
const traces = [
  "M52 58H36L24 46H9", "M52 70H21L12 61H5", "M52 86H36L24 98H8",
  "M60 52V30L48 18V6", "M76 52V32L88 20V7", "M90 52V39L107 22V9",
  "M100 62H117L131 48H145", "M100 78H128L140 66H146", "M100 90H116L132 106H144",
  "M62 100V113L44 131V143", "M78 100V130L67 141V146", "M92 100V115L108 131V145",
];

function Board({ y, layer }: { y: number; layer: number }) {
  const top = layer === 0;
  const fill = ["#2e4336", "#233a2c", "#203026"][layer];
  const stroke = ["#92a38b", "#667f68", "#526956"][layer];
  return (
    <g>
      <path d={`M71 ${y + 80} l149 80 149 -80 v6 l-149 80 -149 -80 Z`} fill="#19271e" stroke={stroke} strokeWidth=".85" />
      <g transform={`matrix(1 .54 -1 .54 220 ${y})`}>
        <rect width="148" height="148" fill={fill} stroke={stroke} strokeWidth="1.25" />
        <rect x="3" y="3" width="142" height="142" fill="url(#plate-grid)" stroke={stroke} strokeWidth=".5" />
        {traces.map(d => <path key={d} d={d} fill="none" stroke={top ? "#a0ad8e" : "#73917c"} strokeWidth={top ? 1.2 : 1} />)}
        {[8, 140].flatMap(x => [8, 140].map(cy => <circle key={`${x}-${cy}`} cx={x} cy={cy} r="2" stroke={stroke} fill="#142219" />))}
        {top ? (
          <>
            {pins.map(p => <g key={p} stroke="#c5ad80" strokeWidth="2.1"><path d={`M${p} 46v6 M${p} 98v6 M46 ${p}h6 M98 ${p}h6`} /></g>)}
            <rect x="52" y="52" width="46" height="46" rx="1" fill="#17221a" stroke="#b1b99c" strokeWidth="1.4" />
            <rect x="57" y="57" width="36" height="36" fill="#3c4b39" stroke="#8d9a7e" />
            {[0, 1, 2, 3].flatMap(i => [0, 1, 2, 3].map(j => <rect key={`${i}-${j}`} x={62 + i * 6.7} y={62 + j * 6.7} width="5.8" height="5.8" fill={(i + j) % 2 ? "#435340" : "#839078"} />))}
            {[[12, 28], [102, 31], [18, 110], [113, 116]].map(([x, y]) => <g key={x}><rect x={x} y={y} width="18" height="7" fill="#1a281f" stroke={stroke} />{[3, 7, 11, 15].map(p => <path key={p} d={`M${x + p} ${y - 2}v2 m0 7v2`} stroke="#a5af95" />)}</g>)}
          </>
        ) : <rect x="48" y="48" width="53" height="53" fill="none" stroke={stroke} />}
      </g>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${232 + i * 6} ${y + 155 - i * 3.24}v2.2`} stroke="#b2b497" strokeWidth="1.5" />)}
    </g>
  );
}

export function Architecture() {
  return (
    <figure className="architecture">
      <svg viewBox="0 0 456 322" role="img" aria-labelledby="arch-title">
        <title id="arch-title">Exploded system diagram with agent, services, and runtime layers</title>
        <defs>
          <pattern id="plate-grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="#9cac94" strokeOpacity=".22" strokeWidth=".6" /></pattern>
          <pattern id="dot-grid" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".72" fill="#768778" /></pattern>
          <radialGradient id="fade"><stop offset=".42" stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient>
          <mask id="field"><ellipse cx="227" cy="160" rx="226" ry="168" fill="url(#fade)" /></mask>
        </defs>
        <rect width="456" height="322" fill="url(#dot-grid)" opacity=".66" mask="url(#field)" />
        <g fill="none" stroke="#6c806c" strokeWidth=".8" strokeDasharray="3 5">
          <path d="M62 225l158 85 164-88 M71 95v127 M369 95v127 M220 21v135" />
        </g>
        <Board y={136} layer={2} />
        <Board y={80} layer={1} />
        <Board y={24} layer={0} />
        <g fill="none" stroke="#b09d77" strokeWidth=".8">
          <path d="M286 64l28-23h27 M329 186l24-19h18 M121 248l-24 21H69" />
        </g>
        <g fill="#c0a170"><circle cx="286" cy="64" r="2" /><circle cx="329" cy="186" r="2" /><circle cx="121" cy="248" r="2" /></g>
        <g className="diagram-type" fill="#c2c8b9"><text x="346" y="45">AGENT</text><text x="376" y="171">SERVICES</text><text x="12" y="273">RUNTIME</text></g>
      </svg>
      <figcaption><span aria-hidden="true" />System architecture<span aria-hidden="true" /></figcaption>
    </figure>
  );
}
