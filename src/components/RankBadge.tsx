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
            <stop offset="0%" stopColor="oklch(0.96 0.03 82)" />
            <stop offset="100%" stopColor="oklch(0.88 0.05 78)" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx="60" cy="60" r="38" />
          </clipPath>
        </defs>
        {/* 12-point outer star */}
        <polygon
          points={starPoints(12, 56, 46, 60, 60)}
          fill="oklch(0.62 0.13 78)"
          opacity={0.25}
        />
        {/* 8-point inner star */}
        <polygon
          points={starPoints(8, 50, 40, 60, 60)}
          fill={`url(#${id}-bg)`}
          stroke="oklch(0.55 0.13 70)"
          strokeWidth={1.2}
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
          stroke="oklch(0.55 0.13 70)"
          strokeWidth={1.5}
        />
        <circle
          cx={60}
          cy={60}
          r={42}
          fill="none"
          stroke="oklch(0.55 0.13 70)"
          strokeWidth={0.5}
          strokeDasharray="2 2"
          opacity={0.6}
        />
        {/* rank number ribbon */}
        <g transform="translate(60 104)">
          <rect
            x={-14}
            y={-8}
            width={28}
            height={16}
            rx={3}
            fill="oklch(0.94 0.035 82)"
            stroke="oklch(0.55 0.13 70)"
            strokeWidth={1}
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={10}
            fontWeight={900}
            fill="oklch(0.40 0.10 50)"
          >
            {String(t + 1).padStart(2, "0")}
          </text>
        </g>
      </svg>
    </div>
  );
}