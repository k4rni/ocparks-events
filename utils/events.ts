import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { Event } from "./types.ts";
import { fetchEventDetails } from "./links.ts";

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

      const events = await Promise.all(
        result.events.map(async (event: Event) => {
          const details = event.url
            ? await fetchEventDetails("https://ocparks.com" + event.url)
            : {
                location: "Unknown location",
                description: "Unknown description",
                image: "Unknown image",
              };

          return {
            title: event.title || "Unknown title",
            start: event.start || "Unknown start time",
            end: event.end || "Unknown end time",
            url: event.url || null,
            location: details.location,
            description: details.description,
            image: details.image,
          };
        })
      );

      return events;
    } else {
      throw new Error("JSON data not found.");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
