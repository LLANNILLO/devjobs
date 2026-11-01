# DevJobs — Frameworkless version

A job board for developers built with **plain HTML, CSS and JavaScript** — no framework, no bundler, no dependencies.

This is the first stage of the DevJobs project from the [JSCamp bootcamp](https://jscamp.dev) by midudev (InfoJobs edition). It lives on its own branch to preserve the "vanilla" version of the app. The full project (API, React, etc.) lives on `main`.

## Quick start

No install step. ES modules and `fetch` need an HTTP server, so don't open the files with `file://`:

```bash
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (serve) or `http://localhost:8000` (python).

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with hero and search |
| `empleos.html` | Job listing with search, filters and pagination |
| `detalle.html` | Job detail page |

## What was built

- **Web Components** (Custom Elements) for the UI pieces: job list, job card, pagination and avatar.
- **Live search and filters** by text, technology, location, contract type and experience level.
- **Client-side pagination** synced with the URL (`?page=N`) through the History API.
- **Component communication** via properties and `CustomEvent`s (`jobs-paginated`, `page-change`).
- **Pure logic modules** (`filterJobs`, `paginate`) separated from the DOM.
- **Data loading** with `fetch` from a local `data.json` (no backend).

## Project structure

```text
.
├── index.html, empleos.html, detalle.html   # Pages
├── styles.css                               # Global styles
├── main.js                                  # Wires components, form and URL on empleos.html
├── components/                              # Web Components (UI)
├── logic/                                   # Pure functions: filtering and pagination
├── services/jobs.js                         # Data access (fetch data.json)
└── data.json                                # Mock job offers
```

## Why a frameworkless version?

To learn the foundations first: the DOM, events, modules and the platform's own component model. Everything a framework later abstracts away.

## Next step

Switch to `main` to see the evolution of the project with an API and React.
