import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Geist, Noto_Naskh_Arabic } from "next/font/google";
import { isClerkConfigured } from "@/lib/auth-config";
import MediaProvider from "./media/MediaProvider";
import SiteUtilitiesProvider from "./site/SiteUtilities";
import PwaRegister from "./site/PwaRegister";
import "./globals.css";
import "./home/noor-redesign.css";
import "./home/noor-polish.css";
import "./home/noor-production.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://noor-daily-muslim.vercel.app"),
  applicationName: "NOOR Daily Muslim",
  title: { default: "NOOR — Daily Muslim Companion", template: "%s · NOOR" },
  description: "Prayer, Quran, Naat, Islamic learning and trusted community resources—organized simply for everyday use.",
  keywords: ["Quran", "prayer times", "Qibla compass", "Islamic calendar", "Darood", "Muslim daily app"],
  alternates: { canonical: "/" },
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
  const application = <SiteUtilitiesProvider><MediaProvider>{children}</MediaProvider></SiteUtilitiesProvider>;
  const content = isClerkConfigured()
    ? <ClerkProvider dynamic>{application}</ClerkProvider>
    : application;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NOOR Daily Muslim",
      url: "https://noor-daily-muslim.vercel.app",
      logo: "https://noor-daily-muslim.vercel.app/favicon.svg",
      description: "A calm, privacy-conscious daily companion for prayer, Quran and trusted Islamic learning.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "NOOR Daily Muslim",
      url: "https://noor-daily-muslim.vercel.app",
      inLanguage: ["en", "ur", "hi"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://noor-daily-muslim.vercel.app/?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.VERCEL_ENV !== "production" ? <meta name="codex-preview" content="development" /> : null}
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('noor-theme-v2');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('noor-dark')}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${geist.variable} ${notoArabic.variable} ${display.variable}`}>
        <a className="skip-to-content" href="#main-content">Skip to main content</a>
        <div className="site-content-root" id="main-content" tabIndex={-1}>{content}</div>
        <PwaRegister />
      </body>
    </html>
  );
}
