/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { Event } from "../../utils/types.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "10");
    const tagsParam = url.searchParams.get("tags");
    const filterTags = tagsParam
      ? tagsParam.split(",").map((t) => t.trim().toLowerCase())
      : null;

    const kv = await Deno.openKv();
    const allEvents: Event[] = [];

    // Check if KV has been initialized
    const meta = await kv.get<{ updatedAt: string }>(["events", "meta"]);
    const hasBeenPopulated = Boolean(meta.value?.updatedAt);

    // Load events from KV
    for await (const entry of kv.list<Event>({ prefix: ["events", "item"] })) {
      allEvents.push(entry.value);
    }

    // If KV appears empty, don’t overwrite or fetch
    if (allEvents.length === 0 && !hasBeenPopulated) {
      return new Response(
        JSON.stringify({
          events: [],
          totalPages: 0,
          message: "Event data is not yet available. Please try again soon.",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 503,
        },
      );
    }

    // Apply tag filter
    const filteredEvents = filterTags
      ? allEvents.filter((event) =>
        event.tags?.some((tag) => filterTags.includes(tag.toLowerCase()))
      )
      : allEvents;

    // Sort chronologically
    filteredEvents.sort((a, b) =>
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    // Paginate
    const paginatedEvents = filteredEvents.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return new Response(
      JSON.stringify({
        events: paginatedEvents,
        totalPages: Math.ceil(filteredEvents.length / perPage),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },
};
