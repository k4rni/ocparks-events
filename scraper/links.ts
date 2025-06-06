import { DOMParser } from "jsr:@b-fuze/deno-dom";

export async function fetchEventDetails(url: string) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (!doc) throw new Error("Failed to parse event page");

    const location =
      doc
        .querySelector(".address")
        ?.textContent?.trim()
        .split("\n")
        .join(", ") || "Unknown location";

    const articles = doc.querySelectorAll("article.node");
    const descriptionArticle = articles[1];
    const description = descriptionArticle
      ? Array.from(descriptionArticle.querySelectorAll("p"))
          .map((p) => p.textContent?.trim() || "")
          .filter(Boolean)
          .join("\n\n")
      : "Unknown description";

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
