import { Handlers } from "$fresh/server.ts";
import { fetchEvents } from "../../utils/events.ts";

export const handler: Handlers = {
  async GET(_req) {
    try {
      const events = await fetchEvents();
      return new Response(JSON.stringify(events), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};
