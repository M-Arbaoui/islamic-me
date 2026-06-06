import { type CSSProperties } from "react";

import { RANK_PORTRAITS } from "@/lib/rank-portraits";

// Character portrait card — ocean-themed, clean character medallion (no star/spike chrome).

type Props = {
  tier: number;
  size?: number;
  locked?: boolean;
  className?: string;
};

export function RankBadge({ tier, size = 96, locked = false, className = "" }: Props) {
  const t = Math.max(0, Math.min(9, tier));
  const portrait = RANK_PORTRAITS[t];
  const id = `rb-${t}`;
  const style: CSSProperties = {
    filter: locked
      ? "drop-shadow(0 2px 6px oklch(0.18 0.06 250 / 0.45))"
      : "drop-shadow(0 6px 18px var(--tone-glow))",
    opacity: locked ? 0.85 : 1,
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 120 120" className="absolute inset-0">
        <defs>
          <radialGradient id={`${id}-aura`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--tone-glow)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--tone)" />
            <stop offset="100%" stopColor="var(--foam)" />
          </linearGradient>
          <clipPath id={`${id}-clip`}>
            <circle cx="60" cy="60" r="46" />
          </clipPath>
        </defs>

        {/* soft aura */}
        {!locked && <circle cx={60} cy={60} r={58} fill={`url(#${id}-aura)`} />}

        {/* portrait — character front and center */}
        {locked ? (
          <g clipPath={`url(#${id}-clip)`}>
            <rect x={14} y={14} width={92} height={92} fill="var(--parchment-deep)" />
            <image
              href={portrait}
              x={14}
              y={14}
              width={92}
              height={92}
              preserveAspectRatio="xMidYMid slice"
              style={{ filter: "grayscale(1) brightness(0.55) opacity(0.55)" }}
            />
            <g transform="translate(60 62)">
              <rect x={-9} y={-3} width={18} height={14} rx={3} fill="var(--ocean-bright)" opacity={0.9} />
              <path d="M -5 -3 V -8 a 5 5 0 0 1 10 0 V -3" fill="none" stroke="var(--ocean-bright)" strokeWidth={2} opacity={0.9} />
            </g>
          </g>
        ) : (
          <image
            href={portrait}
            x={14}
            y={14}
            width={92}
            height={92}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${id}-clip)`}
          />
        )}

        {/* outer ring — ocean → foam gradient */}
        <circle
          cx={60}
          cy={60}
          r={46}
          fill="none"
          stroke={`url(#${id}-ring)`}
          strokeWidth={2.5}
        />
        {/* subtle inner highlight */}
        <circle
          cx={60}
          cy={60}
          r={49}
          fill="none"
          stroke="var(--foam)"
          strokeWidth={0.6}
          opacity={0.4}
        />

        {/* tiny rank chip at bottom */}
        <g transform="translate(60 110)">
          <rect
            x={-12}
            y={-8}
            width={24}
            height={14}
            rx={7}
            fill="var(--ocean-deep)"
            stroke="var(--foam)"
            strokeWidth={0.8}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={9}
            fontWeight={900}
            fill="var(--foam)"
          >
            {String(t + 1).padStart(2, "0")}
          </text>
        </g>
      </svg>
    </div>
  );
}