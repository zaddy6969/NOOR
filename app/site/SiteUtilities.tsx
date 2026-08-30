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
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
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

export function HeaderUtilities({ compact = false }: { compact?: boolean }) {
  const utilities = useContext(UtilitiesContext);
  const savedCount = useSavedItemCount();
  if (!utilities) return null;
  return (
    <div className={compact ? "site-utilities compact" : "site-utilities"}>
      <button className="header-global-search" type="button" onClick={utilities.openSearch} aria-label="Search everything in NOOR">
        <SearchIcon/><span>Search everything…</span><kbd>⌘ K</kbd>
      </button>
      <Link className={`saved-header-link${compact ? " compact" : ""}`} href="/saved" aria-label={`Open Saved, ${savedCount} ${savedCount === 1 ? "item" : "items"}`} title="Open saved items">
        <SavedIcon/><span>Saved</span>{savedCount > 0 ? <b aria-hidden="true">{savedCount > 99 ? "99+" : savedCount}</b> : null}
      </Link>
      <button className="theme-toggle" type="button" onClick={utilities.toggleTheme} aria-label={utilities.dark ? "Switch to light theme" : "Switch to dark theme"}>
        <span aria-hidden="true">{utilities.dark ? "☀" : "☾"}</span>
      </button>
      <label className="header-theme-select"><span className="sr-only">Theme</span><select value={utilities.dark ? "dark" : "light"} onChange={(event) => utilities.setTheme(event.target.value as "light" | "dark")} aria-label="Choose website theme"><option value="light">Light</option><option value="dark">Dark</option></select></label>
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("noor-theme-v2");
      const initialDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(initialDark);
      document.documentElement.classList.toggle("noor-dark", initialDark);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("noor-dark", dark);
    window.localStorage.setItem("noor-theme-v2", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const toggleTheme = useCallback(() => setDark((value) => !value), []);
  const setTheme = useCallback((theme: "light" | "dark") => setDark(theme === "dark"), []);

  const chooseResult = (result: SearchResult) => {
    setSearchOpen(false);
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
    <UtilitiesContext.Provider value={{ openSearch, dark, setTheme, toggleTheme }}>
      {children}
      {searchOpen ? (
        <div className="global-search-overlay" role="dialog" aria-modal="true" aria-label="Search NOOR">
          <button className="global-search-backdrop" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"/>
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
                placeholder="Try ‘Ayat ul Kursi’, ‘mosque near me’ or 2:255…"
                aria-label="Search topics, features, dictionary, destinations, Naats and Quran verses"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>ESC</button>
            </div>
            <div className="global-search-status">
              <strong>{query ? "SEARCH RESULTS" : "QUICK ACCESS"}</strong>
              <span>{loading ? "Searching Quran and NOOR…" : `${results.length} results`}</span>
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
              {!loading && query.trim() && results.length === 0 ? <p>No result found. Try a Surah name, verse reference such as 2:255, a city, product or a simpler spelling.</p> : null}
            </div>
            <footer><span>Press Enter to open the first result</span><span>Quran, glossary, places and every NOOR feature</span></footer>
          </section>
        </div>
      ) : null}
    </UtilitiesContext.Provider>
  );
}
