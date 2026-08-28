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
  ["Prayer and Wudu", "Namaz timings, Rak‘ahs, purification and complete Salah guide", "/namaz"],
  ["Qibla Compass", "Live direction to the Kaaba", "/qibla"],
  ["Islamic Calendar", "Hijri dates, occasions and festivals", "/islamic-calendar"],
  ["Darood Sharif", "Various Salawat with Arabic, English meaning, sources, saving and private Tasbih count", "/darood"],
  ["Zakat Calculator", "Private 2.5 percent Zakat estimate using gold or silver Nisab, assets and liabilities", "/zakat-calculator"],
  ["Qaza Namaz Calculator", "Kaza missed Fajr Dhuhr Asr Maghrib Isha and Witr prayer planning", "/qaza-namaz"],
  ["Naat and Salam", "Audio, video, writers, reciters and reading pages", "/naat"],
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
    terms: ["surah waqiah", "surah waqia", "al waqiah", "waqiah"],
    result: { id: "intent-waqiah", type: "Quran", title: "Surah Al-Waqi‘ah", description: "Open Surah 56 with Arabic, English meaning and full audio", href: "/quran?surah=56", score: 175 },
  },
  {
    terms: ["surah mulk", "al mulk", "mulk"],
    result: { id: "intent-mulk", type: "Quran", title: "Surah Al-Mulk", description: "Open Surah 67 with Arabic, English meaning and full audio", href: "/quran?surah=67", score: 175 },
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
    terms: ["mosque near me", "masjid near me", "nearby mosque", "nearby masjid", "mousque near me", "find mosque", "find masjid"],
    result: { id: "intent-mosque", type: "Feature", title: "Mosque Finder", description: "Use your location or choose a city to find nearby masjids", href: "/mosque-finder", score: 180 },
  },
  {
    terms: ["prayer time", "prayer times", "namaz time", "namaz timing", "salah time", "salah times"],
    result: { id: "intent-prayer-times", type: "Feature", title: "Today’s Prayer Times", description: "Open the compact prayer schedule and location settings", href: "/#prayer-times", score: 180 },
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
  ["Wudu step by step", "Purification, four Fard acts, washing hands face arms head and feet, invalidators and water barriers", "/namaz#purity"],
  ["Ghusl and Tayammum", "Major purification, obligatory bath, clean earth and alternative purification when water is unavailable or harmful", "/namaz#ghusl"],
  ["Prayer times and Rak‘ahs", "Fajr Dhuhr Asr Maghrib Isha, prayer windows, Sunnah Fard Wajib and daily Rak‘ah planner", "/namaz#times"],
  ["How to perform Salah", "Niyyah, Takbir, Qiyam, Qiraat, Ruku, Qaumah, Sajdah, Tashahhud, Durood and Salam", "/namaz#method"],
  ["Essential prayer recitations", "Arabic, Roman reading aid and English meaning for Salah duas and Surahs", "/namaz#recitations"],
  ["Prayer mistakes and Sajdah Sahw", "Forgotten Wajib, omitted Fard, prayer invalidators and prostrations of forgetfulness", "/namaz#mistakes"],
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

function rank(text: string, query: string) {
  const value = text.toLowerCase();
  if (value === query) return 100;
  if (value.startsWith(query)) return 70;
  if (value.includes(query)) return 40;
  const words = query.split(/\s+/).filter(Boolean);
  return words.reduce((score, word) => score + (value.includes(word) ? 8 : 0), 0);
}

function staticResults(query: string) {
  const results: SearchResult[] = [];

  for (const alias of intentAliases) {
    if (alias.terms.some((term) => query === term || query.includes(term))) results.push(alias.result);
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

async function quranResults(query: string): Promise<SearchResult[]> {
  const reference = query.match(/^(?:quran\s*)?(\d{1,3})\s*[:.]\s*(\d{1,3})$/i);
  if (reference) {
    const surah = Number(reference[1]);
    const ayah = Number(reference[2]);
    if (surah >= 1 && surah <= 114 && ayah >= 1) {
      return [{ id: `quran-${surah}-${ayah}`, type: "Quran", title: `Quran ${surah}:${ayah}`, description: "Open this Ayah inside the NOOR Quran reader", href: `/quran?surah=${surah}&ayah=${ayah}`, score: 120 }];
    }
  }

  const alias = intentAliases.find((item) => item.result.type === "Quran" && item.terms.some((term) => query === term || query.includes(term)));
  if (alias) return [alias.result];
  if (query.length < 3) return [];
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
    return matches.slice(0, 10).map((match, index) => {
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
  const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase().slice(0, 100) ?? "";
  if (!query) {
    return Response.json({ results: features.slice(0, 6).map(([title, description, href]) => ({ id: `quick-${href}`, type: "Feature", title, description, href })) });
  }

  const [quran, local] = await Promise.all([quranResults(query), Promise.resolve(staticResults(query))]);
  const merged = [...quran, ...local].sort((a, b) => b.score - a.score);
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
