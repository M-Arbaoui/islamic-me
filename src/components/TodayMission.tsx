import { Link } from "@tanstack/react-router";
import { Target } from "lucide-react";

import type { DailyHabits } from "@/lib/nafs-stages";

type Props = {
  habits: DailyHabits;
  todayPts: number;
};

type Mission = { title: string; sub: string; to: "/habits" | "/guide" };

function pickMission(h: DailyHabits): Mission {
  if (h.prayers < 5)
    return {
      title: "أتمم صلوات اليوم",
      sub: `${h.prayers}/5 — صلاتك سيفك الأول`,
      to: "/habits",
    };
  if (!h.quran)
    return { title: "اقرأ ورداً من القرآن", sub: "ولو خمس آيات", to: "/habits" };
  if (!h.dhikr)
    return { title: "اشتغل بالذكر", sub: "سبحان الله وبحمده ×١٠٠", to: "/habits" };
  if (!h.restraint)
    return { title: "اضبط نفسك مرّةً اليوم", sub: "غُضّ بصرك، اكبح غضبك", to: "/habits" };
  if (!h.goodDeed)
    return { title: "افعل خيراً ولو صغيراً", sub: "بسمة، صدقة، عَون", to: "/habits" };
  return {
    title: "اكتب اعترافك للمرشد",
    sub: "تأمَّل يومك بصدقٍ جراحي",
    to: "/guide",
  };
}

export function TodayMission({ habits, todayPts }: Props) {
  const m = pickMission(habits);
  const done = todayPts >= 5;

  return (
    <Link
      to={m.to}
      className="paper rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          done
            ? "bg-[var(--emerald)]/15 text-[var(--emerald)]"
            : "bg-[var(--tone-soft)] text-[var(--tone)]"
        }`}
      >
        <Target className="w-6 h-6" />
      </div>
      <div className="flex-1 text-right">
        <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
          مهمّة اليوم
        </div>
        <div className="text-sm font-black text-[var(--ink)]">
          {done ? "أتممت يومك — أكمل الإخلاص" : m.title}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {done ? "النيّةَ النيّة" : m.sub}
        </div>
      </div>
      <div className="text-[var(--tone)] font-black text-xl">←</div>
    </Link>
  );
}