"use client";

import { useEffect, useMemo, useState } from "react";

const KAABA = { latitude: 21.4225, longitude: 39.8262 };

type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type PermissionedOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function radians(value: number) {
  return value * Math.PI / 180;
}

function degrees(value: number) {
  return value * 180 / Math.PI;
}

function normalize(value: number) {
  return (value % 360 + 360) % 360;
}

function qiblaBearing(latitude: number, longitude: number) {
  const startLatitude = radians(latitude);
  const kaabaLatitude = radians(KAABA.latitude);
  const longitudeDifference = radians(KAABA.longitude - longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(kaabaLatitude);
  const x = Math.cos(startLatitude) * Math.sin(kaabaLatitude) - Math.sin(startLatitude) * Math.cos(kaabaLatitude) * Math.cos(longitudeDifference);
  return normalize(degrees(Math.atan2(y, x)));
}

function distanceToKaaba(latitude: number, longitude: number) {
  const earthRadiusKm = 6371;
  const latitudeDifference = radians(KAABA.latitude - latitude);
  const longitudeDifference = radians(KAABA.longitude - longitude);
  const startLatitude = radians(latitude);
  const kaabaLatitude = radians(KAABA.latitude);
  const a = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(startLatitude) * Math.cos(kaabaLatitude) * Math.sin(longitudeDifference / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function QiblaCompass() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [orientationEnabled, setOrientationEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");
  const [compassMessage, setCompassMessage] = useState("");

  useEffect(() => {
    if (!orientationEnabled) return;

    const handleOrientation = (rawEvent: Event) => {
      const event = rawEvent as CompassEvent;
      if (typeof event.webkitCompassHeading === "number") {
        setHeading(normalize(event.webkitCompassHeading));
      } else if (event.absolute && typeof event.alpha === "number") {
        setHeading(normalize(360 - event.alpha));
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation);
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [orientationEnabled]);

  const bearing = useMemo(() => location ? qiblaBearing(location.latitude, location.longitude) : null, [location]);
  const distance = useMemo(() => location ? distanceToKaaba(location.latitude, location.longitude) : null, [location]);
  const needleRotation = bearing === null ? 0 : normalize(bearing - (heading ?? 0));
  const signedTurn = bearing === null || heading === null ? null : ((bearing - heading + 540) % 360) - 180;
  const aligned = signedTurn !== null && Math.abs(signedTurn) <= 3;

  async function requestCompassPermission() {
    if (!("DeviceOrientationEvent" in window)) {
      setCompassMessage("Live heading is not available on this device. Use the true-north bearing shown below.");
      return;
    }

    try {
      const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent;
      if (typeof OrientationEvent.requestPermission === "function") {
        const permission = await OrientationEvent.requestPermission();
        if (permission !== "granted") {
          setCompassMessage("Compass access was not granted. The Qibla bearing will still be shown from true north.");
          return;
        }
      }
      setOrientationEnabled(true);
      setCompassMessage("Move your phone in a figure-eight if the compass needs calibration.");
    } catch {
      setCompassMessage("The live compass could not start. The true-north bearing remains available.");
    }
  }

  async function startCompass() {
    setStatus("loading");
    setMessage("");
    await requestCompassPermission();

    if (!("geolocation" in navigator)) {
      setStatus("error");
      setMessage("Location is not supported by this browser. Try a current mobile browser with location enabled.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy });
        setStatus("ready");
      },
      (reason) => {
        setStatus("error");
        setMessage(reason.code === reason.PERMISSION_DENIED
          ? "Location permission was denied. Allow location for this site, then try again."
          : "Your location could not be determined. Move to an open area and try again.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  }

  const directionMessage = aligned
    ? "Aligned with Qibla"
    : signedTurn === null
      ? "Align your device with true north"
      : `Turn ${Math.abs(Math.round(signedTurn))}° ${signedTurn > 0 ? "right" : "left"}`;

  return (
    <div className="qibla-tool">
      <section className="qibla-intro">
        <p className="eyebrow">LOCATION-BASED DIRECTION</p>
        <h1>Face the Qibla<br/><em>with clarity.</em></h1>
        <p>NOOR calculates the great-circle direction from your current location to the Kaaba. On supported phones, the arrow moves with your compass.</p>
      </section>

      <section className="qibla-layout">
        <article className="qibla-compass-card">
          <div className={aligned ? "compass-face is-aligned" : "compass-face"} aria-label={bearing === null ? "Qibla compass waiting for location" : `Qibla is ${Math.round(bearing)} degrees from true north`}>
            <span className="compass-ticks"/>
            <b className="cardinal north">N</b><b className="cardinal east">E</b><b className="cardinal south">S</b><b className="cardinal west">W</b>
            <span className="qibla-needle" style={{ transform: `translate(-50%, -50%) rotate(${needleRotation}deg)` }}><i/><strong>KAABA</strong></span>
            <span className="compass-center">✦</span>
          </div>
          <div className="qibla-primary-readout">
            <span>{bearing === null ? "QIBLA BEARING" : directionMessage.toUpperCase()}</span>
            <strong>{bearing === null ? "—" : `${Math.round(bearing)}°`}</strong>
            <p>{heading === null ? "from true north" : `Qibla bearing · device heading ${Math.round(heading)}°`}</p>
          </div>
        </article>

        <aside className="qibla-control-card">
          <span>PRIVATE BY DESIGN</span>
          <h2>Your coordinates stay in this browser.</h2>
          <p>Location is used only to calculate the direction on your device. NOOR does not save it.</p>
          <button type="button" onClick={startCompass} disabled={status === "loading"}>{status === "loading" ? "Finding your location…" : location ? "Refresh location & compass" : "Enable location & compass"}</button>
          {message ? <p className="qibla-error" role="alert">{message}</p> : null}
          {compassMessage ? <p className="qibla-compass-message">{compassMessage}</p> : null}
          {location ? <div className="qibla-stats">
            <span><small>LOCATION</small><strong>{location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</strong></span>
            <span><small>ACCURACY</small><strong>About {Math.round(location.accuracy)} m</strong></span>
            <span><small>DISTANCE TO KAABA</small><strong>{distance === null ? "—" : `${Math.round(distance).toLocaleString("en-IN")} km`}</strong></span>
          </div> : null}
        </aside>
      </section>

      <section className="qibla-guidance-grid">
        <article><span>01</span><div><strong>Hold the phone flat</strong><p>Keep the top edge of your phone pointing forward and away from your body.</p></div></article>
        <article><span>02</span><div><strong>Calibrate if needed</strong><p>Move the phone in a figure-eight, then keep away from metal objects, magnets and some cases.</p></div></article>
        <article><span>03</span><div><strong>Follow the arrow</strong><p>Turn until the arrow points straight up and the compass shows that you are aligned.</p></div></article>
      </section>

      <aside className="qibla-accuracy-note"><strong>Accuracy reminder</strong><p>Phone compasses can be affected by magnetic interference. For construction, permanent mihrab alignment or any critical use, verify the direction with reliable local mosque guidance or a surveyed reference.</p></aside>
    </div>
  );
}
