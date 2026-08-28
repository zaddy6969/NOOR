type OverpassElement = {
  id?: number;
  type?: string;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

type PlaceKind = "Mosque" | "Dargah";
type MosqueResult = {
  id: string;
  name: string;
  address: string;
  denomination: string | null;
  phone: string | null;
  website: string | null;
  kind: PlaceKind;
  lat: number;
  lng: number;
  distanceKm: number;
};

function numberParam(value: string | null, minimum: number, maximum: number) {
  if (value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum ? number : null;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function address(tags: Record<string, string>) {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  return [street, tags["addr:suburb"], tags["addr:city"], tags["addr:postcode"]].filter(Boolean).join(", ") || "Address not added to OpenStreetMap";
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latitude = numberParam(params.get("lat"), -90, 90);
  const longitude = numberParam(params.get("lng"), -180, 180);
  const radius = numberParam(params.get("radius"), 1000, 20000) ?? 5000;
  if (latitude === null || longitude === null) return Response.json({ error: "Valid latitude and longitude are required." }, { status: 400 });

  const query = `[out:json][timeout:20];(
    nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${Math.round(radius)},${latitude},${longitude});
    nwr["building"="mosque"](around:${Math.round(radius)},${latitude},${longitude});
  );out center tags;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: new URLSearchParams({ data: query }),
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "NOOR-Daily-Muslim/1.0 mosque-finder" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Map service returned ${response.status}`);
    const payload = await response.json() as { elements?: OverpassElement[] };
    const seen = new Set<string>();
    const collected: MosqueResult[] = [];
    for (const element of payload.elements ?? []) {
      const lat = element.lat ?? element.center?.lat;
      const lng = element.lon ?? element.center?.lon;
      if (typeof lat !== "number" || typeof lng !== "number") continue;
      const key = `${lat.toFixed(5)}-${lng.toFixed(5)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const tags = element.tags ?? {};
      const rawName = tags.name ?? tags["name:en"] ?? tags["name:ur"] ?? "";
      const kind: PlaceKind = /dargah|dargha|mazar|maqbara|shrine|tomb/i.test(`${rawName} ${tags.building ?? ""} ${tags.tourism ?? ""}`) ? "Dargah" : "Mosque";
      const name = rawName || (kind === "Dargah" ? "Local dargah" : "Local masjid");
      const unnamedDuplicate = !rawName && collected.some((item) => /^Local /i.test(item.name) && item.kind === kind && distanceKm(item.lat, item.lng, lat, lng) < 0.08);
      if (unnamedDuplicate) continue;
      collected.push({
        id: `${element.type ?? "place"}-${element.id ?? key}`,
        name,
        address: address(tags),
        denomination: tags.denomination ?? null,
        phone: tags.phone ?? tags["contact:phone"] ?? null,
        website: tags.website ?? tags["contact:website"] ?? null,
        kind,
        lat,
        lng,
        distanceKm: distanceKm(latitude, longitude, lat, lng),
      });
    }
    const mosques = collected.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 40);
    return Response.json({ mosques, center: { lat: latitude, lng: longitude }, radius }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch {
    return Response.json({ error: "The live mosque map is busy. Please wait a moment and try again." }, { status: 503 });
  }
}
