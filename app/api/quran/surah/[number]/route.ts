type RouteProps = { params: Promise<{ number: string }> };

type UpstreamAyah = { numberInSurah?: number; text?: string; audio?: string; juz?: number; page?: number };
type UpstreamEdition = { identifier?: string; englishName?: string };
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

export async function GET(_request: Request, { params }: RouteProps) {
  const { number } = await params;
  const surahNumber = Number(number);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return Response.json({ error: "Surah number must be between 1 and 114." }, { status: 400 });
  }

  try {
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.pickthall,ar.alafasy`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
    const payload = await response.json() as { data?: UpstreamSurah[] };
    if (!Array.isArray(payload.data) || payload.data.length < 2) throw new Error("Unexpected Quran API response");

    const arabic = payload.data.find((item) => item.edition?.identifier === "quran-uthmani") ?? payload.data[0];
    const english = payload.data.find((item) => item.edition?.identifier === "en.pickthall") ?? payload.data[1];
    const audio = payload.data.find((item) => item.edition?.identifier === "ar.alafasy") ?? payload.data[2];
    const arabicAyahs = Array.isArray(arabic.ayahs) ? arabic.ayahs : [];
    const englishAyahs = Array.isArray(english.ayahs) ? english.ayahs : [];
    const audioAyahs = Array.isArray(audio?.ayahs) ? audio.ayahs : [];

    const ayahs = arabicAyahs.map((ayah, index) => ({
      number: Number(ayah.numberInSurah ?? index + 1),
      arabic: String(ayah.text ?? ""),
      english: String(englishAyahs[index]?.text ?? ""),
      audio: String(audioAyahs[index]?.audio ?? ""),
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
      },
      attribution: { text: "Uthmani Quran text · English meaning by Marmaduke Pickthall · Recitation by Mishary Rashid Alafasy", source: "Al Quran Cloud / Islamic Network" },
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return Response.json({ error: "This Surah is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
