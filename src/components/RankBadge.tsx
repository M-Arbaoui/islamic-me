import { type CSSProperties } from "react";

import { RANK_PORTRAITS } from "@/lib/rank-portraits";

// Illustrated warrior portrait inside an ornate manuscript medallion.

type Props = {
  tier: number;
  size?: number;
  locked?: boolean;
  className?: string;
};

function starPoints(spikes: number, outer: number, inner: number, cx = 0, cy = 0) {
  const pts: string[] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}

export function RankBadge({ tier, size = 96, locked = false, className = "" }: Props) {
  const t = Math.max(0, Math.min(9, tier));
  const portrait = RANK_PORTRAITS[t];
  const id = `rb-${t}`;
  const style: CSSProperties = locked
    ? { filter: "grayscale(0.9) sepia(0.4) brightness(0.85)", opacity: 0.55 }
    : { filter: "drop-shadow(0 4px 10px oklch(0.30 0.06 50 / 0.35))" };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 120 120" className="absolute inset-0">
        <defs>
          <radialGradient id={`${id}-bg`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="var(--parchment)" />
            <stop offset="100%" stopColor="var(--parchment-deep)" />
          </radialGradient>
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--tone-glow)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx="60" cy="60" r="38" />
          </clipPath>
        </defs>
        {/* outer aura */}
        {!locked && (
          <circle cx={60} cy={60} r={58} fill={`url(#${id}-glow)`} />
        )}
        {/* 12-point outer star */}
        <polygon
          points={starPoints(12, 56, 46, 60, 60)}
          fill="var(--gold)"
          opacity={locked ? 0.15 : 0.30}
        />
        {/* 8-point inner star */}
        <polygon
          points={starPoints(8, 50, 40, 60, 60)}
          fill={`url(#${id}-bg)`}
          stroke="var(--gold-deep)"
          strokeWidth={1.4}
        />
        {/* portrait clipped to circle */}
        <image
          href={portrait}
          x={22}
          y={22}
          width={76}
          height={76}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-clip)`}
        />
        {/* gold ring */}
        <circle
          cx={60}
          cy={60}
          r={38}
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth={1.8}
        />
        <circle
          cx={60}
          cy={60}
          r={42}
          fill="none"
          stroke="var(--gold-deep)"
          strokeWidth={0.5}
          strokeDasharray="2 2"
          opacity={0.6}
        />
        {/* crown for top ranks */}
        {t >= 8 && !locked && (
          <g transform="translate(60 18)">
            <polygon
              points="-10,4 -6,-4 -2,2 0,-6 2,2 6,-4 10,4"
              fill="var(--gold)"
              stroke="var(--gold-deep)"
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          </g>
        )}
        {/* rank number ribbon */}
        <g transform="translate(60 104)">
          <rect
            x={-14}
            y={-8}
            width={28}
            height={16}
            rx={3}
            fill="var(--parchment)"
            stroke="var(--gold-deep)"
            strokeWidth={1}
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={10}
            fontWeight={900}
            fill="var(--ink)"
          >
            {String(t + 1).padStart(2, "0")}
          </text>
        </g>
      </svg>
    </div>
  );
}