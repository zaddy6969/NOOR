"use client";
import Link from "next/link";
import styles from "./home/homepage.module.css";
import Image from "next/image";
import { MORE_FEATURE_GROUPS, MORE_GROUP_LABELS, MORE_FEATURE_LABELS } from "./home/illustrated-features";
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
      if (route) router.replace(route + (route === "/quran" ? location.search : ""));
    };
    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [router]);
  return (
    <main className={`noor-home-v2 ${styles.page}`}>
      <ToolHeader title="Today" subtitle="Your daily companion" />
      <section className={styles.hero} aria-labelledby="home-title">
        <Image src="/images/noor/hero-scene.webp" alt="" fill priority sizes="(max-width: 1248px) 100vw, 1200px" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>NOOR · DAILY MUSLIM</span>
          <h1 id="home-title">{t("Assalamu Alaikum")}</h1>
          <p>{t("May Allah bless your day")}</p>
          <SearchLauncher className={styles.search}>
            <NoorIcon name="search" /><span>{t("Search Quran, duas and more…")}</span>
          </SearchLauncher>
          <div className={styles.heroLinks}>
            <Link href="/quran">{t("Read Quran")} <span aria-hidden="true">→</span></Link>
            <a href="#explore">{t("Explore all features")} <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <div className={styles.content}>
        <section className={styles.status} aria-label={t("Your daily companion")}>
          <HeroDailyStatus locale={locale} onPrayer={() => router.push("/prayer-times")} onCalendar={() => router.push("/islamic-calendar")} onQibla={() => router.push("/qibla")} onQuran={target => router.push(`/quran?surah=${target.surah}&ayah=${target.ayah}`)} />
        </section>
        <section className={styles.daily} aria-labelledby="daily-title">
          <div className={styles.sectionHeading}><h2 id="daily-title">{t("Daily tools")}</h2><Link href="/saved">{t("Saved")} →</Link></div>
          <div className={styles.dailyGrid}>
            {features.map(([label, href, icon]) => <Link href={href} key={href}><NoorIcon name={icon}/><span>{t(label)}</span></Link>)}
          </div>
          <div className={styles.quickLinks}>
            {([['Prayer Times','/prayer-times','clock'],['Qibla','/qibla','compass'],['Calendar','/islamic-calendar','calendar'],['Nearby mosques','/mosque-finder','mosque']] as const).map(([label,href,icon])=><Link key={href} href={href}><NoorIcon name={icon}/>{t(label)}</Link>)}
          </div>
        </section>
        <section id="explore" className={styles.explore} aria-labelledby="explore-title">
          <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>{t("Discover NOOR")}</span><h2 id="explore-title">{t("All features")}</h2></div><Link href="/features">{t("Browse directory")} →</Link></div>
          {MORE_FEATURE_GROUPS.map((group) => <section className={styles.featureGroup} key={group.label}>
            <h3>{MORE_GROUP_LABELS[locale][group.label] ?? t(group.label)}</h3>
            <div className={styles.featureGrid}>
              {group.features.map(feature => {
                const localized = MORE_FEATURE_LABELS[locale][feature.href];
                const [sheet, row, col] = feature.art.split('-');
                const columns = sheet === 'support' ? 2 : 4;
                return <Link href={feature.href} key={feature.href} className={styles.featureCard}>
                  <span className={styles.cardArt} aria-hidden="true" style={{backgroundImage:`url(/images/noor/more-features/${sheet}.webp)`,backgroundSize:`${columns * 100}% 200%`,backgroundPosition:`${(Number(col.slice(1))-1)*100/(columns-1)}% ${row === 'r1' ? 0 : 100}%`}}/>
                  <span className={styles.cardLabel}>{localized?.[0] ?? t(feature.label)}<span aria-hidden="true">→</span></span>
                  {feature.href === '/matrimony' ? <small>{t("Matching unavailable")}</small> : feature.href === '/shop' ? <small>{t("No checkout")}</small> : null}
                </Link>;
              })}
            </div>
          </section>)}
          <div className={styles.supportLinks}><Link href="/corrections">{t("Report a correction")} →</Link><Link href="/content-review">{t("Content review")} →</Link><Link href="/editorial-policy">{t("Editorial policy")} →</Link></div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </main>
  );
}
