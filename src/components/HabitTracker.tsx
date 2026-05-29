import { Check, X } from "lucide-react";

import type { DailyHabits } from "@/lib/nafs-stages";

type Props = {
  habits: DailyHabits;
  onChange: (next: DailyHabits) => void;
};

const PRAYERS = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];

export function HabitTracker({ habits, onChange }: Props) {
  function setPrayers(n: number) {
    onChange({ ...habits, prayers: n });
  }
  function toggle<K extends keyof DailyHabits>(key: K) {
    onChange({ ...habits, [key]: !habits[key] } as DailyHabits);
  }

  return (
    <section className="glass rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black">عبادات اليوم</h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          محاسبة يومية
        </span>
      </div>

      {/* 5 prayers */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-muted-foreground">الصلوات الخمس</span>
          <span className="text-xs font-mono text-[var(--gold)]">{habits.prayers}/5</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {PRAYERS.map((name, i) => {
            const active = habits.prayers > i;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setPrayers(active && habits.prayers === i + 1 ? i : i + 1)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 border transition-all active:scale-95 ${
                  active
                    ? "bg-[var(--emerald)]/25 border-[var(--emerald)]/60 text-foreground"
                    : "bg-muted/40 border-border/40 text-muted-foreground"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active ? "bg-[var(--emerald)] text-white" : "bg-muted border border-border/40"
                  }`}
                >
                  {active ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <span className="text-[10px] font-bold">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other habits */}
      <div className="grid grid-cols-2 gap-2">
        <HabitToggle label="قراءة قرآن" hint="ولو صفحة" active={habits.quran} onClick={() => toggle("quran")} />
        <HabitToggle label="ذِكر" hint="سبحان الله…" active={habits.dhikr} onClick={() => toggle("dhikr")} />
        <HabitToggle label="ضبط النفس" hint="بلا انتكاسة" active={habits.restraint} onClick={() => toggle("restraint")} />
        <HabitToggle label="عمل صالح" hint="ابتسامة، صدقة…" active={habits.goodDeed} onClick={() => toggle("goodDeed")} />
      </div>
    </section>
  );
}

function HabitToggle({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between gap-2 rounded-xl py-3 px-3 border transition-all active:scale-[0.97] text-right ${
        active
          ? "bg-[var(--emerald)]/20 border-[var(--emerald)]/50"
          : "bg-muted/40 border-border/40"
      }`}
    >
      <div>
        <div className="text-sm font-bold text-foreground">{label}</div>
        <div className="text-[10px] text-muted-foreground">{hint}</div>
      </div>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          active ? "bg-[var(--emerald)] text-white" : "bg-muted border border-border/50 text-muted-foreground"
        }`}
      >
        {active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </div>
    </button>
  );
}