import { createFileRoute } from "@tanstack/react-router";

import { AiAdvisor } from "@/components/AiAdvisor";
import { AppShell } from "@/components/AppShell";
import { useNafsState } from "@/hooks/useNafsState";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "المرشد الذكي — مُجاهد النفس" },
      {
        name: "description",
        content: "مرشد ذكي يجلدك حين تضعف، يحفّزك حين تصمد، ويحلّل اعترافاتك.",
      },
      { property: "og:title", content: "المرشد الذكي" },
      { property: "og:description", content: "AI روحاني لمجاهدة النفس." },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const s = useNafsState();
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell title="المرشد الذكي" subtitle="The AI Mentor" toneId={s.stage.toneId}>
      <div className="space-y-4">
        <section className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="text-right flex-1">
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
              رتبتك الحاليّة
            </div>
            <div className="text-lg font-black text-[var(--tone)]">{s.stage.name}</div>
            <div className="text-[10px] text-muted-foreground">
              {s.streakDays} يوم صمود · {s.todayPts}/5 اليوم
            </div>
          </div>
          <div className="text-4xl">🗡️</div>
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