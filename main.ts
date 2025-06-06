import { Hono } from "hono";
import { fetchEvents } from "./scraper/events.ts";

const app = new Hono();

app.get("/", async (c) => {
  const events = await fetchEvents();
  return c.json(events, events.length > 0 ? 200 : 500);
});

Deno.serve(app.fetch);

// import { Hono } from "hono";

// const app = new Hono();

// app.get("/", async (c) => {
//   const res = await fetch(
//     "https://ocparks.com/events/growing-together-native-seed-farm-10"
//   );
//   const content = await res.text();

//   return c.text(content);
// });

// Deno.serve(app.fetch);
