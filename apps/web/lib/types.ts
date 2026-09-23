export type Company = {
  id: number;
  ticker: string;
  exchange: string;
  name: string;
  sector: string | null;
  industry: string | null;
  country: string | null;
  currency: string | null;
  website: string | null;
  description: string | null;
  created_by_id: number;
  created_at: string;
  updated_at: string;
};

