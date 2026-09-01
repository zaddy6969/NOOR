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
  recent: string;
  clearRecent: string;
  removeRecent: string;
  popular: string;
  matches: string;
  clearInput: string;
  closeSearch: string;
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
    recent: "Recent searches",
    clearRecent: "Clear all",
    removeRecent: "Remove from recent searches",
    popular: "Popular searches",
    matches: "Best matches",
    clearInput: "Clear search",
    closeSearch: "Close search",
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
    recent: "हाल की खोजें",
    clearRecent: "सभी हटाएँ",
    removeRecent: "हाल की खोजों से हटाएँ",
    popular: "लोकप्रिय खोजें",
    matches: "सबसे अच्छे परिणाम",
    clearInput: "खोज साफ़ करें",
    closeSearch: "खोज बंद करें",
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
    recent: "حالیہ تلاشیں",
    clearRecent: "سب صاف کریں",
    removeRecent: "حالیہ تلاشوں سے ہٹائیں",
    popular: "مقبول تلاشیں",
    matches: "بہترین نتائج",
    clearInput: "تلاش صاف کریں",
    closeSearch: "تلاش بند کریں",
  },
};

const UtilitiesContext = createContext<UtilitiesContextValue | null>(null);

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}

function HistoryIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7v5h5"/><path d="M5.5 16a8 8 0 1 0-.8-7.7L4 12"/><path d="M12 7.5V12l3 2"/></svg>;
}

const RECENT_SEARCH_KEY = "noor-recent-searches-v1";
const MAX_RECENT_SEARCHES = 6;
const POPULAR_SEARCHES: Record<NoorLocale, string[]> = {
  en: ["Ayat al-Kursi", "Prayer times", "Surah Al-Waqi‘ah", "Mosque near me", "Daily duas"],
  hi: ["आयतुल कुर्सी", "नमाज़ के समय", "सूरह वाक़िआ", "पास की मस्जिद", "रोज़ाना दुआएँ"],
  ur: ["آیت الکرسی", "نماز کے اوقات", "سورۃ الواقعہ", "قریب کی مسجد", "روزانہ دعائیں"],
};

function readRecentSearches() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_SEARCH_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, MAX_RECENT_SEARCHES) : [];
  } catch {
    return [];
  }
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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const updateSearchQuery = useCallback((value: string) => {
    setQuery(value);
    setResults([]);
    setActiveResult(0);
    setLoading(Boolean(value.trim()));
  }, []);

  const openSearch = useCallback(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setRecentSearches(readRecentSearches());
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback((restoreFocus = true) => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
    setActiveResult(0);
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
      updateSearchQuery(requestedSearch);
      openSearch();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSearch, updateSearchQuery]);

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
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((payload: { results?: SearchResult[] }) => setResults(Array.isArray(payload.results) ? payload.results : []))
        .catch((error: Error) => { if (error.name !== "AbortError") setResults([]); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 180);
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

  const rememberSearch = useCallback((value: string) => {
    const clean = value.trim().replace(/\s+/g, " ");
    if (clean.length < 2) return;
    setRecentSearches((current) => {
      const next = [clean, ...current.filter((item) => item.toLocaleLowerCase() !== clean.toLocaleLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeRecentSearch = (value: string) => {
    setRecentSearches((current) => {
      const next = current.filter((item) => item !== value);
      window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    window.localStorage.removeItem(RECENT_SEARCH_KEY);
  };

  const chooseResult = (result: SearchResult) => {
    rememberSearch(query);
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
            <header className="global-search-head">
              <div className="global-search-field">
                <SearchIcon/>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => updateSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && results.length) {
                      event.preventDefault();
                      setActiveResult((index) => (index + 1) % results.length);
                    } else if (event.key === "ArrowUp" && results.length) {
                      event.preventDefault();
                      setActiveResult((index) => (index - 1 + results.length) % results.length);
                    } else if (event.key === "Enter" && results[activeResult]) {
                      event.preventDefault();
                      chooseResult(results[activeResult]);
                    }
                  }}
                  placeholder={copy.placeholder}
                  aria-label="Search topics, features, dictionary, destinations, Naats and Quran verses"
                  aria-controls="noor-search-results"
                  aria-activedescendant={results[activeResult] ? `noor-search-result-${activeResult}` : undefined}
                  autoComplete="off"
                />
                {query ? <button className="global-search-clear" type="button" onClick={() => updateSearchQuery("")} aria-label={copy.clearInput}><CloseIcon/></button> : null}
              </div>
              <button className="global-search-close" type="button" onClick={() => closeSearch()} aria-label={copy.closeSearch}><CloseIcon/></button>
            </header>

            {!query.trim() ? (
              <div className="global-search-start">
                {recentSearches.length ? (
                  <section className="global-search-recents" aria-labelledby="recent-searches-title">
                    <header><strong id="recent-searches-title">{copy.recent}</strong><button type="button" onClick={clearRecentSearches}>{copy.clearRecent}</button></header>
                    <div>
                      {recentSearches.map((item) => (
                        <div className="global-search-recent" key={item}>
                          <button className="global-search-recent-query" type="button" onClick={() => updateSearchQuery(item)}><HistoryIcon/><span>{item}</span></button>
                          <button className="global-search-recent-remove" type="button" onClick={() => removeRecentSearch(item)} aria-label={`${copy.removeRecent}: ${item}`}><CloseIcon/></button>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
                <section className="global-search-popular" aria-labelledby="popular-searches-title">
                  <strong id="popular-searches-title">{copy.popular}</strong>
                  <div>{POPULAR_SEARCHES[locale].map((item) => <button type="button" onClick={() => updateSearchQuery(item)} key={item}><SearchIcon/><span>{item}</span></button>)}</div>
                </section>
              </div>
            ) : (
              <>
                <div className="global-search-status" role="status" aria-live="polite">
                  <strong>{copy.matches}</strong>
                  <span>{loading ? copy.searching : `${results.length} ${results.length === 1 ? "result" : "results"}`}</span>
                </div>
                <div className="global-search-results" id="noor-search-results" role="listbox" aria-label={copy.results}>
                  {loading ? <div className="global-search-loading" aria-hidden="true"><span/><span/><span/></div> : null}
                  {!loading && results.map((result, index) => (
                    <button
                      className={activeResult === index ? "active" : undefined}
                      id={`noor-search-result-${index}`}
                      role="option"
                      aria-selected={activeResult === index}
                      type="button"
                      onMouseEnter={() => setActiveResult(index)}
                      onClick={() => chooseResult(result)}
                      key={result.id}
                    >
                      <span className="global-result-icon"><SearchIcon/></span>
                      <div>
                        <strong>{result.title}</strong>
                        <small><span>{result.type}</span>{result.description}</small>
                      </div>
                      {result.arabic ? <b lang="ar" dir="rtl">{result.arabic}</b> : null}
                      <i aria-hidden="true">↗</i>
                    </button>
                  ))}
                  {!loading && results.length === 0 ? <div className="global-search-empty"><SearchIcon/><p>{copy.noResult}</p></div> : null}
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </UtilitiesContext.Provider>
  );
}
