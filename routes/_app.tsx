import { type PageProps } from "$fresh/server.ts";
import "$fresh/runtime.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ocparks-events</title>
        <link rel="stylesheet" href="/styles.css" />
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
