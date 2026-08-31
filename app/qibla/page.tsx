import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import QiblaCompass from "./QiblaCompass";

export const metadata: Metadata = {
  title: "Qibla Compass — Find the Kaaba Direction",
  description: "Use your location and phone compass to find the great-circle Qibla direction to the Kaaba, privately in your browser.",
  alternates: { canonical: "/qibla" },
  openGraph: { title: "Qibla Compass | NOOR", description: "Find the direction to the Kaaba from your current location.", images: [] },
  twitter: { card: "summary", title: "Qibla Compass | NOOR", description: "Find the direction to the Kaaba from your current location.", images: [] },
};

export default function QiblaPage() {
  return (
    <main className="qibla-page" id="top">
      <header className="quran-topbar compact-tool-topbar"><Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><div><strong>QIBLA COMPASS</strong><span>Live direction to the Kaaba</span></div><aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside></header>
      <h1 className="sr-only">Qibla compass and direction to the Kaaba</h1>
      <QiblaCompass />
    </main>
  );
}
