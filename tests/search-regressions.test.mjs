import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSearchText, prepareSearch } from "../lib/search-match.ts";
import { SURAH_DIRECTORY } from "../lib/surah-directory.ts";

test("Hindi is retained and Arabic vowels, Urdu letters and Indic digits normalize", () => {
  assert.ok(normalizeSearchText("सोने की दुआ").includes("दुआ"));
  assert.equal(normalizeSearchText("قُرْآن"), normalizeSearchText("قرآن"));
  assert.equal(normalizeSearchText("۲:۲۵۵"), "2 255");
  assert.equal(normalizeSearchText("२:२५५"), "2 255");
});
test("natural language, transliteration and multilingual requests find relevant content", () => {
  for (const [query, text] of [
    ["how do I make wudhu", "Wudu ablution guide"],
    ["सोने की दुआ", "Dua before sleeping"],
    ["نماز کے اوقات", "Prayer times"],
    ["namaz timings", "Prayer times"],
    ["quraan", "Quran reader"],
    ["durood", "Darood Sharif"],
    ["forgive me", "Seeking forgiveness"],
    ["pryaer", "Prayer times"],
  ]) assert.ok(prepareSearch(query)(text) > 0, query);
  assert.equal(prepareSearch("how do I")("How do I perform prayer?"), 0);
  assert.equal(prepareSearch("zzxxyy unknown")("Quran reader"), 0);
  assert.equal(prepareSearch("सोने की दुआ")("Dua Seeking forgiveness"), 0);
  assert.ok(prepareSearch("prayer times")("Prayer times") > prepareSearch("prayer times")("Prayer practice"));
});
test("every Surah is searchable by name without an external service", () => {
  assert.equal(SURAH_DIRECTORY.length, 114);
  assert.equal(new Set(SURAH_DIRECTORY.map(s => s.number)).size, 114);
  for (const surah of SURAH_DIRECTORY) assert.ok(prepareSearch(surah.englishName)(`Surah ${surah.englishName} ${surah.name}`));
});
