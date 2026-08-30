type RouteProps = { params: Promise<{ surah: string; ayah: string }> };

type QuranWord = {
  position?: number;
  char_type_name?: string;
  text_uthmani?: string;
  translation?: { text?: string };
  transliteration?: { text?: string | null };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const values = await params;
  const surah = Number(values.surah);
  const ayah = Number(values.ayah);
  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
    return Response.json({ error: "A valid Surah and Ayah are required." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?language=en&words=true&word_fields=text_uthmani,translation,transliteration`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Word data unavailable");
    const payload = await response.json() as { verse?: { words?: QuranWord[] } };
    const words = (payload.verse?.words ?? [])
      .filter((word) => word.char_type_name === "word")
      .map((word) => ({ position: Number(word.position ?? 0), arabic: String(word.text_uthmani ?? ""), meaning: String(word.translation?.text ?? ""), transliteration: String(word.transliteration?.text ?? "") }));
    return Response.json({ words, source: "Quran Foundation word-by-word data" }, { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" } });
  } catch {
    return Response.json({ error: "Word-by-word meaning is temporarily unavailable." }, { status: 502 });
  }
}
