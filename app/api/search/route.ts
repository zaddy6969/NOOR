import { naatEntries } from "../../naat/naat-data";
import { topics } from "../../topics/topic-data";
import { lughatEntries } from "../../firozul-lughat/lughat-data";
import { destinations } from "../../destinations/destination-data";
import { shopItems } from "../../shop/shop-data";

type SearchResult = {
  id: string;
  type: "Feature" | "Topic" | "Guide" | "Naat" | "Quran" | "Glossary" | "Place" | "Product";
  title: string;
  description: string;
  href: string;
  arabic?: string;
  score: number;
};

const features = [
  ["Quran reader", "Arabic, English meaning, Surahs, Ayahs and full audio", "/quran"],
  ["Prayer Times Center", "Today’s Fajr, Dhuhr, Asr, Maghrib and Isha times, monthly schedule, calculation method and location", "/prayer-times"],
  ["Prayer and Wudu", "Namaz, Salah, Wuzu, Wudu, Rak‘ahs, purification and complete prayer guide", "/namaz"],
  ["Qibla Compass", "Live direction to the Kaaba", "/qibla"],
  ["Islamic Calendar", "Hijri dates, occasions and festivals", "/islamic-calendar"],
  ["Saved Items", "Saved bookmarks, favourite Quran verses, Surahs, Darood and glossary words in your NOOR library", "/saved"],
  ["Daily Duas", "Authentic daily supplications, Arabic, meaning, copy, save and Tasbih count", "/#daily-duas"],
  ["99 Names of Allah", "Asma ul Husna, Arabic names, transliteration, meanings and progress", "/#names"],
  ["Darood Sharif", "Various Salawat with Arabic, English meaning, sources, saving and private Tasbih count", "/darood"],
  ["Zakat Calculator", "Private 2.5 percent Zakat estimate using gold or silver Nisab, assets and liabilities", "/zakat-calculator"],
  ["Qaza Namaz Calculator", "Kaza missed Fajr Dhuhr Asr Maghrib Isha and Witr prayer planning", "/qaza-namaz"],
  ["Naat and Salam", "Audio, video, writers, reciters and reading pages", "/naat"],
  ["Famous Waqiyahs", "Sourced Islamic stories, Quranic accounts, prophets, history and practical lessons", "/topics/waqiyahs"],
  ["Family Tree", "Interactive lineage and sacred history", "/family-tree"],
  ["Matrimony", "Private family-aware matrimonial profiles", "/matrimony"],
  ["Islamic Urdu Glossary", "Firozul Feroz Firuz Urdu Islamic glossary Roman meanings and saved words", "/glossary"],
  ["Product Request Catalogue", "Browse Quran books prayer mats attar modest wear gifts Hajj Umrah children without an inactive checkout", "/shop"],
  ["Mosque Finder", "Mousque mosque masjid finder live nearby prayer place distance directions", "/mosque-finder"],
  ["Famous Muslim Destinations", "Sacred cities Islamic heritage Sufi places Makkah Madinah Ajmer tourism", "/destinations"],
  ["Muslim Religious Tourism", "Ziyarat pilgrimage travel planner private checklist etiquette documents", "/religious-tourism"],
  ["About NOOR", "Purpose, accuracy, limits and product status", "/about"],
  ["Privacy", "Location, local storage, accounts and external service data", "/privacy"],
  ["Editorial Policy", "Sources, review status, differences of opinion and corrections", "/editorial-policy"],
  ["Sign in to NOOR", "Account access and cross-device Saved-item sync", "/sign-in"],
  ["Terms of Use", "NOOR service terms, responsibilities and limitations", "/terms"],
] as const;

