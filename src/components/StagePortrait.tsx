import { useEffect, useState } from "react";

import type { Stage } from "@/lib/nafs-stages";
import { RankBadge } from "@/components/RankBadge";

type Props = {
  stage: Stage;
  streakDays: number;
  startDate: string;
};

// Warrior-themed streak tiers (الرتبة بحسب أيام الصمود)
type Tier = {
  min: number;
  name: string;
  english: string;
  emblem: string;
  cry: string;
};

const TIERS: Tier[] = [
  { min: 0, name: "السيف المكسور", english: "Broken Blade", emblem: "🗡️", cry: "ابدأ من جديد." },
  { min: 1, name: "المستيقظ", english: "The Awakened", emblem: "🌒", cry: "بدأت الرحلة." },
  { min: 3, name: "الصّاحي", english: "The Vigilant", emblem: "🌓", cry: "ثبّت قدميك." },
  { min: 7, name: "المُريد", english: "The Seeker", emblem: "⚔️", cry: "أسبوع من العزّ." },
  { min: 14, name: "المُجاهد", english: "The Warrior", emblem: "🛡️", cry: "السيف يلمع." },
  { min: 30, name: "المُرابِط", english: "The Sentinel", emblem: "🏹", cry: "ثابتٌ على الثّغر." },
  { min: 60, name: "الفارس", english: "The Knight", emblem: "🐎", cry: "فارسُ نفسك." },
  { min: 100, name: "الصِّدِّيق", english: "The Truthful", emblem: "⭐", cry: "صدقتَ مع الله." },
  { min: 180, name: "الفاتح", english: "The Conqueror", emblem: "🌟", cry: "فتحت قلعتك." },
  { min: 365, name: "المنصور", english: "The Triumphant", emblem: "👑", cry: "سنةٌ من الصمود." },
];

function getTierIndex(days: number): number {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) if (days >= TIERS[i].min) idx = i;
  return idx;
}

function useLiveElapsed(startIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const start = new Date(startIso).getTime();
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function StagePortrait({ stage, streakDays, startDate }: Props) {
  const { days, hours, minutes, seconds } = useLiveElapsed(startDate);
  const tierIdx = getTierIndex(streakDays);
  const tier = TIERS[tierIdx];

  return (
    <section className="glass rounded-[2rem] p-5 space-y-4 tone-ring relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40 animate-shimmer"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, var(--tone-glow), transparent 60%)",
        }}
      />

      {/* Hero rank badge */}
      <div className="relative flex flex-col items-center gap-2 pt-1">
        <RankBadge tier={tierIdx} size={120} />
        <div className="text-center leading-tight">
          <div className="text-base font-black text-[var(--tone)]" style={{ fontFamily: "Amiri, serif" }}>
            {tier.name}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground tracking-[0.25em] uppercase mt-0.5">
            {tier.english} · rank {tierIdx + 1}/10
          </div>
          <div className="text-[10px] font-bold text-muted-foreground mt-1">
            المرحلة: {stage.name} ({stage.index + 1}/10)
          </div>
        </div>
      </div>

      {/* Live counter — replaces stage image */}
      <div className="relative rounded-2xl border border-[var(--tone)]/40 bg-gradient-to-br from-[var(--tone-soft)] via-background/40 to-background/70 p-5 overflow-hidden">
        <div
          className="absolute -inset-10 opacity-30 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, var(--tone), var(--violet), var(--tone))",
            filter: "blur(40px)",
          }}
        />
        <div className="relative text-center">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground">
            صامدٌ منذ
          </div>
          <div
            className="mt-2 text-7xl font-black font-mono leading-none bg-gradient-to-br from-[var(--tone)] to-[var(--violet)] bg-clip-text text-transparent drop-shadow-[0_0_20px_var(--tone-glow)] tabular-nums"
          >
            {String(days).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] font-bold text-[var(--tone)] tracking-widest">
            {days === 1 ? "يوم" : "يوماً"}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <TimeCell value={hours} label="ساعة" />
            <TimeCell value={minutes} label="دقيقة" />
            <TimeCell value={seconds} label="ثانية" pulse />
          </div>

          <div
            className="mt-4 text-[11px] italic text-muted-foreground"
            style={{ fontFamily: "Amiri, serif" }}
          >
            « {tier.cry} »
          </div>
        </div>
      </div>

      <p
        className="text-sm text-center text-muted-foreground italic px-3 py-2 leading-relaxed border-r-2 border-[var(--tone)]/60 bg-muted/40 rounded-l-xl"
        style={{ fontFamily: "Amiri, serif" }}
      >
        {stage.quote}
      </p>
    </section>
  );
}

function TimeCell({
  value,
  label,
  pulse,
}: {
  value: number;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl bg-background/60 border border-border/50 backdrop-blur py-2">
      <div
        className={`text-2xl font-mono font-black text-foreground tabular-nums ${pulse ? "animate-pulse" : ""}`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] font-bold text-muted-foreground tracking-widest mt-0.5">
        {label}
      </div>
    </div>
  );
}