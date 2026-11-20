export function HeroGeometry() {
  return (
    <svg className="hero-geometry" viewBox="0 0 420 360" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-board-fade">
          <stop stopColor="black" />
          <stop offset=".25" stopColor="white" stopOpacity=".7" />
          <stop offset=".72" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id="hero-board-mask">
          <rect width="420" height="360" fill="url(#hero-board-fade)" />
        </mask>
      </defs>
      <g mask="url(#hero-board-mask)" transform="rotate(-5 210 180)">
        {Array.from({ length: 36 }, (_, index) => {
          const row = Math.floor(index / 6);
          const column = index % 6;
          const selected = row === 2 && column === 4;
          return (
            <rect
              key={index}
              x={column * 59 + 32}
              y={row * 59 + 3}
              width="58"
              height="58"
              fill={selected ? "#718b74" : (row + column) % 2 ? "#496553" : "#202b23"}
              fillOpacity={selected ? .38 : .32}
              stroke={selected ? "#c0a170" : "#496553"}
              strokeOpacity={selected ? .55 : .1}
              strokeWidth={selected ? 1.2 : .5}
            />
          );
        })}
      </g>
    </svg>
  );
}