const intentAliases: Array<{ terms: string[]; result: SearchResult }> = [
  {
    terms: ["ayat ul kursi", "ayatul kursi", "ayat al kursi", "verse of the throne", "kursi", "allah there is no deity", "allah no deity except him"],
    result: { id: "intent-ayat-ul-kursi", type: "Quran", title: "Ayat al-Kursi · Quran 2:255", description: "Open the Verse of the Throne in the NOOR Quran reader", href: "/quran?surah=2&ayah=255", score: 180 },
  },
  {
    terms: ["surah fatiha", "al fatiha", "fatiha"],
    result: { id: "intent-fatiha", type: "Quran", title: "Surah Al-Fatihah", description: "Open Surah 1 with Arabic, English meaning and full audio", href: "/quran?surah=1", score: 175 },
  },
  {
    terms: ["surah yaseen", "surah yasin", "yaseen", "yasin"],
    result: { id: "intent-yaseen", type: "Quran", title: "Surah Ya-Sin", description: "Open Surah 36 with Arabic, English meaning and full audio", href: "/quran?surah=36", score: 175 },
  },
  {
    terms: ["surah rahman", "ar rahman", "rehman"],
    result: { id: "intent-rahman", type: "Quran", title: "Surah Ar-Rahman", description: "Open Surah 55 with Arabic, English meaning and full audio", href: "/quran?surah=55", score: 175 },
  },
  {
    terms: ["surah waqiah", "surah waqia", "surah waquia", "surah waqiya", "surah waqiyah", "al waqiah", "waqiah", "waqia", "waquia", "waqiya", "waqiyah"],
    result: { id: "intent-waqiah", type: "Quran", title: "Surah Al-Waqi‘ah", description: "Open Surah 56 with Arabic, English meaning and full audio", href: "/quran?surah=56", score: 175 },
  },
  {
    terms: ["surah mulk", "al mulk", "mulk"],
    result: { id: "intent-mulk", type: "Quran", title: "Surah Al-Mulk", description: "Open Surah 67 with Arabic, English meaning and full audio", href: "/quran?surah=67", score: 175 },
  },
  {
    terms: ["saved", "saved items", "save items", "bookmarks", "bookmarked", "favourites", "favorites", "my library", "saved library"],
    result: { id: "intent-saved", type: "Feature", title: "Saved Items", description: "Open your saved Quran verses, Surahs, Darood and glossary words", href: "/saved", score: 190 },
  },
  {
    terms: ["waqiyahs", "waqiahs", "waqiyas", "waqiyat", "waqiyaat", "islamic waqia", "islamic stories", "islamic story", "quran stories", "stories of prophets", "islamic history"],
    result: { id: "intent-waqiyahs", type: "Topic", title: "Famous Waqiyahs", description: "Read sourced Qur’anic stories and accounts from Islamic history", href: "/topics/waqiyahs", score: 185 },
  },
  {
    terms: ["daily dua", "daily duas", "dua", "duas", "supplication", "supplications", "morning dua", "evening dua"],
    result: { id: "intent-duas", type: "Feature", title: "Daily Duas", description: "Open authentic daily supplications with Arabic and meaning", href: "/#daily-duas", score: 180 },
  },
  {
    terms: ["99 names", "99 names of allah", "asma ul husna", "asmaul husna", "allah names", "names of allah"],
    result: { id: "intent-names", type: "Feature", title: "99 Names of Allah", description: "Read the Arabic names, transliteration and meanings", href: "/#names", score: 180 },
  },
  {
    terms: ["hijri calendar", "islamic calendar", "islamic calander", "islamic calender", "calander", "hijri date"],
    result: { id: "intent-calendar", type: "Feature", title: "Islamic Calendar", description: "Open Hijri dates, occasions and festivals", href: "/islamic-calendar", score: 180 },
  },
  {
    terms: ["wudu", "wuzu", "wazoo", "wudhu", "ablution", "namaj", "namaz guide", "salah guide", "how to pray"],
    result: { id: "intent-namaz", type: "Guide", title: "Prayer & Wudu Guide", description: "Learn purification and Salah step by step", href: "/namaz", score: 180 },
  },
  {
    terms: ["surah ikhlas", "al ikhlas", "qul huwallah"],
    result: { id: "intent-ikhlas", type: "Quran", title: "Surah Al-Ikhlas", description: "Open Surah 112 with Arabic, English meaning and full audio", href: "/quran?surah=112", score: 175 },
  },
  {
    terms: ["last two ayat baqarah", "last 2 ayat baqarah", "amanar rasulu", "aamana rasool"],
    result: { id: "intent-baqarah-ending", type: "Quran", title: "Last two Ayahs of Al-Baqarah", description: "Open Quran 2:285 and continue to 2:286", href: "/quran?surah=2&ayah=285", score: 180 },
  },
  {
    terms: ["mosque near me", "masjid near me", "nearby mosque", "nearby masjid", "mousque near me", "mousqe near me", "mosqe near me", "find mosque", "find masjid", "mousque", "mousqe"],
    result: { id: "intent-mosque", type: "Feature", title: "Mosque Finder", description: "Use your location or choose a city to find nearby masjids", href: "/mosque-finder", score: 180 },
  },
  {
    terms: ["prayer time", "prayer times", "namaz time", "namaz timing", "namaj time", "salah time", "salah times", "azan time", "adhan time"],
    result: { id: "intent-prayer-times", type: "Feature", title: "Prayer Times Center", description: "Open today’s schedule, monthly times and calculation settings", href: "/prayer-times", score: 180 },
  },
  {
    terms: ["qibla direction", "qibla compass", "kaaba direction", "quibla", "quibla compass"],
    result: { id: "intent-qibla", type: "Feature", title: "Qibla Compass", description: "Find the Kaaba direction using a city or live location", href: "/qibla", score: 180 },
  },
  {
    terms: ["firozul", "firoz ul lughat", "feroz ul lughat", "urdu dictionary", "islamic dictionary", "islamic glossary"],
    result: { id: "intent-glossary", type: "Glossary", title: "Islamic Urdu Glossary", description: "Urdu script, Roman reading help, meanings and usage", href: "/glossary", score: 180 },
  },
];

