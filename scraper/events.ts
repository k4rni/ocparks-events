import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { Event } from "./types.ts";

export async function fetchEvents() {
  try {
    const res = await fetch("https://ocparks.com/events");
    const content = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const scriptTag = doc.querySelector(
      'script[data-drupal-selector="drupal-settings-json"]'
    );

    if (scriptTag && scriptTag.textContent) {
      const jsonData = JSON.parse(scriptTag.textContent);
      const result =
        JSON.parse(jsonData?.fullCalendarView?.[0].calendar_options) || {};

      return result.events.map((event: Event) => ({
        title: event.title || "Unknown Title",
        start: event.start || "Unknown Start Time",
        end: event.end || "Unknown End Time",
        url: event.url || null,
        location: event.location || "Unknown Location",
      }));
    } else {
      throw new Error("JSON data not found.");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
