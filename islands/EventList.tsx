import { useEffect, useRef, useState } from "preact/hooks";
import { Event } from "../utils/types.ts";

const availableTags = [
  "Nature",
  "Wellness",
  "Volunteer",
  "Arts & Crafts",
  "Educational",
];

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Toggle tag selection
  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
    setEvents([]);
    setHasMore(true);
  }

  async function loadEvents(page: number, tags: string[]) {
    if (loading || !hasMore) return;
    setLoading(true);

    const tagQuery = tags.length
      ? `&tags=${encodeURIComponent(tags.join(","))}`
      : "";
    const res = await fetch(`/api/events?page=${page}&perPage=10${tagQuery}`);
    const data = await res.json();

    setEvents((prev) => page === 1 ? data.events : [...prev, ...data.events]);
    setHasMore(page < data.totalPages);
    setLoading(false);
  }

  // Load events on page or selectedTags change
  useEffect(() => {
    loadEvents(page, selectedTags);
  }, [page, selectedTags]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, loading]);

  return (
    <>
      <div class="tag-filters">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              type="button"
              key={tag}
              class={`tag-toggle ${isSelected ? "selected" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>

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

      {!loading && events.length === 0 && <p>No events found :(</p>}

      {loading && <p>Loading more events...</p>}
      <div ref={loaderRef} style={{ height: "1px" }} />
    </>
  );
}
