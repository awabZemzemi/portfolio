export function HeroGeometry() {
  return (
    <svg className="hero-geometry" viewBox="0 0 420 190" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hero-board-fade">
          <stop offset=".25" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
        <mask id="hero-board-mask">
          <ellipse cx="210" cy="95" rx="205" ry="93" fill="url(#hero-board-fade)" />
        </mask>
      </defs>
      <g mask="url(#hero-board-mask)">
        <g transform="matrix(.86 .32 -.86 .32 210 5)">
          {Array.from({ length: 36 }, (_, index) => {
            const row = Math.floor(index / 6);
            const column = index % 6;
            const selected = row === 2 && column === 3;
            return (
              <rect
                key={index}
                x={column * 46}
                y={row * 46}
                width="45"
                height="45"
                fill={selected ? "#a2b29e" : (row + column) % 2 ? "#496553" : "#222a23"}
                fillOpacity={selected ? .4 : .23}
                stroke={selected ? "#c0a170" : "#496553"}
                strokeOpacity={selected ? .65 : .17}
                strokeWidth={selected ? 1.2 : .5}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
