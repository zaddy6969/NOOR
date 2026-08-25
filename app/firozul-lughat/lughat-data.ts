export type LughatEntry = {
  id: string;
  term: string;
  urdu: string;
  roman: string;
  meaning: string;
  use: string;
  category: "Faith" | "Worship" | "Character" | "Learning" | "Community";
};

export const lughatEntries: LughatEntry[] = [
  { id: "allah", term: "Allah", urdu: "اللہ", roman: "Allah", meaning: "The proper name of the One true God, Creator and Sustainer of all.", use: "Muslims worship Allah alone and seek His help.", category: "Faith" },
  { id: "tawheed", term: "Tawheed", urdu: "توحید", roman: "Tauheed", meaning: "Affirming the absolute oneness of Allah in worship, lordship and His perfect names and attributes.", use: "Tawheed is the foundation of Islamic belief.", category: "Faith" },
  { id: "iman", term: "Iman", urdu: "ایمان", roman: "Imaan", meaning: "Faith and inward belief in what Allah has revealed.", use: "Iman includes belief in Allah, His angels, books, messengers, the Last Day and divine decree.", category: "Faith" },
  { id: "islam", term: "Islam", urdu: "اسلام", roman: "Islam", meaning: "Willing submission to Allah, expressed through belief and obedient worship.", use: "Islam names the religion and a complete way of life.", category: "Faith" },
  { id: "ihsan", term: "Ihsan", urdu: "احسان", roman: "Ihsaan", meaning: "Spiritual excellence: worshipping Allah with deep awareness and doing what is beautiful and good.", use: "Ihsan joins sincere worship with excellent conduct.", category: "Character" },
  { id: "nabi", term: "Nabi", urdu: "نبی", roman: "Nabi", meaning: "A prophet chosen by Allah to guide people.", use: "Prophet Muhammad ﷺ is the final Nabi.", category: "Faith" },
  { id: "rasul", term: "Rasul", urdu: "رسول", roman: "Rasool", meaning: "A messenger sent by Allah with divine guidance.", use: "Muslims respect and believe in all of Allah’s messengers.", category: "Faith" },
  { id: "sahabi", term: "Sahabi", urdu: "صحابی", roman: "Sahaabi", meaning: "A Companion who met the Prophet Muhammad ﷺ as a believer and died upon Islam.", use: "The plural is Sahabah.", category: "Learning" },
  { id: "sunnah", term: "Sunnah", urdu: "سنت", roman: "Sunnat", meaning: "The teachings, practice and approved example of the Prophet Muhammad ﷺ.", use: "The Sunnah explains and demonstrates Islamic life.", category: "Learning" },
  { id: "hadith", term: "Hadith", urdu: "حدیث", roman: "Hadees", meaning: "A transmitted report about the Prophet’s words, actions, approvals or description.", use: "Hadith reports are studied for wording, chain and reliability.", category: "Learning" },
  { id: "fiqh", term: "Fiqh", urdu: "فقہ", roman: "Fiqh", meaning: "Scholarly understanding of practical Islamic rulings from their detailed evidence.", use: "A qualified jurist is called a faqih.", category: "Learning" },
  { id: "shariah", term: "Shariah", urdu: "شریعت", roman: "Shariat", meaning: "Allah’s revealed path of faith, worship, ethics and just conduct.", use: "Its study requires sound sources and qualified scholarship.", category: "Learning" },
  { id: "fard", term: "Fard", urdu: "فرض", roman: "Farz", meaning: "An act decisively required in Islamic law.", use: "The five daily prayers are Fard upon eligible Muslims.", category: "Worship" },
  { id: "wajib", term: "Wajib", urdu: "واجب", roman: "Waajib", meaning: "An obligatory act; its technical distinction from Fard varies by legal school.", use: "Ask a qualified teacher when the distinction affects practice.", category: "Worship" },
  { id: "nafl", term: "Nafl", urdu: "نفل", roman: "Nafl", meaning: "A voluntary act of worship beyond what is obligatory.", use: "Nafl worship may include prayer, fasting and charity.", category: "Worship" },
  { id: "halal", term: "Halal", urdu: "حلال", roman: "Halaal", meaning: "Permitted or lawful according to Islamic guidance.", use: "Halal applies to food, earnings, transactions and conduct.", category: "Learning" },
  { id: "haram", term: "Haram", urdu: "حرام", roman: "Haraam", meaning: "Prohibited by clear Islamic evidence.", use: "Avoiding Haram is part of obedience to Allah.", category: "Learning" },
  { id: "makruh", term: "Makruh", urdu: "مکروہ", roman: "Makrooh", meaning: "Disliked; the legal strength of the term differs by school and context.", use: "A ruling should not be assigned without evidence.", category: "Learning" },
  { id: "salah", term: "Salah / Namaz", urdu: "نماز / صلاۃ", roman: "Salaah / Namaaz", meaning: "The prescribed ritual prayer performed at its appointed times.", use: "Fajr, Dhuhr, Asr, Maghrib and Isha are the five daily prayers.", category: "Worship" },
  { id: "wudu", term: "Wudu", urdu: "وضو", roman: "Wuzu", meaning: "Ritual washing that prepares a Muslim for Salah and other acts requiring purity.", use: "It includes washing the face and arms, wiping the head and washing the feet.", category: "Worship" },
  { id: "ghusl", term: "Ghusl", urdu: "غسل", roman: "Ghusl", meaning: "A complete ritual bath required after certain states of major impurity.", use: "Water must reach the whole body in the required manner.", category: "Worship" },
  { id: "tayammum", term: "Tayammum", urdu: "تیمم", roman: "Tayammum", meaning: "A prescribed dry purification when water is unavailable or its use is harmful.", use: "Its conditions and method should be learned carefully.", category: "Worship" },
  { id: "sawm", term: "Sawm / Roza", urdu: "روزہ / صوم", roman: "Roza / Saum", meaning: "Fasting from dawn to sunset with intention, abstaining from its invalidators.", use: "Ramadan fasting is one of Islam’s five pillars.", category: "Worship" },
  { id: "zakat", term: "Zakat", urdu: "زکوٰۃ", roman: "Zakaat", meaning: "Obligatory purification of qualifying wealth for eligible recipients.", use: "Nisab, ownership and the lunar year can affect liability.", category: "Worship" },
  { id: "sadaqah", term: "Sadaqah", urdu: "صدقہ", roman: "Sadaqah", meaning: "Voluntary charity or an act of sincere goodness.", use: "It can include money, help, kind speech and other benefit.", category: "Character" },
  { id: "hajj", term: "Hajj", urdu: "حج", roman: "Hajj", meaning: "The major pilgrimage to Makkah during its appointed days and rites.", use: "It is obligatory once for an able Muslim who meets its conditions.", category: "Worship" },
  { id: "umrah", term: "Umrah", urdu: "عمرہ", roman: "Umrah", meaning: "The lesser pilgrimage consisting principally of Ihram, Tawaf, Sa‘i and release from Ihram.", use: "Official travel and permit requirements can change.", category: "Worship" },
  { id: "qibla", term: "Qibla", urdu: "قبلہ", roman: "Qiblah", meaning: "The direction of the Kaaba in Makkah faced during Salah.", use: "NOOR’s compass estimates this bearing from your location.", category: "Worship" },
  { id: "masjid", term: "Masjid", urdu: "مسجد", roman: "Masjid", meaning: "A mosque: a place established for Muslim prayer and worship.", use: "Enter respectfully and observe local arrangements.", category: "Community" },
  { id: "madrasa", term: "Madrasa", urdu: "مدرسہ", roman: "Madrasah", meaning: "A place of learning, especially for Islamic studies.", use: "Curricula can range from foundational classes to advanced scholarship.", category: "Community" },
  { id: "dua", term: "Dua", urdu: "دعا", roman: "Dua", meaning: "Calling upon Allah with request, praise, hope and humility.", use: "A Muslim may make Dua in many languages outside fixed ritual wordings.", category: "Worship" },
  { id: "dhikr", term: "Dhikr", urdu: "ذکر", roman: "Zikr", meaning: "Remembering Allah through prescribed words, reflection and obedient awareness.", use: "Morning and evening Adhkar are forms of Dhikr.", category: "Worship" },
  { id: "salawat", term: "Salawat / Darood", urdu: "درود و سلام", roman: "Darood-o-Salaam", meaning: "Invoking Allah’s blessings and peace upon the Prophet Muhammad ﷺ.", use: "Quran 33:56 commands believers to send blessings and peace upon him.", category: "Worship" },
  { id: "jamaat", term: "Jamaat", urdu: "جماعت", roman: "Jamaat", meaning: "A congregation or organized group; often used for prayer performed together.", use: "Congregational Salah follows an Imam.", category: "Community" },
  { id: "jumuah", term: "Jumuah", urdu: "جمعہ", roman: "Jumuah", meaning: "Friday and its congregational midday prayer.", use: "The prayer includes a Khutbah before two Fard Rak‘ahs.", category: "Worship" },
  { id: "qaza", term: "Qaza", urdu: "قضا", roman: "Qaza", meaning: "Performing a required act after its appointed time has passed.", use: "Missed-prayer details vary; seek guidance for your circumstances.", category: "Worship" },
  { id: "sajdah", term: "Sajdah", urdu: "سجدہ", roman: "Sajdah", meaning: "Prostration in humility before Allah.", use: "In Salah the forehead and nose are placed on the ground with the required limbs.", category: "Worship" },
  { id: "tawbah", term: "Tawbah", urdu: "توبہ", roman: "Taubah", meaning: "Sincere repentance: leaving sin, regretting it and resolving not to return.", use: "People’s rights must also be restored when they were harmed.", category: "Character" },
  { id: "sabr", term: "Sabr", urdu: "صبر", roman: "Sabr", meaning: "Steadfast patience in obedience, hardship and restraint from wrongdoing.", use: "Sabr is active constancy, not passive indifference.", category: "Character" },
  { id: "shukr", term: "Shukr", urdu: "شکر", roman: "Shukr", meaning: "Gratitude to Allah in the heart, speech and responsible action.", use: "Thankfulness includes using blessings well.", category: "Character" },
  { id: "barakah", term: "Barakah", urdu: "برکت", roman: "Barkat", meaning: "Blessing from Allah that brings enduring goodness and benefit.", use: "Muslims ask Allah for Barakah in time, family, knowledge and provision.", category: "Faith" },
  { id: "adab", term: "Adab", urdu: "ادب", roman: "Adab", meaning: "Refined manners, respect and conduct appropriate to a situation.", use: "Learning includes Adab with Allah, His Messenger ﷺ, teachers and people.", category: "Character" },
  { id: "khanqah", term: "Khanqah", urdu: "خانقاہ", roman: "Khanqah", meaning: "A centre associated with spiritual instruction, remembrance and service in Sufi traditions.", use: "Practices and administration differ by centre.", category: "Community" },
  { id: "urs", term: "Urs", urdu: "عرس", roman: "Urs", meaning: "An annual remembrance of the death anniversary of a Sufi saint in many communities.", use: "Visitors should preserve prayer, dignity and local rules.", category: "Community" },
];
