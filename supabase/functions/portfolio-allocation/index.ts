import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Keep in sync with holdings function for consistency
const sectorMap: Record<string, string> = {
  RELIANCE: "Energy",
  INFY: "Technology",
  TCS: "Technology",
  HDFCBANK: "Banking",
  ICICIBANK: "Banking",
  BHARTIARTL: "Telecommunications",
  ITC: "Consumer Goods",
  BAJFINANCE: "Financial Services",
  ASIANPAINT: "Consumer Discretionary",
  MARUTI: "Automotive",
  WIPRO: "Technology",
  TATAMOTORS: "Automotive",
  TECHM: "Technology",
  AXISBANK: "Banking",
  SUNPHARMA: "Healthcare",
};

const prices: Record<string, { qty: number; avg: number; cur: number; cap: "Large" | "Mid" | "Small" }> = {
  RELIANCE: { qty: 50, avg: 2450, cur: 2680.5, cap: "Large" },
  INFY: { qty: 100, avg: 1800, cur: 2010.75, cap: "Large" },
  TCS: { qty: 75, avg: 3200, cur: 3450.25, cap: "Large" },
  HDFCBANK: { qty: 80, avg: 1650, cur: 1580.3, cap: "Large" },
  ICICIBANK: { qty: 60, avg: 1100, cur: 1235.8, cap: "Large" },
  BHARTIARTL: { qty: 120, avg: 850, cur: 920.45, cap: "Large" },
  ITC: { qty: 200, avg: 420, cur: 465.2, cap: "Large" },
  BAJFINANCE: { qty: 25, avg: 6800, cur: 7150.6, cap: "Large" },
  ASIANPAINT: { qty: 40, avg: 3100, cur: 2890.75, cap: "Large" },
  MARUTI: { qty: 30, avg: 9500, cur: 10250.3, cap: "Large" },
  WIPRO: { qty: 150, avg: 450, cur: 485.6, cap: "Large" },
  TATAMOTORS: { qty: 100, avg: 650, cur: 720.85, cap: "Large" },
  TECHM: { qty: 80, avg: 1200, cur: 1145.25, cap: "Large" },
  AXISBANK: { qty: 90, avg: 980, cur: 1055.4, cap: "Large" },
  SUNPHARMA: { qty: 60, avg: 1150, cur: 1245.3, cap: "Large" },
};

function calcTotals() {
  const entries = Object.entries(prices).map(([sym, v]) => ({ sym, ...v }));
  const totals = entries.map((e) => ({ value: e.cur * e.qty, sector: sectorMap[e.sym], cap: e.cap }));
  const totalValue = totals.reduce((a, b) => a + b.value, 0);

  const bySector: Record<string, { value: number; percentage: number; count: number }> = {};
  const byMarketCap: Record<string, { value: number; percentage: number; count: number }> = {};

  totals.forEach((t) => {
    bySector[t.sector] ||= { value: 0, percentage: 0, count: 0 };
    bySector[t.sector].value += t.value;
    bySector[t.sector].count += 1;

    byMarketCap[t.cap] ||= { value: 0, percentage: 0, count: 0 };
    byMarketCap[t.cap].value += t.value;
    byMarketCap[t.cap].count += 1;
  });

  for (const k in bySector) bySector[k].percentage = +((bySector[k].value / totalValue) * 100).toFixed(2);
  for (const k in byMarketCap) byMarketCap[k].percentage = +((byMarketCap[k].value / totalValue) * 100).toFixed(2);

  return { bySector, byMarketCap };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const data = calcTotals();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to compute allocation" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
