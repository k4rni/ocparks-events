import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { Event } from "./types.ts";
import { fetchEventDetails } from "./links.ts";

/**
 * Formats the event date range from start and end strings.
 * @param startStr - The start date string.
 * @param endStr - The end date string.
 * @return A formatted string representing the date range.
 */
function formatEventDateRange(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateFmt.format(start)} at ${timeFmt.format(start)} – ${
    timeFmt.format(end)
  }`;
}

/**
 * Decodes HTML entities in a string.
 * @param str - The string to decode.
 * @return The decoded string.
 */
function decodeHtmlEntities(str: string): string {
  const txt = new DOMParser().parseFromString(
    `<!doctype html><body>${str}`,
    "text/html",
  );
  return txt?.body?.textContent || str;
}

/**
 * Fetches events from the OC Parks events page.
 * @return A promise that resolves to an array of Event objects.
 */
export async function fetchEvents() {
  try {
    const res = await fetch("https://ocparks.com/events");
    const content = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const scriptTag = doc.querySelector(
      'script[data-drupal-selector="drupal-settings-json"]',
    );

    if (!scriptTag?.textContent) throw new Error("JSON data not found.");

    const jsonData = JSON.parse(scriptTag.textContent);
    const result = JSON.parse(
      jsonData?.fullCalendarView?.[0].calendar_options,
    ) || {};

    const now = new Date();

    const events = await Promise.all(
      result.events
        .filter((e: Event) => new Date(e.end) >= now)
        .sort(
          (a: Event, b: Event) =>
            new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
        .map(async (event: Event) => {
          const details = event.url
            ? await fetchEventDetails("https://ocparks.com" + event.url)
            : {
              location: "Unknown location",
              description: "Unknown description",
              image: "Unknown image",
            };

          return {
            title: decodeHtmlEntities(event.title ?? "Unknown title"),
            datetime: formatEventDateRange(event.start, event.end),
            url: event.url ?? null,
            location: details.location,
            description: details.description,
            image: details.image,
          };
        }),
    );

    return events;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}
