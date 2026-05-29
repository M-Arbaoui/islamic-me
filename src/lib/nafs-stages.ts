import stage1 from "@/assets/stage-1.jpg";
import stage2 from "@/assets/stage-2.jpg";
import stage3 from "@/assets/stage-3.jpg";
import stage4 from "@/assets/stage-4.jpg";
import stage5 from "@/assets/stage-5.jpg";

export type Stage = {
  index: number;
  name: string;
  english: string;
  image: string;
  toneId: "weak" | "rising" | "awakening" | "steady" | "luminous";
  minScore: number; // cumulative score threshold to unlock
  quote: string;
};

// 10 stages mapped to 5 art assets (each art covers 2 stages).
// Score = (streakDays * 5) + todayScore. Cumulative thresholds.
export const STAGES: Stage[] = [
  {
    index: 0,
    name: "النفس الأمّارة",
    english: "The Commanding Self",
    image: stage1,
    toneId: "weak",
    minScore: 0,
    quote: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ — يوسف ٥٣",
  },
  {
    index: 1,
    name: "النفس الكسولة",
    english: "The Heedless Self",
    image: stage1,
    toneId: "weak",
    minScore: 8,
    quote: "كم مرة قلت 'بكرة'؟ بكرة لا تأتي.",
  },
  {
    index: 2,
    name: "النفس المُتنبِّهة",
    english: "The Stirring Self",
    image: stage2,
    toneId: "rising",
    minScore: 20,
    quote: "بدأ القلب يسمع الأذان من جديد.",
  },
  {
    index: 3,
    name: "النفس اللوّامة",
    english: "The Self-Reproaching Self",
    image: stage2,
    toneId: "rising",
    minScore: 40,
    quote: "وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ — القيامة ٢",
  },
  {
    index: 4,
    name: "النفس المُلهَمة",
    english: "The Inspired Self",
    image: stage3,
    toneId: "awakening",
    minScore: 75,
    quote: "فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا — الشمس ٨",
  },
  {
    index: 5,
    name: "النفس المُجاهِدة",
    english: "The Struggling Self",
    image: stage3,
    toneId: "awakening",
    minScore: 120,
    quote: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا — العنكبوت ٦٩",
  },
  {
    index: 6,
    name: "النفس المطمئنّة",
    english: "The Tranquil Self",
    image: stage4,
    toneId: "steady",
    minScore: 175,
    quote: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ — الفجر ٢٧",
  },
  {
    index: 7,
    name: "النفس الراضية",
    english: "The Content Self",
    image: stage4,
    toneId: "steady",
    minScore: 240,
    quote: "راضِيَةً مَّرْضِيَّةً — الفجر ٢٨",
  },
  {
    index: 8,
    name: "النفس المرضيّة",
    english: "The Pleasing Self",
    image: stage5,
    toneId: "luminous",
    minScore: 320,
    quote: "فَادْخُلِي فِي عِبَادِي — الفجر ٢٩",
  },
  {
    index: 9,
    name: "النفس الكاملة",
    english: "The Perfected Self",
    image: stage5,
    toneId: "luminous",
    minScore: 450,
    quote: "وَادْخُلِي جَنَّتِي — الفجر ٣٠",
  },
];

export function getStageFromScore(score: number): Stage {
  let current = STAGES[0];
  for (const s of STAGES) {
    if (score >= s.minScore) current = s;
    else break;
  }
  return current;
}

export function getNextStage(score: number): Stage | null {
  for (const s of STAGES) {
    if (score < s.minScore) return s;
  }
  return null;
}

export type DailyHabits = {
  prayers: number; // 0-5
  quran: boolean;
  dhikr: boolean;
  restraint: boolean;
  goodDeed: boolean;
};

export const EMPTY_HABITS: DailyHabits = {
  prayers: 0,
  quran: false,
  dhikr: false,
  restraint: false,
  goodDeed: false,
};

export function habitScore(h: DailyHabits): number {
  // Each habit category = 1 point, prayers = up to 1 (proportional? we use full point if all 5)
  let s = 0;
  s += h.prayers === 5 ? 1 : h.prayers >= 3 ? 0.5 : 0;
  if (h.quran) s += 1;
  if (h.dhikr) s += 1;
  if (h.restraint) s += 1;
  if (h.goodDeed) s += 1;
  return Math.round(s);
}

export function totalScore(streakDays: number, today: DailyHabits): number {
  return streakDays * 5 + habitScore(today);
}