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
 * Hashes a string using SHA-1.
 * @param str - The string to hash.
 * @return A promise that resolves to the hashed string.
 */
async function hashString(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(hashBuffer)).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Fetches tags for a given text using an external tagging service.
 * @param text - The text to tag.
 * @return A promise that resolves to an array of tags.
 */
async function fetchTags(text: string): Promise<string[]> {
  try {
    const res = await fetch("https://events-tagger.onrender.com/tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error("Failed to fetch tags:", res.status);
      return [];
    }

    const json = await res.json();
    return json.tags || [];
  } catch (error) {
    console.error("Error tagging event:", error);
    return [];
  }
}

/**
 * Fetches events from the OC Parks website.
 * Parses the HTML to extract event details and fetches additional information.
 * @returns A promise that resolves to an array of events.
 */
export async function fetchEvents() {
  try {
    const kv = await Deno.openKv();
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
        .sort((a: Event, b: Event) =>
          new Date(a.start).getTime() - new Date(b.start).getTime()
        )
        .map(async (event: Event) => {
          const url = "https://ocparks.com" + (event.url ?? "");
          const kvKey = ["event", url];

          const details = event.url ? await fetchEventDetails(url) : {
            location: "Unknown location",
            description: "Unknown description",
            image: "Unknown image",
          };

          const fullText = `
            ${event.title}
            ${details.description}
            ${details.location}
            ${formatEventDateRange(event.start, event.end)}
          `.trim();

          const hash = await hashString(fullText);
          const cached = await kv.get<{ tags: string[]; hash: string }>(kvKey);

          let tags: string[];

          if (cached.value && cached.value.hash === hash) {
            tags = cached.value.tags;
          } else {
            tags = await fetchTags(fullText);
            await kv.set(kvKey, { tags, hash });
          }

          return {
            title: decodeHtmlEntities(event.title ?? "Unknown title"),
            datetime: formatEventDateRange(event.start, event.end),
            url: event.url ?? null,
            location: details.location,
            description: details.description,
            image: details.image,
            tags,
          };
        }),
    );

    return events;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}
