import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DailyHabits, Stage } from "@/lib/nafs-stages";
import { useProfile } from "@/hooks/useProfile";

type Props = {
  stage: Stage;
  streakDays: number;
  todayScore: number;
  habits: DailyHabits;
};

const STARTERS = [
  "أحسّ بفتور… كيف أستعيد همّتي؟",
  "ذكّرني بفضل الذِّكر اليوم.",
  "كيف أخشع في الصلاة؟",
  "أسأت اليوم… أريد كلمةً ترفعني.",
];

export function AiAdvisor({ stage, streakDays, todayScore, habits }: Props) {
  const { profile } = useProfile();
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages, body }) => ({
        body: {
          messages,
          context: {
            stageIndex: stage.index,
            stageName: stage.name,
            streakDays,
            todayScore,
            habits,
            profile: profile
              ? { name: profile.name, struggle: profile.struggle, goal: profile.goal }
              : undefined,
          },
          ...body,
        },
      }),
    }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    void sendMessage({ text: t });
    setInput("");
  }

  return (
    <section className="hud hud-corners p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)] ring-tone">
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="text-right">
            <h2 className="text-sm font-black text-foreground">المُرشد</h2>
            <p className="text-[10px] mono tracking-widest text-muted-foreground">
              صديقك الروحاني · محادثة
            </p>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="min-h-[260px] max-h-[480px] overflow-y-auto rounded-2xl bg-background/40 border border-border/60 p-3 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              تحدّث بصراحة… بدون أحكام، بدون لوم. مجرد كلمة تنهض بك.
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={busy}
                  className="text-xs text-right rounded-xl border border-border/60 bg-card/60 px-3 py-2 hover:border-[var(--tone)]/50 hover:bg-[var(--tone-soft)] transition disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: UIMessage) => (
          <Bubble key={m.id} message={m} />
        ))}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--tone)]" />
            المُرشد يتأمّل…
          </div>
        )}

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-xl p-2">
            تعذّر الاتصال بالمُرشد. حاول بعد قليل.
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={2}
          maxLength={800}
          placeholder="اكتب ما يجول في صدرك… (Enter للإرسال)"
          className="bg-input/60 border-border/60 text-sm rounded-2xl resize-none flex-1"
          dir="rtl"
        />
        <Button
          type="submit"
          disabled={busy || input.trim().length === 0}
          className="h-11 w-11 p-0 rounded-2xl bg-[var(--tone)] hover:opacity-90 text-primary-foreground shrink-0"
          aria-label="إرسال"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </section>
  );
}

function Bubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();

  if (!text) return null;

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--tone)] text-primary-foreground px-3 py-2 text-sm leading-relaxed shadow-sm"
            : "max-w-[90%] text-sm leading-relaxed text-foreground"
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_strong]:text-[var(--tone)]">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}