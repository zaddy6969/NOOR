"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KAABA = { latitude: 21.4225, longitude: 39.8262 };
const CITY_PRESETS = [
  { id: "bengaluru", label: "Bengaluru", latitude: 12.9716, longitude: 77.5946 },
  { id: "mumbai", label: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { id: "delhi", label: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { id: "hyderabad", label: "Hyderabad", latitude: 17.385, longitude: 78.4867 },
  { id: "kolkata", label: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { id: "lucknow", label: "Lucknow", latitude: 26.8467, longitude: 80.9462 },
] as const;

type UserLocation = { latitude: number; longitude: number; accuracy: number | null; label: string };
type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type PermissionedOrientationEvent = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

function toRadians(value: number) { return value * Math.PI / 180; }
function toDegrees(value: number) { return value * 180 / Math.PI; }
function normalize(value: number) { return (value % 360 + 360) % 360; }

function qiblaBearing(latitude: number, longitude: number) {
  const startLatitude = toRadians(latitude);
  const kaabaLatitude = toRadians(KAABA.latitude);
  const longitudeDifference = toRadians(KAABA.longitude - longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(kaabaLatitude);
  const x = Math.cos(startLatitude) * Math.sin(kaabaLatitude)
    - Math.sin(startLatitude) * Math.cos(kaabaLatitude) * Math.cos(longitudeDifference);
  return normalize(toDegrees(Math.atan2(y, x)));
}

function screenAngle() {
  const legacy = (window as Window & { orientation?: number }).orientation;
  return window.screen.orientation?.angle ?? legacy ?? 0;
}

function cardinalDirection(bearing: number) {
  const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return points[Math.round(normalize(bearing) / 22.5) % 16];
}

export default function QiblaCompass() {
  const [location, setLocation] = useState<UserLocation>(() => ({ ...CITY_PRESETS[0], accuracy: null }));
  const [selectedCity, setSelectedCity] = useState<string>(CITY_PRESETS[0].id);
  const [verifiedBearing, setVerifiedBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [locationError, setLocationError] = useState("");
  const [orientationEnabled, setOrientationEnabled] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [sensorAccuracy, setSensorAccuracy] = useState<number | null>(null);
  const headingRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("noor-qibla-city-v1");
      const city = CITY_PRESETS.find((item) => item.id === saved);
      if (city) {
        setSelectedCity(city.id);
        setLocation({ ...city, accuracy: null });
      }
      if (!("DeviceOrientationEvent" in window)) return;
      const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
      if (typeof OrientationEvent.requestPermission === "function") setNeedsPermission(true);
      else setOrientationEnabled(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/qibla?latitude=${location.latitude}&longitude=${location.longitude}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { direction?: number }) => {
        const direction = Number(payload.direction);
        if (Number.isFinite(direction)) setVerifiedBearing(normalize(direction));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [location.latitude, location.longitude]);

  const findLocation = useCallback(() => {
    setLocationState("loading");
    setLocationError("");
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      setLocationError("Location is not available. Choose a city instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setVerifiedBearing(null);
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, label: "Current location" });
        setSelectedCity("live");
        setLocationState("ready");
      },
      (error) => {
        setLocationState("error");
        setLocationError(error.code === error.PERMISSION_DENIED
          ? "Location was blocked. Choose a city or allow it in browser settings."
          : "Location could not be found. Choose a city and try again later.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 120000 },
    );
  }, []);

  useEffect(() => {
    if (!orientationEnabled) return;
    const handleOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassEvent;
      let next: number | null = null;
      if (typeof event.webkitCompassHeading === "number") {
        next = normalize(event.webkitCompassHeading);
        if (typeof event.webkitCompassAccuracy === "number") setSensorAccuracy(event.webkitCompassAccuracy);
      } else if (event.absolute && typeof event.alpha === "number") {
        next = normalize(360 - event.alpha + screenAngle());
      }
      if (next === null) return;
      const previous = headingRef.current;
      const smoothed = previous === null ? next : normalize(previous + ((((next - previous + 540) % 360) - 180) * 0.22));
      headingRef.current = smoothed;
      setHeading(smoothed);
    };
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [orientationEnabled]);

  const calculatedBearing = useMemo(() => qiblaBearing(location.latitude, location.longitude), [location.latitude, location.longitude]);
  const bearing = verifiedBearing ?? calculatedBearing;
  const qiblaRotation = normalize(bearing - (heading ?? 0));
  const northRotation = heading === null ? 0 : -heading;
  const signedTurn = heading === null ? null : ((bearing - heading + 540) % 360) - 180;
  const aligned = signedTurn !== null && Math.abs(signedTurn) <= 4;
  const weakSensor = sensorAccuracy !== null && sensorAccuracy > 30;

  async function enableCompass() {
    try {
      const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
      const permission = await OrientationEvent.requestPermission?.();
      if (permission === "denied") return;
      setNeedsPermission(false);
      setOrientationEnabled(true);
    } catch {
      setNeedsPermission(false);
    }
  }

  function chooseCity(id: string) {
    const city = CITY_PRESETS.find((item) => item.id === id) ?? CITY_PRESETS[0];
    setSelectedCity(city.id);
    setVerifiedBearing(null);
    setLocation({ ...city, accuracy: null });
    setLocationState("idle");
    setLocationError("");
    window.localStorage.setItem("noor-qibla-city-v1", city.id);
  }

  const status = heading === null
    ? `${Math.round(bearing)}° ${cardinalDirection(bearing)} from true north`
    : aligned
      ? "Qibla aligned"
      : `Turn ${Math.abs(Math.round(signedTurn ?? 0))}° ${(signedTurn ?? 0) > 0 ? "right" : "left"}`;

  return (
    <section className="qibla-compact-tool">
      <div className="qibla-location-controls">
        <label>Location<select value={selectedCity} onChange={(event) => chooseCity(event.target.value)}><option value="live" disabled>Current location</option>{CITY_PRESETS.map((city) => <option value={city.id} key={city.id}>{city.label}</option>)}</select></label>
        <button type="button" onClick={findLocation} disabled={locationState === "loading"}>{locationState === "loading" ? "Locating…" : "Use my location"}</button>
      </div>

      <div className={`qibla-compact-face${aligned ? " is-aligned" : ""}`} aria-label={`Qibla bearing ${Math.round(bearing)} degrees ${cardinalDirection(bearing)}`}>
        <div className="qibla-dial" style={{ transform: `rotate(${northRotation}deg)` }}>
          <span className="qibla-ticks" />
          <b className="qibla-cardinal qibla-n">N</b><b className="qibla-cardinal qibla-e">E</b><b className="qibla-cardinal qibla-s">S</b><b className="qibla-cardinal qibla-w">W</b>
        </div>
        <span className="north-needle" style={{ transform: `translate(-50%, -50%) rotate(${northRotation}deg)` }} aria-hidden="true"><i /><i /></span>
        <span className="qibla-red-arrow" style={{ transform: `translate(-50%, -50%) rotate(${qiblaRotation}deg)` }} aria-hidden="true"><i /><b className="kaaba-marker"><span /></b></span>
        <span className="qibla-pin" aria-hidden="true" />
      </div>

      <div className="qibla-compact-readout" role="status">
        <strong>{status}</strong>
        <span>{location.label} · Qibla {Math.round(bearing)}° {cardinalDirection(bearing)}{heading === null ? " · bearing mode" : ` · phone heading ${Math.round(heading)}°`}</span>
        {location.accuracy ? <small>Location accuracy ±{Math.round(location.accuracy)} m</small> : null}
        {weakSensor ? <small>Low compass accuracy — move the phone in a figure eight.</small> : null}
        {locationError ? <small>{locationError}</small> : null}
      </div>

      <div className="qibla-compact-actions">
        {needsPermission ? <button type="button" onClick={enableCompass}>Enable live compass</button> : null}
        {!needsPermission && heading === null ? <span>Live turning is unavailable on this device; use the degree bearing from true north.</span> : null}
      </div>
      <p className="qibla-one-line">Hold the phone flat. Keep it away from magnets and recalibrate after rotating the screen.</p>
    </section>
  );
}
