import type { Metadata } from "next";
import Link from "next/link";
import { HeaderUtilities } from "../site/SiteUtilities";
import PrayerTracker from "./PrayerTracker";
import NamazReadingProgress from "./NamazReadingProgress";
import StepLearningMode from "./StepLearningMode";

export const metadata: Metadata = {
  title: "Namaz & Wudu — Complete Hanafi Prayer Guide",
  description:
    "A structured Sunni Hanafi guide to Wudu, Ghusl, Tayammum, five daily prayers, rakahs, recitations, congregation, travel and missed Salah.",
  alternates: { canonical: "/namaz" },
  openGraph: {
    title: "Namaz & Wudu — Complete Prayer Guide | NOOR",
    description: "Learn purification and Salah step by step with visible Qur’an, hadith and Hanafi references.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Namaz & Wudu — Complete Prayer Guide | NOOR",
    description: "Learn purification and Salah step by step with visible Qur’an, hadith and Hanafi references.",
    images: [],
  },
};

const chapters = [
  ["overview", "Overview"],
  ["purity", "Wudu"],
  ["ghusl", "Ghusl & Tayammum"],
  ["times", "Times & Rak‘ahs"],
  ["method", "How to pray"],
  ["recitations", "Recitations"],
  ["mistakes", "Mistakes & Sajdah Sahw"],
  ["congregation", "Jama‘at & Jumu‘ah"],
  ["special", "Travel, illness & Qada"],
  ["faq", "Questions"],
  ["sources", "Sources"],
];

const wuduSteps = [
  ["01", "Intention and Bismillah", "Intend purification for worship in the heart. Begin with Bismillah. A spoken formula is not required for the intention."],
  ["02", "Wash the hands", "Wash both hands to the wrists three times, passing water between the fingers. Remove anything that blocks water from the skin."],
  ["03", "Clean the mouth", "Rinse the mouth three times. Use a miswak when available; be gentle when fasting."],
  ["04", "Clean the nose", "Draw water gently into the nostrils and clean them three times, using the left hand to remove the water."],
  ["05", "Wash the face", "Wash the complete face three times—from the normal hairline to the chin and from ear to ear. This wash is obligatory."],
  ["06", "Wash the arms", "Wash the right arm and then the left, including the elbows, three times. Ensure rings, watch areas and spaces between fingers are reached."],
  ["07", "Wipe the head and ears", "With fresh wet hands, wipe the head once. In Hanafi law, wiping at least one quarter of the head is obligatory; wiping the whole head once is Sunnah. Wipe the ears."],
  ["08", "Wash the feet", "Wash the right foot and then the left, including the ankles, three times. Pass a finger between the toes and check the heels carefully."],
  ["09", "Finish with testimony", "After Wudu, recite the testimony of faith and ask Allah to make you among those who repent and remain purified."],
];

const prayerTimes = [
  ["Fajr", "True dawn", "Sunrise", "Pray after true dawn begins and finish before the sun starts rising."],
  ["Dhuhr", "After solar noon", "Beginning of Asr", "Begins after the sun passes its highest point. Hanafi Asr begins later than the standard shadow method."],
  ["Asr", "Hanafi: double-shadow time", "Sunset", "Do not deliberately delay until the sun becomes weak or yellow without a valid reason."],
  ["Maghrib", "Immediately after sunset", "Twilight disappears", "Begins when the sun has fully set. It is generally offered promptly."],
  ["Isha", "Twilight disappears", "True dawn", "May be offered until Fajr begins; avoid habitual delay beyond the preferred part of the night."],
];

const rakahRows = [
  ["Fajr", "2 Sunnah Mu’akkadah", "2 Fard", "—", "4"],
  ["Dhuhr", "4 Sunnah Mu’akkadah", "4 Fard", "2 Sunnah Mu’akkadah + 2 optional Nafl", "12"],
  ["Asr", "4 Sunnah Ghair Mu’akkadah", "4 Fard", "—", "8"],
  ["Maghrib", "—", "3 Fard", "2 Sunnah Mu’akkadah + 2 optional Nafl", "7"],
  ["Isha", "4 Sunnah Ghair Mu’akkadah", "4 Fard", "2 Sunnah Mu’akkadah + 2 Nafl + 3 Witr Wajib + 2 Nafl", "17"],
];

