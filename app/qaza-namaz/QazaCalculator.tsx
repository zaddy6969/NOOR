"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "dates" | "days";
type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Witr";
type PrayerSelection = Record<PrayerName, boolean>;

const initialPrayers: PrayerSelection = { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true, Witr: true };
const prayerRakah: Record<PrayerName, string> = { Fajr: "2 Fard", Dhuhr: "4 Fard", Asr: "4 Fard", Maghrib: "3 Fard", Isha: "4 Fard", Witr: "3 Wajib · Hanafi" };

function wholeNumber(value: string) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function dateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? Date.UTC(year, month - 1, day) : null;
}

function inclusiveDays(from: string, to: string) {
  const start = dateParts(from);
  const end = dateParts(to);
  if (start === null || end === null || end < start) return 0;
  return Math.floor((end - start) / 86400000) + 1;
}

export default function QazaCalculator() {
  const [mode, setMode] = useState<Mode>("days");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [exemptDays, setExemptDays] = useState("");
  const [completedDays, setCompletedDays] = useState("");
  const [targetMonths, setTargetMonths] = useState("12");
  const [prayers, setPrayers] = useState<PrayerSelection>(initialPrayers);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("noor-qaza-plan-v1");
      if (!stored) return;
      try {
        const plan = JSON.parse(stored) as { targetMonths?: string; prayers?: PrayerSelection };
        if (plan.targetMonths) setTargetMonths(plan.targetMonths);
        if (plan.prayers) setPrayers(plan.prayers);
        setSaved(true);
      } catch {
        setSaved(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const result = useMemo(() => {
    const enteredDays = mode === "dates" ? inclusiveDays(from, to) : wholeNumber(estimatedDays);
    const remainingDays = Math.max(0, enteredDays - wholeNumber(exemptDays) - wholeNumber(completedDays));
    const selected = (Object.keys(prayers) as PrayerName[]).filter((name) => prayers[name]);
    const totalPrayers = remainingDays * selected.length;
    const months = Math.max(1, wholeNumber(targetMonths));
    const planDays = Math.max(1, Math.round(months * 30.44));
    const dailyTarget = totalPrayers ? Math.ceil(totalPrayers / planDays) : 0;
    const finishDays = dailyTarget ? Math.ceil(totalPrayers / dailyTarget) : 0;
    return { enteredDays, remainingDays, selected, totalPrayers, dailyTarget, finishDays };
  }, [completedDays, estimatedDays, exemptDays, from, mode, prayers, targetMonths, to]);

  const savePlan = () => {
    window.localStorage.setItem("noor-qaza-plan-v1", JSON.stringify({ targetMonths, prayers }));
    setSaved(true);
  };

  return (
    <section className="working-calculator qaza-working-area">
      <div className="calculator-form-card">
        <div className="calculator-card-head"><div><span>01</span><div><strong>Estimate the missed period</strong><small>Use known dates or a careful day estimate</small></div></div></div>
        <div className="nisab-tabs qaza-mode-tabs" role="group" aria-label="Calculation method">
          <button className={mode === "days" ? "active" : ""} type="button" onClick={() => setMode("days")}>Enter number of days</button>
          <button className={mode === "dates" ? "active" : ""} type="button" onClick={() => setMode("dates")}>Use a date range</button>
        </div>
        {mode === "dates"
          ? <div className="date-input-grid"><label><span>From date</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label><span>To date</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label></div>
          : <label className="plain-calculator-field"><span><strong>Estimated missed days</strong><small>Count from puberty, not from birth</small></span><input inputMode="numeric" min="0" type="number" value={estimatedDays} onChange={(event) => setEstimatedDays(event.target.value)} placeholder="0" /></label>}

        <div className="date-input-grid qaza-adjustments">
          <label><span>Valid exemption days</span><small>Days when Qaza was not due, such as menstruation or post-natal bleeding</small><input inputMode="numeric" min="0" type="number" value={exemptDays} onChange={(event) => setExemptDays(event.target.value)} placeholder="0" /></label>
          <label><span>Full days already completed</span><small>Subtract only days where all selected Qaza prayers were completed</small><input inputMode="numeric" min="0" type="number" value={completedDays} onChange={(event) => setCompletedDays(event.target.value)} placeholder="0" /></label>
        </div>

        <div className="calculator-subsection">
          <div className="calculator-card-head"><div><span>02</span><div><strong>Select the prayers</strong><small>Witr is included by default for Hanafi planning</small></div></div></div>
          <div className="prayer-selector-grid">{(Object.keys(prayers) as PrayerName[]).map((name) => <label className={prayers[name] ? "selected" : ""} key={name}><input type="checkbox" checked={prayers[name]} onChange={(event) => setPrayers((current) => ({ ...current, [name]: event.target.checked }))} /><span><strong>{name}</strong><small>{prayerRakah[name]}</small></span></label>)}</div>
          <label className="plain-calculator-field target-field"><span><strong>Target completion period</strong><small>NOOR will calculate a steady daily target</small></span><div><input inputMode="numeric" min="1" max="600" type="number" value={targetMonths} onChange={(event) => setTargetMonths(event.target.value)} /><b>months</b></div></label>
        </div>
      </div>

      <aside className="calculator-result-card qaza-result-card">
        <span>YOUR QAZA PLAN</span>
        <div className="calculator-result-total"><small>Remaining prayers</small><strong>{result.totalPrayers.toLocaleString("en-IN")}</strong><p>{result.remainingDays.toLocaleString("en-IN")} included days · {result.selected.length} selected prayers per day</p></div>
        <div className="qaza-prayer-results">{result.selected.map((name) => <div key={name}><span>{name}</span><strong>{result.remainingDays.toLocaleString("en-IN")}</strong><small>{prayerRakah[name]}</small></div>)}</div>
        <div className="qaza-daily-target"><span>DAILY TARGET</span><strong>{result.dailyTarget || "—"}<small> Qaza prayers each day</small></strong><p>{result.dailyTarget ? "Approximately " + result.finishDays.toLocaleString("en-IN") + " days at this pace." : "Enter the missed period to create a plan."}</p></div>
        <div className="calculator-status"><b>i</b><span><strong>One consistent plan is better than delay</strong><small>Continue current Salah on time while completing Qaza steadily.</small></span></div>
        <button className="calculator-save" type="button" onClick={savePlan}>{saved ? "Plan preferences saved on this device" : "Save plan preferences"}</button>
        {saved ? <button className="calculator-reset" type="button" onClick={() => { window.localStorage.removeItem("noor-qaza-plan-v1"); setSaved(false); }}>Remove saved plan</button> : null}
        <p className="calculator-privacy">This estimate assumes every selected prayer was missed on each included day.</p>
      </aside>
    </section>
  );
}
