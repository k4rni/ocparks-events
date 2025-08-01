# OC Parks Events

> Explore upcoming [OC Parks events](https://www.ocparks.com/events) through a
> clean, interactive interface. This app pulls live event data, tagged with
> machine learning–based tags, and presents it in an easily digestible frontend
> built on Deno and Fresh.

Check it out here: https://ocparks-events.deno.dev/

![Screenshot of the OC Parks Events landing page](/static/progress_pics/image-6.png)

## Purpose

The goal of this project is to promote greater community involvement and
volunteerism in regional parks. In today’s economic climate, environmental
concerns often receive less attention, making it harder to support and protect
our natural spaces. Unfortunately, the current
[ocparks.com/events](https://ocparks.com/events) page is difficult to navigate,
which may discourage participation. This project aims to simplify access to
event information through a more user-friendly website, making it easier for
people to engage and give back to their local community.

If you are interested, but afraid to partake in any of these events, I want to
provide an easy outlet for others to engage in helping out.

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

## Check out more

Interested in contributing to make this website better? Feel free to check out
`CONTRIBUTING.md` to learn more!

Want to understand the structure of this project? Take a look at
`ARCHITECTURE.md` to get a better understanding!

---

Created with 💖 by [Karnikaa Velumani](https://github.com/k4rni/)
