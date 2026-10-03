"use client";

import { useEffect, useMemo, useState } from "react";
import LocationPicker from "../prayer-times/LocationPicker";
import { DEFAULT_NOOR_LOCATION, NOOR_LOCATION_EVENT, NOOR_LOCATION_KEY, readNoorLocation, type NoorLocation } from "../site/location-settings";

type PlaceKind = "Mosque" | "Dargah";
type Mosque = { id: string; name: string; address: string; denomination: string | null; phone: string | null; website: string | null; kind: PlaceKind; lat: number; lng: number; distanceKm: number };
type PlaceFilter = "Mosques" | "All places" | "Dargahs";


function mapEmbedUrl(point: { lat: number; lng: number }) {
  const offset = 0.018;
  const bbox = [point.lng - offset, point.lat - offset, point.lng + offset, point.lat + offset].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${point.lat}%2C${point.lng}`;
}

export default function MosqueFinder() {
  const [radius, setRadius] = useState(5000);
  const [location, setLocation] = useState<NoorLocation>(DEFAULT_NOOR_LOCATION);
  const [locationReady, setLocationReady] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [retry, setRetry] = useState(0);
  const center = { lat: location.latitude, lng: location.longitude, label: location.label };
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<PlaceFilter>("Mosques");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading your selected location…");

  useEffect(() => {
    const refresh = () => {
      setLocation(readNoorLocation());
      try { setConfirmed(Boolean(window.localStorage.getItem(NOOR_LOCATION_KEY))); } catch { setConfirmed(false); }
      setLocationReady(true);
    };
    const frame = requestAnimationFrame(refresh);
    const storage = (event: StorageEvent) => { if (event.key === NOOR_LOCATION_KEY || event.key === null) refresh(); };
    window.addEventListener(NOOR_LOCATION_EVENT, refresh);
    window.addEventListener("storage", storage);
    return () => { cancelAnimationFrame(frame); window.removeEventListener(NOOR_LOCATION_EVENT, refresh); window.removeEventListener("storage", storage); };
  }, []);

  useEffect(() => {
    if (!locationReady) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setMosques([]); setActiveId(null); setMessage("Searching the live community map…");
      try {
        const response = await fetch(`/api/mosques?lat=${location.latitude}&lng=${location.longitude}&radius=${radius}`, { signal: controller.signal });
        const payload = await response.json() as { mosques?: Mosque[]; error?: string };
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error(payload.error ?? "Places could not be loaded.");
        const next = Array.isArray(payload.mosques) ? payload.mosques : [];
        setMosques(next); setActiveId(next[0]?.id ?? null);
        setMessage(next.length ? `${next.length} mapped Islamic places found near ${location.label}.` : `No mapped place was found within ${radius / 1000} km. Try a wider radius.`);
      } catch (error) {
        if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "The live mosque map is unavailable.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [location, locationReady, radius, retry]);

  const visible = useMemo(() => mosques.filter((place) => filter === "All places" || (filter === "Mosques" ? place.kind === "Mosque" : place.kind === "Dargah")), [filter, mosques]);
  const nearest = visible[0] ?? null;
  const active = visible.find((place) => place.id === activeId) ?? nearest;
  const mapPoint = active ?? center;

  return (
    <section className="mosque-finder-working">
      <div className="mosque-control-card">
        <LocationPicker location={location} confirmed={confirmed} />
        <p className="mosque-status">This location is shared with Prayer Times and Qibla. Map searches send the selected coordinates to OpenStreetMap providers.</p>
        <div className="mosque-locate-row"><label>Radius<select value={radius} onChange={(event) => setRadius(Number(event.target.value))}><option value={3000}>3 km</option><option value={5000}>5 km</option><option value={10000}>10 km</option><option value={20000}>20 km</option></select></label><button type="button" disabled={loading || !locationReady} onClick={() => setRetry((value) => value + 1)}>Refresh nearby places</button></div>
        <div className="mosque-kind-filter" role="group" aria-label="Place type">{(["Mosques", "All places", "Dargahs"] as PlaceFilter[]).map((item) => <button className={filter === item ? "active" : ""} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <p className="mosque-status" role="status">{message}</p>
        <p className="mosque-status">OpenStreetMap is community maintained and may be incomplete. Distance is a straight-line estimate. Confirm facilities, opening hours and congregation (iqamah) times directly with the mosque.</p>
        {locationReady && mapPoint ? <div className="mosque-map"><iframe title={`Map of ${active?.name ?? center?.label ?? "selected area"}`} src={mapEmbedUrl(mapPoint)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div> : null}

        {active && center ? <div className="mosque-nearest"><span>SELECTED PLACE · {active.kind.toUpperCase()}</span><strong>{active.name}</strong><p>{active.distanceKm.toFixed(1)} km away · {active.address}</p><a href={`https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lng}&destination=${active.lat},${active.lng}`} target="_blank" rel="noreferrer">Open directions ↗</a></div> : null}
      </div>
      <div className="mosque-results" aria-live="polite">
        {visible.map((mosque, index) => <article className={mosque.id === active?.id ? "active" : ""} key={mosque.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small className="mosque-kind">{mosque.kind}</small><h2>{mosque.name}</h2><p>{mosque.address}</p><small>{mosque.distanceKm.toFixed(1)} km{mosque.denomination ? ` · ${mosque.denomination}` : ""}</small></div><div className="mosque-result-actions"><button type="button" onClick={() => setActiveId(mosque.id)}>View map</button><a href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`} target="_blank" rel="noreferrer" aria-label={`Directions to ${mosque.name}`}>Directions ↗</a>{/^(node|way|relation)-\d+$/.test(mosque.id) ? <a href={`https://www.openstreetmap.org/${mosque.id.replace("-", "/")}`} target="_blank" rel="noreferrer" aria-label={`View or correct the map record for ${mosque.name}`}>Map record ↗</a> : null}</div></article>)}
        {!loading && !visible.length ? <div className="mosque-empty"><span aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 43s14-11.4 14-25A14 14 0 1 0 10 18c0 13.6 14 25 14 25Z"/><circle cx="24" cy="18" r="5"/></svg></span><strong>No {filter.toLowerCase()} in this view</strong><p>Try another filter, choose a city or increase the radius.</p></div> : null}
      </div>
    </section>
  );
}
