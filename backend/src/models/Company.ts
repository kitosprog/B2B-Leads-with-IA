export interface Company {
  id: number;
  name: string;
  website: string;
  email: string | null;
  phone: string | null;
  contact_page: string | null;
  linkedin: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCompanyData {
  name: string;
  website: string;
  email?: string;
  phone?: string;
  contact_page?: string;
  linkedin?: string;
}
