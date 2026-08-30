"use client";

import { useEffect, useMemo, useState } from "react";
import { readSavedList, SAVED_KEYS, writeSavedList } from "../site/saved-items";

type DaroodCategory = "Prophetic" | "Traditional" | "Short";
type Filter = "All" | DaroodCategory | "Saved";
export type DaroodEntry = {
  id: string;
  title: string;
  alternate: string;
  category: DaroodCategory;
  arabic: string;
  roman?: string;
  meaning: string;
  source: string;
  note: string;
};

export const daroodEntries: DaroodEntry[] = [
  {
    id: "ibrahimiyyah",
    title: "Darood Ibrahim",
    alternate: "Salat al-Ibrahimiyyah",
    category: "Prophetic",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    roman: "Allahumma salli ‘ala Muhammadin wa ‘ala aali Muhammad, kama sallaita ‘ala Ibrahima wa ‘ala aali Ibrahim, innaka Hamidum Majid. Allahumma barik ‘ala Muhammadin wa ‘ala aali Muhammad, kama barakta ‘ala Ibrahima wa ‘ala aali Ibrahim, innaka Hamidum Majid.",
    meaning: "O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.",
    source: "Sahih al-Bukhari 3370 and 6357",
    note: "A hadith-reported wording taught by the Prophet ﷺ and recited in Salah.",
  },
  {
    id: "wives-offspring",
    title: "Salawat for His Family",
    alternate: "Wives and offspring wording",
    category: "Prophetic",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    roman: "Allahumma salli ‘ala Muhammadin wa ‘ala azwajihi wa dhurriyyatihi kama sallaita ‘ala aali Ibrahim, wa barik ‘ala Muhammadin wa ‘ala azwajihi wa dhurriyyatihi kama barakta ‘ala aali Ibrahim, innaka Hamidum Majid.",
    meaning: "O Allah, send blessings upon Muhammad, his wives and his offspring as You sent blessings upon the family of Ibrahim; and bless Muhammad, his wives and his offspring as You blessed the family of Ibrahim. You are Praiseworthy, Glorious.",
    source: "Sahih al-Bukhari, Book of Invocations",
    note: "A hadith-reported variation that explicitly mentions the Prophet’s wives and offspring.",
  },
  {
    id: "short-salawat",
    title: "Short Darood",
    alternate: "A concise daily Salawat",
    category: "Short",
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    roman: "Allahumma salli wa sallim ‘ala nabiyyina Muhammad.",
    meaning: "O Allah, send Your blessings and peace upon our Prophet Muhammad.",
    source: "Hisn al-Muslim 98",
    note: "A short wording that is easy to include in morning, evening and daily remembrance.",
  },
  {
    id: "tanjeena",
    title: "Darood Tanjeena",
    alternate: "Salat al-Munjiyyah · Prayer of Deliverance",
    category: "Traditional",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    roman: "Allahumma salli ‘ala sayyidina Muhammadin salatan tunajjina biha min jami‘il-ahwali wal-afat, wa taqdi lana biha jami‘al-hajat, wa tutahhiruna biha min jami‘is-sayyi’at, wa tarfa‘una biha ‘indaka a‘lad-darajat, wa tuballighuna biha aqsal-ghayati min jami‘il-khayrati fil-hayati wa ba‘dal-mamat, innaka ‘ala kulli shay’in qadir.",
    meaning: "O Allah, send blessings upon our master Muhammad by which You deliver us from terrors and harms, fulfil our needs, purify us from wrongs, raise us in rank, and bring us to the furthest goals of goodness in life and after death. You have power over all things.",
    source: "Traditional Salawat associated with Shaykh Musa al-Darir",
    note: "A later traditional supplication, not presented as a hadith wording.",
  },
  {
    id: "nariya",
    title: "Darood Nariya",
    alternate: "Salat al-Tafrijiyyah · Prayer of Relief",
    category: "Traditional",
    arabic: "اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ، وَتَنْفَرِجُ بِهِ الْكُرَبُ، وَتُقْضَى بِهِ الْحَوَائِجُ، وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِمِ، وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ، وَعَلَى آلِهِ وَصَحْبِهِ فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ",
    roman: "Allahumma salli salatan kamilatan wa sallim salaman tamman ‘ala sayyidina Muhammadin alladhi tanhallu bihil-‘uqad, wa tanfariju bihil-kurab, wa tuqda bihil-hawa’ij, wa tunalu bihir-ragha’ibu wa husnul-khawatim, wa yustasqal-ghamamu bi wajhihil-karim, wa ‘ala aalihi wa sahbihi fi kulli lamhatin wa nafasin bi ‘adadi kulli ma‘lumin lak.",
    meaning: "O Allah, bestow complete blessings and perfect peace upon our master Muhammad, through whom knots are untied, distress is relieved, needs are fulfilled, hopes and a good ending are attained, and rain is sought by his noble countenance; and upon his family and companions in every moment and breath, by the number of all things known to You.",
    source: "Traditional Salawat commonly attributed to Imam al-Qurtubi",
    note: "A later traditional wording. Claims about fixed counts or guaranteed outcomes require reliable scholarly evidence.",
  },
  {
    id: "fatih",
    title: "Darood Fatih",
    alternate: "Salat al-Fatih · Prayer of the Opener",
    category: "Traditional",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ، وَالْخَاتِمِ لِمَا سَبَقَ، نَاصِرِ الْحَقِّ بِالْحَقِّ، وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ، وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ",
    roman: "Allahumma salli ‘ala sayyidina Muhammadinil-fatihi lima ughliqa, wal-khatimi lima sabaqa, nasiril-haqqi bil-haqqi, wal-hadi ila siratikal-mustaqim, wa ‘ala aalihi haqqa qadrihi wa miqdarihil-‘azim.",
    meaning: "O Allah, send blessings upon our master Muhammad, the opener of what was closed, the seal of what came before, the supporter of truth by truth, and the guide to Your straight path; and upon his family according to his true worth and immense rank.",
    source: "Traditional Salawat associated with Muhammad al-Bakri",
    note: "A later devotional wording, not presented as a hadith text.",
  },
  {
    id: "shifa",
    title: "Darood Shifa",
    alternate: "Traditional Salawat of healing",
    category: "Traditional",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا، وَعَافِيَةِ الْأَبْدَانِ وَشِفَائِهَا، وَنُورِ الْأَبْصَارِ وَضِيَائِهَا، وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
    roman: "Allahumma salli ‘ala sayyidina Muhammadin tibbil-qulubi wa dawa’iha, wa ‘afiyatil-abdani wa shifa’iha, wa nuril-absari wa diya’iha, wa ‘ala aalihi wa sahbihi wa sallim.",
    meaning: "O Allah, send blessings upon our master Muhammad, the medicine and remedy of hearts, the well-being and healing of bodies, and the light and illumination of sight; and upon his family and companions, and grant peace.",
    source: "Traditional devotional Salawat",
    note: "A traditional wording. It is not a replacement for medical care or prescribed treatment.",
  },
  {
    id: "taj",
    title: "Darood Taj",
    alternate: "The Salutation of the Crown",
    category: "Traditional",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَاحِبِ التَّاجِ وَالْمِعْرَاجِ وَالْبُرَاقِ وَالْعَلَمِ، دَافِعِ الْبَلَاءِ وَالْوَبَاءِ وَالْقَحْطِ وَالْمَرَضِ وَالْأَلَمِ، اِسْمُهُ مَكْتُوبٌ مَرْفُوعٌ مَشْفُوعٌ مَنْقُوشٌ فِي اللَّوْحِ وَالْقَلَمِ، سَيِّدِ الْعَرَبِ وَالْعَجَمِ، جِسْمُهُ مُقَدَّسٌ مُعَطَّرٌ مُطَهَّرٌ مُنَوَّرٌ فِي الْبَيْتِ وَالْحَرَمِ، شَمْسِ الضُّحَى، بَدْرِ الدُّجَى، صَدْرِ الْعُلَى، نُورِ الْهُدَى، كَهْفِ الْوَرَى، مِصْبَاحِ الظُّلَمِ، جَمِيلِ الشِّيَمِ، شَفِيعِ الْأُمَمِ، صَاحِبِ الْجُودِ وَالْكَرَمِ، وَاللَّهُ عَاصِمُهُ، وَجِبْرِيلُ خَادِمُهُ، وَالْبُرَاقُ مَرْكَبُهُ، وَالْمِعْرَاجُ سَفَرُهُ، وَسِدْرَةُ الْمُنْتَهَى مَقَامُهُ، وَقَابَ قَوْسَيْنِ مَطْلُوبُهُ، وَالْمَطْلُوبُ مَقْصُودُهُ، وَالْمَقْصُودُ مَوْجُودُهُ، سَيِّدِ الْمُرْسَلِينَ، خَاتَمِ النَّبِيِّينَ، شَفِيعِ الْمُذْنِبِينَ، أَنِيسِ الْغَرِيبِينَ، رَحْمَةٍ لِلْعَالَمِينَ، رَاحَةِ الْعَاشِقِينَ، مُرَادِ الْمُشْتَاقِينَ، شَمْسِ الْعَارِفِينَ، سِرَاجِ السَّالِكِينَ، مِصْبَاحِ الْمُقَرَّبِينَ، مُحِبِّ الْفُقَرَاءِ وَالْغُرَبَاءِ وَالْمَسَاكِينِ، سَيِّدِ الثَّقَلَيْنِ، نَبِيِّ الْحَرَمَيْنِ، إِمَامِ الْقِبْلَتَيْنِ، وَسِيلَتِنَا فِي الدَّارَيْنِ، صَاحِبِ قَابَ قَوْسَيْنِ، مَحْبُوبِ رَبِّ الْمَشْرِقَيْنِ وَالْمَغْرِبَيْنِ، جَدِّ الْحَسَنِ وَالْحُسَيْنِ، مَوْلَانَا وَمَوْلَى الثَّقَلَيْنِ، أَبِي الْقَاسِمِ مُحَمَّدِ بْنِ عَبْدِ اللَّهِ، نُورٍ مِنْ نُورِ اللَّهِ، يَا أَيُّهَا الْمُشْتَاقُونَ بِنُورِ جَمَالِهِ صَلُّوا عَلَيْهِ وَآلِهِ وَأَصْحَابِهِ وَسَلِّمُوا تَسْلِيمًا",
    meaning: "A long traditional salutation honouring the Prophet Muhammad ﷺ through titles connected with the Mi‘raj, mercy, guidance, generosity, intercession and love, and ending by calling believers to send blessings and peace upon him, his family and companions.",
    source: "Traditional South Asian collection; authorship reports differ",
    note: "This is a later devotional composition, not a hadith wording. The Arabic is shown without a Roman version to reduce pronunciation errors in such a long text.",
  },
];