const detailedGuides = [
  ["Wudu step by step", "Purification, four Fard acts, washing hands face arms head and feet, invalidators and water barriers", "/namaz/wudu"],
  ["Ghusl and Tayammum", "Major purification, obligatory bath, clean earth and alternative purification when water is unavailable or harmful", "/namaz#ghusl"],
  ["Prayer times and Rak‘ahs", "Fajr Dhuhr Asr Maghrib Isha, prayer windows, Sunnah Fard Wajib and daily Rak‘ah planner", "/namaz#times"],
  ["How to perform Salah", "Niyyah, Takbir, Qiyam, Qiraat, Ruku, Qaumah, Sajdah, Tashahhud, Darood and Salam", "/namaz/salah"],
  ["Essential prayer recitations", "Arabic, Roman reading aid and English meaning for Salah duas and Surahs", "/namaz/recitations"],
  ["Prayer mistakes and Sajdah Sahw", "Forgotten Wajib, omitted Fard, prayer invalidators and prostrations of forgetfulness", "/namaz/mistakes"],
  ["Jama‘at and Jumu‘ah", "Congregational prayer, following the Imam, Friday prayer and latecomer guidance", "/namaz#congregation"],
  ["Travel, illness and missed prayers", "Qasr, Qada, chair prayer, disability, Tarawih, Eid and Janazah", "/namaz#special"],
  ["Islamic prayer questions", "Intention, doubts, Wudu differences, missed prayer and praying while sitting", "/namaz#faq"],
  ["Islamic occasions calendar", "Ramadan, Eid al-Fitr, Eid al-Adha, Ashura, Mawlid and Hijri dates", "/islamic-calendar"],
  ["Zakat Nisab calculation", "Calculate cash, gold, silver, investments, business assets, receivables, liabilities, Hawl and a 2.5 percent estimate", "/zakat-calculator"],
  ["Silver and gold Nisab", "Choose the 612.36 gram silver threshold, 87.48 gram gold threshold or a trusted custom Nisab amount", "/zakat-calculator"],
  ["Qaza prayer date estimate", "Estimate missed prayers from a day count or inclusive date range and remove valid exemption days", "/qaza-namaz"],
  ["Qaza Witr prayer plan", "Choose Fajr Dhuhr Asr Maghrib Isha and Hanafi Witr, then create a steady daily completion target", "/qaza-namaz"],
  ["Darood Ibrahim", "Hadith-reported Salat al-Ibrahimiyyah in Arabic, Roman reading aid and English meaning", "/darood#ibrahimiyyah"],
  ["Darood Tanjeena", "Traditional Salat al-Munjiyyah Arabic, Roman reading aid, English meaning and source status", "/darood#tanjeena"],
  ["Darood Nariya", "Traditional Salat al-Tafrijiyyah Arabic, Roman reading aid, English meaning and source status", "/darood#nariya"],
  ["Darood Taj", "Long traditional Salutation of the Crown in Arabic with English meaning and source status", "/darood#taj"],
] as const;

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[‘’'`]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function editDistance(left: string, right: string) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function isCloseWord(queryWord: string, candidate: string) {
  if (queryWord.length < 4 || candidate.length < 4) return false;
  const allowance = Math.max(queryWord.length, candidate.length) >= 7 ? 2 : 1;
  return Math.abs(queryWord.length - candidate.length) <= allowance
    && editDistance(queryWord, candidate) <= allowance;
}

