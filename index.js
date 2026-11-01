import express from "express";
import cors from "cors";

const ACCEPTED_ORIGINS = [
  'http://localhost:5173'
]
// Si se desea importar el JSON has de hacerlo con un type para el runtime y seguridad
import jobs from './jobs.json' with { type: 'json' };
import { DEFAULTS } from "./config.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;

const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true); // Antigua convención PONER por delante el ERROR
      }
      return callback(new Error('Origen no permitido'));
    }
  })
)

app.use(express.json())

// Middleware de logging
app.use((request, _, next) => {
  const timeString = new Date().toLocaleDateString();
  console.log(`[${timeString}] ${request.method} ${request.url}`);
  next();
})

app.get('/jobs', async (request, response) => {
  const { text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET } = request.query;

  let filterJobs = jobs

  if (text) {
    const searchTerm = text.toLowerCase();
    filterJobs = filterJobs.filter((job) => {
      return job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm);
    });
  }

  if (technology) {
    filterJobs = filterJobs.filter((job) => {
      return job.tecnologias.includes(technology);
    });
  }

  const limitNumber = Number(limit);
  const limitOffset = Number(offset);

  const paginatedJobs = filterJobs.slice(limitOffset, limitNumber)
  return response.json({ data: paginatedJobs, total: filterJobs.length, limit: limit, offset: offset });
})

app.get('/jobs/:id', (request, response) => {
  const { id } = request.params

  const job = jobs.find((job) => job.id === id);

  if (!job) {
    return response.status(404).json({
      error: 'Job not found'
    })
  }

  return response.json(job)
})

app.post('/jobs', (request, response) => {
  const { titulo, empresa, ubicacion, descripcion, data } = request.body;

  const newJob = {
    id: crypto.randomUUID(),
    titulo: titulo,
    empresa: empresa,
    ubicacion: ubicacion,
    descripcion: descripcion,
    data: data,
  }

  jobs.push(newJob)

  return response.status(201).json(newJob)
})

app.put('/jobs/:id', (request, response) => {
  const { id } = request.params;
  const { titulo, empresa, ubicacion, descripcion, data } = request.body;

  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return response.status(404).json({
      error: 'Job not found'
    });
  }

  const updatedJob = {
    id: id,
    titulo: titulo,
    empresa: empresa,
    ubicacion: ubicacion,
    descripcion: descripcion,
    data: data,
  };

  jobs[jobIndex] = updatedJob;

  return response.json(updatedJob);
});

app.patch('/jobs/:id', (request, response) => {
  const { id } = request.params;
  const updates = request.body;

  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return response.status(404).json({
      error: 'Job not found'
    });
  }

  const updatedJob = {
    ...jobs[jobIndex],
    ...updates,
    id: id // Preservar el id original
  };

  jobs[jobIndex] = updatedJob;

  return response.json(updatedJob);
});

app.delete('/jobs/:id', (request, response) => {
  const { id } = request.params;

  const jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return response.status(404).json({
      error: 'Job not found'
    });
  }

  jobs.splice(jobIndex, 1);

  return response.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
})
