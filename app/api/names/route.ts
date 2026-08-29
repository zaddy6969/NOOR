type UpstreamName = {
  number?: number;
  name?: string;
  transliteration?: string;
  en?: { meaning?: string };
};

export async function GET() {
  try {
    const response = await fetch("https://api.aladhan.com/v1/asmaAlHusna", {
      headers: { Accept: "application/json" },
      next: { revalidate: 604800 },
    });
    if (!response.ok) throw new Error("Names service unavailable");
    const payload = await response.json() as { data?: UpstreamName[] };
    const names = (payload.data ?? []).map((item, index) => ({
      number: Number(item.number ?? index + 1),
      name: String(item.name ?? ""),
      transliteration: String(item.transliteration ?? ""),
      meaning: String(item.en?.meaning ?? ""),
    })).filter((item) => item.number > 0 && item.name && item.transliteration);
    if (names.length !== 99) throw new Error("Incomplete Names data");
    return Response.json({ names }, { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" } });
  } catch {
    return Response.json({ error: "The complete Names list is temporarily unavailable." }, { status: 503 });
  }
}
