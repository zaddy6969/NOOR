import { normalizeSearchText, searchWords } from "./search-match.ts";
const intents: [string, string[]][] = [
  [
    "sleeping",
    [
      "sone",
      "sona",
      "neend",
      "sleep",
      "sleeping",
      "bedtime",
      "सोने",
      "नींद",
      "سونے",
      "نیند",
    ],
  ],
  [
    "anxiety",
    [
      "anxiety",
      "anxious",
      "worry",
      "worried",
      "stress",
      "sadness",
      "grief",
      "debt",
      "pareshani",
      "gham",
      "qarz",
      "karz",
      "bechaini",
      "tension",
      "चिंता",
      "परेशानी",
      "پریشانی",
      "غم",
    ],
  ],
  ["waking", ["waking", "uthne", "jagne", "जागने", "اٹھنے"]],
  ["food", ["khana", "khane", "eating", "food", "खाने", "کھانے"]],
  ["travel", ["safar", "travel", "journey", "سفر", "सफ़र"]],
  [
    "parents",
    [
      "parents",
      "walidain",
      "maa baap",
      "mother",
      "father",
      "والدین",
      "माता पिता",
    ],
  ],
  [
    "knowledge",
    ["knowledge", "exam", "study", "ilm", "padhai", "imtihan", "पढ़ाई", "علم"],
  ],
  ["morning", ["subah", "morning", "सुबह", "صبح"]],
  ["evening", ["shaam", "sham", "evening", "शाम", "شام"]],
  ["forgiveness", ["maafi", "forgiveness", "tauba", "tawba", "माफ़ी", "توبہ"]],
];
export function duaIntent(query: string) {
  const normalized = normalizeSearchText(query),
    words = new Set(searchWords(query));
  return (
    intents.find(([, terms]) =>
      terms.some((term) =>
        term.includes(" ")
          ? normalized.includes(normalizeSearchText(term))
          : words.has(normalizeSearchText(term)),
      ),
    )?.[0] ?? null
  );
}
