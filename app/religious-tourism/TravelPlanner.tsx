"use client";

import { useEffect, useMemo, useState } from "react";
import { destinations } from "../destinations/destination-data";

const checklist = [
  ["intention", "Renew the intention", "Keep worship, learning and respectful visitation at the centre."],
  ["rules", "Check current entry rules", "Confirm visas, permits, local law and official opening arrangements."],
  ["prayer", "Plan Salah on the journey", "Note Qibla, prayer spaces, travel times and relevant traveller rulings."],
  ["documents", "Secure documents", "Keep passport, bookings, insurance and emergency contacts together."],
  ["health", "Prepare health needs", "Carry prescriptions, hydration supplies and any required vaccinations."],
  ["clothing", "Pack modest, practical clothing", "Consider worship requirements, climate, walking and local custom."],
  ["access", "Check accessibility", "Confirm walking distances, lifts, wheelchairs and companion arrangements."],
  ["money", "Set a responsible budget", "Separate travel, food, charity and emergency funds; avoid financial pressure."],
  ["adab", "Learn site etiquette", "Protect prayer space, lower noise, ask before photography and follow caretakers."],
  ["family", "Share the itinerary", "Give trusted family your travel, accommodation and contact details."],
] as const;

export default function TravelPlanner() {
  const [destination, setDestination] = useState(destinations[0].slug);
  const [days, setDays] = useState(5);
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setChecked(JSON.parse(window.localStorage.getItem("noor-travel-checklist-v1") ?? "[]") as string[]); } catch { setChecked([]); }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const place = destinations.find((item) => item.slug === destination) ?? destinations[0];
  const progress = Math.round((checked.length / checklist.length) * 100);
  const toggle = (id: string) => setChecked((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; window.localStorage.setItem("noor-travel-checklist-v1", JSON.stringify(next)); return next; });
  const outline = useMemo(() => {
    if (days <= 2) return "Keep the visit focused: one principal worship or heritage area each day, with generous prayer and rest time.";
    if (days <= 5) return "Balance key places with worship, rest and one flexible half-day for delays or accessibility needs.";
    return "Group nearby places by area, include a rest day and avoid turning every day into a rushed checklist.";
  }, [days]);
  return <section className="travel-planner"><div className="travel-plan-card"><div className="travel-fields"><label><span>DESTINATION</span><select value={destination} onChange={(event) => setDestination(event.target.value)}>{destinations.map((item) => <option value={item.slug} key={item.slug}>{item.name} · {item.country}</option>)}</select></label><label><span>TRIP LENGTH</span><input type="number" min={1} max={30} value={days} onChange={(event) => setDays(Math.min(30, Math.max(1, Number(event.target.value) || 1)))}/><small>days</small></label></div><article><span>{place.category.toUpperCase()}</span><h2>{place.name}</h2><p>{place.significance}</p><div><strong>{days}-day planning shape</strong><p>{outline}</p></div><ul>{place.places.map((item) => <li key={item}>{item}</li>)}</ul><footer><b>Respect:</b> {place.etiquette}<br/><b>Before booking:</b> {place.planning}</footer></article></div><aside className="travel-checklist"><header><div><span>PRIVATE CHECKLIST</span><strong>{progress}% ready</strong></div><progress max={100} value={progress}>{progress}%</progress></header>{checklist.map(([id, title, detail]) => <label className={checked.includes(id) ? "checked" : ""} key={id}><input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)}/><span><strong>{title}</strong><small>{detail}</small></span></label>)}<p>Saved only on this device · rules and access can change</p></aside></section>;
}
