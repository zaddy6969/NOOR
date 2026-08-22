import Link from "next/link";
import { HeaderUtilities } from "./SiteUtilities";

export default function ToolHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="quran-topbar compact-tool-topbar">
      <Link className="brand" href="/"><span className="brand-mark"><span className="brand-star">✦</span></span><span><strong>NOOR</strong><small>DAILY MUSLIM</small></span></Link>
      <div><strong>{title}</strong><span>{subtitle}</span></div>
      <aside className="header-utility-cluster"><HeaderUtilities compact/><Link className="topic-home-link" href="/">← Home</Link></aside>
    </header>
  );
}
