import { type PageProps } from "$fresh/server.ts";
import "$fresh/runtime.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="OC Parks Events"
        />
        <meta
          property="og:description"
          content="A web scraper of the ocparks page to filter and provide you a digestible form of event data"
        />
        <meta
          property="og:image"
          content="https://ocparks-events.deno.dev/meta-image.png"
        />
        <meta
          property="og:url"
          content="https://ocparks-events.deno.dev/"
        />
        <meta property="og:type" content="website" />
        <title>ocparks-events</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/styles/navbar.css" />
        <link rel="stylesheet" href="/styles/footer.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
