export type TopicItem = {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

export type TopicChapter = {
  id: string;
  title: string;
  intro: string;
  items: TopicItem[];
};

export type TopicSource = {
  label: string;
  title: string;
  href: string;
};

export type Topic = {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  foundation: {
    arabic?: string;
    translation: string;
    reference: string;
    href: string;
  };
  atAGlance: string[];
  chapters: TopicChapter[];
  faqs: { q: string; a: string }[];
  sources: TopicSource[];
  reviewNote: string;
};

const quran = (reference: string, title: string, path: string): TopicSource => ({
  label: `Qur’an ${reference}`,
  title,
  href: `https://quran.com/${path}`,
});

const hadith = (label: string, title: string, href: string): TopicSource => ({ label, title, href });

export const faithTopics: Topic[] = [
  {
    slug: "ahle-sunnat",
    kicker: "FOUNDATION · BELIEF & METHOD",
    title: "Ahle Sunnat wal Jamaat",
    summary: "A plain-language introduction to Sunni belief: holding to the Qur’an, the Sunnah of the Messenger ﷺ, the transmitted path of the Companions and the learned tradition of the Ummah—with mercy, balance and good character.",
    foundation: {
      arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَطِيعُوا۟ ٱللَّهَ وَأَطِيعُوا۟ ٱلرَّسُولَ",
      translation: "O believers! Obey Allah and obey the Messenger and those in authority among you.",
      reference: "Surah an-Nisa 4:59",
      href: "https://quran.com/4/59",
    },
    atAGlance: ["Qur’an and authentic Sunnah", "Respect for the Sahabah and Ahl al-Bayt", "Four recognized Sunni schools of law", "Spiritual excellence with sound belief"],
    chapters: [
      {
        id: "meaning", title: "What the name means", intro: "Ahl al-Sunnah means the people committed to the Prophetic way; al-Jama‘ah points to the united body of Muslims and the inherited scholarly tradition.",
        items: [
          { title: "The two revealed foundations", body: "Belief and practice begin with Allah’s Book and the verified teaching, conduct and approvals of His Messenger ﷺ. A verse or hadith is read with its context and with the explanations of qualified scholarship." },
          { title: "The first generations", body: "The Companions received the religion directly from the Prophet ﷺ. Sunni learning honours all the Sahabah, loves the Prophet’s family, and benefits from the scholarship of the early generations without turning history into hostility." },
          { title: "Why scholars matter", body: "Arabic, hadith grading, legal principles and context require expertise. Following reliable scholarship is not replacing revelation; it is learning how revelation has been preserved and applied." },
        ],
      },
      {
        id: "belief", title: "Core beliefs", intro: "The essentials include faith in Allah, His angels, books, messengers, the Last Day and Divine decree, as summarized in the famous Hadith of Jibril.",
        items: [
          { title: "Allah is One", body: "Allah alone is worthy of worship. He is unlike creation, needs nothing, knows and wills all things, and has the perfect Names and Attributes affirmed in revelation without imagining Him like created beings." },
          { title: "Prophethood", body: "Muslims believe in every true prophet and messenger, from Adam to ‘Isa عليهم السلام, and in Muhammad ﷺ as the final Messenger whose Sunnah explains the Qur’an in lived form." },
          { title: "The unseen and the Hereafter", body: "Angels, revealed books, resurrection, judgment, Paradise and Hell are accepted as revealed. Belief in Divine decree is joined to moral responsibility: people intend, choose and are accountable, while nothing escapes Allah’s knowledge and will." },
        ],
      },
      {
        id: "schools", title: "Madhhabs and respectful difference", intro: "Hanafi, Maliki, Shafi‘i and Hanbali law are established Sunni schools. Differences in subsidiary rulings are handled with evidence, humility and adab.",
        items: [
          { title: "A school is a method", body: "A madhhab is not a separate religion. It is a disciplined method for reading the entire body of evidence consistently. NOOR’s practical worship guides identify their Hanafi framing when a ruling differs by school." },
          { title: "Creed and spirituality", body: "Sunni scholarship includes well-known theological and spiritual traditions. Tasawwuf, when rooted in Qur’an and Sunnah, concerns sincerity, repentance, remembrance, humility and purification of character." },
          { title: "Adab of disagreement", body: "Do not declare people outside Islam over secondary questions, circulate clipped verdicts, or insult scholars. Ask what evidence and legal method a ruling uses, then follow a trusted local scholar for personal cases." },
        ],
      },
      {
        id: "daily", title: "Living the Sunnah daily", intro: "Sunni identity is expressed most clearly through worship, lawful conduct, mercy and service—not through labels alone.",
        items: [
          { title: "Worship", body: "Guard the five prayers, learn purity, fast Ramadan, pay Zakat when due, and perform Hajj when able. Build voluntary worship gradually and consistently." },
          { title: "Character", body: "Truthfulness, keeping promises, care for parents, neighbours and the vulnerable, lawful earnings, modesty and control of the tongue are central religious duties." },
          { title: "Learning safely", body: "Verify quotations, distinguish a fatwa from general education, and consult qualified scholars for marriage, divorce, inheritance, finance, health exemptions and other case-specific rulings." },
        ],
      },
    ],
    faqs: [
      { q: "Is Ahle Sunnat a separate religion?", a: "No. It is a widely used name for Muslims who identify with the Qur’an, Prophetic Sunnah and the mainstream inherited Sunni tradition." },
      { q: "Must everyone study every school of law?", a: "No. A learner may follow reliable teachers within one recognized school for consistency while respecting the other Sunni schools." },
      { q: "Can a website issue a personal fatwa?", a: "No. Educational pages can explain common rulings, but personal circumstances require a qualified mufti who can ask the necessary questions." },
    ],
    sources: [
      quran("4:59", "Obey Allah and the Messenger", "4/59"),
      quran("4:115", "The Messenger and the way of the believers", "4/115"),
      hadith("Sunan Abi Dawud 4607", "Hold to the Sunnah and the rightly guided Caliphs", "https://sunnah.com/abudawud:4607"),
      hadith("Sahih Muslim 8a", "The Hadith of Jibril: Islam, faith and excellence", "https://sunnah.com/muslim:8a"),
    ],
    reviewNote: "This is an educational Sunni overview, not a verdict about individuals or groups. Local practice and detailed creed questions should be studied with qualified Ahle Sunnat scholars.",
  },
  {
    slug: "pillars",
    kicker: "ESSENTIALS · ISLAM IN PRACTICE",
    title: "The Five Pillars of Islam",
    summary: "The five pillars form Islam’s essential public framework: testimony of faith, prayer, Zakat, fasting Ramadan and Hajj. Each pillar trains a different part of life while all remain rooted in worship of Allah alone.",
    foundation: {
      translation: "Islam is built on five: testimony that none is worthy of worship but Allah and Muhammad is the Messenger of Allah, establishing prayer, giving Zakat, Hajj and fasting Ramadan.",
      reference: "Sahih al-Bukhari 8",
      href: "https://sunnah.com/bukhari:8",
    },
    atAGlance: ["Shahadah: belief and testimony", "Salah: five daily prayers", "Zakat: obligatory purification of wealth", "Sawm and Hajj: Ramadan and pilgrimage"],
    chapters: [
      { id: "shahadah", title: "1. Shahadah", intro: "The testimony enters a person into Islam and shapes every other act.", items: [
        { title: "Meaning", body: "Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan rasulullah: I testify that none is worthy of worship except Allah, and I testify that Muhammad is Allah’s Messenger." },
        { title: "What it requires", body: "Worship Allah alone, accept the Prophet ﷺ truthfully, follow his teaching, and avoid giving any created being the worship that belongs only to the Creator." },
        { title: "More than words", body: "The testimony is spoken sincerely, understood, believed and lived through obedience, repentance and good conduct." },
      ] },
      { id: "salah", title: "2. Salah", intro: "Five obligatory prayers organize the day around remembrance, gratitude and humble return.", items: [
        { title: "Five times", body: "Fajr, Dhuhr, ‘Asr, Maghrib and ‘Isha each have a defined time. Purity, direction of prayer, covering and intention are among the conditions learned before the prayer itself." },
        { title: "Congregation", body: "Men are strongly encouraged to attend the mosque congregation when able; family members should help one another learn and guard the prayer." },
        { title: "Full practical course", body: "The dedicated Namaz guide covers Wudu, Ghusl, timings, rak‘ahs, recitations, mistakes, travel and special prayers.", href: "/namaz", linkLabel: "Open complete Namaz guide" },
      ] },
      { id: "wealth", title: "3. Zakat", intro: "Zakat is an annual obligation on qualifying wealth and has defined recipients.", items: [
        { title: "Who pays", body: "A Muslim who owns Zakatable wealth at or above the applicable nisab for the required period may owe Zakat. Asset treatment can differ, so document what you own and ask when unsure." },
        { title: "Standard rate", body: "Cash, trade inventory and similar assets are commonly assessed at 2.5% after a lunar year; crops, livestock, investments and pensions can require separate rules." },
        { title: "Where it goes", body: "Qur’an 9:60 names eight recipient classes. Verification protects both the giver’s obligation and the recipient’s dignity." },
      ] },
      { id: "fast-hajj", title: "4–5. Sawm and Hajj", intro: "Ramadan fasting disciplines the self; Hajj gathers able Muslims in worship, equality and remembrance.", items: [
        { title: "Fasting Ramadan", body: "From true dawn to sunset, an eligible Muslim abstains from food, drink and marital relations with intention, while guarding the tongue and character." },
        { title: "Hajj once when able", body: "Hajj is obligatory once for an adult Muslim who has physical, financial and travel ability, with safe provision for dependants." },
        { title: "Learn before acting", body: "Each pillar has conditions, invalidators and exemptions. Use the linked full guide, then confirm unusual circumstances with a qualified scholar." },
      ] },
    ],
    faqs: [
      { q: "Are the pillars the whole of Islam?", a: "They are its foundational structure, but Islam also includes faith, character, family duties, lawful conduct and spiritual excellence." },
      { q: "Does every pillar apply identically to every person?", a: "Shahadah is universal. Prayer is universal with accommodations. Zakat and Hajj depend on means, and fasting has recognised exemptions." },
      { q: "Which guide should a beginner open first?", a: "Begin with Tawheed and Shahadah, then learn Wudu and the five prayers before moving through fasting, Zakat and Hajj." },
    ],
    sources: [
      hadith("Sahih al-Bukhari 8", "Islam is built on five", "https://sunnah.com/bukhari:8"),
      hadith("Sahih Muslim 16c", "The five foundations of Islam", "https://sunnah.com/muslim:16c"),
      quran("2:43", "Establish prayer and give Zakat", "2/43"),
      quran("3:97", "Hajj for whoever is able", "3/97"),
    ],
    reviewNote: "The overview links the essentials; use each dedicated guide for detailed conditions and consult a scholar for personal obligations.",
  },
  {
    slug: "tawheed",
    kicker: "BELIEF · KNOWING THE CREATOR",
    title: "Tawheed",
    summary: "Tawheed is to affirm Allah’s absolute oneness and uniqueness, to direct every act of worship to Him alone, and to know Him through the perfect Names and Attributes revealed in the Qur’an and Sunnah.",
    foundation: {
      arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ",
      translation: "Say: He is Allah—One. Allah—the Sustainer needed by all.",
      reference: "Surah al-Ikhlas 112:1–2",
      href: "https://quran.com/112",
    },
    atAGlance: ["Allah alone is worshipped", "Nothing resembles Allah", "His Names are perfect", "Reliance joins effort with trust"],
    chapters: [
      { id: "oneness", title: "The oneness of Allah", intro: "Tawheed corrects what the heart believes, what the tongue says and whom the limbs obey.", items: [
        { title: "Lord and Creator", body: "Allah alone creates, owns, sustains, gives life and death, and governs creation. Recognising this should lead to gratitude and worship." },
        { title: "Worship Him alone", body: "Prayer, ultimate supplication, sacrifice, vows and complete devotional submission belong to Allah. Good deeds are offered sincerely for His acceptance." },
        { title: "Unlike creation", body: "Qur’an 42:11 states that nothing is like Him. Muslims affirm what Allah revealed about Himself without likening Him to creation or claiming to comprehend His reality." },
      ] },
      { id: "worship", title: "Worship, dua and intention", intro: "Every ordinary lawful act can gain reward when its intention and method please Allah.", items: [
        { title: "Dua", body: "Ask Allah with humility, hope and repentance. Begin with praise and salawat, use His beautiful Names, and avoid demanding a particular outcome as though wisdom belongs to us." },
        { title: "Sincerity", body: "Riya—performing worship to be seen—damages deeds. Protect intention before, during and after a good action, and do not use worship to seek status over people." },
        { title: "Means and reliance", body: "Tawakkul is not passivity. Take lawful means, seek expert help, make dua, then trust Allah with the result." },
      ] },
      { id: "protection", title: "Protecting faith", intro: "Sound belief is protected through knowledge, repentance and careful speech.", items: [
        { title: "Shirk", body: "Shirk is assigning to creation what belongs uniquely to Allah. Because rulings on particular words or acts can be complex, learn definitions carefully and do not accuse individuals recklessly." },
        { title: "Superstition", body: "Objects, dates and people do not independently control benefit or harm. Lawful treatment, consultation and planning do not conflict with reliance upon Allah." },
        { title: "Renewal", body: "Recite the Shahadah, study Allah’s Names, reflect on Surah al-Ikhlas and Ayat al-Kursi, guard prayer and repent often." },
      ] },
    ],
    faqs: [
      { q: "Does Tawheed mean Allah is physically one?", a: "No. Allah is One without partner, division, need or resemblance to created bodies. Human categories do not contain Him." },
      { q: "May I ask another person to make dua for me?", a: "Asking a living righteous person to pray for you is distinct from worshipping them. Complex formulations should be learned from trusted scholars." },
      { q: "How can I strengthen Tawheed daily?", a: "Guard the obligations, learn the Divine Names, make sincere dua, avoid superstition and connect every blessing to Allah with gratitude." },
    ],
    sources: [
      quran("112:1–4", "Surah al-Ikhlas", "112"),
      quran("2:255", "Ayat al-Kursi", "2/255"),
      quran("42:11", "Nothing is like Allah", "42/11"),
      quran("6:162–163", "Prayer, sacrifice, life and death for Allah", "6/162-163"),
    ],
    reviewNote: "Creed requires precise language. This page avoids judging individual cases; take disputed expressions to a trained Sunni scholar.",
  },
  {
    slug: "roza",
    kicker: "FASTING · RAMADAN & BEYOND",
    title: "Roza / Sawm",
    summary: "A complete practical map of fasting: intention, suhur, the fasting day, iftar, invalidators, exemptions, missed fasts, voluntary fasts and the final nights of Ramadan.",
    foundation: {
      arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ",
      translation: "O believers! Fasting is prescribed for you—as it was for those before you—so perhaps you will become mindful of Allah.",
      reference: "Surah al-Baqarah 2:183",
      href: "https://quran.com/2/183-187",
    },
    atAGlance: ["From true dawn to sunset", "Intention before the fast", "Food, drink and marital relations are avoided", "Illness and travel have concessions"],
    chapters: [
      { id: "before", title: "Before the fast", intro: "Preparation makes the worship calmer and protects health.", items: [
        { title: "Eligibility", body: "Ramadan fasting is obligatory for a sane, adult Muslim who is able and not under a recognised exemption such as menstruation, postnatal bleeding, relevant illness or travel." },
        { title: "Intention", body: "Intention is the heart’s resolve to fast for Allah; it need not be spoken. Hanafi details about the latest valid time differ between Ramadan, vowed, makeup and expiatory fasts." },
        { title: "Suhur", body: "Eat a balanced pre-dawn meal, hydrate, and stop by true dawn. Do not rely on a generic timetable without checking the correct local calculation and mosque guidance." },
      ] },
      { id: "day", title: "The fasting day", intro: "The fast concerns the body and character together.", items: [
        { title: "What is avoided", body: "From true dawn until sunset, avoid eating, drinking and marital relations. Deliberately introducing substances into the body may affect the fast depending on the route and circumstance." },
        { title: "Guard the tongue", body: "Lying, abuse, backbiting and quarrelling contradict the fast’s purpose. They may not technically invalidate the fast, but they can destroy its reward." },
        { title: "Medication and medical care", body: "Injections, inhalers, drops, dialysis, pregnancy and chronic illness need individual rulings and medical advice. Do not endanger health or self-diagnose an exemption." },
      ] },
      { id: "breaking", title: "Iftar, invalidators and mistakes", intro: "Break the fast promptly after confirmed sunset and know the difference between a broken fast and a sinful act.", items: [
        { title: "Iftar", body: "Confirm sunset, say Bismillah, break the fast without unnecessary delay—traditionally with dates or water—and pray Maghrib on time." },
        { title: "Forgetfulness", body: "A person who genuinely eats or drinks forgetfully continues the fast. Deliberate eating or drinking is different and may require both qada and kaffarah under Hanafi law." },
        { title: "Qada, fidyah and kaffarah", body: "Qada is a replacement fast. Fidyah applies to a person with a lasting inability under defined conditions. Kaffarah is a serious expiation for certain deliberate violations; never calculate it from a generic post." },
      ] },
      { id: "ramadan", title: "Ramadan worship plan", intro: "Ramadan combines fasting with Qur’an, prayer, charity, repentance and service.", items: [
        { title: "Daily rhythm", body: "Plan sleep, the five prayers, Qur’an, work and family duties. A modest sustainable plan is better than a dramatic schedule that collapses after a few days." },
        { title: "Tarawih and the last ten nights", body: "Attend Tarawih as able, seek Laylat al-Qadr especially in the odd nights, increase dua and charity, and protect obligatory duties first." },
        { title: "Other fasts", body: "Recommended fasts include six days of Shawwal, ‘Arafah for non-pilgrims, ‘Ashura with an adjacent day, Mondays and Thursdays, and the white days—subject to prohibited or disliked days." },
      ] },
    ],
    faqs: [
      { q: "Does vomiting break the fast?", a: "In Hanafi law, involuntary vomiting does not generally break it; deliberately inducing a mouthful has different consequences. Ask about the exact event." },
      { q: "May a traveller fast?", a: "A qualifying traveller has a Qur’anic concession to postpone and make up the fasts. Whether fasting is better depends on hardship and circumstance." },
      { q: "What about menstruation?", a: "A menstruating or postpartum woman does not fast and later makes up the missed Ramadan fasts, but does not make up prayers missed for that reason." },
    ],
    sources: [
      quran("2:183–187", "Fasting, Ramadan, exemptions and the fasting day", "2/183-187"),
      hadith("Sahih al-Bukhari, Book 30", "The Book of Fasting", "https://sunnah.com/bukhari/30"),
      hadith("Sahih Muslim, Book 13", "The Book of Fasting", "https://sunnah.com/muslim/13"),
      quran("97:1–5", "Laylat al-Qadr", "97"),
    ],
    reviewNote: "Health, pregnancy, chronic illness, travel and deliberate invalidation require case-specific medical and scholarly advice.",
  },
  {
    slug: "zakat",
    kicker: "CHARITY · PURIFYING WEALTH",
    title: "Zakat",
    summary: "Understand who owes Zakat, which assets are included, the nisab threshold, the common 2.5% calculation, eligible recipients and the difference between Zakat, Sadaqah and Zakat al-Fitr.",
    foundation: {
      arabic: "إِنَّمَا ٱلصَّدَقَـٰتُ لِلْفُقَرَآءِ وَٱلْمَسَـٰكِينِ",
      translation: "Zakat is only for the poor, the needy, those employed to administer it…",
      reference: "Surah at-Tawbah 9:60",
      href: "https://quran.com/9/60",
    },
    atAGlance: ["Nisab threshold must be met", "A lunar-year date simplifies tracking", "Cash and trade assets commonly use 2.5%", "Recipients are defined in Qur’an 9:60"],
    chapters: [
      { id: "who", title: "Who must pay", intro: "Zakat is an obligation, not a voluntary tip, and depends on ownership and qualifying wealth.", items: [
        { title: "Nisab", body: "Nisab is the minimum amount of Zakatable wealth. It is classically linked to 87.48g of gold or 612.36g of silver; scholars and institutions may advise which benchmark to use in your context." },
        { title: "The lunar year", body: "For cash and trade wealth, a lunar year generally passes while the owner remains at or above the relevant threshold. Choosing one annual Zakat date can make the calculation safer." },
        { title: "Ownership", body: "The asset must belong to the payer. Debts receivable, jointly held assets, minors’ wealth and business structures need qualified treatment." },
      ] },
      { id: "calculate", title: "What to include and calculate", intro: "Create a private snapshot of Zakatable assets and immediately payable liabilities.", items: [
        { title: "Usually included", body: "Cash, bank balances, gold and silver, saleable business stock, money owed to you that is expected to be recovered, and certain investments may be included." },
        { title: "Usually excluded", body: "A primary home, ordinary clothing, furniture, personal vehicle and tools used for work are generally not Zakatable unless held for resale." },
        { title: "Basic formula", body: "For assets assessed at the standard rate: total Zakatable assets minus allowable immediate liabilities, multiplied by 2.5%. Use a scholar or specialist for shares, pensions, farms, livestock and complex businesses." },
      ] },
      { id: "give", title: "Who may receive", intro: "Qur’an 9:60 defines eight recipient classes; the recipient must receive ownership where the legal school requires it.", items: [
        { title: "Need and dignity", body: "Verify eligibility discreetly. Do not humiliate recipients, publicise names or make receiving aid conditional on praise." },
        { title: "Family", body: "Zakat cannot normally be paid to one’s ascendants, descendants or spouse, while eligible siblings and extended relatives may be especially deserving. Confirm your case." },
        { title: "Agents and charities", body: "A charity may act as your agent. Check its Zakat policy, administrative deductions, recipient verification, timing and whether it transfers ownership correctly." },
      ] },
      { id: "other", title: "Related giving", intro: "Not every donation counts as Zakat, and that is fine when the intention is clear.", items: [
        { title: "Sadaqah", body: "Voluntary charity may support a wider range of beneficial causes and may be given at any time. Secret charity protects sincerity and dignity." },
        { title: "Zakat al-Fitr", body: "A separate Ramadan obligation is due before the Eid prayer for qualifying Muslims and dependants, with local Hanafi guidance on amount and timing." },
        { title: "Record safely", body: "Keep a private worksheet with the valuation date, asset values, exchange rates, recipients and proof of transfer. Never expose sensitive financial data publicly." },
      ] },
    ],
    faqs: [
      { q: "Gold or silver nisab?", a: "Both are classical measures. Contemporary scholars differ on which benchmark best protects obligation in mixed-currency wealth; follow a trusted local policy consistently." },
      { q: "Can Zakat build a mosque?", a: "Direct construction is generally not treated as transferring ownership to an eligible recipient in Hanafi law. Use Sadaqah unless a qualified scholar approves a valid structure." },
      { q: "Can I pay monthly?", a: "You may advance instalments and reconcile them on your annual date. Record them clearly so the final obligation is not underpaid." },
    ],
    sources: [
      quran("9:60", "The eight Zakat recipient categories", "9/60"),
      quran("2:261", "The multiplied reward of charity", "2/261"),
      quran("2:267", "Give from good lawful earnings", "2/267"),
      hadith("Sahih al-Bukhari, Book 24", "The Book of Zakat", "https://sunnah.com/bukhari/24"),
    ],
    reviewNote: "The calculator formula is educational. Business ownership, investments, debts, pensions, agriculture and family eligibility need a qualified Zakat review.",
  },
  {
    slug: "hajj",
    kicker: "PILGRIMAGE · MAKKAH",
    title: "Hajj & Umrah",
    summary: "Prepare from obligation and ihram through Mina, ‘Arafah, Muzdalifah, sacrifice, shaving or trimming, tawaf and the days of Mina—with health, travel and Hanafi notes kept visible.",
    foundation: {
      arabic: "وَلِلَّهِ عَلَى ٱلنَّاسِ حِجُّ ٱلْبَيْتِ مَنِ ٱسْتَطَاعَ إِلَيْهِ سَبِيلًا",
      translation: "Pilgrimage to this House is an obligation by Allah upon whoever is able among the people.",
      reference: "Surah Ali ‘Imran 3:97",
      href: "https://quran.com/3/97",
    },
    atAGlance: ["Obligatory once when able", "Three forms: Ifrad, Qiran, Tamattu‘", "‘Arafah is the central standing", "Learn rites before entering ihram"],
    chapters: [
      { id: "prepare", title: "Before travelling", intro: "Hajj begins with lawful provision, learning, repentance and rights owed to people.", items: [
        { title: "Ability", body: "Hajj becomes obligatory when legal, physical, financial and travel conditions are met. Provision for dependants, safety and current travel regulations matter." },
        { title: "Choose the type", body: "Ifrad is Hajj alone, Qiran combines Hajj and Umrah in one ihram, and Tamattu‘ performs Umrah then a separate ihram for Hajj. Many international pilgrims perform Tamattu‘." },
        { title: "Practical preparation", body: "Learn with an experienced guide, settle debts and trusts, make a will, carry prescribed medication, break in footwear and keep documents and emergency contacts securely backed up." },
      ] },
      { id: "ihram", title: "Ihram and arrival", intro: "Ihram is a sacred state entered with intention and talbiyah at or before the miqat.", items: [
        { title: "Before intention", body: "Bathe, groom before entering the state, wear permissible clothing, pray if an appropriate prayer is due, make intention and recite the talbiyah. Men use the two unstitched cloths; women wear normal modest clothing." },
        { title: "Restrictions", body: "Avoid fragrance after entering ihram, hair or nail removal, hunting, marital intimacy and its preliminaries, and sinful argument. Clothing details differ for men and women." },
        { title: "Umrah sequence", body: "Tawaf around the Ka‘bah, two rak‘ahs where safely possible, Sa‘i between Safa and Marwah, then shaving or trimming completes Umrah." },
      ] },
      { id: "days", title: "The days of Hajj", intro: "The exact sequence should be learned with your group because crowd controls and valid concessions affect movement.", items: [
        { title: "8 Dhul-Hijjah — Mina", body: "Enter ihram for Hajj if not already in it, go to Mina, pray and spend the night in worship and preparation." },
        { title: "9 Dhul-Hijjah — ‘Arafah and Muzdalifah", body: "Reach ‘Arafah and remain within its boundary during the valid time; make dua intensely. After sunset travel to Muzdalifah, pray as guided, rest and collect pebbles safely." },
        { title: "10 Dhul-Hijjah — major rites", body: "At Mina stone Jamrat al-‘Aqabah, arrange sacrifice where required, shave or trim, and perform Tawaf al-Ziyarah with Sa‘i when due. The legal order and consequences of delay need Hanafi guidance." },
        { title: "11–13 Dhul-Hijjah", body: "Stone all three Jamarat on the appointed days and times, spend the nights in Mina as required, depart according to the rules, and complete a farewell Tawaf where it applies." },
      ] },
      { id: "care", title: "Safety, women and mistakes", intro: "Preserving life, dignity and the rights of others is part of worship.", items: [
        { title: "Crowds and health", body: "Follow official routes, hydrate, use prescribed medication, rest, never push to touch the Black Stone, and seek medical help early for heat illness or breathing difficulty." },
        { title: "Women’s rulings", body: "Menstruation affects tawaf but not every Hajj rite. Travel, mahram rules, medication, hair cutting and emergency departure require individual planning with a scholar and licensed operator." },
        { title: "Dam and penalties", body: "Omissions or ihram violations can require charity, fasting or sacrifice depending on the act. Record exactly what happened and ask a qualified Hajj scholar before paying anything." },
      ] },
    ],
    faqs: [
      { q: "Is Umrah a substitute for Hajj?", a: "No. Hajj has its own time and rites. A person upon whom Hajj is obligatory is not discharged merely by performing Umrah." },
      { q: "Must I kiss the Black Stone?", a: "No. Pointing from a safe position is sufficient when crowded. Harming people to reach it contradicts the sacred purpose." },
      { q: "Can an elderly pilgrim use a wheelchair?", a: "Yes. Tawaf and Sa‘i can be performed with mobility assistance; operator arrangements and any individual concessions should be planned in advance." },
    ],
    sources: [
      quran("3:97", "The obligation of Hajj for the able", "3/97"),
      quran("2:196–203", "Complete Hajj and remember Allah during its days", "2/196-203"),
      quran("22:27–37", "The call to pilgrimage and the rites", "22/27-37"),
      hadith("Sahih Muslim, Book 15", "The Book of Pilgrimage", "https://sunnah.com/muslim/15"),
    ],
    reviewNote: "Use this to learn the map, then follow an accredited operator and a qualified Hanafi guide. Official Saudi rules and crowd routes can change each season.",
  },
  {
    slug: "durood",
    kicker: "REMEMBRANCE · SALAWAT",
    title: "Durood Sharif",
    summary: "Learn why Muslims send blessings and peace upon the Prophet ﷺ, the transmitted Durood Ibrahim, shorter valid forms, meaningful times to recite, adab and a gentle daily practice.",
    foundation: {
      arabic: "إِنَّ ٱللَّهَ وَمَلَـٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ",
      translation: "Indeed, Allah showers His blessings upon the Prophet, and His angels pray for him. O believers! Invoke Allah’s blessings upon him and salute him with peace.",
      reference: "Surah al-Ahzab 33:56",
      href: "https://quran.com/33/56",
    },
    atAGlance: ["A direct Qur’anic command", "Durood Ibrahim is taught in hadith", "Recite inside and outside Salah", "Quality, love and consistency matter"],
    chapters: [
      { id: "meaning", title: "Meaning and virtue", intro: "Salat upon the Prophet ﷺ is an act of obedience, love and gratitude to Allah for the gift of Prophethood.", items: [
        { title: "What we ask", body: "We ask Allah to honour, bless and grant peace to Muhammad ﷺ and his family. Allah is the giver; the servant is making dua." },
        { title: "One salawat", body: "Sahih Muslim 408 reports that whoever sends one salutation upon the Prophet ﷺ receives ten blessings from Allah." },
        { title: "Love with following", body: "True love appears through prayer, lawful conduct, mercy, truthful speech and following the Sunnah—not recitation counts alone." },
      ] },
      { id: "forms", title: "Transmitted forms", intro: "The most complete everyday form is the Durood Ibrahim recited in the final sitting of Salah.", items: [
        { title: "Durood Ibrahim", body: "Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad, kama sallayta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidum Majid. Allahumma barik ‘ala Muhammadin wa ‘ala ali Muhammad, kama barakta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidum Majid." },
        { title: "Short form", body: "Allahumma salli wa sallim ‘ala nabiyyina Muhammad—O Allah, send blessings and peace upon our Prophet Muhammad—is a clear shorter form for frequent recitation." },
        { title: "Pronunciation", body: "Learn slowly from a reliable teacher. Transliteration helps a beginner but does not fully represent Arabic sounds." },
      ] },
      { id: "routine", title: "A daily routine", intro: "Choose a small count that improves presence rather than chasing a number without attention.", items: [
        { title: "After the name", body: "Write or say ﷺ / sallallahu ‘alayhi wa sallam respectfully when the Prophet is mentioned." },
        { title: "Friday and dua", body: "Increase salawat on Friday, and include it with praise of Allah at the beginning and end of personal dua." },
        { title: "Habit plan", body: "Begin with 10 after Fajr and 10 after ‘Isha, reflect on one Sunnah to practise, and increase gradually without treating a voluntary number as obligatory." },
      ] },
    ],
    faqs: [
      { q: "Is there only one valid Durood?", a: "No. Several sound forms are transmitted, and a clear shorter salawat is valid. Durood Ibrahim is especially complete and is recited in Salah." },
      { q: "Must a particular count be completed?", a: "A personal routine can help consistency, but do not present an unproven count or promised result as obligatory." },
      { q: "Can I recite in any language?", a: "You may express love and make dua in your language, while learning the transmitted Arabic forms preserves their wording and use in Salah." },
    ],
    sources: [
      quran("33:56", "The command to send blessings and peace", "33/56"),
      hadith("Sahih Muslim 408", "Ten blessings for one salutation", "https://sunnah.com/muslim:408"),
      hadith("Sahih al-Bukhari 3370", "The form of blessings taught by the Prophet ﷺ", "https://sunnah.com/bukhari:3370"),
      hadith("Hisn al-Muslim 219", "A transmitted form of salawat", "https://sunnah.com/hisn:219"),
    ],
    reviewNote: "The page prioritises Qur’an and well-known transmitted forms. Claims about fixed counts or guaranteed worldly outcomes need specific evidence before publication.",
  },
];

export const knowledgeTopics: Topic[] = [
  {
    slug: "family-tree",
    kicker: "SACRED HISTORY · AHL AL-BAYT",
    title: "The Prophet’s Family Tree",
    summary: "A respectful text-based guide to the close family of Prophet Muhammad ﷺ: parents, wives honoured as Mothers of the Believers, children, Ahl al-Bayt and the line through Sayyidah Fatimah and Sayyiduna ‘Ali رضي الله عنهم.",
    foundation: {
      arabic: "إِنَّمَا يُرِيدُ ٱللَّهُ لِيُذْهِبَ عَنكُمُ ٱلرِّجْسَ أَهْلَ ٱلْبَيْتِ",
      translation: "Allah only intends to keep the causes of evil away from you and purify you completely, O members of the Prophet’s family.",
      reference: "Surah al-Ahzab 33:33",
      href: "https://quran.com/33/33",
    },
    atAGlance: ["No illustrated depictions", "Wives are Mothers of the Believers", "Fatimah, ‘Ali, Hasan and Husayn are central Ahl al-Bayt", "Disputed genealogies are labelled"],
    chapters: [
      { id: "roots", title: "Parents and ancestry", intro: "The Prophet ﷺ belonged to Banu Hashim of Quraysh, among the descendants of Prophet Isma‘il عليه السلام.", items: [
        { title: "Father and mother", body: "His father was ‘Abdullah ibn ‘Abd al-Muttalib and his mother was Aminah bint Wahb. ‘Abdullah died before his birth; Aminah died when he was about six." },
        { title: "Grandfather and guardian", body: "‘Abd al-Muttalib cared for him after his mother’s death. After the grandfather died, his paternal uncle Abu Talib became his guardian and protected him for many years." },
        { title: "Lineage", body: "Early biographical works preserve the line through ‘Abdullah, ‘Abd al-Muttalib, Hashim and Quraysh. Genealogies beyond ‘Adnan contain reported differences and should not be shown as equally certain." },
      ] },
      { id: "household", title: "Wives and children", intro: "Qur’an 33:6 gives the Prophet’s wives the honour of Mothers of the Believers.", items: [
        { title: "Mothers of the Believers", body: "The commonly listed wives are Khadijah, Sawdah, ‘Aishah, Hafsah, Zaynab bint Khuzaymah, Umm Salamah, Zaynab bint Jahsh, Juwayriyah, Umm Habibah, Safiyyah and Maymunah رضي الله عنهن." },
        { title: "Sons", body: "His sons were al-Qasim and ‘Abdullah (also associated in reports with the names al-Tayyib/al-Tahir) through Sayyidah Khadijah, and Ibrahim through Mariyah al-Qibtiyyah. They died in childhood." },
        { title: "Daughters", body: "His daughters were Zaynab, Ruqayyah, Umm Kulthum and Fatimah رضي الله عنهن. Sunni historical works generally identify all four as daughters of the Prophet ﷺ and Sayyidah Khadijah." },
      ] },
      { id: "ahl", title: "Ahl al-Bayt", intro: "Sunni scholarship honours the Prophet’s wives and close blood family and gives special love to the people of the cloak.", items: [
        { title: "The household", body: "The term Ahl al-Bayt is discussed in Qur’anic context and hadith. The wives are addressed in the surrounding verses, while sound reports give special inclusion to ‘Ali, Fatimah, Hasan and Husayn رضي الله عنهم." },
        { title: "Fatimah and ‘Ali", body: "Sayyidah Fatimah al-Zahra, the beloved daughter of the Prophet ﷺ, married Sayyiduna ‘Ali ibn Abi Talib, cousin of the Prophet and the fourth rightly guided Caliph." },
        { title: "Hasan and Husayn", body: "Their best-known sons are Imam Hasan and Imam Husayn رضي الله عنهما, beloved grandsons of the Prophet ﷺ. Their descendants are traditionally known through Hasanid and Husaynid lines." },
      ] },
      { id: "adab", title: "How to study sacred genealogy", intro: "Lineage is learned for love, history and responsibility—not racial pride or unverifiable status.", items: [
        { title: "Use honorifics", body: "Send blessings upon the Prophet ﷺ and use رضي الله عنه/عنها/عنهم for the Companions and noble family with respect." },
        { title: "Verify claims", body: "Modern family-tree claims require documentary genealogy and expert review. A surname, oral claim or social-media chart is not proof by itself." },
        { title: "Avoid rivalry", body: "Love for Ahl al-Bayt and love for the Companions belong together in Sunni devotion. Do not turn their memory into abuse, factional hostility or fabricated stories." },
      ] },
    ],
    faqs: [
      { q: "Are the Prophet’s wives part of Ahl al-Bayt?", a: "The wives are addressed in the Qur’anic passage and are Mothers of the Believers. Hadith also gives special inclusion to ‘Ali, Fatimah, Hasan and Husayn. Sunni explanations preserve both." },
      { q: "Does NOOR verify a person’s Sayyid ancestry?", a: "No. Public genealogical verification requires specialist records and responsible privacy practices; the website only explains the historical framework." },
      { q: "Why is the tree text-only?", a: "It maintains a respectful, accessible presentation and avoids imagined depictions of sacred figures." },
    ],
    sources: [
      quran("33:6", "The wives of the Prophet are Mothers of the Believers", "33/6"),
      quran("33:33", "Ahl al-Bayt and purification", "33/33"),
      hadith("Sahih Muslim 2408a", "The Book of Allah and care for Ahl al-Bayt", "https://sunnah.com/muslim:2408a"),
      hadith("Jami‘ at-Tirmidhi 3788", "Virtues of the Prophet’s household", "https://sunnah.com/tirmidhi:3788"),
    ],
    reviewNote: "Names are presented from mainstream Sunni sources. Detailed ancestry and variant historical reports should be reviewed by a qualified seerah/genealogy specialist.",
  },
  {
    slug: "waqiyahs",
    kicker: "QUR’ANIC STORIES · LESSONS",
    title: "Famous Waqiyahs",
    summary: "A sourced story library built from Qur’anic narratives and sound hadith. Each account separates the revealed text from later storytelling and ends with practical lessons rather than spectacle.",
    foundation: {
      arabic: "لَقَدْ كَانَ فِى قَصَصِهِمْ عِبْرَةٌ لِّأُو۟لِى ٱلْأَلْبَـٰبِ",
      translation: "In their stories there is truly a lesson for people of reason.",
      reference: "Surah Yusuf 12:111",
      href: "https://quran.com/12/111",
    },
    atAGlance: ["Revelation before folklore", "Verse-by-verse reading links", "Clear lessons", "Unverified details are omitted"],
    chapters: [
      { id: "prophets", title: "Stories of the Prophets", intro: "The Qur’an repeats stories in different places to teach belief, patience, repentance and reliance.", items: [
        { title: "Yusuf عليه السلام", body: "Surah Yusuf traces jealousy, separation, temptation, prison, wise leadership and forgiveness. Its central lesson is that patient God-consciousness is never lost, even when events seem broken.", href: "https://quran.com/12", linkLabel: "Read Surah Yusuf" },
        { title: "Musa عليه السلام", body: "Surahs Taha and al-Qasas cover his birth under oppression, upbringing, calling, confrontation with Pharaoh, the Exodus and the long education of Bani Isra’il.", href: "https://quran.com/20", linkLabel: "Read Surah Taha" },
        { title: "Ibrahim عليه السلام", body: "Across al-An‘am, al-Anbiya and as-Saffat, Ibrahim rejects idols, debates his people, survives the fire, migrates for Allah and submits to the command of sacrifice." },
      ] },
      { id: "rescue", title: "Rescue, repentance and hope", intro: "These narratives show that Allah’s mercy reaches people in darkness, danger and sincere return.", items: [
        { title: "Yunus عليه السلام", body: "In the darknesses of the sea he called: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Qur’an 21:87–88 joins admission, glorification and hope." },
        { title: "Nuh عليه السلام", body: "Surah Hud presents long perseverance, the ark and the painful truth that guidance is not inherited by family connection alone." },
        { title: "Maryam عليها السلام", body: "Surah Maryam honours devotion, miraculous provision, the birth of ‘Isa and trust during social trial. Read the Qur’anic account without importing polemical or legendary additions." },
      ] },
      { id: "communities", title: "Believers under pressure", intro: "Not every Qur’anic story names every person or location; the moral purpose matters more than speculation.", items: [
        { title: "People of the Cave", body: "Young believers withdrew from persecution and Allah preserved them. Surah al-Kahf teaches principled faith, careful speech about the unseen and the limits of human certainty." },
        { title: "Companions of the Garden", body: "Surah al-Qalam 68:17–33 describes owners who planned to exclude the poor. Their loss awakened repentance and exposes entitlement in wealth." },
        { title: "The people of the trench", body: "Surah al-Buruj honours believers persecuted for faith. Sound hadith expands the account of the boy and the king; the story teaches courage without romanticising harm." },
      ] },
    ],
    faqs: [
      { q: "Are all popular waqiyahs authentic?", a: "No. A moving story may be weak, borrowed or invented. NOOR labels Qur’an, hadith grading and later historical reports separately." },
      { q: "Why are some names or dates missing?", a: "If revelation does not specify a detail and reliable evidence is absent, omitting it is more honest than filling the gap with folklore." },
      { q: "May stories be used in children’s lessons?", a: "Yes, with age-appropriate language, but the factual core and source label should remain accurate." },
    ],
    sources: [
      quran("12", "The complete story of Yusuf", "12"),
      quran("18:9–26", "The People of the Cave", "18/9-26"),
      quran("19", "Maryam, Zakariyya, Yahya and ‘Isa", "19"),
      quran("21:87–88", "The prayer and rescue of Yunus", "21/87-88"),
    ],
    reviewNote: "Every published story should identify whether it comes from Qur’an, sound hadith or later history. Weak and fabricated narrations are not presented as fact.",
  },
  {
    slug: "festivals",
    kicker: "ISLAMIC CALENDAR · WORSHIP & MEMORY",
    title: "Islamic Festivals & Sacred Days",
    summary: "A calendar guide to Ramadan, the two Eids, Hajj, ‘Ashura, Mawlid/Milad and the middle of Sha‘ban, separating obligatory worship, established Sunnah, devotional custom and local practice.",
    foundation: {
      arabic: "شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ",
      translation: "Ramadan is the month in which the Qur’an was revealed as a guide for humanity.",
      reference: "Surah al-Baqarah 2:185",
      href: "https://quran.com/2/185",
    },
    atAGlance: ["Dates follow verified lunar sighting", "Two Eids are universal celebrations", "Hajj rites occur in Dhul-Hijjah", "Local devotional customs are labelled"],
    chapters: [
      { id: "eids", title: "The two Eids", intro: "Eid al-Fitr and Eid al-Adha are the two recurring festivals established for Muslims.", items: [
        { title: "Eid al-Fitr", body: "Celebrated on 1 Shawwal after Ramadan. Give Zakat al-Fitr before the Eid prayer, bathe and dress well, eat before leaving, use a different route where practical, pray the Eid prayer and reconnect with family and neighbours." },
        { title: "Eid al-Adha", body: "Celebrated from 10 Dhul-Hijjah during the Hajj season. The financially able arrange qurbani/udhiyah according to local law and fiqh, distribute responsibly and avoid waste or public harm." },
        { title: "Eid prayer", body: "The Hanafi method includes additional takbirs. Exact timings, missed prayer rules and whether multiple congregations are valid should follow the local mosque and scholar." },
      ] },
      { id: "ramadan-hajj", title: "Ramadan and Hajj season", intro: "These are seasons of worship rather than entertainment calendars.", items: [
        { title: "Ramadan", body: "Fast the month, guard the five prayers, recite Qur’an, give charity, attend Tarawih as able and seek Laylat al-Qadr in the last ten nights." },
        { title: "Dhul-Hijjah", body: "Increase good deeds in the first ten days. Non-pilgrims may fast on 9 Dhul-Hijjah; pilgrims follow the Hajj rites and do not fast at ‘Arafah if it weakens them." },
        { title: "Lunar dates", body: "Islamic days begin at sunset. Use the official or trusted local moon-sighting decision for worship, not a device calendar alone." },
      ] },
      { id: "other", title: "Other remembered days", intro: "Practices and scholarly assessments can differ; NOOR states the evidence category instead of pretending every custom has the same legal rank.", items: [
        { title: "‘Ashura — 10 Muharram", body: "The Sunnah encourages fasting ‘Ashura, preferably with the day before or after. The day also carries grief in Muslim memory for the martyrdom of Imam Husayn رضي الله عنه; remembrance must avoid unlawful harm and false reports." },
        { title: "Mawlid / Milad", body: "Many Ahle Sunnat communities hold Qur’an recitation, salawat, seerah teaching, charity and lawful gatherings in Rabi‘ al-Awwal. Scholars differ over forms and labelling; no custom should be treated as obligatory." },
        { title: "15 Sha‘ban", body: "Many Muslims spend the night in personal prayer, repentance and visiting graves. Hadith assessments and specified collective practices are discussed by scholars, so avoid invented guarantees and obligatory formulas." },
      ] },
    ],
    faqs: [
      { q: "Why can Islamic dates differ by one day?", a: "Lunar months depend on sighting policy, geography and legal method. Follow your trusted local authority for communal worship." },
      { q: "Is every cultural celebration a Sunnah?", a: "No. A lawful custom may be permitted without being a transmitted Sunnah. Pages should label its status clearly." },
      { q: "What is the safest celebration principle?", a: "Protect obligations, avoid extravagance and harm, teach authentic seerah, give charity, maintain family ties and do not condemn others over recognised scholarly differences." },
    ],
    sources: [
      quran("2:185", "Ramadan and the revelation of the Qur’an", "2/185"),
      quran("22:27–37", "Hajj, sacrifice and reverence", "22/27-37"),
      hadith("Sahih Muslim 1130a", "Fasting the day of ‘Ashura", "https://sunnah.com/muslim:1130a"),
      hadith("Sahih al-Bukhari 952", "Eid celebration within lawful limits", "https://sunnah.com/bukhari:952"),
      hadith("Dawat-e-Islami", "An Ahle Sunnat article on Shab-e-Bara’at", "https://www.dawateislami.net/blog/shab-e-barat"),
    ],
    reviewNote: "The page distinguishes established universal worship from devotional customs. Local dates and disputed practices should follow qualified scholarship.",
  },
  {
    slug: "quotes",
    kicker: "QUR’AN · READ & REFLECT",
    title: "Famous Qur’anic Quotes",
    summary: "A theme-based collection of short Qur’anic reminders with exact references and links to the surrounding passage. Share the verse with its citation, then read before and after it for context.",
    foundation: {
      arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      translation: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
      reference: "Surah ash-Sharh 94:5–6",
      href: "https://quran.com/94/5-6",
    },
    atAGlance: ["Exact surah and ayah", "Context link on every theme", "Translations are meanings, not the Arabic Qur’an", "No decorative misquotation"],
    chapters: [
      { id: "hope", title: "Hope and hardship", intro: "Qur’anic hope is joined to repentance, patience, prayer and action.", items: [
        { title: "Never despair — 39:53", body: "Do not lose hope in Allah’s mercy. The verse calls those who have wronged themselves back to repentance; it is not permission to continue harm.", href: "https://quran.com/39/53", linkLabel: "Read in context" },
        { title: "With hardship is ease — 94:5–6", body: "The repeated assurance steadies the believer while the following verses command continued effort and turning one’s longing to Allah.", href: "https://quran.com/94/5-8", linkLabel: "Read in context" },
        { title: "Allah is near — 2:186", body: "Allah answers the caller who calls upon Him, and the verse also asks believers to respond to Him and believe.", href: "https://quran.com/2/186", linkLabel: "Read verse" },
      ] },
      { id: "character", title: "Patience, gratitude and trust", intro: "These are active disciplines rather than slogans.", items: [
        { title: "Seek help — 2:153", body: "Seek help through patience and prayer; Allah is with the patient.", href: "https://quran.com/2/153", linkLabel: "Read verse" },
        { title: "Gratitude — 14:7", body: "If you are grateful, Allah promises increase. Gratitude includes recognition, praise and using blessings lawfully.", href: "https://quran.com/14/7", linkLabel: "Read verse" },
        { title: "Reliance — 65:3", body: "Whoever relies upon Allah, He is sufficient for them. The surrounding verses concern God-consciousness and obedience during a difficult family matter.", href: "https://quran.com/65/2-3", linkLabel: "Read in context" },
      ] },
      { id: "society", title: "Family and society", intro: "The Qur’an joins devotion with justice and rights.", items: [
        { title: "Parents — 17:23–24", body: "Worship Allah alone, treat parents with excellence, do not speak contemptuously, and pray for mercy upon them.", href: "https://quran.com/17/23-24", linkLabel: "Read verses" },
        { title: "Justice — 4:135", body: "Stand firmly for justice even against yourselves, parents or close relatives, and do not let wealth or poverty distort truth.", href: "https://quran.com/4/135", linkLabel: "Read verse" },
        { title: "Brotherhood — 49:10", body: "Believers are a brotherhood; reconcile between them and remain conscious of Allah. The next verses forbid mockery, suspicion and backbiting.", href: "https://quran.com/49/10-12", linkLabel: "Read in context" },
      ] },
      { id: "worship", title: "Remembrance and knowledge", intro: "The most shared verse should still lead back to recitation, reflection and action.", items: [
        { title: "Hearts find rest — 13:28", body: "Hearts find reassurance in the remembrance of Allah. Dhikr includes Qur’an, prayer, dua, praise and a life of obedience.", href: "https://quran.com/13/28", linkLabel: "Read verse" },
        { title: "Establish prayer — 20:14", body: "Allah tells Musa: worship Me and establish prayer for My remembrance.", href: "https://quran.com/20/14", linkLabel: "Read verse" },
        { title: "Increase me in knowledge — 20:114", body: "The Qur’an teaches the dua Rabbi zidni ‘ilma—My Lord, increase me in knowledge.", href: "https://quran.com/20/114", linkLabel: "Read verse" },
      ] },
    ],
    faqs: [
      { q: "Can I share a translation as ‘the Qur’an’?", a: "A translation conveys interpreted meaning. Keep the surah and ayah reference visible and link to the Arabic text and context." },
      { q: "Why does context matter for a short quote?", a: "A fragment can be made to mean the opposite of its passage. Reading nearby verses protects the message." },
      { q: "May verses be placed on products or decorations?", a: "Treat Qur’anic text with dignity and consider where the item will be worn, placed or discarded. Ask a scholar for sensitive uses." },
    ],
    sources: [
      quran("39:53", "Hope in Allah’s mercy", "39/53"),
      quran("94:5–6", "Ease with hardship", "94/5-6"),
      quran("49:10–12", "Brotherhood and social ethics", "49/10-12"),
      quran("13:28", "Hearts find rest in remembrance", "13/28"),
    ],
    reviewNote: "Translations are presented as meanings. Arabic text, verse numbers and context links should be checked before any quote card is published or shared.",
  },
  {
    slug: "scholars",
    kicker: "KNOWLEDGE · TRUSTED GUIDANCE",
    title: "Islamic Scholars",
    summary: "Understand what qualified scholarship looks like, the fields scholars study, how to verify a teacher or fatwa, the etiquette of asking and the warning signs of online religious misinformation.",
    foundation: {
      arabic: "فَسْـَٔلُوٓا۟ أَهْلَ ٱلذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
      translation: "Ask those who have knowledge if you do not know.",
      reference: "Surah an-Nahl 16:43",
      href: "https://quran.com/16/43",
    },
    atAGlance: ["Training and teachers matter", "Different disciplines need different experts", "A clip is not a complete fatwa", "Evidence and character are both checked"],
    chapters: [
      { id: "fields", title: "Fields of scholarship", intro: "No single title proves mastery of every Islamic discipline.", items: [
        { title: "Qur’an and tafsir", body: "Includes Arabic, recitation, occasions of revelation, Prophetic explanation and the established methods of interpretation." },
        { title: "Hadith", body: "Scholars examine chains, narrators, wording, grading, reconciliation and legal use. A hadith database is a research aid, not an automatic verdict generator." },
        { title: "Fiqh and ifta", body: "A jurist studies worship and transactions through a legal school and its principles. A mufti is trained to apply law to a real question after understanding its facts." },
        { title: "Aqidah, seerah and spiritual education", body: "Creed needs precise theology; seerah needs historical method; spiritual mentoring needs sound belief, ethical conduct and accountable teaching." },
      ] },
      { id: "verify", title: "How to verify a scholar", intro: "Look beyond follower counts and honorifics.", items: [
        { title: "Education and authorization", body: "Identify teachers, institutions, areas of study and whether recognised scholars vouch for the person’s work. Traditional ijazah and modern degrees each need context." },
        { title: "Method and transparency", body: "A reliable teacher distinguishes strong and weak evidence, names the legal school used, admits uncertainty, corrects mistakes and refers specialised cases onward." },
        { title: "Character and safeguarding", body: "Check financial transparency, boundaries, handling of women and minors, complaint procedures and whether criticism is answered without threats or cult-like loyalty." },
      ] },
      { id: "ask", title: "How to ask well", intro: "A clear, private question receives a safer answer.", items: [
        { title: "Give relevant facts", body: "State your country, madhhab if known, dates, amounts, exact wording and whether a matter has already happened. Do not expose another person’s private information publicly." },
        { title: "Distinguish education from fatwa", body: "A lesson explains a rule generally. A fatwa answers a specific case. A court or authority may be required for enforceable marriage, divorce, inheritance or abuse matters." },
        { title: "Handle disagreement", body: "Ask for the evidence and method, avoid collecting opinions merely to find the easiest answer, and do not turn a sincere question into social-media conflict." },
      ] },
    ],
    faqs: [
      { q: "Is every imam a mufti?", a: "No. An imam may lead prayer and teach well without specialised training to issue complex legal verdicts." },
      { q: "Can I follow a scholar online?", a: "Online lessons can benefit, but verify identity, training and context. Personal cases still require secure two-way consultation." },
      { q: "What if qualified scholars disagree?", a: "Recognised disagreement exists. Follow a sound method or trusted local authority, respect other valid positions, and do not treat every difference as deviance." },
    ],
    sources: [
      quran("16:43", "Ask the people of knowledge", "16/43"),
      quran("9:122", "A group should gain understanding and teach", "9/122"),
      quran("35:28", "Those with knowledge truly stand in awe of Allah", "35/28"),
      hadith("Sunan Abi Dawud 3641", "Scholars are heirs of the Prophets", "https://sunnah.com/abudawud:3641"),
    ],
    reviewNote: "NOOR may list verified public profiles, but it does not certify private conduct or replace a local scholarly council, safeguarding body or court.",
  },
  {
    slug: "channels",
    kicker: "MEDIA · WATCH WITH CARE",
    title: "Islamic Channels",
    summary: "A responsible way to find Qur’an, seerah, fiqh, Naat, children’s education and community media—using source labels, speaker verification, transcripts and child-safety checks.",
    foundation: {
      arabic: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِن جَآءَكُمْ فَاسِقٌۢ بِنَبَإٍ فَتَبَيَّنُوٓا۟",
      translation: "O believers, if an unreliable person brings you news, verify it, so you do not harm people unknowingly.",
      reference: "Surah al-Hujurat 49:6",
      href: "https://quran.com/49/6",
    },
    atAGlance: ["Verify speaker and institution", "Prefer full lessons over clips", "Check hadith references", "Protect children from ads and recommendations"],
    chapters: [
      { id: "types", title: "What the directory should contain", intro: "Every channel is labelled by purpose so entertainment, devotion and formal learning are not confused.", items: [
        { title: "Qur’an and recitation", body: "Verified reciters, tajwid teachers, translations and tafsir series with surah, ayah and teacher attribution." },
        { title: "Learning and fatwa", body: "Institutional lessons and scholar channels that identify the speaker, school of law, date and source links. Short answers are linked back to the full question." },
        { title: "Naat and devotional media", body: "Writer and reciter credits, lyrics rights, audio provenance and clear separation between poetry and revealed text." },
        { title: "Children and family", body: "Age labels, ad-free or supervised access options, no manipulative fundraising and a clear parent guide." },
      ] },
      { id: "check", title: "A five-point verification check", intro: "Do this before sharing a religious clip.", items: [
        { title: "1. Identify", body: "Who speaks, who published it, when was it recorded, and is the account official?" },
        { title: "2. Restore context", body: "Find the full lecture and the actual question. A 30-second edit can remove conditions and reverse a conclusion." },
        { title: "3. Check the citation", body: "Open the Qur’an passage or hadith reference. Verify numbering, translation and grading rather than trusting text over a background image." },
        { title: "4–5. Compare and pause", body: "Compare a qualified source, and if the content attacks someone, affects health, marriage or money, pause before forwarding." },
      ] },
      { id: "safety", title: "Digital wellbeing", intro: "Religious content should improve worship and character, not create endless scrolling or fear.", items: [
        { title: "Build a learning playlist", body: "Choose one structured course, take notes and act on each lesson instead of collecting disconnected clips." },
        { title: "Avoid outrage channels", body: "Repeated takfir, humiliation, conspiracy, graphic punishment thumbnails and constant fundraising are red flags." },
        { title: "Report and correct", body: "If a link becomes unsafe or a speaker retracts material, the directory should record the correction date and remove or archive the recommendation." },
      ] },
    ],
    faqs: [
      { q: "Does listing a channel endorse every video?", a: "No. A listing should state its reviewed scope and date; channels change and individual videos still need checking." },
      { q: "Why require transcripts?", a: "Transcripts improve accessibility, allow precise citation and make it harder to hide claims in long audio." },
      { q: "Can children use external video sites alone?", a: "Recommendation feeds, comments and ads can expose unsuitable content. Use supervised or restricted access and trusted playlists." },
    ],
    sources: [
      quran("49:6", "Verify news before causing harm", "49/6"),
      quran("17:36", "Do not follow what you have no sure knowledge of", "17/36"),
      quran("24:15–16", "Do not pass on claims without knowledge", "24/15-16"),
      hadith("Sahih Muslim, Introduction 5", "It is enough falsehood to repeat everything heard", "https://sunnah.com/muslim/introduction/5"),
    ],
    reviewNote: "Channel recommendations require periodic re-checking. NOOR should record the reviewer, date, scope, ownership and any later correction.",
  },
];

export const naatTopics: Topic[] = [
  {
    slug: "lyrics",
    kicker: "NAAT LIBRARY · READING & RECITATION",
    title: "Naat Lyrics",
    summary: "A focused multilingual reader for Naat, Salam and devotional poetry with writer, reciter, language, source and rights information kept beside the text—not hidden in an unverified copy.",
    foundation: {
      arabic: "إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَذَكَرُوا۟ ٱللَّهَ كَثِيرًا",
      translation: "Except those poets who believe, do good, remember Allah often and respond after being wronged.",
      reference: "Surah ash-Shu‘ara 26:227",
      href: "https://quran.com/26/224-227",
    },
    atAGlance: ["Roman, Urdu, Hindi and English-ready", "Writer and source attribution", "Reader and practice modes", "Only licensed or public-domain full texts"],
    chapters: [
      { id: "reader", title: "The complete reader experience", intro: "Every kalam entry uses the same clean structure so readers can learn without pop-ups or copied clutter.", items: [
        { title: "Header and attribution", body: "Title, genre, original script, writer, source collection, known date, language and rights status appear before the text. ‘Traditional’ is used only when authorship genuinely cannot be established." },
        { title: "Language views", body: "Original Urdu/Arabic script is kept separate from Roman transliteration, Devanagari and meaning. A translation is labelled as meaning and never presented as the poet’s exact line." },
        { title: "Practice tools", body: "Line focus, larger type, repeat markers, pronunciation notes, bookmarks and print mode support individual and group practice without altering the original words." },
        { title: "Source notes", body: "Variant readings are compared to a printed diwan, manuscript, authorised publisher or verified estate. A web page alone is not enough when it gives no author or source." },
      ] },
      { id: "adab", title: "Adab of Naat", intro: "Devotional poetry is honoured by truth, sound belief and careful recitation.", items: [
        { title: "Revelation and poetry", body: "A Naat is not Qur’an or hadith. It may express love beautifully, but its claims still need to agree with sound Islamic belief and verified history." },
        { title: "Pronunciation and meaning", body: "Learn difficult Urdu, Persian and Arabic words before public recitation. Mispronunciation can reverse a meaning; a glossary should explain uncommon vocabulary." },
        { title: "Performance", body: "Protect prayer times, avoid unlawful settings, credit the writer, and do not use emotional performance to manipulate money or status." },
      ] },
      { id: "publish", title: "Publishing and rights workflow", intro: "The reference sites inspire discoverability, but NOOR does not copy complete lyrics without permission.", items: [
        { title: "Rights check", body: "Confirm the author’s death date, jurisdiction, publisher or estate permission, and the rights status of each translation, transliteration, typesetting and recording." },
        { title: "Editorial check", body: "Two readers compare the text line by line, preserve stanza breaks, verify names and refrains, and record which edition was used." },
        { title: "Religious review", body: "A qualified Sunni reviewer checks theological claims and identifies figurative language that needs explanation. Editorial notes do not silently rewrite the poet." },
        { title: "Correction history", body: "Readers can report a line; editors keep a public correction note with old wording, new wording, source and date." },
      ] },
    ],
    faqs: [
      { q: "Why are some famous lyrics not printed in full?", a: "Popularity does not remove copyright. A full text appears only after public-domain status or permission and source accuracy are verified." },
      { q: "Is Roman Urdu the original text?", a: "No. Roman Urdu is a reading aid and can hide pronunciation differences. The original script remains the editorial base." },
      { q: "Can readers submit lyrics?", a: "Yes, but submissions should include the writer, printed or authorised source, permission status and clear images or files for verification." },
    ],
    sources: [
      quran("26:224–227", "Poetry, faith, good works and remembrance", "26/224-227"),
      quran("33:56", "Blessings and peace upon the Prophet ﷺ", "33/56"),
      hadith("Sahih al-Bukhari 6152", "Hassan ibn Thabit and poetry in defence of the Prophet ﷺ", "https://sunnah.com/bukhari:6152"),
      hadith("Reference inspiration", "My Naat Book — searchable Naat collection", "https://www.mynaatbook.com/"),
      hadith("Reference inspiration", "Naat-e-Nabi — multilingual lyric presentation", "https://naatenabi.com/lam-yati-nazeero-kafi-nazarin/"),
    ],
    reviewNote: "NOOR will not republish full lyrics from reference websites without permission. Every full text needs source, rights and theological review.",
  },
  {
    slug: "writers",
    kicker: "NAAT LIBRARY · POETS & AUTHORS",
    title: "Naat by Writer",
    summary: "Browse devotional poetry by its writer, with a responsible biography, languages, teachers, collections, verified works, variant attributions and reading links.",
    foundation: {
      translation: "There is wisdom in some poetry.",
      reference: "Sahih al-Bukhari 6145",
      href: "https://sunnah.com/bukhari:6145",
    },
    atAGlance: ["Alphabetical and era filters", "Verified authorship", "Biography with sources", "Works grouped by collection"],
    chapters: [
      { id: "profile", title: "What a writer profile contains", intro: "A useful profile separates documented biography from popular attribution.", items: [
        { title: "Identity", body: "Full name, pen name, dates, region, languages and major teachers are listed with sources. Honorifics are preserved without turning them into unverifiable claims." },
        { title: "Literary context", body: "Explain genres such as Naat, Salam, Manqabat and Munajat, the poetic metre where known, and the Urdu, Persian, Arabic or regional tradition of the work." },
        { title: "Collections", body: "Link to published diwans, authorised editions and library records. Individual works are grouped under the collection that best establishes their text." },
        { title: "Attribution status", body: "Each poem is marked verified, probable, disputed or misattributed, with the reason and evidence." },
      ] },
      { id: "browse", title: "How to browse writers", intro: "Search by what is known, then narrow by evidence rather than popularity.", items: [
        { title: "Name and pen name", body: "Search spelling variants in Urdu, Roman and English. Duplicate profiles merge only after dates and identity are confirmed." },
        { title: "Era and language", body: "Filters help readers discover classical and contemporary writers without pretending that every ‘traditional’ lyric is ancient." },
        { title: "Themes and form", body: "Browse praise, longing for Madinah, seerah, salutations and supplication, while preserving the writer’s original category." },
      ] },
      { id: "editorial", title: "Authorship and correction", intro: "Viral attribution is one of the largest risks in an online Naat library.", items: [
        { title: "Minimum proof", body: "Use the writer’s own collection, an early reliable edition, estate confirmation or a scholarly catalogue. A reciter’s video description is supporting evidence, not final proof." },
        { title: "Variant lines", body: "Reciters often shorten or rearrange verses. The writer page preserves the base text and records performance variants separately." },
        { title: "Living writers", body: "Obtain permission, allow correction and link to official purchasing or reading sources. Do not scrape social posts into a permanent archive." },
      ] },
    ],
    faqs: [
      { q: "What if a writer is unknown?", a: "Label the work ‘author not yet verified’ rather than ‘traditional’ by default, and invite documented evidence." },
      { q: "Can one poem have multiple writers listed online?", a: "Yes. NOOR should show the conflict and evidence instead of selecting the most popular name without proof." },
      { q: "May biographies include miracle stories?", a: "Only with a clear source and category. Later devotional reports should not be presented as the same level of certainty as documented dates and works." },
    ],
    sources: [
      quran("26:224–227", "The Qur’anic framework for poetry", "26/224-227"),
      hadith("Sahih al-Bukhari 6145", "There is wisdom in some poetry", "https://sunnah.com/bukhari:6145"),
      hadith("Sahih al-Bukhari 6152", "Hassan ibn Thabit’s poetic defence", "https://sunnah.com/bukhari:6152"),
      hadith("Reference inspiration", "Faiz-e-Islam lyric and author presentation", "https://faizeislam.net/lam-yati-nazeero-kafi-nazarin-lyrics/"),
    ],
    reviewNote: "Writer profiles require bibliographic sourcing. Popular attribution and spiritual titles alone do not establish authorship.",
  },
  {
    slug: "reciters",
    kicker: "NAAT LIBRARY · VOICES & RECORDINGS",
    title: "Naat by Reciter",
    summary: "Discover Naat Khawans through verified profiles, languages, recordings, writers recited, pronunciation notes and official channels—without confusing a performer with the author.",
    foundation: {
      translation: "O Hassan, reply on behalf of Allah’s Messenger. O Allah, support him with the Holy Spirit.",
      reference: "Sahih al-Bukhari 6152",
      href: "https://sunnah.com/bukhari:6152",
    },
    atAGlance: ["Reciter and writer shown separately", "Official audio links", "Language and style filters", "Recording rights tracked"],
    chapters: [
      { id: "profile", title: "Reciter profile", intro: "A profile documents the voice without inventing private biography.", items: [
        { title: "Public identity", body: "Display the public professional name, region, languages and verified official channels. Personal contact details are never scraped." },
        { title: "Discography", body: "Group studio releases, live mehfil recordings and collaborations by date. Link to the official publisher or rights-holder when available." },
        { title: "Credits", body: "Every recording names the poet, translator or adapter, composer where relevant, label, event and source. ‘Recited by’ never replaces ‘written by’." },
        { title: "Corrections", body: "If a commonly recited line differs from the source poem, show it as a performance variant and explain the editorial basis." },
      ] },
      { id: "discover", title: "Discovery filters", intro: "Find a suitable rendition without ranking devotion as a popularity contest.", items: [
        { title: "Language", body: "Urdu, Arabic, Persian, Punjabi, Bengali, Hindi and English filters describe the actual recording, not only the title." },
        { title: "Use case", body: "Slow practice, children’s learning, studio, live gathering and translation-led versions are clearly labelled." },
        { title: "Text availability", body: "A recording links to a verified lyric page only when wording and rights are cleared. Otherwise it displays metadata and an official listening link." },
      ] },
      { id: "listening", title: "Responsible listening and events", intro: "Devotional media should serve remembrance and character.", items: [
        { title: "Prayer comes first", body: "Playback, events and practice pause for obligatory prayer. A beautiful recitation does not excuse missed duties." },
        { title: "Events", body: "Venue, organiser, access, family arrangements, ticketing and charity claims need verification before appearing in the calendar." },
        { title: "Rights and downloads", body: "Embed or link only where the platform and uploader are authorised. Do not offer audio downloads merely because a file is publicly reachable." },
      ] },
    ],
    faqs: [
      { q: "Why is a reciter not listed as the writer?", a: "Authorship and performance are distinct. A reciter may popularise a work without having written it." },
      { q: "Can NOOR host audio?", a: "Yes, after permission or a suitable licence identifies the recording owner, territory and allowed uses." },
      { q: "How are official channels verified?", a: "Use links from the artist or label’s recognised website/account and record the verification date." },
    ],
    sources: [
      quran("33:56", "Blessings and peace upon the Prophet ﷺ", "33/56"),
      quran("26:227", "Faithful poetry and remembrance", "26/227"),
      hadith("Sahih al-Bukhari 6152", "Hassan ibn Thabit and Prophetic approval", "https://sunnah.com/bukhari:6152"),
    ],
    reviewNote: "Profiles cover verified public work only. Audio, images and embedded videos require rights checks and should link to official sources.",
  },
];

export const communityTopics: Topic[] = [
  {
    slug: "khanqah",
    kicker: "HERITAGE · KHANQAH & URS",
    title: "Khanqah & Urs",
    summary: "Learn the role of a khanqah, the purpose of spiritual training and dhikr, etiquette of visiting graves and annual Urs gatherings, plus the verification required before publishing an event or centre.",
    foundation: {
      arabic: "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      translation: "Surely the friends of Allah will have no fear, nor will they grieve—those who believed and were mindful of Him.",
      reference: "Surah Yunus 10:62–63",
      href: "https://quran.com/10/62-64",
    },
    atAGlance: ["Spiritual training must follow Shariah", "Events need verified dates and organisers", "Grave visits are for remembrance and dua", "Custom is not labelled obligatory"],
    chapters: [
      { id: "meaning", title: "Khanqah and spiritual training", intro: "Historically, a khanqah is a place of teaching, remembrance, hospitality and reform under spiritual guidance.", items: [
        { title: "The goal", body: "Tazkiyah is purification from pride, envy, showing off, uncontrolled anger and attachment to sin, while growing sincerity, gratitude, patience and service." },
        { title: "The measure", body: "No spiritual instruction overrides the Qur’an, Sunnah or obligatory law. A guide is respected but not treated as infallible, omniscient or exempt from accountability." },
        { title: "Daily programme", body: "A responsible centre publishes prayer times, Qur’an and fiqh lessons, dhikr gatherings, service programmes, safeguarding policy and contact details." },
      ] },
      { id: "urs", title: "Understanding Urs", intro: "Urs is an annual remembrance of a pious Muslim’s death, commonly marked in many Ahle Sunnat communities through lawful acts of devotion and service.", items: [
        { title: "Permissible aims", body: "Recite Qur’an, send reward, study the person’s verified life and teachings, give charity, feed people and increase salawat—without believing attendance is obligatory." },
        { title: "Avoid excess", body: "Do not neglect prayer, mix unlawfully, exploit visitors, invent guaranteed rewards, attribute independent power to creation or pressure people for money." },
        { title: "Dates and programmes", body: "Hijri dates, venue, gender/family arrangements, accessibility, organiser, local permissions and emergency plans must be confirmed directly each year." },
      ] },
      { id: "visit", title: "Adab of visiting graves", intro: "The Prophetic permission to visit graves is connected to remembrance of death and dua.", items: [
        { title: "Intention", body: "Visit peacefully to remember the Hereafter, give salam and make dua. Follow cemetery rules, preserve dignity and do not disturb other families." },
        { title: "Dua", body: "Make the transmitted salam for the people of the graves and ask Allah for mercy and well-being. Detailed questions about tawassul and local formulations should follow qualified Sunni teaching." },
        { title: "Practical care", body: "Avoid litter, blocking paths, touching or damaging structures, filming private mourners, unsafe crowding and any activity prohibited by law or cemetery administration." },
      ] },
    ],
    faqs: [
      { q: "Is an Urs date automatically accurate every year?", a: "No. Hijri conversion and organiser schedules vary. A listing should show the source and last verification date." },
      { q: "Is every person called a pir qualified?", a: "No. Verify teachers, beliefs, conduct, financial transparency, safeguarding and accountability." },
      { q: "May women visit graves?", a: "There are details and differing scholarly applications concerning frequency, conduct and circumstances. Follow a trusted local scholar and site rules." },
    ],
    sources: [
      quran("10:62–64", "The friends of Allah are believers with taqwa", "10/62-64"),
      quran("13:28", "Hearts find rest in Allah’s remembrance", "13/28"),
      hadith("Sahih Muslim 976a", "Permission to visit graves and remember the Hereafter", "https://sunnah.com/muslim:976a"),
      hadith("Dawat-e-Islami", "A biographical example and annual Urs reference", "https://www.dawateislami.net/blog/who-was-sultan-ul-hind"),
    ],
    reviewNote: "Urs practice and wording can be disputed. NOOR states an Ahle Sunnat devotional framing, labels custom clearly and does not declare attendance obligatory.",
  },
  {
    slug: "donation",
    kicker: "GIVING · TRANSPARENCY FIRST",
    title: "Donation Box",
    summary: "A safe category-based giving guide for food, education, healthcare, masjids, water, emergencies, orphans, institutes and general Sadaqah—with separate rules for Zakat and transparent verification.",
    foundation: {
      arabic: "مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ",
      translation: "The example of those who spend their wealth in Allah’s cause is like a grain that grows seven ears, each bearing a hundred grains.",
      reference: "Surah al-Baqarah 2:261",
      href: "https://quran.com/2/261",
    },
    atAGlance: ["Zakat and Sadaqah kept separate", "Verified organisation identity", "Clear fees and restricted funds", "Receipts and impact reporting"],
    chapters: [
      { id: "categories", title: "Giving categories", intro: "Choose a cause, then check whether the organisation can legally and ethically deliver it.", items: [
        { title: "Immediate relief", body: "Food, clean water, shelter, medical treatment and disaster relief need rapid but verified partners, beneficiary dignity and no exploitative images." },
        { title: "Long-term support", body: "Education, livelihoods, disability support, orphan care and debt relief should publish selection criteria, duration and safeguarding." },
        { title: "Religious institutions", body: "Masjid, madrasa, Qur’an teaching and scholar support may receive Sadaqah. Zakat eligibility and transfer structure must be checked separately." },
        { title: "Local and international", body: "Show registration country, currency, exchange costs, sanctions/compliance limitations, delivery partner and expected timeline." },
      ] },
      { id: "verify", title: "Verify before paying", intro: "Emotion is not evidence that a campaign is genuine.", items: [
        { title: "Organisation", body: "Check legal registration, trustees, bank-account name, physical contact, recent reports, safeguarding and complaint route." },
        { title: "Campaign", body: "Confirm target, deadline, beneficiary verification, what happens to excess funds, refund policy and whether the appeal uses restricted funds." },
        { title: "Fees", body: "Display payment fees, platform fees, Gift Aid or tax treatment, and the amount expected to reach the cause." },
        { title: "Security", body: "Use a PCI-compliant payment provider, never collect card data directly, require secure administrator accounts and issue a tamper-resistant receipt." },
      ] },
      { id: "zakat", title: "Zakat, Sadaqah and intention", intro: "The giver should know what obligation or voluntary gift is being transferred.", items: [
        { title: "Zakat", body: "Use only an organisation with a clear Zakat policy and eligible recipients. State whether the charity acts as agent and how administration is funded." },
        { title: "Sadaqah", body: "Voluntary charity has wider permissible uses. Make the intention before or at payment and select whether the gift is restricted to one cause." },
        { title: "Privacy", body: "Anonymous giving should be available. Donor names, amounts and recurring history are sensitive and should not appear publicly by default." },
      ] },
    ],
    faqs: [
      { q: "Are payments active on NOOR now?", a: "No. The educational and verification flow is ready, but payments should remain disabled until a verified organisation and secure provider are connected." },
      { q: "Can one payment be partly Zakat and partly Sadaqah?", a: "Use separate allocations and receipts so the organisation can apply each amount according to its rules." },
      { q: "Should a charity show beneficiary photos?", a: "Only with informed consent, safeguarding and dignity. Need can be demonstrated without exposing a child, patient or family." },
    ],
    sources: [
      quran("2:261", "The multiplied reward of giving", "2/261"),
      quran("2:267", "Give from good earnings", "2/267"),
      quran("9:60", "Defined Zakat recipients", "9/60"),
      hadith("Sahih al-Bukhari 1419", "Charity, even a small amount, and good speech", "https://sunnah.com/bukhari:1413"),
    ],
    reviewNote: "No organisation is endorsed by this guide. Real donations require legal, financial, safeguarding, Zakat-policy and payment-security verification.",
  },
  {
    slug: "matrimony",
    kicker: "FAMILY · NIKAH WITH DIGNITY",
    title: "Islamic Matrimony",
    summary: "A privacy-first path from intention and compatibility to family involvement, consent, proposal, due diligence, istikhara, mahr, nikah and healthy married life—with strong safety boundaries.",
    foundation: {
      arabic: "وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا",
      translation: "Among His signs is that He created spouses for you from among yourselves so that you may find tranquillity in them, and He placed affection and mercy between you.",
      reference: "Surah ar-Rum 30:21",
      href: "https://quran.com/30/21",
    },
    atAGlance: ["Free consent is essential", "Mahr belongs to the bride", "Privacy by default", "Identity, safety and family checks"],
    chapters: [
      { id: "prepare", title: "Prepare before searching", intro: "Marriage is a covenant and shared life, not a profile-shopping exercise.", items: [
        { title: "Intention and readiness", body: "Consider faith practice, emotional maturity, lawful income plan, health, family expectations, conflict skills and willingness to fulfil rights." },
        { title: "Criteria", body: "Define essentials and preferences separately: religion and character, location, education, work, children, living arrangement, language, health needs and family responsibilities." },
        { title: "Support", body: "Involve a wali/guardian and trusted family early according to your fiqh and circumstances. A survivor or convert without safe family needs a qualified community advocate, not isolation." },
      ] },
      { id: "process", title: "A safe introduction process", intro: "Serious, time-bounded and accountable communication protects both parties.", items: [
        { title: "Identity and status", body: "Verify legal identity, age, current marital status, location and contact through secure moderation. Never publish identity documents or a home address." },
        { title: "Questions", body: "Discuss prayer, creed and practice, character, work and debt, prior marriage and children, health relevant to shared life, gender roles, living plans and dispute resolution." },
        { title: "Meetings", body: "Meet lawfully with appropriate family/guardian involvement, in a safe setting, without secret intimacy. Preserve the right to decline without pressure." },
        { title: "Due diligence", body: "Seek references with consent, verify claims, observe behaviour over time and use qualified premarital counselling. Istikhara accompanies thoughtful investigation; it does not replace it." },
      ] },
      { id: "nikah", title: "Consent, mahr and nikah", intro: "Religious validity and civil protection should both be planned.", items: [
        { title: "Consent", body: "The Prophet ﷺ required a woman’s permission. Coercion, threats, emotional blackmail or hiding essential facts contradict a sound process." },
        { title: "Mahr", body: "Mahr is the bride’s right. Record its amount, type and whether immediate or deferred, and keep it realistic and enforceable." },
        { title: "Contract and witnesses", body: "The Hanafi school has detailed conditions concerning offer, acceptance, witnesses and guardianship. Use a qualified officiant and register the marriage civilly where available." },
        { title: "After nikah", body: "Agree on maintenance, housing, privacy, work/study, in-laws, children and conflict support. Abuse is never made acceptable by patience slogans; seek safety and professional help." },
      ] },
      { id: "safety", title: "Platform safety", intro: "A matrimony service holds highly sensitive data and must be built around harm prevention.", items: [
        { title: "Private profiles", body: "Default to initials or controlled visibility, blur or restrict photos, hide exact workplace and location, and let users revoke access." },
        { title: "Moderation", body: "Screen harassment, scams, already-married deception, coercive behaviour and requests for money. Preserve evidence securely and provide blocking and reporting." },
        { title: "Emergency help", body: "The service needs country-specific links for domestic abuse, forced marriage, child protection, police and legal aid; religious advice does not replace emergency protection." },
      ] },
    ],
    faqs: [
      { q: "Can families force a match?", a: "No. Free consent matters. Family advice and wali involvement should protect the person, not erase their decision." },
      { q: "Is istikhara a dream test?", a: "Not necessarily. Pray istikhara, take advice and lawful steps, then proceed with what becomes sound and manageable; a dream is not required." },
      { q: "Will NOOR publish profiles openly?", a: "No. Any future service should use controlled access, identity verification, moderation and deletion tools before accepting real users." },
    ],
    sources: [
      quran("30:21", "Tranquillity, affection and mercy in marriage", "30/21"),
      quran("24:32", "Encouragement to marry the unmarried", "24/32"),
      quran("4:19", "Women may not be inherited or constrained against their will", "4/19"),
      hadith("Sahih al-Bukhari 5136", "A woman’s permission must be sought", "https://sunnah.com/bukhari:5136"),
    ],
    reviewNote: "Marriage law, guardianship, civil registration, previous marriage and safeguarding vary by case and country. Use qualified legal and religious help.",
  },
  {
    slug: "institutes",
    kicker: "DIRECTORY · LEARNING & MADRASAS",
    title: "Islamic Institutes & Madrasas",
    summary: "Find and assess maktabs, madrasas, darul ulooms, Qur’an centres, online academies and adult programmes using curriculum, teacher, safeguarding, fees and accreditation checks.",
    foundation: {
      arabic: "وَقُل رَّبِّ زِدْنِى عِلْمًا",
      translation: "And say, ‘My Lord, increase me in knowledge.’",
      reference: "Surah Taha 20:114",
      href: "https://quran.com/20/114",
    },
    atAGlance: ["City, language and course filters", "Teacher and curriculum details", "Safeguarding status", "Verified contact and admissions"],
    chapters: [
      { id: "types", title: "Types of learning", intro: "Choose the institution that matches the learner’s age, goal and available time.", items: [
        { title: "Maktab and foundational study", body: "Part-time Qur’an reading, tajwid, basic belief, worship and character for children or adult beginners." },
        { title: "Hifz and qira’at", body: "Memorisation and recitation require qualified teachers, realistic schedules, revision systems and strong child wellbeing." },
        { title: "‘Alim / ‘Alimah and specialisation", body: "Long programmes may cover Arabic, Qur’an, hadith, Hanafi fiqh, usul, creed, seerah and logic before advanced ifta, hadith or qira’at specialisation." },
        { title: "Online and short courses", body: "Verify live teaching, assessments, teacher access, recordings policy, time zone, refund terms and whether a certificate actually represents examination." },
      ] },
      { id: "check", title: "Institute verification checklist", intro: "A religious name is not enough to establish quality or safety.", items: [
        { title: "Academic", body: "Published curriculum, entry level, learning outcomes, teacher qualifications, assessment, attendance and progression." },
        { title: "Safeguarding", body: "Background checks where lawful, two-adult rules, safe reporting, designated safeguarding lead, parent communication and clear discipline policy." },
        { title: "Operations", body: "Legal entity, address, leadership, fees, refunds, complaints, accessibility, emergency procedures and audited donation handling." },
        { title: "Environment", body: "Observe prayer, cleanliness, teacher conduct, student workload, bullying response, privacy and whether questions are welcomed respectfully." },
      ] },
      { id: "admissions", title: "Admissions and choosing well", intro: "Visit, ask and compare before committing significant time or money.", items: [
        { title: "Questions to ask", body: "Which madhhab and creed are taught? Who supervises teachers? How are mistakes corrected? What is the safeguarding contact? Can you view a sample lesson and policy?" },
        { title: "For children", body: "Prioritise safety, gentle teaching, manageable homework and communication. Humiliation or physical punishment is a serious red flag." },
        { title: "For adults", body: "Check prerequisites and the difference between learning for personal practice, teaching permission and formal fatwa qualification." },
      ] },
    ],
    faqs: [
      { q: "Does a certificate make someone a scholar?", a: "A certificate only proves what its programme assessed. Depth, teachers, supervised practice and continuing accountability matter." },
      { q: "How will directory listings be verified?", a: "By direct contact, legal identity, public policies, named reviewers and a visible last-checked date—not by paid placement alone." },
      { q: "Can an online madrasa be suitable for children?", a: "Yes, if live-session privacy, parent access, teacher checks, recording rules and safeguarding are robust." },
    ],
    sources: [
      quran("20:114", "The prayer for increased knowledge", "20/114"),
      quran("9:122", "A group should gain understanding to teach others", "9/122"),
      quran("96:1–5", "Read in the name of your Lord", "96/1-5"),
      hadith("Sunan Abi Dawud 3641", "The path of knowledge and heirs of the Prophets", "https://sunnah.com/abudawud:3641"),
    ],
    reviewNote: "Listings are informational, not blanket endorsements. Academic quality, theology, safeguarding and legal status require separate current checks.",
  },
  {
    slug: "jobs",
    kicker: "OPPORTUNITIES · HALAL WORK",
    title: "Jobs & Career",
    summary: "An ethical career hub for teaching, administration, charity, media, technology, halal business and community work—with Qur’anic principles, CV guidance, contract checks and scam prevention.",
    foundation: {
      arabic: "فَإِذَا قُضِيَتِ ٱلصَّلَوٰةُ فَٱنتَشِرُوا۟ فِى ٱلْأَرْضِ وَٱبْتَغُوا۟ مِن فَضْلِ ٱللَّهِ",
      translation: "Once the prayer is over, disperse throughout the land and seek Allah’s bounty, and remember Allah often.",
      reference: "Surah al-Jumu‘ah 62:10",
      href: "https://quran.com/62/10",
    },
    atAGlance: ["Lawful work and honest contracts", "Verified employer identity", "No pay-to-apply scams", "Role, city and remote filters"],
    chapters: [
      { id: "principles", title: "Principles of lawful work", intro: "A job is judged by its work, transactions and the duties it makes a person perform or neglect.", items: [
        { title: "Lawful purpose", body: "Avoid work whose core activity is prohibited or directly assists serious wrongdoing. Mixed organisations and indirect involvement need a specific fiqh assessment." },
        { title: "Honesty and competence", body: "Qur’an 28:26 praises strength and trustworthiness. Present skills truthfully, keep time and confidentiality, and do not take wages for work intentionally left undone." },
        { title: "Prayer and rights", body: "Plan lawful prayer breaks, modesty and family duties professionally. Religious accommodation law differs by country; use respectful requests and legal guidance." },
        { title: "Contracts", body: "Read salary, hours, probation, notice, benefits, intellectual property, confidentiality, non-compete and dispute terms before accepting." },
      ] },
      { id: "search", title: "Searching and applying", intro: "A clear application respects both applicant and employer time.", items: [
        { title: "CV", body: "Use a short evidence-based CV: role target, skills, quantified outcomes, dates, education and relevant service. Remove unnecessary sensitive details." },
        { title: "Cover note", body: "Explain why this organisation and role fit your experience, using two or three concrete examples rather than generic praise." },
        { title: "Interview", body: "Prepare examples, ask about supervision and success measures, disclose necessary constraints at the right stage and never invent experience." },
        { title: "Career development", body: "Combine Islamic studies roles with professional skills such as safeguarding, teaching qualification, finance, design, data, fundraising compliance or technology." },
      ] },
      { id: "safety", title: "Job-board safety", intro: "Religious branding does not eliminate employment scams or poor practice.", items: [
        { title: "Verify employer", body: "Check legal entity, website domain, named contact, physical presence, public accounts and whether the email matches the organisation." },
        { title: "Never pay to apply", body: "Do not send money, gift cards, crypto, banking passwords or one-time codes. Genuine background-check or visa processes should be documented and independently verifiable." },
        { title: "Fair listing", body: "Show salary range where lawful, location, visa status, contract type, hours, closing date, safeguarding requirements and equal-opportunity statement." },
      ] },
    ],
    faqs: [
      { q: "Is every job at a Muslim organisation automatically halal?", a: "No. Assess the actual duties, funding and conduct. Likewise, many lawful beneficial jobs exist outside explicitly Muslim organisations." },
      { q: "Can I omit a gap from my CV?", a: "Do not falsify dates. A brief honest explanation—caregiving, study, health or job search—is safer than a misleading timeline." },
      { q: "Will NOOR guarantee employers?", a: "No. Listings should be verified and reportable, but applicants must still perform checks and obtain legal advice where necessary." },
    ],
    sources: [
      quran("62:10", "Seek Allah’s bounty after prayer", "62/10"),
      quran("28:26", "Strength and trustworthiness", "28/26"),
      quran("4:29", "Lawful trade by mutual consent", "4/29"),
      quran("83:1–3", "Warning against cheating in measure", "83/1-3"),
    ],
    reviewNote: "Career guidance is general. Employment law, visas, finance-sector roles and contract disputes need qualified legal and religious advice.",
  },
  {
    slug: "faqs",
    kicker: "QUESTIONS · START HERE",
    title: "Islamic FAQs",
    summary: "Quick, sourced starting answers across belief, purity, prayer, fasting, Zakat, Hajj, family, work, Naat and online information—with a clear line between general learning and personal fatwa.",
    foundation: {
      arabic: "فَسْـَٔلُوٓا۟ أَهْلَ ٱلذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
      translation: "Ask those who have knowledge if you do not know.",
      reference: "Surah an-Nahl 16:43",
      href: "https://quran.com/16/43",
    },
    atAGlance: ["Answers link to full guides", "Hanafi framing is labelled", "Personal cases go to scholars", "Emergency and legal issues are not delayed"],
    chapters: [
      { id: "belief", title: "Belief and learning", intro: "Start with clear foundations and responsible sources.", items: [
        { title: "What are Islam’s five pillars?", body: "Shahadah, the five daily prayers, Zakat, fasting Ramadan and Hajj for the able. They form the essential framework, while faith and character complete daily life.", href: "/topics/pillars", linkLabel: "Open pillar guide" },
        { title: "What is Tawheed?", body: "Affirming Allah’s absolute oneness and uniqueness, worshipping Him alone, and knowing Him by the perfect Names and Attributes of revelation.", href: "/topics/tawheed", linkLabel: "Open Tawheed guide" },
        { title: "How do I know a hadith is authentic?", body: "Use recognised hadith collections and grading, but remember that legal use also needs context and scholarship. Do not rely on a quote card without a source." },
      ] },
      { id: "worship", title: "Purity and worship", intro: "These answers point to the full practical guides.", items: [
        { title: "What breaks Wudu?", body: "In Hanafi law, common nullifiers include anything exiting the private passages, flowing blood or pus, vomiting a mouthful, deep sleep in certain positions and loss of consciousness. Details matter.", href: "/namaz#purity", linkLabel: "Read the full Wudu chapter" },
        { title: "How many daily prayers?", body: "Five obligatory prayers: Fajr, Dhuhr, ‘Asr, Maghrib and ‘Isha, each inside its prescribed time.", href: "/namaz#times", linkLabel: "See times and rak‘ahs" },
        { title: "Who may postpone a Ramadan fast?", body: "The Qur’an gives concessions for illness and qualifying travel; menstruation, postnatal bleeding, pregnancy, breastfeeding, old age and chronic illness have detailed rulings.", href: "/topics/roza", linkLabel: "Open fasting guide" },
        { title: "How is Zakat calculated?", body: "For cash and similar assets, a common starting formula is net Zakatable wealth × 2.5%, once nisab and the lunar-year conditions are met.", href: "/topics/zakat", linkLabel: "Open Zakat guide" },
      ] },
      { id: "daily", title: "Family and daily life", intro: "Rights and safety take priority over simplistic answers.", items: [
        { title: "Is consent required for marriage?", body: "Yes. The Prophet ﷺ required a woman’s permission. A valid process also addresses mahr, witnesses, guardianship details and civil protection.", href: "/topics/matrimony", linkLabel: "Open matrimony guide" },
        { title: "How do I choose a scholar?", body: "Check teachers, institution, field of expertise, legal method, character, safeguarding and whether the scholar admits limits.", href: "/topics/scholars", linkLabel: "Open scholar guide" },
        { title: "How do I know a job is halal?", body: "Assess the core activity, your exact duties, transactions and whether the job prevents obligations. Complex finance or indirect support roles need a case-specific answer.", href: "/topics/jobs", linkLabel: "Open careers guide" },
      ] },
      { id: "media", title: "Naat, media and verification", intro: "Love and sharing are strengthened by accuracy.", items: [
        { title: "Can NOOR copy lyrics from another site?", body: "No. Full lyrics require public-domain status or permission, plus author, text and theological verification.", href: "/topics/lyrics", linkLabel: "Read lyric policy" },
        { title: "Should I forward a religious message?", body: "Only after checking the verse or hadith, speaker, context and grading. If it harms a person’s reputation or affects law, health or money, pause and ask." },
        { title: "When is an online answer not enough?", body: "Divorce words, inheritance, abuse, medical exemptions, business contracts, court matters and emergency safety require direct qualified help." },
      ] },
    ],
    faqs: [
      { q: "Are these answers final fatwas?", a: "No. They are sourced educational starting points. A fatwa requires the exact facts and a qualified mufti." },
      { q: "Why does NOOR mention the Hanafi school?", a: "Some practical rulings differ among recognised Sunni schools. Labelling the method is more honest than presenting one answer as universal." },
      { q: "What should I do in an emergency?", a: "Contact local emergency, medical, safeguarding or legal services first. Religious consultation can support but must not delay immediate safety." },
    ],
    sources: [
      quran("16:43", "Ask the people of knowledge", "16/43"),
      quran("17:36", "Do not follow what you lack knowledge of", "17/36"),
      hadith("Sunan Abi Dawud 3641", "The virtue and responsibility of knowledge", "https://sunnah.com/abudawud:3641"),
      hadith("Sunan Abi Dawud 3657", "Concealing knowledge when asked", "https://sunnah.com/abudawud:3657"),
    ],
    reviewNote: "FAQ answers are intentionally concise and link to detailed pages. Personal, legal, medical and safety cases must not be handled through static content alone.",
  },
];

export const topics: Topic[] = [...faithTopics, ...knowledgeTopics, ...naatTopics, ...communityTopics];

export const topicMap = new Map(topics.map((topic) => [topic.slug, topic]));
