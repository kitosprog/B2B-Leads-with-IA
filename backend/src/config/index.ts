import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/company_scraper',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  api: {
    rateLimit: parseInt(process.env.API_RATE_LIMIT || '100', 10),
    rateLimitWindow: parseInt(process.env.API_RATE_LIMIT_WINDOW || '60000', 10),
  },
  
  scraping: {
    concurrency: parseInt(process.env.SCRAPING_CONCURRENCY || '3', 10),
    timeout: parseInt(process.env.SCRAPING_TIMEOUT || '30000', 10),
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
};
