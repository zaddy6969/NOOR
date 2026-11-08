"use client";
import { useEffect, useState } from "react";
import { personalStorage } from "@/lib/personal-storage";
import {
  REMINDER_KEY,
  validReminders,
  type ReminderSettings,
} from "@/lib/prayer-reminders";
import { PRAYERS, type PrayerSchedule } from "@/lib/prayer-schedule";
import { readNoorLocation } from "../site/location-settings";
import { readPrayerSettings } from "./usePrayerSchedule";
import { useNoorCopy } from "../site/SiteUtilities";
import NoorSelect from "../site/NoorSelect";
const DEFAULT: ReminderSettings = {
  enabled: false,
  prayers: [...PRAYERS],
  minutes: 0,
};
const DEVICE_KEY = "noor-push-device-v1";
type Device = { id: string; token: string; expiresAt: string };
function readDevice(): Device | null {
  try {
    const v = JSON.parse(localStorage.getItem(DEVICE_KEY) ?? "null");
    return v && typeof v.id === "string" && typeof v.token === "string"
      ? v
      : null;
  } catch {
    return null;
  }
}
export default function PrayerReminders({
  schedule,
  location,
  confirmed,
}: {
  schedule: PrayerSchedule | null;
  location: string;
  confirmed: boolean;
}) {
  const { t, locale } = useNoorCopy();
  const [settings, setSettings] = useState(DEFAULT),
    [device, setDevice] = useState<Device | null>(null),
    [available, setAvailable] = useState(false),
    [permission, setPermission] = useState("Checking support…"),
    [status, setStatus] = useState("off"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [days, setDays] = useState(7);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      setPermission(
        "Notification" in window ? Notification.permission : "unsupported",
      );
      try {
        const v = JSON.parse(personalStorage.getItem(REMINDER_KEY) ?? "null");
        if (validReminders(v)) setSettings(v);
      } catch {
        /* default preferences */
      }
    };
    refresh();
    const check = () => {
      const saved = readDevice();
      void fetch("/api/reminders" + (saved ? `?id=${saved.id}` : ""), {
        headers: saved ? { Authorization: `Bearer ${saved.token}` } : {},
      })
        .then((r) => r.json())
        .then((data) => {
          if (!active) return;
          setAvailable(data.available === true);
          if (data.device && saved) {
            setDevice({ ...saved, expiresAt: data.device.expires_at });
            setStatus(data.device.status);
          } else if (data.available) {
            setDevice(null);
            setStatus("off");
          }
        })
        .catch(() => {
          if (active)
            setMessage("Could not check reminder status. Please retry.");
        });
    };
    check();
    window.addEventListener("noor:reminders-change", refresh);
    window.addEventListener("focus", check);
    window.addEventListener("noor:push-change", check);
    return () => {
      active = false;
      window.removeEventListener("noor:reminders-change", refresh);
      window.removeEventListener("focus", check);
      window.removeEventListener("noor:push-change", check);
    };
  }, []);
  const save = (next: ReminderSettings) => {
    try {
      personalStorage.setItem(REMINDER_KEY, JSON.stringify(next));
      setSettings(next);
      window.dispatchEvent(new Event("noor:reminders-change"));
      if (device) setMessage("Apply changes to update background reminders.");
    } catch {
      setMessage("Reminder preferences could not be saved.");
    }
  };
  const send = async (body: object, registration = device) => {
    const r = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(registration
          ? { Authorization: `Bearer ${registration.token}` }
          : {}),
      },
      body: JSON.stringify({
        ...body,
        ...(registration ? { id: registration.id } : {}),
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ?? "Reminders unavailable.");
    return data;
  };
  const enable = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (!("Notification" in window) || !("PushManager" in window))
        throw new Error(
          "Install NOOR to your iPhone Home Screen, or use a browser with push support.",
        );
      const support = await fetch("/api/reminders").then((r) => r.json());
      if (!support.available)
        throw new Error(
          "Background delivery is unavailable. Use calendar reminders.",
        );
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted")
        throw new Error(
          "Permission was not granted. Use calendar reminders or change browser permissions.",
        );
      const worker = await navigator.serviceWorker.getRegistration();
      if (!worker?.active)
        throw new Error("Reload NOOR to prepare notifications.");
      const binary = atob(
        support.publicKey.replace(/-/g, "+").replace(/_/g, "/"),
      );
      const key = Uint8Array.from(binary, (c: string) => c.charCodeAt(0));
      const subscription =
        (await worker.pushManager.getSubscription()) ??
        (await worker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key,
        }));
      const city = readNoorLocation(),
        calculation = readPrayerSettings();
      const data = await send(
        {
          subscription: subscription.toJSON(),
          settings: { ...settings, enabled: true },
          location: {
            latitude: city.latitude,
            longitude: city.longitude,
            city: city.label,
            timezone: schedule?.timezone ?? city.timezone,
            ...calculation,
          },
        },
        device,
      );
      const next = {
        id: data.id,
        token: data.token,
        expiresAt: data.expiresAt,
      };
      localStorage.setItem(DEVICE_KEY, JSON.stringify(next));
      setDevice(next);
      setStatus("queued");
      save({ ...settings, enabled: true });
      setMessage(
        "Registration received. Check delivery status, then send a test.",
      );
      window.dispatchEvent(new Event("noor:push-change"));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Reminders unavailable.",
      );
    } finally {
      setBusy(false);
    }
  };
  const disable = async () => {
    setBusy(true);
    try {
      const saved = readDevice();
      if (saved) await send({ action: "disable" }, saved);
      const worker = await navigator.serviceWorker.getRegistration();
      await (await worker?.pushManager.getSubscription())?.unsubscribe();
      localStorage.removeItem(DEVICE_KEY);
      setDevice(null);
      setStatus("off");
      save({ ...settings, enabled: false });
      setMessage("Background reminders disabled.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not disable reminders. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  };
  const city = typeof window !== "undefined" ? readNoorLocation() : null,
    calculation = typeof window !== "undefined" ? readPrayerSettings() : null;
  const href =
    schedule && confirmed && city && calculation && settings.prayers.length
      ? "/api/prayer-times/calendar?" +
        new URLSearchParams({
          date: schedule.dateISO,
          timezone: schedule.timezone,
          city: location,
          methodId: String(calculation.method),
          school: String(calculation.school),
          adjustment: String(calculation.adjustment),
          latitude: String(city.latitude),
          longitude: String(city.longitude),
          minutes: String(settings.minutes),
          prayers: settings.prayers.join(","),
          days: String(days),
        })
      : null;
  return (
    <section className="noor-feature-card prayer-reminders" id="reminders">
      <h2>{t("Prayer reminders")}</h2>
      <p className="feature-status">
        {t("Permission")}: {t(permission)} · {t("Delivery")}:{" "}
        {t(available ? status : "unavailable")}
      </p>
      <div className="noor-feature-controls">
        <button
          disabled={
            busy ||
            !available ||
            !confirmed ||
            !schedule ||
            !settings.prayers.length
          }
          onClick={() => void enable()}
        >
          {t(
            device
              ? "Apply changes / renew 30 days"
              : "Enable background reminders",
          )}
        </button>
        {device ? (
          <button disabled={busy} onClick={() => void disable()}>
            {t("Disable alerts")}
          </button>
        ) : null}
        <button
          disabled={busy || !device}
          onClick={async () => {
            setBusy(true);
            try {
              await send({ action: "test" });
              setMessage(
                "Test accepted by push service. Check your device for the notification.",
              );
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : "Test failed.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {t("Send test notification")}
        </button>
        <button
          disabled={busy}
          onClick={() => window.dispatchEvent(new Event("noor:push-change"))}
        >
          {t("Check status")}
        </button>
      </div>
      {!available ? (
        <p>
          {t("Background delivery is unavailable. Use calendar reminders.")}
        </p>
      ) : null}
      {device ? (
        <small>
          {t("Scheduled until")}{" "}
          {new Date(device.expiresAt).toLocaleDateString(locale)} ·{" "}
          {t("Update reminders after changing city or calculation settings.")}
        </small>
      ) : null}
      <details>
        <summary>{t("Reminder settings & calendar")}</summary>
        <fieldset>
          <legend>{t("Remind me for")}</legend>
          <div className="reminder-prayers">
            {PRAYERS.map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={settings.prayers.includes(p)}
                  onChange={(e) =>
                    save({
                      ...settings,
                      prayers: e.target.checked
                        ? [...settings.prayers, p]
                        : settings.prayers.filter((v) => v !== p),
                    })
                  }
                />
                {t(p)}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="noor-feature-controls">
          <label>
            {t("Reminder timing")}
            <NoorSelect
              value={settings.minutes}
              aria-label={t("Reminder timing")}
              onChange={(e) =>
                save({ ...settings, minutes: Number(e.target.value) })
              }
            >
              <option value={0}>{t("At prayer time")}</option>
              {[5, 10, 15].map((n) => (
                <option key={n} value={n}>
                  {t("{minutes} minutes before", { minutes: n })}
                </option>
              ))}
            </NoorSelect>
          </label>
          <label>
            {t("Calendar range")}
            <NoorSelect
              value={days}
              aria-label={t("Calendar range")}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>7 {t("days")}</option>
              <option value={30}>30 {t("days")}</option>
            </NoorSelect>
          </label>
          {href ? (
            <a href={href} download>
              {t("Download prayer calendar")}
            </a>
          ) : null}
        </div>
        <p>
          {t(
            "Import the file into your calendar and enable its alerts. Times are calculated separately for each day.",
          )}
        </p>
      </details>
      <small>
        {t(
          "On iPhone, install NOOR to your Home Screen first. Device settings and connectivity can delay notifications.",
        )}
      </small>
      {!confirmed ? (
        <p>{t("Confirm your city above before enabling prayer reminders.")}</p>
      ) : null}
      <p role="status">{t(message)}</p>
    </section>
  );
}
