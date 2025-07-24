import { fetchEvents } from "./events.ts";

const kv = await Deno.openKv();
const events = await fetchEvents();
const updatedAt = new Date().toISOString();

/* Store the latest events and update timestamp */
await kv.set(["events", "meta"], { updatedAt });

// Delete old events first
for await (const entry of kv.list({ prefix: ["events", "item"] })) {
  await kv.delete(entry.key);
}

// Store events individually
await Promise.all(
  events.map((event, i) =>
    kv.set(["events", "item", i], event)
  )
);

console.log(`Saved ${events.length} events at ${updatedAt}`);
