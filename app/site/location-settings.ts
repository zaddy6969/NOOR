export type NoorLocation = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  source: "preset" | "device";
};

export const NOOR_LOCATION_KEY = "noor-location-v1";
export const NOOR_LOCATION_EVENT = "noor:location-change";

export const NOOR_CITIES: NoorLocation[] = [
  { id: "bengaluru", label: "Bengaluru", latitude: 12.9716, longitude: 77.5946, accuracy: null, source: "preset" },
  { id: "mumbai", label: "Mumbai", latitude: 19.076, longitude: 72.8777, accuracy: null, source: "preset" },
  { id: "delhi", label: "Delhi", latitude: 28.6139, longitude: 77.209, accuracy: null, source: "preset" },
  { id: "hyderabad", label: "Hyderabad", latitude: 17.385, longitude: 78.4867, accuracy: null, source: "preset" },
  { id: "kolkata", label: "Kolkata", latitude: 22.5726, longitude: 88.3639, accuracy: null, source: "preset" },
  { id: "lucknow", label: "Lucknow", latitude: 26.8467, longitude: 80.9462, accuracy: null, source: "preset" },
];

export const DEFAULT_NOOR_LOCATION = NOOR_CITIES[0];

function isLocation(value: unknown): value is NoorLocation {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NoorLocation>;
  return typeof candidate.id === "string"
    && typeof candidate.label === "string"
    && Number.isFinite(candidate.latitude)
    && Number.isFinite(candidate.longitude)
    && (candidate.source === "preset" || candidate.source === "device");
}

export function readNoorLocation(): NoorLocation {
  if (typeof window === "undefined") return DEFAULT_NOOR_LOCATION;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(NOOR_LOCATION_KEY) ?? "null") as unknown;
    return isLocation(parsed) ? parsed : DEFAULT_NOOR_LOCATION;
  } catch {
    return DEFAULT_NOOR_LOCATION;
  }
}

export function writeNoorLocation(location: NoorLocation) {
  window.localStorage.setItem(NOOR_LOCATION_KEY, JSON.stringify(location));
  window.dispatchEvent(new CustomEvent<NoorLocation>(NOOR_LOCATION_EVENT, { detail: location }));
}

export function locationFromCity(id: string) {
  return NOOR_CITIES.find((city) => city.id === id) ?? DEFAULT_NOOR_LOCATION;
}
