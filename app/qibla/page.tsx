import ToolHeader from "../site/ToolHeader";
import type { Metadata } from "next";
import QiblaCompass from "./QiblaCompass";

export const metadata: Metadata = {
  title: "Qibla Compass — Find the Kaaba Direction",
  description:
    "Use your location and phone compass to find the great-circle Qibla direction to the Kaaba, privately in your browser.",
  alternates: { canonical: "/qibla" },
  openGraph: {
    title: "Qibla Compass | NOOR",
    description: "Find the direction to the Kaaba from your current location.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Qibla Compass | NOOR",
    description: "Find the direction to the Kaaba from your current location.",
    images: [],
  },
};

export default function QiblaPage() {
  return (
    <main className="qibla-page" id="top">
      <ToolHeader title="Qibla" subtitle="" />
      <h1 className="sr-only">Qibla compass and direction to the Kaaba</h1>
      <QiblaCompass />
    </main>
  );
}
