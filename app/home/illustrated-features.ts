type NoorLocale = "en" | "hi" | "ur";
export const MORE_FEATURE_GROUPS = [
  {
    label: "Spiritual Learning",
    icon: "book",
    features: [
      {
        label: "Naat & Salam",
        description: "Listen, watch and read beautiful naats",
        href: "/naat",
        art: "learning-r1-c1",
      },
      {
        label: "Prayer & Wudu",
        description: "A complete guide to salah and purification",
        href: "/namaz",
        art: "learning-r1-c2",
      },
      {
        label: "Five Pillars",
        description: "Learn the foundations of Muslim life",
        href: "/topics/pillars",
        art: "learning-r1-c3",
      },
      {
        label: "Ahle Sunnat",
        description: "Beliefs and guidance from authentic sources",
        href: "/topics/ahle-sunnat",
        art: "learning-r1-c4",
      },
    ],
  },
  {
    label: "Faith & Knowledge",
    icon: "learn",
    features: [
      {
        label: "Tawheed",
        description: "Understand the oneness of Allah",
        href: "/topics/tawheed",
        art: "learning-r2-c1",
      },
      {
        label: "Islamic History",
        description: "Read meaningful Waqiyahs—accounts from Islamic history",
        href: "/topics/waqiyahs",
        art: "learning-r2-c2",
      },
      {
        label: "Islamic Quotes",
        description: "Sourced reminders for everyday reflection",
        href: "/topics/quotes",
        art: "learning-r2-c3",
      },
      {
        label: "Scholars",
        description: "Discover trusted teachers and their work",
        href: "/topics/scholars",
        art: "learning-r2-c4",
      },
    ],
  },
  {
    label: "Community & Family",
    icon: "community",
    features: [
      {
        label: "Prophet’s Family",
        description: "Explore a historical family-tree resource",
        href: "/family-tree",
        art: "life-r1-c1",
      },
      {
        label: "Product Ideas",
        description: "Keep a private product-request list; no checkout",
        href: "/shop",
        art: "life-r1-c2",
      },
      {
        label: "Marriage Preparation",
        description: "Guidance and private drafts; matching is unavailable",
        href: "/matrimony",
        art: "life-r1-c3",
      },
      {
        label: "Choosing an Institute",
        description: "Guidance for evaluating teachers and institutions",
        href: "/topics/institutes",
        art: "life-r1-c4",
      },
    ],
  },
  {
    label: "Travel & Seasons",
    icon: "pin",
    features: [
      {
        label: "Religious Tourism",
        description: "Plan meaningful journeys to sacred places",
        href: "/religious-tourism",
        art: "life-r2-c1",
      },
      {
        label: "Ramadan & Roza",
        description: "Fasting guidance and seasonal resources",
        href: "/topics/roza",
        art: "life-r2-c2",
      },
      {
        label: "Hajj Guide",
        description: "Prepare for the rites, journey and etiquette",
        href: "/topics/hajj",
        art: "life-r2-c3",
      },
      {
        label: "Islamic Festivals",
        description: "Understand dates, meaning and practice",
        href: "/topics/festivals",
        art: "life-r2-c4",
      },
    ],
  },
  {
    label: "About & Support",
    icon: "info",
    features: [
      {
        label: "Jobs & Careers",
        description: "Build a fulfilling, faith-conscious career",
        href: "/topics/jobs",
        art: "support-r1-c1",
      },
      {
        label: "Islamic FAQs",
        description: "Clear answers to common questions",
        href: "/topics/faqs",
        art: "support-r1-c2",
      },
      {
        label: "Islamic Glossary",
        description: "Understand Arabic and Urdu terms",
        href: "/glossary",
        art: "support-r2-c1",
      },
      {
        label: "About NOOR",
        description: "Read about our purpose and standards",
        href: "/about",
        art: "support-r2-c2",
      },
    ],
  },
  {
    label: "Worship guides",
    icon: "prayer",
    features: [
      { label: "Wudu", href: "/namaz/wudu", art: "learning-r1-c2" },
      { label: "Salah step by step", href: "/namaz/salah", art: "learning-r1-c3" },
      { label: "Prayer recitations", href: "/namaz/recitations", art: "learning-r1-c4" },
      { label: "Common prayer mistakes", href: "/namaz/mistakes", art: "learning-r2-c3" },
    ],
  },
  {
    label: "Naat & resources",
    icon: "music",
    features: [
      { label: "Naat Lyrics", href: "/topics/lyrics", art: "learning-r1-c1" },
      { label: "Naat by Writer", href: "/topics/writers", art: "learning-r2-c2" },
      { label: "Naat by Reciter", href: "/topics/reciters", art: "learning-r1-c1" },
      { label: "Islamic Channels", href: "/topics/channels", art: "learning-r2-c4" },
    ],
  },
  {
    label: "Places & community",
    icon: "community",
    features: [
      { label: "Khanqah & Urs", href: "/topics/khanqah", art: "life-r1-c4" },
      { label: "Giving & charity", href: "/topics/donation", art: "life-r1-c2" },
      { label: "Muslim destinations", href: "/destinations", art: "life-r2-c1" },
      { label: "Offline Downloads", href: "/offline", art: "support-r2-c1" },
    ],
  },

];

