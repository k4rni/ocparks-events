# Contributing

Thank you for your interest in this project. As previously stated in the
README.md, this project is built with [Deno](https://deno.land/), the
[Fresh](https://fresh.deno.dev/) framework, and **Deno KV** for persistence.
Tags are generated using a **Python-based ML script** with `scikit-learn` in a
[separate repo](https://github.com/k4rni/events-tagger).

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

## Project Overview

```
routes/            → Fresh pages (API + frontend)
components/        → Reusable UI components
islands/           → Interactive Preact components
static/            → Public assets
utils/             → Shared utilities (e.g. data fetching)
deno.json          → Tasks and permissions
```

This app uses **server-side rendering**, **Preact** (Islands), and **Deno KV**
for persistent storage of events and tags.

## Database (Deno KV)

Deno KV is used to store events and tag metadata. The KV store is managed
in-memory for local dev, and persisted in Deno Deploy production.

To inspect KV entries, you can use the following code to print the local DB, for
example:

```ts
const kv = await Deno.openKv();
for await (const entry of kv.list({ prefix: ["events"] })) {
  console.log(entry.key);
}
```

## Tagging System

Tags are generated via a **Python ML script** using `scikit-learn`, located in a
separate repo.

If you want to update or retrain the tagger:

1. Clone the tagging repo: `git clone https://github.com/k4rni/events-tagger`

2. Update the `events.json` to make any adjustments on the training data.

3. Run the Python script `python model/train.py` to generate the trained data
   `event_tagger.pkl` file.

> This separation of lets Deno handle hosting and scraping in TypeScript while
> Python handles NLP/ML duties.

---

## Formatting & Linting

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

## Styling & Responsiveness

This project uses **vanilla CSS**, desktop responsiveness first.

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

This project is primarily desktop and mobile. Tablet mode responsive defaults to
mobile mode.

## Environment Variables & Secrets

This project is deployed to [Deno Deploy](https://deno.com/deploy).

The env variables are already set within the GitHub repo as well as through the
Deno Deploy project settings. You should only be able to run it locally without
using an env files (running `update_events.ts` will run the production database
only if the env is provided).

For local testing:

To delete everything in the local database, run

```ts
deno task clean_kv
```

To print everything in the local database, run

```ts
deno task print_kv
```

To repopulate the database, run

```ts
deno task start
```

and it should refetch all the data to repopulate the local DB.

## Contributions Welcome

- Add or improve scraping logic
- Improve frontend tag filters
- Add UI enhancements or animations
- Refactor ML tag integration
- Write tests!

## Webmaster’s Note

Anyone interested in using or contributing to this project is warmly welcomed. I
appreciate your interest in reading this document.

If you'd like to understand the code structure better, feel free to check out
`ARCHITECTURE.md` to learn more.

---

Made with 💖 by [Karnikaa Velumani](https://karni.codes/)
