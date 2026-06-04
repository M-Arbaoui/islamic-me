import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { useNafsState } from "@/hooks/useNafsState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tasbih")({
  head: () => ({
    meta: [
      { title: "NAFS — التسبيح" },
      { name: "description", content: "عدّاد تسبيح مع حفظ يومي." },
    ],
  }),
  component: TasbihPage,
});

const PRESETS = [
  { label: "سبحان الله", target: 33 },
  { label: "الحمد لله", target: 33 },
  { label: "الله أكبر", target: 34 },
  { label: "لا إله إلا الله", target: 100 },
  { label: "أستغفر الله", target: 100 },
  { label: "اللهم صلِّ على محمد", target: 100 },
];

const KEY = "nafs-tasbih-v1";
type Saved = { date: string; counts: Record<string, number> };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (s.date === todayStr()) return s;
    }
  } catch {
    /* */
  }
  return { date: todayStr(), counts: {} };
}

function TasbihPage() {
  const s = useNafsState();
  const [active, setActive] = useState(PRESETS[0].label);
  const [data, setData] = useState<Saved>(() =>
    typeof window === "undefined" ? { date: todayStr(), counts: {} } : load(),
  );

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const preset = PRESETS.find((p) => p.label === active)!;
  const count = data.counts[active] ?? 0;
  const pct = Math.min(100, Math.round((count / preset.target) * 100));

  function tap() {
    if (navigator.vibrate) navigator.vibrate(15);
    setData((d) => ({
      ...d,
      counts: { ...d.counts, [active]: (d.counts[active] ?? 0) + 1 },
    }));
  }
  function reset() {
    setData((d) => ({ ...d, counts: { ...d.counts, [active]: 0 } }));
  }

  return (
    <AppShell title="التسبيح" subtitle="Dhikr Counter" toneId={s.stage.toneId}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setActive(p.label)}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition ${
                active === p.label
                  ? "bg-[var(--tone)] text-white border-[var(--tone)] font-black"
                  : "bg-background/40 border-border text-muted-foreground"
              }`}
            >
              {p.label}{" "}
              <span className="opacity-60 font-mono">
                {data.counts[p.label] ?? 0}/{p.target}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={tap}
          className="relative w-full aspect-square max-w-sm mx-auto rounded-full paper flex flex-col items-center justify-center active:scale-[0.97] transition-transform overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, var(--tone-soft), var(--parchment) 70%)",
            boxShadow: "0 20px 60px -20px var(--tone-glow)",
          }}
        >
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="var(--parchment-deep)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="var(--tone)"
              strokeWidth="2.5"
              strokeDasharray={`${(pct / 100) * 295.3} 295.3`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          </svg>
          <div className="relative text-center">
            <div
              className="text-2xl font-black text-[var(--ink)]"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {active}
            </div>
            <div className="text-7xl font-black font-mono text-[var(--tone)] mt-2 tabular-nums">
              {count}
            </div>
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest mt-1">
              الهدف {preset.target} · اضغط
            </div>
          </div>
        </button>

        <Button
          onClick={reset}
          variant="outline"
          className="w-full h-11 rounded-xl"
        >
          <RotateCcw className="w-4 h-4 ml-2" />
          صفّر هذا الذكر
        </Button>
      </div>
    </AppShell>
  );
}