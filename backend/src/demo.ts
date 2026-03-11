import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { WebScraper } from './scrapers/webScraper';
import { SearchService } from './services/searchService';
import { z } from 'zod';

// In-memory storage for demo
const jobs: any[] = [];
const companies: any[] = [];
let jobIdCounter = 1;
let companyIdCounter = 1;

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

const startScrapeSchema = z.object({
  query: z.string().min(1).max(500),
  country: z.string().optional(),
});

async function start() {
  try {
    await server.register(cors, {
      origin: true,
    });

    await server.register(rateLimit, {
      max: 100,
      timeWindow: 60000,
    });

    // POST /api/scrape
    server.post('/api/scrape', async (request, reply) => {
      try {
        const body = startScrapeSchema.parse(request.body);
        
        const job = {
          id: jobIdCounter++,
          query: body.query,
          country: body.country || null,
          status: 'pending',
          results_count: 0,
          error_message: null,
          created_at: new Date().toISOString(),
          completed_at: null,
        };
        
        jobs.push(job);
        
        // Start scraping in background
        performScraping(job.id, body.query, body.country).catch(console.error);
        
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

    // GET /api/jobs
    server.get('/api/jobs', async (_request, reply) => {
      return reply.send({ jobs: jobs.slice().reverse() });
    });

    // GET /api/jobs/:id
    server.get<{ Params: { id: string } }>('/api/jobs/:id', async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const job = jobs.find(j => j.id === id);
      
      if (!job) {
        return reply.status(404).send({ error: 'Job not found' });
      }
      
      return reply.send({ job });
    });

    // GET /api/results
    server.get('/api/results', async (request, reply) => {
      const limit = parseInt((request.query as any).limit || '100', 10);
      const offset = parseInt((request.query as any).offset || '0', 10);
      
      const paginatedCompanies = companies.slice(offset, offset + limit);
      
      return reply.send({
        companies: paginatedCompanies,
        total: companies.length,
        limit,
        offset,
      });
    });

    // DELETE /api/results/:id
    server.delete<{ Params: { id: string } }>('/api/results/:id', async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const index = companies.findIndex(c => c.id === id);
      
      if (index === -1) {
        return reply.status(404).send({ error: 'Company not found' });
      }
      
      companies.splice(index, 1);
      return reply.send({ message: 'Company deleted' });
    });

    // Health check
    server.get('/health', async (_request, reply) => {
      return reply.send({ status: 'ok', timestamp: new Date().toISOString(), mode: 'demo' });
    });

    await server.listen({ port: config.port, host: '0.0.0.0' });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 DEMO MODE - No database required`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n✅ Server running on http://localhost:${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`💾 Storage: In-memory (demo mode)`);
    console.log(`🔍 Intelligent search: Enabled\n`);

  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

async function performScraping(jobId: number, query: string, country?: string) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  try {
    job.status = 'processing';
    
    console.log(`\n🔍 Starting intelligent search for: "${query}"`);
    
    // Use intelligent search
    const searchService = new SearchService();
    const searchResults = await searchService.searchCompanies(query, country);
    const urls = await searchService.extractUrls(searchResults);
    
    console.log(`✅ Found ${urls.length} companies to scrape`);
    
    if (urls.length === 0) {
      job.status = 'completed';
      job.results_count = 0;
      job.completed_at = new Date().toISOString();
      return;
    }

    const scraper = new WebScraper();
    await scraper.init();

    let savedCount = 0;

    for (const url of urls) {
      try {
        console.log(`  → Scraping: ${url}`);
        const data = await scraper.scrapeWebsite(url);
        
        if (data && (data.email || data.phone)) {
          // Check if already exists
          const exists = companies.find(c => c.website === data.website);
          
          if (!exists) {
            const company = {
              id: companyIdCounter++,
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            companies.push(company);
            savedCount++;
            
            console.log(`    ✓ Saved: ${company.name} (${company.email || company.phone})`);
          }
        }
      } catch (error) {
        console.error(`    ✗ Failed: ${url}`);
      }
    }

    await scraper.close();
    
    job.status = 'completed';
    job.results_count = savedCount;
    job.completed_at = new Date().toISOString();
    
    console.log(`\n✅ Job ${jobId} completed: ${savedCount} companies saved\n`);

  } catch (error) {
    job.status = 'failed';
    job.error_message = error instanceof Error ? error.message : 'Unknown error';
    job.completed_at = new Date().toISOString();
    
    console.error(`\n❌ Job ${jobId} failed:`, error);
  }
}

start();
