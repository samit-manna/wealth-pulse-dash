import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Monthly timeline based on provided sheet
const timeline = [
  { date: "2024-01-01", portfolio: 1500000, nifty50: 21000, gold: 62000 },
  { date: "2024-02-01", portfolio: 1520000, nifty50: 21300, gold: 61800 },
  { date: "2024-03-01", portfolio: 1540000, nifty50: 22100, gold: 64500 },
  { date: "2024-04-01", portfolio: 1580000, nifty50: 22800, gold: 66200 },
  { date: "2024-05-01", portfolio: 1620000, nifty50: 23200, gold: 68000 },
  { date: "2024-06-01", portfolio: 1650000, nifty50: 23500, gold: 68500 },
  { date: "2024-07-01", portfolio: 1680000, nifty50: 24100, gold: 69800 },
  { date: "2024-08-01", portfolio: 1720000, nifty50: 24800, gold: 70200 },
  { date: "2024-09-01", portfolio: 1750000, nifty50: 25200, gold: 71500 },
  { date: "2024-10-01", portfolio: 1780000, nifty50: 25600, gold: 72800 },
  { date: "2024-11-01", portfolio: 1820000, nifty50: 26100, gold: 74000 },
  { date: "2024-12-01", portfolio: 1850000, nifty50: 26500, gold: 75200 },
];

function pct(series: number[]) {
  const start = series[0];
  const last = series[series.length - 1];
  const oneMonth = (last - series[series.length - 2]) / series[series.length - 2] * 100;
  const threeMonths = (last - series[series.length - 4]) / series[series.length - 4] * 100;
  const oneYear = (last - start) / start * 100;
  return { "1month": +oneMonth.toFixed(2), "3months": +threeMonths.toFixed(2), "1year": +oneYear.toFixed(2) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const portfolioSeries = timeline.map((t) => t.portfolio);
    const niftySeries = timeline.map((t) => t.nifty50);
    const goldSeries = timeline.map((t) => t.gold);

    const returns = {
      portfolio: pct(portfolioSeries),
      nifty50: pct(niftySeries),
      gold: pct(goldSeries),
    };

    return new Response(JSON.stringify({ timeline, returns }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "Failed to compute performance" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
