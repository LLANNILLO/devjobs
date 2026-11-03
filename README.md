# DevJobs

A job board for developers: search openings by title or company, narrow them down by technology, location, contract type, and experience level, and browse the results page by page.

It is built as a TypeScript monorepo with a React frontend and an Express API, managed end to end by [Vite+](https://viteplus.dev/guide/) (`vp`).

## Quick path

```bash
vp install        # Install dependencies (pnpm, pinned via devEngines)
vp run dev        # Start every app in parallel (web + api)
vp run ready      # Check, test, and build the whole workspace
```

| App                   | URL                        |
| --------------------- | -------------------------- |
| Web (Vite dev server) | http://localhost:5173      |
| API                   | http://localhost:1234/jobs |

## Workspace

| Path                 | Package              | What it is                                                 |
| -------------------- | -------------------- | ---------------------------------------------------------- |
| `apps/web`           | `web`                | React 19 SPA: the job board UI                             |
| `apps/api`           | `api`                | Express 5 API: modular monolith (hexagonal + CQRS)         |
| `packages/contracts` | `@devjobs/contracts` | HTTP contract shared by web and api (DTOs, allowed values) |
| `packages/utils`     | `utils`              | Shared TypeScript library, bundled with `vp pack`          |
| `tooling/lint`       | —                    | Shared Oxlint presets (`base`, `react`, `express`)         |

### Web app structure

The frontend follows a feature-first (screaming) layout and the container-presentational pattern:

```text
apps/web/src
├── app/                  # App shell (Header + JobsPage + Footer)
├── features/jobs/        # Jobs feature
│   ├── JobsPage.tsx      # Container: wires search state, API and components
│   ├── api/              # jobsApi: builds the query and calls GET /jobs
│   ├── hooks/            # useJobsSearch (search state), useJobs (request state)
│   ├── model/            # Job, JobFilters, filter options, page size
│   └── components/       # Presentational parts
└── shared/
    ├── api/              # httpClient (`/api`, proxied to the API by Vite)
    ├── components/       # Header, Footer
    ├── hooks/            # useDebouncedValue
    ├── icons/            # SVG icon components
    └── pagination/       # Page navigation for server-side pagination (+ tests)
```

### API structure

A modular monolith: each module is split into hexagonal layers, with one folder per use case (CQRS).

```text
apps/api
├── src/
│   ├── main.ts           # Entry point: server and graceful shutdown
│   ├── bootstrap.ts      # Builds the app (shared by main and the tests)
│   ├── config/           # Environment config (the only place reading process.env)
│   ├── shared/           # Shared kernel: errors, validation, HTTP, logging, pagination
│   └── modules/jobs/
│       ├── module.ts     # Composition root (manual DI)
│       ├── domain/       # Job aggregate, allowed values, errors
│       ├── ports/        # inbound (JobService), outbound (JobRepository)
│       ├── app/          # commands/<useCase>, queries/<useCase>
│       └── adapters/     # driving/http, driven/inMemory (seeded from jobs.json)
└── test/
    ├── integration/      # HTTP tests against the real wiring
    └── architecture/     # Layer dependency rules
```

| Method | Path        | Description                                         |
| ------ | ----------- | --------------------------------------------------- |
| GET    | `/jobs`     | Search with filters and `limit`/`offset` pagination |
| GET    | `/jobs/:id` | Get one job                                         |
| POST   | `/jobs`     | Create a job (`201 { id }`)                         |
| PUT    | `/jobs/:id` | Replace a job (`204`)                               |
| PATCH  | `/jobs/:id` | Update some fields of a job (`204`)                 |
| DELETE | `/jobs/:id` | Delete a job (`204`)                                |

Errors use RFC 9457 Problem Details (`application/problem+json`).

## Features

- Search by job title or company (case-insensitive), debounced while typing.
- Filter by technology, location, contract type, and experience level.
- Pagination with previous/next chevrons and numbered page links; changing a filter resets to page 1.
- Filtering and pagination run on the API; the web app keeps showing the previous results while a new page loads.

## Stack

| Area            | Tools                                                       |
| --------------- | ----------------------------------------------------------- |
| Toolchain       | Vite+ (`vp`): Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt |
| Frontend        | React 19, TypeScript 7, `@vitejs/plugin-react`              |
| Backend         | Node.js ≥ 22.18, Express 5                                  |
| Package manager | pnpm 12 workspaces with a dependency catalog                |
| Lint            | Oxlint (type-aware) + `eslint-plugin-perfectionist`         |
| Format          | Oxfmt: tabs, single quotes, 80 columns                      |
| Tests           | Vitest via `vp test`                                        |
| Editors         | VS Code and Zed settings for the Oxc toolchain              |

## Commands

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `vp run dev`      | Run all apps in dev mode                                            |
| `vp check`        | Format, lint, and type check                                        |
| `vp check --fix`  | Same, applying fixes (also runs on staged files before each commit) |
| `vp test`         | Run the test suite                                                  |
| `vp run -r build` | Build every package                                                 |
| `vp run ready`    | `check` + tests + build                                             |

## Conventions

- Lint and format rules live in the root `vite.config.ts`; per-app overrides come from `tooling/lint/*.ts`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- UI copy is in Spanish; code, comments, and docs are in English.
