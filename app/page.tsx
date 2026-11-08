"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ToolHeader from "./site/ToolHeader";
import SiteFooter from "./site/SiteFooter";
import { SearchLauncher, useNoorCopy } from "./site/SiteUtilities";
import { NoorIcon } from "./site/NoorIcon";
import HeroDailyStatus from "./home/HeroDailyStatus";
export { NoorIcon } from "./site/NoorIcon";
const features = [
  ["Quran", "/quran", "book"],
  ["Duas & Adhkar", "/duas", "dua"],
  ["Darood", "/darood", "darood"],
  ["99 Names", "/names", "names"],
  ["Zakat", "/zakat-calculator", "zakat"],
  ["Qaza prayers", "/qaza-namaz", "prayer"],
  ["Islamic glossary", "/glossary", "dictionary"],
  ["Travel & heritage", "/religious-tourism", "pin"],
] as const;
const legacy: Record<string, string> = {
  quran: "/quran",
  "daily-duas": "/duas",
  darood: "/darood",
  zakat: "/zakat-calculator",
  kaza: "/qaza-namaz",
  lughat: "/glossary",
  names: "/names",
  destinations: "/religious-tourism",
  "prayer-times": "/prayer-times",
  qibla: "/qibla",
  "islamic-calendar": "/islamic-calendar",
  "mosque-finder": "/mosque-finder",
};
export default function Home() {
  const { locale, t } = useNoorCopy();
  const router = useRouter();
  useEffect(() => {
    const redirect = () => {
      const route = legacy[location.hash.slice(1)];
      if (route)
        router.replace(route + (route === "/quran" ? location.search : ""));
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [router]);
  return (
    <main className="noor-home-v2">
      <ToolHeader title="Today" subtitle="Your daily companion" />
      <div className="home-content">
        <section className="home-welcome">
          <h1>{t("Assalamu Alaikum")}</h1>
          <p>{t("May Allah bless your day")}</p>
        </section>
        <SearchLauncher className="noor-home-search">
          <NoorIcon name="search" />
          <span>{t("Search Quran, duas and more…")}</span>
        </SearchLauncher>
        <HeroDailyStatus
          locale={locale}
          onPrayer={() => router.push("/prayer-times")}
          onCalendar={() => router.push("/islamic-calendar")}
          onQibla={() => router.push("/qibla")}
          onQuran={(target) =>
            router.push(`/quran?surah=${target.surah}&ayah=${target.ayah}`)
          }
        />
        <section id="explore">
          <div className="home-explore-heading"><h2>{t("Explore")}</h2><Link href="/features">{t("All features")} →</Link></div>
          <div className="home-feature-grid">
            {features.map(([label, href, icon]) => (
              <Link href={href} key={href}>
                <NoorIcon name={icon} />
                <span>{t(label)}</span>
              </Link>
            ))}
          </div>
          <div className="home-utility-links">
            <Link href="/qibla">{t("Qibla")} →</Link>
            <Link href="/islamic-calendar">{t("Calendar")} →</Link>
            <Link href="/mosque-finder">{t("Nearby mosques")} →</Link>
          </div>
        </section>
        <section id="learn" className="home-learn">
          <h2>{t("Learn")}</h2>
          <div>
            {[
              ["Wudu", "/namaz/wudu"],
              ["Prayer guide", "/namaz"],
              ["Five pillars", "/topics/pillars"],
              ["Naat & Salam", "/naat"],
            ].map(([title, href]) => (
              <Link href={href} key={href}>
                {t(title)} →
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </main>
  );
}
