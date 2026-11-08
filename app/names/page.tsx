"use client";
import ToolHeader from "../site/ToolHeader";
import HomeFeatureWorkspace from "../home/HomeFeatureWorkspace";
import { useNoorCopy } from "../site/SiteUtilities";
export default function NamesPage() {
  const { locale } = useNoorCopy();
  return (
    <main className="quran-page">
      <ToolHeader title="99 Names" subtitle="Names of Allah" />
      <div className="home-content">
        <HomeFeatureWorkspace
          activeFeature="names"
          quranTarget={{ surah: 1, ayah: 1 }}
          locale={locale}
        />
      </div>
    </main>
  );
}
