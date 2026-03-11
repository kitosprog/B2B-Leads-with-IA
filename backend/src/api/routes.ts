import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { CompanyService } from '../services/companyService';
import { JobService } from '../services/jobService';
import { addScrapeJob } from '../services/queueService';

const companyService = new CompanyService();
const jobService = new JobService();

const startScrapeSchema = z.object({
  query: z.string().min(1).max(500),
  country: z.string().optional(),
});

export async function registerRoutes(server: FastifyInstance) {
  
  server.post('/api/scrape', async (request, reply) => {
    try {
      const body = startScrapeSchema.parse(request.body);
      
      const job = await jobService.create({
        query: body.query,
        country: body.country,
      });
      
      await addScrapeJob(job.id, job.query, job.country || undefined);
      
      return reply.status(201).send({
        id: job.id,
        message: 'Scraping job created',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid request data', details: error.errors });
      }
      throw error;
    }
  });

  server.get('/api/jobs', async (_request, reply) => {
    const jobs = await jobService.findAll();
    return reply.send({ jobs });
  });

  server.get<{ Params: { id: string } }>('/api/jobs/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'Invalid job ID' });
    }
    
    const job = await jobService.findById(id);
    
    if (!job) {
      return reply.status(404).send({ error: 'Job not found' });
    }
    
    return reply.send({ job });
  });

  server.get('/api/results', async (request, reply) => {
    const limit = parseInt((request.query as any).limit || '100', 10);
    const offset = parseInt((request.query as any).offset || '0', 10);
    
    const companies = await companyService.findAll(limit, offset);
    const total = await companyService.count();
    
    return reply.send({
      companies,
      total,
      limit,
      offset,
    });
  });

  server.delete<{ Params: { id: string } }>('/api/results/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    
    if (isNaN(id)) {
      return reply.status(400).send({ error: 'Invalid company ID' });
    }
    
    const deleted = await companyService.delete(id);
    
    if (!deleted) {
      return reply.status(404).send({ error: 'Company not found' });
    }
    
    return reply.send({ message: 'Company deleted' });
  });

  server.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });
}