const salahSteps = [
  ["01", "Prepare", "Confirm the prayer time. Your body, clothing and place must be clean; Wudu must be valid; the required ‘awrah must be covered; face the Qibla."],
  ["02", "Make Niyyah", "Know in your heart which prayer you are offering and whether it is Fard, Wajib, Sunnah or Nafl. Intention is an act of the heart."],
  ["03", "Takbir-e-Tahrimah", "Stand upright if able, raise the hands according to the Hanafi method and say “Allahu Akbar.” Fold the hands and keep your gaze at the place of prostration."],
  ["04", "Qiyam and recitation", "Read Thana, seek Allah’s protection, say Bismillah, recite Surah al-Fatihah and then another Surah or verses where required."],
  ["05", "Ruku‘", "Say Allahu Akbar and bow until the back is settled. Hold the knees and say “Subhana Rabbiyal ‘Azim” at least three times."],
  ["06", "Qawmah", "Rise fully from Ruku‘. The imam or person praying alone says “Sami‘Allahu liman hamidah”; then say “Rabbana lakal hamd.” Pause upright."],
  ["07", "First Sajdah", "Say Allahu Akbar and prostrate with forehead, nose, hands, knees and toes placed correctly. Say “Subhana Rabbiyal A‘la” at least three times."],
  ["08", "Jalsah and second Sajdah", "Sit calmly between the two prostrations, then perform the second Sajdah in the same way. Every Rak‘ah contains two prostrations."],
  ["09", "Next Rak‘ah", "Stand for the next Rak‘ah and recite al-Fatihah plus another Surah where required. Complete Ruku‘, Qawmah and both Sajdahs."],
  ["10", "Qa‘dah", "After two Rak‘ahs sit and read Tashahhud. In a three- or four-Rak‘ah prayer, stand after Tashahhud; in the final sitting also read Darood Ibrahim and a Masnun dua."],
  ["11", "Salam", "Complete the prayer by turning the face to the right and then the left, saying “Assalamu ‘alaykum wa rahmatullah” each time."],
];

const phraseCards = [
  {
    title: "Opening praise — Thana",
    when: "After the opening Takbir",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
    roman: "Subhanakallāhumma wa bihamdika wa tabārakasmuka wa ta‘ālā jadduka wa lā ilāha ghayruk.",
    meaning: "Glory and praise belong to You, O Allah. Blessed is Your name, exalted is Your majesty, and none is worthy of worship besides You.",
  },
  {
    title: "Surah al-Fatihah",
    when: "Recited in every Rak‘ah by a person praying alone; follower rulings differ in Hanafi congregation",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    roman: "Bismillāhir-Rahmānir-Rahīm. Alhamdu lillāhi Rabbil-‘ālamīn. Ar-Rahmānir-Rahīm. Māliki yawmid-dīn. Iyyāka na‘budu wa iyyāka nasta‘īn. Ihdinas-sirātal-mustaqīm. Sirātalladhīna an‘amta ‘alayhim ghayril-maghdūbi ‘alayhim wa lad-dāllīn.",
    meaning: "Praise belongs to Allah, Lord of all worlds. We worship Him alone, seek His help and ask to be guided on the straight path.",
  },
  {
    title: "Ruku‘ and Sajdah",
    when: "In bowing and prostration",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ\nسُبْحَانَ رَبِّيَ الْأَعْلَى",
    roman: "Subhāna Rabbiyal-‘Azīm — Subhāna Rabbiyal-A‘lā.",
    meaning: "Glory belongs to my Lord, the Magnificent — Glory belongs to my Lord, the Most High. Read each at least three times.",
  },
  {
    title: "Rising from Ruku‘",
    when: "While rising and after standing straight",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا لَكَ الْحَمْدُ",
    roman: "Sami‘allāhu liman hamidah. Rabbanā lakal-hamd.",
    meaning: "Allah hears the one who praises Him. Our Lord, all praise belongs to You.",
  },
  {
    title: "Tashahhud",
    when: "Every sitting after two Rak‘ahs and the final sitting",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    roman: "At-tahiyyātu lillāhi was-salawātu wat-tayyibāt. As-salāmu ‘alayka ayyuhan-nabiyyu wa rahmatullāhi wa barakātuh. As-salāmu ‘alaynā wa ‘alā ‘ibādillāhis-sālihīn. Ashhadu al-lā ilāha illallāhu wa ashhadu anna Muhammadan ‘abduhu wa rasūluh.",
    meaning: "All greetings, prayers and pure words belong to Allah. Peace be upon the Prophet, upon us and upon Allah’s righteous servants. We testify to faith and prophethood.",
  },
  {
    title: "Darood Ibrahim",
    when: "In the final sitting after Tashahhud",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    roman: "Allāhumma salli ‘alā Muhammadin wa ‘alā āli Muhammad, kamā sallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Hamīdum Majīd. Allāhumma bārik ‘alā Muhammadin wa ‘alā āli Muhammad, kamā bārakta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Hamīdum Majīd.",
    meaning: "O Allah, send blessings and favour upon Sayyiduna Muhammad ﷺ and his family, as You blessed Sayyiduna Ibrahim and his family. You are Praiseworthy and Glorious.",
  },
  {
    title: "A dua before Salam",
    when: "After Darood in the final sitting",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    roman: "Rabbanā ātinā fid-dunyā hasanatan wa fil-ākhirati hasanatan wa qinā ‘adhāban-nār.",
    meaning: "Our Lord, grant us good in this world and the Hereafter, and protect us from the punishment of the Fire.",
  },
];

