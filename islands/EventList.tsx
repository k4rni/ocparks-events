import { useEffect, useRef, useState } from "preact/hooks";
import { Event } from "../utils/types.ts";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadEvents(page: number) {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await fetch(`/api/events?page=${page}&perPage=10`);
    const data = await res.json();
    setEvents((prev) => [...prev, ...data.events]);
    setHasMore(page < data.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loaderRef.current, hasMore]);

  return (
    <>
      <ul class="event-list">
        {events.map((event) => (
          <li class="event-card" key={event.url}>
            <div class="column-left">
              {event.image !== "Unknown image" && <img src={event.image} />}
            </div>
            <div class="column-middle">
              {event.tags?.length > 0 && (
                <div class="tags">
                  {event.tags.map((tag) => (
                    <span class="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              )}
              <h2>{event.title}</h2>
              <p class="description">{event.description}</p>
              <p class="info">Location: {event.location}</p>
              <p class="info">Date/Time: {event.datetime}</p>
            </div>
            <div class="column-right">
              <a
                href={`https://ocparks.com/${event.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                External Link
              </a>
            </div>
          </li>
        ))}
      </ul>
      {loading && <p>Loading more events...</p>}
      <div ref={loaderRef} style={{ height: "1px" }} />
    </>
  );
}
