"use client";

import { useEffect, useState } from "react";
import { useNoorCopy } from "../site/SiteUtilities";
type InstallEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> };
export default function InstallGuide() {
  const { t } = useNoorCopy();
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); };
    const done = () => { setInstalled(true); setPrompt(null); };
    const frame = requestAnimationFrame(() => setInstalled(window.matchMedia("(display-mode: standalone)").matches));
    window.addEventListener("beforeinstallprompt", ready); window.addEventListener("appinstalled", done);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("beforeinstallprompt", ready); window.removeEventListener("appinstalled", done); };
  }, []);
  return <section className="noor-feature-card install-guide"><h2>{t("Install NOOR")}</h2>{installed ? <p>NOOR is running as an installed app.</p> : <>
    {prompt ? <button type="button" onClick={async () => { try { await prompt.prompt(); const result = await prompt.userChoice; setMessage(result.outcome === "accepted" ? "Installation accepted." : "You can install later from your browser menu."); setPrompt(null); } catch { setMessage("Use your browser menu to install NOOR."); } }}>{t("Install NOOR")}</button> : null}
    <div className="install-platforms"><article><strong>iPhone / iPad</strong><p>Open NOOR in Safari → Share → Add to Home Screen → Add.</p></article><article><strong>Android / desktop</strong><p>Open your browser menu → Install app or Add to Home screen. If unavailable, keep a bookmark.</p></article></div>
    <p>Installation gives you an app shortcut. Download each Quran selection separately before going offline.</p></>}<p role="status">{message}</p></section>;
}
