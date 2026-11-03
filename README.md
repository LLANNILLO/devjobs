# DevJobs

A job board for developers: search openings by title or company, narrow them down by technology, location, contract type, and experience level, and browse the results page by page.

It is built as a TypeScript monorepo with a React frontend and an Express API, managed end to end by [Vite+](https://viteplus.dev/guide/) (`vp`).

## Quick path

```bash
vp install        # Install dependencies (pnpm, pinned via devEngines)
vp run dev        # Start every app in parallel (web + api)
vp run ready      # Check, test, and build the whole workspace
```

| App                   | URL                          |
| --------------------- | ---------------------------- |
| Web (Vite dev server) | http://localhost:5173        |
| API                   | http://localhost:3000/health |

## Workspace

| Path             | Package | What it is                                         |
| ---------------- | ------- | -------------------------------------------------- |
| `apps/web`       | `web`   | React 19 SPA: the job board UI                     |
| `apps/api`       | `api`   | Express 5 API (currently a `/health` endpoint)     |
| `packages/utils` | `utils` | Shared TypeScript library, bundled with `vp pack`  |
| `tooling/lint`   | —       | Shared Oxlint presets (`base`, `react`, `express`) |

### Web app structure

The frontend follows a feature-first (screaming) layout and the container-presentational pattern:

```text
apps/web/src
├── app/                  # App shell (Header + JobsPage + Footer)
├── features/jobs/        # Jobs feature
│   ├── components/       # JobsPage (container) and presentational parts
│   ├── data/jobs.json    # Mock job listings
│   ├── filterJobs.ts     # Pure filtering logic (+ tests)
│   ├── filterOptions.ts  # Filter select definitions
│   └── types.ts          # Job, JobData, JobFilters
└── shared/
    ├── components/       # Header, Footer
    ├── icons/            # SVG icon components
    └── pagination/       # Generic paginate() helper (+ tests)
```

## Features

- Search by job title or company (case-insensitive).
- Filter by technology, location, contract type, and experience level.
- Pagination with previous/next chevrons and numbered page links; changing a filter resets to page 1.
- Out-of-range pages are clamped, so stale page numbers still show results.

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
