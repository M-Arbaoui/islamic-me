import type { Stage } from "@/lib/nafs-stages";

type Props = {
  stage: Stage;
  streakDays: number;
};

export function StagePortrait({ stage, streakDays }: Props) {
  return (
    <section className="glass rounded-[2rem] p-5 space-y-4 tone-ring relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30 animate-shimmer"
           style={{ background: "radial-gradient(circle at 50% 30%, var(--tone-glow), transparent 60%)" }} />

      <div className="relative aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-[var(--tone)]/40">
        <img
          src={stage.image}
          alt={stage.name}
          width={1024}
          height={1024}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--tone)]">
              المرحلة {stage.index + 1} / 10
            </div>
            <div className="text-xl font-black text-foreground drop-shadow-lg">{stage.name}</div>
          </div>
          <div className="text-left bg-background/60 backdrop-blur px-3 py-2 rounded-xl border border-border/60">
            <div className="text-2xl font-mono font-black text-[var(--gold)] leading-none">
              {streakDays}
            </div>
            <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-1">
              يوم صمود
            </div>
          </div>
        </div>
      </div>

      <p
        className="text-sm text-center text-muted-foreground italic px-3 py-2 leading-relaxed border-r-2 border-[var(--tone)]/60 bg-muted/40 rounded-l-xl"
        style={{ fontFamily: "Amiri, serif" }}
      >
        {stage.quote}
      </p>
    </section>
  );
}