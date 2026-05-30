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

// 10 warrior-of-the-soul ranks (مراتب مجاهدي النفس).
// Score = (streakDays * 5) + todayScore. Cumulative thresholds.
export const STAGES: Stage[] = [
  {
    index: 0,
    name: "الأسير",
    english: "The Captive · أسير النفس الأمّارة",
    image: stage1,
    toneId: "weak",
    minScore: 0,
    quote: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ — يوسف ٥٣",
  },
  {
    index: 1,
    name: "الغافل",
    english: "The Heedless · يسمع النداء ولا يجيب",
    image: stage1,
    toneId: "weak",
    minScore: 8,
    quote: "اليقظة أول سلاح.",
  },
  {
    index: 2,
    name: "المستيقظ",
    english: "The Awakened · انتفض من سُباته",
    image: stage2,
    toneId: "rising",
    minScore: 20,
    quote: "أول خطوة في طريق الألف ميل.",
  },
  {
    index: 3,
    name: "اللوّام",
    english: "The Reproacher · يحاسب نفسه",
    image: stage2,
    toneId: "rising",
    minScore: 40,
    quote: "وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ — القيامة ٢",
  },
  {
    index: 4,
    name: "المُريد",
    english: "The Seeker · يطلب وجه الله",
    image: stage3,
    toneId: "awakening",
    minScore: 75,
    quote: "فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا — الشمس ٨",
  },
  {
    index: 5,
    name: "المُجاهِد",
    english: "The Warrior · شاهر سيف العزيمة",
    image: stage3,
    toneId: "awakening",
    minScore: 120,
    quote: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا — العنكبوت ٦٩",
  },
  {
    index: 6,
    name: "المُرابِط",
    english: "The Sentinel · ثابت على الثغر",
    image: stage4,
    toneId: "steady",
    minScore: 175,
    quote: "رِبَاطُ يَوْمٍ فِي سَبِيلِ اللَّهِ خَيْرٌ مِنَ الدُّنْيَا — البخاري",
  },
  {
    index: 7,
    name: "الفارس",
    english: "The Knight · فارس النفس المطمئنّة",
    image: stage4,
    toneId: "steady",
    minScore: 240,
    quote: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ — الفجر ٢٧",
  },
  {
    index: 8,
    name: "الصِّدِّيق",
    english: "The Truthful · صدق مع الله",
    image: stage5,
    toneId: "luminous",
    minScore: 320,
    quote: "رَاضِيَةً مَّرْضِيَّةً — الفجر ٢٨",
  },
  {
    index: 9,
    name: "الفاتح",
    english: "The Conqueror · فتح نفسه قبل الآفاق",
    image: stage5,
    toneId: "luminous",
    minScore: 450,
    quote: "أَعْدَى عَدُوِّكَ نَفْسُكَ الَّتِي بَيْنَ جَنْبَيْكَ.",
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