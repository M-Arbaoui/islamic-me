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
  ListChecks,
  Map as MapIcon,
  CircleDot,
  MessageCircleHeart,
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
      { title: "طوبى — رحلتك مع الله" },
      {
        name: "description",
        content: "طوبى — تطبيق روحاني لتزكية النفس: عدّاد صمودك، مُرشدك الرحيم، وأذكارك اليومية.",
      },
      { property: "og:title", content: "طوبى" },
      { property: "og:description", content: "رحلتك اللطيفة مع الله." },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useNafsState();
  const { profile } = useProfile();
  const [showInfo, setShowInfo] = useState(false);
  if (!s.ready || !s.state) return <div className="min-h-screen" />;

  return (
    <AppShell title="طوبى" subtitle="Tuba · تزكية النفس" toneId={s.stage.toneId}>
      <Onboarding />
      <div className="space-y-4">
        {/* === 1. THE COUNTER — first thing the user sees === */}
        <StagePortrait
          stage={s.stage}
          streakDays={s.streakDays}
          startDate={s.state.startDate}
        />

        {/* === 2. PROGRESS TO NEXT RANK === */}
        <section className="paper rounded-2xl p-3.5">
          <div className="flex justify-between text-[10px] mono tracking-widest mb-2">
            <span className="text-muted-foreground uppercase">
              {s.next ? `التالي · ${s.next.name}` : "أعلى رتبة ✦"}
            </span>
            <span className="text-[var(--tone)]">{s.progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--input)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${s.progressPct}%`,
                background: "linear-gradient(90deg, var(--tone), var(--foam))",
                boxShadow: "0 0 10px var(--tone-glow)",
              }}
            />
          </div>
        </section>

        {/* === 3. QUICK CHAT WITH MURSHID === */}
        <Link
          to="/guide"
          className="block hud hud-corners p-4 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--tone)] to-[var(--foam)] flex items-center justify-center text-primary-foreground shadow-[0_0_20px_var(--tone-glow)]">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <div className="flex-1 text-right">
              <div className="text-[10px] mono tracking-widest text-muted-foreground">
                المُرشد · محادثة
              </div>
              <div className="text-base font-black text-foreground">
                تحدّث معي يا {profile?.name || "صديقي"}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                صديق رحيم يُذكّر ويُحفّز ولا يلوم
              </div>
            </div>
            <span className="text-[var(--tone)] text-lg font-bold">←</span>
          </div>
        </Link>

        {/* === 4. MINI STATS === */}
        <section className="grid grid-cols-3 gap-2">
          <MiniStat
            label="الصمود"
            value={s.streakDays}
            icon={<Flame className="w-3.5 h-3.5" />}
          />
          <MiniStat
            label="الأطول"
            value={Math.max(s.state.bestStreak, s.streakDays)}
            icon={<Trophy className="w-3.5 h-3.5" />}
            tone="gold"
          />
          <MiniStat
            label="اليوم"
            value={`${s.todayPts}/5`}
            icon={<Activity className="w-3.5 h-3.5" />}
            tone="foam"
          />
        </section>

        {/* === 5. TODAY'S MISSION === */}
        <TodayMission habits={s.today} todayPts={s.todayPts} />

        {/* === 6. PRAYER TIMES === */}
        <PrayerTimes />

        {/* === 7. QUICK ACCESS GRID === */}
        <section className="grid grid-cols-2 gap-2">
          <NavTile to="/habits" label="العبادات" icon={<ListChecks className="w-5 h-5" />} />
          <NavTile to="/quran" label="القرآن" icon={<BookOpen className="w-5 h-5" />} />
          <NavTile to="/tasbih" label="التسبيح" icon={<CircleDot className="w-5 h-5" />} />
          <NavTile to="/journey" label="الرحلة" icon={<MapIcon className="w-5 h-5" />} />
        </section>

        {/* === 8. SHIELD + WISDOM === */}
        <ShieldBadge
          available={s.state.shield.available}
          totalUsed={s.state.shield.totalUsed}
          lastGrantedAt={s.state.shield.lastGrantedAt}
        />

        <AdhkarCard />
        <QuranCard />

        <InstallPwaButton />

        {/* === DANGER ZONE === */}
        <section className="paper rounded-2xl p-4 space-y-3 border-destructive/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-black text-foreground">منطقة الإعادة</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            الانتكاسة تُعيد عدّاد الصمود إلى الصفر. لا تتراجع إلا إذا اضطُررت.
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

function MiniStat({
  label,
  value,
  icon,
  tone = "tone",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tone?: "tone" | "gold" | "foam";
}) {
  const color =
    tone === "gold"
      ? "text-[var(--gold)]"
      : tone === "foam"
        ? "text-[var(--foam)]"
        : "text-[var(--tone)]";
  return (
    <div className="paper rounded-2xl p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] mono tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
        <span className={color}>{icon}</span>
      </div>
      <div className={`${color} mono font-black text-2xl leading-none text-left`}>{value}</div>
    </div>
  );
}

function NavTile({
  to,
  label,
  icon,
}: {
  to: "/habits" | "/quran" | "/tasbih" | "/journey" | "/guide";
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="paper rounded-2xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform"
    >
      <span className="w-10 h-10 rounded-xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)]">
        {icon}
      </span>
      <span className="text-sm font-black text-foreground">{label}</span>
    </Link>
  );
}