const faq = [
  ["Does intention have to be spoken?", "No. Niyyah is the settled intention of the heart. Quiet words may help a learner focus, but they are not a condition for a valid intention."],
  ["Does touching a spouse break Wudu?", "In the Hanafi school, ordinary skin contact by itself does not invalidate Wudu. Other schools differ, so follow reliable guidance for your madhhab."],
  ["What if I am unsure whether Wudu broke?", "Certainty is not removed by doubt. If you were certain of Wudu and only doubt whether it broke, treat it as continuing. Persistent intrusive doubts should be ignored and discussed with a qualified scholar or health professional when needed."],
  ["What if I miss a Fard prayer?", "Repent for an avoidable delay and make up the missed Fard prayer promptly. Hanafi details about order, prohibited times and long backlogs require personal guidance."],
  ["Can I pray sitting on a chair?", "Stand if genuinely able. If standing, bowing or prostrating causes real inability or harmful pain, concessions apply. Because capacity differs, ask a qualified scholar for the correct posture in your condition."],
  ["Are there differences for women?", "The core obligations and sequence are shared. Hanafi manuals describe some posture and covering details differently for women. Learn those details from a qualified female teacher or trusted Hanafi scholar."],
  ["Can this page replace learning from a teacher?", "No. It is a structured study and revision guide. Correct Qur’an pronunciation, practical posture and case-specific rulings should be learned from qualified teachers."],
];

function SectionHead({ number, label, title, copy, source }: { number: string; label: string; title: string; copy: string; source: string }) {
  return (
    <div className="namaz-section-head">
      <span>{number}</span>
      <div><p>{label}</p><h2>{title}</h2><div>{copy}</div><small className="namaz-source-basis">Basis · {source}</small></div>
    </div>
  );
}

