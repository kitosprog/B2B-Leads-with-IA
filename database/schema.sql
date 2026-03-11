-- Company Scraper SaaS Database Schema

-- Drop existing tables
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS scrape_jobs CASCADE;

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(500) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(50),
  contact_page VARCHAR(500),
  linkedin VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scrape jobs table
CREATE TABLE scrape_jobs (
  id SERIAL PRIMARY KEY,
  query VARCHAR(500) NOT NULL,
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  results_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_website ON companies(website);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX idx_scrape_jobs_status ON scrape_jobs(status);
CREATE INDEX idx_scrape_jobs_created_at ON scrape_jobs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at 
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
