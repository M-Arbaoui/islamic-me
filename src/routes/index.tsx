import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { AiAdvisor } from "@/components/AiAdvisor";
import { HabitTracker } from "@/components/HabitTracker";
import { StagePortrait } from "@/components/StagePortrait";
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
import {
  EMPTY_HABITS,
  STAGES,
  getNextStage,
  getStageFromScore,
  habitScore,
  totalScore,
} from "@/lib/nafs-stages";
import {
  type AppState,
  daysSince,
  freshState,
  loadState,
  recordRelapse,
  saveState,
} from "@/lib/nafs-storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مجاهدة النفس — ارتقِ بين مراحل النفس العشر" },
      {
        name: "description",
        content:
          "تطبيق إسلامي لتتبع الصلوات والقرآن والذكر والانضباط، مع مرشد ذكي يجلدك أو يحفّزك حسب حالك.",
      },
      { property: "og:title", content: "مجاهدة النفس" },
      {
        property: "og:description",
        content: "ارتقِ من النفس الأمّارة إلى المطمئنّة. تتبع، حاسب، جاهد.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const streakDays = useMemo(() => (state ? daysSince(state.startDate) : 0), [state]);
  const today = state?.todayHabits ?? EMPTY_HABITS;
  const todayPts = habitScore(today);
  const score = totalScore(streakDays, today);
  const stage = getStageFromScore(score);
  const next = getNextStage(score);
  const progressPct = next
    ? Math.min(100, Math.round(((score - stage.minScore) / (next.minScore - stage.minScore)) * 100))
    : 100;

  function updateHabits(h: typeof EMPTY_HABITS) {
    setState((prev) => (prev ? { ...prev, todayHabits: h } : prev));
  }

  function onRelapse() {
    setState((prev) => (prev ? recordRelapse(prev) : prev));
  }

  function onResetAll() {
    setState(freshState());
  }

  if (!state) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className={`relative min-h-screen tone-${stage.toneId} pb-28 overflow-hidden`}>
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 max-w-md mx-auto glass border-b border-border/40 px-4 py-3 flex items-center justify-between rounded-b-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--tone)] to-[var(--violet)] flex items-center justify-center text-lg shadow-lg shadow-[var(--tone-glow)]">
            ☪
          </div>
          <div>
            <h1 className="text-sm font-black leading-none text-foreground">مُجاهَدة النفس</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
              Mujāhadat an-Nafs
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-xs">إعادة</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-popover border-border" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>إعادة كل شيء؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم محو سجلك بالكامل: الأيام، الانتكاسات، والعبادات المسجّلة.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={onResetAll}>نعم، أعد</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5 space-y-5">
        <StagePortrait stage={stage} streakDays={streakDays} />

        {/* Progress to next stage */}
        <section className="glass rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold tracking-wider uppercase">
            <span className="text-muted-foreground">
              {next ? `المرحلة التالية: ${next.name}` : "بلغتَ القمّة"}
            </span>
            <span className="text-[var(--gold)] font-mono">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, var(--emerald), var(--gold))",
              }}
            />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-2">
          <Stat label="أطول صمود" value={Math.max(state.bestStreak, streakDays)} accent="gold" />
          <Stat label="نقاط اليوم" value={`${todayPts}/5`} accent="emerald" />
          <Stat label="الانتكاسات" value={state.totalRelapses} accent="weak" />
        </section>

        <HabitTracker habits={today} onChange={updateHabits} />

        <AiAdvisor stage={stage} streakDays={streakDays} todayScore={todayPts} habits={today} />

        {/* Roadmap */}
        <section className="glass rounded-3xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-black">خريطة مراحل النفس</h2>
            <span className="text-[9px] font-mono text-muted-foreground">١٠ مراحل</span>
          </div>
          <ol className="divide-y divide-border/30">
            {STAGES.map((s) => {
              const reached = score >= s.minScore;
              const current = s.index === stage.index;
              return (
                <li
                  key={s.index}
                  className={`flex items-center gap-3 px-5 py-3 ${current ? "bg-[var(--tone-soft)]" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      reached
                        ? "bg-gradient-to-br from-[var(--gold)] to-[var(--emerald)] text-[oklch(0.18_0.02_150)]"
                        : "bg-muted/60 text-muted-foreground border border-border/40"
                    }`}
                  >
                    {s.index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-bold truncate ${
                        current ? "text-[var(--tone)]" : reached ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">{s.english}</div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {s.minScore} نقطة
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Relapse */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold"
            >
              <AlertTriangle className="w-4 h-4 ml-1.5" />
              استسلمت — تسجيل انتكاسة
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-popover border-border" dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل سقطت فعلاً؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيُعاد العدّاد إلى الصفر، ولكن لا تيأس من رحمة الله. {`"`}إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ{`"`} — هود ١١٤.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>تراجعت، سأصمد</AlertDialogCancel>
              <AlertDialogAction
                onClick={onRelapse}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                نعم، استسلمت
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="text-center text-[10px] text-muted-foreground py-4">
          البيانات محفوظة محلياً على جهازك فقط · صُنع بنيّة الإصلاح
        </footer>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "gold" | "emerald" | "weak";
}) {
  const color =
    accent === "gold"
      ? "text-[var(--gold)]"
      : accent === "emerald"
        ? "text-[var(--emerald)]"
        : "text-destructive";
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className={`text-xl font-mono font-black ${color}`}>{value}</div>
      <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-1">
        {label}
      </div>
    </div>
  );
}
