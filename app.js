import express from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { jobsRouter } from './routes/jobs.js'
// Si se desea importar el JSON has de hacerlo con un type para el runtime y seguridad
import jobs from './jobs.json' with { type: 'json' };
import { DEFAULTS } from "./config.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;
const app = express()

app.use(corsMiddleware());
app.use(express.json());

app.use('jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
})
