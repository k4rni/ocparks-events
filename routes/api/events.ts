/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { Event } from "../../utils/types.ts";

async function openKv() {
  const isDeploy = Boolean(Deno.env.get("DENO_DEPLOYMENT_ID"));
  if (isDeploy) {
    return await Deno.openKv();
  }

  const kvAccessToken = Deno.env.get("KV_ACCESS_TOKEN");
  if (!kvAccessToken) {
    throw new Error("KV_ACCESS_TOKEN is not defined");
  }

  return await Deno.openKv(
    `https://api.deno.com/databases/8605b5e4-6a3c-4d73-ba57-34c20030f83f/connect?access_token=${kvAccessToken}`,
  );
}

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("perPage") || "10");
    const tagsParam = url.searchParams.get("tags");
    const filterTags = tagsParam
      ? tagsParam.split(",").map((t) => t.trim().toLowerCase())
      : null;

    const kv = await openKv();
    const allEvents: Event[] = [];

    for await (const entry of kv.list<Event>({ prefix: ["events", "item"] })) {
      allEvents.push(entry.value);
    }

    // ✅ Removed fallback call to fetchEvents()

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
