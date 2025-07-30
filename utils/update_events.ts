import { fetchEvents } from "./events.ts";

const kv = await Deno.openKv();
const events = await fetchEvents();
const updatedAt = new Date().toISOString();

// Clear all existing event data
for await (const entry of kv.list({ prefix: [] })) {
  await kv.delete(entry.key);
}

// Save metadata
await kv.set(["events", "meta"], { updatedAt });

// Save current (filtered) events
await Promise.all(
  events.map((event, i) => kv.set(["events", "item", i], event)),
);

console.log(`Saved ${events.length} events at ${updatedAt}`);
