"use client";

import { useState, useEffect } from "react";
import { getChartData } from "@/lib/api";
import type { ChartData } from "@/lib/api";
import { TrendingUp, TrendingDown, X, BarChart3 } from "lucide-react";

interface PriceChartProps {
  ticker: string;
  period: string;
  onClose: () => void;
}

export default function PriceChart({ ticker, period, onClose }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChartData(ticker, period);
        setChartData(data);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
        if (err.response?.status === 404) {
          setError(`No chart data found for ${ticker}`);
        } else if (err.response?.status === 500) {
          setError("Server error while fetching chart data. Please try again later.");
        } else {
          setError("Failed to fetch chart data. Please check your connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [ticker, period]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (period === "1d") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (period === "1w") {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "1d": return "1 DAY";
      case "1w": return "1 WEEK";
      case "1m": return "1 MONTH";
      default: return period.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-8 max-w-4xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chartData || chartData.data.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-black text-xl text-white mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error || "No chart data available"}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate price range for scaling
  const prices = chartData.data.map(point => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1; // 10% padding

  // Calculate price change
  const firstPrice = chartData.data[0].price;
  const lastPrice = chartData.data[chartData.data.length - 1].price;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple" />
            <div>
              <h2 className="font-black text-3xl text-white tracking-tight">{ticker}</h2>
              <p className="text-gray-400">{getPeriodLabel()} CHART</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Price Summary */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-black text-white">
                {formatPrice(lastPrice)}
              </div>
              <div className="text-sm text-gray-400">
                {chartData.data.length} data points
              </div>
            </div>
            <div className={`flex items-center gap-2 text-xl font-mono ${
              isPositive ? "text-chartGreen" : "text-chartRed"
            }`}>
              {isPositive ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
              <span>{isPositive ? "+" : ""}{formatPrice(priceChange)}</span>
              <span>({isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
          <div className="h-80 relative">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 300"
              className="overflow-visible"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Price line */}
              <polyline
                fill="none"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth="2"
                points={chartData.data.map((point, index) => {
                  const x = (index / (chartData.data.length - 1)) * 800;
                  const y = 300 - ((point.price - (minPrice - padding)) / (priceRange + 2 * padding)) * 300;
                  return `${x},${y}`;
                }).join(" ")}
              />

              {/* Data points */}
              {chartData.data.map((point, index) => {
                const x = (index / (chartData.data.length - 1)) * 800;
                const y = 300 - ((point.price - (minPrice - padding)) / (priceRange + 2 * padding)) * 300;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill={isPositive ? "#10B981" : "#EF4444"}
                    className="hover:r-3 transition-all cursor-pointer"
                  />
                );
              })}

              {/* Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const price = minPrice - padding + (priceRange + 2 * padding) * (1 - ratio);
                const y = 300 * ratio;
                return (
                  <g key={ratio}>
                    <line x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text
                      x="10"
                      y={y + 4}
                      fill="rgba(255,255,255,0.6)"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      {formatPrice(price)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Data Table */}
        <div className="max-h-48 overflow-y-auto">
          <h3 className="font-black text-lg text-white mb-4">PRICE HISTORY</h3>
          <div className="space-y-2">
            {chartData.data.slice(-10).reverse().map((point, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="font-mono text-sm text-gray-400">
                  {formatDate(point.date)}
                </div>
                <div className="font-mono font-bold text-white">
                  {formatPrice(point.price)}
                </div>
                <div className="font-mono text-xs text-gray-500">
                  Vol: {point.volume.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
