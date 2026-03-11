# Company Scraper SaaS

A professional-grade SaaS application for B2B lead generation through intelligent web scraping. Extract company contact information (emails, phone numbers) from publicly available sources.

## 🚀 Features

- 🔍 **Deep Search Mode** - Multi-engine parallel search (Google + Bing + DuckDuckGo)
- 🕷️ **Deep Crawling** - Explores up to 8 pages per website (contact, about, team, etc.)
- 📧 **Advanced Extraction** - Finds emails and phones even when obfuscated
- 🌐 **Multi-Source Search** - Searches in text, HTML, mailto:, tel:, data-attributes, and HTML comments
- ✨ **Clean, Professional UI** - Minimalist design inspired by Stripe and Linear
- 📊 **Real-time Job Tracking** - Monitor scraping progress in real-time
- 💾 **PostgreSQL Database** - Reliable data persistence with indexes
- 🚦 **Background Jobs** - BullMQ for scalable job processing
- 📤 **CSV Export** - Easy data export for your CRM
- 🎨 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **TypeScript** - Type-safe code across the entire stack

## 📸 Screenshots

### Dashboard
Clean, professional interface for starting scraping jobs

### Results
Table view with copy-to-clipboard and export functionality

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons

**Backend:**
- Node.js + Fastify
- TypeScript
- PostgreSQL
- Redis + BullMQ
- Playwright
- Zod validation

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd company-scraper-saas
```

### 2. Install dependencies

**Windows:**
```bash
scripts\setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Set up environment variables

**Backend (.env):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/company_scraper
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Set up the database

```bash
# Create database
createdb company_scraper

# Run schema
psql -U postgres -d company_scraper -f database/schema.sql
```

### 5. Start Redis

```bash
redis-server
```

### 6. Start the development servers

**Option 1: Both at once (from root)**
```bash
npm run dev
```

**Option 2: Separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 7. Open the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📖 Usage

### Starting a Scraping Job

1. Go to the Dashboard
2. Enter a search query (e.g., "restaurants Madrid")
3. Optionally add a country
4. Click "Start Scraping"
5. Monitor job progress in real-time

### Viewing Results

1. Navigate to "Results" page
2. View all scraped companies in a table
3. Copy emails/phones with one click
4. Export to CSV for use in your CRM
5. Delete unwanted entries

### API Usage

You can also use the API directly:

```typescript
// Start a scraping job
POST http://localhost:4000/api/scrape
{
  "query": "tech companies Barcelona",
  "country": "Spain"
}

// Get all jobs
GET http://localhost:4000/api/jobs

// Get results
GET http://localhost:4000/api/results?limit=100&offset=0

// Delete a company
DELETE http://localhost:4000/api/results/:id
```

## 🏗️ Project Structure

```
company-scraper-saas/
├── backend/           # Fastify API + scraping engine
├── frontend/          # Next.js application
├── database/          # SQL schema
└── scripts/           # Setup scripts
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

Quick options:
- **Frontend**: Deploy to Vercel (recommended)
- **Backend**: Deploy to Railway, Render, or DigitalOcean
- **Database**: Use Supabase, Railway, or managed PostgreSQL
- **Redis**: Use Upstash or managed Redis

## 🔒 Security & Legal

### Data Collection
- Only scrapes **publicly available** business information
- Respects robots.txt (configurable)
- Implements rate limiting
- Filters out personal emails (gmail, hotmail, etc.)

### Security Features
- Input validation with Zod
- Rate limiting on API endpoints
- CORS protection
- SQL injection prevention
- Environment variable protection

### Legal Compliance
This tool is designed for legitimate B2B lead generation. Users are responsible for:
- Complying with local data protection laws
- Respecting website terms of service
- Using data for legitimate business purposes only
- Implementing opt-out mechanisms

## 🛠️ Development

### Code Quality

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📊 Performance

- Concurrent scraping (configurable)
- Database connection pooling
- Redis-backed job queue
- Optimized queries with indexes
- Client-side pagination

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary software. See LICENSE file for details.

## 💬 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: your-email@example.com

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Fastify](https://www.fastify.io/)
- [Playwright](https://playwright.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📈 Roadmap

- [ ] Email verification (SMTP check)
- [ ] Social media link extraction
- [ ] Bulk scraping from CSV
- [ ] Webhook notifications
- [ ] API rate limiting by user
- [ ] Advanced filtering
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Multi-language support

---

**Made with ❤️ for B2B lead generation**
