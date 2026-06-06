import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark as BookmarkIcon, ChevronRight, Loader2, Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { useNafsState } from "@/hooks/useNafsState";
import { Input } from "@/components/ui/input";
import {
  type Ayah,
  type Bookmark,
  type SurahMeta,
  clearBookmark,
  getSurah,
  getSurahList,
  loadBookmark,
  saveBookmark,
} from "@/lib/quran-api";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [
      { title: "طوبى — قارئ القرآن" },
      { name: "description", content: "اقرأ القرآن الكريم مع حفظ آخر آية." },
    ],
  }),
  component: QuranPage,
});

function QuranPage() {
  const { stage, ready } = useNafsState();
  const [list, setList] = useState<SurahMeta[] | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [meta, setMeta] = useState<SurahMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [bm, setBm] = useState<Bookmark | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    setBm(loadBookmark());
    getSurahList()
      .then(setList)
      .catch(() => setList([]));
  }, []);

  useEffect(() => {
    if (current == null) return;
    setLoading(true);
    setAyahs(null);
    getSurah(current)
      .then(({ meta, ayahs }) => {
        setMeta(meta);
        setAyahs(ayahs);
      })
      .catch(() => setAyahs([]))
      .finally(() => setLoading(false));
  }, [current]);

  // Scroll to bookmarked ayah after load
  useEffect(() => {
    if (!ayahs || !bm || bm.surah !== current) return;
    const el = document.getElementById(`ayah-${bm.ayah}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ayahs, bm, current]);

  const filtered = useMemo(() => {
    if (!list) return [];
    const s = q.trim();
    if (!s) return list;
    return list.filter(
      (x) =>
        x.name.includes(s) ||
        x.englishName.toLowerCase().includes(s.toLowerCase()) ||
        String(x.number) === s,
    );
  }, [list, q]);

  if (!ready) return <div className="min-h-screen" />;

  return (
    <AppShell title="القرآن" subtitle="Quran Reader" toneId={stage.toneId}>
      {current == null ? (
        <div className="space-y-3">
          {bm && (
            <button
              onClick={() => setCurrent(bm.surah)}
              className="w-full paper rounded-2xl p-3 flex items-center gap-3 text-right active:scale-[0.98] transition"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)]">
                <BookmarkIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-muted-foreground tracking-widest">
                  متابعة القراءة
                </div>
                <div className="text-sm font-black">
                  سورة {list?.find((s) => s.number === bm.surah)?.name ?? bm.surah} ·
                  آية {bm.ayah}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
            </button>
          )}

          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن سورة…"
              className="text-right rounded-xl pr-9"
              dir="rtl"
            />
          </div>

          {!list ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <div className="paper rounded-2xl divide-y divide-border/40 overflow-hidden">
              {filtered.map((s) => (
                <button
                  key={s.number}
                  onClick={() => setCurrent(s.number)}
                  className="w-full px-3 py-2.5 flex items-center gap-3 text-right hover:bg-[var(--tone-soft)]/40 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--tone-soft)] text-[var(--tone)] font-mono font-black text-xs flex items-center justify-center">
                    {s.number}
                  </div>
                  <div className="flex-1 text-right">
                    <div
                      className="text-sm font-black text-[var(--ink)]"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      {s.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {s.englishName} · {s.numberOfAyahs} آية ·{" "}
                      {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrent(null);
                setAyahs(null);
                setMeta(null);
              }}
              className="text-[12px] font-bold text-[var(--tone)] flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              السور
            </button>
            {meta && (
              <div className="text-right">
                <div
                  className="text-base font-black"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  سورة {meta.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {meta.englishName} · {meta.numberOfAyahs} آية
                </div>
              </div>
            )}
          </div>

          {loading || !ayahs ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <article
              className="paper rounded-2xl p-5 text-right leading-loose"
              style={{ fontFamily: "Amiri, serif", fontSize: 22, lineHeight: 2.2 }}
              dir="rtl"
            >
              {current !== 1 && current !== 9 && (
                <div className="text-center text-[var(--tone)] font-black mb-4 text-xl">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              )}
              {ayahs.map((a) => {
                const isBm = bm?.surah === current && bm?.ayah === a.numberInSurah;
                return (
                  <span
                    key={a.number}
                    id={`ayah-${a.numberInSurah}`}
                    onClick={() => {
                      const next: Bookmark = {
                        surah: current,
                        ayah: a.numberInSurah,
                        savedAt: new Date().toISOString(),
                      };
                      saveBookmark(next);
                      setBm(next);
                    }}
                    className={`cursor-pointer transition rounded-md px-1 ${
                      isBm ? "bg-[var(--tone-soft)] ring-1 ring-[var(--tone)]" : ""
                    }`}
                  >
                    {a.text}{" "}
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[var(--gold-deep)]/50 bg-[var(--parchment-deep)]/60 text-[var(--tone)] text-[11px] font-mono font-black mx-1 align-middle">
                      {a.numberInSurah}
                    </span>{" "}
                  </span>
                );
              })}
            </article>
          )}

          {bm?.surah === current && (
            <button
              onClick={() => {
                clearBookmark();
                setBm(null);
              }}
              className="w-full text-[11px] text-muted-foreground py-2"
            >
              مسح العلامة المرجعية
            </button>
          )}
        </div>
      )}
    </AppShell>
  );
}