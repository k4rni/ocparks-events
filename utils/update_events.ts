import { fetchEvents } from "./events.ts";

const kv = await Deno.openKv();
const events = await fetchEvents();
const updatedAt = new Date().toISOString();

/* Store the latest events and update timestamp */
await kv.set(["events", "meta"], { updatedAt });

/* Clear existing events */
for await (const entry of kv.list({ prefix: ["events", "item"] })) {
  await kv.delete(entry.key);
}

/* Save each event */
await Promise.all(
  events.map((event, i) => kv.set(["events", "item", i], event)),
);

console.log(`Saved ${events.length} events at ${updatedAt}`);
