"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { readSavedCollections, SAVED_ITEMS_EVENT, savedItemsTotal } from "./saved-items";

type SearchResult = {
  id: string;
  type: "Feature" | "Topic" | "Guide" | "Naat" | "Quran" | "Glossary" | "Place" | "Product";
  title: string;
  description: string;
  href: string;
  arabic?: string;
};

type UtilitiesContextValue = {
  openSearch: () => void;
  dark: boolean;
  locale: NoorLocale;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
};

type NoorLocale = "en" | "hi" | "ur";

const UTILITY_COPY: Record<NoorLocale, {
  search: string;
  searchLabel: string;
  saved: string;
  savedLabel: (count: number) => string;
  lightTheme: string;
  darkTheme: string;
  theme: string;
  placeholder: string;
  results: string;
  quick: string;
  searching: string;
  noResult: string;
  enterHint: string;
  scopeHint: string;
}> = {
  en: {
    search: "Search everything…",
    searchLabel: "Search everything in NOOR",
    saved: "Saved",
    savedLabel: (count) => `Open Saved, ${count} ${count === 1 ? "item" : "items"}`,
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    theme: "Choose website theme",
    placeholder: "Try ‘Ayat ul Kursi’, ‘mosque near me’ or 2:255…",
    results: "SEARCH RESULTS",
    quick: "QUICK ACCESS",
    searching: "Searching Quran and NOOR…",
    noResult: "No result found. Try a Surah name, verse reference such as 2:255, a city or a simpler spelling.",
    enterHint: "Press Enter to open the first result",
    scopeHint: "Quran, glossary, places and every NOOR feature",
  },
  hi: {
    search: "सब कुछ खोजें…",
    searchLabel: "नूर में सब कुछ खोजें",
    saved: "सहेजा हुआ",
    savedLabel: (count) => `सहेजी हुई चीज़ें खोलें, कुल ${count}`,
    lightTheme: "हल्की थीम लगाएँ",
    darkTheme: "गहरी थीम लगाएँ",
    theme: "वेबसाइट थीम चुनें",
    placeholder: "‘आयतुल कुर्सी’, ‘पास की मस्जिद’ या 2:255 खोजें…",
    results: "खोज परिणाम",
    quick: "जल्दी खोलें",
    searching: "क़ुरआन और नूर में खोज रहे हैं…",
    noResult: "कोई परिणाम नहीं मिला। सूरह, आयत, शहर या सरल शब्द आज़माएँ।",
    enterHint: "पहला परिणाम खोलने के लिए Enter दबाएँ",
    scopeHint: "क़ुरआन, शब्दकोश, स्थान और नूर की सभी सुविधाएँ",
  },
  ur: {
    search: "سب کچھ تلاش کریں…",
    searchLabel: "نور میں سب کچھ تلاش کریں",
    saved: "محفوظ",
    savedLabel: (count) => `محفوظ چیزیں کھولیں، کل ${count}`,
    lightTheme: "ہلکی تھیم لگائیں",
    darkTheme: "گہری تھیم لگائیں",
    theme: "ویب سائٹ تھیم منتخب کریں",
    placeholder: "’آیت الکرسی‘، ’قریب کی مسجد‘ یا 2:255 تلاش کریں…",
    results: "تلاش کے نتائج",
    quick: "فوری رسائی",
    searching: "قرآن اور نور میں تلاش جاری ہے…",
    noResult: "کوئی نتیجہ نہیں ملا۔ سورت، آیت، شہر یا آسان لفظ آزمائیں۔",
    enterHint: "پہلا نتیجہ کھولنے کے لیے Enter دبائیں",
    scopeHint: "قرآن، لغت، مقامات اور نور کی تمام سہولیات",
  },
};

const UtilitiesContext = createContext<UtilitiesContextValue | null>(null);

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}

function SavedIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V22l-6-3.8L6 22Z"/></svg>;
}

function useSavedItemCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(savedItemsTotal(readSavedCollections()));
    sync();
    window.addEventListener(SAVED_ITEMS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SAVED_ITEMS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return count;
}

export function HeaderUtilities({ compact = false, showSearch = true }: { compact?: boolean; showSearch?: boolean }) {
  const utilities = useContext(UtilitiesContext);
  const savedCount = useSavedItemCount();
  if (!utilities) return null;
  const copy = UTILITY_COPY[utilities.locale];
  return (
    <div className={compact ? "site-utilities compact" : "site-utilities"}>
      {showSearch ? (
        <button className="header-global-search" type="button" onClick={utilities.openSearch} aria-label={copy.searchLabel}>
          <SearchIcon/><span>{copy.search}</span><kbd>⌘ K</kbd>
        </button>
      ) : null}
      <Link className={`saved-header-link${compact ? " compact" : ""}`} href="/saved" aria-label={copy.savedLabel(savedCount)} title={copy.saved}>
        <SavedIcon/><span>{copy.saved}</span>{savedCount > 0 ? <b aria-hidden="true">{savedCount > 99 ? "99+" : savedCount}</b> : null}
      </Link>
      <button className="theme-toggle" type="button" onClick={utilities.toggleTheme} aria-label={utilities.dark ? copy.lightTheme : copy.darkTheme}>
        <span aria-hidden="true">{utilities.dark ? "☀" : "☾"}</span>
      </button>
      <label className="header-theme-select"><span className="sr-only">{copy.theme}</span><select value={utilities.dark ? "dark" : "light"} onChange={(event) => utilities.setTheme(event.target.value as "light" | "dark")} aria-label={copy.theme}><option value="light">Light</option><option value="dark">Dark</option></select></label>
    </div>
  );
}

