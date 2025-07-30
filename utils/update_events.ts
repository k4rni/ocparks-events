/// <reference lib="deno.unstable" />
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { fetchEvents } from "./events.ts";

const kv = await Deno.openKv(
  "https://api.deno.com/databases/8605b5e4-6a3c-4d73-ba57-34c20030f83f/connect",
);

// Fetch only future events (already filtered inside fetchEvents)
const events = await fetchEvents();
const updatedAt = new Date().toISOString();

// Delete existing events (but only the ones under ["events", "item"])
for await (const entry of kv.list({ prefix: ["events", "item"] })) {
  await kv.delete(entry.key);
}

// Save metadata (optional, but good for debugging or UI display)
await kv.set(["events", "meta"], { updatedAt });

// Save new events
await Promise.all(
  events.map((event, i) => kv.set(["events", "item", i], event)),
);

console.log(`✅ Saved ${events.length} future events at ${updatedAt}`);
