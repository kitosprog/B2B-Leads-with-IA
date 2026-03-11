export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ScrapeJob {
  id: number;
  query: string;
  country: string | null;
  status: JobStatus;
  results_count: number;
  error_message: string | null;
  created_at: Date;
  completed_at: Date | null;
}

export interface CreateScrapeJobData {
  query: string;
  country?: string;
}
