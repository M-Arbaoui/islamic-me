import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { RankBadge } from "@/components/RankBadge";
import { useNafsState } from "@/hooks/useNafsState";
import { STAGES } from "@/lib/nafs-stages";
import { RANK_META } from "@/lib/rank-portraits";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "خريطة الرّحلة — مُجاهد النفس" },
      { name: "description", content: "عشر رُتب من الأسير إلى الفاتح." },
      { property: "og:title", content: "خريطة الرّحلة" },
      { property: "og:description", content: "رحلة مجاهد النفس." },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const s = useNafsState();
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell
      title="خريطة الرّحلة"
      subtitle="The Path of Ranks"
      toneId={s.stage.toneId}
    >
      <div className="space-y-4">
        <section className="paper rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
          <Mini value={s.state.totalRelapses} label="انتكاسات" tone="destructive" />
          <Mini value={s.state.bestStreak} label="أطول صمود" tone="gold" />
          <Mini value={`${s.stage.index + 1}/10`} label="رتبتك" tone="tone" />
        </section>

        <section className="paper rounded-3xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-black">رُتب مُجاهدي النفس</h2>
            <span className="text-[9px] font-mono text-muted-foreground">عشر مراتب</span>
          </div>
          <ol className="divide-y divide-border/30">
            {STAGES.map((st) => {
              const reached = s.score >= st.minScore;
              const current = st.index === s.stage.index;
              const meta = RANK_META[st.index];
              return (
                <li
                  key={st.index}
                  className={`flex items-start gap-3 px-5 py-4 ${current ? "bg-[var(--tone-soft)]" : ""}`}
                >
                  <RankBadge tier={st.index} size={64} locked={!reached} />
                  <div className="flex-1 min-w-0 text-right">
                    <div
                      className={`text-sm font-bold truncate ${
                        current
                          ? "text-[var(--tone)]"
                          : reached
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      {st.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{st.english}</div>
                    <div className="text-[11px] text-[var(--ink)]/80 leading-snug mt-1">
                      {meta.desc}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-1">
                    {st.minScore} نقطة
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}

function Mini({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone: "tone" | "gold" | "destructive";
}) {
  const color =
    tone === "tone"
      ? "text-[var(--tone)]"
      : tone === "gold"
        ? "text-[var(--gold-deep)]"
        : "text-destructive";
  return (
    <div>
      <div className={`text-xl font-mono font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-muted-foreground tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}