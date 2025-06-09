import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchEvents } from "../utils/events.ts";
import { Event } from "../utils/types.ts";

type Data = {
  events: Event[];
};

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const events = await fetchEvents();
    return ctx.render({ events });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">OC Parks Events</h1>
      <ul class="mt-4 space-y-4">
        {data.events.map((event) => (
          <li class="border p-4 rounded shadow" key={event.url}>
            <h2 class="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p>
              📍 <strong>{event.location}</strong>
            </p>
            <p>
              🗓️ {event.start} – {event.end}
            </p>
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
    </div>
  );
}
