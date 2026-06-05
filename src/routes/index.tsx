import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Info,
  RotateCcw,
  Activity,
  Flame,
  Trophy,
  Crosshair,
  Map as MapIcon,
  CircleDot,
  ShieldCheck,
  Radio,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { StagePortrait } from "@/components/StagePortrait";
import { AdhkarCard, QuranCard } from "@/components/DailyWisdom";
import { InstallPwaButton } from "@/components/InstallPwaButton";
import { Onboarding } from "@/components/Onboarding";
import { TodayMission } from "@/components/TodayMission";
import { PrayerTimes } from "@/components/PrayerTimes";
import { ShieldBadge } from "@/components/ShieldBadge";
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
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NAFS — رتبتك اليوم" },
      {
        name: "description",
        content: "NAFS — ارتقِ من الأسير إلى الفاتح. تتبع رحلتك في مجاهدة النفس.",
      },
      { property: "og:title", content: "NAFS — نَفْس" },
      { property: "og:description", content: "رتبتك في طريق مجاهدة النفس." },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useNafsState();
  const { profile } = useProfile();
  const [showInfo, setShowInfo] = useState(false);
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  const now = new Date();
  const hhmm = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  const dateAr = now.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell title="NAFS" subtitle="نَفْس · Self-Jihad" toneId={s.stage.toneId}>
      <Onboarding />
      <div className="space-y-3">
        {/* === COMMAND HEADER === */}
        <section className="hud hud-corners p-4 overflow-hidden relative">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--tone)] pulse-dot shadow-[0_0_8px_var(--tone-glow)]" />
                <span className="text-[10px] mono tracking-[0.25em] text-[var(--tone)] uppercase">
                  Online · في الميدان
                </span>
              </div>
              <div className="text-lg font-black mt-1">
                مرحباً يا{" "}
                <span className="text-[var(--tone)]">{profile?.name || "مجاهد"}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mono">{dateAr}</div>
            </div>
            <div className="text-left">
              <div className="text-2xl mono font-black text-[var(--tone)] leading-none">
                {hhmm}
              </div>
              <div className="text-[9px] mono tracking-widest text-muted-foreground mt-1">
                LOCAL TIME
              </div>
            </div>
          </div>
        </section>

        {/* === RANK STATUS (hero) === */}
        <section className="hud hud-corners p-4 relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
          <div className="relative">
            <StagePortrait
              stage={s.stage}
              streakDays={s.streakDays}
              startDate={s.state.startDate}
            />
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] mono tracking-widest">
                <span className="text-muted-foreground uppercase">
                  {s.next ? `Next · ${s.next.name}` : "MAX RANK ⚔"}
                </span>
                <span className="text-[var(--tone)]">{s.progressPct.toString().padStart(2, "0")}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--input)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${s.progressPct}%`,
                    background: "linear-gradient(90deg, var(--tone), var(--gold))",
                    boxShadow: "0 0 10px var(--tone-glow)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === BENTO STATS GRID === */}
        <section className="grid grid-cols-6 gap-2 auto-rows-[88px]">
          <BentoStat
            className="col-span-3 row-span-2 !h-auto"
            label="STREAK · أيام الصمود"
            value={s.streakDays}
            big
            icon={<Flame className="w-4 h-4" />}
            sub={s.state.shield.available ? "سُترة متاحة" : "بلا سُترة"}
          />
          <BentoStat
            className="col-span-3"
            label="BEST · أطول صمود"
            value={Math.max(s.state.bestStreak, s.streakDays)}
            icon={<Trophy className="w-3.5 h-3.5" />}
            tone="gold"
          />
          <BentoStat
            className="col-span-3"
            label="TODAY · نقاط اليوم"
            value={`${s.todayPts}/5`}
            icon={<Activity className="w-3.5 h-3.5" />}
            tone="emerald"
          />
        </section>

        {/* === MISSION === */}
        <TodayMission habits={s.today} todayPts={s.todayPts} />

        {/* === PRAYER OPS === */}
        <PrayerTimes />

        {/* === BENTO ACTIONS GRID === */}
        <section className="grid grid-cols-2 gap-2">
          <BentoLink
            to="/habits"
            label="العبادات"
            sub="OPS LOG"
            icon={<Crosshair className="w-5 h-5" />}
          />
          <BentoLink
            to="/quran"
            label="القرآن"
            sub="SCRIPTURE"
            icon={<BookOpen className="w-5 h-5" />}
          />
          <BentoLink
            to="/tasbih"
            label="التسبيح"
            sub="DHIKR LOOP"
            icon={<CircleDot className="w-5 h-5" />}
          />
          <BentoLink
            to="/journey"
            label="الرحلة"
            sub="MAP · 10 RANKS"
            icon={<MapIcon className="w-5 h-5" />}
          />
        </section>

        {/* === SHIELD + WISDOM === */}
        <ShieldBadge
          available={s.state.shield.available}
          totalUsed={s.state.shield.totalUsed}
          lastGrantedAt={s.state.shield.lastGrantedAt}
        />

        <AdhkarCard />
        <QuranCard />

        <Link
          to="/guide"
          className="hud hud-corners p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)] ring-tone">
            <Radio className="w-5 h-5" />
          </div>
          <div className="flex-1 text-right">
            <div className="text-[10px] mono tracking-widest text-muted-foreground">
              MURSHID · AI BROADCAST
            </div>
            <div className="text-sm font-black">تواصَل مع المُرشد</div>
          </div>
          <span className="text-[var(--tone)] text-xs font-bold mono">→</span>
        </Link>

        <InstallPwaButton />

        {/* === DANGER ZONE === */}
        <section className="hud p-4 space-y-3 border-destructive/30">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-black mono tracking-wider">DANGER ZONE</h3>
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

        <div className="flex items-center justify-center gap-2 py-2">
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[var(--tone)] transition"
            aria-label="معلومات"
          >
            <Info className="w-3 h-3" />
            {showInfo ? "إخفاء" : "حول التطبيق"}
          </button>
        </div>
        {showInfo && (
          <div className="text-center text-[10px] text-muted-foreground leading-relaxed -mt-1 pb-2">
            البيانات محفوظة محلياً على جهازك فقط · صُنع بنيّة الإصلاح
          </div>
        )}
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

