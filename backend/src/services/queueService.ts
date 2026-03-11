import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config';
import { WebScraper } from '../scrapers/webScraper';
import { CompanyService } from './companyService';
import { JobService } from './jobService';
import { SearchService } from './searchService';

const connection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

export const scrapeQueue = new Queue('scrape-jobs', { connection });

interface ScrapeJobData {
  jobId: number;
  query: string;
  country?: string;
}

const companyService = new CompanyService();
const jobService = new JobService();

export function startWorker() {
  const worker = new Worker<ScrapeJobData>(
    'scrape-jobs',
    async (job: Job<ScrapeJobData>) => {
      const { jobId, query } = job.data;

      try {
        await jobService.updateStatus(jobId, 'processing');

        // Usar el nuevo servicio de búsqueda inteligente
        const searchService = new SearchService();
        const searchResults = await searchService.searchCompanies(query, job.data.country);
        const urls = await searchService.extractUrls(searchResults);
        
        console.log(`🔍 Found ${urls.length} companies for: "${query}"`);
        
        if (urls.length === 0) {
          await jobService.updateStatus(jobId, 'completed', 0);
          return;
        }

        const scraper = new WebScraper();
        await scraper.init();

        let savedCount = 0;

        for (const url of urls) {
          try {
            const data = await scraper.scrapeWebsite(url);
            
            if (data && (data.email || data.phone)) {
              await companyService.create(data);
              savedCount++;
            }

            await job.updateProgress((savedCount / urls.length) * 100);
          } catch (error) {
            console.error(`Failed to scrape ${url}:`, error);
          }
        }

        await scraper.close();
        await jobService.updateStatus(jobId, 'completed', savedCount);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await jobService.updateStatus(jobId, 'failed', 0, errorMessage);
        throw error;
      }
    },
    {
      connection,
      concurrency: config.scraping.concurrency,
    }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  return worker;
}


export async function addScrapeJob(jobId: number, query: string, country?: string) {
  await scrapeQueue.add('scrape', { jobId, query, country });
}