function rank(text: string, rawQuery: string) {
  const value = normalizeSearchText(text);
  const query = normalizeSearchText(rawQuery);
  if (!query) return 0;
  if (value === query) return 150;
  if (value.startsWith(`${query} `) || value.startsWith(query)) return 125;
  if (value.includes(` ${query} `) || value.endsWith(` ${query}`)) return 90;
  if (value.includes(query)) return 78;

  const valueWords = value.split(" ").filter(Boolean);
  const queryWords = query.split(" ").filter(Boolean);
  let exact = 0;
  let fuzzy = 0;
  for (const word of queryWords) {
    if (valueWords.includes(word)) exact += 1;
    else if (valueWords.some((candidate) => isCloseWord(word, candidate))) fuzzy += 1;
  }
  if (exact + fuzzy !== queryWords.length) return exact * 7;
  return 48 + exact * 12 + fuzzy * 7;
}

function staticResults(query: string) {
  const results: SearchResult[] = [];

  for (const alias of intentAliases) {
    const exactAlias = alias.terms.some((term) => query === normalizeSearchText(term));
    const matchesAlias = exactAlias || alias.terms.some((term) => {
      const normalizedTerm = normalizeSearchText(term);
      return query.includes(normalizedTerm) || rank(normalizedTerm, query) >= 55;
    });
    if (matchesAlias) results.push({ ...alias.result, score: alias.result.score + (exactAlias ? 20 : 0) });
  }

  for (const [title, description, href] of features) {
    const score = rank(`${title} ${description}`, query);
    if (score) results.push({ id: `feature-${href}`, type: "Feature", title, description, href, score });
  }

  for (const [title, description, href] of detailedGuides) {
    const score = rank(`${title} ${description}`, query);
    if (score) results.push({ id: `guide-${href}`, type: "Guide", title, description, href, score: score + 3 });
  }

  for (const topic of topics) {
    const topicScore = rank(`${topic.title} ${topic.summary} ${topic.kicker}`, query);
    if (topicScore) results.push({ id: `topic-${topic.slug}`, type: "Topic", title: topic.title, description: topic.summary, href: `/topics/${topic.slug}`, score: topicScore + 5 });
    for (const chapter of topic.chapters) {
      const chapterScore = rank(`${chapter.title} ${chapter.intro}`, query);
      if (chapterScore) results.push({ id: `chapter-${topic.slug}-${chapter.id}`, type: "Guide", title: chapter.title, description: `${topic.title} · ${chapter.intro}`, href: `/topics/${topic.slug}#${chapter.id}`, score: chapterScore });
      for (const item of chapter.items) {
        const itemScore = rank(`${item.title} ${item.body}`, query);
        if (itemScore >= 8) results.push({ id: `item-${topic.slug}-${chapter.id}-${item.title}`, type: "Guide", title: item.title, description: `${topic.title} · ${item.body}`, href: `/topics/${topic.slug}#${chapter.id}`, score: itemScore - 2 });
      }
    }
    for (const faq of topic.faqs) {
      const faqScore = rank(`${faq.q} ${faq.a}`, query);
      if (faqScore >= 8) results.push({ id: `faq-${topic.slug}-${faq.q}`, type: "Guide", title: faq.q, description: `${topic.title} · ${faq.a}`, href: `/topics/${topic.slug}#questions`, score: faqScore });
    }
  }

  for (const entry of naatEntries) {
    const score = rank(`${entry.title} ${entry.writer} ${entry.reciter} ${entry.genre} ${entry.summary}`, query);
    if (score) results.push({ id: `naat-${entry.slug}`, type: "Naat", title: entry.title, description: `${entry.genre} · ${entry.media.performer} · ${entry.writer}`, href: `/naat/${entry.slug}`, score });
  }

  for (const entry of lughatEntries) {
    const score = rank(`${entry.term} ${entry.urdu} ${entry.roman} ${entry.meaning} ${entry.use} ${entry.category}`, query);
    if (score) results.push({ id: `lughat-${entry.id}`, type: "Glossary", title: `${entry.term} · ${entry.urdu}`, description: entry.meaning, href: `/glossary#${entry.id}`, score: score + 4 });
  }

  for (const place of destinations) {
    const score = rank(`${place.name} ${place.country} ${place.region} ${place.category} ${place.summary} ${place.significance} ${place.places.join(" ")}`, query);
    if (score) results.push({ id: `place-${place.slug}`, type: "Place", title: place.name, description: `${place.country} · ${place.summary}`, href: `/destinations#${place.slug}`, arabic: place.arabic, score: score + 3 });
  }

  for (const item of shopItems) {
    const score = rank(`${item.name} ${item.category} ${item.description} ${item.options}`, query);
    if (score) results.push({ id: `product-${item.id}`, type: "Product", title: item.name, description: `${item.category} · ${item.description}`, href: `/shop#${item.id}`, score });
  }

  return results;
}

