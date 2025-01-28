// import { Hono } from "hono";

// const app = new Hono();

// app.get("/", async (c) => {
//   const res = await fetch("https://ocparks.com/events");
//   const content = await res.text();

//   return c.text(content);
// });

// Deno.serve(app.fetch);

// import { Hono } from "hono";
// import { scrapeEvents } from "./scraper/index.ts"; // Import scraping logic

// const app = new Hono();

// // Route to fetch and display events from ocparks.com
// app.get("/", async (c) => {
//   const events = await scrapeEvents(); // Scrape events
//   return c.json(events); // Return as JSON
// });

// // Start the server
// Deno.serve(app.fetch);

import { Hono } from "hono";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

const app = new Hono();

app.get("/", async (c) => {
  // Fetch the HTML content from the page
  const res = await fetch("https://ocparks.com/events");
  const content = await res.text();

  // Parse the HTML content using Deno DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  // Find the <script> tag containing the JSON data
  const scriptTag = doc.querySelector(
    'script[data-drupal-selector="drupal-settings-json"]'
  );

  if (scriptTag && scriptTag.textContent) {
    try {
      // Parse the JSON data inside the <script> tag
      const jsonData = JSON.parse(scriptTag.textContent);

      const result =
        JSON.parse(jsonData?.fullCalendarView?.[0].calendar_options) || {};

      const extractedEvents = result.events.map((event: any) => ({
        title: event.title || "Unknown Title",
        start: event.startField || "Unknown Start Time",
        end: event.field_start_date || "Unknown End Time",
        url: event.url || null,
        location: event.location || "Unknown Location",
      }));

      // return the extractedEvents
      return c.json(extractedEvents, 200);
    } catch (error) {
      // Handle JSON parsing errors
      return c.json({ error: "Failed to parse JSON data." }, 500);
    }
  } else {
    // If the JSON data isn't found, return an error
    return c.json({ error: "JSON data not found." }, 404);
  }
});

Deno.serve(app.fetch);
