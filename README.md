# OC Parks Events

> Explore upcoming [OC Parks events](https://www.ocparks.com/events) through a
> clean, interactive interface. This app pulls live event data, tagged with
> machine learning–based tags, and presents it in an easily digestible frontend
> built on Deno and Fresh.

Check it out here: https://ocparks-events.deno.dev/

![Screenshot of the OC Parks Events landing page](/static/progress_pics/image-5.png)

## Features

- Developed with the **Deno** runtime and the **Fresh** web framework for fast,
  server-rendered pages
- Utilizes **DenoKV** to store and cache scraped OC Parks event data
- Integrates a
  [**Scikit-learn** machine learning model](https://github.com/k4rni/events-tagger)
  to automatically generate relevant event tags
- ML model is deployed as a standalone microservice using **Render**
- Includes a filterable UI that lets users browse events by machine-generated
  tags
- Features a responsive design optimized for both desktop and mobile devices

## Development

Requirements:
[Deno](https://docs.deno.com/runtime/getting_started/installation/) must be
installed

```
git clone https://github.com/k4rni/ocparks-events.git
cd ocparks-events
```

## Building

To create a dev version of this app:

```
deno task start
```

## Event Tagger

Check out the machine learning model here:
https://github.com/k4rni/events-tagger

---

Created with 💖 by [Karnikaa Velumani](https://github.com/k4rni/)