export function SearchLauncher({ className, children }: { className?: string; children: React.ReactNode }) {
  const utilities = useContext(UtilitiesContext);
  if (!utilities) return null;
  return <button className={className} type="button" onClick={utilities.openSearch}>{children}</button>;
}

export default function SiteUtilitiesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [locale, setLocale] = useState<NoorLocale>("en");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openSearch = useCallback(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback((restoreFocus = true) => {
    setSearchOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("noor-theme-v2");
      const initialDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(initialDark);
      document.documentElement.classList.toggle("noor-dark", initialDark);
      setThemeReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle("noor-dark", dark);
    window.localStorage.setItem("noor-theme-v2", dark ? "dark" : "light");
  }, [dark, themeReady]);

  useEffect(() => {
    const syncLocale = () => {
      const saved = window.localStorage.getItem("noor-language");
      setLocale(saved === "hi" || saved === "ur" ? saved : "en");
    };
    syncLocale();
    window.addEventListener("noor:language-change", syncLocale);
    window.addEventListener("storage", syncLocale);
    return () => {
      window.removeEventListener("noor:language-change", syncLocale);
      window.removeEventListener("storage", syncLocale);
    };
  }, []);

  useEffect(() => {
    const requestedSearch = new URLSearchParams(window.location.search).get("search")?.trim();
    if (!requestedSearch) return;
    const frame = window.requestAnimationFrame(() => {
      setQuery(requestedSearch);
      openSearch();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSearch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape" && searchOpen) closeSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, openSearch, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((payload: { results?: SearchResult[] }) => setResults(Array.isArray(payload.results) ? payload.results : []))
        .catch((error: Error) => { if (error.name !== "AbortError") setResults([]); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, query.trim() ? 220 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchOpen]);

  const toggleTheme = useCallback(() => setDark((value) => !value), []);
  const setTheme = useCallback((theme: "light" | "dark") => setDark(theme === "dark"), []);
  const copy = UTILITY_COPY[locale];

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const chooseResult = (result: SearchResult) => {
    closeSearch(false);
    setQuery("");
    if (window.location.pathname === "/") {
      const resultUrl = new URL(result.href, window.location.origin);
      const exactPath = resultUrl.pathname;
      const feature = result.href.includes("/namaz#recitations") ? "daily-duas"
        : result.href.includes("/topics/tawheed#protection") ? "names"
        : exactPath === "/quran" ? "quran"
        : exactPath === "/qibla" ? "qibla"
        : exactPath === "/islamic-calendar" ? "islamic-calendar"
        : exactPath === "/mosque-finder" ? "mosque-finder"
        : exactPath === "/darood" ? "darood"
        : exactPath === "/zakat-calculator" ? "zakat"
        : exactPath === "/qaza-namaz" ? "kaza"
        : exactPath === "/firozul-lughat" || exactPath === "/glossary" ? "lughat"
        : exactPath === "/destinations" || exactPath === "/religious-tourism" ? "destinations"
        : result.href.includes("#prayer-times") || exactPath === "/namaz" ? "prayer-times"
        : null;
      if (feature) {
        window.dispatchEvent(new CustomEvent("noor:activate-feature", { detail: { feature, href: result.href } }));
        return;
      }
    }
    router.push(result.href);
  };

  return (
    <UtilitiesContext.Provider value={{ openSearch, dark, locale, setTheme, toggleTheme }}>
      {children}
      {searchOpen ? (
        <div ref={dialogRef} className="global-search-overlay" role="dialog" aria-modal="true" aria-label="Search NOOR" onKeyDown={trapDialogFocus}>
          <button className="global-search-backdrop" type="button" onClick={() => closeSearch()} aria-label="Close search"/>
          <section className="global-search-panel">
            <div className="global-search-input">
              <SearchIcon/>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0]) chooseResult(results[0]);
                }}
                placeholder={copy.placeholder}
                aria-label="Search topics, features, dictionary, destinations, Naats and Quran verses"
              />
              <button type="button" onClick={() => closeSearch()}>ESC</button>
            </div>
            <div className="global-search-status">
              <strong>{query ? copy.results : copy.quick}</strong>
              <span>{loading ? copy.searching : `${results.length} results`}</span>
            </div>
            <div className="global-search-results">
              {results.map((result) => (
                <button type="button" onClick={() => chooseResult(result)} key={result.id}>
                  <span className="global-result-type">{result.type}</span>
                  <div>
                    <strong>{result.title}</strong>
                    {result.arabic ? <b lang="ar" dir="rtl">{result.arabic}</b> : null}
                    <small>{result.description}</small>
                  </div>
                  <i aria-hidden="true">›</i>
                </button>
              ))}
              {!loading && query.trim() && results.length === 0 ? <p>{copy.noResult}</p> : null}
            </div>
            <footer><span>{copy.enterHint}</span><span>{copy.scopeHint}</span></footer>
          </section>
        </div>
      ) : null}
    </UtilitiesContext.Provider>
  );
}
