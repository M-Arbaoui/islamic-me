import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { HabitTracker } from "@/components/HabitTracker";
import { useNafsState } from "@/hooks/useNafsState";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "عبادات اليوم — مُجاهد النفس" },
      { name: "description", content: "سجّل صلواتك وذِكرك وقرآنك اليومي." },
      { property: "og:title", content: "عبادات اليوم" },
      { property: "og:description", content: "محاسبة يومية لمجاهد النفس." },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const s = useNafsState();
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell title="عبادات اليوم" subtitle="Daily Worship" toneId={s.stage.toneId}>
      <div className="space-y-4">
        <section className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="text-right">
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
              نقاط اليوم
            </div>
            <div className="text-3xl font-mono font-black text-[var(--tone)]">
              {s.todayPts}
              <span className="text-base text-muted-foreground"> / 5</span>
            </div>
          </div>
          <div className="text-5xl">📿</div>
        </section>

        <HabitTracker habits={s.today} onChange={s.updateHabits} />

        <p className="text-center text-[11px] text-muted-foreground leading-relaxed px-4">
          كل ضربة فأس على جدار نفسك تُقرّبك من الفتح. الانتظام يهزم العاصفة.
        </p>
      </div>
    </AppShell>
  );
}