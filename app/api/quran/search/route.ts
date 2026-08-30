type SearchMatch = {
  numberInSurah?: number;
  text?: string;
  surah?: { number?: number; englishName?: string; englishNameTranslation?: string };
};

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 80) return Response.json({ results: [] });

  const direct = query.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (direct) {
    const surah = Number(direct[1]);
    const ayah = Number(direct[2]);
    if (surah >= 1 && surah <= 114 && ayah >= 1 && ayah <= 286) return Response.json({ results: [{ surah, ayah, title: `Quran ${surah}:${ayah}`, excerpt: "Open this exact Ayah" }] });
  }

  try {
    const arabic = /[\u0600-\u06ff]/.test(query);
    const edition = arabic ? "quran-uthmani" : "en.sahih";
    const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${edition}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Search unavailable");
    const payload = await response.json() as { data?: { matches?: SearchMatch[] } };
    const results = (payload.data?.matches ?? []).slice(0, 12).map((match) => ({
      surah: Number(match.surah?.number ?? 0),
      ayah: Number(match.numberInSurah ?? 0),
      title: `${match.surah?.englishName ?? "Quran"} ${match.surah?.number}:${match.numberInSurah}`,
      excerpt: String(match.text ?? "").slice(0, 180),
    })).filter((result) => result.surah > 0 && result.ayah > 0);
    return Response.json({ results }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return Response.json({ error: "Quran search is temporarily unavailable." }, { status: 502 });
  }
}
