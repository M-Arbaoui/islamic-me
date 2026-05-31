import { type CSSProperties } from "react";

// 10 unique SVG rank badges matching the streak tiers in StagePortrait.
// Each badge uses Islamic geometric motifs (8-point star, crescent, shield,
// arabesque) layered with tone colors. Index 0 = lowest, 9 = highest.

type Props = {
  tier: number; // 0..9
  size?: number;
  locked?: boolean;
  className?: string;
};

const PALETTE = [
  { ring: "#6b7280", fill: "#1f2937", glyph: "#9ca3af" }, // broken blade
  { ring: "#94a3b8", fill: "#1e293b", glyph: "#cbd5e1" }, // awakened
  { ring: "#a78bfa", fill: "#2e1065", glyph: "#ddd6fe" }, // vigilant
  { ring: "#f472b6", fill: "#500724", glyph: "#fbcfe8" }, // seeker
  { ring: "#fb7185", fill: "#4c0519", glyph: "#fecdd3" }, // warrior
  { ring: "#34d399", fill: "#022c22", glyph: "#a7f3d0" }, // sentinel
  { ring: "#22d3ee", fill: "#083344", glyph: "#a5f3fc" }, // knight
  { ring: "#facc15", fill: "#451a03", glyph: "#fde68a" }, // truthful
  { ring: "#fbbf24", fill: "#3b1d05", glyph: "#fef3c7" }, // conqueror
  { ring: "#fde047", fill: "#3f2d00", glyph: "#fffbeb" }, // triumphant
] as const;

export function RankBadge({ tier, size = 96, locked = false, className = "" }: Props) {
  const t = Math.max(0, Math.min(9, tier));
  const c = PALETTE[t];
  const id = `badge-${t}`;
  const style: CSSProperties = locked
    ? { filter: "grayscale(1) brightness(0.55)", opacity: 0.55 }
    : { filter: `drop-shadow(0 0 12px ${c.ring}80)` };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={c.ring} stopOpacity="0.55" />
          <stop offset="55%" stopColor={c.fill} stopOpacity="1" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.ring} />
          <stop offset="100%" stopColor={c.glyph} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Outer 12-point star rim (Islamic geometric) */}
      <g transform="translate(60 60)">
        <Star12 r={56} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={1.5} opacity={0.7} />
        <circle r={48} fill={`url(#${id}-bg)`} stroke={c.ring} strokeWidth={2} />
        {/* Inner 8-point star */}
        <Star8 r={36} fill="none" stroke={c.glyph} strokeWidth={1} opacity={0.55} />
        {/* Tier-specific glyph */}
        <Glyph tier={t} color={c.glyph} accent={c.ring} />
        {/* Rank number ribbon */}
        <g transform="translate(0 42)">
          <rect x={-14} y={-7} width={28} height={14} rx={3} fill={c.fill} stroke={c.ring} strokeWidth={1} />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={10}
            fontWeight={900}
            fill={c.glyph}
          >
            {String(t + 1).padStart(2, "0")}
          </text>
        </g>
      </g>
    </svg>
  );
}

function Star12({ r, ...rest }: { r: number } & React.SVGProps<SVGPolygonElement>) {
  return <polygon points={starPoints(12, r, r * 0.78)} {...rest} />;
}
function Star8({ r, ...rest }: { r: number } & React.SVGProps<SVGPolygonElement>) {
  return <polygon points={starPoints(8, r, r * 0.6)} {...rest} />;
}
function starPoints(spikes: number, outer: number, inner: number) {
  const pts: string[] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(" ");
}

function Glyph({ tier, color, accent }: { tier: number; color: string; accent: string }) {
  const stroke = { stroke: color, strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (tier) {
    case 0: // broken blade
      return (
        <g>
          <path d="M-2 -22 L 4 -4 L -2 8 L -10 4 Z" {...stroke} />
          <path d="M 6 6 L 14 22" {...stroke} />
          <circle r={2} fill={accent} cx={0} cy={-2} />
        </g>
      );
    case 1: // crescent moon (awakened)
      return (
        <g>
          <path d="M -10 -18 a 20 20 0 1 0 0 36 a 16 16 0 1 1 0 -36 z" fill={color} opacity={0.9} />
          <circle cx={14} cy={-14} r={2.5} fill={accent} />
        </g>
      );
    case 2: // open eye (vigilant)
      return (
        <g>
          <path d="M -22 0 Q 0 -18 22 0 Q 0 18 -22 0 Z" {...stroke} />
          <circle r={6} fill={color} />
          <circle r={2} fill={accent} />
        </g>
      );
    case 3: // crossed swords (seeker)
      return (
        <g>
          <path d="M -18 -18 L 14 14" {...stroke} />
          <path d="M 18 -18 L -14 14" {...stroke} />
          <circle r={3} fill={accent} />
        </g>
      );
    case 4: // shield with cross strap (warrior)
      return (
        <g>
          <path d="M 0 -22 L 18 -14 L 14 12 L 0 22 L -14 12 L -18 -14 Z" {...stroke} fill={accent} fillOpacity={0.15} />
          <path d="M 0 -16 L 0 16 M -12 0 L 12 0" {...stroke} />
        </g>
      );
    case 5: // bow & arrow (sentinel)
      return (
        <g>
          <path d="M -16 -16 Q 18 0 -16 16" {...stroke} />
          <path d="M -14 0 L 20 0" {...stroke} />
          <path d="M 20 0 L 14 -4 M 20 0 L 14 4" {...stroke} />
        </g>
      );
    case 6: // horse hoofprint / chevron (knight)
      return (
        <g>
          <path d="M -18 14 L 0 -18 L 18 14" {...stroke} />
          <path d="M -10 14 L 0 -4 L 10 14" {...stroke} />
          <circle cx={0} cy={18} r={3} fill={accent} />
        </g>
      );
    case 7: // 5-point star (truthful)
      return <polygon points={starPoints(5, 22, 9)} fill={accent} stroke={color} strokeWidth={1.5} />;
    case 8: // 8-point rub el hizb filled (conqueror)
      return (
        <g>
          <polygon points={starPoints(8, 22, 10)} fill={accent} stroke={color} strokeWidth={1.5} />
          <circle r={4} fill={color} />
        </g>
      );
    case 9: // crown above star (triumphant)
      return (
        <g>
          <polygon points={starPoints(8, 18, 8)} fill={accent} stroke={color} strokeWidth={1.5} transform="translate(0 4)" />
          <path d="M -16 -14 L -10 -4 L -4 -14 L 0 -2 L 4 -14 L 10 -4 L 16 -14 L 14 -18 L -14 -18 Z" fill={accent} stroke={color} strokeWidth={1.2} transform="translate(0 -8)" />
        </g>
      );
    default:
      return null;
  }
}