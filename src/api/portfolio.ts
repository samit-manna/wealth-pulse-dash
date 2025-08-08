// Types and API helpers for portfolio endpoints (Supabase Edge functions)
export type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: 'Large' | 'Mid' | 'Small';
  value: number;
  gainLoss: number;
  gainLossPercent: number;
};

export type Allocation = {
  bySector: Record<string, { value: number; percentage: number; count?: number }>;
  byMarketCap: Record<string, { value: number; percentage: number; count?: number }>;
};

export type Performance = {
  timeline: { date: string; portfolio: number; nifty50: number; gold: number }[];
  returns: {
    portfolio: { '1month': number; '3months': number; '1year': number };
    nifty50: { '1month': number; '3months': number; '1year': number };
    gold: { '1month': number; '3months': number; '1year': number };
  };
};

export type Summary = {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdingsCount: number;
  topPerformer: { symbol: string; name: string; gainPercent: number };
  worstPerformer: { symbol: string; name: string; gainPercent: number };
  diversificationScore: number;
  riskLevel: string;
};

const base = import.meta.env.VITE_SUPABASE_URL as string;
const baseUrl = `${base}/functions/v1`;

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const PortfolioAPI = {
  holdings: () => getJSON<Holding[]>(`/portfolio-holdings`),
  allocation: () => getJSON<Allocation>(`/portfolio-allocation`),
  performance: () => getJSON<Performance>(`/portfolio-performance`),
  summary: () => getJSON<Summary>(`/portfolio-summary`),
};
