import { useState, type FormEvent } from "react";
import { Sword } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";

const STRUGGLES = [
  "الشهوة وغضّ البصر",
  "ترك الصلاة",
  "ضياع الوقت في الشاشات",
  "الكِبر والغضب",
  "اليأس والكسل",
  "أخرى",
];

export function Onboarding() {
  const { profile, ready, update } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [struggle, setStruggle] = useState("");
  const [goal, setGoal] = useState("");

  if (!ready || profile) return null;

  function next(e?: FormEvent) {
    e?.preventDefault();
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }
    update({
      name: name.trim() || "مجاهد",
      struggle: struggle.trim(),
      goal: goal.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  const canNext =
    (step === 0 && name.trim().length >= 1) ||
    (step === 1 && struggle.trim().length >= 1) ||
    (step === 2 && goal.trim().length >= 1);

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-sm paper rounded-3xl p-6 space-y-5 relative">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)] ring-1 ring-[var(--gold-deep)]/40">
            <Sword className="w-7 h-7" />
          </div>
          <h2
            className="text-xl font-black text-[var(--ink)]"
            style={{ fontFamily: "Amiri, serif" }}
          >
            أهلاً بك في رحلة النَّفْس
          </h2>
          <p className="text-[11px] text-muted-foreground">
            ٣ أسئلة قصيرة لنُخصّص لك مرشدك
          </p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full ${
                  i <= step ? "bg-[var(--tone)]" : "bg-[var(--parchment-deep)]"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={next} className="space-y-4">
          {step === 0 && (
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[var(--ink)]">
                ما اسمك يا فارس؟
              </label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="عبدالله، أحمد…"
                className="text-right rounded-xl"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[var(--ink)]">
                أكبر تحدٍّ تواجهه الآن؟
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STRUGGLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStruggle(s)}
                    className={`text-[12px] py-2 px-2 rounded-xl border transition ${
                      struggle === s
                        ? "bg-[var(--tone-soft)] border-[var(--tone)] text-[var(--tone)] font-bold"
                        : "bg-background/40 border-border text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {struggle === "أخرى" && (
                <Input
                  value={struggle === "أخرى" ? "" : struggle}
                  onChange={(e) => setStruggle(e.target.value)}
                  maxLength={80}
                  placeholder="اكتب تحدّيك…"
                  className="text-right rounded-xl mt-2"
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[var(--ink)]">
                ما هدفك في ٣٠ يوماً القادمة؟
              </label>
              <Textarea
                autoFocus
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="مثال: الصلوات الخمس في وقتها، وترك العادة كلياً"
                className="text-right rounded-xl resize-none"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={!canNext}
            className="w-full h-11 rounded-xl bg-[var(--tone)] text-white font-black"
          >
            {step < 2 ? "التالي" : "ابدأ الرحلة ⚔"}
          </Button>
        </form>
      </div>
    </div>
  );
}