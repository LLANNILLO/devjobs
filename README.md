# DevJobs API

REST API for the DevJobs job board, built with **Node.js** and **Express 5**. This is the first iteration of the backend: job offers are served from a local JSON file and kept in memory.

## Tech stack

- Node.js (ES modules, JSON import attributes)
- Express 5
- `cors` with an origin allowlist

## Project structure

```
api/
├── index.js          # Monolithic version: every route in one file
├── app.js            # Refactored entry point (MVC, work in progress)
├── old-index.js      # Express 5 routing playground (optional segments, wildcards, regex)
├── config.js         # Defaults: port and pagination
├── controllers/
│   └── jobs.js       # HTTP layer: reads the request, calls the model
├── models/
│   └── jobs.js       # Data access over the in-memory jobs array
├── routes/
│   └── jobs.js       # Express router for /jobs
├── middlewares/
│   └── cors.js       # CORS middleware with accepted origins
└── data/
    └── jobs.json     # Seed data
```

The code evolves in two steps: `index.js` keeps everything in one file, while `app.js` splits it into routes, controllers and models.

## Getting started

```bash
npm install
node index.js
```

The server listens on `http://localhost:1234` by default. Use the `PORT` environment variable to change it:

```bash
PORT=3000 node index.js
```

Only requests from `http://localhost:5173` (the Vite frontend) are accepted by CORS.

## Configuration

Defaults live in `config.js`:

| Key                | Default | Description                 |
| ------------------ | ------- | --------------------------- |
| `PORT`             | `1234`  | HTTP port                   |
| `LIMIT_PAGINATION` | `10`    | Default page size           |
| `LIMIT_OFFSET`     | `0`     | Default pagination offset   |

## Endpoints

| Method   | Path        | Description                       | Success |
| -------- | ----------- | --------------------------------- | ------- |
| `GET`    | `/jobs`     | List jobs with filters and paging | `200`   |
| `GET`    | `/jobs/:id` | Get one job                       | `200`   |
| `POST`   | `/jobs`     | Create a job                      | `201`   |
| `PUT`    | `/jobs/:id` | Replace a job                     | `200`   |
| `PATCH`  | `/jobs/:id` | Partially update a job            | `200`   |
| `DELETE` | `/jobs/:id` | Delete a job                      | `204`   |

Routes with `:id` return `404 { "error": "Job not found" }` when the job does not exist.

### `GET /jobs` query parameters

| Param        | Description                                       |
| ------------ | ------------------------------------------------- |
| `text`       | Case-insensitive search in `titulo` and `descripcion` |
| `technology` | Filter by technology                              |
| `limit`      | Page size (default `10`)                          |
| `offset`     | Items to skip (default `0`)                       |

Response:

```json
{
  "data": [ /* jobs */ ],
  "total": 12,
  "limit": 10,
  "offset": 0
}
```

### Job shape

```json
{
  "id": "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4",
  "titulo": "Desarrollador de Software Senior",
  "empresa": "Tech Solutions Inc.",
  "ubicacion": "Remoto",
  "descripcion": "...",
  "data": {
    "technology": ["react", "node", "javascript"],
    "modalidad": "remoto",
    "nivel": "senior"
  }
}
```

`POST` and `PUT` accept `titulo`, `empresa`, `ubicacion`, `descripcion` and `data`. The `id` is generated with `crypto.randomUUID()`.

### Examples

```bash
curl "http://localhost:1234/jobs?text=react&limit=5"

curl -X POST http://localhost:1234/jobs \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Frontend Dev","empresa":"Acme","ubicacion":"Remoto","descripcion":"React role","data":{"nivel":"junior"}}'
```

## Known limitations

This is a learning project and a first iteration, so some parts are unfinished:

- Data is stored in memory: changes are lost when the server restarts.
- `index.js` and `app.js` import `./jobs.json`, but the file lives in `data/jobs.json`; update the import path before running.
- The MVC refactor (`app.js`) is still in progress: relative imports need the `.js` extension, the router must be exported and mounted on `/jobs`, and the controller still references the old filtering code.
- Filters `title` and `level` are read from the query but not applied yet.
- No tests yet.
