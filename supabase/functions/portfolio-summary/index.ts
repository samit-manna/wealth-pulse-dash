import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const holdings = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", quantity: 50, avgPrice: 2450, currentPrice: 2680.5, sector: "Energy", marketCap: "Large" },
  { symbol: "INFY", name: "Infosys Limited", quantity: 100, avgPrice: 1800, currentPrice: 2010.75, sector: "Technology", marketCap: "Large" },
  { symbol: "TCS", name: "Tata Consultancy Services", quantity: 75, avgPrice: 3200, currentPrice: 3450.25, sector: "Technology", marketCap: "Large" },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", quantity: 80, avgPrice: 1650, currentPrice: 1580.3, sector: "Banking", marketCap: "Large" },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", quantity: 60, avgPrice: 1100, currentPrice: 1235.8, sector: "Banking", marketCap: "Large" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", quantity: 120, avgPrice: 850, currentPrice: 920.45, sector: "Telecommunications", marketCap: "Large" },
  { symbol: "ITC", name: "ITC Limited", quantity: 200, avgPrice: 420, currentPrice: 465.2, sector: "Consumer Goods", marketCap: "Large" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Limited", quantity: 25, avgPrice: 6800, currentPrice: 7150.6, sector: "Financial Services", marketCap: "Large" },
  { symbol: "ASIANPAINT", name: "Asian Paints Limited", quantity: 40, avgPrice: 3100, currentPrice: 2890.75, sector: "Consumer Discretionary", marketCap: "Large" },
  { symbol: "MARUTI", name: "Maruti Suzuki India", quantity: 30, avgPrice: 9500, currentPrice: 10250.3, sector: "Automotive", marketCap: "Large" },
  { symbol: "WIPRO", name: "Wipro Limited", quantity: 150, avgPrice: 450, currentPrice: 485.6, sector: "Technology", marketCap: "Large" },
  { symbol: "TATAMOTORS", name: "Tata Motors Limited", quantity: 100, avgPrice: 650, currentPrice: 720.85, sector: "Automotive", marketCap: "Large" },
  { symbol: "TECHM", name: "Tech Mahindra Limited", quantity: 80, avgPrice: 1200, currentPrice: 1145.25, sector: "Technology", marketCap: "Large" },
  { symbol: "AXISBANK", name: "Axis Bank Limited", quantity: 90, avgPrice: 980, currentPrice: 1055.4, sector: "Banking", marketCap: "Large" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", quantity: 60, avgPrice: 1150, currentPrice: 1245.3, sector: "Healthcare", marketCap: "Large" },
];

function computeSummary() {
  const enriched = holdings.map((h) => {
    const invested = h.avgPrice * h.quantity;
    const value = h.currentPrice * h.quantity;
    const gain = value - invested;
    const gainPct = invested ? (gain / invested) * 100 : 0;
    return { ...h, invested, value, gain, gainPct };
  });

  const totalInvested = enriched.reduce((a, b) => a + b.invested, 0);
  const totalValue = enriched.reduce((a, b) => a + b.value, 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested ? (totalGainLoss / totalInvested) * 100 : 0;

  const sortedByPct = [...enriched].sort((a, b) => b.gainPct - a.gainPct);
  const top = sortedByPct[0];
  const worst = sortedByPct[sortedByPct.length - 1];

  // simple heuristics
  const sectorCount = new Set(enriched.map((e) => e.sector)).size;
  const diversificationScore = Math.min(10, +(sectorCount / 8 * 10).toFixed(1));
  const riskLevel = totalGainLossPercent > 15 ? "Moderate" : "Low";

  return {
    totalValue: +totalValue.toFixed(2),
    totalInvested: +totalInvested.toFixed(2),
    totalGainLoss: +totalGainLoss.toFixed(2),
    totalGainLossPercent: +totalGainLossPercent.toFixed(2),
    holdingsCount: enriched.length,
    topPerformer: { symbol: top.symbol, name: top.name, gainPercent: +top.gainPct.toFixed(2) },
    worstPerformer: { symbol: worst.symbol, name: worst.name, gainPercent: +worst.gainPct.toFixed(2) },
    diversificationScore,
    riskLevel,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const data = computeSummary();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "Failed to compute summary" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
