import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchEvents } from "../utils/events.ts";
import { Event } from "../utils/types.ts";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

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
                <h2>{event.title}</h2>
                <p class="description">{event.description}</p>
                <p class="info">
                  Location {event.location}
                </p>
                <p class="info">Date/Time {event.datetime}</p>
              </div>

              <div class="column-right">
                {event.url && <a href={event.url}>View Event</a>}
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
