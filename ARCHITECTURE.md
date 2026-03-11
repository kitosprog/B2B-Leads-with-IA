# Architecture Documentation

## System Overview

Company Scraper SaaS is a full-stack TypeScript application built with modern technologies for B2B lead generation through intelligent web scraping.

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Fastify (high-performance web framework)
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **Queue**: Redis + BullMQ
- **Scraping**: Playwright + Cheerio
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Project Structure

```
company-scraper-saas/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── routes.ts           # API endpoints
│   │   ├── config/
│   │   │   ├── index.ts            # Configuration management
│   │   │   └── database.ts         # PostgreSQL connection
│   │   ├── models/
│   │   │   ├── Company.ts          # Company data model
│   │   │   └── ScrapeJob.ts        # Job data model
│   │   ├── scrapers/
│   │   │   └── webScraper.ts       # Playwright scraping engine
│   │   ├── services/
│   │   │   ├── companyService.ts   # Company CRUD operations
│   │   │   ├── jobService.ts       # Job management
│   │   │   └── queueService.ts     # BullMQ worker
│   │   ├── utils/
│   │   │   ├── validators.ts       # Data validation
│   │   │   └── extractors.ts      # Email/phone extraction
│   │   └── index.ts                # Main server entry
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Dashboard page
│   │   ├── results/
│   │   │   └── page.tsx            # Results page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   └── Navigation.tsx          # Main navigation
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   └── utils.ts                # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   └── schema.sql                  # Database schema
│
└── scripts/
    ├── setup.sh                    # Linux/Mac setup script
    └── setup.bat                   # Windows setup script
```

## Data Flow

### Scraping Job Flow

1. **User submits query** → Frontend sends POST request to `/api/scrape`
2. **Job created** → Backend creates job record in PostgreSQL
3. **Queue job** → Job added to BullMQ queue
4. **Worker picks up** → Background worker processes job
5. **Scraping** → Playwright scrapes websites, extracts data
6. **Save results** → Companies saved to PostgreSQL
7. **Update status** → Job status updated to completed/failed
8. **Frontend polls** → Frontend polls job status every 2s
9. **Display results** → Results shown to user

### Data Extraction Pipeline

```
URL → Playwright → HTML → Extractors → Validators → Database
```

## API Endpoints

### POST /api/scrape
Start a new scraping job
- **Body**: `{ query: string, country?: string }`
- **Response**: `{ id: number, message: string }`

### GET /api/jobs
Get all scraping jobs
- **Response**: `{ jobs: ScrapeJob[] }`

### GET /api/jobs/:id
Get specific job
- **Response**: `{ job: ScrapeJob }`

### GET /api/results
Get scraped companies
- **Query**: `limit`, `offset`
- **Response**: `{ companies: Company[], total: number }`

### DELETE /api/results/:id
Delete a company
- **Response**: `{ message: string }`

## Database Schema

### companies
- `id`: Primary key
- `name`: Company name
- `website`: Company website (unique)
- `email`: Contact email
- `phone`: Contact phone
- `contact_page`: Contact page URL
- `linkedin`: LinkedIn profile
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### scrape_jobs
- `id`: Primary key
- `query`: Search query
- `country`: Target country
- `status`: pending | processing | completed | failed
- `results_count`: Number of companies found
- `error_message`: Error details if failed
- `created_at`: Creation timestamp
- `completed_at`: Completion timestamp

## Security Features

1. **Input Validation**: Zod schemas for all API inputs
2. **Rate Limiting**: Fastify rate-limit plugin
3. **CORS**: Configured for specific origins
4. **SQL Injection Prevention**: Parameterized queries
5. **XSS Prevention**: React automatic escaping
6. **Environment Variables**: Secrets stored in .env

## Scraping Strategy

### Email Extraction
- Regex pattern matching
- Business email filtering (excludes gmail, hotmail, etc.)
- Validation with proper email regex
- Maximum 5 emails per company

### Phone Extraction
- Multiple phone pattern matching
- Country-specific validation
- Normalization (remove spaces, dashes)
- International format output

### Contact Page Discovery
- Keyword-based detection
- Common contact page patterns
- Follow contact links if main page has no data

## Performance Optimizations

1. **Concurrent Scraping**: 3 parallel jobs (configurable)
2. **Database Indexing**: Indexes on email, website, dates
3. **Connection Pooling**: PostgreSQL connection pool
4. **Rate Limiting**: Delays between requests
5. **Caching**: Redis for job queue
6. **Lazy Loading**: Frontend pagination

## Error Handling

- Try-catch blocks throughout
- Graceful failures in scraping
- Job retry mechanism
- Error logging
- User-friendly error messages

## Monitoring & Logging

- Pino logger with pretty printing
- Job status tracking
- Database query logging
- Error tracking
- Performance metrics

## Scalability Considerations

- Horizontal scaling: Add more worker instances
- Database replication: Read replicas
- Redis cluster: Distributed queue
- CDN: Static asset delivery
- Load balancer: Multiple backend instances

## Legal Compliance

- Only public data
- robots.txt respect (configurable)
- Rate limiting
- Business data only (no personal data)
- GDPR compliant data handling
