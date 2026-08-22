"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KAABA = { latitude: 21.4225, longitude: 39.8262 };

type UserLocation = { latitude: number; longitude: number; accuracy: number };
type CompassEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
};
type PermissionedOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

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
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [verifiedBearing, setVerifiedBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [locationState, setLocationState] = useState<"loading" | "ready" | "error">("loading");
  const [locationError, setLocationError] = useState("");
  const [orientationEnabled, setOrientationEnabled] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [sensorAccuracy, setSensorAccuracy] = useState<number | null>(null);
  const headingRef = useRef<number | null>(null);

  const findLocation = useCallback(() => {
    setLocationState("loading");
    setLocationError("");
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      setLocationError("Location is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocation(nextLocation);
        setVerifiedBearing(null);
        fetch(`/api/qibla?latitude=${nextLocation.latitude}&longitude=${nextLocation.longitude}`)
          .then((response) => response.ok ? response.json() : Promise.reject())
          .then((payload: { direction?: number }) => {
            const direction = Number(payload.direction);
            if (Number.isFinite(direction)) setVerifiedBearing(normalize(direction));
          })
          .catch(() => undefined);
        setLocationState("ready");
      },
      (error) => {
        setLocationState("error");
        setLocationError(error.code === error.PERMISSION_DENIED
          ? "Allow location access, then tap retry."
          : "Location could not be found. Move to an open area and retry.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 120000 },
    );
  }, []);

  useEffect(() => {
    findLocation();
    if (!("DeviceOrientationEvent" in window)) return;
    const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
    if (typeof OrientationEvent.requestPermission === "function") setNeedsPermission(true);
    else setOrientationEnabled(true);
  }, [findLocation]);

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
      const smoothed = previous === null
        ? next
        : normalize(previous + ((((next - previous + 540) % 360) - 180) * 0.22));
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

  const calculatedBearing = useMemo(
    () => location ? qiblaBearing(location.latitude, location.longitude) : null,
    [location],
  );
  const bearing = verifiedBearing ?? calculatedBearing;
  const qiblaRotation = bearing === null ? 0 : normalize(bearing - (heading ?? 0));
  const northRotation = heading === null ? 0 : -heading;
  const signedTurn = bearing === null || heading === null ? null : ((bearing - heading + 540) % 360) - 180;
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

  const status = bearing === null
    ? locationState === "loading" ? "Finding your location…" : locationError
    : heading === null
      ? `${Math.round(bearing)}° ${cardinalDirection(bearing)} from true north`
      : aligned
        ? "Qibla aligned"
        : `Turn ${Math.abs(Math.round(signedTurn ?? 0))}° ${(signedTurn ?? 0) > 0 ? "right" : "left"}`;

  return (
    <section className="qibla-compact-tool">
      <div className={`qibla-compact-face${aligned ? " is-aligned" : ""}`} aria-label={bearing === null ? "Waiting for Qibla bearing" : `Qibla bearing ${Math.round(bearing)} degrees ${cardinalDirection(bearing)}`}>
        <div className="qibla-dial" style={{ transform: `rotate(${northRotation}deg)` }}>
          <span className="qibla-ticks" />
          <b className="qibla-cardinal qibla-n">N</b>
          <b className="qibla-cardinal qibla-e">E</b>
          <b className="qibla-cardinal qibla-s">S</b>
          <b className="qibla-cardinal qibla-w">W</b>
        </div>
        <span className="north-needle" style={{ transform: `translate(-50%, -50%) rotate(${northRotation}deg)` }} aria-hidden="true"><i /><i /></span>
        {bearing !== null ? <span className="qibla-red-arrow" style={{ transform: `translate(-50%, -50%) rotate(${qiblaRotation}deg)` }} aria-hidden="true"><i /><b role="img" aria-label="Kaaba">🕋</b></span> : null}
        <span className="qibla-pin" aria-hidden="true" />
      </div>

      <div className="qibla-compact-readout" role="status">
        <strong>{status}</strong>
        {bearing !== null ? <span>Qibla {Math.round(bearing)}° {cardinalDirection(bearing)}{heading === null ? " · bearing only" : ` · heading ${Math.round(heading)}°`}</span> : null}
        {weakSensor ? <small>Compass accuracy is low — move the phone in a figure eight.</small> : null}
      </div>

      <div className="qibla-compact-actions">
        {needsPermission ? <button type="button" onClick={enableCompass}>Enable live compass</button> : null}
        {locationState === "error" ? <button type="button" onClick={findLocation}>Retry location</button> : null}
        {locationState === "ready" ? <button className="qibla-refresh" type="button" onClick={findLocation}>Refresh</button> : null}
      </div>
      <p className="qibla-one-line">Hold the phone flat and keep it away from magnets or metal.</p>
    </section>
  );
}
