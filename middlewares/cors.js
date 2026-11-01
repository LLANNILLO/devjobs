import cors from "cors";

const ACCEPTED_ORIGINS = [
  'http://localhost:5173'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true); // Antigua convención PONER por delante el ERROR
      }
      return callback(new Error('Origen no permitido'));
    }
  })
}

app.use(express.json())

