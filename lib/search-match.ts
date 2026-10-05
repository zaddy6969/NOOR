const groups = [
  ["prayer", "prayers", "pray", "praying", "namaz", "namaaz", "salah", "salaah", "salat", "نماز", "صلاة", "नमाज", "नमाज़"],
  ["quran", "koran", "quraan", "القرآن", "قران", "قرآن", "कुरान", "क़ुरआन", "कुरआन"],
  ["surah", "surahs", "sura", "surat", "سورة", "سورہ", "सूरह", "सूरा"],
  ["dua", "duas", "duaa", "supplication", "supplications", "دعاء", "دعا", "दुआ"],
  ["wudu", "wudhu", "wuzu", "ablution", "وضو", "وضوء", "वुज़ू", "वजू", "वुजू"],
  ["darood", "durood", "durud", "salawat", "salawaat", "درود", "दुरूद", "दरूद"],
  ["qibla", "qiblah", "kibla", "direction", "قبلہ", "قبلة", "किबला", "क़िबला"],
  ["mosque", "mosques", "masjid", "masjids", "مسجد", "मस्जिद"],
  ["zakat", "zakah", "zakaat", "زکات", "زكاة", "जकात", "ज़कात"],
  ["qaza", "kaza", "qada", "missed", "قضا", "क़ज़ा", "कजा"],
  ["ramadan", "ramadhan", "ramzan", "رمضان", "रमजान", "रमज़ान"],
  ["fasting", "fast", "fasts", "roza", "sawm", "روزہ", "रोजा", "रोज़ा"],
  ["forgiveness", "forgive", "repentance", "istighfar", "استغفار", "توبہ", "माफी", "माफ़ी"],
  ["remembrance", "dhikr", "zikr", "azkar", "adhkar", "ذکر", "ذكر", "ज़िक्र", "जिक्र"],
  ["sleeping", "sleep", "bedtime", "सोने", "نیند", "سونے"],
  ["food", "eat", "eating", "meal", "खाना", "खाने", "کھانا", "کھانے"],
  ["travel", "travelling", "traveling", "journey", "safar", "سفر", "सफर"],
  ["morning", "subah", "صبح", "सुबह"],
  ["evening", "shaam", "شام", "शाम"],
  ["saved", "save", "bookmark", "bookmarks", "favourite", "favorite", "محفوظ", "सहेजे"],
  ["calendar", "hijri", "date", "تاریخ", "کیلنڈر", "कैलेंडर"],
  ["names", "name", "asma", "اسماء", "नाम"],
  ["allah", "اللہ", "الله", "अल्लाह"],
  ["times", "time", "timings", "schedule", "اوقات", "وقت", "समय", "वक्त"],
  ["fajr", "fajar", "فجر", "फ़ज्र", "फज्र"],
  ["dhuhr", "zuhr", "zohar", "ظهر", "ظہر", "ज़ुहर"],
  ["asr", "عصر", "अस्र"],
  ["maghrib", "magrib", "مغرب", "मग़रिब"],
  ["isha", "ishaa", "عشاء", "عشا", "इशा"],
  ["plan", "plans", "completion", "khatam", "khatm", "ختم", "खत्म"],
  ["download", "downloads", "offline", "آفلائن", "ऑफ़लाइन", "डाउनलोड"],
];
export function normalizeSearchText(value: string) {
  return value.normalize("NFKD").toLowerCase()
    .replace(/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/[یى]/g, "ي").replace(/ک/g, "ك")
    .replace(/[‘’'`]/g, "")
    .replace(/[٠-٩۰-۹०-९]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९".indexOf(digit) % 10))
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim().replace(/\s+/g, " ");
}
const synonyms = new Map(groups.flatMap(([canonical, ...variants]) => [canonical, ...variants].map(word => [normalizeSearchText(word), canonical] as const)));
const filler = new Set("how do does did i my me can could would should please find show tell about the a an to for of in on is are what where when want need get make read listen mujhe ka ki ke hai hain कैसे मुझे का की के में चाहिए تلاش کیسے مجھے کے کی کا ہے".split(" ").map(normalizeSearchText));
export function searchWords(value: string, query = false) {
  return normalizeSearchText(value).split(" ").filter(word => word && (!query || !filler.has(word))).map(word => synonyms.get(word) ?? word);
}
function closeWord(left: string, right: string) {
  if (left.length < 4 || right.length < 4) return false;
  const allowance = Math.max(left.length, right.length) >= 7 ? 2 : 1;
  if (Math.abs(left.length - right.length) > allowance) return false;
  let previous = Array.from({ length: right.length + 1 }, (_, i) => i);
  let beforePrevious: number[] = [];
  for (let i = 1; i <= left.length; i++) {
    const current = [i];
    for (let j = 1; j <= right.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
    }
    beforePrevious = previous;
    previous = current;
  }
  return previous[right.length] <= allowance;
}
export function prepareSearch(query: string) {
  const raw = normalizeSearchText(query);
  const words = [...new Set(searchWords(raw, true))];
  return (text: string) => {
    if (!words.length) return 0;
    const value = normalizeSearchText(text);
    if (value === raw) return 150;
    if (value.startsWith(raw)) return 125;
    if (value.includes(raw)) return 90;
    const candidates = [...new Set(searchWords(value))];
    let exact = 0, prefix = 0, fuzzy = 0;
    for (const word of words) {
      if (candidates.includes(word)) exact++;
      else if (word.length >= 3 && candidates.some(candidate => candidate.startsWith(word))) prefix++;
      else if (candidates.some(candidate => closeWord(word, candidate))) fuzzy++;
    }
    const matched = exact + prefix + fuzzy;
    if (matched === words.length) return 48 + exact * 12 + prefix * 9 + fuzzy * 7;
    // Partial results must cover most meaningful words; filler never produces a match.
    return matched / words.length >= 0.6 && exact ? 12 + exact * 7 : 0;
  };
}
