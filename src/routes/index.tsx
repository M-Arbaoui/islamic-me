import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { StagePortrait } from "@/components/StagePortrait";
import { AdhkarCard, QuranCard } from "@/components/DailyWisdom";
import { InstallPwaButton } from "@/components/InstallPwaButton";
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
        <StagePortrait
          stage={s.stage}
          streakDays={s.streakDays}
          startDate={s.state.startDate}
        />

        {/* Progress to next rank */}
        <section className="paper rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold tracking-wider">
            <span className="text-muted-foreground">
              {s.next ? `الرتبة التالية: ${s.next.name}` : "بلغتَ القمّة ⚔"}
            </span>
            <span className="text-[var(--tone)] font-mono">{s.progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--parchment-deep)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${s.progressPct}%`,
                background: "linear-gradient(90deg, var(--tone), var(--gold-deep))",
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

        {/* Daily wisdom */}
        <AdhkarCard />
        <QuranCard />

        <section className="grid grid-cols-2 gap-2">
          <QuickCard to="/habits" emoji="📿" title="عبادات اليوم" sub="سجّل صلواتك وذِكرك" />
          <QuickCard to="/guide" emoji="🗡️" title="المرشد الذكي" sub="جَلْد، تحفيز، تحليل" />
        </section>

        <Link
          to="/journey"
          className="block paper rounded-2xl p-4 active:scale-[0.98] transition-transform"
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

        {/* Install + Reset */}
        <InstallPwaButton />

        <section className="paper rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-black">منطقة الخطر</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            الانتكاسة تُعيد عدّاد الصمود إلى الصفر. إعادة الضبط الكلّيّة تمحو كل سجلك. لا
            تتراجع إلا إذا اضطُررت.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15 font-bold text-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 ml-1" />
                  سجّل انتكاسة
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-popover border-border" dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>هل سقطت فعلاً؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيُعاد العدّاد إلى الصفر. «إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ» — هود ١١٤.
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-border bg-muted text-muted-foreground font-bold text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 ml-1" />
                  إعادة كل شيء
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-popover border-border" dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>إعادة كل شيء؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيُمحى سجلك بالكامل: الأيام، الانتكاسات، والعبادات. لا يمكن التراجع.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={s.onResetAll}>نعم، أعد</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        <footer className="text-center text-[10px] text-muted-foreground py-2 leading-relaxed">
          البيانات محفوظة محلياً على جهازك فقط · صُنع بنيّة الإصلاح
        </footer>
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
        ? "text-[var(--gold-deep)]"
        : "text-[var(--emerald)]";
  return (
    <div className="paper rounded-2xl p-3 text-center">
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
      className="paper rounded-2xl p-4 text-right active:scale-[0.98] transition-transform block"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-sm font-black">{title}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </Link>
  );
}
