import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export async function fetchEventData() {
  const url = "https://ocparks.com/events";

  // Step 1: Fetch the page HTML
  const response = await fetch(url);
  const html = await response.text();

  // Step 2: Parse the HTML
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("Failed to parse HTML");

  // Step 3: Locate the script tag containing JSON
  const scriptTag = doc.querySelector(
    'script[data-drupal-selector="drupal-settings-json"]'
  );
  if (!scriptTag) throw new Error("Script tag with JSON data not found");

  // Step 4: Parse JSON content from the script tag
  const jsonContent = scriptTag.textContent;
  const jsonData = JSON.parse(jsonContent);

  // Step 5: Extract relevant event data
  const events = jsonData?.fullCalendarView?.[0]?.events || [];
  const extractedEvents = events.map((event: any) => ({
    title: event.title || "Unknown Title",
    start: event.startField || "Unknown Start Time",
    end: event.field_start_date || "Unknown End Time",
    url: event.url || null,
    location: event.location || "Unknown Location",
  }));

  return extractedEvents;
}
