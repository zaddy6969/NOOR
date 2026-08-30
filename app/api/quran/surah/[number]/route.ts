type RouteProps = { params: Promise<{ number: string }> };

type UpstreamAyah = { numberInSurah?: number; text?: string; juz?: number; page?: number };
type UpstreamEdition = { identifier?: string; englishName?: string; language?: string };
type UpstreamSurah = {
  number?: number;
  name?: string;
  englishName?: string;
  englishNameTranslation?: string;
  revelationType?: string;
  numberOfAyahs?: number;
  ayahs?: UpstreamAyah[];
  edition?: UpstreamEdition;
};

type VerseTiming = { verse_key?: string; timestamp_from?: number; timestamp_to?: number; duration?: number };
type ChapterAudio = { audio_url?: string; duration?: number; verse_timings?: VerseTiming[] };

const TRANSLATIONS: Record<string, string> = {
  "en.sahih": "Saheeh International",
  "en.pickthall": "Marmaduke Pickthall",
  "ur.jalandhry": "Fateh Muhammad Jalandhry",
  "hi.hindi": "Hindi Translation",
};

const RECITERS: Record<string, { label: string; code: string; timingId?: number }> = {
  alafasy: { label: "Mishary Rashid Alafasy", code: "ar.alafasy", timingId: 7 },
  sudais: { label: "Abdurrahman as-Sudais", code: "ar.abdurrahmaansudais" },
  husary: { label: "Mahmoud Khalil Al-Husary", code: "ar.husary" },
  minshawi: { label: "Muhammad Siddiq al-Minshawi", code: "ar.minshawi" },
};

export async function GET(request: Request, { params }: RouteProps) {
  const { number } = await params;
  const surahNumber = Number(number);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return Response.json({ error: "Surah number must be between 1 and 114." }, { status: 400 });
  }

  const query = new URL(request.url).searchParams;
  const translationId = query.get("translation") && TRANSLATIONS[query.get("translation") as string] ? query.get("translation") as string : "en.sahih";
  const reciterId = query.get("reciter") && RECITERS[query.get("reciter") as string] ? query.get("reciter") as string : "alafasy";
  const reciter = RECITERS[reciterId];

  try {
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${translationId}`;
    const timingUrl = reciter.timingId ? `https://api.qurancdn.com/api/qdc/audio/reciters/${reciter.timingId}/audio_files?chapter=${surahNumber}&segments=true` : null;
    const [response, timingResponse] = await Promise.all([
      fetch(url, { headers: { Accept: "application/json" } }),
      timingUrl ? fetch(timingUrl, { headers: { Accept: "application/json" } }).catch(() => null) : Promise.resolve(null),
    ]);
    if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
    const payload = await response.json() as { data?: UpstreamSurah[] };
    if (!Array.isArray(payload.data) || payload.data.length < 2) throw new Error("Unexpected Quran API response");

    const arabic = payload.data.find((item) => item.edition?.identifier === "quran-uthmani") ?? payload.data[0];
    const english = payload.data.find((item) => item.edition?.identifier === translationId) ?? payload.data[1];
    const arabicAyahs = Array.isArray(arabic.ayahs) ? arabic.ayahs : [];
    const englishAyahs = Array.isArray(english.ayahs) ? english.ayahs : [];

    let chapterAudio: ChapterAudio | null = null;
    if (timingResponse?.ok) {
      const timingPayload = await timingResponse.json() as { audio_files?: ChapterAudio[] };
      chapterAudio = Array.isArray(timingPayload.audio_files) ? timingPayload.audio_files[0] ?? null : null;
    }

    const ayahs = arabicAyahs.map((ayah, index) => ({
      number: Number(ayah.numberInSurah ?? index + 1),
      arabic: String(ayah.text ?? ""),
      english: String(englishAyahs[index]?.text ?? ""),
      juz: Number(ayah.juz ?? 0),
      page: Number(ayah.page ?? 0),
    }));

    return Response.json({
      surah: {
        number: Number(arabic.number ?? surahNumber),
        name: String(arabic.name ?? ""),
        englishName: String(arabic.englishName ?? ""),
        meaning: String(arabic.englishNameTranslation ?? ""),
        revelationType: String(arabic.revelationType ?? ""),
        ayahs,
        audio: {
          src: String(chapterAudio?.audio_url ?? `https://cdn.islamic.network/quran/audio-surah/128/${reciter.code}/${surahNumber}.mp3`),
          duration: Number(chapterAudio?.duration ?? 0),
          reciterId,
          reciterName: reciter.label,
          verseTimings: (chapterAudio?.verse_timings ?? []).map((timing) => ({
            number: Number(String(timing.verse_key ?? "").split(":")[1] ?? 0),
            from: Number(timing.timestamp_from ?? 0),
            to: Number(timing.timestamp_to ?? 0),
            duration: Number(timing.duration ?? 0),
          })).filter((timing) => timing.number > 0 && timing.to > timing.from),
        },
      },
      translation: { id: translationId, name: TRANSLATIONS[translationId], language: english.edition?.language ?? "en" },
      attribution: { text: `Uthmani Quran text · ${TRANSLATIONS[translationId]} · Recitation by ${reciter.label}`, source: "Al Quran Cloud / Quran Foundation CDN" },
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return Response.json({ error: "This Surah is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
