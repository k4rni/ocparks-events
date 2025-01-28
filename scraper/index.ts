import { fetchEventData } from "./events.ts";

export async function scrapeEvents() {
  // Step 1: Fetch the list of events
  const events = await fetchEventData();

  // Since there is no fetchEventDetails, simply return the fetched events
  return events;
}

// Run the scraper and output the results
if (import.meta.main) {
  scrapeEvents()
    .then((events) => {
      console.log("Scraped Events:", events);
    })
    .catch((error) => {
      console.error("Error while scraping events:", error);
    });
}
