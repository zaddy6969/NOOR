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
type SensorMode = "idle" | "waiting" | "absolute" | "relative" | "blocked" | "unavailable";

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
  const [sensorMode, setSensorMode] = useState<SensorMode>("idle");
  const [sensorAttempt, setSensorAttempt] = useState(0);
  const [relativeCalibrated, setRelativeCalibrated] = useState(false);
  const headingRef = useRef<number | null>(null);
  const latestRelativeRef = useRef<number | null>(null);
  const calibrationOffsetRef = useRef(0);
  const hasAbsoluteRef = useRef(false);
  const gotReadingRef = useRef(false);

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
      else {
        setSensorMode("waiting");
        setOrientationEnabled(true);
      }
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
    gotReadingRef.current = false;
    const readingTimeout = window.setTimeout(() => {
      if (!gotReadingRef.current) setSensorMode("unavailable");
    }, 3500);
    const handleOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassEvent;
      let next: number | null = null;
      if (typeof event.webkitCompassHeading === "number") {
        next = normalize(event.webkitCompassHeading + screenAngle());
        hasAbsoluteRef.current = true;
        setSensorMode("absolute");
        if (typeof event.webkitCompassAccuracy === "number") setSensorAccuracy(event.webkitCompassAccuracy);
      } else if (typeof event.alpha === "number") {
        const rawHeading = normalize(360 - event.alpha + screenAngle());
        const isAbsolute = event.absolute || rawEvent.type === "deviceorientationabsolute";
        if (isAbsolute) {
          next = rawHeading;
          hasAbsoluteRef.current = true;
          setSensorMode("absolute");
        } else {
          if (hasAbsoluteRef.current) return;
          latestRelativeRef.current = rawHeading;
          next = normalize(rawHeading + calibrationOffsetRef.current);
          setSensorMode("relative");
        }
      }
      if (next === null) return;
      gotReadingRef.current = true;
      window.clearTimeout(readingTimeout);
      const previous = headingRef.current;
      const smoothed = previous === null ? next : normalize(previous + ((((next - previous + 540) % 360) - 180) * 0.22));
      headingRef.current = smoothed;
      setHeading(smoothed);
    };
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.clearTimeout(readingTimeout);
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [orientationEnabled, sensorAttempt]);

  const calculatedBearing = useMemo(() => qiblaBearing(location.latitude, location.longitude), [location.latitude, location.longitude]);
  const bearing = verifiedBearing ?? calculatedBearing;
  const qiblaRotation = normalize(bearing - (heading ?? 0));
  const northRotation = heading === null ? 0 : -heading;
  const signedTurn = heading === null ? null : ((bearing - heading + 540) % 360) - 180;
  const aligned = signedTurn !== null && Math.abs(signedTurn) <= 4;
  const weakSensor = sensorAccuracy !== null && sensorAccuracy > 30;

  async function enableCompass() {
    try {
      setSensorMode("waiting");
      setHeading(null);
      headingRef.current = null;
      latestRelativeRef.current = null;
      calibrationOffsetRef.current = 0;
      hasAbsoluteRef.current = false;
      setRelativeCalibrated(false);
      const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
      const permission = await OrientationEvent.requestPermission?.();
      if (permission === "denied") {
        setSensorMode("blocked");
        return;
      }
      setNeedsPermission(false);
      setOrientationEnabled(true);
      setSensorAttempt((attempt) => attempt + 1);
    } catch {
      setNeedsPermission(false);
      setSensorMode("blocked");
    }
  }

  function calibrateNorth() {
    const rawHeading = latestRelativeRef.current;
    if (rawHeading === null) return;
    calibrationOffsetRef.current = normalize(-rawHeading);
    headingRef.current = 0;
    setHeading(0);
    setRelativeCalibrated(true);
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

  const status = sensorMode === "relative" && !relativeCalibrated
    ? "Point phone north, then calibrate"
    : heading === null
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
        {sensorMode === "absolute" ? <small className="qibla-sensor-ok">Live compass · true-north sensor</small> : null}
        {sensorMode === "relative" && relativeCalibrated ? <small className="qibla-sensor-ok">Live compass · north calibrated</small> : null}
        {sensorMode === "relative" && !relativeCalibrated ? <small>Phone movement detected. Face the top of the phone north, then tap Calibrate north.</small> : null}
        {sensorMode === "waiting" ? <small>Starting phone compass…</small> : null}
        {sensorMode === "blocked" ? <small>Motion access is blocked. Allow motion/orientation in browser settings, then retry.</small> : null}
        {sensorMode === "unavailable" ? <small>No sensor reading received. Retry in Chrome/Safari on a phone with compass access.</small> : null}
        {location.accuracy ? <small>Location accuracy ±{Math.round(location.accuracy)} m</small> : null}
        {weakSensor ? <small>Low compass accuracy — move the phone in a figure eight.</small> : null}
        {locationError ? <small>{locationError}</small> : null}
      </div>

      <div className="qibla-compact-actions">
        <button type="button" onClick={enableCompass}>{needsPermission ? "Enable live compass" : heading === null ? "Start live compass" : "Restart compass"}</button>
        {sensorMode === "relative" && !relativeCalibrated ? <button type="button" className="qibla-calibrate" onClick={calibrateNorth}>Calibrate north</button> : null}
      </div>
      <p className="qibla-one-line">Hold the phone flat. Keep it away from magnets and recalibrate after rotating the screen.</p>
    </section>
  );
}
