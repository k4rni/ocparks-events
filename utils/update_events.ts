/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { fetchEvents } from "./events.ts";

const isDeploy = Boolean(Deno.env.get("DENO_DEPLOYMENT_ID"));

let kv;

if (isDeploy) {
  kv = await Deno.openKv();
} else {
  const kvAccessToken = Deno.env.get("KV_ACCESS_TOKEN");
  if (!kvAccessToken) {
    throw new Error("KV_ACCESS_TOKEN is not defined");
  }
  kv = await Deno.openKv(
    `https://api.deno.com/databases/8605b5e4-6a3c-4d73-ba57-34c20030f83f/connect?access_token=${kvAccessToken}`,
  );
}

// Fetch only future events (already filtered inside fetchEvents)
const events = await fetchEvents();
const updatedAt = new Date().toISOString();

// Delete everything in deno kv database
// for await (const entry of kv.list({ prefix: [] })) {
//   await kv.delete(entry.key);
// }

// Clean up old events without deleting the entire KV
for await (
  const entry of kv.list<{ datetime: string }>({ prefix: ["events", "item"] })
) {
  const eventDate = new Date(entry.value.datetime);
  const now = new Date();

  if (eventDate < now) {
    await kv.delete(entry.key);
  }
}

// Save metadata
await kv.set(["events", "meta"], { updatedAt });

// Save new events
await Promise.all(
  events.map((event, i) => kv.set(["events", "item", i], event)),
);

console.log(`✅ Saved ${events.length} future events at ${updatedAt}`);
