"use client";
import NoorSelect from "../site/NoorSelect";
import { useEffect, useState } from "react";
import {
  NOOR_CITIES,
  writeNoorLocation,
  type NoorLocation,
} from "../site/location-settings";

export default function LocationPicker({
  location,
  confirmed,
}: {
  location: NoorLocation;
  confirmed: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NoorLocation[]>([]);
  const [message, setMessage] = useState("");
  const [locating, setLocating] = useState(false);
  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setMessage("Searching cities…");
      try {
        const response = await fetch(
          "/api/locations?q=" + encodeURIComponent(query.trim()),
          { signal: controller.signal },
        );
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error ?? "City search unavailable.");
        if (!controller.signal.aborted) {
          setResults(payload.locations ?? []);
          setMessage(
            payload.locations?.length
              ? "Select your city below."
              : "No cities found. Try a city and country.",
          );
        }
      } catch (reason) {
        if (!controller.signal.aborted) {
          setResults([]);
          setMessage(
            reason instanceof Error
              ? reason.message
              : "City search unavailable.",
          );
        }
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  const choose = (city: NoorLocation) => {
    writeNoorLocation(city);
    setQuery("");
    setResults([]);
    setMessage("Selected " + city.label);
  };
  const locate = () => {
    if (!navigator.geolocation) {
      setMessage("Device location unavailable. Search for your city.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        choose({
          id: "current",
          label: "Current location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: "device",
        });
        setLocating(false);
      },
      () => {
        setMessage(
          "Location permission unavailable. Search for your city instead.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };
  return (
    <section className="location-picker" aria-label="Choose location">
      <p>
        <strong>{location.label}</strong>
        {!confirmed
          ? " · default city — choose your location"
          : " · selected location"}
        {location.accuracy
          ? " · accuracy about " + Math.round(location.accuracy) + " m"
          : ""}
      </p>
      <div>
        <label>
          Search city or postal code
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setResults([]);
              setMessage("");
            }}
            placeholder="e.g. London, UK"
            maxLength={100}
          />
        </label>
        <button type="button" onClick={locate} disabled={locating}>
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>
      {query.trim().length >= 2 ? (
        <ul>
          {results.map((city) => (
            <li key={city.id}>
              <button type="button" onClick={() => choose(city)}>
                {city.label}
                <small>{city.timezone}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <label>
        Quick city selection
        <NoorSelect aria-label="Quick city selection"
          value={location.source === "preset" ? location.id : ""}
          onChange={(event) => {
            const city = NOOR_CITIES.find(
              (item) => item.id === event.target.value,
            );
            if (city) choose(city);
          }}
        >
          <option value="" disabled>
            Choose a preset city
          </option>
          {NOOR_CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.label}
            </option>
          ))}
        </NoorSelect>
      </label>
      <small role="status">{message}</small>
      <small>
        City search: Open-Meteo / GeoNames. Search terms are sent to the
        provider.
      </small>
    </section>
  );
}
