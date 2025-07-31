import { DOMParser } from "jsr:@b-fuze/deno-dom";

export async function fetchEventDetails(url: string) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (!doc) throw new Error("Failed to parse event page");

    // Extract location from the address element
    const locationElement = doc.querySelector(".address");
    const location = locationElement
      ? locationElement.textContent?.trim().split("\n").join(", ")
      : "Unknown location";

    // Extract description from the main content
    const mainContent = doc.querySelector(".main-content");
    const descriptionParagraphs = mainContent?.querySelectorAll("p:not(.date)");

    let description = "Unknown description";

    if (descriptionParagraphs && descriptionParagraphs.length > 0) {
      description = Array.from(descriptionParagraphs)
        .map((p) => p.textContent?.trim() || "")
        .filter(Boolean)
        .join("\n\n");
    } else {
      const articles = doc.querySelectorAll("article.node");
      const descriptionArticle = articles[1];
      if (descriptionArticle) {
        const paragraphs = Array.from(descriptionArticle.querySelectorAll("p"));
        if (paragraphs.length > 0) {
          description = paragraphs
            .map((p) => p.textContent?.trim() || "")
            .filter(Boolean)
            .join("\n\n");
        }
      }
    }

    // Extract image URL from the first <picture> element
    const relativeSrc = doc.querySelector("picture img")?.getAttribute("src");
    const image = relativeSrc
      ? new URL(relativeSrc, url).href
      : "Unknown image";

    return { description, location, image };
  } catch (error) {
    console.error(`Failed to fetch event details from ${url}:`, error);
    return {
      location: "Unknown location",
      description: "Unknown description",
      image: "Unknown image",
    };
  }
}
