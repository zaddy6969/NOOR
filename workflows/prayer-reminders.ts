import { sleep } from "workflow";
import webpush from "web-push";
import { pushDatabase, pushKeys } from "@/db/push";
import { prayerRange, type PrayerLocation } from "@/lib/prayer-range";
import type { ReminderSettings } from "@/lib/prayer-reminders";
async function assignments(id: string, generation: string) {
  "use step";
  const sql = await pushDatabase();
  const [row] =
    await sql`SELECT preferences FROM noor_push_devices WHERE id=${id} AND generation=${generation} AND expires_at>now()`;
  if (!row) return [];
  try {
    const p = row.preferences as {
      location: PrayerLocation;
      settings: ReminderSettings;
    };
    const schedules = await prayerRange(p.location, 30);
    const events = schedules
      .flatMap((s) =>
        p.settings.prayers.map((prayer) => ({
          at: s.targets[prayer] - p.settings.minutes * 60000,
          title: `${prayer} · NOOR`,
          body: `${s.timings[prayer]} · ${p.location.city}`,
          tag: `${s.dateISO}-${prayer}`,
        })),
      )
      .filter((e) => e.at > Date.now())
      .sort((a, b) => a.at - b.at);
    await sql`UPDATE noor_push_devices SET status='scheduled' WHERE id=${id} AND generation=${generation}`;
    console.info("noor_reminder_schedule_ready", { count: events.length });
    return events;
  } catch {
    await sql`UPDATE noor_push_devices SET status='schedule failed' WHERE id=${id} AND generation=${generation}`;
    throw new Error("Prayer scheduling failed");
  }
}
async function deliver(
  id: string,
  generation: string,
  event: { at: number; title: string; body: string; tag: string },
) {
  "use step";
  const sql = await pushDatabase();
  const [row] =
    await sql`SELECT subscription,last_sent FROM noor_push_devices WHERE id=${id} AND generation=${generation} AND expires_at>now()`;
  if (!row) return false;
  if (row.last_sent === event.tag || Date.now() > event.at + 300000)
    return true;
  const keys = await pushKeys();
  try {
    await webpush.sendNotification(
      row.subscription,
      JSON.stringify({ ...event, url: "/prayer-times" }),
      {
        vapidDetails: {
          subject: "https://noor-daily-muslim.vercel.app",
          ...keys,
        },
        TTL: 300,
        timeout: 10000,
      },
    );
    await sql`UPDATE noor_push_devices SET last_sent=${event.tag},status='sent' WHERE id=${id} AND generation=${generation}`;
    console.info("noor_reminder_accepted");
    return true;
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      await sql`DELETE FROM noor_push_devices WHERE id=${id} AND generation=${generation}`;
      return false;
    }
    await sql`UPDATE noor_push_devices SET status='delivery failed' WHERE id=${id} AND generation=${generation}`;
    throw new Error("Push provider rejected reminder");
  }
}
async function finish(id: string, generation: string) {
  "use step";
  const sql = await pushDatabase();
  await sql`DELETE FROM noor_push_devices WHERE id=${id} AND generation=${generation}`;
}
export async function prayerReminderWorkflow(id: string, generation: string) {
  "use workflow";
  const events = await assignments(id, generation);
  for (const event of events) {
    await sleep(new Date(event.at));
    if (!(await deliver(id, generation, event))) return;
  }
  await finish(id, generation);
}
