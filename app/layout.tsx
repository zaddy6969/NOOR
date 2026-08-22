import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Noto_Naskh_Arabic } from "next/font/google";
import { isClerkConfigured } from "@/lib/auth-config";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noor-daily-companion.amused-snail-8449.chatgpt.site"),
  title: "NOOR — Daily Muslim Companion",
  description: "Prayer, Quran, Naat, Islamic learning and trusted community resources—organized simply for everyday use.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = isClerkConfigured()
    ? <ClerkProvider dynamic>{children}</ClerkProvider>
    : children;

  return (
    <html lang="en">
      <body className={`${geist.variable} ${notoArabic.variable}`}>{content}</body>
    </html>
  );
}