async function quranResults(query: string, allowTextSearch: boolean): Promise<SearchResult[]> {
  const reference = query.match(/^(?:quran\s*)?(\d{1,3})(?:\s*[:.]\s*|\s+)(\d{1,3})$/i);
  if (reference) {
    const surah = Number(reference[1]);
    const ayah = Number(reference[2]);
    if (surah >= 1 && surah <= 114 && ayah >= 1) {
      return [{ id: `quran-${surah}-${ayah}`, type: "Quran", title: `Quran ${surah}:${ayah}`, description: "Open this Ayah inside the NOOR Quran reader", href: `/quran?surah=${surah}&ayah=${ayah}`, score: 120 }];
    }
  }

  const alias = intentAliases.find((item) => item.result.type === "Quran" && item.terms.some((term) => query === term || query.includes(term)));
  if (alias) return [alias.result];
  if (!allowTextSearch || query.length < 3) return [];
  try {
    const editions = ["en.sahih", "en.pickthall"];
    const responses = await Promise.all(editions.map((edition) => fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${edition}`,
      { headers: { Accept: "application/json" } },
    ).catch(() => null)));
    const payloads = await Promise.all(responses.map(async (response) => response?.ok
      ? response.json() as Promise<{ data?: { matches?: Array<{ numberInSurah?: number; text?: string; surah?: { number?: number; englishName?: string; name?: string } }> } }>
      : null));
    const seen = new Set<string>();
    const matches = payloads.flatMap((payload) => payload?.data?.matches ?? []).filter((match) => {
      const key = `${match.surah?.number}:${match.numberInSurah}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return matches.slice(0, 6).map((match, index) => {
      const surahNumber = Number(match.surah?.number ?? 0);
      const ayahNumber = Number(match.numberInSurah ?? 0);
      return {
        id: `quran-${surahNumber}-${ayahNumber}-${index}`,
        type: "Quran" as const,
        title: `${match.surah?.englishName ?? "Surah"} ${surahNumber}:${ayahNumber}`,
        description: String(match.text ?? "").trim(),
        href: `/quran?surah=${surahNumber}&ayah=${ayahNumber}`,
        arabic: match.surah?.name,
        score: 95 - index,
      };
    });
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const query = normalizeSearchText(new URL(request.url).searchParams.get("q")?.slice(0, 100) ?? "");
  if (!query) {
    return Response.json({ results: features.slice(0, 6).map(([title, description, href]) => ({ id: `quick-${href}`, type: "Feature", title, description, href })) });
  }

  const local = staticResults(query);
  const hasStrongLocalIntent = local.some((item) => item.score >= 110);
  const quran = await quranResults(query, !hasStrongLocalIntent);
  const merged = [...local, ...quran].sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const results = merged.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  }).slice(0, 14).map(({ score, ...item }) => {
    void score;
    return item;
  });

  return Response.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
