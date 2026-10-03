const entries = [
  {
    category: "Morning",
    title: "Morning remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    roman: "Asbahna wa asbahal-mulku lillah.",
    meaning:
      "We have entered the morning and all sovereignty belongs to Allah.",
    source: "Sahih Muslim 2723",
  },
  {
    category: "Evening",
    title: "Evening remembrance",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    roman: "Amsayna wa amsal-mulku lillah.",
    meaning:
      "We have entered the evening and all sovereignty belongs to Allah.",
    source: "Sahih Muslim 2723",
  },
  {
    category: "Travel",
    title: "Beginning a journey",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    roman: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin.",
    meaning:
      "Glory to Him who has subjected this to us, though we could not have controlled it.",
    source: "Quran 43:13",
  },
  {
    category: "Sleeping",
    title: "Before sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    roman: "Bismika Allahumma amutu wa ahya.",
    meaning: "In Your name, O Allah, I die and I live.",
    source: "Sahih al-Bukhari 6324",
  },
  {
    category: "Food",
    title: "Before food",
    arabic: "بِسْمِ اللَّهِ",
    roman: "Bismillah.",
    meaning: "In the name of Allah.",
    source: "Sunan Abi Dawud 3767",
  },
  {
    category: "Forgiveness",
    title: "Seeking forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    roman: "Astaghfirullaha wa atubu ilayh.",
    meaning: "I seek Allah’s forgiveness and turn to Him in repentance.",
    source: "Sahih al-Bukhari 6307",
  },
];
export const DUAS = entries.map((entry) => ({
  ...entry,
  id: entry.category.toLowerCase(),
  excerpt: ["Morning", "Evening", "Travel"].includes(entry.category),
  href: entry.source.startsWith("Quran")
    ? "/quran?surah=43&ayah=13"
    : entry.source.startsWith("Sahih Muslim")
      ? "https://sunnah.com/muslim:2723a"
      : entry.source.startsWith("Sunan")
        ? "https://sunnah.com/abudawud:3767"
        : "https://sunnah.com/bukhari:" + entry.source.split(" ").at(-1),
}));
