import { JobModel } from "../models/jobs";
import { DEFAULTS } from "../config.js";

export class JobController {
  static async getAll(request, response) {
    const { text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET } = request.query;

    const paginatedJobs = await JobModel.paginatedJobs({ text, title, level, limit, technology });
    return response.json({ data: paginatedJobs, total: filterJobs.length, limit: limit, offset: offset });
  }

  static async getId(request, response) {
    const { id } = request.params

    const job = await JobModel.getByID({ id })

    if (!job) {
      return response.status(404).json({
        error: 'Job not found'
      })
    }

    return response.json(job)
  }

  static async create(request, response) {
    const { titulo, empresa, ubicacion, descripcion, data } = request.body;

    const newJob = await JobModel.create({ titulo, empresa, ubicacion, descripcion, data });
    return response.status(201).json(newJob)
  }

  static async update(request, response) {
    const { id } = request.params;
    const { titulo, empresa, ubicacion, descripcion, data } = request.body;

    const result = await JobModel.update({ id, titulo, empresa, ubicacion, descripcion, data })
    if (result.error) {
      return response.status(404).json(result)
    }

    return response.json(result);
  }

  static async partialUpdate(request, response) {
    const { id } = request.params;
    const updates = request.body;

    const result = await JobModel.partialUpdate({ id, updates });
    if (result.error) {
      return response.status(404).json(result)
    }

    return response.json(result);
  }

  static async delete(request, response) {
    const { id } = request.params;

    const result = await JobModel.delete({ id });
    if (result.error) {
      return response.status(404).json(result)
    }

    return response.status(204).send();
  }
}
