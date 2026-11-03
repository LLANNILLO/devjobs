# @devjobs/contracts

HTTP contract shared by `apps/api` and `apps/web`: request/response DTOs, the
Problem Details error body and the allowed values of a job.

- Source-only package: `exports` points to `src/index.ts`, so there is no build
  step. Vite bundles it and Node strips the types at runtime.
- Only the **wire contract** lives here. The API domain (aggregates, commands,
  ports) stays private to `apps/api`.

```ts
import type { ListJobsResponse } from '@devjobs/contracts';
import { TECHNOLOGIES } from '@devjobs/contracts';
```