export default function NamazPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Namaz & Wudu — Complete Hanafi Prayer Guide",
    description: "A structured guide to purification, daily prayer, recitations, common mistakes and visible sources.",
    mainEntityOfPage: "https://noor-daily-muslim.vercel.app/namaz",
    author: { "@type": "Organization", name: "NOOR Daily Muslim" },
    publisher: { "@type": "Organization", name: "NOOR Daily Muslim", logo: { "@type": "ImageObject", url: "https://noor-daily-muslim.vercel.app/favicon.svg" } },
    dateModified: "2026-08-30",
    inLanguage: "en",
  };
  return (
    <main className="namaz-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <NamazReadingProgress />
      <header className="namaz-topbar">
        <Link className="brand" href="/" aria-label="Back to NOOR home"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
        <nav aria-label="Prayer guide navigation"><Link href="/namaz/wudu">Wudu</Link><a href="#times">Prayer table</a><Link href="/namaz/salah">How to pray</Link><Link href="/namaz/recitations">Recitations</Link></nav>
        <aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="namaz-home-link" href="/">← Back to NOOR</Link></aside>
      </header>

      <section className="namaz-hero" id="overview">
        <div className="namaz-hero-copy">
          <p className="eyebrow"><span/> COMPLETE WORSHIP GUIDE · HANAFI</p>
          <h1>Wudu & <em>Namaz</em></h1>
          <p>A complete, calm learning path—from purification to Salam—with the five daily prayers, Arabic recitations, common mistakes and visible sources.</p>
          <div className="namaz-hero-actions"><Link href="/namaz/wudu">Start with Wudu</Link><Link href="/namaz/salah">Open prayer steps</Link></div>
          <div className="guide-status"><i>✓</i><span><strong>Reference-led guide</strong>Qur’an, hadith and recognized Sunni Hanafi material</span><Link href="/editorial-policy#corrections">Report a correction</Link></div>
        </div>
        <div className="namaz-hero-card">
          <span className="hero-card-kicker">THE FIVE DAILY PRAYERS</span>
          {[["01","Fajr","2 Fard"],["02","Dhuhr","4 Fard"],["03","Asr","4 Fard"],["04","Maghrib","3 Fard"],["05","Isha","4 Fard"]].map((item) => <div key={item[1]}><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small></div>)}
          <p>Prayer is prescribed for believers at appointed times. <Link href="/quran?surah=4&ayah=103">Qur’an 4:103 →</Link></p>
        </div>
      </section>

      <div className="namaz-chapter-bar" aria-label="Guide chapters">{chapters.map(([id, name]) => <a href={`#${id}`} key={id}>{name}</a>)}</div>

      <section className="namaz-quick-start" aria-label="Prayer guide quick start">
        <div><span>01</span><strong>Purify</strong><Link href="/namaz/wudu">Learn Wudu</Link></div>
        <div><span>02</span><strong>Prepare</strong><a href="#times">Check time &amp; Rak‘ahs</a></div>
        <div><span>03</span><strong>Pray</strong><Link href="/namaz/salah">Use step-by-step mode</Link></div>
        <div><span>04</span><strong>Review</strong><Link href="/namaz/mistakes">Fix common mistakes</Link></div>
      </section>

      <section className="namaz-guide-shell">
        <aside className="namaz-aside">
          <p>ON THIS PAGE</p>
          {chapters.map(([id, name], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2,"0")}</span>{name}</a>)}
          <div><strong>Important</strong><p>This guide follows common Sunni Hanafi rulings. Details can change with personal circumstances.</p><a href="#sources">Review the sources →</a></div>
        </aside>

        <article className="namaz-content">
          <section className="namaz-section overview-section">
            <SectionHead number="01" label="FOUNDATIONS" title="Before you begin" copy="Salah joins intention, purity, time, direction, recitation and physical worship. Learn the foundations before memorizing movements." source="Qur’an 2:238 and 4:103" />
            <div className="evidence-card"><span>QUR’ANIC FOUNDATION</span><blockquote lang="ar" dir="rtl">حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ</blockquote><h3>Guard the prayers and stand before Allah with devotion.</h3><Link href="/quran?surah=2&ayah=238">Read Qur’an 2:238 with context →</Link></div>
            <div className="condition-grid">
              {[
                ["Taharah", "Purity", "Body, clothes and place are clean; ritual purity is valid."],
                ["Satr", "Covering", "Cover the required ‘awrah with non-transparent clothing."],
                ["Qibla", "Direction", "Face the Ka‘bah as accurately as reasonably possible."],
                ["Waqt", "Time", "The specific prayer time must have begun."],
                ["Niyyah", "Intention", "Know in your heart which prayer you are offering."],
                ["Takbir", "Entry", "Enter Salah with Takbir-e-Tahrimah while standing if able."],
              ].map(([key,title,copy]) => <div key={key}><span>{key}</span><h3>{title}</h3><p>{copy}</p></div>)}
            </div>
            <PrayerTracker />
            <div className="fiqh-note"><strong>Know the labels</strong><p><b>Fard</b> is obligatory. <b>Wajib</b> is binding in Hanafi law. <b>Sunnah Mu’akkadah</b> is an emphasized prophetic practice. <b>Sunnah Ghair Mu’akkadah</b> is non-emphasized Sunnah. <b>Nafl</b> is voluntary.</p></div>
          </section>

          <section className="namaz-section" id="purity">
            <SectionHead number="02" label="RITUAL PURITY" title="Wudu, step by step" copy="Qur’an 5:6 names the core washes of ablution. The Sunnah teaches a careful, ordered method without wasting water." source="Qur’an 5:6 · Bukhari and Muslim" />
            <div className="wudu-reference"><div><span>THE FOUR FARD ACTS · HANAFI</span><h3>Face · Arms · Head · Feet</h3><p>Wash the complete face, wash both arms including elbows, wipe at least one quarter of the head, and wash both feet including ankles.</p></div><Link href="/quran?surah=5&ayah=6">Qur’an 5:6 →</Link></div>
            <StepLearningMode label="Wudu" storageKey="noor-namaz-wudu-step-v1" steps={wuduSteps} />
            <div className="two-column-cards">
              <div className="rule-card positive"><span>SUNNAH & CARE</span><h3>Complete Wudu well</h3><ul><li>Follow the order without long gaps.</li><li>Wash the limbs three times where Sunnah.</li><li>Begin from the right.</li><li>Rub gently and ensure water reaches dry folds.</li><li>Use only the water needed.</li><li>Do not talk unnecessarily during Wudu.</li></ul></div>
              <div className="rule-card warning"><span>WATER BARRIERS</span><h3>Check before washing</h3><ul><li>Nail polish and impermeable coatings.</li><li>Paint, glue or wax that prevents water reaching skin.</li><li>Tight rings or jewellery hiding dry skin.</li><li>Dry heels, elbows, beard area or skin folds.</li><li>Water-resistant makeup where it forms a barrier.</li></ul></div>
            </div>
            <div className="breakers-panel"><div><p>COMMON HANAFI RULINGS</p><h3>What invalidates Wudu?</h3></div><ul><li>Anything exiting from the front or back passage.</li><li>Flowing blood, pus or discharge that moves beyond its wound.</li><li>A mouthful of vomit.</li><li>Deep sleep while lying, reclining or without a firmly seated posture.</li><li>Fainting, intoxication or loss of awareness.</li><li>Audible laughter by an adult within a prayer containing Ruku‘ and Sajdah.</li></ul></div>
            <div className="difference-note"><span>FIQH DIFFERENCES</span><p>Some Wudu invalidators differ across the four Sunni schools—for example skin contact, bleeding and laughter. This page states common Hanafi rulings; do not mix rules casually.</p></div>
          </section>

          <section className="namaz-section" id="ghusl">
            <SectionHead number="03" label="FULL & ALTERNATIVE PURIFICATION" title="Ghusl and Tayammum" copy="When major ritual impurity applies, Wudu alone is not enough. When water is genuinely unavailable or harmful, the Shari‘ah provides Tayammum." source="Qur’an 4:43 and 5:6 · Hanafi manuals" />
            <div className="ghusl-grid">
              <article><span>GHUSL · HANAFI</span><h3>Three obligatory acts</h3><ol><li>Rinse the entire mouth thoroughly.</li><li>Rinse the soft part of the nose.</li><li>Wash the entire body so no washable area remains dry.</li></ol><p>Begin with intention and Bismillah, wash impurities, perform Wudu, then pour water over the head and whole body. Ensure roots of hair, navel, folds and skin under jewellery are reached.</p></article>
              <article><span>TAYAMMUM</span><h3>When water cannot be used</h3><ol><li>Make intention for purification.</li><li>Use clean earth or an earth-derived surface.</li><li>Strike/place hands, remove excess dust and wipe the complete face.</li><li>Repeat and wipe both arms including elbows in the Hanafi method.</li></ol><p>Tayammum ends when its excuse ends or when something that breaks Wudu occurs. Medical harm and access questions require reliable advice.</p></article>
            </div>
            <div className="sensitive-note"><strong>When Ghusl becomes required</strong><p>Major ritual impurity after marital relations or sexual discharge, and the completion of menstruation or post-natal bleeding, require Ghusl before Salah. Detailed cases should be learned privately from a qualified scholar.</p></div>
          </section>

          <section className="namaz-section" id="times">
            <SectionHead number="04" label="DAILY SCHEDULE" title="Prayer times and Rak‘ahs" copy="Prayer times follow the sun and change by date and location. Use a verified local timetable or mosque and understand the time windows below." source="Qur’an 4:103 · Karachi calculation method" />
            <div className="time-warning"><strong>NOOR now calculates today’s timings from your location.</strong><p>Calculation methods and local mosque practice can differ, so confirm with your trusted local timetable when exact observance matters.</p></div>
            <div className="time-table"><div className="time-row time-head"><span>Prayer</span><span>Begins</span><span>Ends</span><span>Guidance</span></div>{prayerTimes.map((row) => <div className="time-row" key={row[0]}>{row.map((cell,index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>)}</div>
            <div className="prohibited-times"><span>THREE VERY RESTRICTED PERIODS</span><p>Do not begin ordinary Salah while the sun is rising, at the exact zenith, or while it is setting. Voluntary prayer also has restrictions after Fajr until sunrise and after Asr until sunset. Exceptional prayers have separate rulings.</p></div>
            <h3 className="subheading">Daily Rak‘ah planner · Hanafi</h3>
            <div className="rakah-table"><div className="rakah-row rakah-head"><span>Prayer</span><span>Before Fard</span><span>Fard</span><span>After Fard</span><span>Total shown</span></div>{rakahRows.map((row) => <div className="rakah-row" key={row[0]}>{row.map((cell,index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</div>)}</div>
            <p className="table-footnote">“Total shown” includes the commonly taught optional Nafl listed here. The five daily Fard prayers total 17 Rak‘ahs. Witr is Wajib in the Hanafi school.</p>
          </section>

          <section className="namaz-section" id="method">
            <SectionHead number="05" label="COMPLETE SEQUENCE" title="How to perform Salah" copy="The Prophet ﷺ instructed Muslims to pray as they saw him pray. Move calmly, allow every posture to settle and do not race through the prayer." source="Sahih al-Bukhari · Hanafi method" />
            <div className="hadith-strip"><span>PROPHETIC METHOD</span><p>“Pray as you have seen me praying.”</p><strong>Sahih al-Bukhari 631</strong></div>
            <StepLearningMode label="Salah" storageKey="noor-namaz-salah-step-v1" steps={salahSteps} />
            <div className="rakats-explainer">
              <article><span>2 RAK‘AHS</span><p>After the second Sajdah, sit for Tashahhud, Darood and dua, then finish with Salam.</p></article>
              <article><span>3 RAK‘AHS</span><p>After Tashahhud in Rak‘ah two, stand. In the third Fard Rak‘ah recite al-Fatihah, then complete the final sitting.</p></article>
              <article><span>4 RAK‘AHS</span><p>After the first sitting, stand for Rak‘ahs three and four. Complete the final sitting after the fourth.</p></article>
            </div>
            <div className="difference-note"><span>FOLLOWING AN IMAM</span><p>Join the Imam’s movements without going ahead. In the Hanafi school, a follower remains silent during the Imam’s Qur’an recitation. If you join late, complete missed Rak‘ahs after the Imam’s Salam according to the rules of a <i>masbuq</i>.</p></div>
          </section>

          <section className="namaz-section" id="recitations">
            <SectionHead number="06" label="ARABIC, ROMAN & MEANING" title="Essential recitations" copy="Open each card to revise the Arabic, a reading aid and a concise meaning. Transliteration helps memory but cannot replace correct pronunciation from a teacher." source="Qur’an text · Hadith-reported supplications" />
            <div className="recitation-list">{phraseCards.map((phrase,index) => <details open={index === 0} key={phrase.title}><summary><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{phrase.title}</strong><small>{phrase.when}</small></div><i>+</i></summary><div className="recitation-body"><p className="arabic" lang="ar" dir="rtl">{phrase.arabic}</p><p className="roman"><span>ROMAN READING AID</span>{phrase.roman}</p><p className="meaning"><span>CONCISE MEANING</span>{phrase.meaning}</p></div></details>)}</div>
            <div className="qunut-card"><span>WITR WAJIB · HANAFI</span><h3>Dua-e-Qunoot</h3><p>In the third Rak‘ah of Witr, after al-Fatihah and another Surah, say Takbir with the Hanafi hand movement and read Dua-e-Qunoot before Ruku‘. Accurate Arabic matters, so revise this guide and learn pronunciation directly from a qualified teacher.</p><strong className="contained-reference">Reference: Method of Salah — Hanafi</strong></div>
          </section>

          <section className="namaz-section" id="mistakes">
            <SectionHead number="07" label="CORRECTION & VALIDITY" title="Mistakes, invalidators and Sajdah Sahw" copy="Not every mistake has the same ruling. Missing a Fard, forgetting a Wajib and leaving a Sunnah are treated differently in Hanafi law." source="Recognized Hanafi fiqh manuals" />
            <div className="mistake-grid">
              <article><span>FARD OMITTED</span><h3>Prayer is not completed</h3><p>If an obligatory element such as Ruku‘ or a Sajdah is genuinely omitted and not corrected within its rules, Sajdah Sahw alone cannot replace it.</p></article>
              <article><span>WAJIB FORGOTTEN</span><h3>Sajdah Sahw may be due</h3><p>Forgetting a Wajib, delaying a Fard or certain sequence errors can require two prostrations of forgetfulness. Exact cases matter.</p></article>
              <article><span>SUNNAH MISSED</span><h3>Prayer generally remains valid</h3><p>Leaving Sunnah diminishes completeness and reward; persistent abandonment of emphasized Sunnah is serious.</p></article>
            </div>
            <div className="sahw-method"><div><span>COMMON HANAFI METHOD</span><h3>How Sajdah Sahw is performed</h3></div><ol><li>In the final sitting, read Tashahhud.</li><li>Give one Salam to the right.</li><li>Perform two Sajdahs with the normal Takbirs.</li><li>Sit again and read Tashahhud, Darood and dua.</li><li>Finish with both Salams.</li></ol><p>Do not apply this automatically to every doubt. Ask a scholar when you are unsure what was missed.</p></div>
            <div className="invalidators-list"><h3>Actions that can invalidate Salah</h3><div>{["Wudu breaking during prayer","Speaking ordinary words","Eating or drinking","Turning the chest away from Qibla","Substantial exposure of required ‘awrah","Excessive unrelated movement","Omitting an obligatory posture","Laughing audibly in prayer"].map((item) => <span key={item}>× {item}</span>)}</div></div>
          </section>

          <section className="namaz-section" id="congregation">
            <SectionHead number="08" label="PRAYING TOGETHER" title="Jama‘at, Imam and Jumu‘ah" copy="Congregational prayer carries great virtue and teaches unity, order and care for others. Follow the Imam and preserve the rows." source="Qur’an 62:9 · Bukhari and Muslim" />
            <div className="congregation-cards">
              <article><span>BEFORE JAMA‘AT</span><ul><li>Arrive with Wudu and calmness.</li><li>Silence your phone and avoid disturbing others.</li><li>Straighten the row and close reasonable gaps.</li><li>Do not rush dangerously when Iqamah begins.</li></ul></article>
              <article><span>WITH THE IMAM</span><ul><li>Make your own intention to follow.</li><li>Do not precede the Imam’s Takbir or movement.</li><li>Follow each posture after the Imam moves.</li><li>Learn latecomer rules before completing missed Rak‘ahs.</li></ul></article>
            </div>
            <div className="jumuah-card"><div><p>FRIDAY PRAYER</p><h3>Jumu‘ah replaces Dhuhr for those upon whom it is obligatory.</h3><span>Common Hanafi arrangement: 4 Sunnah before, 2 Fard with the Imam after the Khutbah, 4 Sunnah, 2 Sunnah and optional Nafl afterward. Conditions and exemptions require local guidance.</span></div><strong>14<small>commonly taught Rak‘ahs including Nafl</small></strong></div>
            <div className="special-prayer-links"><span>Also learn separately</span><a href="#special">Eid prayer</a><a href="#special">Janazah</a><a href="#special">Tarawih</a><a href="#special">Traveller’s prayer</a></div>
          </section>

          <section className="namaz-section" id="special">
            <SectionHead number="09" label="SPECIAL CIRCUMSTANCES" title="Travel, illness, Qada and special prayers" copy="Islamic law provides structured concessions, not guesswork. Use this overview, then obtain case-specific guidance." source="Qur’an 4:101 · Hanafi fiqh manuals" />
            <div className="special-grid">
              <article><span>TRAVEL · QASR</span><h3>Shortening Fard prayer</h3><p>A Hanafi Shari‘ traveller shortens the four-Rak‘ah Fard of Dhuhr, Asr and Isha to two. Fajr remains two and Maghrib remains three. Common Hanafi guidance uses a journey of roughly 92 km and an intended stay shorter than 15 days; verify your route and intention.</p><strong className="contained-reference">Reference: The Traveller’s Salah — Hanafi</strong></article>
              <article><span>ILLNESS & DISABILITY</span><h3>Pray according to ability</h3><p>Stand when able. If genuinely unable, pray sitting; if Ruku‘ or Sajdah cannot be performed, use the recognized gestures. Do not use a chair merely for convenience, and do not force a harmful posture.</p></article>
              <article><span>MISSED PRAYER · QADA</span><h3>Make up Fard obligations</h3><p>Record and make up missed Fard prayers and Witr according to Hanafi rules. Repent for deliberate neglect. Long backlogs, prayer order and prohibited times need a personal plan from a scholar.</p></article>
              <article><span>TARAWIH</span><h3>Ramadan night prayer</h3><p>In the Hanafi school, twenty Rak‘ahs of Tarawih are emphasized Sunnah in Ramadan, normally offered after Isha and before or after Witr in congregation.</p></article>
              <article><span>EID SALAH</span><h3>Two Rak‘ahs with extra Takbirs</h3><p>Eid prayer is Wajib for those upon whom Jumu‘ah is obligatory in Hanafi law. Its extra Takbirs and sequence should be learned before Eid from the Imam.</p></article>
              <article><span>JANAZAH</span><h3>A communal obligation</h3><p>Salat al-Janazah is Fard Kifayah and consists of standing, four Takbirs, praise, Darood, dua for the deceased and Salam—without Ruku‘ or Sajdah.</p></article>
            </div>
          </section>

          <section className="namaz-section" id="faq">
            <SectionHead number="10" label="COMMON QUESTIONS" title="Clear answers, with boundaries" copy="These answers cover common learning questions. Personal, medical and doubtful cases need a qualified scholar." source="Educational summary · scholar review pending" />
            <div className="namaz-faq">{faq.map(([q,a],index) => <details key={q}><summary><span>{String(index + 1).padStart(2,"0")}</span><strong>{q}</strong><i>+</i></summary><p>{a}</p></details>)}</div>
          </section>

          <section className="namaz-section sources-section" id="sources">
            <SectionHead number="11" label="VISIBLE REFERENCES" title="Sources used for this guide" copy="The wording is summarized for learners. Quran references open inside NOOR; collection and manual names remain visible for verification." source="Primary texts and named Sunni Hanafi manuals" />
            <div className="source-list">
              <Link href="/quran?surah=5&ayah=6"><span>QUR’AN · 5:6</span><strong>Wudu, Ghusl and Tayammum</strong><i>→</i></Link>
              <Link href="/quran?surah=4&ayah=103"><span>QUR’AN · 4:103</span><strong>Prayer at appointed times</strong><i>→</i></Link>
              <Link href="/quran?surah=2&ayah=238"><span>QUR’AN · 2:238</span><strong>Guarding the prayers</strong><i>→</i></Link>
              <Link href="/quran?surah=4&ayah=101"><span>QUR’AN · 4:101–103</span><strong>Prayer during travel</strong><i>→</i></Link>
              <div><span>SAHIH AL-BUKHARI · 135</span><strong>Purity before prayer</strong><i>IN NOOR</i></div>
              <div><span>SAHIH AL-BUKHARI · 164</span><strong>Prophetic Wudu report</strong><i>IN NOOR</i></div>
              <div><span>SAHIH AL-BUKHARI · 631</span><strong>Learn the prophetic prayer</strong><i>IN NOOR</i></div>
              <div><span>DAR AL-IFTA EGYPT</span><strong>How to perform Wudu</strong><i>REFERENCE</i></div>
              <div><span>DAR AL-IFTA EGYPT</span><strong>How to perform Salah</strong><i>REFERENCE</i></div>
              <div><span>MAKTABA-TUL-MADINA</span><strong>Method of Salah — Hanafi</strong><i>REFERENCE</i></div>
            </div>
            <div className="editorial-note"><strong>Editorial status</strong><p>This page is an educational summary, not an independent fatwa. Before presenting it as institutionally approved material, arrange a complete review by qualified Sunni Hanafi scholars, including Arabic spelling and transliteration.</p></div>
          </section>
        </article>
      </section>

      <footer className="namaz-footer"><div><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Learn carefully. Worship calmly. Ask when unsure.</p></div><div><a href="#overview">Back to top ↑</a><Link href="/">Return to NOOR home</Link></div></footer>
    </main>
  );
}
