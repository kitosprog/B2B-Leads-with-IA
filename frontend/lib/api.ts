const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Company {
  id: number;
  name: string;
  website: string;
  email: string | null;
  phone: string | null;
  contact_page: string | null;
  linkedin: string | null;
  created_at: string;
}

export interface ScrapeJob {
  id: number;
  query: string;
  country: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results_count: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export async function startScrape(query: string, country?: string): Promise<{ id: number }> {
  const response = await fetch(`${API_URL}/api/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, country }),
  });

  if (!response.ok) {
    throw new Error('Failed to start scrape');
  }

  return response.json();
}

export async function getJobs(): Promise<{ jobs: ScrapeJob[] }> {
  const response = await fetch(`${API_URL}/api/jobs`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
}

export async function getJob(id: number): Promise<{ job: ScrapeJob }> {
  const response = await fetch(`${API_URL}/api/jobs/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }

  return response.json();
}

export async function getResults(
  limit = 100,
  offset = 0
): Promise<{ companies: Company[]; total: number }> {
  const response = await fetch(`${API_URL}/api/results?limit=${limit}&offset=${offset}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }

  return response.json();
}

export async function deleteCompany(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/results/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete company');
  }
}
