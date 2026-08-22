import { naatEntries } from "../../naat/naat-data";
import { topics } from "../../topics/topic-data";

type SearchResult = {
  id: string;
  type: "Feature" | "Topic" | "Guide" | "Naat" | "Quran";
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
  ["Dhikr and Durood", "Daily remembrance, salawat and recitation guide", "/topics/durood"],
  ["Naat and Salam", "Audio, video, writers, reciters and reading pages", "/naat"],
  ["Family Tree", "Interactive lineage and sacred history", "/family-tree"],
  ["Matrimony", "Private family-aware matrimonial profiles", "/matrimony"],
] as const;

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

  if (query.length < 3) return [];
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.pickthall`, { headers: { Accept: "application/json" } });
    if (!response.ok) return [];
    const payload = await response.json() as { data?: { matches?: Array<{ numberInSurah?: number; text?: string; surah?: { number?: number; englishName?: string; name?: string } }> } };
    const matches = payload.data?.matches;
    if (!Array.isArray(matches)) return [];
    return matches.slice(0, 8).map((match, index) => {
      const surahNumber = Number(match.surah?.number ?? 0);
      const ayahNumber = Number(match.numberInSurah ?? 0);
      return {
        id: `quran-${surahNumber}-${ayahNumber}-${index}`,
        type: "Quran" as const,
        title: `${match.surah?.englishName ?? "Surah"} ${surahNumber}:${ayahNumber}`,
        description: String(match.text ?? "").trim(),
        href: `/quran?surah=${surahNumber}&ayah=${ayahNumber}`,
        arabic: match.surah?.name,
        score: 55 - index,
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
  }).slice(0, 14).map(({ score: _score, ...item }) => item);

  return Response.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
