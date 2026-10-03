export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2 || query.length > 100)
    return Response.json(
      { error: "Enter between 2 and 100 characters." },
      { status: 400 },
    );
  try {
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?" +
        new URLSearchParams({
          name: query,
          count: "8",
          language: "en",
          format: "json",
        }),
      { signal: AbortSignal.timeout(8000), next: { revalidate: 86400 } },
    );
    if (!response.ok) throw new Error();
    const payload = (await response.json()) as {
      results?: Array<{
        id: number;
        name: string;
        country?: string;
        admin1?: string;
        latitude: number;
        longitude: number;
        timezone?: string;
      }>;
    };
    return Response.json({
      locations: (payload.results ?? [])
        .filter(
          (city) =>
            Number.isFinite(city.latitude) &&
            Number.isFinite(city.longitude) &&
            city.timezone,
        )
        .map((city) => ({
          id: "city-" + city.id,
          label: [
            ...new Set([city.name, city.admin1, city.country].filter(Boolean)),
          ].join(", "),
          latitude: city.latitude,
          longitude: city.longitude,
          accuracy: null,
          timezone: city.timezone,
          source: "search",
        })),
    });
  } catch {
    return Response.json(
      {
        error:
          "City search is temporarily unavailable. Use a preset city or device location.",
      },
      { status: 502 },
    );
  }
}
