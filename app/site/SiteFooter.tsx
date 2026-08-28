import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="professional-footer">
      <div className="professional-footer-main">
        <div className="footer-identity"><Link className="brand footer-brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link><p>Quran, prayer and trusted Islamic learning—kept simple for daily life.</p></div>
        <div><strong>Daily</strong><Link href="/quran">Quran</Link><Link href="/namaz">Prayer & Wudu</Link><Link href="/qibla">Qibla Compass</Link><Link href="/islamic-calendar">Islamic Calendar</Link><Link href="/qaza-namaz">Qaza Namaz</Link></div>
        <div><strong>Learn</strong><Link href="/topics/ahle-sunnat">Ahle Sunnat</Link><Link href="/topics/pillars">Five Pillars</Link><Link href="/glossary">Islamic Urdu Glossary</Link><Link href="/topics/faqs">Islamic FAQs</Link></div>
        <div><strong>Library & Giving</strong><Link href="/darood">Darood Sharif</Link><Link href="/naat">Naat & Salam</Link><Link href="/zakat-calculator">Zakat Calculator</Link><Link href="/topics/scholars">Scholars</Link><Link href="/matrimony">Matrimony</Link></div>
        <div><strong>Explore</strong><Link href="/mosque-finder">Mosque Finder</Link><Link href="/destinations">Muslim Destinations</Link><Link href="/religious-tourism">Religious Tourism</Link><Link href="/shop">Product Request Catalogue</Link></div>
        <div><strong>Trust</strong><Link href="/about">About NOOR</Link><Link href="/editorial-policy">Editorial Policy</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
      <div className="professional-footer-bottom"><span>© 2026 NOOR</span><span>Educational guidance · Sources are labelled · Personal rulings require a qualified scholar</span></div>
    </footer>
  );
}
