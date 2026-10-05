"use client";
import Link from "next/link";
import { useNoorCopy, LanguageControl, HeaderUtilities } from "./SiteUtilities";

export default function ToolHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { t } = useNoorCopy();
  return (
    <header className="quran-topbar compact-tool-topbar">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <span className="brand-star">✦</span>
        </span>
        <span>
          <strong>NOOR</strong>
          <small>DAILY MUSLIM</small>
        </span>
      </Link>
      <div>
        <strong>{t(title)}</strong>
        <span>{t(subtitle)}</span>
      </div>
      <nav className="daily-primary-nav" aria-label={t("Primary navigation")}>
        <Link href="/">{t("Today")}</Link>
        <Link href="/quran">{t("Quran")}</Link>
        <Link href="/prayer-times">{t("Prayer")}</Link>
        <Link href="/duas">{t("Duas")}</Link>
        <Link href="/#learn">{t("Learn")}</Link>
      </nav>
      <aside className="header-utility-cluster">
        <HeaderUtilities compact />
        <LanguageControl />
        <Link className="topic-home-link" href="/">
          ← {t("Home")}
        </Link>
      </aside>
    </header>
  );
}
