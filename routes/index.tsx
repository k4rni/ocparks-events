/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { Event } from "../utils/types.ts";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import { fetchEvents } from "../utils/events.ts";

type Data = {
  events: Event[];
  page: number;
  totalPages: number;
};

/**
 * Fetches events from the KV store and paginates them.
 * @param req - The request object.
 * @param ctx - The context object.
 * @return A response containing the paginated events.
 */
export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = 10;

    const kv = await Deno.openKv();

    const firstEntry = await kv.list({ prefix: ["events", "item"] }).next();
    if (firstEntry.done) {
      console.log("KV empty. Fetching and storing events...");
      const events = await fetchEvents();

      for (const [index, event] of events.entries()) {
        await kv.set(["events", "item", index], event);
      }

      console.log(`Stored ${events.length} events.`);
    }

    const allEvents: Event[] = [];
    for await (const entry of kv.list<Event>({ prefix: ["events", "item"] })) {
      allEvents.push(entry.value);
    }

    allEvents.sort((a, b) =>
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    const totalPages = Math.ceil(allEvents.length / perPage);
    const paginatedEvents = allEvents.slice(
      (page - 1) * perPage,
      page * perPage,
    );

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
    <div class="container">
      <Navbar />
      <main class="content">
        <h1>Discover and Explore OC Parks Events with Smart Filtering</h1>
        <ul class="event-list">
          {events.map((event) => (
            <li class="event-card" key={event.url}>
              <div class="column-left">
                {event.image !== "Unknown image" && <img src={event.image} />}
              </div>

              <div class="column-middle">
                {event.tags && event.tags.length > 0 && (
                  <div class="tags">
                    {event.tags.map((tag) => (
                      <span class="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                <h2>{event.title}</h2>
                <p class="description">{event.description}</p>
                <p class="info">Location {event.location}</p>
                <p class="info">Date/Time {event.datetime}</p>
              </div>

              <div class="column-right">
                {
                  <a
                    href={`https://ocparks.com/${event.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    External Link
                  </a>
                }
              </div>
            </li>
          ))}
        </ul>

        <div class="pagination">
          {page > 1 ? <a href={`?page=${page - 1}`}>← Previous</a> : <div />}
          {page < totalPages && <a href={`?page=${page + 1}`}>Next →</a>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
