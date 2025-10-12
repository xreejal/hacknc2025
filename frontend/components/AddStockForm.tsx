"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface AddStockFormProps {
  onAddStock: (ticker: string) => void;
}

export default function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [ticker, setTicker] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onAddStock(ticker.trim().toUpperCase());
      setTicker("");
    }
  };

  return (
    <div className="z-10 relative bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-6 mb-6">
      <h2 className="font-black text-xl text-white mb-4 tracking-tight">
        ADD <span className="text-gradient-purple">STOCK</span>
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter stock ticker (e.g., AAPL, TSLA)"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple/50 text-white placeholder:text-gray-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Track Stock
        </button>
      </form>
    </div>
  );
}
