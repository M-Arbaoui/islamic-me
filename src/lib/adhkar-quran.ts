export type Dhikr = { ar: string; ref: string; benefit?: string };
export type QuranPiece = { ar: string; translation: string; ref: string };

export const ADHKAR: Dhikr[] = [
  { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيم", ref: "متفق عليه", benefit: "كلمتان حبيبتان إلى الرحمن، خفيفتان على اللسان، ثقيلتان في الميزان." },
  { ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref: "البخاري ٦٤٠٣", benefit: "من قالها مئة مرة في اليوم كانت له عَدْل عَشْر رِقاب." },
  { ar: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", ref: "أبو داود ١٥١٧", benefit: "غُفِرت ذنوبه وإن كان فرَّ من الزحف." },
  { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", ref: "مسلم ٢٧٢٦" },
  { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ", ref: "سيد الاستغفار — البخاري ٦٣٠٦" },
  { ar: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", ref: "أبو داود ٥٠٨١", benefit: "من قالها سبعاً صباحاً ومساءً كفاه الله ما أهمّه." },
  { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", ref: "الترمذي ٣٣٨٨", benefit: "ثلاثاً صباحاً ومساءً، لم يضرّه شيء." },
  { ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", ref: "متفق عليه", benefit: "كنزٌ من كنوز الجنّة." },
  { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", ref: "البخاري ٦٣٦٩" },
  { ar: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا", ref: "أبو داود ٥٠٧٢", benefit: "كان حقّاً على الله أن يُرضِيَه يوم القيامة." },
  { ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ", ref: "البخاري ٣٣٧٠" },
  { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", ref: "مسلم ٢٧٢١" },
  { ar: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", ref: "أبو داود ١٥٢٢" },
  { ar: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", ref: "النسائي ٦٣٠٥" },
  { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ", ref: "مسلم ٢٧٣٩" },
  { ar: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، أَوَّلَهُ وَآخِرَهُ، عَلَانِيَتَهُ وَسِرَّهُ", ref: "مسلم ٤٨٣" },
  { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا", ref: "مسلم ٢٧٢٢" },
  { ar: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ", ref: "مسلم ٢٦٩٥", benefit: "أحبّ الكلام إلى الله." },
  { ar: "اللَّهُمَّ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", ref: "الترمذي ٢١٤٠" },
  { ar: "اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَا يَحُولُ بَيْنَنَا وَبَيْنَ مَعَاصِيكَ", ref: "الترمذي ٣٥٠٢" },
];

export const QURAN_PIECES: QuranPiece[] = [
  { ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", translation: "Whoever fears Allah, He will make for him a way out, and provide for him from where he does not expect.", ref: "الطلاق ٢-٣" },
  { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Indeed, with hardship comes ease.", ref: "الشرح ٦" },
  { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.", ref: "البقرة ١٥٣" },
  { ar: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ", translation: "Those who strive for Us — We will surely guide them to Our ways. Allah is with the doers of good.", ref: "العنكبوت ٦٩" },
  { ar: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Say: O My servants who have wronged themselves, do not despair of the mercy of Allah. Allah forgives all sins.", ref: "الزمر ٥٣" },
  { ar: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", translation: "I did not create the jinn and humans except to worship Me.", ref: "الذاريات ٥٦" },
  { ar: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ", translation: "Indeed, prayer prevents indecency and evil; and the remembrance of Allah is greater.", ref: "العنكبوت ٤٥" },
  { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah do hearts find rest.", ref: "الرعد ٢٨" },
  { ar: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ", translation: "Seek help through patience and prayer, though it is hard except for the humble.", ref: "البقرة ٤٥" },
  { ar: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً", translation: "O reassured soul, return to your Lord, well-pleased and pleasing.", ref: "الفجر ٢٧-٢٨" },
  { ar: "وَنَفْسٍ وَمَا سَوَّاهَا ۝ فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا ۝ قَدْ أَفْلَحَ مَن زَكَّاهَا", translation: "By the soul and the One who proportioned it, then inspired it with discernment of wickedness and righteousness — successful is he who purifies it.", ref: "الشمس ٧-٩" },
  { ar: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي", translation: "Indeed, the soul commands evil, except for those upon whom my Lord has mercy.", ref: "يوسف ٥٣" },
  { ar: "وَاذْكُر رَّبَّكَ كَثِيرًا وَسَبِّحْ بِالْعَشِيِّ وَالْإِبْكَارِ", translation: "Remember your Lord much, and glorify Him in the evening and the morning.", ref: "آل عمران ٤١" },
  { ar: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ", translation: "Whoever relies upon Allah — He is sufficient for him. Allah will surely accomplish His purpose.", ref: "الطلاق ٣" },
  { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", translation: "Remember Me; I will remember you. Be grateful to Me, and do not be ungrateful.", ref: "البقرة ١٥٢" },
  { ar: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ ۗ وَبَشِّرِ الصَّابِرِينَ", translation: "We will surely test you — and give glad tidings to the patient.", ref: "البقرة ١٥٥" },
  { ar: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", translation: "Allah loves those who turn to Him in repentance and those who purify themselves.", ref: "البقرة ٢٢٢" },
  { ar: "وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", translation: "Give good news to the patient, who, when struck with calamity, say: To Allah we belong and to Him we return.", ref: "البقرة ١٥٥-١٥٦" },
  { ar: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", translation: "When My servants ask about Me — I am near. I respond to the call of the caller when he calls.", ref: "البقرة ١٨٦" },
  { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", translation: "Our Lord, do not blame us if we forget or err.", ref: "البقرة ٢٨٦" },
];

export function pickRandom<T>(arr: readonly T[], seed?: number): T {
  const i = seed === undefined ? Math.floor(Math.random() * arr.length) : seed % arr.length;
  return arr[i];
}

// Deterministic daily index (same all day, changes at midnight local)
export function dailyIndex(arrLength: number, salt = 0): number {
  const d = new Date();
  const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + salt * 7919;
  return key % arrLength;
}