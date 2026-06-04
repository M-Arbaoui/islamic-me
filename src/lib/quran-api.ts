export type SurahMeta = {
  number: number;
  name: string; // Arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

export type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
};

const SURAH_LIST_KEY = "nafs-quran-surahs-v1";
const SURAH_CACHE_PREFIX = "nafs-quran-surah-v1:";

export async function getSurahList(): Promise<SurahMeta[]> {
  try {
    const cached = localStorage.getItem(SURAH_LIST_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const json = await res.json();
  const list = json.data as SurahMeta[];
  try {
    localStorage.setItem(SURAH_LIST_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return list;
}

export async function getSurah(num: number): Promise<{ meta: SurahMeta; ayahs: Ayah[] }> {
  const key = `${SURAH_CACHE_PREFIX}${num}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/quran-uthmani`);
  const json = await res.json();
  const d = json.data;
  const out = {
    meta: {
      number: d.number,
      name: d.name,
      englishName: d.englishName,
      englishNameTranslation: d.englishNameTranslation,
      numberOfAyahs: d.numberOfAyahs,
      revelationType: d.revelationType,
    } as SurahMeta,
    ayahs: (d.ayahs as Ayah[]).map((a) => ({
      number: a.number,
      numberInSurah: a.numberInSurah,
      text: a.text,
    })),
  };
  try {
    localStorage.setItem(key, JSON.stringify(out));
  } catch {
    /* quota — ignore */
  }
  return out;
}

export type Bookmark = { surah: number; ayah: number; savedAt: string };
const BM_KEY = "nafs-quran-bookmark";

export function loadBookmark(): Bookmark | null {
  try {
    const raw = localStorage.getItem(BM_KEY);
    return raw ? (JSON.parse(raw) as Bookmark) : null;
  } catch {
    return null;
  }
}
export function saveBookmark(bm: Bookmark) {
  try {
    localStorage.setItem(BM_KEY, JSON.stringify(bm));
  } catch {
    /* ignore */
  }
}
export function clearBookmark() {
  try {
    localStorage.removeItem(BM_KEY);
  } catch {
    /* ignore */
  }
}