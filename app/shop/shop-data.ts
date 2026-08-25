export type ShopCategory = "Quran & Books" | "Prayer Essentials" | "Modest Wear" | "Attar & Fragrance" | "Ramadan & Eid" | "Hajj & Umrah" | "Gifts" | "Children";

export type ShopItem = {
  id: string;
  name: string;
  category: ShopCategory;
  description: string;
  options: string;
  icon: string;
};

export const shopItems: ShopItem[] = [
  { id: "quran-translation", name: "Quran with translation", category: "Quran & Books", description: "Arabic Mushaf with a selected translation and readable print.", options: "Choose language, script style and print size", icon: "قرآن" },
  { id: "dua-book", name: "Daily Dua collection", category: "Quran & Books", description: "Morning, evening and everyday supplications with source notes.", options: "Pocket or large-print edition", icon: "دعا" },
  { id: "prayer-mat", name: "Comfort prayer mat", category: "Prayer Essentials", description: "A clean, supportive surface for home, mosque or travel.", options: "Standard, padded or travel size", icon: "◈" },
  { id: "tasbih", name: "Tasbih beads", category: "Prayer Essentials", description: "Simple remembrance beads in practical sizes and materials.", options: "33 or 99 count", icon: "○" },
  { id: "prayer-cap", name: "Prayer cap", category: "Modest Wear", description: "Breathable everyday cap for prayer and gatherings.", options: "Select size, colour and material", icon: "⌒" },
  { id: "hijab", name: "Everyday hijab", category: "Modest Wear", description: "Opaque, comfortable head covering for daily use.", options: "Chiffon, jersey or cotton", icon: "◇" },
  { id: "attar", name: "Alcohol-free attar", category: "Attar & Fragrance", description: "Concentrated perfume oil for personal fragrance.", options: "Floral, woody, fresh or oud", icon: "✦" },
  { id: "oud", name: "Oud & bakhoor set", category: "Attar & Fragrance", description: "Home fragrance set with storage and safe-use notes.", options: "Electric or charcoal burner set", icon: "♨" },
  { id: "lantern", name: "Ramadan lantern", category: "Ramadan & Eid", description: "Reusable home decoration for Ramadan and Eid.", options: "Table, hanging or children’s style", icon: "☾" },
  { id: "eid-gift", name: "Eid gift box", category: "Ramadan & Eid", description: "A customisable box for family, neighbours or colleagues.", options: "Choose recipient and dietary needs", icon: "□" },
  { id: "ihram", name: "Ihram set", category: "Hajj & Umrah", description: "Two-piece men’s Ihram cloth with storage pouch.", options: "Regular, absorbent or lightweight", icon: "▱" },
  { id: "travel-kit", name: "Pilgrimage travel kit", category: "Hajj & Umrah", description: "Compact belt, shoe bag, unscented containers and document wallet.", options: "Essential or extended set", icon: "⌁" },
  { id: "calligraphy", name: "Personalised calligraphy", category: "Gifts", description: "Name, Dua or occasion artwork prepared for gifting.", options: "Digital print or framed", icon: "ن" },
  { id: "nikah-gift", name: "Nikah keepsake", category: "Gifts", description: "A respectful personalised gift for a new household.", options: "Certificate holder, frame or set", icon: "♡" },
  { id: "arabic-cards", name: "Arabic learning cards", category: "Children", description: "Colourful letter and word cards for guided early learning.", options: "Alphabet, words or Dua set", icon: "ا" },
  { id: "prayer-chart", name: "Children’s prayer chart", category: "Children", description: "Reusable visual routine for prayer and good habits.", options: "Magnetic or wipe-clean", icon: "✓" },
];
