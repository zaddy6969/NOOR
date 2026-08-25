"use client";

import { useMemo, useState } from "react";

type Mosque = { id: string; name: string; address: string; denomination: string | null; phone: string | null; website: string | null; lat: number; lng: number; distanceKm: number };
type Coordinates = { lat: number; lng: number; label: string };

const cityPresets: Coordinates[] = [
  { label: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  { label: "Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { label: "Lucknow", lat: 26.8467, lng: 80.9462 },
];

export default function MosqueFinder() {
  const [radius, setRadius] = useState(5000);
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Use your current location or choose a city.");

  const search = async (coordinates: Coordinates, selectedRadius = radius) => {
    setCenter(coordinates); setLoading(true); setMessage("Searching the live mosque map…");
    try {
      const response = await fetch(`/api/mosques?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${selectedRadius}`);
      const payload = await response.json() as { mosques?: Mosque[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Mosques could not be loaded.");
      const next = Array.isArray(payload.mosques) ? payload.mosques : [];
      setMosques(next);
      setMessage(next.length ? `${next.length} mapped mosques found near ${coordinates.label}.` : `No mapped mosque was found within ${selectedRadius / 1000} km. Try a wider radius.`);
    } catch (error) {
      setMosques([]); setMessage(error instanceof Error ? error.message : "The live mosque map is unavailable.");
    } finally { setLoading(false); }
  };

  const locate = () => {
    if (!navigator.geolocation) { setMessage("Location is unavailable in this browser. Choose a city instead."); return; }
    setLoading(true); setMessage("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => search({ label: "your location", lat: position.coords.latitude, lng: position.coords.longitude }),
      () => { setLoading(false); setMessage("Location permission was not available. Choose a city below, or allow location in browser settings."); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  };

  const nearest = useMemo(() => mosques[0] ?? null, [mosques]);

  return (
    <section className="mosque-finder-working">
      <div className="mosque-control-card">
        <div className="mosque-locate-row"><button type="button" onClick={locate} disabled={loading}><span aria-hidden="true">◎</span>{loading ? "Finding mosques…" : "Use my live location"}</button><label>Radius<select value={radius} onChange={(event) => { const next = Number(event.target.value); setRadius(next); if (center) search(center, next); }}><option value={3000}>3 km</option><option value={5000}>5 km</option><option value={10000}>10 km</option><option value={20000}>20 km</option></select></label></div>
        <div className="mosque-city-row"><span>OR CHOOSE A CITY</span><div>{cityPresets.map((city) => <button type="button" onClick={() => search(city)} key={city.label}>{city.label}</button>)}</div></div>
        <p className="mosque-status" role="status">{message}</p>
        {nearest && center ? <div className="mosque-nearest"><span>NEAREST RESULT</span><strong>{nearest.name}</strong><p>{nearest.distanceKm.toFixed(1)} km away · {nearest.address}</p><a href={`https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lng}&destination=${nearest.lat},${nearest.lng}`} target="_blank" rel="noreferrer">Open directions ↗</a></div> : null}
      </div>
      <div className="mosque-results" aria-live="polite">
        {mosques.map((mosque, index) => <article key={mosque.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{mosque.name}</h2><p>{mosque.address}</p><small>{mosque.distanceKm.toFixed(1)} km{mosque.denomination ? ` · ${mosque.denomination}` : ""}</small></div><a href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`} target="_blank" rel="noreferrer" aria-label={`Directions to ${mosque.name}`}>Directions ↗</a></article>)}
        {!loading && !mosques.length ? <div className="mosque-empty"><span aria-hidden="true">⌖</span><strong>Nearby mosques will appear here</strong><p>NOOR sorts live map results by straight-line distance from the selected location.</p></div> : null}
      </div>
    </section>
  );
}
