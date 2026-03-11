# Deployment Guide

## Production Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Domain name (optional)

### Backend Deployment

1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   REDIS_HOST=your-redis-host
   REDIS_PORT=6379
   PORT=4000
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
4. Deploy

#### Option 2: Self-hosted

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

### Database Setup

1. **Create production database:**
   ```bash
   createdb company_scraper_production
   ```

2. **Run migrations:**
   ```bash
   psql -U postgres -d company_scraper_production -f database/schema.sql
   ```

### Redis Setup

Ensure Redis is running:
```bash
redis-server
```

### Process Management

Use PM2 for production process management:

```bash
npm install -g pm2

# Start backend
cd backend
pm2 start dist/index.js --name company-scraper-api

# Start frontend
cd frontend
pm2 start npm --name company-scraper-web -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Setup

Use Certbot for free SSL certificates:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Monitoring

Set up monitoring with:
- **Logs**: Use PM2 logs or winston
- **Errors**: Sentry for error tracking
- **Performance**: New Relic or Datadog

### Security Checklist

- [ ] Enable HTTPS
- [ ] Set strong database passwords
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your domain
- [ ] Keep dependencies updated

### Backup Strategy

1. **Database backups:**
   ```bash
   pg_dump company_scraper_production > backup_$(date +%Y%m%d).sql
   ```

2. **Automated backups:**
   Set up cron job:
   ```cron
   0 2 * * * /path/to/backup-script.sh
   ```

### Scaling

- Use Redis Cluster for queue scaling
- Add read replicas for PostgreSQL
- Use load balancer for multiple backend instances
- Consider CDN for static assets