export default function DaroodLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = readSavedList(SAVED_KEYS.darood);
        const storedCounts = window.localStorage.getItem("noor-darood-counts-v1");
        setSavedIds(saved);
        if (storedCounts) setCounts(JSON.parse(storedCounts) as Record<string, number>);
      } catch {
        setSavedIds([]);
        setCounts({});
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return daroodEntries.filter((entry) => {
      const matchesFilter = filter === "All" || (filter === "Saved" ? savedIds.includes(entry.id) : entry.category === filter);
      const matchesQuery = !term || [entry.title, entry.alternate, entry.roman ?? "", entry.meaning, entry.source].join(" ").toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      writeSavedList(SAVED_KEYS.darood, next);
      return next;
    });
  };

  const changeCount = (id: string, nextValue: number) => {
    setCounts((current) => {
      const next = { ...current, [id]: Math.max(0, nextValue) };
      window.localStorage.setItem("noor-darood-counts-v1", JSON.stringify(next));
      return next;
    });
  };

  const copyEntry = async (entry: DaroodEntry) => {
    const text = [entry.title, entry.arabic, entry.roman ?? "", entry.meaning, entry.source].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(text);
    setNotice(entry.title + " copied");
    window.setTimeout(() => setNotice(""), 1800);
  };

  const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);

  return (
    <section className="darood-library">
      <div className="darood-tools">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Darood or wording" aria-label="Search Darood library" />
        <div role="group" aria-label="Darood filters">{(["All", "Prophetic", "Traditional", "Short", "Saved"] as Filter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <span><strong>{totalCount.toLocaleString("en-IN")}</strong> total recitations saved on this device</span>
      </div>

      <div className="darood-list">
        {visible.map((entry, index) => {
          const saved = savedIds.includes(entry.id);
          const count = counts[entry.id] ?? 0;
          return (
            <details className="darood-entry" id={entry.id} key={entry.id}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{entry.category === "Prophetic" ? "HADITH-REPORTED WORDING" : entry.category === "Short" ? "SHORT SALAWAT" : "TRADITIONAL COLLECTION"}</small><strong>{entry.title}</strong><p>{entry.alternate}</p></div>
                <b lang="ar" dir="rtl">{entry.arabic}</b>
                <i aria-hidden="true">+</i>
              </summary>
              <div className="darood-entry-body">
                <p className="darood-arabic" lang="ar" dir="rtl">{entry.arabic}</p>
                {entry.roman ? <div className="darood-reading"><span>ROMAN READING AID</span><p>{entry.roman}</p></div> : null}
                <div className="darood-meaning"><span>ENGLISH MEANING</span><p>{entry.meaning}</p></div>
                <div className="darood-source"><div><span>SOURCE STATUS</span><strong>{entry.source}</strong><p>{entry.note}</p></div><div className="darood-actions"><button type="button" onClick={() => copyEntry(entry)}>Copy</button><button className={saved ? "saved" : ""} type="button" onClick={() => toggleSaved(entry.id)}>{saved ? "Saved" : "Save"}</button></div></div>
                <div className="darood-counter"><div><span>PRIVATE TASBIH COUNT</span><strong>{count.toLocaleString("en-IN")}</strong></div><button type="button" onClick={() => changeCount(entry.id, count + 1)}>+1 recitation</button><button type="button" onClick={() => changeCount(entry.id, 0)}>Reset</button></div>
              </div>
            </details>
          );
        })}
        {visible.length === 0 ? <p className="compact-empty">No Darood matched this search or filter.</p> : null}
      </div>
      {notice ? <div className="quran-notice" role="status">{notice}</div> : null}
    </section>
  );
}
