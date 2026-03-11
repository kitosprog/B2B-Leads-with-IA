import { pool } from '../config/database';
import { Company, CreateCompanyData } from '../models/Company';

export class CompanyService {
  async create(data: CreateCompanyData): Promise<Company | null> {
    try {
      const result = await pool.query(
        `INSERT INTO companies (name, website, email, phone, contact_page, linkedin)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (website) DO UPDATE
         SET name = EXCLUDED.name,
             email = COALESCE(EXCLUDED.email, companies.email),
             phone = COALESCE(EXCLUDED.phone, companies.phone),
             contact_page = COALESCE(EXCLUDED.contact_page, companies.contact_page),
             linkedin = COALESCE(EXCLUDED.linkedin, companies.linkedin)
         RETURNING *`,
        [data.name, data.website, data.email, data.phone, data.contact_page, data.linkedin]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating company:', error);
      return null;
    }
  }

  async findAll(limit = 100, offset = 0): Promise<Company[]> {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  async findById(id: number): Promise<Company | null> {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM companies WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async count(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as count FROM companies');
    return parseInt(result.rows[0].count, 10);
  }
}
