const entries = [
  {
    category: "Morning",
    title: "Morning remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    roman: "Asbahna wa asbahal-mulku lillah.",
    meaning:
      "We have entered the morning and all sovereignty belongs to Allah.",
    source: "Sahih Muslim 2723",
  },
  {
    category: "Evening",
    title: "Evening remembrance",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    roman: "Amsayna wa amsal-mulku lillah.",
    meaning:
      "We have entered the evening and all sovereignty belongs to Allah.",
    source: "Sahih Muslim 2723",
  },
  {
    category: "Travel",
    title: "Beginning a journey",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    roman: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin.",
    meaning:
      "Glory to Him who has subjected this to us, though we could not have controlled it.",
    source: "Quran 43:13",
  },
  {
    category: "Sleeping",
    title: "Before sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    roman: "Bismika Allahumma amutu wa ahya.",
    meaning: "In Your name, O Allah, I die and I live.",
    source: "Sahih al-Bukhari 6324",
  },
  {
    category: "Food",
    title: "Before food",
    arabic: "بِسْمِ اللَّهِ",
    roman: "Bismillah.",
    meaning: "In the name of Allah.",
    source: "Sunan Abi Dawud 3767",
  },
  {
    category: "Forgiveness",
    title: "Seeking forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    roman: "Astaghfirullaha wa atubu ilayh.",
    meaning: "I seek Allah’s forgiveness and turn to Him in repentance.",
    source: "Sahih al-Bukhari 6307",
  },
];

const complete = [
  {
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    roman:
      "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dahu, wa a'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba'dahu. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    meaning:
      "We enter the morning while all dominion belongs to Allah. All praise is His. He alone is worthy of worship, without partner; sovereignty and praise are His, and He has power over everything. My Lord, grant me the good of this day and what follows, and protect me from its evil and the evil that follows. Protect me from laziness, the harm of old age, and punishment in the Fire and the grave.",
    source: "Sahih Muslim 2723b",
  },
  {
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    roman:
      "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    meaning:
      "We enter the evening while all dominion belongs to Allah. All praise is His. He alone is worthy of worship, without partner; sovereignty and praise are His, and He has power over everything. My Lord, grant me the good of this night and what follows, and protect me from its evil and the evil that follows. Protect me from laziness, the harm of old age, and punishment in the Fire and the grave.",
    source: "Sahih Muslim 2723b",
  },
  {
    arabic:
      "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ. سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى. اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ. اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
    roman:
      "Allahu akbar, Allahu akbar, Allahu akbar. Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun. Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah. Allahumma antas-sahibu fis-safari wal-khalifatu fil-ahl. Allahumma inni a'udhu bika min wa'tha'is-safari wa ka'abatil-manzari wa su'il-munqalabi fil-mali wal-ahl.",
    meaning:
      "Allah is greater. Glory belongs to the One who made this transport serve us; we could not have mastered it ourselves. We will return to our Lord. O Allah, grant righteousness, mindfulness of You and deeds You accept on this journey. Ease our travel and shorten its distance. You accompany us on the journey and watch over our family. Protect me from travel hardships, distressing sights and a harmful return to my possessions and family.",
    source: "Sahih Muslim 1342",
  },
];
complete.forEach((entry, index) => Object.assign(entries[index], entry));
const additional = [
  {
    category: "Anxiety",
    title: "For worry, grief and debt",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    roman:
      "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal.",
    meaning:
      "O Allah, protect me from worry and sorrow, helplessness and laziness, cowardice and stinginess, crushing debt and being overpowered by others.",
    source: "Sahih al-Bukhari 6369",
    href: "https://sunnah.com/bukhari:6369",
    keywords:
      "anxiety stress worried grief qarz karz pareshani gham bechaini tension",
    audio: null,
  },
  {
    category: "Waking",
    title: "After waking up",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    roman: "Al-hamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    meaning:
      "Praise belongs to Allah, who restored us to life after causing us to die; to Him is the resurrection.",
    source: "Sahih al-Bukhari 6325",
    href: "https://sunnah.com/bukhari:6325",
    keywords: "uthne jagne waking",
    audio: null,
  },
  {
    category: "Bathroom",
    title: "Before entering the bathroom",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    roman: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
    meaning:
      "O Allah, I ask You to protect me from male and female evil beings.",
    source: "Sahih al-Bukhari 142",
    href: "https://sunnah.com/bukhari:142",
    keywords: "toilet washroom baitul khala",
    audio: null,
  },
  {
    category: "Mosque",
    title: "Entering the mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    roman: "Allahummaftah li abwaba rahmatik.",
    meaning: "O Allah, open the doors of Your mercy for me.",
    source: "Sahih Muslim 713a",
    href: "https://sunnah.com/muslim:713a",
    keywords: "masjid dakhil entering mosque",
    audio: null,
  },
  {
    category: "Leaving mosque",
    title: "Leaving the mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    roman: "Allahumma inni as'aluka min fadlik.",
    meaning: "O Allah, I ask for Your bounty.",
    source: "Sahih Muslim 713a",
    href: "https://sunnah.com/muslim:713a",
    keywords: "masjid nikalne leaving mosque",
    audio: null,
  },
  {
    category: "Knowledge",
    title: "For beneficial knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    roman: "Rabbi zidni ilma.",
    meaning: "My Lord, increase my knowledge.",
    source: "Quran 20:114",
    href: "/quran?surah=20&ayah=114",
    keywords: "exam ilm study padhai imtihan",
    audio: "https://everyayah.com/data/Alafasy_128kbps/020114.mp3",
  },
  {
    category: "Goodness",
    title: "Good in this life and the next",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    roman:
      "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    meaning:
      "Our Lord, grant us good in this world and the next, and protect us from the punishment of the Fire.",
    source: "Quran 2:201",
    href: "/quran?surah=2&ayah=201",
    keywords: "rabbana atina",
    audio: "https://everyayah.com/data/Alafasy_128kbps/002201.mp3",
  },
  {
    category: "Parents",
    title: "For parents and believers",
    arabic:
      "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    roman:
      "Rabbanaghfir li wa liwalidayya wa lil-mu'minina yawma yaqumul-hisab.",
    meaning:
      "Our Lord, forgive me, my parents and the believers on the Day of Reckoning.",
    source: "Quran 14:41",
    href: "/quran?surah=14&ayah=41",
    keywords: "maa baap walidain mother father",
    audio: "https://everyayah.com/data/Alafasy_128kbps/014041.mp3",
  },
  {
    category: "Guidance",
    title: "For steadfastness",
    arabic:
      "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    roman:
      "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-wahhab.",
    meaning:
      "Our Lord, do not let our hearts turn away after You have guided us. Grant us mercy from Yourself; You are the generous Giver.",
    source: "Quran 3:8",
    href: "/quran?surah=3&ayah=8",
    keywords: "hidayat guidance",
    audio: "https://everyayah.com/data/Alafasy_128kbps/003008.mp3",
  },
];
export const DUAS = [
  ...entries.map((entry) => ({
    ...entry,
    href: entry.source.startsWith("Sahih Muslim")
      ? "https://sunnah.com/muslim:" + entry.source.split(" ").at(-1)
      : entry.source.startsWith("Sunan")
        ? "https://sunnah.com/abudawud:3767"
        : "https://sunnah.com/bukhari:" + entry.source.split(" ").at(-1),
    audio: null as string | null,
    keywords: "",
  })),
  ...additional,
].map((entry) => ({
  ...entry,
  id: entry.category.toLowerCase().replaceAll(" ", "-"),
  excerpt: false,
}));
