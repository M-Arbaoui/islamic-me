import p1 from "@/assets/rank-01-captive.jpg";
import p2 from "@/assets/rank-02-heedless.jpg";
import p3 from "@/assets/rank-03-awakened.jpg";
import p4 from "@/assets/rank-04-reproacher.jpg";
import p5 from "@/assets/rank-05-seeker.jpg";
import p6 from "@/assets/rank-06-warrior.jpg";
import p7 from "@/assets/rank-07-sentinel.jpg";
import p8 from "@/assets/rank-08-knight.jpg";
import p9 from "@/assets/rank-09-truthful.jpg";
import p10 from "@/assets/rank-10-conqueror.jpg";

export const RANK_PORTRAITS = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10] as const;

export const RANK_META = [
  { ar: "الأسير", en: "The Captive", desc: "مكبّلٌ بالشهوة، يرى السماء من خلف القيود." },
  { ar: "الغافل", en: "The Heedless", desc: "نائمٌ والسيف بجانبه، يسمع النداء فيُؤجِّل." },
  { ar: "المستيقظ", en: "The Awakened", desc: "فتح عينيه عند الفجر، وعَلِم أنّ الطريق طويل." },
  { ar: "اللوّام", en: "The Reproacher", desc: "يحاسب نفسه قبل أن يُحاسَب، عينُه إلى السماء." },
  { ar: "المُريد", en: "The Seeker", desc: "يمشي بعصاه نحو نور، لا يلتفت إلى الخلف." },
  { ar: "المُجاهد", en: "The Warrior", desc: "شَهَر سيف العزيمة، وَجهُه إلى الميدان." },
  { ar: "المُرابِط", en: "The Sentinel", desc: "ثابتٌ على الثَّغر، لا تنام عيناه." },
  { ar: "الفارس", en: "The Knight", desc: "يركض في سبيل الله، رايتُه ترفرف." },
  { ar: "الصِّدِّيق", en: "The Truthful", desc: "صدقَ مع الله فأنزل عليه نوراً." },
  { ar: "الفاتح", en: "The Conqueror", desc: "فتح نفسَه قبل الآفاق، وقف على القمّة منتصراً." },
] as const;