"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type SearchResult = {
  id: string;
  type: "Feature" | "Topic" | "Guide" | "Naat" | "Quran";
  title: string;
  description: string;
  href: string;
  arabic?: string;
};

type UtilitiesContextValue = {
  openSearch: () => void;
  dark: boolean;
  toggleTheme: () => void;
};

const UtilitiesContext = createContext<UtilitiesContextValue | null>(null);

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}

export function HeaderUtilities({ compact = false }: { compact?: boolean }) {
  const utilities = useContext(UtilitiesContext);
  if (!utilities) return null;
  return (
    <div className={compact ? "site-utilities compact" : "site-utilities"}>
      <button className="header-global-search" type="button" onClick={utilities.openSearch} aria-label="Search everything in NOOR">
        <SearchIcon/><span>Search everything</span><kbd>⌘ K</kbd>
      </button>
      <button className="theme-toggle" type="button" onClick={utilities.toggleTheme} aria-label={utilities.dark ? "Switch to light theme" : "Switch to dark theme"}>
        <span aria-hidden="true">{utilities.dark ? "☀" : "☾"}</span>
      </button>
    </div>
  );
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
    const stored = window.localStorage.getItem("noor-theme-v2");
    const initialDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(initialDark);
    document.documentElement.classList.toggle("noor-dark", initialDark);
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

  const chooseResult = (result: SearchResult) => {
    setSearchOpen(false);
    setQuery("");
    router.push(result.href);
  };

  return (
    <UtilitiesContext.Provider value={{ openSearch, dark, toggleTheme }}>
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
                placeholder="Search a topic, Naat, Surah or verse…"
                aria-label="Search topics, features, Naats and Quran verses"
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
              {!loading && query.trim() && results.length === 0 ? <p>No result found. Try a Surah name, verse reference such as 2:255, or a simpler keyword.</p> : null}
            </div>
            <footer><span>Press Enter to open the first result</span><span>Quran search includes English verse meanings</span></footer>
          </section>
        </div>
      ) : null}
    </UtilitiesContext.Provider>
  );
}
