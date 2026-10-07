"use client";
import { personalStorage } from "@/lib/personal-storage";


import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAN_KEY, planAssignment, planDay, validPlan, type QuranPlan } from "@/lib/quran-plan";
import NoorSelect from "../site/NoorSelect";
import { useNoorCopy } from "../site/SiteUtilities";

const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
export default function CompletionPlan() {
  const { t } = useNoorCopy();
  const [plan, setPlan] = useState<QuranPlan | null>(null);
  const [days, setDays] = useState<30 | 60 | 90>(30);
  const [startDate, setStartDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [restart, setRestart] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => {
      setCurrentDate(today());
      setStartDate((date) => date || today());
      try { const value = JSON.parse(personalStorage.getItem(PLAN_KEY) ?? "null"); setPlan(validPlan(value) ? value : null); } catch { setPlan(null); }
    };
    refresh();
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("noor:plan-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { clearInterval(timer); window.removeEventListener("noor:plan-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const save = (next: QuranPlan) => {
    if (!validPlan(next)) { setMessage("Choose a valid date and plan."); return; }
    try { personalStorage.setItem(PLAN_KEY, JSON.stringify(next)); setPlan(next); setRestart(false); setMessage(""); window.dispatchEvent(new Event("noor:plan-change")); } catch { setMessage("Your browser could not save this plan."); }
  };
  const scheduled = plan && currentDate ? planDay(plan.startDate, currentDate, plan.days) : 1;
  const nextDay = plan ? Array.from({ length: plan.days }, (_, index) => index + 1).find((day) => !plan.completed.includes(day)) : undefined;
  const overdue = plan ? Math.max(0, scheduled - 1 - plan.completed.filter((day) => day < scheduled).length) : 0;
  return <details className="noor-feature-card completion-plan">
    <summary>{t("Quran completion plan")}{plan ? ` · ${new Set(plan.completed).size}/${plan.days}` : ""}</summary>
    <p>{t("Read the whole Quran in 30, 60 or 90 days. Mark each day complete after reading.")}</p>
    {!plan || restart ? <form className="noor-feature-controls" onSubmit={(event) => { event.preventDefault(); save({ days, startDate, completed: [], updatedAt: new Date().toISOString() }); }}>
      <label>{t("Choose your pace")}<NoorSelect aria-label={t("Choose your pace")} value={days} onChange={(event) => setDays(Number(event.target.value) as 30 | 60 | 90)}>{[30, 60, 90].map((count) => <option key={count} value={count}>{count} {t("days")}</option>)}</NoorSelect></label>
      <label>{t("Start date")}<input type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
      <button type="submit">{t("Start plan")}</button>{plan ? <button type="button" onClick={() => setRestart(false)}>{t("Cancel")}</button> : null}
    </form> : <>
      <progress max={plan.days} value={new Set(plan.completed).size} aria-label={t("Quran plan completion")} />
      <p>{plan.startDate > currentDate ? t("Starts {date}", { date: plan.startDate }) : `${t("Day")} ${scheduled} · ${overdue ? `${t("Catch up")}: ${overdue} ${t("days")}` : t("On schedule")}`}</p>
      {nextDay ? (() => { const task = planAssignment(plan.days, nextDay); return <article className="plan-next"><strong>{t("Day")} {nextDay} · {task.count} {t("Ayahs")}</strong><span dir="ltr">{task.first.surah}:{task.first.ayah} → {task.last.surah}:{task.last.ayah}</span><Link href={`/quran?surah=${task.first.surah}&ayah=${task.first.ayah}`}>{t("Open reading")} →</Link><button type="button" onClick={() => save({ ...plan, completed: [...new Set([...plan.completed, nextDay])], updatedAt: new Date().toISOString() })}>{t("Mark complete")}</button></article>; })() : <p role="status">{t("All assignments completed. May Allah accept your reading.")}</p>}
      <details><summary>{t("Your assignments")}</summary><ol className="plan-assignments">{Array.from({ length: plan.days }, (_, index) => { const day = index + 1; const task = planAssignment(plan.days, day); return <li key={day}><Link href={`/quran?surah=${task.first.surah}&ayah=${task.first.ayah}`}>{t("Day")} {day} · <bdi>{task.first.surah}:{task.first.ayah}–{task.last.surah}:{task.last.ayah}</bdi></Link><label><input type="checkbox" checked={plan.completed.includes(day)} onChange={(event) => save({ ...plan, completed: event.target.checked ? [...new Set([...plan.completed, day])] : plan.completed.filter((item) => item !== day), updatedAt: new Date().toISOString() })} />{t("Completed")}</label></li>; })}</ol></details>
      <button type="button" className="text-action" onClick={() => { setRestart(true); setStartDate(today()); setDays(plan.days); }}>{t("Restart plan")}</button>
    </>}
    <p role="status">{t(message)}</p>
  </details>;
}
