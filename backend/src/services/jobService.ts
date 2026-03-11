import { pool } from '../config/database';
import { ScrapeJob, CreateScrapeJobData, JobStatus } from '../models/ScrapeJob';

export class JobService {
  async create(data: CreateScrapeJobData): Promise<ScrapeJob> {
    const result = await pool.query(
      `INSERT INTO scrape_jobs (query, country, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.query, data.country || null, 'pending']
    );
    return result.rows[0];
  }

  async findAll(limit = 50): Promise<ScrapeJob[]> {
    const result = await pool.query(
      'SELECT * FROM scrape_jobs ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  async findById(id: number): Promise<ScrapeJob | null> {
    const result = await pool.query('SELECT * FROM scrape_jobs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateStatus(
    id: number,
    status: JobStatus,
    results_count?: number,
    error_message?: string
  ): Promise<void> {
    const updates: string[] = ['status = $2'];
    const params: any[] = [id, status];

    if (results_count !== undefined) {
      updates.push(`results_count = $${params.length + 1}`);
      params.push(results_count);
    }

    if (error_message !== undefined) {
      updates.push(`error_message = $${params.length + 1}`);
      params.push(error_message);
    }

    if (status === 'completed' || status === 'failed') {
      updates.push('completed_at = CURRENT_TIMESTAMP');
    }

    await pool.query(
      `UPDATE scrape_jobs SET ${updates.join(', ')} WHERE id = $1`,
      params
    );
  }
}