export const MORE_GROUP_LABELS: Record<NoorLocale, Record<string, string>> = {
  en: {},
  hi: {
    "Spiritual Learning": "रूहानी शिक्षा",
    "Faith & Knowledge": "ईमान और ज्ञान",
    "Community & Family": "समाज और परिवार",
    "Travel & Seasons": "यात्रा और इस्लामी मौसम",
    "About & Support": "नूर और सहायता",
  },
  ur: {
    "Spiritual Learning": "روحانی تعلیم",
    "Faith & Knowledge": "ایمان اور علم",
    "Community & Family": "برادری اور خاندان",
    "Travel & Seasons": "سفر اور اسلامی موسم",
    "About & Support": "نور اور مدد",
  },
};

export const MORE_FEATURE_LABELS: Record<
  NoorLocale,
  Record<string, [string, string]>
> = {
  en: {},
  hi: {
    "/naat": ["नात और सलाम", "खूबसूरत नात सुनें, देखें और पढ़ें"],
    "/namaz": ["नमाज़ और वुज़ू", "पाकी और नमाज़ की पूरी मार्गदर्शिका"],
    "/topics/pillars": [
      "इस्लाम के पाँच स्तंभ",
      "मुस्लिम जीवन की बुनियाद समझें",
    ],
    "/topics/ahle-sunnat": [
      "अहले सुन्नत",
      "प्रामाणिक स्रोतों से अक़ीदा और मार्गदर्शन",
    ],
    "/topics/tawheed": ["तौहीद", "अल्लाह की एकता को समझें"],
    "/topics/waqiyahs": [
      "इस्लामी वाक़ियात",
      "इतिहास से अर्थपूर्ण घटनाएँ पढ़ें",
    ],
    "/topics/quotes": ["इस्लामी कथन", "स्रोत सहित रोज़ाना याद-दिहानी"],
    "/topics/scholars": ["उलमा", "विश्वसनीय शिक्षकों और उनके कार्य को जानें"],
    "/family-tree": ["नबी का परिवार", "ऐतिहासिक पारिवारिक शजरہ देखें"],
    "/shop": ["श्रेणी अनुसार सुझाव", "नूर की चुनी हुई सूची देखें"],
    "/matrimony": ["निकाह", "रहनुमाई और निजी मसौदा; मैचिंग उपलब्ध नहीं"],
    "/topics/institutes": [
      "इस्लामी संस्थान",
      "इदारे और शिक्षकों को चुनने की रहनुमाई",
    ],
    "/religious-tourism": [
      "धार्मिक यात्रा",
      "पवित्र स्थलों की सार्थक योजना बनाएँ",
    ],
    "/topics/roza": ["रमज़ान और रोज़ा", "रोज़े की राहनुमाई और संसाधन"],
    "/topics/hajj": ["हज मार्गदर्शिका", "सफ़र, अरकान और आदाब की तैयारी"],
    "/topics/festivals": ["इस्लामी अवसर", "तारीख़, अर्थ और अमल समझें"],
    "/topics/jobs": ["रोज़गार और करियर", "दीन के अनुरूप करियर बनाएँ"],
    "/topics/faqs": ["इस्लामी सवाल", "आम सवालों के साफ़ जवाब"],
    "/glossary": ["इस्लामी शब्दकोश", "अरबी और उर्दू शब्द समझें"],
    "/about": ["नूर के बारे में", "हमारा उद्देश्य और मानक पढ़ें"],
  },
  ur: {
    "/naat": ["نعت و سلام", "خوبصورت نعتیں سنیں، دیکھیں اور پڑھیں"],
    "/namaz": ["نماز اور وضو", "پاکی اور نماز کی مکمل رہنمائی"],
    "/topics/pillars": ["اسلام کے پانچ ستون", "مسلمان زندگی کی بنیادیں سمجھیں"],
    "/topics/ahle-sunnat": ["اہل سنت", "معتبر ذرائع سے عقیدہ اور رہنمائی"],
    "/topics/tawheed": ["توحید", "اللہ کی وحدانیت کو سمجھیں"],
    "/topics/waqiyahs": ["اسلامی واقعات", "تاریخ کے بامعنی واقعات پڑھیں"],
    "/topics/quotes": ["اسلامی اقوال", "حوالے کے ساتھ روزانہ نصیحت"],
    "/topics/scholars": ["علماء", "معتبر اساتذہ اور ان کے کام کو جانیں"],
    "/family-tree": ["نبی کا خاندان", "تاریخی خاندانی شجرہ دیکھیں"],
    "/shop": ["زمرہ وار تجاویز", "نور کی منتخب فہرست دیکھیں"],
    "/matrimony": ["رشتۂ نکاح", "رہنمائی اور نجی مسودہ؛ میچنگ دستیاب نہیں"],
    "/topics/institutes": [
      "اسلامی ادارے",
      "ادارے اور اساتذہ منتخب کرنے کی رہنمائی",
    ],
    "/religious-tourism": ["مذہبی سفر", "مقدس مقامات کے سفر کی منصوبہ بندی"],
    "/topics/roza": ["رمضان اور روزہ", "روزے کی رہنمائی اور وسائل"],
    "/topics/hajj": ["حج رہنما", "ارکان، سفر اور آداب کی تیاری"],
    "/topics/festivals": ["اسلامی مواقع", "تاریخ، معنی اور عمل سمجھیں"],
    "/topics/jobs": ["روزگار اور کیریئر", "دین کے مطابق کیریئر بنائیں"],
    "/topics/faqs": ["اسلامی سوالات", "عام سوالات کے واضح جواب"],
    "/glossary": ["اسلامی لغت", "عربی اور اردو الفاظ سمجھیں"],
    "/about": ["نور کے بارے میں", "ہمارا مقصد اور معیار پڑھیں"],
  },
};
