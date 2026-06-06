import { createFileRoute } from "@tanstack/react-router";

import { AiAdvisor } from "@/components/AiAdvisor";
import { AppShell } from "@/components/AppShell";
import { useNafsState } from "@/hooks/useNafsState";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "المُرشد — طوبى" },
      {
        name: "description",
        content: "تحدّث مع المُرشد: صديق روحاني رحيم يُذكّر بالله، يُحفّزك، ولا يلوم.",
      },
      { property: "og:title", content: "المُرشد · طوبى" },
      { property: "og:description", content: "محادثة رحيمة تُذكّرك بالله وتنهض بهمّتك." },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const s = useNafsState();
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell title="المُرشد" subtitle="Tuba · The Gentle Mentor" toneId={s.stage.toneId}>
      <div className="space-y-4">
        <section className="paper rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="text-right flex-1">
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
              رتبتك الحاليّة
            </div>
            <div className="text-lg font-black text-[var(--tone)]">{s.stage.name}</div>
            <div className="text-[10px] text-muted-foreground">
              {s.streakDays} يوم صمود · {s.todayPts}/5 اليوم
            </div>
          </div>
          <div className="text-4xl">🌿</div>
        </section>

        <AiAdvisor
          stage={s.stage}
          streakDays={s.streakDays}
          todayScore={s.todayPts}
          habits={s.today}
        />
      </div>
    </AppShell>
  );
}