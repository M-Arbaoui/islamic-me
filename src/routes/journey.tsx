import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { RankBadge } from "@/components/RankBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNafsState } from "@/hooks/useNafsState";
import { STAGES } from "@/lib/nafs-stages";

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

  const resetBtn = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-xs">إعادة</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-popover border-border" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>إعادة كل شيء؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيُمحى سجلك بالكامل: الأيام، الانتكاسات، والعبادات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={s.onResetAll}>نعم، أعد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <AppShell
      title="خريطة الرّحلة"
      subtitle="The Path of Ranks"
      toneId={s.stage.toneId}
      rightSlot={resetBtn}
    >
      <div className="space-y-4">
        <section className="glass rounded-2xl p-4 grid grid-cols-3 gap-3 text-center">
          <Mini value={s.state.totalRelapses} label="انتكاسات" tone="destructive" />
          <Mini value={s.state.bestStreak} label="أطول صمود" tone="gold" />
          <Mini value={`${s.stage.index + 1}/10`} label="رتبتك" tone="tone" />
        </section>

        <section className="glass rounded-3xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-black">رُتب مُجاهدي النفس</h2>
            <span className="text-[9px] font-mono text-muted-foreground">عشر مراتب</span>
          </div>
          <ol className="divide-y divide-border/30">
            {STAGES.map((st) => {
              const reached = s.score >= st.minScore;
              const current = st.index === s.stage.index;
              return (
                <li
                  key={st.index}
                  className={`flex items-center gap-3 px-5 py-3 ${current ? "bg-[var(--tone-soft)]" : ""}`}
                >
                  <RankBadge tier={st.index} size={52} locked={!reached} />
                  <div className="flex-1 min-w-0 text-right">
                    <div
                      className={`text-sm font-bold truncate ${
                        current
                          ? "text-[var(--tone)]"
                          : reached
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {st.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">{st.english}</div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {st.minScore} نقطة
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold"
            >
              <AlertTriangle className="w-4 h-4 ml-1.5" />
              سقطتُ — تسجيل انتكاسة
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-popover border-border" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل سقطت فعلاً؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيُعاد العدّاد إلى الصفر، ولا تيأس من رحمة الله.
                {` `}«إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ» — هود ١١٤.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>تراجعت، سأصمد</AlertDialogCancel>
              <AlertDialogAction
                onClick={s.onRelapse}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                نعم، سقطت
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="text-center text-[10px] text-muted-foreground py-2">
          البيانات محفوظة محلياً على جهازك فقط · صُنع بنيّة الإصلاح
        </footer>
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
        ? "text-[var(--gold)]"
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