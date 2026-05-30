import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StagePortrait } from "@/components/StagePortrait";
import { Button } from "@/components/ui/button";
import { useNafsState } from "@/hooks/useNafsState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مُجاهد النفس — رتبتك اليوم" },
      {
        name: "description",
        content: "ارتقِ من الأسير إلى الفاتح. تتبع رحلتك في مجاهدة النفس بأسلوب فروسي إسلامي.",
      },
      { property: "og:title", content: "مُجاهد النفس" },
      { property: "og:description", content: "رتبتك في طريق مجاهدة النفس." },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useNafsState();
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell title="مُجاهد النفس" subtitle="Mujāhid an-Nafs" toneId={s.stage.toneId}>
      <div className="space-y-4">
        <StagePortrait stage={s.stage} streakDays={s.streakDays} />

        {/* Progress to next rank */}
        <section className="glass rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold tracking-wider">
            <span className="text-muted-foreground">
              {s.next ? `الرتبة التالية: ${s.next.name}` : "بلغتَ القمّة ⚔"}
            </span>
            <span className="text-[var(--tone)] font-mono">{s.progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${s.progressPct}%`,
                background: "linear-gradient(90deg, var(--tone), var(--violet))",
                boxShadow: "0 0 12px var(--tone-glow)",
              }}
            />
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <Stat label="أيام الصمود" value={s.streakDays} accent="tone" />
          <Stat
            label="أطول صمود"
            value={Math.max(s.state.bestStreak, s.streakDays)}
            accent="gold"
          />
          <Stat label="نقاط اليوم" value={`${s.todayPts}/5`} accent="emerald" />
        </section>

        <section className="grid grid-cols-2 gap-2">
          <QuickCard to="/habits" emoji="📿" title="عبادات اليوم" sub="سجّل صلواتك وذِكرك" />
          <QuickCard to="/guide" emoji="🗡️" title="المرشد الذكي" sub="جَلْد، تحفيز، تحليل" />
        </section>

        <Link
          to="/journey"
          className="block glass rounded-2xl p-4 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-sm font-black">خريطة الرُّتب العشر</div>
              <div className="text-[10px] text-muted-foreground">من الأسير إلى الفاتح</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[var(--tone)] pointer-events-none"
            >
              عرض ←
            </Button>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "tone" | "gold" | "emerald";
}) {
  const color =
    accent === "tone"
      ? "text-[var(--tone)]"
      : accent === "gold"
        ? "text-[var(--gold)]"
        : "text-[var(--emerald)]";
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className={`text-xl font-mono font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-muted-foreground tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}

function QuickCard({
  to,
  emoji,
  title,
  sub,
}: {
  to: "/habits" | "/guide" | "/journey";
  emoji: string;
  title: string;
  sub: string;
}) {
  return (
    <Link
      to={to}
      className="glass rounded-2xl p-4 text-right active:scale-[0.98] transition-transform block"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-sm font-black">{title}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </Link>
  );
}
