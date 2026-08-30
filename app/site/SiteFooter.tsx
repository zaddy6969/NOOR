import Link from "next/link";

type Locale = "en" | "hi" | "ur";

const COPY: Record<Locale, Record<string, string>> = {
  en: {},
  hi: {
    tagline: "क़ुरआन, नमाज़ और विश्वसनीय इस्लामी शिक्षा—रोज़मर्रा की ज़िंदगी के लिए सरल।", Daily: "रोज़ाना", Quran: "क़ुरआन", "Prayer & Wudu": "नमाज़ और वुज़ू", "Qibla Compass": "क़िबला कम्पास", "Islamic Calendar": "इस्लामी कैलेंडर", "Qaza Namaz": "क़ज़ा नमाज़", Learn: "सीखें", "Ahle Sunnat": "अहले सुन्नत", "Five Pillars": "पाँच स्तंभ", "Islamic Urdu Glossary": "इस्लामी उर्दू शब्दकोश", "Islamic FAQs": "इस्लामी सवाल", "Library & Giving": "किताबघर और सदक़ा", "Darood Sharif": "दरूद शरीफ़", "Naat & Salam": "नात और सलाम", "Zakat Calculator": "ज़कात कैलकुलेटर", Scholars: "उलमा", Matrimony: "निकाह", Explore: "खोजें", "Mosque Finder": "मस्जिद खोजें", "Muslim Destinations": "मुस्लिम स्थल", "Religious Tourism": "धार्मिक यात्रा", "Product Request Catalogue": "उत्पाद सुझाव", Trust: "भरोसा", "About NOOR": "नूर के बारे में", "Editorial Policy": "संपादकीय नीति", Privacy: "गोपनीयता", Terms: "शर्तें", note: "शैक्षिक मार्गदर्शन · स्रोत चिह्नित हैं · निजी मसलों के लिए योग्य आलिम से पूछें",
  },
  ur: {
    tagline: "قرآن، نماز اور معتبر اسلامی تعلیم—روزمرہ زندگی کے لیے آسان۔", Daily: "روزانہ", Quran: "قرآن", "Prayer & Wudu": "نماز اور وضو", "Qibla Compass": "قبلہ کمپاس", "Islamic Calendar": "اسلامی کیلنڈر", "Qaza Namaz": "قضا نماز", Learn: "سیکھیں", "Ahle Sunnat": "اہل سنت", "Five Pillars": "پانچ ستون", "Islamic Urdu Glossary": "اسلامی اردو لغت", "Islamic FAQs": "اسلامی سوالات", "Library & Giving": "کتب خانہ اور خیرات", "Darood Sharif": "درود شریف", "Naat & Salam": "نعت و سلام", "Zakat Calculator": "زکوٰۃ کیلکولیٹر", Scholars: "علماء", Matrimony: "رشتۂ نکاح", Explore: "دریافت", "Mosque Finder": "مسجد تلاش کریں", "Muslim Destinations": "مسلم مقامات", "Religious Tourism": "مذہبی سفر", "Product Request Catalogue": "مصنوعات کی تجاویز", Trust: "اعتماد", "About NOOR": "نور کے بارے میں", "Editorial Policy": "ادارتی پالیسی", Privacy: "رازداری", Terms: "شرائط", note: "تعلیمی رہنمائی · ذرائع واضح ہیں · ذاتی مسائل کے لیے مستند عالم سے رجوع کریں",
  },
};

const GROUPS = [
  ["Daily", [["Quran", "/quran"], ["Prayer & Wudu", "/namaz"], ["Qibla Compass", "/qibla"], ["Islamic Calendar", "/islamic-calendar"], ["Qaza Namaz", "/qaza-namaz"]]],
  ["Learn", [["Ahle Sunnat", "/topics/ahle-sunnat"], ["Five Pillars", "/topics/pillars"], ["Islamic Urdu Glossary", "/glossary"], ["Islamic FAQs", "/topics/faqs"]]],
  ["Library & Giving", [["Darood Sharif", "/darood"], ["Naat & Salam", "/naat"], ["Zakat Calculator", "/zakat-calculator"], ["Scholars", "/topics/scholars"], ["Matrimony", "/matrimony"]]],
  ["Explore", [["Mosque Finder", "/mosque-finder"], ["Muslim Destinations", "/destinations"], ["Religious Tourism", "/religious-tourism"], ["Product Request Catalogue", "/shop"]]],
  ["Trust", [["About NOOR", "/about"], ["Editorial Policy", "/editorial-policy"], ["Privacy", "/privacy"], ["Terms", "/terms"]]],
] as const;

export default function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const text = (value: string) => COPY[locale][value] ?? value;
  const tagline = locale === "en" ? "Quran, prayer and trusted Islamic learning—kept simple for daily life." : text("tagline");
  const note = locale === "en" ? "Educational guidance · Sources are labelled · Personal rulings require a qualified scholar" : text("note");
  return (
    <footer className="professional-footer">
      <div className="professional-footer-main">
        <div className="footer-identity"><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>{tagline}</p></div>
        {GROUPS.map(([heading, links]) => <div key={heading}><strong>{text(heading)}</strong>{links.map(([label, href]) => <Link href={href} key={href}>{text(label)}</Link>)}</div>)}
      </div>
      <div className="professional-footer-bottom"><span>© 2026 NOOR</span><span>{note}</span></div>
    </footer>
  );
}
