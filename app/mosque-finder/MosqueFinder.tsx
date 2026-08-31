"use client";

import { useEffect, useMemo, useState } from "react";
import { NOOR_CITIES, writeNoorLocation } from "../site/location-settings";

type PlaceKind = "Mosque" | "Dargah";
type Mosque = { id: string; name: string; address: string; denomination: string | null; phone: string | null; website: string | null; kind: PlaceKind; lat: number; lng: number; distanceKm: number };
type Coordinates = { id?: string; lat: number; lng: number; label: string; accuracy?: number | null; source?: "preset" | "device" };
type PlaceFilter = "Mosques" | "All places" | "Dargahs";

const cityPresets: Coordinates[] = NOOR_CITIES.map((city) => ({ id: city.id, label: city.label, lat: city.latitude, lng: city.longitude, source: "preset" }));

function mapEmbedUrl(point: { lat: number; lng: number }) {
  const offset = 0.018;
  const bbox = [point.lng - offset, point.lat - offset, point.lng + offset, point.lat + offset].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${point.lat}%2C${point.lng}`;
}

export default function MosqueFinder() {
  const [radius, setRadius] = useState(5000);
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<PlaceFilter>("Mosques");
  const [loading, setLoading] = useState(false);
  const [mapSupported, setMapSupported] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Use your location or choose a city. Permission is requested only after you tap the button.");

  const search = async (coordinates: Coordinates, selectedRadius = radius) => {
    setCenter(coordinates); setLoading(true); setMessage("Searching the live community map…");
    writeNoorLocation({ id: coordinates.id ?? "current", label: coordinates.label === "your location" ? "Current location" : coordinates.label, latitude: coordinates.lat, longitude: coordinates.lng, accuracy: coordinates.accuracy ?? null, source: coordinates.source ?? "preset" });
    try {
      const response = await fetch(`/api/mosques?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${selectedRadius}`);
      const payload = await response.json() as { mosques?: Mosque[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Places could not be loaded.");
      const next = Array.isArray(payload.mosques) ? payload.mosques : [];
      setMosques(next);
      setActiveId(next[0]?.id ?? null);
      setMessage(next.length ? `${next.length} mapped Islamic places found near ${coordinates.label}.` : `No mapped place was found within ${selectedRadius / 1000} km. Try a wider radius.`);
    } catch (error) {
      setMosques([]); setActiveId(null); setMessage(error instanceof Error ? error.message : "The live mosque map is unavailable.");
    } finally { setLoading(false); }
  };

  const locate = () => {
    if (!navigator.geolocation) { setMessage("Location is unavailable in this browser. Choose a city instead."); return; }
    setLoading(true); setMessage("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => search({ id: "current", label: "your location", lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy, source: "device" }),
      () => { setLoading(false); setMessage("Location permission was not available. Choose a city, or allow location in browser settings."); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  };

  const visible = useMemo(() => mosques.filter((place) => filter === "All places" || (filter === "Mosques" ? place.kind === "Mosque" : place.kind === "Dargah")), [filter, mosques]);
  const nearest = visible[0] ?? null;
  const active = visible.find((place) => place.id === activeId) ?? nearest;
  const mapPoint = active ?? center;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      const supported = Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
      setMapSupported(supported);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="mosque-finder-working">
      <div className="mosque-control-card">
        <div className="mosque-locate-row"><button type="button" onClick={locate} disabled={loading}><span aria-hidden="true">◎</span>{loading ? "Finding places…" : "Use my location"}</button><label>Radius<select value={radius} onChange={(event) => { const next = Number(event.target.value); setRadius(next); if (center) search(center, next); }}><option value={3000}>3 km</option><option value={5000}>5 km</option><option value={10000}>10 km</option><option value={20000}>20 km</option></select></label></div>
        <div className="mosque-city-row"><span>OR CHOOSE A CITY</span><div>{cityPresets.map((city) => <button type="button" onClick={() => search(city)} key={city.label}>{city.label}</button>)}</div></div>
        <div className="mosque-kind-filter" role="group" aria-label="Place type">{(["Mosques", "All places", "Dargahs"] as PlaceFilter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <p className="mosque-status" role="status">{message}</p>
        {mapPoint && mapSupported ? <div className="mosque-map"><iframe title={`Map of ${active?.name ?? center?.label ?? "selected area"}`} src={mapEmbedUrl(mapPoint)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div> : null}
        {mapPoint && mapSupported === false ? <div className="mosque-map-fallback" role="note"><span aria-hidden="true">⌖</span><strong>Map preview unavailable</strong><p>Your browser cannot display the interactive map. The nearby list and Directions links still work.</p></div> : null}
        {active && center ? <div className="mosque-nearest"><span>SELECTED PLACE · {active.kind.toUpperCase()}</span><strong>{active.name}</strong><p>{active.distanceKm.toFixed(1)} km away · {active.address}</p><a href={`https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lng}&destination=${active.lat},${active.lng}`} target="_blank" rel="noreferrer">Open directions ↗</a></div> : null}
      </div>
      <div className="mosque-results" aria-live="polite">
        {visible.map((mosque, index) => <article className={mosque.id === active?.id ? "active" : ""} key={mosque.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small className="mosque-kind">{mosque.kind}</small><h2>{mosque.name}</h2><p>{mosque.address}</p><small>{mosque.distanceKm.toFixed(1)} km{mosque.denomination ? ` · ${mosque.denomination}` : ""}</small></div><div className="mosque-result-actions"><button type="button" onClick={() => setActiveId(mosque.id)}>View map</button><a href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`} target="_blank" rel="noreferrer" aria-label={`Directions to ${mosque.name}`}>Directions ↗</a></div></article>)}
        {!loading && !visible.length ? <div className="mosque-empty"><span aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 43s14-11.4 14-25A14 14 0 1 0 10 18c0 13.6 14 25 14 25Z"/><circle cx="24" cy="18" r="5"/></svg></span><strong>No {filter.toLowerCase()} in this view</strong><p>Try another filter, choose a city or increase the radius.</p></div> : null}
      </div>
    </section>
  );
}
