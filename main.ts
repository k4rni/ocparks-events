import { Hono } from "hono";
import { fetchEvents } from "./scraper/events.ts";

const app = new Hono();

app.get("/", async (c) => {
  const events = await fetchEvents();
  return c.json(events, events.length > 0 ? 200 : 500);
});

Deno.serve(app.fetch);
