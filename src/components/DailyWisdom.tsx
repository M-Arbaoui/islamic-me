import { useState } from "react";
import { Shuffle, BookOpen, Star } from "lucide-react";

import { ADHKAR, QURAN_PIECES, dailyIndex } from "@/lib/adhkar-quran";

export function AdhkarCard() {
  const [seed, setSeed] = useState(() => dailyIndex(ADHKAR.length));
  const d = ADHKAR[seed % ADHKAR.length];
  return (
    <section className="paper rounded-3xl p-5 relative">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[var(--gold-deep)]" />
          <h3 className="text-sm font-black text-[var(--ink)]">ذِكر اليوم</h3>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => (s + 1 + Math.floor(Math.random() * 3)) % ADHKAR.length)}
          className="text-[var(--sienna)] active:scale-90 transition-transform"
          aria-label="ذِكر آخر"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
      <p
        className="relative z-10 text-center text-[17px] leading-loose text-[var(--ink)] py-2"
        style={{ fontFamily: "Amiri, serif" }}
        dir="rtl"
      >
        {d.ar}
      </p>
      {d.benefit && (
        <p className="relative z-10 text-[11px] text-center text-muted-foreground italic mt-2 leading-relaxed">
          {d.benefit}
        </p>
      )}
      <div className="relative z-10 mt-3 text-[10px] font-mono text-center text-[var(--gold-deep)] tracking-widest">
        {d.ref}
      </div>
    </section>
  );
}

export function QuranCard() {
  const [seed, setSeed] = useState(() => dailyIndex(QURAN_PIECES.length, 3));
  const q = QURAN_PIECES[seed % QURAN_PIECES.length];
  return (
    <section className="paper rounded-3xl p-5 relative">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--emerald)]" />
          <h3 className="text-sm font-black text-[var(--ink)]">آيةٌ من القرآن</h3>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => (s + 1 + Math.floor(Math.random() * 3)) % QURAN_PIECES.length)}
          className="text-[var(--emerald)] active:scale-90 transition-transform"
          aria-label="آيةٌ أخرى"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
      <p
        className="relative z-10 text-center text-[19px] leading-loose text-[var(--ink)] py-2"
        style={{ fontFamily: "Amiri Quran, Amiri, serif" }}
        dir="rtl"
      >
        ۝ {q.ar} ۝
      </p>
      <p className="relative z-10 text-[11px] text-center text-muted-foreground italic mt-2 leading-relaxed px-2">
        {q.translation}
      </p>
      <div className="relative z-10 mt-3 text-[10px] font-mono text-center text-[var(--emerald)] tracking-widest">
        سورة {q.ref}
      </div>
    </section>
  );
}