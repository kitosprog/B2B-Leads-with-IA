import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config';
import { WebScraper } from '../scrapers/webScraper';
import { CompanyService } from './companyService';
import { JobService } from './jobService';
import { SearchService } from './searchService';
import { GoogleMapsService } from './googleMapsService';

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

        // FASE 1: Búsqueda en motores web (Google, Bing, DuckDuckGo)
        const searchService = new SearchService();
        const searchResults = await searchService.searchCompanies(query, job.data.country);
        const urls = await searchService.extractUrls(searchResults);
        
        console.log(`🔍 Phase 1: Found ${urls.length} companies from web search`);
        
        // FASE 2: Búsqueda en Google Maps (fuente adicional)
        console.log(`🗺️  Phase 2: Searching Google Maps...`);
        const googleMaps = new GoogleMapsService();
        let mapsResults: any[] = [];
        
        try {
          mapsResults = await googleMaps.searchGoogleMaps(query, job.data.country);
          console.log(`🗺️  Found ${mapsResults.length} additional businesses on Google Maps`);
        } catch (error) {
          console.error(`Google Maps search failed:`, error);
        }
        
        // Combinar resultados
        const totalCompanies = urls.length + mapsResults.length;
        console.log(`📊 Total companies to process: ${totalCompanies}`);
        
        if (totalCompanies === 0) {
          await jobService.updateStatus(jobId, 'completed', 0);
          return;
        }

        const scraper = new WebScraper();
        await scraper.init();

        let savedCount = 0;

        // Procesar empresas de búsqueda web
        console.log(`\n🕷️  Scraping ${urls.length} websites...`);
        for (const url of urls) {
          try {
            const data = await scraper.scrapeWebsite(url);
            
            if (data) {
              // Guardar si tenemos al menos email O teléfono
              if (data.email || data.phone) {
                await companyService.create(data);
                savedCount++;
                console.log(`    ✅ Saved company: ${data.name} (email: ${!!data.email}, phone: ${!!data.phone})`);
              } else {
                console.log(`    ⚠️  Skipped ${data.name}: no email or phone found`);
              }
            }

            await job.updateProgress((savedCount / totalCompanies) * 100);
          } catch (error) {
            console.error(`Failed to scrape ${url}:`, error);
          }
        }

        await scraper.close();
        
        // Procesar empresas de Google Maps
        console.log(`\n🗺️  Processing ${mapsResults.length} businesses from Google Maps...`);
        for (const business of mapsResults) {
          try {
            // Crear entrada directamente desde Google Maps
            const data: any = {
              name: business.name,
              website: business.website || null,
              email: null, // Google Maps no proporciona email directo
              phone: business.phone || null,
              contact_page: null,
              linkedin: null,
            };

            // Si tiene website, intentar scrapear para obtener email
            if (data.website) {
              console.log(`    🔍 Scraping website: ${data.website}`);
              try {
                await scraper.init();
                const scraped = await scraper.scrapeWebsite(data.website);
                if (scraped?.email) {
                  data.email = scraped.email;
                  console.log(`    ✓ Found email: ${scraped.email}`);
                }
                if (!data.phone && scraped?.phone) {
                  data.phone = scraped.phone;
                }
                await scraper.close();
              } catch (scrapeError) {
                console.error(`    ✗ Failed to scrape website:`, scrapeError);
              }
            }

            // Guardar si tenemos datos útiles
            if (data.email || data.phone || data.website) {
              await companyService.create(data);
              savedCount++;
              console.log(`    ✅ Saved from Maps: ${data.name} (email: ${!!data.email}, phone: ${!!data.phone})`);
            }

            await job.updateProgress((savedCount / totalCompanies) * 100);
          } catch (error) {
            console.error(`Failed to process Maps business:`, error);
          }
        }
        
        console.log(`\n📊 FINAL STATS:`);
        console.log(`   Web URLs found: ${urls.length}`);
        console.log(`   Google Maps businesses: ${mapsResults.length}`);
        console.log(`   Total sources: ${totalCompanies}`);
        console.log(`   Companies saved: ${savedCount}`);
        console.log(`   Success rate: ${((savedCount / totalCompanies) * 100).toFixed(1)}%`);
        
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
