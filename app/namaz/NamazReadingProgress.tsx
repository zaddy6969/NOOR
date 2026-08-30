"use client";

import { useEffect, useState } from "react";

export default function NamazReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let queued = false;
    const update = () => {
      queued = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return <div className="namaz-reading-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>;
}
