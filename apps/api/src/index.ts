import { Elysia, t } from "elysia";

const jobs = [
  { id: 1, title: "Frontend Developer", company: "Acme" },
  { id: 2, title: "Backend Developer", company: "Globex" },
];

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/health", () => ({ ok: true }))
  .get("jobs", () => jobs)
  .get(
    "jobs/:id",
    ({ params, status }) => {
      const job = jobs.find((j) => j.id === params.id);
      return job ?? status(404, { message: "Job not found" });
    },
    { params: t.Object({ id: t.Numeric() }) },
  )
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
