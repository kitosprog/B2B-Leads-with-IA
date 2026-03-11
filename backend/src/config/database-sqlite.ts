import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'companies.db');

export const db = new Database(dbPath);

// Crear tablas si no existen
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      website TEXT UNIQUE NOT NULL,
      email TEXT,
      phone TEXT,
      contact_page TEXT,
      linkedin TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scrape_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      country TEXT,
      status TEXT DEFAULT 'pending',
      results_count INTEGER DEFAULT 0,
      error_message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
    CREATE INDEX IF NOT EXISTS idx_companies_website ON companies(website);
    CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON scrape_jobs(status);
  `);

  console.log('✅ SQLite database initialized');
}

export async function testConnection() {
  try {
    db.prepare('SELECT 1').get();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
