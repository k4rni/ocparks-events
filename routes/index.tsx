import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchEvents } from "../utils/events.ts";
import { Event } from "../utils/types.ts";

type Data = {
  events: Event[];
  page: number;
  totalPages: number;
};


export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = 10;

    const events = await fetchEvents();
    const totalPages = Math.ceil(events.length / perPage);
    const paginatedEvents = events.slice((page - 1) * perPage, page * perPage);

    return ctx.render({
      events: paginatedEvents,
      page,
      totalPages,
    });
  },
};


export default function Home({ data }: PageProps<Data>) {
  const { events, page, totalPages } = data;

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">OC Parks Events</h1>
      <ul class="mt-4 space-y-4">
        {events.map((event) => (
          <li class="border p-4 rounded shadow" key={event.url}>
            <h2 class="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p>📍 <strong>{event.location}</strong></p>
            <p>🗓️ {event.datetime}</p>
            {event.image !== "Unknown image" && (
              <img src={event.image} class="mt-2 max-w-full h-auto" />
            )}
            {event.url && (
              <a href={event.url} class="text-blue-600 underline">
                View Event
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div class="mt-8 flex justify-between">
        {page > 1 ? (
          <a
            href={`?page=${page - 1}`}
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Previous
          </a>
        ) : <div />}

        {page < totalPages && (
          <a
            href={`?page=${page + 1}`}
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next →
          </a>
        )}
      </div>
    </div>
  );
}
