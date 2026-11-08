import type React from "react";
type IconName =
  | "book"
  | "clock"
  | "compass"
  | "calendar"
  | "mosque"
  | "dua"
  | "darood"
  | "zakat"
  | "prayer"
  | "dictionary"
  | "names"
  | "pin"
  | "home"
  | "grid"
  | "search"
  | "profile"
  | "music"
  | "family"
  | "shop"
  | "community"
  | "learn"
  | "info";
export function NoorIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: (
      <>
        <path d="M3.8 5.5A3.7 3.7 0 0 1 7.5 2H11a3 3 0 0 1 3 3v16a3 3 0 0 0-3-3H7.5a3.7 3.7 0 0 0-3.7 3.5Z" />
        <path d="M20.2 5.5A3.7 3.7 0 0 0 16.5 2H14v19a3 3 0 0 1 3-3h3.2Z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6.5V12l3.8 2.2" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16.5 7.5-2.8 6.2-6.2 2.8 2.8-6.2Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4m8-4v4M3 10h18" />
        <path d="M16 14a3 3 0 1 0 3 3 3.4 3.4 0 0 1-3-3Z" />
      </>
    ),
    mosque: (
      <>
        <path d="M4 21V11h16v10M8 21v-5a4 4 0 0 1 8 0v5M7 11a5 5 0 0 1 10 0M12 3v3M3 21h18" />
      </>
    ),
    dua: (
      <>
        <path d="M8.5 21 5.7 18.1a4 4 0 0 1-1.1-2.8V9.7a1.5 1.5 0 0 1 3 0v3.8-7a1.5 1.5 0 0 1 3 0V14l1.4 1.6 1.4-1.6V6.5a1.5 1.5 0 0 1 3 0v7-3.8a1.5 1.5 0 0 1 3 0v5.6a4 4 0 0 1-1.1 2.8L15.5 21" />
      </>
    ),
    darood: (
      <>
        <circle cx="12" cy="4.5" r="1.6" />
        <circle cx="7.5" cy="7.5" r="1.6" />
        <circle cx="6" cy="12.5" r="1.6" />
        <circle cx="9" cy="17" r="1.6" />
        <circle cx="15" cy="17" r="1.6" />
        <circle cx="18" cy="12.5" r="1.6" />
        <circle cx="16.5" cy="7.5" r="1.6" />
        <path d="M12 18.6V22" />
      </>
    ),
    zakat: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 16 8-8M8.5 8.5h.01M15.5 15.5h.01" />
      </>
    ),
    prayer: (
      <>
        <path d="M4 21h16M8 21v-6.3a4 4 0 0 1 8 0V21" />
        <circle cx="12" cy="7" r="2.1" />
        <path d="M9.5 11.5h5" />
      </>
    ),
    dictionary: (
      <>
        <path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4Z" />
        <path d="M20 4h-3a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h3Z" />
      </>
    ),
    names: (
      <>
        <path d="m12 2 2.3 3.2 3.9-.4.4 3.9L22 11l-2 3.4.8 3.8-3.9.8-2.6 3-2.8-2.8-3.9.7-.7-3.9L3 13.6l2-3.4-.8-3.8 3.9-.8Z" />
        <text
          x="12"
          y="14"
          textAnchor="middle"
          stroke="none"
          fill="currentColor"
          fontSize="7"
        >
          99
        </text>
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    family: (
      <>
        <circle cx="12" cy="5" r="2.4" />
        <circle cx="6" cy="15" r="2.4" />
        <circle cx="18" cy="15" r="2.4" />
        <path d="M12 7.5v3M6 12.5v-2h12v2" />
      </>
    ),
    shop: (
      <>
        <path d="M4 9h16l-1 12H5Z" />
        <path d="m6 9 1-5h10l1 5M9 13v4m6-4v4" />
      </>
    ),
    community: (
      <>
        <circle cx="8" cy="9" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M2.5 21a5.5 5.5 0 0 1 11 0M13 21a4.5 4.5 0 0 1 8.5-2" />
      </>
    ),
    learn: (
      <>
        <path d="M3 5h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3Z" />
        <path d="M21 5h-5a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h5Z" />
        <path d="M6 9h4M6 12h4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
