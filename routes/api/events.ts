/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { fetchEvents } from "../../utils/events.ts";
import { Event } from "../../utils/types.ts";

let initializing = false;

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

    for await (const entry of kv.list<Event>({ prefix: ["events", "item"] })) {
      allEvents.push(entry.value);
    }

    if (allEvents.length === 0 && !initializing) {
      initializing = true;
      console.log("KV empty. Fetching events...");
      const events = await fetchEvents();
      for (const [index, event] of events.entries()) {
        await kv.set(["events", "item", index], event);
        allEvents.push(event);
      }
      initializing = false;
      console.log(`Stored ${events.length} events in KV.`);
    }

    const filteredEvents = filterTags
      ? allEvents.filter((event) =>
        event.tags?.some((tag) => filterTags.includes(tag.toLowerCase()))
      )
      : allEvents;

    filteredEvents.sort((a, b) =>
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

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
