import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Noto_Naskh_Arabic } from "next/font/google";
import { isClerkConfigured } from "@/lib/auth-config";
import MediaProvider from "./media/MediaProvider";
import SiteUtilitiesProvider from "./site/SiteUtilities";
import PwaRegister from "./site/PwaRegister";
import HomeStatusStrip from "./home/HomeStatusStrip";
import "./globals.css";
import "./home/mmt-home.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://noor-daily-muslim.vercel.app"),
  applicationName: "NOOR Daily Muslim",
  title: { default: "NOOR — Daily Muslim Companion", template: "%s · NOOR" },
  description: "Prayer, Quran, Naat, Islamic learning and trusted community resources—organized simply for everyday use.",
  keywords: ["Quran", "prayer times", "Qibla compass", "Islamic calendar", "Darood", "Muslim daily app"],
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "NOOR — Daily Muslim Companion",
    description: "Faith, Quran, Naat and trusted community resources in one peaceful place.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "NOOR Daily Muslim Companion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOOR — Daily Muslim Companion",
    description: "Faith, Quran, Naat and trusted community resources in one peaceful place.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1d19" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const application = <SiteUtilitiesProvider><MediaProvider>{children}<HomeStatusStrip /></MediaProvider></SiteUtilitiesProvider>;
  const content = isClerkConfigured()
    ? <ClerkProvider dynamic>{application}</ClerkProvider>
    : application;

  return (
    <html lang="en">
      <body className={`${geist.variable} ${notoArabic.variable}`}>{content}<PwaRegister /></body>
    </html>
  );
}
