# Contributing

Thank you for your interest in this project. As previously stated in the
README.md, this project is built with [Deno](https://deno.land/), the
[Fresh](https://fresh.deno.dev/) framework, and **Deno KV** for persistence.
Tags are generated using a **Python-based ML script** with `scikit-learn` in a
[separate repo](https://github.com/k4rni/events-tagger).

---

## Getting Started

To contribute locally, you will need [Deno](https://deno.land/#installation).

### 1. Clone the repo

```bash
git clone https://github.com/k4rni/ocparks-events.git
cd ocparks-events
```

### 2. Run the dev server

```bash
deno task start
```

Your site should now be live at [http://localhost:8000](http://localhost:8000)
and hot-reload on changes.

---

## Project Overview 🧱

```
routes/            → Fresh pages (API + frontend)
components/        → Reusable UI components
islands/           → Interactive Preact components
static/            → Public assets
utils/             → Shared utilities (e.g. data fetching)
deno.json          → Tasks and permissions
```

This app uses **server-side rendering**, **Preact**, and **Deno KV** for
persistent storage of events and tags.

---

## Database (Deno KV)

Deno KV is used to store events and tag metadata. The KV store is managed
in-memory for local dev, and persisted in Deno Deploy production.

To inspect KV entries, you can use the built-in APIs, for example:

```ts
const entries = [];
for await (const entry of kv.list({ prefix: ["events"] })) {
  entries.push(entry);
}
```

---

## Tagging System 🤖

Tags are not hand-written! They're generated via a **Python ML script** using
`scikit-learn`, located in a separate repo.

If you want to update or retrain the tagger:

1. Clone the tagging repo:
   `git clone https://github.com/YOUR_USERNAME/ml-tagger-repo`

2. Run the Python script to generate tags for all events. It should output a
   `tags.json` file.

3. Copy `tags.json` into this project and import it into the KV store or use it
   during scraping.

> 💡 This separation of concerns lets Deno handle hosting and scraping while
> Python handles NLP/ML duties.

---

## Formatting & Linting 🧼

Before submitting code, run:

```bash
deno fmt        # Format code
deno lint       # Check for issues
deno check .    # Type checking
```

For convenience, use:

```bash
deno task check-all
```

> Make sure you're using the latest version of Deno!

---

## Deploying to Deno Deploy 🚀

This project is deployed to [Deno Deploy](https://deno.com/deploy). If you have
access:

```bash
# Deploy manually
deno deploy --project=my-project-name main.ts
```

> Configuration is managed via `deno.json` and `import_map.json`.

---

## Styling & Responsiveness 🎨

This project uses **vanilla CSS**, mobile-first.

Here’s a sample styling rule used for tag toggles:

```css
.event-card a {
  color: black;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  border: 1px solid black;
}

.event-card a.selected {
  background: black;
  color: white;
}
```

To make your component responsive, wrap in a flex container and center for
mobile:

```css
.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
```

---

## Environment Variables & Secrets 🔐

If needed, create a `.env` file and load it via `std/dotenv`. But most
deployments do not require secrets.

For local testing:

```ts
import "https://deno.land/std@0.224.0/dotenv/load.ts";
```

Example `.env` file:

```env
DEBUG_MODE=true
```

---

## Suggested Tasks

```bash
# Starts dev server
deno task start

# Checks format, lint, and types
deno task check-all

# Deploy to Deno Deploy
deno task deploy
```

You can define these in your `deno.json` like so:

```json
{
  "tasks": {
    "start": "deno run -A --watch main.ts",
    "check-all": "deno fmt && deno lint && deno check .",
    "deploy": "deno deploy"
  }
}
```

---

## Contributions Welcome 🎉

- Add or improve scraping logic
- Improve frontend tag filters
- Add UI enhancements or animations
- Refactor ML tag integration
- Write tests!

---

## Webmaster’s Note 📝

Thanks for contributing! Even fixing a typo helps improve the project.

Grab a stretch and a glass of water — then check out `ARCHITECTURE.md` to dig
deeper.

---

Let me know if you'd like me to generate the `ARCHITECTURE.md` or `.env.example`
file too!
