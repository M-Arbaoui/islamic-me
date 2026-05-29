import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DailyHabits, Stage } from "@/lib/nafs-stages";

type Mode = "roast" | "motivate" | "analyze";

type Props = {
  stage: Stage;
  streakDays: number;
  todayScore: number;
  habits: DailyHabits;
};

const MODE_LABEL: Record<Mode, string> = {
  roast: "اجلدني",
  motivate: "حفّزني",
  analyze: "حلّل اعترافي",
};

export function AiAdvisor({ stage, streakDays, todayScore, habits }: Props) {
  const [confession, setConfession] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ mode: Mode; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(mode: Mode) {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          stageIndex: stage.index,
          stageName: stage.name,
          streakDays,
          todayScore,
          habits,
          userMessage: mode === "analyze" ? confession.trim() : undefined,
        }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("تجاوزت الحد. حاول بعد قليل.");
        if (res.status === 402) throw new Error("نفد الرصيد. أضف رصيداً للمساحة.");
        throw new Error("تعذّر الاتصال بالمرشد.");
      }
      const data = (await res.json()) as { text: string };
      setResponse({ mode, text: data.text });
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass rounded-3xl p-5 space-y-4 tone-ring">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-foreground">المرشد الذكي</h2>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          AI · مجاهَدة
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          disabled={loading}
          onClick={() => ask("roast")}
          className="bg-[oklch(0.45_0.18_25)] hover:bg-[oklch(0.5_0.18_25)] text-white font-bold rounded-xl h-11"
        >
          🔥 {MODE_LABEL.roast}
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={() => ask("motivate")}
          className="bg-[var(--emerald)] hover:opacity-90 text-white font-bold rounded-xl h-11"
        >
          🌿 {MODE_LABEL.motivate}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-muted-foreground tracking-wider">
          اعترف بمبرراتك (اختياري)
        </label>
        <Textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          rows={3}
          maxLength={600}
          placeholder="مثال: متعب اليوم، سأترك صلاة الفجر لمرة واحدة فقط…"
          className="bg-input/60 border-border/60 text-sm rounded-xl resize-none"
        />
        <Button
          type="button"
          disabled={loading || confession.trim().length === 0}
          onClick={() => ask("analyze")}
          className="w-full bg-gradient-to-l from-[var(--gold)] to-[var(--emerald)] text-[oklch(0.18_0.02_150)] font-black rounded-xl h-11"
        >
          🧠 {MODE_LABEL.analyze}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--tone)] animate-pulse" />
          المرشد يتأمّل…
        </div>
      )}

      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-xl p-3">
          {error}
        </div>
      )}

      {response && (
        <div className="animate-fade-up rounded-2xl bg-[var(--tone-soft)] border border-[var(--tone)]/30 p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--tone)]">
            {MODE_LABEL[response.mode]}
          </div>
          <div className="text-sm leading-relaxed text-foreground prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{response.text}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}