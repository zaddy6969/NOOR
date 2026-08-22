export type NaatEntry = {
  slug: string;
  title: string;
  writer: string;
  reciter: string;
  genre: string;
  languages: string[];
  media: {
    youtubeId: string;
    title: string;
    performer: string;
    channel: string;
    sourceUrl: string;
  };
  summary: string;
  themes: string[];
  readingNotes: { title: string; body: string }[];
  sources: { label: string; href: string }[];
  rights: string;
};

export const naatEntries: NaatEntry[] = [
  {
    slug: "lam-yati",
    title: "Lam Yati Nazeero Kafi Nazarin",
    writer: "Imam Ahmad Raza Khan (1856–1921)",
    reciter: "Multiple reciters; popular recordings include Owais Raza Qadri",
    genre: "Naat",
    languages: ["Urdu", "Arabic phrases", "Persian phrases", "Roman Urdu"],
    media: {
      youtubeId: "HcwARQbsSPw",
      title: "Lamyati Nazeero Kafi Nazarin — official video",
      performer: "Owais Raza Qadri",
      channel: "Owais Raza Qadri Official",
      sourceUrl: "https://www.youtube.com/watch?v=HcwARQbsSPw",
    },
    summary: "A celebrated multilingual Naat associated with Imam Ahmad Raza Khan, known for dense Arabic, Persian and Urdu expression. A reliable edition needs careful comparison because online versions often differ in spelling, stanza order and transliteration.",
    themes: ["Uniqueness of the Prophet’s excellence", "Beauty and noble character", "Love and longing", "Arabic–Persian–Urdu literary craft"],
    readingNotes: [
      { title: "Authorship", body: "The work is attributed to Imam Ahmad Raza Khan and should be checked against an established printed collection rather than copied from a recital transcript." },
      { title: "Language", body: "The opening and many compounds require Arabic and Persian pronunciation. Roman text is only a reading aid; the Urdu-script edition remains the editorial base." },
      { title: "Variants", body: "Reciters may repeat refrains, omit couplets or modernise pronunciation. NOOR will identify the base edition and keep performance variants separate." },
      { title: "Religious reading", body: "Figurative praise should be understood within sound Sunni belief: Allah alone is the Creator and independently all-powerful, while the Prophet ﷺ is Allah’s most honoured servant and Messenger." },
    ],
    sources: [
      { label: "Naat-e-Nabi reference presentation", href: "https://naatenabi.com/lam-yati-nazeero-kafi-nazarin/" },
      { label: "Faiz-e-Islam reference presentation", href: "https://faizeislam.net/lam-yati-nazeero-kafi-nazarin-lyrics/" },
      { label: "Qur’an 33:56 — salawat", href: "https://quran.com/33/56" },
    ],
    rights: "The writer died in 1921, but any modern translation, transliteration, layout and recording may have separate rights. A complete text will be enabled only after a public-domain and edition check.",
  },
  {
    slug: "mustafa-jaane",
    title: "Mustafa Jaan-e-Rehmat Pe Lakhon Salam",
    writer: "Imam Ahmad Raza Khan (1856–1921)",
    reciter: "Many Naat Khawans worldwide",
    genre: "Salam",
    languages: ["Urdu", "Arabic phrases", "Persian phrases", "Roman Urdu"],
    media: {
      youtubeId: "Ov71ngBLq7A",
      title: "Mustafa Jaan-e-Rehmat Pe Lakhon Salam — official video",
      performer: "Owais Raza Qadri",
      channel: "Owais Raza Qadri Official",
      sourceUrl: "https://www.youtube.com/watch?v=Ov71ngBLq7A",
    },
    summary: "Commonly known as Salam-e-Raza, this long Salam sends peace upon the Prophet ﷺ, members of his blessed family, Companions and sacred places through a rich sequence of couplets.",
    themes: ["Salam upon the Prophet ﷺ", "Ahl al-Bayt and Companions", "Madinah and sacred memory", "Prophetic qualities"],
    readingNotes: [
      { title: "Structure", body: "The work is extensive and commonly recited in selections. A reader should retain the original ordering and clearly mark any event-specific excerpt." },
      { title: "Attribution", body: "The writer credit belongs to Imam Ahmad Raza Khan even when a modern reciter’s rendition is more widely known than the printed text." },
      { title: "Pronunciation", body: "Names, Arabic salutations and Persian compounds should be learned from a qualified reader before public recitation." },
      { title: "Use in gatherings", body: "Communities often stand or remain seated according to local practice and scholarly guidance. The site should not turn a recognised difference into hostility." },
    ],
    sources: [
      { label: "My Naat Book collection search", href: "https://www.mynaatbook.com/" },
      { label: "Qur’an 33:56 — salawat", href: "https://quran.com/33/56" },
      { label: "Sahih al-Bukhari 3370 — transmitted salawat", href: "https://sunnah.com/bukhari:3370" },
    ],
    rights: "The original work requires an edition check; modern recordings, translations and typesetting remain separately protected.",
  },
  {
    slug: "balaghal-ula",
    title: "Balaghal Ula Bi Kamalihi",
    writer: "Classical Arabic verse; attribution requires verification",
    reciter: "Multiple reciters",
    genre: "Naat / Arabic praise",
    languages: ["Arabic", "Roman Arabic", "English meaning", "Urdu meaning"],
    media: {
      youtubeId: "QYYE2Tjanww",
      title: "Balaghal Ula Bi Kamaalihi",
      performer: "Qari Shahid Mahmood Qadri",
      channel: "Hafiz Studio",
      sourceUrl: "https://www.youtube.com/watch?v=QYYE2Tjanww",
    },
    summary: "A concise classical Arabic praise text widely recited across Muslim communities. Online sources give differing author attributions, so a responsible library should not state one name as certain without bibliographic proof.",
    themes: ["Prophetic perfection", "Beauty and noble character", "Blessings upon the Prophet ﷺ", "Concise classical Arabic"],
    readingNotes: [
      { title: "Attribution", body: "The authorship is frequently stated without a primary source. NOOR marks it as requiring verification and will document the earliest reliable collection located." },
      { title: "Meaning", body: "Translations should explain literary praise without turning a poetic line into a creed formula or hadith quotation." },
      { title: "Recitation", body: "Because the text is short, variants in vowels and repeated salutations are especially noticeable; audio should be matched to the displayed version." },
      { title: "Source label", body: "It must remain labelled poetry. A widely quoted Arabic line is not automatically Qur’an or hadith." },
    ],
    sources: [
      { label: "Qur’an 26:224–227 — framework for poetry", href: "https://quran.com/26/224-227" },
      { label: "Sahih al-Bukhari 6145 — wisdom in poetry", href: "https://sunnah.com/bukhari:6145" },
    ],
    rights: "The classical wording may be public domain, but authorship, edition, translation and recording rights must be established before full publication.",
  },
  {
    slug: "ya-nabi-salam",
    title: "Ya Nabi Salam Alaika",
    writer: "Traditional devotional form; individual versions have different credits",
    reciter: "Multiple reciters and regional adaptations",
    genre: "Salam",
    languages: ["Arabic", "Urdu adaptations", "Roman Arabic", "English meaning"],
    media: {
      youtubeId: "q-CZ4IGxTI0",
      title: "Ya Nabi Salam Alaika",
      performer: "Atif Aslam",
      channel: "Atif Aslam",
      sourceUrl: "https://www.youtube.com/watch?v=q-CZ4IGxTI0",
    },
    summary: "A widely used Salam refrain with multiple regional verses and arrangements. The refrain, full lyric versions and modern compositions must not be collapsed into one anonymous text.",
    themes: ["Salam upon the Prophet ﷺ", "Love and longing", "Madinah", "Communal response"],
    readingNotes: [
      { title: "Version control", body: "Each uploaded rendition needs its own verse list, writer or adapter credit and recording source." },
      { title: "Refrain and verses", body: "A shared refrain can appear with newly written verses. The writer field should describe each part rather than assigning the whole work to a single popular singer." },
      { title: "Translation", body: "The direct address is devotional poetry; explanatory notes should keep Allah’s unique attributes and worship clear." },
      { title: "Gathering practice", body: "Use lawful conduct, protect prayer times and respect community differences about posture or style." },
    ],
    sources: [
      { label: "Qur’an 33:56 — blessings and peace", href: "https://quran.com/33/56" },
      { label: "Sahih Muslim 408 — virtue of salawat", href: "https://sunnah.com/muslim:408" },
    ],
    rights: "Every arrangement and added verse needs separate attribution and permission; the page will not combine texts scraped from unrelated recordings.",
  },
  {
    slug: "bhar-do-jholi",
    title: "Bhar Do Jholi Meri",
    writer: "Modern qawwali attribution and versions require source verification",
    reciter: "Associated with multiple qawwali and Naat performers",
    genre: "Qawwali / devotional poetry",
    languages: ["Urdu", "Hindi", "Roman Urdu"],
    media: {
      youtubeId: "ZkyiJBLKtvU",
      title: "Bhar Do Jholi Meri",
      performer: "Sabri Brothers",
      channel: "Hi-Tech Music Ltd",
      sourceUrl: "https://www.youtube.com/watch?v=ZkyiJBLKtvU",
    },
    summary: "A popular devotional composition heard in multiple arrangements. The commonly circulated versions differ, and modern recordings have clear performance and publishing rights.",
    themes: ["Need and hope", "Madinah", "Intercession language", "Communal qawwali form"],
    readingNotes: [
      { title: "Author and version", body: "NOOR will not repeat a viral author credit until an original publication, label record or estate source is found." },
      { title: "Theological note", body: "Poetic requests and intercession language need a Sunni explanatory note that preserves Allah as the independent giver and ultimate object of dua." },
      { title: "Performance form", body: "Repeated passages, improvisation and inserted couplets should be separated from the writer’s base text." },
      { title: "Audio rights", body: "Well-known commercial recordings cannot be downloaded or re-hosted without permission; link to official releases." },
    ],
    sources: [
      { label: "Qur’an 39:53 — hope in Allah’s mercy", href: "https://quran.com/39/53" },
      { label: "Qur’an 26:224–227 — poetry and belief", href: "https://quran.com/26/224-227" },
    ],
    rights: "This is a modern performance tradition. Full lyrics and audio remain unavailable until author, publisher and recording permissions are verified.",
  },
  {
    slug: "sab-se-aula",
    title: "Sab Se Aula O Aala Hamara Nabi",
    writer: "Imam Ahmad Raza Khan (1856–1921)",
    reciter: "Multiple reciters",
    genre: "Naat",
    languages: ["Urdu", "Roman Urdu", "Hindi", "English meaning"],
    media: {
      youtubeId: "SNgyHh_Fsd8",
      title: "Sab Se Aula O Aala Hamara Nabi — official video",
      performer: "Owais Raza Qadri",
      channel: "Owais Raza Qadri Official",
      sourceUrl: "https://www.youtube.com/watch?v=SNgyHh_Fsd8",
    },
    summary: "A well-known Urdu Naat of praise associated with Imam Ahmad Raza Khan. The online text often appears without edition notes or with reciter-added repetitions.",
    themes: ["Excellence of the Prophet ﷺ", "Love and praise", "Prophethood", "Community recitation"],
    readingNotes: [
      { title: "Authorship", body: "Credit the poet separately from every Naat Khawan who has recorded the work." },
      { title: "Base edition", body: "The final lyric page should cite a printed collection and retain the original orthography, with modern spelling shown only as an aid." },
      { title: "Meaning", body: "Translation should preserve superlative poetic language while explaining that every created excellence is a gift of Allah." },
      { title: "Practice", body: "The reader will offer slow line focus, word meanings and stanza markers after the text and rights review are complete." },
    ],
    sources: [
      { label: "My Naat Book reference collection", href: "https://www.mynaatbook.com/" },
      { label: "Qur’an 33:56 — salawat", href: "https://quran.com/33/56" },
      { label: "Sahih al-Bukhari 6152 — Prophetic approval of Hassan’s poetry", href: "https://sunnah.com/bukhari:6152" },
    ],
    rights: "The original poem requires public-domain and edition verification; each translation, transliteration and recording has separate rights.",
  },
];

export const naatMap = new Map(naatEntries.map((entry) => [entry.slug, entry]));
