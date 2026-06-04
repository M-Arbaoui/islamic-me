import { useEffect, useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";

type Times = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const LABELS: Record<keyof Times, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const CACHE_KEY = "nafs-prayer-v1";

type Cache = {
  date: string;
  city?: string;
  lat: number;
  lon: number;
  times: Times;
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cache;
    return c.date === todayStr() ? c : null;
  } catch {
    return null;
  }
}

async function fetchTimes(lat: number, lon: number): Promise<Times> {
  const url = `https://api.aladhan.com/v1/timings/${todayStr()}?latitude=${lat}&longitude=${lon}&method=4`;
  const res = await fetch(url);
  const json = await res.json();
  const t = json.data.timings;
  return {
    Fajr: t.Fajr,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
  };
}

function nextPrayer(times: Times): { name: keyof Times; in: string } | null {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const entries = Object.entries(times) as [keyof Times, string][];
  for (const [name, hhmm] of entries) {
    const [h, m] = hhmm.split(":").map(Number);
    const min = h * 60 + m;
    if (min > nowMin) {
      const diff = min - nowMin;
      const hh = Math.floor(diff / 60);
      const mm = diff % 60;
      return {
        name,
        in: hh > 0 ? `${hh}س ${mm}د` : `${mm}د`,
      };
    }
  }
  return { name: "Fajr", in: "غداً" };
}

export function PrayerTimes() {
  const [cache, setCache] = useState<Cache | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const c = loadCache();
    if (c) setCache(c);
    else void requestLocation();
    const id = setInterval(() => setTick((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  async function requestLocation() {
    setErr(null);
    setLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        if (!navigator.geolocation) return rej(new Error("no geo"));
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 });
      });
      const { latitude: lat, longitude: lon } = pos.coords;
      const times = await fetchTimes(lat, lon);
      const next: Cache = { date: todayStr(), lat, lon, times };
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setCache(next);
    } catch {
      setErr("تعذّر تحديد الموقع. فعّل الإذن وأعد المحاولة.");
    } finally {
      setLoading(false);
    }
  }

  if (!cache) {
    return (
      <button
        onClick={requestLocation}
        className="paper rounded-2xl p-4 w-full text-right flex items-center gap-3 active:scale-[0.98] transition"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--tone-soft)] flex items-center justify-center text-[var(--tone)]">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-black text-[var(--ink)]">
            {loading ? "جارٍ التحديد…" : "مواقيت الصلاة"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {err ?? "اضغط للسماح بالموقع"}
          </div>
        </div>
      </button>
    );
  }

  const next = nextPrayer(cache.times);
  void tick;

  return (
    <section className="paper rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[var(--tone)]" />
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest">
            مواقيت اليوم
          </span>
        </div>
        {next && (
          <div className="text-[11px] font-bold text-[var(--tone)]">
            {LABELS[next.name]} بعد {next.in}
          </div>
        )}
        <button
          onClick={requestLocation}
          className="text-muted-foreground hover:text-[var(--tone)]"
          aria-label="تحديث"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1.5" dir="ltr">
        {(Object.keys(cache.times) as (keyof Times)[]).map((k) => {
          const isNext = next?.name === k;
          return (
            <div
              key={k}
              className={`rounded-xl py-2 text-center ${
                isNext
                  ? "bg-[var(--tone-soft)] ring-1 ring-[var(--tone)]"
                  : "bg-background/60 border border-border/40"
              }`}
            >
              <div className="text-[8px] font-bold text-muted-foreground tracking-widest">
                {LABELS[k]}
              </div>
              <div
                className={`text-[11px] font-mono font-black mt-0.5 ${
                  isNext ? "text-[var(--tone)]" : "text-foreground"
                }`}
              >
                {cache.times[k]}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}