type RouteProps = { params: Promise<{ surah: string; ayah: string }> };

function plainText(html: string) {
  return html
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>|<\/h\d>|<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function GET(_request: Request, { params }: RouteProps) {
  const values = await params;
  const surah = Number(values.surah);
  const ayah = Number(values.ayah);
  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
    return Response.json({ error: "A valid Surah and Ayah are required." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.quran.com/api/v4/tafsirs/169/by_ayah/${surah}:${ayah}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Tafsir unavailable");
    const payload = await response.json() as { tafsir?: { resource_name?: string; text?: string } };
    const text = plainText(String(payload.tafsir?.text ?? ""));
    if (!text) throw new Error("Empty tafsir");
    return Response.json({ title: payload.tafsir?.resource_name ?? "Ibn Kathir (Abridged)", text: text.slice(0, 12000), truncated: text.length > 12000, source: "Quran Foundation" }, { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" } });
  } catch {
    return Response.json({ error: "Tafsir is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
