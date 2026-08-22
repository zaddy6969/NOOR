type RouteContext = {
  params: Promise<{ year: string; month: string }>;
};

type AlAdhanCalendarDay = {
  gregorian?: {
    date?: string;
    day?: string;
    weekday?: { en?: string };
  };
  hijri?: {
    date?: string;
    day?: string;
    year?: string;
    month?: { number?: number; en?: string; ar?: string };
    holidays?: string[];
    adjustedHolidays?: string[];
  };
};

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export async function GET(request: Request, { params }: RouteContext) {
  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);
  const requestedAdjustment = Number(new URL(request.url).searchParams.get("adjustment") ?? 0);
  const adjustment = Number.isInteger(requestedAdjustment) && requestedAdjustment >= -1 && requestedAdjustment <= 1
    ? requestedAdjustment
    : 0;

  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR || !Number.isInteger(month) || month < 1 || month > 12) {
    return Response.json(
      { error: `Choose a Gregorian month between January ${MIN_YEAR} and December ${MAX_YEAR}.` },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}?adjustment=${adjustment}`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) {
      throw new Error(`Calendar provider returned ${response.status}`);
    }

    const payload = await response.json() as { data?: AlAdhanCalendarDay[] };
    const days = (payload.data ?? []).flatMap((entry) => {
      const gregorian = entry.gregorian;
      const hijri = entry.hijri;

      if (!gregorian?.date || !gregorian.day || !hijri?.date || !hijri.day || !hijri.year || !hijri.month?.en) {
        return [];
      }

      return [{
        gregorianDate: gregorian.date,
        gregorianDay: Number(gregorian.day),
        weekday: gregorian.weekday?.en ?? "",
        hijriDate: hijri.date,
        hijriDay: Number(hijri.day),
        hijriMonth: hijri.month.en,
        hijriMonthNumber: hijri.month.number ?? 0,
        hijriMonthArabic: hijri.month.ar ?? "",
        hijriYear: Number(hijri.year),
        holidays: Array.from(new Set([...(hijri.holidays ?? []), ...(hijri.adjustedHolidays ?? [])])),
      }];
    });

    if (days.length === 0) {
      throw new Error("Calendar provider returned no usable dates");
    }

    return Response.json(
      {
        month,
        year,
        adjustment,
        days,
        source: "AlAdhan / Islamic Network",
        method: "Umm al-Qura calculated calendar",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    console.error("Islamic calendar request failed", error);
    return Response.json(
      { error: "The Islamic calendar could not be loaded right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
