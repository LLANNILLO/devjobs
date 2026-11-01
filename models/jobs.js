import jobs from '../data/jobs.json' with { type: 'json' };

export class JobModel {
  static async getAll({ text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET }) {
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
    return paginatedJobs
  }

  static async getByID({ id }) {
    const job = jobs.find((job) => job.id === id);
    return job;
  }

  static async create({ titulo, empresa, ubicacion, descripcion, data }) {
    const newJob = {
      id: crypto.randomUUID(),
      titulo: titulo,
      empresa: empresa,
      ubicacion: ubicacion,
      descripcion: descripcion,
      data: data,
    }

    jobs.push(newJob)

    return newJob;
  }

  static async update({ id, titulo, empresa, ubicacion, descripcion, data }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);

    if (jobIndex === -1) {
      return {
        error: 'Job not found'
      };
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

    return updatedJob
  }

  static async partialUpdate({ id, updates }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);

    if (jobIndex === -1) {
      return {
        error: 'Job not found'
      };
    }

    const updatedJob = {
      ...jobs[jobIndex],
      ...updates,
      id: id // Preservar el id original
    };

    jobs[jobIndex] = updatedJob;
    return updatedJob;
  }

  static async delete({ id }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);

    if (jobIndex === -1) {
      return {
        error: 'Job not found'
      };
    }

    jobs.splice(jobIndex, 1);
  }
}
